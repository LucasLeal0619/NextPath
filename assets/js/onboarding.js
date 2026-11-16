// Onboarding: configuração inicial em 3 passos (área e nível → habilidades → objetivo).
// Aparece após o primeiro login (dados.onboardingConcluido = false) e pode ser refeito pelo Perfil.
// Nada é salvo até o usuário clicar em "Concluir"; "Pular" só marca o onboarding como visto.

const ICONES_DAS_AREAS = {
    "Back-end": "bi-server", "Front-end": "bi-window", "Full Stack": "bi-layers",
    "Dados": "bi-bar-chart-line", "DevOps / Cloud": "bi-cloud", "Mobile": "bi-phone",
    "QA / Testes": "bi-check2-square", "UX / UI": "bi-palette", "Segurança da Informação": "bi-shield-lock",
    "Outra": "bi-three-dots"   // qualquer outra carreira: o usuário escreve o nome
};

// valor salvo no perfil → texto do botão ("" = ainda não trabalha na área)
const OPCOES_DE_NIVEL = [
    ["", "Ainda não trabalho na área"], ["Estagiário", "Estagiário"], ["Júnior", "Júnior"],
    ["Pleno", "Pleno"], ["Sênior", "Sênior"], ["Especialista", "Especialista"]
];

const TOTAL_DE_PASSOS = 3;
let passo = 1;

// Respostas do usuário (começam com o que ele já tinha, para quem refaz o onboarding)
const respostas = { area: "", nivel: null, habilidades: [] };  // habilidades: [{ nome, pontos }]

// Área final: a escolhida nos cartões ou, em "Outra", a que o usuário escreveu.
function getArea() {
    return respostas.area === "Outra" ? document.getElementById("onboarding-outra-area").value.trim() : respostas.area;
}

/* ===== Passo 1: área e nível ===== */

function renderOpcoes() {
    const areas = document.getElementById("opcoes-area");
    areas.innerHTML = "";
    Object.keys(ICONES_DAS_AREAS).forEach(area => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "opcao-cartao";
        botao.dataset.area = area;
        botao.setAttribute("aria-pressed", respostas.area === area);
        botao.innerHTML = `<i class="bi ${ICONES_DAS_AREAS[area]}"></i><span>${area === "Outra" ? "Outra área" : area}</span>`;
        areas.appendChild(botao);
    });
    document.getElementById("bloco-outra-area").hidden = respostas.area !== "Outra";

    const niveis = document.getElementById("opcoes-nivel");
    niveis.innerHTML = "";
    OPCOES_DE_NIVEL.forEach(([valor, texto]) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "opcao-pilula";
        botao.dataset.nivel = valor;
        botao.setAttribute("aria-pressed", respostas.nivel === valor);
        botao.textContent = texto;
        niveis.appendChild(botao);
    });
}

/* ===== Passo 2: habilidades ===== */

function getSugestoes() {
    const daArea = TECNOLOGIAS_POR_AREA[getArea()] || [];
    const gerais = ["Git", "SQL", "Inglês", "Comunicação"];
    return [...new Set([...daArea, ...gerais])];
}

function encontrarEscolhida(nome) {
    return respostas.habilidades.find(h => h.nome.toLowerCase() === nome.toLowerCase());
}

// Clique numa sugestão: adiciona (nível Básico) ou remove se já estava escolhida.
function alternarHabilidade(nome) {
    const escolhida = encontrarEscolhida(nome);
    if (escolhida) respostas.habilidades = respostas.habilidades.filter(h => h !== escolhida);
    else respostas.habilidades.push({ nome, pontos: 2 });
    renderHabilidades();
}

function renderHabilidades() {
    setTexto("area-escolhida", getArea() || "você");

    // Chips de sugestão (marcados quando já escolhidos)
    const sugestoes = document.getElementById("sugestoes");
    sugestoes.innerHTML = "";
    getSugestoes().forEach(nome => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip chip-botao";
        chip.classList.toggle("selecionado", Boolean(encontrarEscolhida(nome)));
        chip.dataset.nome = nome;
        chip.innerHTML = `<i class="bi ${encontrarEscolhida(nome) ? "bi-check-lg" : "bi-plus"}"></i> `;
        chip.append(nome);
        sugestoes.appendChild(chip);
    });

    // Lista das escolhidas, com bolinhas para escolher o nível
    const lista = document.getElementById("escolhidas");
    lista.innerHTML = "";
    respostas.habilidades.forEach((habilidade, indice) => {
        let pontos = "";
        for (let i = 1; i <= 5; i++) {
            pontos += `<button type="button" class="ponto ${i <= habilidade.pontos ? "ativo" : ""}" data-pontos="${i}" aria-label="Nível ${NIVEIS_HABILIDADE[i]}"></button>`;
        }
        const item = document.createElement("li");
        item.dataset.indice = indice;
        item.innerHTML = `<strong></strong><span class="pontos pontos-editaveis">${pontos}</span>
            <span class="nivel-texto">${NIVEIS_HABILIDADE[habilidade.pontos]}</span>
            <button class="btn-remover" type="button" aria-label="Remover"><i class="bi bi-x-lg"></i></button>`;
        item.querySelector("strong").textContent = habilidade.nome;
        lista.appendChild(item);
    });

    setTexto("qtd-escolhidas", respostas.habilidades.length);
    document.getElementById("nenhuma-escolhida").hidden = respostas.habilidades.length > 0;
}

function adicionarOutra() {
    const campo = document.getElementById("outra-habilidade");
    const nome = campo.value.trim();
    if (nome && !encontrarEscolhida(nome)) respostas.habilidades.push({ nome, pontos: 2 });
    campo.value = "";
    renderHabilidades();
}

function cliqueNaLista(event) {
    const item = event.target.closest("li");
    if (!item) return;
    const habilidade = respostas.habilidades[item.dataset.indice];

    const ponto = event.target.closest(".ponto");
    if (ponto) habilidade.pontos = Number(ponto.dataset.pontos);
    if (event.target.closest(".btn-remover")) respostas.habilidades.splice(item.dataset.indice, 1);
    renderHabilidades();
}

/* ===== Passo 3: objetivo ===== */

function getTipoObjetivo() {
    return document.querySelector('input[name="tipo-objetivo"]:checked').value;
}

function mostrarTipoObjetivo() {
    const tipo = getTipoObjetivo();
    document.querySelectorAll("[data-objetivo]").forEach(bloco => bloco.hidden = bloco.dataset.objetivo !== tipo);
    mostrarMensagem("onboarding-message", "", "");
}

// Prévia em tempo real do que o leitor entendeu da vaga colada
function renderPreviaVaga() {
    const texto = document.getElementById("onboarding-vaga").value.trim();
    const previa = document.getElementById("previa-vaga");
    previa.hidden = texto.length < 40;
    if (previa.hidden) return;

    const vaga = lerVaga(texto);
    setTexto("previa-titulo", vaga.titulo);
    setTexto("previa-meta", [vaga.empresa, vaga.senioridade, vaga.modalidade].filter(Boolean).join(" • ") || "Empresa e local não identificados");

    const chips = document.getElementById("previa-tecnologias");
    chips.innerHTML = "";
    vaga.tecnologias.forEach(tecnologia => {
        const chip = document.createElement("span");
        chip.className = "chip" + (tecnologia.desejavel ? " chip-desejavel" : "");
        chip.textContent = tecnologia.nome;
        chips.appendChild(chip);
    });
    if (!vaga.tecnologias.length) chips.textContent = "Nenhuma tecnologia reconhecida ainda.";
}

// Prévia em tempo real do perfil-alvo montado a partir do objetivo escrito
function renderPreviaObjetivo() {
    const objetivo = document.getElementById("onboarding-objetivo").value.trim();
    const vaga = objetivo.length >= 5 ? criarVagaDoObjetivo(objetivo, getArea(), respostas.nivel) : null;
    document.getElementById("previa-objetivo").hidden = !vaga;
    if (!vaga) return;

    const chips = document.getElementById("previa-objetivo-tecnologias");
    chips.innerHTML = "";
    vaga.tecnologias.forEach(tecnologia => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = tecnologia.nome;
        chips.appendChild(chip);
    });
    setTexto("previa-objetivo-nivel", `Nível exigido: ${NIVEIS_HABILIDADE[vaga.tecnologias[0].nivel]}${vaga.senioridade ? ` (vaga ${vaga.senioridade})` : ""}. Você poderá ajustar depois em Vagas.`);
}

/* ===== Navegação entre os passos ===== */

function renderPasso() {
    document.querySelectorAll(".onboarding-etapa").forEach(etapa => etapa.hidden = Number(etapa.dataset.passo) !== passo);
    setTexto("passo-texto", `Passo ${passo} de ${TOTAL_DE_PASSOS}`);
    document.getElementById("passo-barra").style.width = (passo / TOTAL_DE_PASSOS * 100) + "%";
    document.getElementById("botao-voltar").hidden = passo === 1;
    document.getElementById("botao-continuar").innerHTML = passo === TOTAL_DE_PASSOS
        ? `<i class="bi bi-check2"></i> Concluir`
        : `Continuar <i class="bi bi-arrow-right"></i>`;
    mostrarMensagem("onboarding-message", "", "");
    if (passo === 2) renderHabilidades();
    window.scrollTo(0, 0);
}

function continuar() {
    if (passo === 1 && (!getArea() || respostas.nivel === null)) {
        mostrarMensagem("onboarding-message", respostas.area === "Outra"
            ? "Escreva qual é a sua área para continuar."
            : "Escolha uma área e o seu nível para continuar.", "is-error");
        return;
    }
    if (passo < TOTAL_DE_PASSOS) {
        passo++;
        renderPasso();
    } else {
        concluir();
    }
}

/* ===== Salvar ===== */

function concluir() {
    const dados = getDadosUsuario(usuario.id);
    const tipo = getTipoObjetivo();

    // Objetivo (validado antes de salvar qualquer coisa)
    let novaVaga = null;
    let vagaObjetivo = null;
    let objetivo = "";
    if (tipo === "colar") {
        const lida = lerVaga(document.getElementById("onboarding-vaga").value.trim());
        if (!lida.titulo || !lida.tecnologias.length) {
            mostrarMensagem("onboarding-message", "Não reconhecemos tecnologias nessa vaga. Cole o texto completo ou escolha outra opção.", "is-error");
            return;
        }
        novaVaga = { ...lida, id: "v" + Date.now(), minha: true, adicionadaEm: Date.now() };
        vagaObjetivo = novaVaga.id;
        objetivo = novaVaga.titulo;
    } else {
        objetivo = document.getElementById("onboarding-objetivo").value.trim();
        if (!objetivo) {
            mostrarMensagem("onboarding-message", "Escreva o seu objetivo profissional.", "is-error");
            return;
        }
        // Monta o perfil-alvo (se a área ou o objetivo citarem habilidades conhecidas)
        novaVaga = criarVagaDoObjetivo(objetivo, getArea(), respostas.nivel);
        vagaObjetivo = novaVaga ? novaVaga.id : null;
    }

    // Perfil
    dados.perfil.area = getArea();
    dados.perfil.nivel = respostas.nivel;
    dados.perfil.cargoAtual = document.getElementById("onboarding-cargo").value.trim() || dados.perfil.cargoAtual;
    dados.perfil.objetivo = objetivo;
    dados.perfil.vagaObjetivo = vagaObjetivo;
    if (novaVaga) dados.vagas.unshift(novaVaga);

    // Habilidades: atualiza o nível das que já existem e adiciona as novas
    respostas.habilidades.forEach(({ nome, pontos }) => {
        let habilidade = dados.habilidades.find(h => h.nome.toLowerCase() === nome.toLowerCase());
        if (!habilidade) {
            habilidade = { nome, categoria: CATEGORIAS[nome] || "Outras" };
            dados.habilidades.push(habilidade);
        }
        habilidade.progresso = pontos * 20;
        habilidade.status = statusPorProgresso(habilidade.progresso);
    });

    dados.onboardingConcluido = true;
    salvarDadosUsuario(usuario.id, dados);
    sessionStorage.setItem(CHAVE_AVISO, "Tudo pronto! Seu NextPath foi personalizado.");
    window.location.href = "dashboard.html";
}

function pular() {
    const dados = getDadosUsuario(usuario.id);
    dados.onboardingConcluido = true;
    salvarDadosUsuario(usuario.id, dados);
    window.location.href = "dashboard.html";
}

/* ===== Início ===== */

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    // Começa com o que o usuário já tem (útil para quem refaz o onboarding)
    const { perfil, habilidades } = getDadosUsuario(usuario.id);
    const areaConhecida = !perfil.area || ICONES_DAS_AREAS[perfil.area];
    respostas.area = areaConhecida ? perfil.area : "Outra";
    if (!areaConhecida) document.getElementById("onboarding-outra-area").value = perfil.area;
    respostas.nivel = perfil.area ? perfil.nivel : null;
    respostas.habilidades = habilidades.map(h => ({ nome: h.nome, pontos: getPontos(h) }));
    document.getElementById("onboarding-cargo").value = perfil.cargoAtual;
    document.getElementById("onboarding-objetivo").value = perfil.objetivo;

    setTexto("primeiro-nome", usuario.nome.split(" ")[0]);
    document.getElementById("lista-conhecidas").innerHTML = Object.keys(PALAVRAS_TECNOLOGIAS).map(nome => `<option value="${nome}">`).join("");
    renderOpcoes();
    renderPasso();

    document.getElementById("opcoes-area").addEventListener("click", event => {
        const botao = event.target.closest("[data-area]");
        if (botao) { respostas.area = botao.dataset.area; renderOpcoes(); }
    });
    document.getElementById("opcoes-nivel").addEventListener("click", event => {
        const botao = event.target.closest("[data-nivel]");
        if (botao) { respostas.nivel = botao.dataset.nivel; renderOpcoes(); }
    });

    document.getElementById("sugestoes").addEventListener("click", event => {
        const chip = event.target.closest("[data-nome]");
        if (chip) alternarHabilidade(chip.dataset.nome);
    });
    document.getElementById("escolhidas").addEventListener("click", cliqueNaLista);
    document.getElementById("botao-outra").addEventListener("click", adicionarOutra);
    document.getElementById("outra-habilidade").addEventListener("keydown", event => {
        if (event.key === "Enter") adicionarOutra();
    });

    document.querySelectorAll('input[name="tipo-objetivo"]').forEach(radio => radio.addEventListener("change", mostrarTipoObjetivo));
    document.getElementById("onboarding-vaga").addEventListener("input", renderPreviaVaga);
    document.getElementById("onboarding-objetivo").addEventListener("input", renderPreviaObjetivo);
    document.getElementById("botao-exemplo").addEventListener("click", () => {
        document.getElementById("onboarding-vaga").value = EXEMPLO_VAGA;
        renderPreviaVaga();
    });

    document.getElementById("botao-continuar").addEventListener("click", continuar);
    document.getElementById("botao-voltar").addEventListener("click", () => { passo--; renderPasso(); });
    document.getElementById("botao-pular").addEventListener("click", pular);
});
