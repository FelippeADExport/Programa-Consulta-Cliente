// ============================================================
// IDIOMAS: textos em PT / ES / EN e tradução de valores da planilha
// Aceita ?lang=pt | es | en no link para abrir já no idioma
// ============================================================
const LANG_PARAM=(()=>{
  const l=String(new URLSearchParams(location.search).get('lang')||'').toLowerCase();
  return ['pt','es','en'].indexOf(l)>=0?l:'';
})();

const T = {
  pt:{
    loading:'Carregando produtos...', loadError:'Erro ao carregar dados.', appSub:'Catálogo de Produtos',
    refresh:'Atualizar', light:'Claro', dark:'Escuro', updated:'Produtos atualizados',
    title:'Consulta Produto', subtitle:'Selecione o formato e o produto, ou digite o código para ver fotos e especificações',
    formato:'Formato', nome:'Nome do Produto', codigo:'Código', codigoPh:'Digite o código ou nome...',
    selecione:'Selecione...', selFormatoPrimeiro:'Selecione o formato primeiro', selNome:'Selecione o produto...',
    identificacao:'Identificação', barcode:'Cód. de Barras', referencia:'Referência',
    caracteristicas:'Características', face:'Faces', localUso:'Local de Uso', vt:'Variação de Tom', espessura:'Espessura',
    packTitle:'Informações de Packing List', palAm:'Pallet Americano', palEu:'Europallet', palExw:'EXW',
    caixa:'Caixa', pallet:'Pallet', container:'Container', caminhao:'Caminhão',
    pecas:'Peças', caixas:'Caixas', pallets:'Pallets', peso:'Peso (kg)',
    camadas:'Camadas', medidas:'Medidas do pallet',
    emptyT:'Selecione um produto para consultar', emptyS:'Use os filtros acima para encontrar o produto desejado',
    legenda:'Legenda — Local de Uso', semFoto:'Sem foto',
    LA:'Paredes internas e externas cobertas.',
    LB:'Ambientes residenciais sem acesso para a rua, como banheiros, salas, quartos e cozinhas.',
    LBI:'Ambientes residenciais e comerciais sem acesso para a rua, como banheiros, salas, quartos e cozinhas.',
    LC:'Ambientes residenciais com e sem acesso para a rua, como banheiros, salas, quartos, cozinhas, garagens e varandas cobertas. Áreas comerciais de baixo tráfego.',
    LD:'Ambientes residenciais e comerciais com e sem acesso para a rua, como banheiros, salas, quartos, cozinhas, garagens e varandas.',
    LE:'Ambientes residenciais e comerciais com e sem acesso a rua, como banheiros, salas, quartos, cozinhas, garagens, varandas, áreas molhadas como calçadas e ambientes externos.',
    baixar:'Baixar foto', baixando:'Preparando...', dlErro:'Não foi possível baixar a foto',
    vt1:'VT1 - Uniforme', vt2:'VT2 - Pouca variação', vt3:'VT3 - Média variação', vt4:'VT4 - Alta variação'
  },
  es:{
    loading:'Cargando productos...', loadError:'Error al cargar los datos.', appSub:'Catálogo de Productos',
    refresh:'Actualizar', light:'Claro', dark:'Oscuro', updated:'Productos actualizados',
    title:'Consulta de Producto', subtitle:'Seleccione el formato y el producto, o escriba el código para ver fotos y especificaciones',
    formato:'Formato', nome:'Nombre del Producto', codigo:'Código', codigoPh:'Escriba el código o nombre...',
    selecione:'Seleccione...', selFormatoPrimeiro:'Seleccione el formato primero', selNome:'Seleccione el producto...',
    identificacao:'Identificación', barcode:'Código de Barras', referencia:'Referencia',
    caracteristicas:'Características', face:'Caras', localUso:'Lugar de Uso', vt:'Variación de Tono', espessura:'Espesor',
    packTitle:'Información de Packing List', palAm:'Pallet Americano', palEu:'Europallet', palExw:'EXW',
    caixa:'Caja', pallet:'Pallet', container:'Contenedor', caminhao:'Camión',
    pecas:'Piezas', caixas:'Cajas', pallets:'Pallets', peso:'Peso (kg)',
    camadas:'Capas', medidas:'Medidas del pallet',
    emptyT:'Seleccione un producto para consultar', emptyS:'Use los filtros de arriba para encontrar el producto deseado',
    legenda:'Leyenda — Lugar de Uso', semFoto:'Sin foto',
    LA:'Paredes internas y externas cubiertas.',
    LB:'Ambientes residenciales sin acceso a la calle, como baños, salas, habitaciones y cocinas.',
    LBI:'Ambientes residenciales y comerciales sin acceso a la calle, como baños, salas, habitaciones y cocinas.',
    LC:'Ambientes residenciales con y sin acceso a la calle, como baños, salas, habitaciones, cocinas, garajes y terrazas cubiertas. Áreas comerciales de bajo tráfico.',
    LD:'Ambientes residenciales y comerciales con y sin acceso a la calle, como baños, salas, habitaciones, cocinas, garajes y terrazas.',
    LE:'Ambientes residenciales y comerciales con y sin acceso a la calle, como baños, salas, habitaciones, cocinas, garajes, terrazas, áreas húmedas como aceras y ambientes externos.',
    baixar:'Descargar foto', baixando:'Preparando...', dlErro:'No fue posible descargar la foto',
    vt1:'VT1 - Uniforme', vt2:'VT2 - Poca variación', vt3:'VT3 - Variación media', vt4:'VT4 - Alta variación'
  },
  en:{
    loading:'Loading products...', loadError:'Error loading data.', appSub:'Product Catalog',
    refresh:'Refresh', light:'Light', dark:'Dark', updated:'Products updated',
    title:'Product Search', subtitle:'Select the format and product, or type the code to see photos and specifications',
    formato:'Format', nome:'Product Name', codigo:'Code', codigoPh:'Type the code or name...',
    selecione:'Select...', selFormatoPrimeiro:'Select the format first', selNome:'Select the product...',
    identificacao:'Identification', barcode:'Barcode', referencia:'Reference',
    caracteristicas:'Features', face:'Faces', localUso:'Place of Use', vt:'Tone Variation', espessura:'Thickness',
    packTitle:'Packing List Information', palAm:'American Pallet', palEu:'Europallet', palExw:'EXW',
    caixa:'Box', pallet:'Pallet', container:'Container', caminhao:'Truck',
    pecas:'Pieces', caixas:'Boxes', pallets:'Pallets', peso:'Weight (kg)',
    camadas:'Layers', medidas:'Pallet size',
    emptyT:'Select a product to view', emptyS:'Use the filters above to find the product you are looking for',
    legenda:'Legend — Place of Use', semFoto:'No photo',
    LA:'Covered interior and exterior walls.',
    LB:'Residential environments without street access, such as bathrooms, living rooms, bedrooms and kitchens.',
    LBI:'Residential and commercial environments without street access, such as bathrooms, living rooms, bedrooms and kitchens.',
    LC:'Residential environments with and without street access, such as bathrooms, living rooms, bedrooms, kitchens, garages and covered verandas. Low-traffic commercial areas.',
    LD:'Residential and commercial environments with and without street access, such as bathrooms, living rooms, bedrooms, kitchens, garages and verandas.',
    LE:'Residential and commercial environments with and without street access, such as bathrooms, living rooms, bedrooms, kitchens, garages, verandas, wet areas like sidewalks and outdoor environments.',
    baixar:'Download photo', baixando:'Preparing...', dlErro:'Could not download the photo',
    vt1:'VT1 - Uniform', vt2:'VT2 - Low variation', vt3:'VT3 - Medium variation', vt4:'VT4 - High variation'
  }
};
const LOCALE = {pt:'pt-BR', es:'es-ES', en:'en-US'};
const HTML_LANG = {pt:'pt-BR', es:'es', en:'en'};

function detectLang(){
  if(LANG_PARAM) return LANG_PARAM;
  const s=_getSaved('adcliente_lang');
  if(s&&T[s]) return s;
  const n=(navigator.language||'pt').slice(0,2).toLowerCase();
  return T[n]?n:'es';
}

let LANG=detectLang();
function t(k){return (T[LANG]&&T[LANG][k])||T.pt[k]||k;}

function setLang(l){
  if(!T[l]) return;
  LANG=l;
  _setSaved('adcliente_lang',l);
  applyLang();
}

function applyLang(){
  document.documentElement.lang=HTML_LANG[LANG];
  document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t(el.dataset.t);});
  ['pt','es','en'].forEach(l=>document.getElementById('lang-'+l).classList.toggle('active',l===LANG));
  document.getElementById('cns-codigo').placeholder=t('codigoPh');
  document.getElementById('loaderMsg').textContent=t('loading');
  const rb=document.getElementById('btnRefresh');rb.title=t('refresh');rb.setAttribute('aria-label',t('refresh'));
  updateThemeLabel();
  renderLegend();
  // Recarregar selects mantendo a seleção atual
  const fmt=document.getElementById('cns-formato').value;
  const cod=document.getElementById('cns-nome').value;
  cnsInit();
  if(fmt){
    document.getElementById('cns-formato').value=fmt;
    fillNomes(fmt);
    if(cod) document.getElementById('cns-nome').value=cod;
  }
  if(CURRENT) cnsShowProduto(CURRENT);
}

// Tradução de valores vindos da planilha
const VAL_T={
  mate:{pt:'Mate',es:'Mate',en:'Matte'}, acetinado:{pt:'Acetinado',es:'Satinado',en:'Satin'},
  polido:{pt:'Polido',es:'Pulido',en:'Polished'}, brilhante:{pt:'Brilhante',es:'Brillante',en:'Glossy'},
  esmaltado:{pt:'Esmaltado',es:'Esmaltado',en:'Glazed'}, natural:{pt:'Natural',es:'Natural',en:'Natural'},
  rustico:{pt:'Rústico',es:'Rústico',en:'Rustic'}, antiderrapante:{pt:'Antiderrapante',es:'Antideslizante',en:'Anti-slip'},
  piso:{pt:'Piso',es:'Piso',en:'Floor'}, parede:{pt:'Parede',es:'Pared',en:'Wall'},
  pisoParede:{pt:'Piso | Parede',es:'Piso | Pared',en:'Floor | Wall'}
};
const VAL_MAP={'mate':'mate','matte':'mate','fosco':'mate','acetinado':'acetinado','satinado':'acetinado','satin':'acetinado',
  'polido':'polido','pulido':'polido','polished':'polido','brilhante':'brilhante','brillante':'brilhante','glossy':'brilhante',
  'esmaltado':'esmaltado','glazed':'esmaltado','natural':'natural','rústico':'rustico','rustico':'rustico','rustic':'rustico',
  'antiderrapante':'antiderrapante','anti-slip':'antiderrapante','piso':'piso','floor':'piso','parede':'parede','pared':'parede','wall':'parede',
  'piso | parede':'pisoParede','piso | pared':'pisoParede','floor | wall':'pisoParede'};
function tradVal(v){
  if(!v) return v;
  const k=VAL_MAP[String(v).toLowerCase().trim()];
  return k?VAL_T[k][LANG]:v;
}
function tradVt(v){
  const u=String(v||'').toUpperCase().trim();
  for(const n of ['1','2','3','4']) if(u.startsWith('VT'+n)) return t('vt'+n);
  return tradVal(v);
}
function tradFace(v){
  const s=String(v||'').trim();
  const m=s.match(/^(\d+)\s*(faces?|caras?)?$/i);
  if(!m) return s;
  const n=parseInt(m[1]);
  const w={pt:['face','faces'],es:['cara','caras'],en:['face','faces']}[LANG];
  return n+' '+(n===1?w[0]:w[1]);
}
