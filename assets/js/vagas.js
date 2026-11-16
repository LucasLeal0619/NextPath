// Vagas: lista as vagas do catálogo com a compatibilidade calculada
// a partir das habilidades do usuário. Busca e filtros funcionam em tempo real.

// Junta título, empresa, local e tecnologias para a busca por texto.
function textoDaVaga(vaga) {
    const tecnologias = vaga.tecnologias.map(tecnologia => tecnologia.nome).join(" ");
    return `${vaga.titulo} ${vaga.empresa} ${vaga.local} ${tecnologias}`.toLowerCase();
}

function renderVagas() {
    const { habilidades } = getDadosUsuario(usuario.id);
    const busca = document.getElementById("busca-vaga").value.trim().toLowerCase();
    const modalidade = document.getElementById("filtro-modalidade").value;
    const senioridade = document.getElementById("filtro-senioridade").value;
    const ordem = document.getElementById("filtro-ordem").value;

    // Filtra e calcula a compatibilidade de cada vaga
    const lista = VAGAS
        .filter(vaga => !busca || textoDaVaga(vaga).includes(busca))
        .filter(vaga => !modalidade || vaga.modalidade === modalidade)
        .filter(vaga => !senioridade || vaga.senioridade === senioridade)
        .map(vaga => ({ vaga, compatibilidade: analisarVaga(vaga, habilidades).porcentagem }));

    if (ordem === "compatibilidade") lista.sort((a, b) => b.compatibilidade - a.compatibilidade);
    else lista.sort((a, b) => a.vaga.publicadaHaDias - b.vaga.publicadaHaDias);

    const tabela = document.getElementById("tabela-vagas");
    const modelo = document.getElementById("modelo-vaga");
    tabela.innerHTML = "";

    lista.forEach(({ vaga, compatibilidade }) => {
        const linha = modelo.content.cloneNode(true).querySelector("tr");
        linha.querySelector(".coluna-titulo").textContent = vaga.titulo;
        linha.querySelector(".vaga-compatibilidade").textContent = `Compatibilidade estimada: ${compatibilidade}%`;
        linha.querySelector(".coluna-empresa").textContent = vaga.empresa;
        linha.querySelector(".coluna-local").textContent = vaga.local;

        const badge = linha.querySelector(".badge-modalidade");
        badge.textContent = vaga.modalidade;
        badge.classList.add(vaga.modalidade === "Híbrido" ? "hibrido" : vaga.modalidade === "Presencial" ? "presencial" : "remoto");

        linha.querySelector(".btn-contorno").href = `detalhes-vaga.html?id=${vaga.id}`;
        tabela.appendChild(linha);
    });

    document.getElementById("vagas-vazio").hidden = lista.length > 0;
    document.getElementById("aviso-sem-habilidades").hidden = habilidades.length > 0;
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderVagas();

    document.getElementById("busca-vaga").addEventListener("input", renderVagas);
    document.getElementById("filtros").addEventListener("change", renderVagas);
});

window.addEventListener("storage", () => {
    if (usuario) renderVagas();
});
