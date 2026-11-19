// ============================================================
// api.js — Faz o app funcionar fora do Apps Script:
// substitui `google.script.run` por chamadas fetch ao Worker da
// Cloudflare, que repassa para o Apps Script (doPost em Codigo.gs).
// Os outros arquivos continuam chamando google.script.run normalmente.
// ============================================================

// >>> URL do Worker desta consulta (veja worker/worker.js e o README) <<<
// NÃO usar o Worker do programa interno: aquele aponta para o Apps Script com preços.
const API_URL = 'https://ad-export-consulta-cliente.felippe-6c1.workers.dev';

async function _rpcCallOnce(fn, args) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn, args }),
      signal: controller.signal
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const env = await resp.json();
    if (!env.ok) throw new Error(env.error || 'Erro no servidor');
    return env.result; // string bruta, igual ao que a função do Apps Script retorna
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Tempo esgotado (sem internet ou servidor lento)');
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

// As duas funções do servidor só leem dados, então é seguro repetir:
// tenta até 3 vezes antes de desistir (o Apps Script às vezes falha à toa).
async function _rpcCall(fn, args) {
  let ultimoErro;
  for (let i = 0; i < 3; i++) {
    try {
      return await _rpcCallOnce(fn, args);
    } catch (e) {
      ultimoErro = e;
      if (i < 2) await new Promise((res) => setTimeout(res, 600 * (i + 1)));
    }
  }
  throw ultimoErro;
}

// Mesma API do Apps Script: google.script.run.withSuccessHandler(..).withFailureHandler(..).funcao(args)
function _makeRunner(successCb, failureCb) {
  return new Proxy({}, {
    get(_target, prop) {
      if (prop === 'withSuccessHandler') return (cb) => _makeRunner(cb, failureCb);
      if (prop === 'withFailureHandler') return (cb) => _makeRunner(successCb, cb);
      return (...args) => {
        _rpcCall(prop, args)
          .then((raw) => { successCb && successCb(raw); })
          .catch((e) => { failureCb && failureCb({ message: e.message }); });
      };
    }
  });
}

window.google = { script: { run: _makeRunner(null, null) } };
