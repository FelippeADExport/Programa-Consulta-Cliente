// ============================================================
// UTILITÁRIOS usados em todo o app
// ============================================================

// Escapa texto para inserir com segurança dentro de HTML
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// localStorage pode estar bloqueado (aba anônima etc.): nunca deixa quebrar o app
function _getSaved(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function _setSaved(k,v){try{localStorage.setItem(k,v);}catch(e){}}

function showToast(msg,type){const el=document.getElementById('toast');el.textContent=msg;el.className='toast show '+(type||'');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),type==='error'?8000:2500);}
