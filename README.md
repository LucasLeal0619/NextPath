# NextPath

Plataforma acadêmica para mapear habilidades, comparar o perfil com vagas e sugerir trilhas de estudo.

Feito somente com **HTML5, CSS3, JavaScript puro e Bootstrap 5** (via CDN). Não há backend nem banco de dados.

## Como executar

Abra o `index.html` no navegador. Se preferir um servidor local, use a extensão **Live Server** do VS Code.

## Estrutura

```text
index.html                 → Login (precisa ficar na raiz por causa do GitHub Pages)
html/cadastro.html         → Cadastro
html/recuperar-senha.html  → Recuperação de senha (com modal para criar a nova senha)
html/dashboard.html        → Dashboard (página protegida)
assets/css/style.css       → Todo o CSS, separado por seções
assets/js/auth.js          → Login, cadastro, recuperação, sessão e funções de dados compartilhadas
assets/js/dashboard.js     → Proteção da página, renderDashboard() e modais de perfil/habilidades
assets/img/favicon.svg     → Ícone da aba
```

## Dados no navegador

> Apenas uma simulação acadêmica. **Não é segura para produção.**

| Onde | Chave | Conteúdo |
|---|---|---|
| `localStorage` | `nextpath_usuarios` | lista de contas: `{ id, nome, email, senha }` |
| `localStorage` | `nextpath_dados_{id}` | dados de **cada** usuário (perfil e habilidades) |
| `sessionStorage` | `nextpath_usuario_logado` | conta logada agora (some ao fechar a aba) |

Uma conta nova começa **vazia**: nada de dados do protótipo.

```javascript
// nextpath_dados_{id}
{
    perfil: { area: "", cargoAtual: "", nivel: "", objetivo: "" },
    habilidades: [
        // exemplo de habilidade:
        // { nome: "Docker", categoria: "Infraestrutura", progresso: 20, status: "em_desenvolvimento" }
    ]
}
```

- `status`: `nao_iniciada`, `em_desenvolvimento` ou `desenvolvida`.
- `progresso`: número de 0 a 100. O Dashboard aceita habilidades sem esses campos.

### Funções compartilhadas (`auth.js`)

Toda página interna deve carregar o `auth.js` e usar estas funções, para que todos usem os mesmos dados:

```javascript
const usuario = getUsuarioLogado();          // { id, nome, email, ... } ou null
const dados = getDadosUsuario(usuario.id);   // { perfil, habilidades }
dados.habilidades.push({ nome: "SQL", progresso: 0, status: "nao_iniciada" });
salvarDadosUsuario(usuario.id, dados);       // grava no localStorage
logout();                                    // limpa só a sessão
```

O Dashboard recalcula tudo em `renderDashboard()` a partir desses dados. Ele também atualiza sozinho quando os dados mudam em outra aba.
Por enquanto, perfil e habilidades podem ser preenchidos por modais rápidos no próprio Dashboard. As páginas completas ficam para as próximas etapas.

Para "zerar" tudo: DevTools → Application → Local Storage → apagar as chaves `nextpath_*`.

## Como criar as próximas páginas

1. Copie `html/dashboard.html` com o nome da nova página (ex.: `html/vagas.html`).
2. Na sidebar, troque o `href="#"` do item pelo nome do arquivo e mova `active` + `aria-current="page"` para o item da página nova. Somente um item pode ter `active`. Links com `href="#"` mostram o aviso "será implementada na próxima etapa".
3. Substitua o conteúdo dentro de `<main class="app-main">`, mantendo o `<header class="app-header">`.
4. Reaproveite as classes já existentes: `card-np`, `card-np-title`, `numero`, `barra`, `barra-preenchida`, etc.
5. Carregue `bootstrap.bundle.min.js`, `../assets/js/auth.js` e depois o JS da página. Para proteger a página, copie o início do `dashboard.js` (`getUsuarioLogado()` + redirecionamento) e ligue o botão Sair a `logout()`.

Nomes sugeridos para os arquivos do menu: `perfil.html`, `habilidades.html`, `skilltree.html`, `vagas.html`, `detalhes-vaga.html`, `compatibilidade.html`, `gaps.html`, `trilhas.html`.
