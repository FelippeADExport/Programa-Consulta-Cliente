// ============================================================
// FOTOS: carregamento com fallback (thumbnail → lh3 → uc; Safari
// começa pelo lh3), zoom e download da foto original
// ============================================================
let FOTOS=[], FOTO_IDX=0, FOTO_COL=[];
const IS_SAFARI=/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||/iPad|iPhone|iPod/.test(navigator.userAgent);

function extractId(url){
  if(!url) return '';
  let m=url.match(/[?&]id=([a-zA-Z0-9_-]+)/);if(m) return m[1];
  m=url.match(/\/d\/([a-zA-Z0-9_-]+)/);if(m) return m[1];
  return '';
}
function buildUrl(id,tried){
  if(!id) return '';
  const a=IS_SAFARI
    ?['https://lh3.googleusercontent.com/d/'+id+'=s2000','https://drive.google.com/uc?export=view&id='+id,'https://drive.google.com/thumbnail?id='+id+'&sz=w2000']
    :['https://drive.google.com/thumbnail?id='+id+'&sz=w2000','https://lh3.googleusercontent.com/d/'+id+'=s2000','https://drive.google.com/uc?export=view&id='+id];
  return a[tried]||'';
}
function loadImg(img,url){
  img._fileId=extractId(url);
  img._tried=0;
  img.src=buildUrl(img._fileId,0)||url;
}
// Retorna true se ainda há outra URL para tentar
function fotoFallback(img){
  img._tried=(img._tried||0)+1;
  const next=buildUrl(img._fileId,img._tried);
  if(next){img.src=next;return true;}
  if(img.id==='cns-foto'){img.style.display='none';document.getElementById('cns-foto-ph').style.display='';}
  return false;
}
function setFoto(i){
  FOTO_IDX=i;
  document.querySelectorAll('#cns-thumbs .cns-thumb').forEach((d,k)=>d.classList.toggle('active',k===i));
  const img=document.getElementById('cns-foto');
  document.getElementById('cns-foto-ph').style.display='none';
  img.style.display='block';
  loadImg(img,FOTOS[i]);
  if(document.getElementById('zoom').style.display==='flex') zoomUpdate();
}

// ZOOM
function zoomOpen(){if(!FOTOS.length)return;document.getElementById('zoom').style.display='flex';zoomUpdate();}
function zoomClose(){document.getElementById('zoom').style.display='none';}
function zoomNav(dir){if(!FOTOS.length)return;setFoto((FOTO_IDX+dir+FOTOS.length)%FOTOS.length);}
function zoomUpdate(){
  loadImg(document.getElementById('zImg'),FOTOS[FOTO_IDX]);
  document.getElementById('zCount').textContent=(FOTO_IDX+1)+' / '+FOTOS.length;
  const multi=FOTOS.length>1;
  document.getElementById('zPrev').style.display=multi?'':'none';
  document.getElementById('zNext').style.display=multi?'':'none';
}
document.addEventListener('keydown',e=>{
  if(document.getElementById('zoom').style.display!=='flex') return;
  if(e.key==='ArrowLeft') zoomNav(-1);
  if(e.key==='ArrowRight') zoomNav(1);
  if(e.key==='Escape') zoomClose();
});

// DOWNLOAD DA FOTO ATUAL (original, via servidor)
function baixarFoto(btn){
  if(!CURRENT||!FOTOS.length) return;
  const p=CURRENT, n=FOTO_COL[FOTO_IDX];
  const btns=[document.getElementById('btnDl'),document.getElementById('zDl')];
  btns.forEach(b=>{b.disabled=true;b.querySelector('span').textContent=t('baixando');});
  const fim=()=>btns.forEach(b=>{b.disabled=false;b.querySelector('span').textContent=t('baixar');});
  google.script.run
    .withSuccessHandler(r=>{
      fim();
      const d=JSON.parse(r);
      if(!d.success){showToast(t('dlErro')+': '+d.error,'error');return;}
      const bin=atob(d.data), arr=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
      const blob=new Blob([arr],{type:d.mime});
      const nome=(p.codigo+'_'+(p.nome||'')).replace(/[^\w\-]+/g,'_').replace(/_+/g,'_').replace(/_$/,'')+'_'+n+'.'+d.ext;
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;a.download=nome;document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),10000);
    })
    .withFailureHandler(e=>{fim();showToast(t('dlErro')+': '+(e&&e.message||e),'error');})
    .getFotoDownload(p.codigo,n);
}
