// Catálogo da plataforma: vagas e trilhas de estudo.
// São dados fixos do NextPath (não do usuário), como os anúncios de um site de vagas.
// Para adicionar uma vaga ou trilha, basta incluir um objeto nas listas abaixo.
//
// Em "tecnologias", o nível é o mínimo exigido em bolinhas (1 a 5), igual ao de Minhas Habilidades.
// Os nomes devem ser iguais aos sugeridos em Minhas Habilidades (ex.: "Node.js", "APIs REST").

const VAGAS = [
    {
        id: 1,
        titulo: "Desenvolvedor Back-end Pleno",
        empresa: "Empresa A",
        local: "Remoto",
        modalidade: "Remoto",
        senioridade: "Pleno",
        tipo: "CLT",
        publicadaHaDias: 3,
        descricao: "Buscamos um Desenvolvedor Back-end Pleno para atuar no time de plataforma, responsável por construir e evoluir APIs REST escaláveis, com foco em performance, segurança e boas práticas de arquitetura.",
        requisitos: [
            "Experiência com Node.js e Express",
            "Conhecimento em bancos de dados SQL",
            "Experiência com APIs REST",
            "Familiaridade com Git e Docker"
        ],
        tecnologias: [
            { nome: "Node.js", nivel: 4 },
            { nome: "JavaScript", nivel: 4 },
            { nome: "SQL", nivel: 3 },
            { nome: "APIs REST", nivel: 4 },
            { nome: "Git", nivel: 3 },
            { nome: "Docker", nivel: 2 },
            { nome: "AWS", nivel: 2 }
        ]
    },
    {
        id: 2,
        titulo: "Desenvolvedor Full Stack",
        empresa: "Empresa B",
        local: "São Paulo/SP",
        modalidade: "Híbrido",
        senioridade: "Pleno",
        tipo: "CLT",
        publicadaHaDias: 5,
        descricao: "Procuramos uma pessoa desenvolvedora Full Stack para criar novas funcionalidades de ponta a ponta no nosso produto web, do layout responsivo até a API e o banco de dados.",
        requisitos: [
            "Experiência com JavaScript no front-end e no back-end",
            "Conhecimento em React",
            "Criação de interfaces responsivas com HTML e CSS",
            "Noções de banco de dados relacional"
        ],
        tecnologias: [
            { nome: "JavaScript", nivel: 4 },
            { nome: "React", nivel: 3 },
            { nome: "Node.js", nivel: 3 },
            { nome: "HTML e CSS", nivel: 4 },
            { nome: "SQL", nivel: 2 },
            { nome: "Git", nivel: 3 }
        ]
    },
    {
        id: 3,
        titulo: "Desenvolvedor Back-end Júnior",
        empresa: "Empresa C",
        local: "Belo Horizonte/MG",
        modalidade: "Remoto",
        senioridade: "Júnior",
        tipo: "CLT",
        publicadaHaDias: 1,
        descricao: "Vaga para quem está começando no back-end e quer crescer em um time que valoriza aprendizado, revisão de código e pareamento.",
        requisitos: [
            "Conhecimento em JavaScript",
            "Noções de Node.js e APIs REST",
            "Consultas SQL básicas",
            "Uso de Git no dia a dia"
        ],
        tecnologias: [
            { nome: "JavaScript", nivel: 3 },
            { nome: "Node.js", nivel: 2 },
            { nome: "SQL", nivel: 2 },
            { nome: "APIs REST", nivel: 2 },
            { nome: "Git", nivel: 2 }
        ]
    },
    {
        id: 4,
        titulo: "Programador Back-end Júnior",
        empresa: "Empresa D",
        local: "Curitiba/PR",
        modalidade: "Remoto",
        senioridade: "Júnior",
        tipo: "PJ",
        publicadaHaDias: 7,
        descricao: "Atuação na manutenção e evolução de sistemas internos em Java, integrando serviços por meio de APIs REST.",
        requisitos: [
            "Conhecimento em Java e orientação a objetos",
            "Consultas SQL",
            "Noções de Linux e linha de comando"
        ],
        tecnologias: [
            { nome: "Java", nivel: 3 },
            { nome: "SQL", nivel: 2 },
            { nome: "APIs REST", nivel: 2 },
            { nome: "Git", nivel: 2 },
            { nome: "Linux", nivel: 1 }
        ]
    },
    {
        id: 5,
        titulo: "Desenvolvedor Front-end Júnior",
        empresa: "Empresa E",
        local: "Recife/PE",
        modalidade: "Presencial",
        senioridade: "Júnior",
        tipo: "CLT",
        publicadaHaDias: 2,
        descricao: "Desenvolvimento de telas acessíveis e responsivas para aplicações web, em parceria com o time de design.",
        requisitos: [
            "HTML semântico e CSS responsivo",
            "JavaScript moderno",
            "Noções de React e TypeScript"
        ],
        tecnologias: [
            { nome: "HTML e CSS", nivel: 3 },
            { nome: "JavaScript", nivel: 3 },
            { nome: "React", nivel: 2 },
            { nome: "TypeScript", nivel: 1 },
            { nome: "Git", nivel: 2 }
        ]
    },
    {
        id: 6,
        titulo: "Analista de Dados Júnior",
        empresa: "Empresa F",
        local: "Porto Alegre/RS",
        modalidade: "Híbrido",
        senioridade: "Júnior",
        tipo: "CLT",
        publicadaHaDias: 4,
        descricao: "Apoio às áreas de negócio com análises, relatórios e automações de dados.",
        requisitos: [
            "Python para análise de dados",
            "Consultas SQL intermediárias",
            "Boa comunicação para apresentar resultados"
        ],
        tecnologias: [
            { nome: "Python", nivel: 3 },
            { nome: "SQL", nivel: 3 },
            { nome: "Comunicação", nivel: 3 },
            { nome: "Git", nivel: 1 }
        ]
    },
    {
        id: 7,
        titulo: "Engenheiro DevOps Pleno",
        empresa: "Empresa G",
        local: "Remoto",
        modalidade: "Remoto",
        senioridade: "Pleno",
        tipo: "PJ",
        publicadaHaDias: 6,
        descricao: "Responsável por automatizar a infraestrutura, os pipelines de entrega e o monitoramento das aplicações na nuvem.",
        requisitos: [
            "Linux avançado",
            "Containers com Docker",
            "Serviços da AWS",
            "Scripts de automação"
        ],
        tecnologias: [
            { nome: "Linux", nivel: 4 },
            { nome: "Docker", nivel: 4 },
            { nome: "AWS", nivel: 3 },
            { nome: "Git", nivel: 3 },
            { nome: "Python", nivel: 2 }
        ]
    }
];

// Cada trilha desenvolve uma habilidade até o "nivelAlvo" (em bolinhas).
const TRILHAS = [
    { id: "nodejs", titulo: "Trilha Back-end com Node.js", habilidade: "Node.js", nivelAlvo: 4, icone: "bi-bezier2",
      modulos: ["Fundamentos do Node.js", "Módulos e npm", "APIs com Express", "Banco de dados com Node.js", "Testes e deploy"] },
    { id: "docker", titulo: "Docker do Zero ao Deploy", habilidade: "Docker", nivelAlvo: 3, icone: "bi-box-seam",
      modulos: ["O que são containers", "Imagens e Dockerfile", "Docker Compose", "Deploy de containers"] },
    { id: "aws", titulo: "AWS para Desenvolvedores", habilidade: "AWS", nivelAlvo: 3, icone: "bi-cloud",
      modulos: ["Conceitos de nuvem", "EC2 e S3", "Bancos de dados na AWS", "Deploy de aplicações"] },
    { id: "sql", titulo: "SQL na Prática", habilidade: "SQL", nivelAlvo: 4, icone: "bi-database",
      modulos: ["SELECT e filtros", "JOINs", "Agrupamentos", "Índices e performance", "Modelagem de dados"] },
    { id: "javascript", titulo: "JavaScript Moderno", habilidade: "JavaScript", nivelAlvo: 4, icone: "bi-filetype-js",
      modulos: ["Tipos e funções", "Arrays e objetos", "DOM e eventos", "Assincronismo e Promises", "Módulos"] },
    { id: "apis", titulo: "APIs REST Profissionais", habilidade: "APIs REST", nivelAlvo: 4, icone: "bi-plug",
      modulos: ["Verbos e status HTTP", "Boas práticas de rotas", "Autenticação", "Documentação", "Versionamento"] },
    { id: "git", titulo: "Git e GitHub para Times", habilidade: "Git", nivelAlvo: 3, icone: "bi-git",
      modulos: ["Commits e histórico", "Branches", "Pull requests", "Resolvendo conflitos"] },
    { id: "react", titulo: "React do Básico ao Avançado", habilidade: "React", nivelAlvo: 3, icone: "bi-filetype-jsx",
      modulos: ["Componentes e props", "Estado e eventos", "Hooks", "Rotas", "Consumindo APIs"] },
    { id: "htmlcss", titulo: "HTML e CSS Responsivo", habilidade: "HTML e CSS", nivelAlvo: 4, icone: "bi-filetype-html",
      modulos: ["HTML semântico", "Flexbox", "Grid", "Responsividade", "Acessibilidade"] },
    { id: "typescript", titulo: "TypeScript Essencial", habilidade: "TypeScript", nivelAlvo: 3, icone: "bi-filetype-tsx",
      modulos: ["Tipos básicos", "Interfaces", "Generics", "TypeScript no projeto"] },
    { id: "python", titulo: "Python para Dados", habilidade: "Python", nivelAlvo: 3, icone: "bi-filetype-py",
      modulos: ["Sintaxe básica", "Listas e dicionários", "Pandas", "Gráficos"] },
    { id: "java", titulo: "Java Orientado a Objetos", habilidade: "Java", nivelAlvo: 3, icone: "bi-cup-hot",
      modulos: ["Classes e objetos", "Herança e interfaces", "Coleções", "Exceções"] },
    { id: "linux", titulo: "Linux para Desenvolvedores", habilidade: "Linux", nivelAlvo: 4, icone: "bi-terminal",
      modulos: ["Terminal e arquivos", "Permissões", "Processos e serviços", "Shell script"] },
    { id: "comunicacao", titulo: "Comunicação no Trabalho", habilidade: "Comunicação", nivelAlvo: 3, icone: "bi-chat-dots",
      modulos: ["Escuta ativa", "Apresentando resultados", "Feedback"] }
];

// Categoria usada quando uma habilidade é adicionada pelos Gaps ou por uma trilha.
const CATEGORIAS = {
    "JavaScript": "Linguagens", "TypeScript": "Linguagens", "Python": "Linguagens", "Java": "Linguagens",
    "Node.js": "Back-end", "APIs REST": "Back-end",
    "React": "Front-end", "HTML e CSS": "Front-end",
    "SQL": "Banco de Dados",
    "Docker": "Infraestrutura", "AWS": "Infraestrutura", "Linux": "Infraestrutura",
    "Git": "Ferramentas",
    "Comunicação": "Soft skills"
};

/* ===== Funções de compatibilidade (usadas por Vagas, Detalhes, Compatibilidade, Gaps e Trilhas) ===== */

function getVaga(id) {
    return VAGAS.find(vaga => vaga.id === Number(id));
}

// Bolinhas que o usuário tem numa habilidade (0 se não cadastrou).
function pontosDoUsuario(habilidades, nome) {
    const habilidade = habilidades.find(h => h.nome.trim().toLowerCase() === nome.toLowerCase());
    return habilidade ? getPontos(habilidade) : 0;
}

// Compara as habilidades do usuário com as tecnologias da vaga.
// Cada requisito vale de 0% a 100% (bolinhas do usuário ÷ bolinhas exigidas).
function analisarVaga(vaga, habilidades) {
    const requisitos = vaga.tecnologias.map(tecnologia => {
        const pontos = pontosDoUsuario(habilidades, tecnologia.nome);
        const progresso = Math.min(100, Math.round(pontos / tecnologia.nivel * 100));
        let situacao = "nao_atende";
        if (pontos >= tecnologia.nivel) situacao = "atende";
        else if (pontos > 0) situacao = "desenvolvendo";
        return { ...tecnologia, pontos, progresso, situacao };
    });

    const soma = requisitos.reduce((total, requisito) => total + requisito.progresso, 0);

    return {
        porcentagem: Math.round(soma / requisitos.length),
        requisitos,
        atende: requisitos.filter(r => r.situacao === "atende"),
        desenvolvendo: requisitos.filter(r => r.situacao === "desenvolvendo"),
        naoAtende: requisitos.filter(r => r.situacao === "nao_atende"),
        gaps: requisitos.filter(r => r.situacao !== "atende")
    };
}

// Vaga escolhida pelo usuário: vem da URL (?id=1) ou da última vaga vista.
// Ao abrir uma vaga pela URL, ela fica salva para as outras páginas.
function getVagaSelecionada() {
    const dados = getDadosUsuario(usuario.id);
    const idDaUrl = new URLSearchParams(window.location.search).get("id");

    if (idDaUrl && getVaga(idDaUrl)) {
        dados.vagaSelecionada = Number(idDaUrl);
        salvarDadosUsuario(usuario.id, dados);
    }

    return getVaga(dados.vagaSelecionada);
}
