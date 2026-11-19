# AD Export — Consulta de Produtos (versão cliente)

Catálogo para clientes: fotos, especificações e packing list, em português, espanhol e inglês.
**Não mostra preços**: o servidor nunca lê as colunas de preço da planilha.

O site é estático (GitHub Pages). Os dados vêm da planilha pelo Apps Script, passando por um Worker da Cloudflare:

```
Site (GitHub Pages)  →  Worker (Cloudflare)  →  Apps Script (doPost)  →  Planilha
```

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | Estrutura da página. O tema salvo é aplicado já no `<head>`. |
| `css/style.css` | Todo o visual (mesmo padrão do programa Pedidos e Consulta). |
| `js/api.js` | Cria o `google.script.run`, que chama o Worker via fetch. **Contém `API_URL`.** |
| `js/utils.js` | `esc`, `showToast`, leitura/gravação no `localStorage`. |
| `js/idiomas.js` | Textos PT/ES/EN, troca de idioma e tradução de valores da planilha. |
| `js/app.js` | Estado, tema e carregamento dos produtos. |
| `js/consulta.js` | Filtros, ficha do produto, packing list e legenda. |
| `js/fotos.js` | Fotos, zoom e download da foto original. |
| `icons/` | Logos (claro/escuro) e ícone da aba. |
| `apps-script/Codigo.gs` | Cópia do código do Apps Script (colar no editor do Apps Script). |
| `worker/worker.js` | Código do Worker (colar no editor da Cloudflare). |

O idioma pode vir no link: `...?lang=pt`, `?lang=es` ou `?lang=en`.

## Como publicar (uma vez)

1. **Apps Script**: no projeto da Consulta Cliente, substitua o `Código.gs` pelo conteúdo de `apps-script/Codigo.gs`
   (a única novidade é a função `doPost`). Depois: *Implantar → Gerenciar implantações → editar → Versão: Nova versão → Implantar*.
   A implantação precisa estar como *Executar como: Eu* e *Quem pode acessar: Qualquer pessoa*. Copie a URL que termina em `/exec`.
2. **Worker**: na Cloudflare, crie um Worker novo (não use o do programa interno, que aponta para o Apps Script com preços).
   Cole `worker/worker.js`, troque `APPS_SCRIPT_URL` pela URL do passo 1 e publique. Copie a URL do Worker.
3. **Site**: em `js/api.js`, troque `API_URL` pela URL do Worker.
4. **GitHub**: publique o repositório pelo GitHub Desktop (*Publish repository*, deixando **público**, pois o GitHub Pages grátis exige).
   No site do GitHub: *Settings → Pages → Branch: main / (root) → Save*. O endereço fica `https://felippeadexport.github.io/<nome-do-repositório>/`.

O link antigo do Apps Script continua funcionando (função `doGet`) enquanto o `Index.html` existir no editor do Apps Script.

## Testar localmente

```
python -m http.server 8765
```

Abra `http://localhost:8765`. O Worker só aceita o site publicado, então localmente os produtos não carregam
(a tela mostra "Erro ao carregar dados"). Para ver as telas, injete dados de exemplo pelo console em `PRODUCTS`.
