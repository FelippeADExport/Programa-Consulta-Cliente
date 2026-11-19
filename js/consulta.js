// ============================================================
// CONSULTA: filtros (formato / produto / código), ficha do
// produto, packing list e legenda de local de uso
// ============================================================
function cnsInit(){
  const sel=document.getElementById('cns-formato');
  const formatos=[...new Set(PRODUCTS.map(p=>p.formato).filter(Boolean))].sort();
  sel.innerHTML='<option value="">'+esc(t('selecione'))+'</option>'+formatos.map(f=>'<option value="'+esc(f)+'">'+esc(f)+'</option>').join('');
  const n=document.getElementById('cns-nome');
  n.disabled=true;
  n.innerHTML='<option value="">'+esc(t('selFormatoPrimeiro'))+'</option>';
}

function fillNomes(f){
  const s=document.getElementById('cns-nome');
  s.disabled=!f;
  if(!f){s.innerHTML='<option value="">'+esc(t('selFormatoPrimeiro'))+'</option>';return;}
  s.innerHTML='<option value="">'+esc(t('selNome'))+'</option>'+
    PRODUCTS.filter(p=>p.formato===f).map(p=>'<option value="'+esc(p.codigo)+'">'+esc(p.nome||p.codigo)+'</option>').join('');
}

function cnsOnFormatoChange(){
  const f=document.getElementById('cns-formato').value;
  fillNomes(f);
  cnsClearResult();
}

function cnsOnNomeChange(){
  const c=document.getElementById('cns-nome').value;
  if(!c){cnsClearResult();return;}
  const p=PRODUCTS.find(x=>x.codigo===c);if(!p)return;
  document.getElementById('cns-codigo').value=p.codigo;
  cnsShowProduto(p);
}

function cnsOnCodigoInput(){
  const v=document.getElementById('cns-codigo').value.trim().toLowerCase();
  const dd=document.getElementById('cns-codigo-dd');
  if(!v){dd.classList.add('hidden');return;}
  const m=PRODUCTS.filter(p=>p.codigo.toLowerCase().includes(v)||p.nome.toLowerCase().includes(v)).slice(0,10);
  if(!m.length){dd.classList.add('hidden');return;}
  dd.innerHTML=m.map(p=>'<div class="autocomplete-item" data-cod="'+esc(p.codigo)+'"><strong>'+esc(p.codigo)+' - '+esc(p.nome)+'</strong><small>'+esc(p.formato)+'</small></div>').join('');
  dd.classList.remove('hidden');
}

// Seleção no autocomplete (mouse e toque)
document.addEventListener('DOMContentLoaded',()=>{
  const dd=document.getElementById('cns-codigo-dd');
  const pick=e=>{const it=e.target.closest('.autocomplete-item');if(it){e.preventDefault();cnsSelectByCodigo(it.dataset.cod);}};
  dd.addEventListener('mousedown',pick);
  dd.addEventListener('touchstart',pick,{passive:false});
});
['mousedown','touchstart'].forEach(ev=>document.addEventListener(ev,e=>{
  const dd=document.getElementById('cns-codigo-dd'),inp=document.getElementById('cns-codigo');
  if(dd&&inp&&!dd.contains(e.target)&&e.target!==inp) dd.classList.add('hidden');
},{passive:true}));

function cnsSelectByCodigo(codigo){
  const p=PRODUCTS.find(x=>x.codigo===codigo);if(!p)return;
  document.getElementById('cns-codigo-dd').classList.add('hidden');
  document.getElementById('cns-codigo').value=p.codigo;
  document.getElementById('cns-formato').value=p.formato;
  fillNomes(p.formato);
  document.getElementById('cns-nome').value=p.codigo;
  cnsShowProduto(p);
}

function cnsClearResult(){
  CURRENT=null;
  document.getElementById('cns-resultado').classList.add('hidden');
  document.getElementById('cns-empty').style.display='';
  document.getElementById('cns-codigo').value='';
  document.getElementById('cns-thumbs').innerHTML='';
}

function val(v){return(v===undefined||v===null||v===''||v===0)?'—':String(v);}

// ============================================================
// PACKING — aceita valores duplos "28 / 56" e formata cada parte
// ============================================================
function numParse(s){
  s=String(s).trim();
  if(s.indexOf(',')>=0) s=s.replace(/\./g,'').replace(',','.');
  if(!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return parseFloat(s);
}
// dec=true → 2 casas decimais; dec=false → inteiro
function fmtMulti(raw,dec,unit){
  const s=String(raw==null?'':raw).trim();
  if(!s||s==='0') return '—';
  const opt=dec?{minimumFractionDigits:2,maximumFractionDigits:2}:{maximumFractionDigits:0};
  const out=s.split('/').map(x=>x.trim()).filter(Boolean).map(x=>{
    const v=numParse(x);
    return v===null?x:v.toLocaleString(LOCALE[LANG],opt);
  }).join(' / ');
  return out+(unit?' '+unit:'');
}
function temValor(v){const s=String(v||'').trim();return !!s&&s!=='0';}

const PACK_TABS=[{k:'am',lbl:'palAm'},{k:'eu',lbl:'palEu'},{k:'exw',lbl:'palExw'}];
let PACK_TAB='am';

function hasPack(d){
  return !!d&&['cx_pecas','cx_sqmt','pal_caixas','con_pallets','medidas'].some(k=>temValor(d[k]));
}

function packHtml(d,tab){
  const row=(l,v,cls)=>'<div class="cns-pack-row'+(cls?' '+cls:'')+'"><span>'+esc(l)+'</span><span>'+esc(v)+'</span></div>';
  const cam=(d.camadas||[]).filter(c=>temValor(c.v))
    .map(c=>row(c.l?t('camadas')+' ('+t(c.l)+')':t('camadas'),fmtMulti(c.v,false))).join('');
  const med=String(d.medidas||'').trim();
  const medHtml=med?row(t('medidas'),med.split('/').map(x=>x.trim()).filter(Boolean).join('\n'),'med'):'';
  const tit3=tab==='exw'?t('caminhao'):t('container');
  return ''+
  '<div class="cns-pack-card"><h4>'+esc(t('caixa'))+'</h4>'+
    row(t('pecas'),fmtMulti(d.cx_pecas,false))+row('m²',fmtMulti(d.cx_sqmt,true,'m²'))+row(t('peso'),fmtMulti(d.cx_peso,true,'kg'))+'</div>'+
  '<div class="cns-pack-card"><h4>'+esc(t('pallet'))+'</h4>'+
    row(t('caixas'),fmtMulti(d.pal_caixas,false))+row('m²',fmtMulti(d.pal_sqmt,true,'m²'))+row(t('peso'),fmtMulti(d.pal_peso,true,'kg'))+
    cam+medHtml+'</div>'+
  '<div class="cns-pack-card"><h4>'+esc(tit3)+'</h4>'+
    row(t('caixas'),fmtMulti(d.con_caixas,false))+row(t('pallets'),fmtMulti(d.con_pallets,false))+row('m²',fmtMulti(d.con_sqmt,true,'m²'))+row(t('peso'),fmtMulti(d.con_peso,true,'kg'))+'</div>';
}

function renderPack(p){
  const pack=p.pack||{};
  const avail=PACK_TABS.filter(x=>hasPack(pack[x.k]));
  const wrap=document.getElementById('pack-wrap');
  wrap.classList.toggle('hidden',!avail.length);
  if(!avail.length) return;
  if(!avail.some(x=>x.k===PACK_TAB)) PACK_TAB=avail[0].k;
  document.getElementById('pack-tabs').innerHTML=avail.map(x=>
    '<button class="cns-pack-tab'+(x.k===PACK_TAB?' active':'')+'" onclick="setPackTab(\''+x.k+'\')">'+esc(t(x.lbl))+'</button>').join('');
  document.getElementById('pack-box').innerHTML=packHtml(pack[PACK_TAB],PACK_TAB);
}
function setPackTab(k){PACK_TAB=k;if(CURRENT) renderPack(CURRENT);}

function cnsShowProduto(p){
  CURRENT=p;
  document.getElementById('cns-empty').style.display='none';
  document.getElementById('cns-resultado').classList.remove('hidden');

  // Fotos
  FOTO_COL=[];
  FOTOS=[p.imagem,p.imagem2,p.imagem3].filter((u,i)=>{if(u)FOTO_COL.push(i+1);return !!u;});
  document.getElementById('btnDl').classList.toggle('hidden',!FOTOS.length);
  FOTO_IDX=0;
  const th=document.getElementById('cns-thumbs');
  th.innerHTML='';
  FOTOS.forEach((url,i)=>{
    const w=document.createElement('div');
    w.className='cns-thumb'+(i===0?' active':'');
    w.onclick=()=>setFoto(i);
    const im=document.createElement('img');
    im.onerror=function(){if(!fotoFallback(this)) w.textContent=t('semFoto');};
    loadImg(im,url);
    w.appendChild(im);th.appendChild(w);
  });
  if(FOTOS.length) setFoto(0);
  else{document.getElementById('cns-foto').style.display='none';document.getElementById('cns-foto-ph').style.display='';}

  // Identificação
  document.getElementById('r-formato').textContent=val(p.formato);
  document.getElementById('r-codigo').textContent=val(p.codigo);
  document.getElementById('r-barcode').textContent=val(p.barcode);
  document.getElementById('r-nome').textContent=val(p.nome);

  // Características
  document.getElementById('r-face').textContent=val(tradFace(p.face));
  document.getElementById('r-local').textContent=val(p.local_uso);
  document.getElementById('r-vt').textContent=val(tradVt(p.vt));
  const th2=String(p.thickness||'').trim();
  document.getElementById('r-thick').textContent=th2?(/mm/i.test(th2)?th2:th2+' mm'):'—';

  // Packing
  renderPack(p);
}

function renderLegend(){
  document.getElementById('legend-grid').innerHTML=['LA','LB','LBI','LC','LD','LE']
    .map(c=>'<div class="legenda-item"><span class="legenda-cod">'+c+'</span><span>'+esc(t(c))+'</span></div>').join('');
}
