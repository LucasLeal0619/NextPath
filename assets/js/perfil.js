// Perfil Profissional: mostra e edita dados.perfil do usuário logado.
// O nome fica na conta (nextpath_usuarios); o resto fica em nextpath_dados_{id}.

const form = document.getElementById("perfil-form");

function lerFormulario() {
    return {
        nome: form.nome.value.trim(),
        cargoAtual: form.cargoAtual.value.trim(),
        area: form.area.value,
        nivel: form.nivel.value,
        objetivo: form.objetivo.value.trim(),
        sobre: form.sobre.value.trim()
    };
}

// Atualiza o card da esquerda com os valores recebidos (do formulário ou salvos).
function renderResumo(valores) {
    const nome = valores.nome || usuario.nome;
    const campos = [valores.cargoAtual, valores.area, valores.nivel, valores.objetivo, valores.sobre];
    const completo = Math.round(campos.filter(Boolean).length / campos.length * 100);

    setTexto("perfil-avatar", gerarIniciais(nome));
    setTexto("perfil-nome", nome);
    setTexto("perfil-cargo", valores.cargoAtual || "Cargo não informado");
    setTexto("perfil-nivel", valores.nivel ? "Nível " + valores.nivel : "Nível não definido");
    document.getElementById("perfil-nivel").classList.toggle("vazio", !valores.nivel);
    setTexto("perfil-area", valores.area || "Não definida");
    setTexto("perfil-completo-texto", completo + "%");
    document.getElementById("perfil-completo-barra").style.width = completo + "%";
}

// Coloca os dados salvos no formulário (ao abrir a página ou ao cancelar).
function preencherFormulario() {
    const { perfil } = getDadosUsuario(usuario.id);

    form.nome.value = usuario.nome;
    form.cargoAtual.value = perfil.cargoAtual;
    form.area.value = perfil.area;
    form.nivel.value = perfil.nivel;
    form.objetivo.value = perfil.objetivo;
    form.sobre.value = perfil.sobre;

    renderResumo(lerFormulario());
}

function setModoEdicao(editando) {
    document.getElementById("perfil-campos").disabled = !editando;
    document.getElementById("botao-editar").hidden = editando;
    document.getElementById("botao-cancelar").hidden = !editando;
    document.getElementById("botao-salvar").hidden = !editando;
    mostrarMensagem("perfil-message", "", "");

    if (editando) form.cargoAtual.focus();
}

function salvarPerfil(event) {
    event.preventDefault();

    const valores = lerFormulario();

    if (!valores.nome) {
        mostrarMensagem("perfil-message", "O nome completo é obrigatório.", "is-error");
        form.nome.focus();
        return;
    }

    const dados = getDadosUsuario(usuario.id);
    dados.perfil = {
        area: valores.area,
        cargoAtual: valores.cargoAtual,
        nivel: valores.nivel,
        objetivo: valores.objetivo,
        sobre: valores.sobre
    };
    salvarDadosUsuario(usuario.id, dados);

    usuario.nome = valores.nome;
    salvarUsuarioLogado(usuario);

    renderCabecalho();
    setModoEdicao(false);
    mostrarToast("Perfil salvo com sucesso!");
}

function cancelarEdicao() {
    preencherFormulario();
    setModoEdicao(false);
}

document.addEventListener("DOMContentLoaded", () => {
    if (!usuario) return;

    preencherFormulario();

    form.addEventListener("input", () => renderResumo(lerFormulario()));
    form.addEventListener("submit", salvarPerfil);
    document.getElementById("botao-editar").addEventListener("click", () => setModoEdicao(true));
    document.getElementById("botao-cancelar").addEventListener("click", cancelarEdicao);
});
