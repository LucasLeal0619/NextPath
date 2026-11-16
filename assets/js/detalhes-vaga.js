// Detalhes da Vaga: mostra a vaga escolhida (detalhes-vaga.html?id=... ou a última vista).
// Funciona para vagas coladas pelo usuário e para o perfil-alvo gerado pelo objetivo dele.

// Preenche uma lista <ul> e esconde a seção inteira se não houver itens.
function preencherLista(id, itens) {
    const lista = document.getElementById(id);
    lista.innerHTML = "";
    (itens || []).forEach(texto => {
        const item = document.createElement("li");
        item.textContent = texto;
        lista.appendChild(item);
    });
    lista.closest("[data-secao]").hidden = !(itens && itens.length);
}

function textoPublicacao(vaga) {
    const dias = diasDesde(vaga);
    const quando = dias === 0 ? "hoje" : dias === 1 ? "há 1 dia" : `há ${dias} dias`;
    return vaga.gerada ? `Perfil-alvo criado ${quando}` : `Adicionada por você ${quando}`;
}

function renderDetalhes() {
    const vaga = getVagaSelecionada();
    document.getElementById("sem-vaga").hidden = Boolean(vaga);
    document.getElementById("conteudo-vaga").hidden = !vaga;
    if (!vaga) return;

    const { perfil, habilidades } = getDadosUsuario(usuario.id);
    const analise = analisarVaga(vaga, habilidades);

    document.title = `NextPath | ${vaga.titulo}`;
    setTexto("vaga-titulo", vaga.titulo);
    setTexto("vaga-meta", [vaga.empresa, vaga.modalidade, textoPublicacao(vaga)].filter(Boolean).join(" • "));

    const botaoEditar = document.getElementById("botao-editar-vaga");
    botaoEditar.hidden = false;
    botaoEditar.href = `vagas.html?editar=${vaga.id}`;

    setTexto("vaga-descricao", vaga.descricao || "");
    document.querySelector('[data-secao="descricao"]').hidden = !vaga.descricao;
    preencherLista("vaga-atividades", vaga.atividades);
    preencherLista("vaga-requisitos", vaga.requisitos);
    preencherLista("vaga-diferenciais", vaga.diferenciais);

    // Chips: verde = já atende; tracejado = diferencial
    const chips = document.getElementById("vaga-tecnologias");
    chips.innerHTML = "";
    vaga.tecnologias.forEach(tecnologia => {
        const atual = progressoDoUsuario(habilidades, tecnologia.nome);
        const pontos = Math.round(atual / 20);
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.classList.toggle("chip-ok", atual >= tecnologia.nivel * 20);
        chip.classList.toggle("chip-desejavel", Boolean(tecnologia.desejavel));
        chip.textContent = tecnologia.nome;
        chip.title = `Exigido: ${NIVEIS_HABILIDADE[tecnologia.nivel]} • Você: ${NIVEIS_HABILIDADE[pontos]}`;
        chips.appendChild(chip);
    });

    setTexto("vaga-empresa", vaga.empresa || "Empresa não informada");
    setTexto("vaga-local", vaga.local || "—");
    setTexto("vaga-senioridade", vaga.senioridade || "—");
    setTexto("vaga-tipo", vaga.tipo || "—");
    setTexto("vaga-compatibilidade", analise.porcentagem + "%");

    const ehObjetivo = String(perfil.vagaObjetivo) === String(vaga.id);
    setTexto("botao-objetivo", ehObjetivo ? "★ Esta é a vaga que você almeja" : "Definir como meu objetivo");
    document.getElementById("botao-objetivo").disabled = ehObjetivo;
}

// Esta vaga passa a ser a vaga-objetivo: as trilhas recomendadas serão baseadas nela.
function definirObjetivo() {
    const vaga = getVagaSelecionada();
    const dados = getDadosUsuario(usuario.id);
    dados.perfil.vagaObjetivo = vaga.id;
    dados.perfil.objetivo = vaga.titulo;
    salvarDadosUsuario(usuario.id, dados);

    renderDetalhes();
    mostrarToast("Objetivo atualizado! Suas trilhas agora são recomendadas para esta vaga.");
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderDetalhes();
    document.getElementById("botao-objetivo").addEventListener("click", definirObjetivo);
});

// Redesenha a página quando os dados mudam (ver "Tempo real" no app.js)
atualizarPagina = renderDetalhes;
