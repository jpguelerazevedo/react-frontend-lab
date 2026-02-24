# react-frontend-lab

Repositório exemplo em React + Vite com um pequeno "lab" pessoal que demonstra:
- Multi-idioma via contexto (`pt` / `en`)
- Navegação por rotas e componente de navbar
- Visualizador de repositórios GitHub (leitura de árvore e arquivos)
- Layout com Bootstrap

## Tecnologias
- [Vite](vite.config.js)
- React 19
- React Router (rotas)
- Bootstrap 5
- react-markdown + rehype para exibir README.md do GitHub

## Como executar
1. Instale dependências:
```sh
npm install
```
2. Rode em desenvolvimento:
```sh
npm run dev
```
3. Build:
```sh
npm run build
```
(Comandos definidos em [package.json](package.json).)

## Estrutura principal
- Entrada da aplicação: [src/main.jsx](src/main.jsx) — cria root e envolve com [`LanguageProvider`](src/context/LanguageContext.jsx).
- Componentes de rota e navegação:
  - [`App`](src/App.jsx) — registra rotas e botões de idioma.
  - [`Navbar`](src/components/navbar/navbar.jsx) — tabs de navegação.
  - Páginas:
    - [`Page1`](src/components/pages/page1.jsx)
    - [`Page2`](src/components/pages/page2.jsx) — busca repositórios via API do GitHub.
    - [`Page3`](src/components/pages/page3.jsx)
  - Visualizador de repositório: [`RepoNav`](src/components/repository/repoNav.jsx)
- Dados de exemplo: [`people`](src/components/data/data.jsx)
- Contexto de idioma: [`LanguageProvider`](src/context/LanguageContext.jsx) e hook [`useLanguage`](src/context/LanguageContext.jsx)

## Notes rápidos
- O idioma é persistido em localStorage pelo [`LanguageProvider`](src/context/LanguageContext.jsx).
- O explorador de repositórios usa a API GitHub (endpoints `/repos/:owner/:repo/branches/:branch` e `/git/trees/:sha` e `/contents/:path`).
- Exibição de README.md usa [`react-markdown`](src/components/repository/repoNav.jsx) com `rehype-raw` e `rehype-sanitize`.

## Arquivos úteis para editar
- [src/App.jsx](src/App.jsx)
- [src/main.jsx](src/main.jsx)
- [src/context/LanguageContext.jsx](src/context/LanguageContext.jsx)
- [src/components/repository/repoNav.jsx](src/components/repository/repoNav.jsx)
- [src/components/pages/page2.jsx](src/components/pages/page2.jsx)
- [src/components/data/data.jsx](src/components/data/data.jsx)

## Contribuição
Pull requests são bem-vindos. Mantenha a consistência com eslint (config em [eslint.config.js](eslint.config.js)).
