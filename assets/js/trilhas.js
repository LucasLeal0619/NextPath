// Trilhas Recomendadas: trilhas do catálogo que ajudam a fechar os gaps da vaga escolhida.
// O progresso fica em dados.trilhas: { docker: [0, 1] } = módulos 0 e 1 concluídos.
// Ao concluir todos os módulos, a habilidade da trilha sobe para o nível da trilha.

let mostrarTodas = false;   // botão "Ver todas as trilhas"
let trilhaAberta = null;    // trilha exibida no modal

function getModulosConcluidos(dados, trilha) {
    return dados.trilhas[trilha.id] || [];
}

function getProgressoTrilha(dados, trilha) {
    return Math.round(getModulosConcluidos(dados, trilha).length / trilha.modulos.length * 100);
}

// Recomendadas = trilhas dos gaps da vaga + trilhas já iniciadas e não concluídas.
function getTrilhasRecomendadas(dados, vaga) {
    const gaps = vaga ? analisarVaga(vaga, dados.habilidades).gaps.map(gap => gap.nome) : [];
    return TRILHAS.filter(trilha => {
        const progresso = getProgressoTrilha(dados, trilha);
        return gaps.includes(trilha.habilidade) || (progresso > 0 && progresso < 100);
    });
}

function renderTrilhas() {
    const dados = getDadosUsuario(usuario.id);
    const vaga = getVagaSelecionada();
    const lista = mostrarTodas ? TRILHAS : getTrilhasRecomendadas(dados, vaga);
    const container = document.getElementById("lista-trilhas");
    const modelo = document.getElementById("modelo-trilha");

    setTexto("trilhas-subtitulo", mostrarTodas
        ? "Todas as trilhas disponíveis na plataforma."
        : vaga ? `Trilhas de estudo personalizadas para fechar seus gaps em ${vaga.titulo}.`
               : "Trilhas de estudo personalizadas para fechar seus gaps.");

    container.innerHTML = "";
    lista.forEach((trilha, indice) => {
        const progresso = getProgressoTrilha(dados, trilha);
        const card = modelo.content.cloneNode(true).querySelector("div");
        const cor = ["azul", "roxo", "ciano"][indice % 3];

        card.querySelector(".trilha").classList.add(cor);
        card.querySelector(".icone-quadrado i").classList.add(trilha.icone);
        card.querySelector(".trilha-titulo").textContent = trilha.titulo;
        card.querySelector(".trilha-nivel").textContent = `${trilha.habilidade} • até ${NIVEIS_HABILIDADE[trilha.nivelAlvo]}`;
        card.querySelector(".trilha-porcentagem").textContent = progresso + "%";
        card.querySelector(".barra-preenchida").style.width = progresso + "%";

        const botao = card.querySelector("button");
        botao.dataset.id = trilha.id;
        botao.textContent = progresso === 0 ? "Iniciar trilha" : progresso === 100 ? "Revisar trilha" : "Continuar trilha";

        container.appendChild(card);
    });

    // Estado vazio: sem vaga escolhida ou vaga sem gaps
    document.getElementById("trilhas-vazio").hidden = lista.length > 0;
    if (!vaga) {
        setTexto("trilhas-vazio-titulo", "Nenhuma vaga selecionada");
        setTexto("trilhas-vazio-texto", "Escolha uma vaga para receber trilhas que fecham os seus gaps.");
        document.getElementById("trilhas-vazio-link").hidden = false;
    } else {
        setTexto("trilhas-vazio-titulo", "Nenhum gap para estudar");
        setTexto("trilhas-vazio-texto", "Você já atende aos requisitos desta vaga. Explore outras trilhas abaixo.");
        document.getElementById("trilhas-vazio-link").hidden = true;
    }

    setTexto("explorar-titulo", mostrarTodas ? "Voltar às recomendações?" : "Quer explorar mais opções?");
    setTexto("explorar-texto", mostrarTodas ? "Veja só as trilhas indicadas para os seus gaps." : "Veja todas as trilhas disponíveis na plataforma.");
    setTexto("botao-todas", mostrarTodas ? "Ver recomendadas" : "Ver todas as trilhas");
}

/* ===== Modal com os módulos ===== */

function abrirTrilha(event) {
    const botao = event.target.closest("button[data-id]");
    if (!botao) return;

    trilhaAberta = TRILHAS.find(trilha => trilha.id === botao.dataset.id);
    const concluidos = getModulosConcluidos(getDadosUsuario(usuario.id), trilhaAberta);
    const modulos = document.getElementById("modal-trilha-modulos");

    setTexto("modal-trilha-titulo", trilhaAberta.titulo);
    setTexto("modal-trilha-alvo", `Ao concluir, ${trilhaAberta.habilidade} vai para o nível ${NIVEIS_HABILIDADE[trilhaAberta.nivelAlvo]}.`);

    modulos.innerHTML = "";
    trilhaAberta.modulos.forEach((nome, indice) => {
        const item = document.createElement("div");
        item.className = "form-check modulo";
        item.innerHTML = `<input class="form-check-input" type="checkbox" id="modulo-${indice}" value="${indice}"><label class="form-check-label" for="modulo-${indice}"></label>`;
        item.querySelector("input").checked = concluidos.includes(indice);
        item.querySelector("label").textContent = `${indice + 1}. ${nome}`;
        modulos.appendChild(item);
    });

    atualizarBarraModal();
    bootstrap.Modal.getOrCreateInstance("#modal-trilha").show();
}

function atualizarBarraModal() {
    const progresso = getProgressoTrilha(getDadosUsuario(usuario.id), trilhaAberta);
    setTexto("modal-trilha-porcentagem", progresso + "%");
    document.getElementById("modal-trilha-barra").style.width = progresso + "%";
}

// Sobe a habilidade da trilha para o nível alvo (ou a adiciona, se o usuário ainda não tiver).
function aplicarConclusao(dados, trilha) {
    let habilidade = dados.habilidades.find(h => h.nome.trim().toLowerCase() === trilha.habilidade.toLowerCase());
    if (!habilidade) {
        habilidade = { nome: trilha.habilidade, categoria: CATEGORIAS[trilha.habilidade] || "Outras" };
        dados.habilidades.push(habilidade);
    }
    if (getPontos(habilidade) < trilha.nivelAlvo) {
        habilidade.progresso = trilha.nivelAlvo * 20;
        habilidade.status = statusPorProgresso(habilidade.progresso);
        return true;
    }
    return false;
}

function marcarModulo() {
    const dados = getDadosUsuario(usuario.id);
    const concluidos = Array.from(document.querySelectorAll("#modal-trilha-modulos input:checked"), input => Number(input.value));
    const estavaCompleta = getProgressoTrilha(dados, trilhaAberta) === 100;

    dados.trilhas[trilhaAberta.id] = concluidos;
    const ficouCompleta = concluidos.length === trilhaAberta.modulos.length;
    const subiuNivel = ficouCompleta && !estavaCompleta && aplicarConclusao(dados, trilhaAberta);
    salvarDadosUsuario(usuario.id, dados);

    atualizarBarraModal();
    renderTrilhas();

    if (subiuNivel) {
        mostrarToast(`Trilha concluída! ${trilhaAberta.habilidade} agora está no nível ${NIVEIS_HABILIDADE[trilhaAberta.nivelAlvo]}.`);
    } else if (ficouCompleta && !estavaCompleta) {
        mostrarToast("Trilha concluída!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderTrilhas();

    document.getElementById("lista-trilhas").addEventListener("click", abrirTrilha);
    document.getElementById("modal-trilha-modulos").addEventListener("change", marcarModulo);
    document.getElementById("botao-todas").addEventListener("click", () => {
        mostrarTodas = !mostrarTodas;
        renderTrilhas();
    });
});

window.addEventListener("storage", () => {
    if (usuario) renderTrilhas();
});
