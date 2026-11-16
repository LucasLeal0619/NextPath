// Compatibilidade com a Vaga: compara as habilidades do usuário com a vaga escolhida.

// "Node.js, SQL" ou "Nenhuma"
function listarNomes(requisitos) {
    return requisitos.length ? requisitos.map(requisito => requisito.nome).join(", ") : "Nenhuma";
}

function renderCompatibilidade() {
    const vaga = getVagaSelecionada();
    document.getElementById("sem-vaga").hidden = Boolean(vaga);
    document.getElementById("conteudo-vaga").hidden = !vaga;
    if (!vaga) return;

    const { habilidades } = getDadosUsuario(usuario.id);
    const analise = analisarVaga(vaga, habilidades);

    setTexto("vaga-nome", `${vaga.titulo} — ${vaga.empresa}`);

    // O círculo usa a variável CSS --progresso (mesmo componente do Dashboard)
    document.getElementById("compatibilidade-circulo").style.setProperty("--progresso", analise.porcentagem);
    setTexto("compatibilidade-geral", analise.porcentagem + "%");
    setTexto("compatibilidade-texto",
        `Baseado em ${analise.requisitos.length} requisitos da vaga: ` +
        `${analise.atende.length} atendidos • ${analise.desenvolvendo.length} em desenvolvimento • ` +
        `${analise.naoAtende.length} não atendidos.`);

    setTexto("qtd-atende", analise.atende.length);
    setTexto("qtd-desenvolvendo", analise.desenvolvendo.length);
    setTexto("qtd-nao-atende", analise.naoAtende.length);
    setTexto("lista-atende", listarNomes(analise.atende));
    setTexto("lista-desenvolvendo", listarNomes(analise.desenvolvendo));
    setTexto("lista-nao-atende", listarNomes(analise.naoAtende));
}

document.addEventListener("DOMContentLoaded", () => {
    if (usuario) renderCompatibilidade();
});

// Redesenha a página quando os dados mudam (ver "Tempo real" no app.js)
atualizarPagina = renderCompatibilidade;
