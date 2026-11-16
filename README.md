# NextPath

**Trace sua trilha de carreira em tecnologia.**

O NextPath é uma plataforma acadêmica que ajuda quem está entrando ou crescendo na área de tecnologia a responder três perguntas:

1. **O que eu já sei?** Você mapeia suas habilidades e o nível em cada uma.
2. **O que a vaga que eu quero pede?** Você cola o texto de uma vaga real (ou descreve o seu objetivo) e a plataforma organiza os requisitos.
3. **O que falta e como eu chego lá?** A plataforma calcula a sua compatibilidade, mostra os gaps e monta trilhas de estudo para fechá-los.

Tudo funciona **só no navegador**, com **HTML5, CSS3, JavaScript puro e Bootstrap 5** (via CDN). Não há backend, banco de dados, API externa nem inteligência artificial: os dados ficam no `localStorage` do navegador.

> Projeto acadêmico. A autenticação é uma **simulação** e **não é segura para produção** (as senhas ficam salvas sem criptografia no navegador).

---

## Sumário

- [Como executar](#como-executar)
- [Como a plataforma funciona](#como-a-plataforma-funciona)
- [As telas](#as-telas)
- [Princípios do projeto](#princípios-do-projeto)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Dados no navegador](#dados-no-navegador)
- [Como as regras funcionam](#como-as-regras-funcionam)
- [Guia para quem vai continuar o projeto](#guia-para-quem-vai-continuar-o-projeto)
- [Limitações conhecidas](#limitações-conhecidas)

---

## Como executar

**Opção 1:** abra o `index.html` direto no navegador.

**Opção 2 (recomendada):** no VS Code, instale a extensão **Live Server**, clique com o botão direito no `index.html` e escolha *Open with Live Server*.

**GitHub Pages:** o `index.html` fica na raiz justamente para o site funcionar publicado. No repositório, vá em *Settings → Pages → Branch `main` → pasta `/ (root)`*.

Para começar do zero: crie uma conta em **Cadastre-se gratuitamente**, faça login e siga a configuração inicial.

---

## Como a plataforma funciona

```text
Cadastro → Login → Onboarding (3 passos) → Dashboard
                                              │
      ┌───────────────────────────────────────┼─────────────────────────────┐
      ▼                                       ▼                             ▼
Minhas Habilidades ◄──────────────── Vagas (colar e organizar) ──► Vaga que você almeja
      │                                       │                             │
      ▼                                       ▼                             ▼
  SkillTree                      Detalhes → Compatibilidade → Gaps → Trilhas Recomendadas
                                                                            │
                         cada módulo estudado aumenta o nível da habilidade ┘
                         (e o Dashboard, a compatibilidade e os gaps mudam na hora)
```

1. **Conta nova começa vazia.** Nada de dados de exemplo: 0%, 0 habilidades, nível e objetivo "não definidos".
2. **Onboarding:** no primeiro login, a pessoa escolhe a área e o nível, marca o que já sabe e diz onde quer chegar.
3. **Vagas:** a pessoa cola o texto de vagas reais (LinkedIn, Gupy, site da empresa). O NextPath separa título, empresa, local, modalidade, senioridade, requisitos, diferenciais e tecnologias. Sem vaga em mãos, ele monta um **perfil-alvo** a partir do objetivo escrito.
4. **Compatibilidade e gaps:** para cada tecnologia da vaga, compara o nível da pessoa com o exigido.
5. **Trilhas:** recomendadas a partir da vaga que a pessoa almeja e da área dela. Cada módulo marcado como estudado aumenta o nível daquela habilidade, e tudo o que depende disso se atualiza em tempo real.

---

## As telas

| Tela | Arquivo | O que faz |
|---|---|---|
| Login | `index.html` | Entra na conta. Mostra avisos como "Conta criada!" e "Senha redefinida!". |
| Cadastro | `html/cadastro.html` | Cria a conta (nome, e-mail, senha) com validações e um espaço de dados vazio para o usuário. |
| Recuperar senha | `html/recuperar-senha.html` | Confere se o e-mail existe e abre um modal para criar a nova senha (simulação: não envia e-mail). |
| Onboarding | `html/onboarding.html` | Configuração inicial em 3 passos: área e nível, habilidades, objetivo. Pode ser pulado e refeito pelo Perfil. |
| Dashboard | `html/dashboard.html` | Resumo em tempo real: progresso geral, compatibilidade com a vaga almejada, resumo do perfil e próximos passos. |
| Perfil Profissional | `html/perfil.html` | Nome, cargo, área (texto livre), nível, objetivo, vaga que almeja e "Sobre você". O resumo ao lado muda enquanto você digita. |
| Minhas Habilidades | `html/habilidades.html` | Lista com busca. O nível é marcado clicando nas bolinhas (0 a 5). |
| SkillTree | `html/skilltree.html` | Árvore montada a partir das habilidades: objetivo → categorias → habilidades. |
| Vagas | `html/vagas.html` | Suas vagas com compatibilidade, busca e filtros. **Adicionar vaga**: colar o texto → revisar o que foi organizado → salvar. |
| Detalhes da Vaga | `html/detalhes-vaga.html` | Descrição, atividades, requisitos, diferenciais e tecnologias (em verde as que você já atende). |
| Compatibilidade | `html/compatibilidade.html` | Porcentagem geral e quais requisitos você atende, está desenvolvendo ou ainda não atende. |
| Gaps | `html/gaps.html` | O que falta para a vaga: seu nível × nível exigido. Dá para adicionar a habilidade que falta com um clique. |
| Trilhas Recomendadas | `html/trilhas.html` | Trilhas com o motivo de cada recomendação, módulos para marcar, trilhas criadas por você e trilhas concluídas. |

Páginas que dependem de uma vaga (Detalhes, Compatibilidade, Gaps) usam a vaga aberta pela última vez ou, se não houver, a vaga que você almeja.

---

## Princípios do projeto

- **Nada de dados inventados.** Não existem vagas prontas, usuários fictícios nem progresso de exemplo. Tudo vem do que cada usuário informa.
- **Cada usuário tem seus próprios dados.** Duas contas no mesmo navegador nunca se misturam.
- **Tempo real.** Nenhuma tela é estática: os números são calculados a partir dos dados salvos e mudam assim que algo é alterado.
- **Código simples para estudantes.** Funções com nomes claros em português, sem classes nem arquitetura complexa, e comentários explicando o "porquê".
- **HTML, CSS e JS separados.** Nada de JavaScript dentro do HTML nem blocos grandes de CSS no HTML.

---

## Estrutura de pastas

```text
NextPath/
├── index.html                  → Login (fica na raiz por causa do GitHub Pages)
├── html/                       → demais páginas (uma por tela da tabela acima)
├── assets/
│   ├── css/
│   │   ├── style.css           → comum a todas as páginas: variáveis, formulários, sidebar, cards, tabela, bolinhas...
│   │   ├── auth.css            → Login, Cadastro e Recuperação (mesmo layout)
│   │   └── <página>.css        → um por página interna, só com o que é exclusivo dela (ex.: dashboard.css)
│   ├── js/
│   │   ├── auth.js             → login, cadastro, recuperação, sessão e funções de dados (usado por todas as páginas)
│   │   ├── app.js              → comum às páginas internas: proteção, cabeçalho, Sair, toast, bolinhas, tempo real
│   │   ├── catalogo.js         → conteúdo das trilhas, áreas, compatibilidade e montagem das trilhas
│   │   ├── leitor-vaga.js      → lê o texto colado de uma vaga e monta o perfil-alvo
│   │   └── <página>.js         → comportamento de cada página (ex.: dashboard.js, vagas.js, trilhas.js)
│   └── img/favicon.svg         → ícone da aba
└── README.md
```

**Ordem dos scripts nas páginas internas:**

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="../assets/js/auth.js"></script>
<script src="../assets/js/app.js"></script>
<script src="../assets/js/catalogo.js"></script>     <!-- se a página usa vagas, compatibilidade ou trilhas -->
<script src="../assets/js/leitor-vaga.js"></script>  <!-- se a página lê vagas coladas -->
<script src="../assets/js/nome-da-pagina.js"></script>
```

**Ordem dos estilos:** primeiro o `style.css`, depois o CSS da página.

---

## Dados no navegador

| Onde | Chave | Conteúdo |
|---|---|---|
| `localStorage` | `nextpath_usuarios` | lista de contas: `{ id, nome, email, senha }` |
| `localStorage` | `nextpath_dados_{id}` | dados de **cada** usuário (perfil, habilidades, vagas, trilhas) |
| `sessionStorage` | `nextpath_usuario_logado` | conta logada agora (some ao fechar a aba) |
| `sessionStorage` | `nextpath_aviso` | mensagem rápida para a próxima página (ex.: "Vaga adicionada!") |

Formato de `nextpath_dados_{id}` (é assim que uma conta nova começa):

```javascript
{
    perfil: {
        area: "",            // texto livre: "Back-end", "Dados", "Game Dev"...
        cargoAtual: "",
        nivel: "",           // "", "Estagiário", "Júnior", "Pleno", "Sênior" ou "Especialista"
        objetivo: "",
        sobre: "",
        vagaObjetivo: null   // id da vaga que o usuário almeja
    },
    habilidades: [],         // { nome, categoria, progresso (0-100), status }
    vagas: [],               // vagas coladas ou geradas pelo objetivo (gerada: true)
    vagaSelecionada: null,   // última vaga aberta
    trilhas: {},             // por trilha: { habilidade, nivelAlvo, base, concluidos: [0, 1], criadaPeloUsuario }
    onboardingConcluido: false
}
```

**Níveis das habilidades:** cada bolinha vale 20% de progresso.

| Bolinhas | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Nível | Não iniciada | Iniciante | Básico | Intermediário | Proficiente | Avançado |
| Progresso | 0% | 20% | 40% | 60% | 80% | 100% |

`status` é `nao_iniciada` (0%), `em_desenvolvimento` (entre 1% e 99%) ou `desenvolvida` (100%).

**Para zerar tudo:** DevTools (F12) → *Application* → *Local Storage* → apague as chaves que começam com `nextpath_`.

---

## Como as regras funcionam

### Leitor de vagas (`leitor-vaga.js`)

A função `lerVaga(texto)` organiza o texto colado **sem IA**, com regras simples:

- **Título:** primeira linha. **Empresa:** linha "Empresa: X" ou o formato do LinkedIn "Empresa · Cidade".
- **Local, modalidade, senioridade e contratação:** palavras-chave como "São Paulo/SP", "híbrido", "júnior" e "CLT".
- **Seções:** linhas como "Requisitos", "Diferenciais" e "Responsabilidades" separam as listas.
- **Tecnologias:** procuradas pela lista `PALAVRAS_TECNOLOGIAS`. Para reconhecer uma tecnologia nova, basta adicionar uma linha nela.
- **Nível exigido:** vem da senioridade (Estágio = Iniciante, Júnior = Básico, Pleno = Intermediário, Sênior = Proficiente, Especialista = Avançado). Tecnologias que só aparecem em "Diferenciais" são marcadas como **desejáveis** e exigem um nível a menos.

O resultado **nunca é salvo direto**: o usuário revisa e corrige tudo (tecnologias, níveis, diferenciais) antes de salvar.

### Perfil-alvo (`criarVagaDoObjetivo` em `leitor-vaga.js`)

Quando o usuário não tem uma vaga para colar, a plataforma monta uma "vaga" a partir do objetivo escrito. As tecnologias são as citadas no objetivo mais as essenciais da área (`TECNOLOGIAS_POR_AREA` em `catalogo.js`), no nível da senioridade desejada. Ela aparece com a etiqueta **Perfil-alvo** e pode ser editada como qualquer vaga.

### Compatibilidade e gaps (`analisarVaga` em `catalogo.js`)

- Para cada tecnologia da vaga: **progresso do usuário ÷ progresso exigido** (no máximo 100%).
- A **compatibilidade** é a média dos requisitos **obrigatórios**. Os diferenciais não baixam a nota.
- **Gaps** são as tecnologias em que o usuário ainda não atinge o nível exigido (primeiro os obrigatórios, depois os diferenciais).

### Trilhas (`montarTrilha` e `estudarTrilha` em `catalogo.js`)

- **Qualquer habilidade tem trilha.** As conhecidas usam o conteúdo de `CONTEUDO_TRILHAS`; as outras recebem módulos genéricos (ex.: "Fundamentos de Figma").
- **O nível alvo é o de cada usuário:** o que a vaga dele exige ou o do próximo cargo dele.
- **Ordem das recomendações**, e cada card mostra o motivo:
  1. trilhas que o usuário já começou ou criou;
  2. gaps da vaga que ele almeja;
  3. habilidades essenciais da área dele.
- **Cada módulo marcado** aumenta o progresso da habilidade, do nível em que ela estava até o nível alvo. Desmarcar volta.

### Tempo real (`app.js`)

Cada página tem uma função que desenha a tela a partir dos dados salvos (ex.: `renderDashboard`) e a informa ao `app.js`:

```javascript
atualizarPagina = renderDashboard;
```

Essa função roda de novo sempre que os dados podem ter mudado:

- depois de cada ação na própria página;
- quando os dados mudam em outra aba do NextPath;
- quando o usuário volta à página pelo botão "Voltar" do navegador;
- quando a aba volta a ficar visível.

---

## Guia para quem vai continuar o projeto

### Funções que toda página pode usar

```javascript
// auth.js
const dados = getDadosUsuario(usuario.id);   // lê os dados do usuário logado
salvarDadosUsuario(usuario.id, dados);       // grava no localStorage
logout();                                    // limpa só a sessão (os dados continuam salvos)

// app.js
usuario                     // conta logada (a página já é protegida pelo app.js)
setTexto(id, texto)         // muda o texto de um elemento
mostrarToast(texto)         // aviso rápido no canto da tela
gerarPontos(3)              // HTML das bolinhas de nível
getProgresso(habilidade)    // 0 a 100

// catalogo.js
getTodasVagas(), getVaga(id), getVagaObjetivo()
analisarVaga(vaga, dados.habilidades)        // { porcentagem, atende, desenvolvendo, naoAtende, gaps }
```

### Criar uma página nova

1. Copie `html/skilltree.html` (a página interna mais simples) com o nome da nova página.
2. Na sidebar, coloque a classe `active` (junto de `sidebar-link`) e `aria-current="page"` **só** no item da página nova. Depois atualize o link dela na sidebar de **todas** as páginas internas.
3. Troque o conteúdo de `<main class="app-main">`, mantendo o `<header class="app-header">`.
4. Reaproveite as classes do `style.css` (`card-np`, `card-np-title`, `numero`, `barra`, `tabela-np`, `chip`, `btn-np`...). O que for só da página nova vai em `assets/css/nova-pagina.css`, carregado depois do `style.css`.
5. Crie `assets/js/nova-pagina.js` neste formato:

```javascript
function renderNovaPagina() {
    const { perfil, habilidades } = getDadosUsuario(usuario.id);
    // ... desenhe a tela a partir dos dados
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;
    renderNovaPagina();
    // ... eventos da página
});

atualizarPagina = renderNovaPagina;
```

Um link com `href="#"` mostra o aviso "Esta funcionalidade será implementada na próxima etapa", o que é útil enquanto a página ainda não existe.

### Ampliar o conhecimento da plataforma

- **Nova tecnologia reconhecida nas vagas:** adicione em `PALAVRAS_TECNOLOGIAS` (`leitor-vaga.js`) e, se quiser, a categoria em `CATEGORIAS` (`catalogo.js`).
- **Nova área com sugestões:** adicione em `TECNOLOGIAS_POR_AREA` (`catalogo.js`).
- **Conteúdo próprio para uma trilha:** adicione em `CONTEUDO_TRILHAS` (`catalogo.js`) com título, ícone do Bootstrap Icons e módulos.

---

## Limitações conhecidas

- **Segurança:** é uma simulação. As senhas ficam no `localStorage` sem criptografia e a recuperação de senha não envia e-mail.
- **Dados por navegador:** trocar de navegador ou de computador, ou limpar os dados do site, apaga as contas.
- **Leitor de vagas:** usa regras simples, então nem sempre acerta. Por exemplo, uma linha solta no fim da seção "Diferenciais" pode ser lida como diferencial. Por isso a etapa de revisão é obrigatória antes de salvar.
- **Trilhas antigas:** progresso de trilhas salvo no formato antigo (antes de as trilhas serem montadas por usuário) é ignorado. As habilidades continuam salvas.
