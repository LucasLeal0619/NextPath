// Minhas Habilidades: lista, adiciona, altera o nível e remove habilidades
// do usuário logado (dados.habilidades em nextpath_dados_{id}).

// Salva o nível (0 a 5 pontos) já com progresso e status, no formato usado por todas as páginas.
function aplicarNivel(habilidade, pontos) {
    habilidade.progresso = pontos * 20;
    habilidade.status = statusPorProgresso(habilidade.progresso);
}

function renderTabela() {
    const { habilidades } = getDadosUsuario(usuario.id);
    const busca = document.getElementById("busca-habilidade").value.trim().toLowerCase();
    const tabela = document.getElementById("tabela-habilidades");
    const modelo = document.getElementById("modelo-linha");
    let visiveis = 0;

    tabela.innerHTML = "";

    habilidades.forEach((habilidade, indice) => {
        const texto = (habilidade.nome + " " + (habilidade.categoria || "")).toLowerCase();
        if (busca && !texto.includes(busca)) return;

        const pontos = getPontos(habilidade);
        const linha = modelo.content.cloneNode(true).querySelector("tr");
        linha.dataset.indice = indice;
        linha.querySelector(".coluna-nome").textContent = habilidade.nome;
        linha.querySelector(".coluna-categoria").textContent = habilidade.categoria || "Outras";
        linha.querySelector(".nivel-texto").textContent = NIVEIS_HABILIDADE[pontos];

        // 5 bolinhas clicáveis: cada uma define o nível
        let botoes = "";
        for (let i = 1; i <= 5; i++) {
            botoes += `<button type="button" class="ponto ${i <= pontos ? "ativo" : ""}" data-pontos="${i}" aria-label="Definir nível ${NIVEIS_HABILIDADE[i]}"></button>`;
        }
        linha.querySelector(".pontos").innerHTML = botoes;

        tabela.appendChild(linha);
        visiveis++;
    });

    const total = habilidades.length;
    setTexto("habilidades-contagem", busca
        ? `${visiveis} de ${total} habilidade(s) encontrada(s)`
        : `${total} habilidade(s) mapeada(s)`);
    document.getElementById("habilidades-vazio").hidden = total > 0;
    document.querySelector(".tabela-np").hidden = total === 0;
}

function adicionarHabilidade(event) {
    event.preventDefault();

    const form = event.target;
    const nome = form.nome.value.trim();
    const dados = getDadosUsuario(usuario.id);

    if (!nome) {
        mostrarMensagem("habilidade-message", "Informe o nome da habilidade.", "is-error");
        return;
    }
    if (dados.habilidades.some(habilidade => habilidade.nome.toLowerCase() === nome.toLowerCase())) {
        mostrarMensagem("habilidade-message", "Essa habilidade já foi adicionada.", "is-error");
        return;
    }

    const novaHabilidade = { nome, categoria: form.categoria.value };
    aplicarNivel(novaHabilidade, Number(form.nivel.value));
    dados.habilidades.push(novaHabilidade);
    salvarDadosUsuario(usuario.id, dados);

    form.reset();
    mostrarMensagem("habilidade-message", "", "");
    bootstrap.Modal.getInstance("#modal-habilidade").hide();
    renderTabela();
    mostrarToast(`${nome} adicionada!`);
}

// Cliques na tabela: bolinhas (mudar nível) ou lixeira (remover).
function cliqueNaTabela(event) {
    const linha = event.target.closest("tr");
    if (!linha) return;

    const dados = getDadosUsuario(usuario.id);
    const habilidade = dados.habilidades[linha.dataset.indice];
    const ponto = event.target.closest(".ponto");

    if (ponto) {
        // Clicar na última bolinha acesa apaga ela (ex.: de 3 para 2)
        const clicado = Number(ponto.dataset.pontos);
        aplicarNivel(habilidade, clicado === getPontos(habilidade) ? clicado - 1 : clicado);
        salvarDadosUsuario(usuario.id, dados);
        renderTabela();
        return;
    }

    if (event.target.closest(".btn-remover")) {
        dados.habilidades.splice(linha.dataset.indice, 1);
        salvarDadosUsuario(usuario.id, dados);
        renderTabela();
        mostrarToast(`${habilidade.nome} removida.`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderTabela();
    renderLegenda("legenda");

    document.getElementById("habilidade-form").addEventListener("submit", adicionarHabilidade);
    document.getElementById("tabela-habilidades").addEventListener("click", cliqueNaTabela);
    document.getElementById("busca-habilidade").addEventListener("input", renderTabela);
    document.getElementById("modal-habilidade").addEventListener("shown.bs.modal", () => {
        document.getElementById("habilidade-nome").focus();
    });
});

// Redesenha a página quando os dados mudam (ver "Tempo real" no app.js)
atualizarPagina = renderTabela;
