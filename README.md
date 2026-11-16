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
html/dashboard.html        → Dashboard (resumo em tempo real)
html/perfil.html           → Perfil Profissional
html/habilidades.html      → Minhas Habilidades
html/skilltree.html        → SkillTree
html/vagas.html            → Vagas (busca, filtros e compatibilidade)
html/detalhes-vaga.html    → Detalhes da Vaga (?id=1)
html/compatibilidade.html  → Compatibilidade com a Vaga
html/gaps.html             → Gaps da vaga
html/trilhas.html          → Trilhas Recomendadas
assets/css/style.css       → Todo o CSS, separado por seções
assets/js/auth.js          → Login, cadastro, recuperação, sessão e funções de dados (todas as páginas)
assets/js/app.js           → Comum às páginas internas: proteção, cabeçalho, Sair, toast, bolinhas de nível
assets/js/dashboard.js     → renderDashboard()
assets/js/perfil.js        → Editar perfil
assets/js/habilidades.js   → Adicionar, mudar nível e remover habilidades
assets/js/skilltree.js     → Montar a árvore a partir das habilidades
assets/js/catalogo.js      → Vagas e trilhas da plataforma + cálculo de compatibilidade
assets/js/vagas.js, detalhes-vaga.js, compatibilidade.js, gaps.js, trilhas.js → um por página
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
    perfil: { area: "", cargoAtual: "", nivel: "", objetivo: "", sobre: "" },
    habilidades: [
        // exemplo de habilidade:
        // { nome: "Docker", categoria: "Infraestrutura", progresso: 40, status: "em_desenvolvimento" }
    ],
    vagaSelecionada: null,  // id da última vaga aberta
    trilhas: {}             // módulos concluídos por trilha. Ex.: { docker: [0, 1] }
}
```

- `status`: `nao_iniciada`, `em_desenvolvimento` ou `desenvolvida`.
- `progresso`: 0 a 100, em passos de 20. Cada bolinha vale 20%: 0 = Não iniciada, 1 = Iniciante, 2 = Básico, 3 = Intermediário, 4 = Proficiente, 5 = Avançado.
- As páginas aceitam habilidades sem esses campos (veja `getProgresso()` e `getStatus()` no `app.js`).

### Vagas e trilhas (`catalogo.js`)

Não há API de vagas. As vagas e trilhas ficam em listas fixas (`VAGAS` e `TRILHAS`), como o conteúdo de um site de vagas. Para incluir uma vaga ou trilha nova, basta adicionar um objeto na lista. O que depende do usuário é sempre calculado:

- **Compatibilidade** (`analisarVaga`): para cada tecnologia da vaga, compara as bolinhas do usuário com as exigidas. A porcentagem é a média.
- **Gaps**: tecnologias em que o usuário ainda não atinge o nível exigido.
- **Trilhas recomendadas**: as trilhas dos gaps da vaga escolhida. Ao concluir todos os módulos, a habilidade sobe para o nível da trilha e a compatibilidade aumenta.
- A vaga escolhida vem da URL (`detalhes-vaga.html?id=1`) ou fica salva em `vagaSelecionada`, para as páginas Compatibilidade, Gaps e Trilhas.

### Funções compartilhadas (`auth.js`)

Toda página interna deve carregar o `auth.js` e usar estas funções, para que todos usem os mesmos dados:

```javascript
const usuario = getUsuarioLogado();          // { id, nome, email, ... } ou null
const dados = getDadosUsuario(usuario.id);   // { perfil, habilidades }
dados.habilidades.push({ nome: "SQL", progresso: 0, status: "nao_iniciada" });
salvarDadosUsuario(usuario.id, dados);       // grava no localStorage
logout();                                    // limpa só a sessão
```

Cada página tem uma função `render...()` que lê os dados e redesenha a tela. Ela roda ao abrir a página, depois de cada alteração e quando os dados mudam em outra aba (evento `storage`).

Para "zerar" tudo: DevTools → Application → Local Storage → apagar as chaves `nextpath_*`.

## Como criar as próximas páginas

1. Copie `html/skilltree.html` (a página interna mais simples) com o nome da nova página (ex.: `html/configuracoes.html`).
2. Na sidebar, troque o `href="#"` do item pelo nome do arquivo e mova `active` + `aria-current="page"` para o item da página nova. Somente um item pode ter `active`. Links com `href="#"` mostram o aviso "será implementada na próxima etapa".
3. Substitua o conteúdo dentro de `<main class="app-main">`, mantendo o `<header class="app-header">`.
4. Reaproveite as classes já existentes: `card-np`, `card-np-title`, `numero`, `barra`, `barra-preenchida`, etc.
5. Carregue os scripts nesta ordem: `bootstrap.bundle.min.js`, `../assets/js/auth.js`, `../assets/js/app.js`, `../assets/js/catalogo.js` (se usar vagas ou trilhas) e o JS da página. O `app.js` já protege a página e cuida do cabeçalho, do botão Sair e do toast. No JS da página, use a variável `usuario` e comece com `if (!usuario) return;` dentro do `DOMContentLoaded`.
6. Atualize o link da página nova na sidebar de **todas** as páginas internas.
