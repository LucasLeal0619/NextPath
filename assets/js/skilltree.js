// SkillTree: monta a árvore a partir dos dados do usuário logado.
// Raiz = objetivo (ou área) do perfil; ramos = categorias; folhas = habilidades.

// { "Back-end": [habilidade, ...], "Banco de Dados": [...] }
function agruparPorCategoria(habilidades) {
    const grupos = {};
    habilidades.forEach(habilidade => {
        const categoria = habilidade.categoria || "Outras";
        if (!grupos[categoria]) grupos[categoria] = [];
        grupos[categoria].push(habilidade);
    });
    return grupos;
}

function criarRamo(categoria, habilidades) {
    const ramo = document.createElement("div");
    ramo.className = "arvore-ramo";
    ramo.innerHTML = `<div class="arvore-categoria"></div><div class="arvore-folhas"></div>`;
    ramo.querySelector(".arvore-categoria").textContent = categoria;

    habilidades.forEach(habilidade => {
        const folha = document.createElement("a");
        folha.className = "arvore-folha";
        folha.href = "habilidades.html";
        folha.innerHTML = `<strong></strong>${gerarPontos(getPontos(habilidade))}`;
        folha.querySelector("strong").textContent = habilidade.nome;
        ramo.querySelector(".arvore-folhas").appendChild(folha);
    });

    return ramo;
}

function renderSkillTree() {
    const { perfil, habilidades } = getDadosUsuario(usuario.id);
    const grupos = agruparPorCategoria(habilidades);
    const ramos = document.getElementById("arvore-ramos");
    const alvo = perfil.objetivo || perfil.area;

    setTexto("arvore-raiz", alvo || "Defina seu objetivo");
    document.getElementById("arvore-raiz").classList.toggle("vazio", !alvo);
    setTexto("skilltree-subtitulo", alvo
        ? `Visualize sua árvore de competências rumo a: ${alvo}.`
        : "Defina seu objetivo no perfil e adicione habilidades para montar sua árvore.");

    // Uma coluna por categoria (a variável --colunas é usada no CSS)
    ramos.innerHTML = "";
    ramos.style.setProperty("--colunas", Object.keys(grupos).length);
    Object.entries(grupos).forEach(([categoria, lista]) => ramos.appendChild(criarRamo(categoria, lista)));

    document.getElementById("arvore-vazia").hidden = habilidades.length > 0;
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    renderSkillTree();
    renderLegenda("legenda");
});

// Redesenha a página quando os dados mudam (ver "Tempo real" no app.js)
atualizarPagina = renderSkillTree;
