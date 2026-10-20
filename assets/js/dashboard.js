// Dashboard: resumo em tempo real dos dados do usuário logado.
// Nada aqui é fixo: tudo é calculado a partir de getDadosUsuario() (ver auth.js).
// Sempre que algo mudar, basta chamar renderDashboard().

// Proteção simples: sem usuário na sessão, volta para o login.
const usuario = getUsuarioLogado();
if (!usuario) {
    window.location.href = "../index.html";
}

const TEXTO_STATUS = {
    nao_iniciada: "Não iniciada",
    em_desenvolvimento: "Em desenvolvimento",
    desenvolvida: "Desenvolvida"
};

const NIVEIS = ["Estagiário", "Júnior", "Pleno", "Sênior", "Especialista"];

/* ===== Funções auxiliares ===== */

function setTexto(id, texto) {
    document.getElementById(id).textContent = texto;
}

function setLargura(id, porcentagem) {
    document.getElementById(id).style.width = porcentagem + "%";
}

// Primeira letra dos dois primeiros nomes: "Lucas Eduardo Ferreira Leal" → "LE"
function gerarIniciais(nome) {
    const partes = nome.trim().split(/\s+/);
    return (partes[0][0] + (partes.length > 1 ? partes[1][0] : "")).toUpperCase();
}

function statusPorProgresso(progresso) {
    if (progresso >= 100) return "desenvolvida";
    if (progresso > 0) return "em_desenvolvimento";
    return "nao_iniciada";
}

// Aceita habilidades vindas de outras páginas mesmo sem "progresso" ou "status".
function getProgresso(habilidade) {
    return habilidade.progresso ?? (habilidade.status === "desenvolvida" ? 100 : 0);
}

function getStatus(habilidade) {
    return habilidade.status || statusPorProgresso(getProgresso(habilidade));
}

function contarStatus(habilidades, status) {
    return habilidades.filter(habilidade => getStatus(habilidade) === status).length;
}

// Média do progresso de todas as habilidades (0 quando não há nenhuma)
function calcularProgressoGeral(habilidades) {
    if (!habilidades.length) return 0;
    const soma = habilidades.reduce((total, habilidade) => total + getProgresso(habilidade), 0);
    return Math.round(soma / habilidades.length);
}

function mostrarToast(texto) {
    setTexto("toast-texto", texto);
    bootstrap.Toast.getOrCreateInstance("#toast").show();
}

function abrirModal(id) {
    bootstrap.Modal.getOrCreateInstance(id).show();
}

/* ===== Próximos passos (mudam conforme o usuário preenche os dados) ===== */

function gerarProximosPassos(dados) {
    const { perfil, habilidades } = dados;
    const passos = [];

    if (!perfil.area || !perfil.cargoAtual || !perfil.nivel) {
        passos.push({ texto: "Complete seu perfil profissional", acao: "perfil" });
    }
    if (!habilidades.length) {
        passos.push({ texto: "Adicione suas primeiras habilidades", acao: "habilidades" });
    }
    if (!perfil.objetivo) {
        passos.push({ texto: "Defina seu objetivo profissional", acao: "perfil" });
    }

    // Tudo preenchido: sugere continuar evoluindo
    if (!passos.length) {
        const emDesenvolvimento = contarStatus(habilidades, "em_desenvolvimento");
        if (emDesenvolvimento) {
            passos.push({ texto: `Continue desenvolvendo ${emDesenvolvimento} habilidade(s)`, acao: "habilidades" });
        }
        passos.push({ texto: "Explore vagas compatíveis", acao: "vagas" });
    }

    return passos;
}

function renderProximosPassos(dados) {
    const lista = document.getElementById("lista-passos");
    lista.innerHTML = "";

    gerarProximosPassos(dados).forEach(passo => {
        const item = document.createElement("li");
        item.innerHTML = `<button class="passo" type="button" data-acao="${passo.acao}"><span></span><i class="bi bi-arrow-right"></i></button>`;
        item.querySelector("span").textContent = passo.texto;
        lista.appendChild(item);
    });
}

/* ===== Renderização principal ===== */

function renderDashboard() {
    const dados = getDadosUsuario(usuario.id);
    const { perfil, habilidades } = dados;

    const total = habilidades.length;
    const emDesenvolvimento = contarStatus(habilidades, "em_desenvolvimento");
    const naoIniciadas = contarStatus(habilidades, "nao_iniciada");
    const desenvolvidas = contarStatus(habilidades, "desenvolvida");
    const progresso = calcularProgressoGeral(habilidades);
    const contaNova = !total && !perfil.area && !perfil.cargoAtual && !perfil.nivel && !perfil.objetivo;

    // Cabeçalho
    setTexto("usuario-nome", usuario.nome);
    setTexto("usuario-iniciais", gerarIniciais(usuario.nome));
    setTexto("usuario-cargo", perfil.cargoAtual || "Perfil ainda não definido");
    setTexto("dashboard-subtitulo", contaNova
        ? "Comece preenchendo seu perfil para personalizar sua experiência no NextPath."
        : "Bem-vindo de volta! Aqui está o resumo da sua evolução.");

    // Card: progresso geral (o círculo usa a variável CSS --progresso)
    document.getElementById("progresso-circulo").style.setProperty("--progresso", progresso);
    setTexto("progresso-geral", progresso + "%");
    setTexto("total-habilidades", total);
    setTexto("em-desenvolvimento", emDesenvolvimento);
    if (contaNova) setTexto("progresso-dica", "Comece preenchendo seu perfil.");
    else if (!total) setTexto("progresso-dica", "Você ainda não adicionou habilidades.");
    else setTexto("progresso-dica", `${desenvolvidas} de ${total} habilidade(s) desenvolvida(s).`);

    // Card: próximo objetivo
    setTexto("botao-objetivo", perfil.objetivo ? "Editar" : "Definir");
    setTexto("objetivo-titulo", perfil.objetivo || "Nenhum objetivo profissional definido");
    if (!perfil.objetivo) setTexto("objetivo-descricao", "Defina onde você quer chegar profissionalmente.");
    else if (!total) setTexto("objetivo-descricao", "Adicione habilidades para acompanhar este objetivo.");
    else setTexto("objetivo-descricao", `${desenvolvidas} de ${total} habilidade(s) desenvolvida(s)`);
    setLargura("barra-objetivo", perfil.objetivo ? progresso : 0);

    // Card: resumo do perfil
    setTexto("resumo-total", total);
    setTexto("resumo-em-desenvolvimento", emDesenvolvimento);
    setTexto("resumo-nao-iniciadas", naoIniciadas);

    const proximoNivel = NIVEIS[NIVEIS.indexOf(perfil.nivel) + 1];
    setTexto("nivel-profissional", perfil.nivel || "Não definido");
    document.getElementById("nivel-profissional").classList.toggle("texto-vazio", !perfil.nivel);
    if (!perfil.nivel) setTexto("nivel-proximo", "Defina no seu perfil");
    else setTexto("nivel-proximo", proximoNivel ? "Rumo ao " + proximoNivel : "Nível máximo");
    // Evolução rumo ao próximo nível = progresso médio das habilidades
    setLargura("barra-nivel", perfil.nivel ? progresso : 0);

    // Card: próximos passos
    renderProximosPassos(dados);
}

/* ===== Modal de perfil ===== */

function preencherFormPerfil() {
    const { perfil } = getDadosUsuario(usuario.id);
    const form = document.getElementById("perfil-form");
    form.area.value = perfil.area;
    form.cargoAtual.value = perfil.cargoAtual;
    form.nivel.value = perfil.nivel;
    form.objetivo.value = perfil.objetivo;
}

function salvarPerfil(event) {
    event.preventDefault();

    const form = event.target;
    const dados = getDadosUsuario(usuario.id);
    dados.perfil = {
        area: form.area.value,
        cargoAtual: form.cargoAtual.value.trim(),
        nivel: form.nivel.value,
        objetivo: form.objetivo.value.trim()
    };
    salvarDadosUsuario(usuario.id, dados);

    bootstrap.Modal.getInstance("#modal-perfil").hide();
    renderDashboard();
    mostrarToast("Perfil atualizado!");
}

/* ===== Modal de habilidades ===== */

function textoProgresso(progresso) {
    return `${progresso}% · ${TEXTO_STATUS[statusPorProgresso(progresso)]}`;
}

function renderListaHabilidades() {
    const { habilidades } = getDadosUsuario(usuario.id);
    const lista = document.getElementById("lista-habilidades");
    const modelo = document.getElementById("modelo-habilidade");

    lista.innerHTML = "";
    document.getElementById("habilidades-vazio").hidden = habilidades.length > 0;

    habilidades.forEach((habilidade, indice) => {
        const item = modelo.content.cloneNode(true).querySelector("li");
        item.dataset.indice = indice;
        item.querySelector(".habilidade-nome").textContent = habilidade.nome;
        item.querySelector(".habilidade-categoria").textContent = habilidade.categoria || "";
        item.querySelector(".habilidade-progresso").value = getProgresso(habilidade);
        item.querySelector(".habilidade-status").textContent = textoProgresso(getProgresso(habilidade));
        lista.appendChild(item);
    });
}

function adicionarHabilidade(event) {
    event.preventDefault();

    const form = event.target;
    const nome = form.nome.value.trim();
    const progresso = Number(form.progresso.value);
    const dados = getDadosUsuario(usuario.id);

    if (!nome) {
        mostrarMensagem("habilidade-message", "Informe o nome da habilidade.", "is-error");
        return;
    }
    if (dados.habilidades.some(h => h.nome.toLowerCase() === nome.toLowerCase())) {
        mostrarMensagem("habilidade-message", "Essa habilidade já foi adicionada.", "is-error");
        return;
    }

    dados.habilidades.push({
        nome,
        categoria: form.categoria.value,
        progresso,
        status: statusPorProgresso(progresso)
    });
    salvarDadosUsuario(usuario.id, dados);

    mostrarMensagem("habilidade-message", `${nome} adicionada!`, "is-success");
    form.nome.value = "";
    form.progresso.value = 0;
    setTexto("habilidade-progresso-texto", textoProgresso(0));
    form.nome.focus();

    renderListaHabilidades();
    renderDashboard();
}

// Arrastar a barra de uma habilidade já salva atualiza o Dashboard na hora.
function alterarProgresso(event) {
    if (!event.target.classList.contains("habilidade-progresso")) return;

    const item = event.target.closest("li");
    const progresso = Number(event.target.value);
    const dados = getDadosUsuario(usuario.id);
    const habilidade = dados.habilidades[item.dataset.indice];

    habilidade.progresso = progresso;
    habilidade.status = statusPorProgresso(progresso);
    salvarDadosUsuario(usuario.id, dados);

    item.querySelector(".habilidade-status").textContent = textoProgresso(progresso);
    renderDashboard();
}

function removerHabilidade(event) {
    const botao = event.target.closest(".btn-remover");
    if (!botao) return;

    const dados = getDadosUsuario(usuario.id);
    dados.habilidades.splice(botao.closest("li").dataset.indice, 1);
    salvarDadosUsuario(usuario.id, dados);

    renderListaHabilidades();
    renderDashboard();
}

/* ===== Eventos ===== */

function executarPasso(event) {
    const botao = event.target.closest(".passo");
    if (!botao) return;

    if (botao.dataset.acao === "perfil") abrirModal("#modal-perfil");
    if (botao.dataset.acao === "habilidades") abrirModal("#modal-habilidades");
    if (botao.dataset.acao === "vagas") mostrarToast("Esta funcionalidade será implementada na próxima etapa.");
}

function avisarPaginaFutura(event) {
    event.preventDefault();
    mostrarToast("Esta funcionalidade será implementada na próxima etapa.");
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderDashboard();
    renderListaHabilidades();

    document.getElementById("botao-sair").addEventListener("click", logout);
    document.getElementById("lista-passos").addEventListener("click", executarPasso);
    document.querySelectorAll('.sidebar-link[href="#"]').forEach(link => {
        link.addEventListener("click", avisarPaginaFutura);
    });

    document.getElementById("modal-perfil").addEventListener("show.bs.modal", preencherFormPerfil);
    document.getElementById("perfil-form").addEventListener("submit", salvarPerfil);

    document.getElementById("habilidade-form").addEventListener("submit", adicionarHabilidade);
    document.getElementById("habilidade-progresso").addEventListener("input", event => {
        setTexto("habilidade-progresso-texto", textoProgresso(Number(event.target.value)));
    });
    document.getElementById("lista-habilidades").addEventListener("input", alterarProgresso);
    document.getElementById("lista-habilidades").addEventListener("click", removerHabilidade);
});

// Se os dados mudarem em outra aba (ex.: futura página de habilidades), atualiza aqui também.
window.addEventListener("storage", () => {
    if (usuario) renderDashboard();
});
