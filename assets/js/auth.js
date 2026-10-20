// Autenticação e dados do usuário, simulados no navegador (projeto acadêmico).
// NÃO é uma autenticação segura para produção.
//
// localStorage
//   nextpath_usuarios      → lista de contas: { id, nome, email, senha }
//   nextpath_dados_{id}    → dados de cada usuário: { perfil, habilidades }
// sessionStorage
//   nextpath_usuario_logado → conta que está logada agora
//   nextpath_aviso          → mensagem para mostrar na próxima página (ex.: "Senha redefinida")

const CHAVE_USUARIOS = "nextpath_usuarios";
const CHAVE_SESSAO = "nextpath_usuario_logado";
const CHAVE_AVISO = "nextpath_aviso";

/* ===== Contas ===== */

function getUsuarios() {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

function getUsuarioLogado() {
    return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO));
}

// Limpa somente a sessão: conta, perfil e habilidades continuam salvos.
function logout() {
    sessionStorage.removeItem(CHAVE_SESSAO);
    sessionStorage.setItem(CHAVE_AVISO, "Você saiu da sua conta.");
    window.location.href = "../index.html";
}

/* ===== Dados de cada usuário (usados por todas as páginas internas) ===== */

// Estado inicial de uma conta nova: tudo vazio, nada inventado.
function criarDadosIniciais() {
    return {
        perfil: { area: "", cargoAtual: "", nivel: "", objetivo: "" },
        habilidades: []
    };
}

function getDadosUsuario(id) {
    return JSON.parse(localStorage.getItem(`nextpath_dados_${id}`)) || criarDadosIniciais();
}

function salvarDadosUsuario(id, dados) {
    localStorage.setItem(`nextpath_dados_${id}`, JSON.stringify(dados));
}

/* ===== Mensagens ===== */

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// tipo: "is-error" ou "is-success"
function mostrarMensagem(id, texto, tipo) {
    const elemento = document.getElementById(id);
    elemento.textContent = texto;
    elemento.className = "auth-message " + tipo;
}

// Guarda uma mensagem e vai para outra página, que vai exibi-la.
function redirecionarComAviso(url, aviso) {
    sessionStorage.setItem(CHAVE_AVISO, aviso);
    setTimeout(() => window.location.href = url, 1200);
}

/* ===== Login ===== */

function login(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value.trim().toLowerCase();
    const senha = form.senha.value;

    if (!validarEmail(email) || !senha) {
        mostrarMensagem("login-message", "Informe um e-mail válido e sua senha.", "is-error");
        return;
    }

    const usuario = getUsuarios().find(user => user.email === email && user.senha === senha);

    if (!usuario) {
        mostrarMensagem("login-message", "E-mail ou senha incorretos.", "is-error");
        return;
    }

    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
    window.location.href = "html/dashboard.html";
}

/* ===== Cadastro ===== */

function cadastrarUsuario(event) {
    event.preventDefault();

    const form = event.target;
    const nome = form.nome.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const senha = form.senha.value;
    const usuarios = getUsuarios();
    let erro = "";

    if (!nome) erro = "O nome completo é obrigatório.";
    else if (!validarEmail(email)) erro = "Informe um e-mail válido.";
    else if (senha.length < 6) erro = "A senha deve ter pelo menos 6 caracteres.";
    else if (senha !== form.confirmarSenha.value) erro = "As senhas não coincidem.";
    else if (!form.termos.checked) erro = "Você deve aceitar os termos de uso.";
    else if (usuarios.some(user => user.email === email)) erro = "Já existe uma conta com este e-mail.";

    if (erro) {
        mostrarMensagem("signup-message", erro, "is-error");
        return;
    }

    const novoUsuario = { id: Date.now(), nome, email, senha };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    salvarDadosUsuario(novoUsuario.id, criarDadosIniciais());

    mostrarMensagem("signup-message", "Conta criada com sucesso! Redirecionando para o login...", "is-success");
    redirecionarComAviso("../index.html", "Conta criada! Entre com seu e-mail e senha.");
}

/* ===== Recuperação de senha ===== */

// Passo 1: confere se o e-mail existe e abre o modal de nova senha.
function recuperarSenha(event) {
    event.preventDefault();

    const email = event.target.email.value.trim().toLowerCase();

    if (!validarEmail(email)) {
        mostrarMensagem("recovery-message", "Informe um e-mail válido.", "is-error");
        return;
    }

    if (!getUsuarios().some(user => user.email === email)) {
        mostrarMensagem("recovery-message", "Usuário não encontrado.", "is-error");
        return;
    }

    mostrarMensagem("recovery-message", "", "");
    bootstrap.Modal.getOrCreateInstance("#modal-nova-senha").show();
}

// Passo 2: salva a nova senha do usuário no localStorage.
function redefinirSenha(event) {
    event.preventDefault();

    const form = event.target;
    const novaSenha = form.novaSenha.value;
    const email = document.getElementById("recovery-email").value.trim().toLowerCase();

    if (novaSenha.length < 6) {
        mostrarMensagem("nova-senha-message", "A senha deve ter pelo menos 6 caracteres.", "is-error");
        return;
    }

    if (novaSenha !== form.confirmarNovaSenha.value) {
        mostrarMensagem("nova-senha-message", "As senhas não coincidem.", "is-error");
        return;
    }

    const usuarios = getUsuarios();
    usuarios.find(user => user.email === email).senha = novaSenha;
    salvarUsuarios(usuarios);

    mostrarMensagem("nova-senha-message", "Senha alterada com sucesso! Redirecionando para o login...", "is-success");
    redirecionarComAviso("../index.html", "Senha redefinida! Entre com a nova senha.");
}

/* ===== Eventos ===== */

// Cada página só possui alguns destes formulários; o "?." ignora os que não existem.
document.getElementById("login-form")?.addEventListener("submit", login);
document.getElementById("signup-form")?.addEventListener("submit", cadastrarUsuario);
document.getElementById("recovery-form")?.addEventListener("submit", recuperarSenha);
document.getElementById("nova-senha-form")?.addEventListener("submit", redefinirSenha);

// No login, mostra o aviso deixado pela página anterior (cadastro, recuperação ou logout).
const aviso = sessionStorage.getItem(CHAVE_AVISO);
if (aviso && document.getElementById("login-form")) {
    mostrarMensagem("login-message", aviso, "is-success");
    sessionStorage.removeItem(CHAVE_AVISO);
}
