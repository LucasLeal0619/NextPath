// Dashboard: resumo em tempo real dos dados do usuário logado.
// Nada aqui é fixo: tudo é calculado a partir de getDadosUsuario() (ver auth.js).
// Proteção da página, cabeçalho e funções de habilidades ficam no app.js.

const NIVEIS_PROFISSIONAIS = ["Estagiário", "Júnior", "Pleno", "Sênior", "Especialista"];

function setLargura(id, porcentagem) {
    document.getElementById(id).style.width = porcentagem + "%";
}

// Média do progresso de todas as habilidades (0 quando não há nenhuma)
function calcularProgressoGeral(habilidades) {
    if (!habilidades.length) return 0;
    const soma = habilidades.reduce((total, habilidade) => total + getProgresso(habilidade), 0);
    return Math.round(soma / habilidades.length);
}

/* ===== Próximos passos (mudam conforme o usuário preenche os dados) ===== */

function gerarProximosPassos(perfil, habilidades) {
    const passos = [];

    if (!perfil.area || !perfil.cargoAtual || !perfil.nivel) {
        passos.push({ texto: "Complete seu perfil profissional", link: "perfil.html" });
    }
    if (!habilidades.length) {
        passos.push({ texto: "Adicione suas primeiras habilidades", link: "habilidades.html" });
    }
    if (!perfil.objetivo) {
        passos.push({ texto: "Defina seu objetivo profissional", link: "perfil.html" });
    }

    // Tudo preenchido: sugere continuar evoluindo
    if (!passos.length) {
        const emDesenvolvimento = contarStatus(habilidades, "em_desenvolvimento");
        if (emDesenvolvimento) {
            passos.push({ texto: `Continue desenvolvendo ${emDesenvolvimento} habilidade(s)`, link: "habilidades.html" });
        }
        passos.push({ texto: "Veja sua SkillTree", link: "skilltree.html" });
        passos.push({ texto: "Explore vagas compatíveis", link: "vagas.html" });
    }

    return passos;
}

function renderProximosPassos(perfil, habilidades) {
    const lista = document.getElementById("lista-passos");
    lista.innerHTML = "";

    gerarProximosPassos(perfil, habilidades).forEach(passo => {
        const item = document.createElement("li");
        item.innerHTML = `<a class="passo" href="${passo.link}"><span></span><i class="bi bi-arrow-right"></i></a>`;
        item.querySelector("span").textContent = passo.texto;
        lista.appendChild(item);
    });
}

/* ===== Renderização principal ===== */

function renderDashboard() {
    const { perfil, habilidades } = getDadosUsuario(usuario.id);

    const total = habilidades.length;
    const emDesenvolvimento = contarStatus(habilidades, "em_desenvolvimento");
    const naoIniciadas = contarStatus(habilidades, "nao_iniciada");
    const desenvolvidas = contarStatus(habilidades, "desenvolvida");
    const progresso = calcularProgressoGeral(habilidades);
    const contaNova = !total && !perfil.area && !perfil.cargoAtual && !perfil.nivel && !perfil.objetivo;

    // Cabeçalho
    renderCabecalho();
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

    const proximoNivel = NIVEIS_PROFISSIONAIS[NIVEIS_PROFISSIONAIS.indexOf(perfil.nivel) + 1];
    setTexto("nivel-profissional", perfil.nivel || "Não definido");
    document.getElementById("nivel-profissional").classList.toggle("texto-vazio", !perfil.nivel);
    if (!perfil.nivel) setTexto("nivel-proximo", "Defina no seu perfil");
    else setTexto("nivel-proximo", proximoNivel ? "Rumo ao " + proximoNivel : "Nível máximo");
    // Evolução rumo ao próximo nível = progresso médio das habilidades
    setLargura("barra-nivel", perfil.nivel ? progresso : 0);

    // Card: próximos passos
    renderProximosPassos(perfil, habilidades);
}

document.addEventListener("DOMContentLoaded", () => {
    if (usuario) renderDashboard();
});

// Se os dados mudarem em outra aba (ex.: página de habilidades), atualiza aqui também.
window.addEventListener("storage", () => {
    if (usuario) renderDashboard();
});
