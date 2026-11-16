// Gaps: requisitos da vaga escolhida que o usuário ainda não atende.
// Progresso de cada gap = bolinhas do usuário ÷ bolinhas exigidas.

function renderGaps() {
    const vaga = getVagaSelecionada();
    document.getElementById("sem-vaga").hidden = Boolean(vaga);
    document.getElementById("conteudo-vaga").hidden = !vaga;
    if (!vaga) return;

    const { habilidades } = getDadosUsuario(usuario.id);
    const { gaps } = analisarVaga(vaga, habilidades);
    const tabela = document.getElementById("tabela-gaps");
    const modelo = document.getElementById("modelo-gap");

    setTexto("gaps-subtitulo", `Habilidades que você ainda precisa desenvolver para ${vaga.titulo}.`);
    tabela.innerHTML = "";

    gaps.forEach(gap => {
        const linha = modelo.content.cloneNode(true).querySelector("tr");
        linha.querySelector(".coluna-nome").textContent = gap.nome;
        if (gap.desejavel) linha.querySelector(".coluna-nome").insertAdjacentHTML("beforeend", ` <span class="etiqueta">Diferencial</span>`);
        linha.querySelector(".coluna-atual").innerHTML = gerarPontos(gap.pontos);
        linha.querySelector(".coluna-exigido").innerHTML = gerarPontos(gap.nivel);
        linha.querySelector(".barra-preenchida").style.width = gap.progresso + "%";
        linha.querySelector(".gap-porcentagem").textContent = gap.progresso + "%";

        // Se o usuário nem tem a habilidade, oferece adicionar; senão, leva para atualizar o nível.
        const temHabilidade = habilidades.some(h => h.nome.trim().toLowerCase() === gap.nome.toLowerCase());
        const acao = linha.querySelector(".coluna-acao");
        if (temHabilidade) {
            acao.innerHTML = `<a class="btn-card" href="habilidades.html">Atualizar nível</a>`;
        } else {
            acao.innerHTML = `<button class="btn-card" type="button"><i class="bi bi-plus-lg"></i> Adicionar</button>`;
            acao.querySelector("button").dataset.nome = gap.nome;
        }

        tabela.appendChild(linha);
    });

    document.querySelector(".tabela-np").hidden = gaps.length === 0;
    document.getElementById("sem-gaps").hidden = gaps.length > 0;
}

// Adiciona o gap em Minhas Habilidades como "Não iniciada".
function adicionarGap(event) {
    const botao = event.target.closest("button[data-nome]");
    if (!botao) return;

    const nome = botao.dataset.nome;
    const dados = getDadosUsuario(usuario.id);
    dados.habilidades.push({ nome, categoria: CATEGORIAS[nome] || "Outras", progresso: 0, status: "nao_iniciada" });
    salvarDadosUsuario(usuario.id, dados);

    renderGaps();
    mostrarToast(`${nome} adicionada às suas habilidades.`);
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderGaps();
    document.getElementById("tabela-gaps").addEventListener("click", adicionarGap);
});

// Redesenha a página quando os dados mudam (ver "Tempo real" no app.js)
atualizarPagina = renderGaps;
