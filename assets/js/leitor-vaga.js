// Leitor de vagas: transforma o texto colado de uma vaga (LinkedIn, Gupy, site da empresa...)
// em um objeto organizado. Não usa IA nem API: procura palavras-chave com regras simples.
// O resultado nunca é salvo direto: o usuário revisa e corrige antes (ver vagas.js).

// Nome da tecnologia → palavras que a identificam no texto.
// Para reconhecer uma tecnologia nova, basta adicionar uma linha aqui.
const PALAVRAS_TECNOLOGIAS = {
    "JavaScript": ["javascript", "ecmascript", "es6"],
    "TypeScript": ["typescript"],
    "Node.js": ["node.js", "nodejs", "node", "express", "nestjs"],
    "React": ["react", "react.js", "reactjs", "next.js"],
    "Angular": ["angular"],
    "Vue.js": ["vue", "vue.js", "vuejs"],
    "HTML e CSS": ["html", "css", "html5", "css3", "sass"],
    "Python": ["python", "django", "flask", "pandas"],
    "Java": ["java", "spring", "spring boot"],
    "C#": ["c#", ".net", "dotnet", "asp.net"],
    "PHP": ["php", "laravel"],
    "SQL": ["sql", "mysql", "sql server", "oracle", "banco de dados relacional", "bancos de dados relacionais"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MongoDB": ["mongodb", "mongo", "nosql"],
    "Git": ["git", "github", "gitlab", "bitbucket"],
    "Docker": ["docker", "containers", "container"],
    "Kubernetes": ["kubernetes", "k8s"],
    "Linux": ["linux"],
    "AWS": ["aws", "amazon web services"],
    "Azure": ["azure"],
    "APIs REST": ["rest", "restful", "api rest", "apis rest", "api restful"],
    "Testes automatizados": ["testes automatizados", "testes unitários", "testes unitarios", "jest", "tdd", "cypress", "junit"],
    "Scrum": ["scrum", "metodologias ágeis", "metodologia ágil", "kanban"],
    "Power BI": ["power bi"],
    "Excel": ["excel"],
    "Inglês": ["inglês", "ingles", "english"],
    "Comunicação": ["comunicação", "comunicacao", "comunicativo", "comunicativa"]
};

// Nível exigido (bolinhas) conforme a senioridade da vaga. Diferenciais exigem 1 a menos.
const NIVEL_POR_SENIORIDADE = { "Estágio": 1, "Júnior": 2, "Pleno": 3, "Sênior": 4, "Especialista": 5 };

const SENIORIDADES = {
    "Estágio": /est[áa]gi/i,
    "Júnior": /j[úu]nior|\bjr\b/i,
    "Pleno": /\bpleno\b|\bpl\b|mid-level/i,
    "Sênior": /s[êe]nior|\bsr\b/i,
    "Especialista": /especialista|\bstaff\b|tech lead/i
};

const UFS = "AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO";

// Expressão que encontra a palavra inteira (ex.: "java" não encontra "javascript").
function regexDaPalavra(palavra) {
    const escapada = palavra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9à-ú#.])${escapada}($|[^a-z0-9à-ú#])`, "i");
}

// Primeira opção cuja expressão aparece no texto. Ex.: encontrar(texto, { "Remoto": /remot/ })
function encontrar(texto, opcoes) {
    return Object.keys(opcoes).find(nome => opcoes[nome].test(texto)) || "";
}

/* ===== Seções do texto (Requisitos, Diferenciais, Atividades...) ===== */

const TITULOS_DE_SECAO = {
    diferenciais: /diferencia|desejáve|desejave|será um plus|bônus|nice to have/i,
    requisitos: /requisito|qualifica|exigid|o que esperamos|o que buscamos|precisa ter|competência|conhecimentos/i,
    atividades: /responsabilidade|atividade|atribuiç|você vai|o que você fará|dia a dia/i,
    beneficios: /benefício|beneficio|oferecemos|vantagens/i,
    sobre: /sobre|descrição|descricao|a vaga|quem somos|a empresa/i
};

const MARCADOR_DE_LISTA = /^\s*([-•*·●▪➢✓✔]|\d+[.)])\s*/;
const LINHA_DE_CAMPO = /^(empresa|local|localização|localizacao|contratação|contratacao|modalidade|tipo|regime|salário|salario)\s*:/i;

// Um título de seção é uma linha curta, sem marcador, que contém uma das palavras acima.
function getSecao(linha) {
    if (linha.length > 60 || MARCADOR_DE_LISTA.test(linha)) return null;
    return Object.keys(TITULOS_DE_SECAO).find(secao => TITULOS_DE_SECAO[secao].test(linha)) || null;
}

/* ===== Função principal ===== */

function lerVaga(texto) {
    const linhas = texto.split("\n").map(linha => linha.trim()).filter(Boolean);
    const titulo = (linhas[0] || "").replace(/^vaga\s*[:\-–]\s*/i, "").slice(0, 90);

    // Separa as linhas por seção
    const secoes = { inicio: [], sobre: [], requisitos: [], diferenciais: [], atividades: [], beneficios: [] };
    let secaoAtual = "inicio";
    linhas.slice(1).forEach(linha => {
        const secao = getSecao(linha);
        if (secao) secaoAtual = secao;
        else secoes[secaoAtual].push(linha.replace(MARCADOR_DE_LISTA, ""));
    });

    // Empresa: "Empresa: X", ou a 2ª linha no formato do LinkedIn "Empresa · Cidade"
    const campoEmpresa = texto.match(/^\s*(?:empresa|company)\s*[:\-–]\s*(.+)$/im);
    const segundaLinha = linhas[1] || "";
    let empresa = campoEmpresa ? campoEmpresa[1] : "";
    if (!empresa && segundaLinha.includes("·")) empresa = segundaLinha.split("·")[0];

    // Local: "São Paulo/SP", "Belo Horizonte - MG", "Recife, PE"
    const cidade = texto.match(new RegExp(`([A-ZÀ-Ú][a-zà-ú]+(?:\\s+(?:d[aeo]s?\\s+)?[A-ZÀ-Ú][a-zà-ú]+)*)\\s*[/,\\-–]\\s*(${UFS})\\b`));

    const modalidade = encontrar(texto, {
        "Híbrido": /h[íi]brid/i,
        "Remoto": /remot|home office|anywhere/i,
        "Presencial": /presencial|on-site|onsite/i
    });
    const senioridade = encontrar(titulo, SENIORIDADES) || encontrar(texto, SENIORIDADES);
    const tipo = encontrar(texto, {
        "CLT": /\bclt\b/i,
        "PJ": /\bpj\b|pessoa jur[íi]dica/i,
        "Estágio": /est[áa]gio/i,
        "Freelancer": /freela/i
    });

    // Todo o texto, menos a seção de diferenciais
    const textoSemDiferenciais = [titulo, ...secoes.inicio, ...secoes.sobre, ...secoes.requisitos,
        ...secoes.atividades, ...secoes.beneficios].join("\n");

    // Descrição: parágrafos do começo e da seção "Sobre" (sem as linhas "Campo: valor")
    const descricao = [...secoes.inicio, ...secoes.sobre]
        .filter(linha => !LINHA_DE_CAMPO.test(linha) && linha !== segundaLinha)
        .join(" ")
        .slice(0, 600);

    return {
        titulo,
        empresa: empresa.trim(),
        local: cidade ? `${cidade[1]}/${cidade[2]}` : (modalidade === "Remoto" ? "Remoto" : ""),
        modalidade,
        senioridade,
        tipo,
        descricao,
        requisitos: secoes.requisitos.slice(0, 10),
        diferenciais: secoes.diferenciais.slice(0, 10),
        atividades: secoes.atividades.slice(0, 10),
        tecnologias: encontrarTecnologias(texto, textoSemDiferenciais, senioridade)
    };
}

// Procura cada tecnologia conhecida. Se ela só aparece nos diferenciais, é "desejável".
// A lista sai na ordem em que as tecnologias aparecem no texto.
function encontrarTecnologias(texto, textoSemDiferenciais, senioridade) {
    const nivel = NIVEL_POR_SENIORIDADE[senioridade] || 2;

    return Object.keys(PALAVRAS_TECNOLOGIAS)
        .map(nome => {
            const regexes = PALAVRAS_TECNOLOGIAS[nome].map(regexDaPalavra);
            const posicoes = regexes.map(regex => texto.search(regex)).filter(posicao => posicao >= 0);
            if (!posicoes.length) return null;

            const desejavel = !regexes.some(regex => regex.test(textoSemDiferenciais));
            return {
                nome,
                nivel: desejavel ? Math.max(1, nivel - 1) : nivel,
                desejavel,
                posicao: Math.min(...posicoes)
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.posicao - b.posicao)
        .map(({ nome, nivel, desejavel }) => ({ nome, nivel, desejavel }));
}

/* ===== Perfil-alvo a partir do objetivo =====
   Quando o usuário não cola uma vaga, monta uma a partir do que ele escreveu como objetivo
   (ex.: "Desenvolvedor Back-end Pleno"), da área de interesse e do nível atual dele.
   Tecnologias = as citadas no objetivo + as essenciais da área, no nível da senioridade desejada. */
function criarVagaDoObjetivo(objetivo, area, nivelAtual) {
    const lida = lerVaga(objetivo);
    const senioridade = lida.senioridade;
    const nivel = NIVEL_POR_SENIORIDADE[senioridade] || NIVEL_DO_PROXIMO_CARGO[nivelAtual || ""] || 3;
    const nomes = [...new Set([...lida.tecnologias.map(t => t.nome), ...(TECNOLOGIAS_POR_AREA[area] || [])])];
    if (!nomes.length) return null;

    return {
        id: "v" + Date.now(),
        minha: true,
        gerada: true,
        adicionadaEm: Date.now(),
        titulo: objetivo,
        empresa: "", local: "", modalidade: "", tipo: "",
        senioridade,
        descricao: `Perfil-alvo montado pelo NextPath a partir do seu objetivo${area ? ` e da sua área (${area})` : ""}. ` +
            "Edite as tecnologias e os níveis para deixá-lo do seu jeito, ou cole uma vaga real quando encontrar.",
        requisitos: [], diferenciais: [], atividades: [],
        tecnologias: nomes.map(nome => ({ nome, nivel, desejavel: false }))
    };
}

// Texto de exemplo (botão "Usar um exemplo" em Vagas e no onboarding),
// para testar/apresentar o recurso sem precisar procurar uma vaga real.
const EXEMPLO_VAGA = `Desenvolvedor(a) Back-end Júnior
Empresa: Empresa H
Local: Florianópolis/SC (Híbrido)
Contratação: CLT

Sobre a vaga
Estamos procurando uma pessoa desenvolvedora back-end para atuar no time de pagamentos, construindo e mantendo APIs que atendem milhares de clientes.

Responsabilidades
- Desenvolver e manter APIs REST em Node.js
- Escrever testes automatizados
- Participar das cerimônias do time (Scrum)

Requisitos
- Conhecimento em JavaScript ou TypeScript
- Experiência com bancos de dados SQL (PostgreSQL)
- Versionamento de código com Git

Diferenciais
- Docker
- Conhecimentos em AWS
- Inglês intermediário

Benefícios
- Vale-refeição
- Plano de saúde`;
