// ============================================================
// Cloudflare Worker — Consulta de Produtos (versão cliente)
// Recebe as chamadas do site no GitHub Pages e repassa para o
// Apps Script desta consulta (doPost em apps-script/Codigo.gs).
// Cole este arquivo no editor do Worker (Cloudflare > Workers).
// ============================================================

// URL do Web App da CONSULTA CLIENTE (Implantar > Gerenciar implantações), terminando em /exec.
// NÃO usar a URL do programa interno (aquele tem preços).
const APPS_SCRIPT_URL = 'COLE_AQUI_A_URL_DO_WEB_APP_/exec';

// Só o site publicado pode chamar
const ORIGEM_PERMITIDA = 'https://felippeadexport.github.io';

const CORS = {
  'Access-Control-Allow-Origin': ORIGEM_PERMITIDA,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin'
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (request.method !== 'POST' || request.headers.get('Origin') !== ORIGEM_PERMITIDA) {
      return new Response('Proibido', { status: 403, headers: CORS });
    }
    const resp = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: await request.text(),
      redirect: 'follow'
    });
    return new Response(await resp.text(), {
      status: resp.status,
      headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
