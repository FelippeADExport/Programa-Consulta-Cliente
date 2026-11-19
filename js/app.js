// ============================================================
// APP: estado global, tema e carregamento dos produtos
// ============================================================
let PRODUCTS=[], CURRENT=null;

// TEMA (aplicado já no <head>; aqui só troca e atualiza o botão)
function getTheme(){return _getSaved('adcliente_theme')||'dark';}
function applyTheme(th){
  document.documentElement.setAttribute('data-theme',th==='light'?'light':'');
  _setSaved('adcliente_theme',th);
  updateThemeLabel();
}
// Ícone e dica mostram o tema para o qual o botão vai trocar
function updateThemeLabel(){
  const light=getTheme()==='light';
  const dica=light?t('dark'):t('light');
  document.getElementById('themeIcon').textContent=light?'🌙':'☀️';
  const tb=document.getElementById('themeToggle');tb.title=dica;tb.setAttribute('aria-label',dica);
}
function toggleTheme(){applyTheme(getTheme()==='light'?'dark':'light');}

// DADOS (planilha, via api.js)
function loadProducts(){
  return new Promise((res,rej)=>{
    google.script.run
      .withSuccessHandler(r=>{
        const d=JSON.parse(r);
        if(!d.success) return rej(d.error);
        PRODUCTS=d.data.map(p=>({...p,formato:(p.formato||'').trim(),nome:(p.nome||'').trim(),codigo:(p.codigo||'').trim()}));
        res();
      })
      .withFailureHandler(e=>rej(e.message))
      .getProdutosCliente();
  });
}

function refreshProdutos(){
  const btn=document.getElementById('btnRefresh');
  btn.disabled=true;btn.classList.add('girando');
  loadProducts().then(()=>{
    if(CURRENT) CURRENT=PRODUCTS.find(x=>x.codigo===CURRENT.codigo)||null;
    applyLang();
    showToast(t('updated'));
  }).catch(e=>showToast(t('loadError')+' '+e,'error'))
    .finally(()=>{btn.disabled=false;btn.classList.remove('girando');});
}

// INÍCIO
window.onload=function(){
  applyTheme(getTheme());
  document.getElementById('loaderMsg').textContent=t('loading');
  loadProducts().then(()=>{
    document.getElementById('loader').style.display='none';
    document.getElementById('app').style.display='block';
    applyLang();
  }).catch(e=>{
    document.getElementById('loader').innerHTML='<div class="loader-erro">'+esc(t('loadError'))+'<br><small>'+esc(e)+'</small></div>';
  });
};
