// Trilhas Recomendadas: trilhas montadas para cada usuário (ver montarTrilha no catalogo.js).
// Ordem das recomendações:
//   1. trilhas que o usuário já começou ou criou;
//   2. gaps da vaga-objetivo, no nível que a vaga exige;
//   3. habilidades essenciais da área do usuário, no nível do próximo cargo dele.
// Cada módulo concluído aumenta na hora o progresso da habilidade (ver estudarTrilha).

let trilhaAberta = null;    // trilha exibida no modal

// Lista de { trilha, motivo }, sem repetir habilidades.
function getRecomendacoes(dados) {
    const lista = [];
    const vagaObjetivo = getVagaObjetivo();
    const { area, nivel } = dados.perfil;

    function recomendar(habilidade, nivelAlvo, motivo) {
        if (lista.some(item => item.trilha.habilidade.toLowerCase() === habilidade.toLowerCase())) return;
        const trilha = montarTrilha(dados, habilidade, nivelAlvo);
        const iniciada = trilha.concluidos.length > 0 || getRegistroTrilha(dados, habilidade);
        if (getProgressoTrilha(trilha) === 100) return;
        // Uma trilha nova só é recomendada se ainda fizer o usuário subir de nível
        if (!iniciada && progressoDoUsuario(dados.habilidades, habilidade) >= trilha.nivelAlvo * 20) return;
        lista.push({ trilha, motivo });
    }

    Object.values(dados.trilhas).filter(registro => registro.concluidos).forEach(registro => {
        recomendar(registro.habilidade, registro.nivelAlvo, registro.criadaPeloUsuario ? "Você escolheu estudar" : "Você já começou esta trilha");
    });

    if (vagaObjetivo) {
        analisarVaga(vagaObjetivo, dados.habilidades).gaps.forEach(gap => {
            recomendar(gap.nome, gap.nivel, `${gap.desejavel ? "Diferencial" : "Requisito"} de ${vagaObjetivo.titulo}`);
        });
    }

    const nivelDaArea = NIVEL_DO_PROXIMO_CARGO[nivel || ""] || 3;
    (TECNOLOGIAS_POR_AREA[area] || []).forEach(nome => {
        recomendar(nome, nivelDaArea, `Essencial em ${area} para o nível ${NIVEIS_HABILIDADE[nivelDaArea]}`);
    });

    return lista;
}

// Faixa explicando de onde vêm as recomendações.
function renderBaseRecomendacao(dados) {
    const vagaObjetivo = getVagaObjetivo();
    const aviso = document.getElementById("base-recomendacao");
    aviso.hidden = !vagaObjetivo && !dados.perfil.area;
    if (aviso.hidden) return;

    let texto = "Recomendações baseadas";
    if (vagaObjetivo) texto += ` na vaga que você almeja (${vagaObjetivo.titulo})`;
    if (vagaObjetivo && dados.perfil.area) texto += " e";
    if (dados.perfil.area) texto += ` na sua área (${dados.perfil.area})`;

    aviso.innerHTML = `<i class="bi bi-stars"></i><span></span><a class="btn-card ms-auto"></a>`;
    aviso.querySelector("span").textContent = texto + ".";
    const link = aviso.querySelector("a");
    link.textContent = vagaObjetivo ? "Ver vaga" : "Adicionar vaga";
    link.href = vagaObjetivo ? `detalhes-vaga.html?id=${vagaObjetivo.id}` : "vagas.html?adicionar=1";
}

function renderTrilhas() {
    const dados = getDadosUsuario(usuario.id);
    const lista = getRecomendacoes(dados);
    const container = document.getElementById("lista-trilhas");
    const modelo = document.getElementById("modelo-trilha");

    setTexto("trilhas-subtitulo", "Trilhas de estudo montadas para o que você almeja.");
    renderBaseRecomendacao(dados);

    container.innerHTML = "";
    lista.forEach(({ trilha, motivo }, indice) => {
        const progresso = getProgressoTrilha(trilha);
        const card = modelo.content.cloneNode(true).querySelector("div");
        const cor = ["azul", "roxo", "ciano"][indice % 3];

        card.querySelector(".trilha").classList.add(cor);
        card.querySelector(".icone-quadrado i").classList.add(trilha.icone);
        card.querySelector(".trilha-titulo").textContent = trilha.titulo;
        card.querySelector(".trilha-nivel").textContent = `${trilha.habilidade} • até ${NIVEIS_HABILIDADE[trilha.nivelAlvo]}`;
        card.querySelector(".trilha-motivo span").textContent = motivo;
        card.querySelector(".trilha-porcentagem").textContent = progresso + "%";
        card.querySelector(".barra-preenchida").style.width = progresso + "%";

        const botao = card.querySelector("button");
        botao.dataset.habilidade = trilha.habilidade;
        botao.dataset.nivel = trilha.nivelAlvo;
        botao.textContent = progresso === 0 ? "Iniciar trilha" : "Continuar trilha";

        container.appendChild(card);
    });

    // Estado vazio: sem objetivo/área definidos, ou tudo já está no nível certo
    const temObjetivo = Boolean(getVagaObjetivo() || dados.perfil.area);
    document.getElementById("trilhas-vazio").hidden = lista.length > 0;
    document.getElementById("trilhas-vazio-acoes").hidden = temObjetivo;
    setTexto("trilhas-vazio-titulo", temObjetivo ? "Nenhuma trilha pendente" : "Conte o que você almeja");
    setTexto("trilhas-vazio-texto", temObjetivo
        ? "Você já tem o nível pedido para o seu objetivo. Crie uma trilha abaixo para continuar evoluindo."
        : "Adicione a vaga que você deseja ou defina sua área de interesse para receber trilhas personalizadas.");

    renderConcluidas(dados);
}

function renderConcluidas(dados) {
    const concluidas = Object.values(dados.trilhas)
        .filter(registro => registro.concluidos)
        .map(registro => montarTrilha(dados, registro.habilidade, registro.nivelAlvo))
        .filter(trilha => getProgressoTrilha(trilha) === 100);

    const lista = document.getElementById("lista-concluidas");
    lista.innerHTML = "";
    concluidas.forEach(trilha => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip chip-ok chip-botao";
        chip.dataset.habilidade = trilha.habilidade;
        chip.dataset.nivel = trilha.nivelAlvo;
        chip.textContent = `${trilha.titulo} • ${NIVEIS_HABILIDADE[trilha.nivelAlvo]}`;
        lista.appendChild(chip);
    });
    document.getElementById("trilhas-concluidas").hidden = concluidas.length === 0;
}

/* ===== Criar uma trilha para qualquer habilidade ===== */

function criarTrilha(event) {
    event.preventDefault();

    const campo = document.getElementById("nova-trilha-habilidade");
    const nome = campo.value.trim();
    const nivelAlvo = Number(document.getElementById("nova-trilha-nivel").value);
    const dados = getDadosUsuario(usuario.id);

    if (!nome) {
        mostrarMensagem("nova-trilha-message", "Informe a habilidade que você quer estudar.", "is-error");
        return;
    }
    // Usa o nome já cadastrado (ex.: "docker" → "Docker") para não duplicar a habilidade
    const habilidade = (encontrarHabilidade(dados.habilidades, nome) || {}).nome || nome;
    if (getRegistroTrilha(dados, habilidade)) {
        mostrarMensagem("nova-trilha-message", "Você já tem uma trilha para essa habilidade.", "is-error");
        return;
    }
    if (progressoDoUsuario(dados.habilidades, habilidade) >= nivelAlvo * 20) {
        mostrarMensagem("nova-trilha-message", "Você já está nesse nível. Escolha um nível acima.", "is-error");
        return;
    }

    dados.trilhas[idDaTrilha(habilidade)] = {
        habilidade, nivelAlvo, concluidos: [], criadaPeloUsuario: true,
        base: progressoDoUsuario(dados.habilidades, habilidade)
    };
    salvarDadosUsuario(usuario.id, dados);

    campo.value = "";
    mostrarMensagem("nova-trilha-message", "", "");
    renderTrilhas();
    mostrarToast(`Trilha de ${habilidade} criada!`);
}

/* ===== Modal com os módulos ===== */

function abrirTrilha(event) {
    const botao = event.target.closest("[data-habilidade]");
    if (!botao) return;

    trilhaAberta = montarTrilha(getDadosUsuario(usuario.id), botao.dataset.habilidade, Number(botao.dataset.nivel));
    const modulos = document.getElementById("modal-trilha-modulos");

    setTexto("modal-trilha-titulo", trilhaAberta.titulo);
    setTexto("modal-trilha-alvo", `Cada módulo aumenta seu nível em ${trilhaAberta.habilidade}. Meta: ${NIVEIS_HABILIDADE[trilhaAberta.nivelAlvo]}.`);

    modulos.innerHTML = "";
    trilhaAberta.modulos.forEach((nome, indice) => {
        const item = document.createElement("div");
        item.className = "form-check modulo";
        item.innerHTML = `<input class="form-check-input" type="checkbox" id="modulo-${indice}" value="${indice}"><label class="form-check-label" for="modulo-${indice}"></label>`;
        item.querySelector("input").checked = trilhaAberta.concluidos.includes(indice);
        item.querySelector("label").textContent = `${indice + 1}. ${nome}`;
        modulos.appendChild(item);
    });

    atualizarModal();
    bootstrap.Modal.getOrCreateInstance("#modal-trilha").show();
}

// Barra da trilha + nível atual da habilidade (muda a cada módulo marcado)
function atualizarModal() {
    const dados = getDadosUsuario(usuario.id);
    const progresso = getProgressoTrilha(trilhaAberta);
    const nivelAtual = progressoDoUsuario(dados.habilidades, trilhaAberta.habilidade);
    setTexto("modal-trilha-porcentagem", progresso + "%");
    setTexto("modal-trilha-habilidade", `${trilhaAberta.habilidade}: ${nivelAtual}% (${NIVEIS_HABILIDADE[Math.round(nivelAtual / 20)]})`);
    document.getElementById("modal-trilha-barra").style.width = progresso + "%";
}

function marcarModulo() {
    const dados = getDadosUsuario(usuario.id);
    const concluidos = Array.from(document.querySelectorAll("#modal-trilha-modulos input:checked"), input => Number(input.value));
    const estavaCompleta = getProgressoTrilha(trilhaAberta) === 100;

    estudarTrilha(dados, trilhaAberta, concluidos);
    salvarDadosUsuario(usuario.id, dados);
    trilhaAberta.concluidos = concluidos;

    atualizarModal();
    renderTrilhas();

    if (getProgressoTrilha(trilhaAberta) === 100 && !estavaCompleta) {
        mostrarToast(`Trilha concluída! ${trilhaAberta.habilidade} agora está no nível ${NIVEIS_HABILIDADE[trilhaAberta.nivelAlvo]}.`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    // Sugestões do campo "Habilidade": as do usuário + as conhecidas pela plataforma
    const { habilidades } = getDadosUsuario(usuario.id);
    const nomes = [...new Set([...habilidades.map(h => h.nome), ...Object.keys(PALAVRAS_TECNOLOGIAS)])];
    document.getElementById("habilidades-conhecidas").innerHTML = nomes.map(nome => `<option value="${nome}">`).join("");

    renderTrilhas();

    document.getElementById("lista-trilhas").addEventListener("click", abrirTrilha);
    document.getElementById("lista-concluidas").addEventListener("click", abrirTrilha);
    document.getElementById("modal-trilha-modulos").addEventListener("change", marcarModulo);
    document.getElementById("nova-trilha-form").addEventListener("submit", criarTrilha);
});

// Redesenha a página quando os dados mudam (ver "Tempo real" no app.js)
atualizarPagina = renderTrilhas;
