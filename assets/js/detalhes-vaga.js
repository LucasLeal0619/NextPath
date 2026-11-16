// Detalhes da Vaga: mostra a vaga escolhida (detalhes-vaga.html?id=1 ou a última vista).

function renderDetalhes() {
    const vaga = getVagaSelecionada();
    document.getElementById("sem-vaga").hidden = Boolean(vaga);
    document.getElementById("conteudo-vaga").hidden = !vaga;
    if (!vaga) return;

    const { perfil, habilidades } = getDadosUsuario(usuario.id);
    const analise = analisarVaga(vaga, habilidades);
    const publicada = vaga.publicadaHaDias === 1 ? "há 1 dia" : `há ${vaga.publicadaHaDias} dias`;

    document.title = `NextPath | ${vaga.titulo}`;
    setTexto("vaga-titulo", vaga.titulo);
    setTexto("vaga-meta", `${vaga.empresa} • ${vaga.modalidade} • Publicada ${publicada}`);
    setTexto("vaga-descricao", vaga.descricao);

    const requisitos = document.getElementById("vaga-requisitos");
    requisitos.innerHTML = "";
    vaga.requisitos.forEach(texto => {
        const item = document.createElement("li");
        item.textContent = texto;
        requisitos.appendChild(item);
    });

    // Chips das tecnologias: verde quando o usuário já atende o nível exigido
    const chips = document.getElementById("vaga-tecnologias");
    chips.innerHTML = "";
    analise.requisitos.forEach(requisito => {
        const chip = document.createElement("span");
        chip.className = "chip" + (requisito.situacao === "atende" ? " chip-ok" : "");
        chip.textContent = requisito.nome;
        chip.title = `Exigido: ${NIVEIS_HABILIDADE[requisito.nivel]} • Você: ${NIVEIS_HABILIDADE[requisito.pontos]}`;
        chips.appendChild(chip);
    });

    setTexto("vaga-empresa", vaga.empresa);
    setTexto("vaga-local", vaga.local);
    setTexto("vaga-senioridade", vaga.senioridade);
    setTexto("vaga-tipo", vaga.tipo);
    setTexto("vaga-compatibilidade", analise.porcentagem + "%");

    const ehObjetivo = perfil.objetivo === vaga.titulo;
    setTexto("botao-objetivo", ehObjetivo ? "✓ Este é o seu objetivo" : "Definir como meu objetivo");
    document.getElementById("botao-objetivo").disabled = ehObjetivo;
}

// Usa o título da vaga como objetivo profissional do perfil.
function definirObjetivo() {
    const vaga = getVagaSelecionada();
    const dados = getDadosUsuario(usuario.id);
    dados.perfil.objetivo = vaga.titulo;
    salvarDadosUsuario(usuario.id, dados);

    renderDetalhes();
    mostrarToast("Objetivo profissional atualizado!");
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderDetalhes();
    document.getElementById("botao-objetivo").addEventListener("click", definirObjetivo);
});

window.addEventListener("storage", () => {
    if (usuario) renderDetalhes();
});
