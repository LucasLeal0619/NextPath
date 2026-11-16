// Código comum a todas as páginas internas (Dashboard, Perfil, Habilidades, SkillTree...).
// Ordem dos scripts em cada página: bootstrap → auth.js → app.js → JS da página.

// Proteção simples: sem usuário na sessão, volta para o login.
// (Não é segurança real, apenas controle de navegação do MVP.)
const usuario = getUsuarioLogado();
if (!usuario) {
    window.location.href = "../index.html";
}

/* ===== Funções auxiliares ===== */

function setTexto(id, texto) {
    document.getElementById(id).textContent = texto;
}

// Primeira letra dos dois primeiros nomes: "Lucas Eduardo Ferreira Leal" → "LE"
function gerarIniciais(nome) {
    const partes = nome.trim().split(/\s+/);
    return (partes[0][0] + (partes.length > 1 ? partes[1][0] : "")).toUpperCase();
}

function mostrarToast(texto) {
    setTexto("toast-texto", texto);
    bootstrap.Toast.getOrCreateInstance("#toast").show();
}

/* ===== Habilidades =====
   Cada habilidade tem um nível de 0 a 5 pontos (bolinhas).
   O progresso salvo é pontos × 20 (0%, 20%, ... 100%). */

const NIVEIS_HABILIDADE = ["Não iniciada", "Iniciante", "Básico", "Intermediário", "Proficiente", "Avançado"];

// Aceita habilidades mesmo sem "progresso" ou "status" (ex.: criadas por outra página).
function getProgresso(habilidade) {
    return habilidade.progresso ?? (habilidade.status === "desenvolvida" ? 100 : 0);
}

function getPontos(habilidade) {
    return Math.round(getProgresso(habilidade) / 20);
}

function statusPorProgresso(progresso) {
    if (progresso >= 100) return "desenvolvida";
    if (progresso > 0) return "em_desenvolvimento";
    return "nao_iniciada";
}

function getStatus(habilidade) {
    return habilidade.status || statusPorProgresso(getProgresso(habilidade));
}

function contarStatus(habilidades, status) {
    return habilidades.filter(habilidade => getStatus(habilidade) === status).length;
}

// HTML das 5 bolinhas de nível. Ex.: gerarPontos(3) → ●●●○○
function gerarPontos(pontos) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        html += `<i class="ponto ${i <= pontos ? "ativo" : ""}"></i>`;
    }
    return `<span class="pontos" title="${NIVEIS_HABILIDADE[pontos]}">${html}</span>`;
}

// Legenda das bolinhas (usada em Habilidades e SkillTree)
function renderLegenda(id) {
    let html = "<strong>Legenda:</strong>";
    for (let pontos = 5; pontos >= 1; pontos--) {
        html += `<span>${gerarPontos(pontos)} ${NIVEIS_HABILIDADE[pontos]}</span>`;
    }
    document.getElementById(id).innerHTML = html;
}

/* ===== Cabeçalho e sidebar ===== */

function renderCabecalho() {
    const { perfil } = getDadosUsuario(usuario.id);
    setTexto("usuario-nome", usuario.nome);
    setTexto("usuario-iniciais", gerarIniciais(usuario.nome));
    setTexto("usuario-cargo", perfil.cargoAtual || "Perfil ainda não definido");
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderCabecalho();
    document.getElementById("botao-sair").addEventListener("click", logout);

    // Qualquer link com href="#" é de uma página que ainda não existe.
    document.addEventListener("click", event => {
        if (event.target.closest('a[href="#"]')) {
            event.preventDefault();
            mostrarToast("Esta funcionalidade será implementada na próxima etapa.");
        }
    });
});
