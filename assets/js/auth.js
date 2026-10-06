function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarMensagem(elemento, mensagem, tipo) {
    elemento.textContent = mensagem;
    elemento.classList.remove("is-error", "is-success");

    if (tipo) {
        elemento.classList.add(tipo);
    }
}

function limparErros(form) {
    form.querySelectorAll(".is-invalid").forEach((campo) => {
        campo.classList.remove("is-invalid");
    });
}

function validarLogin(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.email.value.trim();
    const senha = form.password.value.trim();
    const mensagem = document.querySelector("#login-message");

    limparErros(form);

    if (!email || !validarEmail(email)) {
        form.email.classList.add("is-invalid");
        mensagem.textContent = "Informe um e-mail válido.";
        mensagem.className = "auth-message is-error";
        return;
    }

    if (!senha) {
        form.password.classList.add("is-invalid");
        mensagem.textContent = "Informe sua senha.";
        mensagem.className = "auth-message is-error";
        return;
    }

    mostrarMensagem(mensagem, "Login validado com sucesso.", "is-success");
}

function validarCadastro(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const nome = form.name.value.trim();
    const email = form.email.value.trim();
    const senha = form.password.value;
    const confirmarSenha = form.confirmPassword.value;
    const termos = form.terms.checked;
    const mensagem = document.querySelector("#signup-message");

    limparErros(form);

    if (!nome) {
        form.name.classList.add("is-invalid");
        mensagem.textContent = "O nome completo é obrigatório.";
        mensagem.className = "auth-message is-error";
        return;
    }

    if (!email || !validarEmail(email)) {
        form.email.classList.add("is-invalid");
        mensagem.textContent = "Informe um e-mail válido.";
        mensagem.className = "auth-message is-error";
        return;
    }

    if (!senha || senha.length < 6) {
        form.password.classList.add("is-invalid");
        mensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";
        mensagem.className = "auth-message is-error";
        return;
    }

    if (!confirmarSenha) {
        form.confirmPassword.classList.add("is-invalid");
        mensagem.textContent = "Confirme sua senha.";
        mensagem.className = "auth-message is-error";
        return;
    }

    if (senha !== confirmarSenha) {
        form.password.classList.add("is-invalid");
        form.confirmPassword.classList.add("is-invalid");
        mensagem.textContent = "As senhas não coincidem.";
        mensagem.className = "auth-message is-error";
        return;
    }

    if (!termos) {
        form.terms.classList.add("is-invalid");
        mensagem.textContent = "Você deve aceitar os termos de uso.";
        mensagem.className = "auth-message is-error";
        return;
    }

    mostrarMensagem(mensagem, "Cadastro realizado com sucesso.", "is-success");
}

function validarRecuperacao(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.email.value.trim();
    const mensagem = document.querySelector("#recovery-message");
    const sucesso = document.querySelector("#recovery-success");

    limparErros(form);

    if (!email || !validarEmail(email)) {
        form.email.classList.add("is-invalid");
        mensagem.textContent = "Informe um e-mail válido.";
        mensagem.className = "auth-message is-error";

        return;
    }

    mostrarMensagem(mensagem, "Solicitação de recuperação registrada. Verifique sua caixa de entrada.", "is-success");
    sucesso.hidden = false;
}
