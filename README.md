# Portfólio: Josué Sathler | QSATH System

Site estático, sem dependências: `index.html`, `styles.css`, `main.js` e `assets/`.
Fonte Archivo (larguras variáveis) via Google Fonts (com fallback para fontes do sistema).

## Rodar localmente
Abra `index.html` no navegador, ou sirva a pasta:
    python3 -m http.server 8000   →  http://localhost:8000

## Publicar no GitHub Pages
1. Crie um repositório (ex.: `portfolio`) e envie o conteúdo desta pasta para a raiz.
2. Settings → Pages → Branch `main`, pasta `/ (root)` → Save.
3. Depois de publicado, descomente as tags `canonical` e `og:url` no `<head>` com o endereço final.
Também funciona sem ajustes em Netlify, Vercel ou Cloudflare Pages (arraste a pasta).

## Marca
A marca QSATH System aparece no cabeçalho (.brand), no hero (.wordmark) e no rodapé (.footer-mark) de index.html.
Estilo inspirado em vanholtz.co: azul elétrico (#4801ff), títulos largos em caixa alta e navegação numerada.

## Atualizar contatos
- Links visíveis: seção `#contato` em `index.html`.
- Formulário (e-mail e WhatsApp): objeto `CONTATO` no topo de `main.js`.

## Adicionar ou atualizar um projeto
- Capturas: salve em `assets/` como WebP (~1280×800 para desktop, ~560 de largura para celular).
- Projeto: copie um bloco `<article class="case">` e ajuste a cor em `--accent`.
- Inclua também o projeto na faixa (`.ticker`) e, se for o caso, em `#servicos`.

## Capturas atuais
- Porto Vitória: imagens do próprio sistema (porto-vitoria-crm/imagens-video), convertidas para WebP.
- Prisma Tech: capturas do site no ar (prismatreinamentos.com).
- Cada galeria usa abas: copie um bloco [data-gallery] para adicionar telas.
