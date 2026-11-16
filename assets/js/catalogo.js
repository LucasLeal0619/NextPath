// Base de conhecimento do NextPath + funções que cruzam essa base com os dados de cada usuário.
// Aqui NÃO há dados de demonstração: não existem vagas prontas nem usuários fictícios.
// As vagas são as que o próprio usuário colou (ou o perfil-alvo gerado pelo objetivo dele),
// e as trilhas são montadas para cada habilidade, no nível que aquele usuário precisa.

/* ===== Conteúdo das trilhas =====
   Módulos de estudo para habilidades conhecidas. Para qualquer outra habilidade,
   montarTrilha() cria módulos genéricos (ex.: "Fundamentos de Figma"). */
const CONTEUDO_TRILHAS = {
    "Node.js": { titulo: "Back-end com Node.js", icone: "bi-bezier2",
        modulos: ["Fundamentos do Node.js", "Módulos e npm", "APIs com Express", "Banco de dados com Node.js", "Testes e deploy"] },
    "Docker": { titulo: "Docker do Zero ao Deploy", icone: "bi-box-seam",
        modulos: ["O que são containers", "Imagens e Dockerfile", "Docker Compose", "Deploy de containers"] },
    "AWS": { titulo: "AWS para Desenvolvedores", icone: "bi-cloud",
        modulos: ["Conceitos de nuvem", "EC2 e S3", "Bancos de dados na AWS", "Deploy de aplicações"] },
    "SQL": { titulo: "SQL na Prática", icone: "bi-database",
        modulos: ["SELECT e filtros", "JOINs", "Agrupamentos", "Índices e performance", "Modelagem de dados"] },
    "JavaScript": { titulo: "JavaScript Moderno", icone: "bi-filetype-js",
        modulos: ["Tipos e funções", "Arrays e objetos", "DOM e eventos", "Assincronismo e Promises", "Módulos"] },
    "APIs REST": { titulo: "APIs REST Profissionais", icone: "bi-plug",
        modulos: ["Verbos e status HTTP", "Boas práticas de rotas", "Autenticação", "Documentação", "Versionamento"] },
    "Git": { titulo: "Git e GitHub para Times", icone: "bi-git",
        modulos: ["Commits e histórico", "Branches", "Pull requests", "Resolvendo conflitos"] },
    "React": { titulo: "React do Básico ao Avançado", icone: "bi-filetype-jsx",
        modulos: ["Componentes e props", "Estado e eventos", "Hooks", "Rotas", "Consumindo APIs"] },
    "HTML e CSS": { titulo: "HTML e CSS Responsivo", icone: "bi-filetype-html",
        modulos: ["HTML semântico", "Flexbox", "Grid", "Responsividade", "Acessibilidade"] },
    "TypeScript": { titulo: "TypeScript Essencial", icone: "bi-filetype-tsx",
        modulos: ["Tipos básicos", "Interfaces", "Generics", "TypeScript no projeto"] },
    "Python": { titulo: "Python na Prática", icone: "bi-filetype-py",
        modulos: ["Sintaxe básica", "Listas e dicionários", "Funções e módulos", "Bibliotecas populares"] },
    "Java": { titulo: "Java Orientado a Objetos", icone: "bi-cup-hot",
        modulos: ["Classes e objetos", "Herança e interfaces", "Coleções", "Exceções"] },
    "Linux": { titulo: "Linux para Desenvolvedores", icone: "bi-terminal",
        modulos: ["Terminal e arquivos", "Permissões", "Processos e serviços", "Shell script"] },
    "Comunicação": { titulo: "Comunicação no Trabalho", icone: "bi-chat-dots",
        modulos: ["Escuta ativa", "Apresentando resultados", "Feedback"] },
    "Testes automatizados": { titulo: "Testes Automatizados na Prática", icone: "bi-check2-square",
        modulos: ["Por que testar", "Testes unitários", "Mocks", "Testes de integração"] },
    "Inglês": { titulo: "Inglês para Tecnologia", icone: "bi-translate",
        modulos: ["Vocabulário técnico", "Lendo documentação", "Reuniões em inglês"] }
};

// Usados quando a habilidade não tem conteúdo próprio. {h} vira o nome da habilidade.
const MODULOS_GENERICOS = ["Fundamentos de {h}", "Exercícios guiados de {h}", "Projeto prático com {h}",
    "Boas práticas de {h}", "{h} no dia a dia do mercado"];

// Categoria usada quando uma habilidade é adicionada pelos Gaps, por uma trilha ou pelo onboarding.
const CATEGORIAS = {
    "JavaScript": "Linguagens", "TypeScript": "Linguagens", "Python": "Linguagens", "Java": "Linguagens",
    "C#": "Linguagens", "PHP": "Linguagens",
    "Node.js": "Back-end", "APIs REST": "Back-end",
    "React": "Front-end", "Angular": "Front-end", "Vue.js": "Front-end", "HTML e CSS": "Front-end",
    "SQL": "Banco de Dados", "PostgreSQL": "Banco de Dados", "MongoDB": "Banco de Dados",
    "Docker": "Infraestrutura", "Kubernetes": "Infraestrutura", "AWS": "Infraestrutura",
    "Azure": "Infraestrutura", "Linux": "Infraestrutura",
    "Git": "Ferramentas", "Testes automatizados": "Ferramentas", "Power BI": "Ferramentas", "Excel": "Ferramentas",
    "Scrum": "Soft skills", "Comunicação": "Soft skills", "Inglês": "Soft skills"
};

// Habilidades essenciais de cada área (sugestões do onboarding, perfil-alvo e trilhas).
// Áreas fora desta lista também funcionam: só não recebem sugestões automáticas.
const TECNOLOGIAS_POR_AREA = {
    "Back-end": ["JavaScript", "Node.js", "SQL", "APIs REST", "Git", "Docker"],
    "Front-end": ["HTML e CSS", "JavaScript", "React", "TypeScript", "Git", "Testes automatizados"],
    "Full Stack": ["HTML e CSS", "JavaScript", "React", "Node.js", "SQL", "Git"],
    "Dados": ["Python", "SQL", "Excel", "Power BI", "Git", "Comunicação"],
    "DevOps / Cloud": ["Linux", "Docker", "AWS", "Git", "Python", "Kubernetes"],
    "Mobile": ["JavaScript", "React", "TypeScript", "Git", "APIs REST"],
    "QA / Testes": ["Testes automatizados", "JavaScript", "Git", "SQL", "Comunicação"],
    "UX / UI": ["HTML e CSS", "Comunicação", "Inglês"],
    "Segurança da Informação": ["Linux", "Python", "AWS", "Git"]
};

// Nível profissional atual → bolinhas esperadas no próximo nível da carreira.
const NIVEL_DO_PROXIMO_CARGO = { "": 2, "Estagiário": 2, "Júnior": 3, "Pleno": 4, "Sênior": 5, "Especialista": 5 };

/* ===== Vagas do usuário ===== */

function getTodasVagas() {
    return getDadosUsuario(usuario.id).vagas;
}

function getVaga(id) {
    return getTodasVagas().find(vaga => String(vaga.id) === String(id));
}

function diasDesde(vaga) {
    return Math.floor((Date.now() - vaga.adicionadaEm) / 86400000);
}

// Vaga escolhida: vem da URL (?id=...), da última vaga vista ou, por fim, da vaga-objetivo do perfil.
function getVagaSelecionada() {
    const dados = getDadosUsuario(usuario.id);
    const idDaUrl = new URLSearchParams(window.location.search).get("id");

    if (idDaUrl && getVaga(idDaUrl)) {
        dados.vagaSelecionada = idDaUrl;
        salvarDadosUsuario(usuario.id, dados);
    }

    return getVaga(dados.vagaSelecionada) || getVaga(dados.perfil.vagaObjetivo);
}

// Vaga que o usuário almeja (definida no onboarding, ao salvar uma vaga, nos Detalhes ou no Perfil).
function getVagaObjetivo() {
    return getVaga(getDadosUsuario(usuario.id).perfil.vagaObjetivo);
}

/* ===== Compatibilidade ===== */

function encontrarHabilidade(habilidades, nome) {
    return habilidades.find(h => h.nome.trim().toLowerCase() === nome.trim().toLowerCase());
}

// Progresso (0 a 100) que o usuário tem numa habilidade (0 se não cadastrou).
function progressoDoUsuario(habilidades, nome) {
    const habilidade = encontrarHabilidade(habilidades, nome);
    return habilidade ? getProgresso(habilidade) : 0;
}

// Compara as habilidades do usuário com as tecnologias da vaga.
// Cada requisito vale de 0% a 100% (progresso do usuário ÷ progresso exigido), então cada
// módulo estudado já aumenta a compatibilidade. A porcentagem usa só os obrigatórios;
// os diferenciais ("desejavel") aparecem nos gaps.
function analisarVaga(vaga, habilidades) {
    const requisitos = vaga.tecnologias.map(tecnologia => {
        const atual = progressoDoUsuario(habilidades, tecnologia.nome);
        const exigido = tecnologia.nivel * 20;
        let situacao = "nao_atende";
        if (atual >= exigido) situacao = "atende";
        else if (atual > 0) situacao = "desenvolvendo";
        return {
            ...tecnologia,
            pontos: Math.round(atual / 20),
            progresso: Math.min(100, Math.round(atual / exigido * 100)),
            situacao
        };
    });

    const obrigatorios = requisitos.filter(r => !r.desejavel);
    const base = obrigatorios.length ? obrigatorios : requisitos;
    const soma = base.reduce((total, requisito) => total + requisito.progresso, 0);

    return {
        porcentagem: base.length ? Math.round(soma / base.length) : 0,
        requisitos: base,
        atende: base.filter(r => r.situacao === "atende"),
        desenvolvendo: base.filter(r => r.situacao === "desenvolvendo"),
        naoAtende: base.filter(r => r.situacao === "nao_atende"),
        // Gaps: primeiro os obrigatórios, depois os diferenciais
        gaps: [...obrigatorios, ...requisitos.filter(r => r.desejavel)].filter(r => r.situacao !== "atende")
    };
}

/* ===== Trilhas =====
   O progresso de cada trilha fica em dados.trilhas[id]:
   { habilidade, nivelAlvo, base, concluidos: [0, 1], criadaPeloUsuario }
   "base" é o progresso que a habilidade tinha quando a trilha começou. */

// "Testes automatizados" → "trilha-testes-automatizados"
function idDaTrilha(habilidade) {
    return "trilha-" + habilidade.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
}

function getRegistroTrilha(dados, habilidade) {
    const registro = dados.trilhas[idDaTrilha(habilidade)];
    return registro && registro.concluidos ? registro : null;   // ignora formatos antigos
}

// Monta a trilha de uma habilidade. Se o usuário já começou, mantém o nível alvo de quando começou.
function montarTrilha(dados, habilidade, nivelAlvo) {
    const registro = getRegistroTrilha(dados, habilidade);
    const alvo = registro ? registro.nivelAlvo : nivelAlvo;
    const conteudo = CONTEUDO_TRILHAS[habilidade];
    const modulos = conteudo
        ? conteudo.modulos
        : MODULOS_GENERICOS.slice(0, Math.max(3, alvo)).map(modulo => modulo.replace("{h}", habilidade));

    return {
        id: idDaTrilha(habilidade),
        habilidade,
        nivelAlvo: alvo,
        titulo: conteudo ? conteudo.titulo : `Trilha de ${habilidade}`,
        icone: conteudo ? conteudo.icone : "bi-journal-code",
        modulos,
        concluidos: registro ? registro.concluidos : []
    };
}

function getProgressoTrilha(trilha) {
    return Math.round(trilha.concluidos.length / trilha.modulos.length * 100);
}

// Salva os módulos concluídos e atualiza a habilidade na hora: cada módulo leva o
// progresso da habilidade um pouco mais perto do nível alvo da trilha.
function estudarTrilha(dados, trilha, concluidos) {
    let habilidade = encontrarHabilidade(dados.habilidades, trilha.habilidade);
    if (!habilidade) {
        habilidade = { nome: trilha.habilidade, categoria: CATEGORIAS[trilha.habilidade] || "Outras", progresso: 0 };
        dados.habilidades.push(habilidade);
    }

    const registro = getRegistroTrilha(dados, trilha.habilidade)
        || { habilidade: trilha.habilidade, nivelAlvo: trilha.nivelAlvo, base: getProgresso(habilidade) };
    registro.concluidos = concluidos;
    dados.trilhas[trilha.id] = registro;

    const alvo = trilha.nivelAlvo * 20;
    const fracao = concluidos.length / trilha.modulos.length;
    habilidade.progresso = Math.round(registro.base + Math.max(0, alvo - registro.base) * fracao);
    habilidade.status = statusPorProgresso(habilidade.progresso);
}
