// Vagas: lista as vagas do usuário com a compatibilidade calculada a partir das habilidades dele,
// e permite adicionar uma vaga colando o texto dela (organizado pelo leitor-vaga.js).
// Não há vagas prontas: cada usuário monta a sua lista.
// Abrir com ?adicionar=1 abre o modal; com ?editar=ID abre a vaga para edição.

let vagaEmEdicao = null;        // null = vaga nova
let tecnologiasEmEdicao = [];   // tecnologias mostradas na etapa de revisão

/* ===== Lista de vagas ===== */

// Junta título, empresa, local e tecnologias para a busca por texto.
function textoDaVaga(vaga) {
    const tecnologias = vaga.tecnologias.map(tecnologia => tecnologia.nome).join(" ");
    return `${vaga.titulo} ${vaga.empresa} ${vaga.local} ${tecnologias}`.toLowerCase();
}

function renderVagas() {
    const { habilidades, vagas, perfil } = getDadosUsuario(usuario.id);
    const busca = document.getElementById("busca-vaga").value.trim().toLowerCase();
    const modalidade = document.getElementById("filtro-modalidade").value;
    const senioridade = document.getElementById("filtro-senioridade").value;
    const ordem = document.getElementById("filtro-ordem").value;

    // Filtra e calcula a compatibilidade de cada vaga
    const lista = vagas
        .filter(vaga => !busca || textoDaVaga(vaga).includes(busca))
        .filter(vaga => !modalidade || vaga.modalidade === modalidade)
        .filter(vaga => !senioridade || vaga.senioridade === senioridade)
        .map(vaga => ({ vaga, compatibilidade: analisarVaga(vaga, habilidades).porcentagem }));

    if (ordem === "compatibilidade") lista.sort((a, b) => b.compatibilidade - a.compatibilidade);
    else lista.sort((a, b) => diasDesde(a.vaga) - diasDesde(b.vaga));

    const tabela = document.getElementById("tabela-vagas");
    const modelo = document.getElementById("modelo-vaga");
    tabela.innerHTML = "";

    lista.forEach(({ vaga, compatibilidade }) => {
        const linha = modelo.content.cloneNode(true).querySelector("tr");
        linha.querySelector(".coluna-titulo").textContent = vaga.titulo;
        linha.querySelector(".vaga-compatibilidade").textContent = `Compatibilidade estimada: ${compatibilidade}%`;
        linha.querySelector(".coluna-empresa").textContent = vaga.empresa || "—";
        linha.querySelector(".coluna-local").textContent = vaga.local || "—";

        // Etiquetas "Objetivo" e "Perfil-alvo" (vaga gerada a partir do objetivo)
        const titulo = linha.querySelector(".coluna-titulo");
        if (String(perfil.vagaObjetivo) === String(vaga.id)) titulo.insertAdjacentHTML("beforeend", ` <span class="etiqueta etiqueta-objetivo"><i class="bi bi-star-fill"></i> Objetivo</span>`);
        if (vaga.gerada) titulo.insertAdjacentHTML("beforeend", ` <span class="etiqueta">Perfil-alvo</span>`);

        const badge = linha.querySelector(".badge-modalidade");
        badge.textContent = vaga.modalidade || "Não informada";
        badge.classList.add({ "Remoto": "remoto", "Híbrido": "hibrido" }[vaga.modalidade] || "presencial");

        linha.querySelector(".btn-contorno").href = `detalhes-vaga.html?id=${vaga.id}`;
        tabela.appendChild(linha);
    });

    document.querySelector(".tabela-np").hidden = lista.length === 0;
    document.getElementById("minhas-vazio").hidden = vagas.length > 0;
    document.getElementById("vagas-vazio").hidden = lista.length > 0 || vagas.length === 0;
    document.getElementById("busca-e-filtros").hidden = vagas.length === 0;
    document.getElementById("aviso-sem-habilidades").hidden = habilidades.length > 0 || vagas.length === 0;
}

/* ===== Modal: etapas ===== */

function mostrarEtapa(etapa) {
    const revisando = etapa === "revisar";
    document.getElementById("etapa-colar").hidden = revisando;
    document.getElementById("vaga-form").hidden = !revisando;
    document.getElementById("botao-organizar").hidden = revisando;
    document.getElementById("botao-salvar-vaga").hidden = !revisando;
    document.getElementById("botao-voltar").hidden = !revisando || Boolean(vagaEmEdicao);
    document.getElementById("botao-excluir-vaga").hidden = !vagaEmEdicao;
}

function abrirModalNovaVaga() {
    vagaEmEdicao = null;
    document.getElementById("texto-vaga").value = "";
    mostrarMensagem("colar-message", "", "");
    setTexto("modal-vaga-titulo", "Adicionar vaga");
    setTexto("modal-vaga-subtitulo", "Cole o texto da vaga e o NextPath organiza as informações para você.");
    mostrarEtapa("colar");
    bootstrap.Modal.getOrCreateInstance("#modal-vaga").show();
}

function abrirModalEdicao(vaga) {
    vagaEmEdicao = vaga;
    setTexto("modal-vaga-titulo", "Editar vaga");
    setTexto("modal-vaga-subtitulo", "");
    preencherFormulario(vaga);
    document.getElementById("resumo-leitura").hidden = true;
    mostrarEtapa("revisar");
    bootstrap.Modal.getOrCreateInstance("#modal-vaga").show();
}

// Etapa 1 → 2: lê o texto colado e mostra o resultado para revisão.
function organizarVaga() {
    const texto = document.getElementById("texto-vaga").value.trim();

    if (texto.length < 40) {
        mostrarMensagem("colar-message", "Cole o texto completo da vaga (título, descrição, requisitos...).", "is-error");
        return;
    }

    const vaga = lerVaga(texto);
    preencherFormulario(vaga);

    const resumo = document.getElementById("resumo-leitura");
    resumo.hidden = false;
    resumo.innerHTML = `<i class="bi bi-magic"></i><span></span>`;
    resumo.querySelector("span").textContent = vaga.tecnologias.length
        ? `Encontramos ${vaga.tecnologias.length} tecnologia(s). Confira e corrija o que for preciso antes de salvar.`
        : "Não encontramos tecnologias conhecidas no texto. Adicione-as abaixo antes de salvar.";

    setTexto("modal-vaga-subtitulo", "Revise as informações organizadas.");
    mostrarEtapa("revisar");
}

function preencherFormulario(vaga) {
    const form = document.getElementById("vaga-form");
    const { perfil } = getDadosUsuario(usuario.id);

    form.titulo.value = vaga.titulo || "";
    form.empresa.value = vaga.empresa || "";
    form.local.value = vaga.local || "";
    form.modalidade.value = vaga.modalidade || "";
    form.senioridade.value = vaga.senioridade || "";
    form.tipo.value = vaga.tipo || "";
    form.descricao.value = vaga.descricao || "";
    form.requisitos.value = (vaga.requisitos || []).join("\n");
    form.diferenciais.value = (vaga.diferenciais || []).join("\n");
    form.atividades.value = (vaga.atividades || []).join("\n");
    // Vaga nova já vem marcada como objetivo se o usuário ainda não tem um
    form.objetivo.checked = vaga.id ? String(perfil.vagaObjetivo) === String(vaga.id) : !perfil.vagaObjetivo;
    mostrarMensagem("vaga-message", "", "");

    tecnologiasEmEdicao = vaga.tecnologias.map(tecnologia => ({ ...tecnologia }));
    renderTecnologias();
}

/* ===== Modal: lista de tecnologias editável ===== */

function renderTecnologias() {
    const lista = document.getElementById("lista-tecnologias");
    lista.innerHTML = "";

    tecnologiasEmEdicao.forEach((tecnologia, indice) => {
        let opcoes = "";
        for (let nivel = 1; nivel <= 5; nivel++) {
            opcoes += `<option value="${nivel}" ${nivel === tecnologia.nivel ? "selected" : ""}>${NIVEIS_HABILIDADE[nivel]}</option>`;
        }

        const item = document.createElement("li");
        item.className = "tecnologia-item";
        item.dataset.indice = indice;
        item.innerHTML = `
            <strong></strong>
            <select class="form-select" data-campo="nivel" aria-label="Nível exigido">${opcoes}</select>
            <label class="form-check m-0"><input class="form-check-input" type="checkbox" data-campo="desejavel" ${tecnologia.desejavel ? "checked" : ""}> <span class="form-check-label">Diferencial</span></label>
            <button class="btn-remover" type="button" aria-label="Remover tecnologia"><i class="bi bi-x-lg"></i></button>`;
        item.querySelector("strong").textContent = tecnologia.nome;
        lista.appendChild(item);
    });

    // Sugestões: tecnologias conhecidas que ainda não estão na lista
    const usadas = tecnologiasEmEdicao.map(tecnologia => tecnologia.nome);
    document.getElementById("sugestoes-tecnologias").innerHTML = Object.keys(PALAVRAS_TECNOLOGIAS)
        .filter(nome => !usadas.includes(nome))
        .map(nome => `<option value="${nome}">`)
        .join("");
}

function adicionarTecnologia() {
    const campo = document.getElementById("nova-tecnologia");
    const nome = campo.value.trim();
    if (!nome || tecnologiasEmEdicao.some(t => t.nome.toLowerCase() === nome.toLowerCase())) return;

    const senioridade = document.getElementById("vaga-senioridade").value;
    tecnologiasEmEdicao.push({ nome, nivel: NIVEL_POR_SENIORIDADE[senioridade] || 2, desejavel: false });
    campo.value = "";
    renderTecnologias();
}

// Mudança de nível/diferencial ou clique em remover, em qualquer linha da lista.
function editarTecnologia(event) {
    const item = event.target.closest(".tecnologia-item");
    if (!item) return;
    const tecnologia = tecnologiasEmEdicao[item.dataset.indice];

    if (event.type === "click" && event.target.closest(".btn-remover")) {
        tecnologiasEmEdicao.splice(item.dataset.indice, 1);
        renderTecnologias();
    } else if (event.target.dataset.campo === "nivel") {
        tecnologia.nivel = Number(event.target.value);
    } else if (event.target.dataset.campo === "desejavel") {
        tecnologia.desejavel = event.target.checked;
    }
}

/* ===== Modal: salvar e excluir ===== */

// "linha 1\nlinha 2" → ["linha 1", "linha 2"]
function linhasDoTexto(texto) {
    return texto.split("\n").map(linha => linha.trim()).filter(Boolean);
}

function salvarVaga(event) {
    event.preventDefault();

    const form = event.target;
    const titulo = form.titulo.value.trim();

    if (!titulo) {
        mostrarMensagem("vaga-message", "Informe o título da vaga.", "is-error");
        return;
    }
    if (!tecnologiasEmEdicao.length) {
        mostrarMensagem("vaga-message", "Adicione pelo menos uma tecnologia para calcular a compatibilidade.", "is-error");
        return;
    }

    const vaga = {
        id: vagaEmEdicao ? vagaEmEdicao.id : "v" + Date.now(),
        minha: true,
        gerada: vagaEmEdicao ? Boolean(vagaEmEdicao.gerada) : false,
        adicionadaEm: vagaEmEdicao ? vagaEmEdicao.adicionadaEm : Date.now(),
        titulo,
        empresa: form.empresa.value.trim(),
        local: form.local.value.trim(),
        modalidade: form.modalidade.value,
        senioridade: form.senioridade.value,
        tipo: form.tipo.value,
        descricao: form.descricao.value.trim(),
        requisitos: linhasDoTexto(form.requisitos.value),
        diferenciais: linhasDoTexto(form.diferenciais.value),
        atividades: linhasDoTexto(form.atividades.value),
        tecnologias: tecnologiasEmEdicao
    };

    const dados = getDadosUsuario(usuario.id);
    const posicao = dados.vagas.findIndex(v => v.id === vaga.id);
    if (posicao >= 0) dados.vagas[posicao] = vaga;
    else dados.vagas.unshift(vaga);

    // Vaga-objetivo: as trilhas recomendadas passam a ser baseadas nela
    if (form.objetivo.checked) {
        dados.perfil.vagaObjetivo = vaga.id;
        dados.perfil.objetivo = vaga.titulo;
    } else if (dados.perfil.vagaObjetivo === vaga.id) {
        dados.perfil.vagaObjetivo = null;
    }

    salvarDadosUsuario(usuario.id, dados);
    sessionStorage.setItem(CHAVE_AVISO, vagaEmEdicao ? "Vaga atualizada!" : "Vaga adicionada!");
    window.location.href = `detalhes-vaga.html?id=${vaga.id}`;
}

function excluirVaga() {
    const dados = getDadosUsuario(usuario.id);
    dados.vagas = dados.vagas.filter(vaga => vaga.id !== vagaEmEdicao.id);
    if (dados.perfil.vagaObjetivo === vagaEmEdicao.id) dados.perfil.vagaObjetivo = null;
    if (dados.vagaSelecionada === vagaEmEdicao.id) dados.vagaSelecionada = null;
    salvarDadosUsuario(usuario.id, dados);

    bootstrap.Modal.getInstance("#modal-vaga").hide();
    history.replaceState(null, "", "vagas.html");
    renderVagas();
    mostrarToast("Vaga excluída.");
}

// Sem vaga para colar? Monta um perfil-alvo com o objetivo, a área e o nível do perfil.
function gerarPeloObjetivo() {
    const dados = getDadosUsuario(usuario.id);
    const { objetivo, area, nivel } = dados.perfil;
    const vaga = objetivo && criarVagaDoObjetivo(objetivo, area, nivel);

    if (!vaga) {
        mostrarToast("Defina seu objetivo e sua área no Perfil para gerar o perfil-alvo.");
        return;
    }

    dados.vagas.unshift(vaga);
    if (!dados.perfil.vagaObjetivo) dados.perfil.vagaObjetivo = vaga.id;
    salvarDadosUsuario(usuario.id, dados);
    sessionStorage.setItem(CHAVE_AVISO, "Perfil-alvo criado a partir do seu objetivo. Ajuste o que quiser!");
    window.location.href = `detalhes-vaga.html?id=${vaga.id}`;
}

/* ===== Eventos ===== */

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderVagas();

    document.getElementById("busca-vaga").addEventListener("input", renderVagas);
    document.getElementById("filtros").addEventListener("change", renderVagas);

    document.getElementById("botao-adicionar-vaga").addEventListener("click", abrirModalNovaVaga);
    document.querySelector("[data-abrir-modal]").addEventListener("click", abrirModalNovaVaga);
    document.getElementById("botao-gerar-objetivo").addEventListener("click", gerarPeloObjetivo);
    document.getElementById("botao-exemplo").addEventListener("click", () => {
        document.getElementById("texto-vaga").value = EXEMPLO_VAGA;
    });
    document.getElementById("botao-organizar").addEventListener("click", organizarVaga);
    document.getElementById("botao-voltar").addEventListener("click", () => mostrarEtapa("colar"));
    document.getElementById("botao-nova-tecnologia").addEventListener("click", adicionarTecnologia);
    document.getElementById("nova-tecnologia").addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            adicionarTecnologia();
        }
    });
    document.getElementById("lista-tecnologias").addEventListener("click", editarTecnologia);
    document.getElementById("lista-tecnologias").addEventListener("change", editarTecnologia);
    document.getElementById("vaga-form").addEventListener("submit", salvarVaga);
    document.getElementById("botao-excluir-vaga").addEventListener("click", excluirVaga);

    // Atalhos pela URL: vagas.html?adicionar=1 ou vagas.html?editar=ID
    const parametros = new URLSearchParams(window.location.search);
    const vagaParaEditar = getVaga(parametros.get("editar"));
    if (vagaParaEditar) abrirModalEdicao(vagaParaEditar);
    else if (parametros.get("adicionar")) abrirModalNovaVaga();
});

// Redesenha a página quando os dados mudam (ver "Tempo real" no app.js)
atualizarPagina = renderVagas;
