let tarefas = [];

let categorias = [
    "estudos",
    "trabalho",
    "pessoal",
    "compras",
    "projetos"
];

let botaoAbrir = document.querySelector("#abrir-tarefa");
let novaTarefa = document.querySelector("#nova-tarefa");
let fundoModal = document.querySelector("#fundo-modal");
let botaoFechar = document.querySelector("#fechar-tarefa");

botaoAbrir.addEventListener("click", function () {
    novaTarefa.style.display = "block";
    fundoModal.style.display = "block";
});

botaoFechar.addEventListener("click", function () {
    novaTarefa.style.display = "none";
    fundoModal.style.display = "none";
});

function filtrarTarefas(categoriaSelecionada) {
    let postits = document.querySelectorAll("#lista-tarefas .postit, #lista-concluidas .postit");

    postits.forEach(function (postit) {
        if (
            categoriaSelecionada === "todas" ||
            postit.classList.contains(categoriaSelecionada)
        ) {
            postit.style.display = "block";
        } else {
            postit.style.display = "none";
        }
    });
}

function ativarBotaoCategoria(botaoCategoria) {
    botaoCategoria.addEventListener("click", function () {
        let categoriaSelecionada = botaoCategoria.dataset.categoria;

        filtrarTarefas(categoriaSelecionada);

        document.querySelectorAll("#menu-categorias button").forEach(function (botao) {
            botao.classList.remove("ativo");
        });

        botaoCategoria.classList.add("ativo");
    });
}

document.querySelectorAll("#menu-categorias button[data-categoria]").forEach(function (botaoCategoria) {
    ativarBotaoCategoria(botaoCategoria);
});
let botaoCriarCategoria = document.querySelector("#criar-categoria");

let fundoModalCategoria = document.querySelector("#fundo-modal-categoria");
let inputNomeCategoria = document.querySelector("#input-nome-categoria");
let botaoCancelarModal = document.querySelector("#cancelar-modal-categoria");
let botaoSalvarModal = document.querySelector("#salvar-modal-categoria");

botaoCriarCategoria.addEventListener("click", function () {
    inputNomeCategoria.value = "";
    fundoModalCategoria.style.display = "flex";
    inputNomeCategoria.focus();
});

botaoCancelarModal.addEventListener("click", function () {
    fundoModalCategoria.style.display = "none";
});

botaoSalvarModal.addEventListener("click", function () {
    let nomeCategoria = inputNomeCategoria.value.trim();

    if (nomeCategoria === "") {
        inputNomeCategoria.focus();
        return;
    }

    let listaCategorias = document.querySelector("#menu-categorias");
    let novaOpcao = document.createElement("li");
    let novoBotao = document.createElement("button");
    let selectCategoria = document.querySelector("#categoria");

    novoBotao.textContent = "📁 " + nomeCategoria;

    novoBotao.dataset.categoria = nomeCategoria
        .toLowerCase()
        .replace(/\s+/g, "-");

    categorias.push(novoBotao.dataset.categoria);
    salvarCategorias();

    let novaOpcaoSelect = document.createElement("option");

novaOpcaoSelect.value = novoBotao.dataset.categoria;
novaOpcaoSelect.textContent = nomeCategoria;

selectCategoria.appendChild(novaOpcaoSelect);

    ativarBotaoCategoria(novoBotao);

    novaOpcao.appendChild(novoBotao);

    listaCategorias.insertBefore(
        novaOpcao,
        botaoCriarCategoria.parentElement
    );

    fundoModalCategoria.style.display = "none";
});

filtrarTarefas("todas");
document.querySelector('[data-categoria="todas"]').classList.add("ativo");

let botao = document.querySelector("#adicionar");
let totalTarefas = document.querySelector("#total-tarefas");
let totalPendentes = document.querySelector("#total-pendentes");
let totalConcluidas = document.querySelector("#total-concluidas");

let barraProgresso = document.querySelector("#barra-progresso");
let porcentagemProgresso = document.querySelector("#porcentagem-progresso");

let prioridadeMaxima = document.querySelector("#prioridade-maxima");
let prioridadeMedia = document.querySelector("#prioridade-media");
let prioridadeMinima = document.querySelector("#prioridade-minima");

function atualizarDashboard() {

    let total = tarefas.filter(function (tarefa) {
        return tarefa.excluida !== true;
    }).length;

    let concluidas = tarefas.filter(function (tarefa) {
        return tarefa.concluida === true && tarefa.excluida !== true;
    }).length;

    let pendentes = tarefas.filter(function (tarefa) {
        return tarefa.concluida !== true && tarefa.excluida !== true;
    }).length;

    totalTarefas.textContent = total;
    totalPendentes.textContent = pendentes;
    totalConcluidas.textContent = concluidas;

    let porcentagem = 0;

    if (total > 0) {
        porcentagem = Math.round((concluidas / total) * 100);
    }

    barraProgresso.value = porcentagem;
    porcentagemProgresso.textContent = porcentagem + "%";

    let maxima = tarefas.filter(function (tarefa) {
        return tarefa.prioridade === "maxima" &&
               tarefa.excluida !== true;
    }).length;

    let media = tarefas.filter(function (tarefa) {
        return tarefa.prioridade === "media" &&
               tarefa.excluida !== true;
    }).length;

    let minima = tarefas.filter(function (tarefa) {
        return tarefa.prioridade === "minima" &&
               tarefa.excluida !== true;
    }).length;


    prioridadeMaxima.textContent = maxima;
    prioridadeMedia.textContent = media;
    prioridadeMinima.textContent = minima;
}

function ordenarPostits() {
    let lista = document.querySelector("#lista-tarefas");
    let postits = Array.from(lista.children);

    postits.sort(function (a, b) {
        let prioridadeA = a.dataset.prioridade;
        let prioridadeB = b.dataset.prioridade;
        let ordem = {
            maxima: 1,
            media: 2,
            minima: 3
        };
        return ordem[prioridadeA] - ordem[prioridadeB];
    });
    postits.forEach(function (postit) {
        lista.appendChild(postit);
    });
}
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function salvarCategorias() {
    localStorage.setItem("categorias", JSON.stringify(categorias));
}

function carregarCategorias() {
    let categoriasSalvas = localStorage.getItem("categorias");

    if (categoriasSalvas !== null) {
        categorias = JSON.parse(categoriasSalvas);
    }

    let listaCategorias = document.querySelector("#menu-categorias");
    let selectCategoria = document.querySelector("#categoria");

    categorias.forEach(function (categoria) {

        if (
            categoria === "estudos" ||
            categoria === "trabalho" ||
            categoria === "pessoal" ||
            categoria === "compras" ||
            categoria === "projetos"
        ) {
            return;
        }

        let novaOpcao = document.createElement("li");
        let novoBotao = document.createElement("button");

        novoBotao.textContent = "📁 " + categoria;
        novoBotao.dataset.categoria = categoria;

        ativarBotaoCategoria(novoBotao);

        novaOpcao.appendChild(novoBotao);

        listaCategorias.insertBefore(
            novaOpcao,
            botaoCriarCategoria.parentElement
        );

        let novaOpcaoSelect = document.createElement("option");

        novaOpcaoSelect.value = categoria;
        novaOpcaoSelect.textContent = categoria;

        selectCategoria.appendChild(novaOpcaoSelect);
    });
}
carregarCategorias();

function formatarData(data) { 
    if (!data) { 
        return ""; 
    } 
    let partes = data.split("-"); 
    return `${partes[2]}/${partes[1]}/${partes[0]}`; 
}

filtrarTarefas("todas");
document.querySelector('[data-categoria="todas"]').classList.add("ativo");

function criarPostit(tarefa) {
    let postit = document.createElement("div");

    postit.classList.add("postit");
    postit.classList.add(tarefa.categoria);
    postit.dataset.prioridade = tarefa.prioridade;

    postit.innerHTML = `
        <h2>${tarefa.titulo}</h2>
        <p>${tarefa.descricao}</p>
        <p>Prioridade: ${tarefa.prioridade === "maxima" ? "Máxima" : tarefa.prioridade === "media" ? "Média" : "Mínima"}</p>        <p>Categoria: ${tarefa.categoria}</p>
        <p>Data limite: ${formatarData(tarefa.data)}</p>    `;

    if (tarefa.excluida === true) {
        let botaoRestaurar = document.createElement("button");
        botaoRestaurar.textContent = "♻️ Restaurar";
        botaoRestaurar.classList.add("concluir");

        let botaoExcluirDefinitivo = document.createElement("button");
        botaoExcluirDefinitivo.textContent = "Excluir de vez";
        botaoExcluirDefinitivo.classList.add("excluir");

        postit.appendChild(botaoRestaurar);
        postit.appendChild(botaoExcluirDefinitivo);

        botaoRestaurar.addEventListener("click", function () {
            tarefa.excluida = false;
            salvarTarefas();

            postit.remove();
            criarPostit(tarefa);
            atualizarDashboard();
        });

        botaoExcluirDefinitivo.addEventListener("click", function () {
            let confirmar = confirm(
                "Deseja excluir esta tarefa permanentemente?"
            );

            if (confirmar) {
                tarefas = tarefas.filter(function (item) {
                    return item !== tarefa;
                });

                salvarTarefas();
                postit.remove();
                atualizarDashboard();
            }
        });

        document.querySelector("#lista-excluidas").appendChild(postit);
        return;
    }

    let botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("excluir");

postit.appendChild(botaoExcluir);
botaoExcluir.addEventListener("click", function () {
    tarefa.excluida = true;

    salvarTarefas();

    postit.remove();
    criarPostit(tarefa);
    atualizarDashboard();
});

if (tarefa.concluida !== true) {

    let botaoConcluir = document.createElement("button");
    botaoConcluir.textContent = "Concluir";
    botaoConcluir.classList.add("concluir");

    postit.insertBefore(botaoConcluir, botaoExcluir);

    botaoConcluir.addEventListener("click", function () {
        tarefa.concluida = true;
        salvarTarefas();

        postit.remove();
        criarPostit(tarefa);
        atualizarDashboard();
    });
}
    if (tarefa.concluida === true) {
        document.querySelector("#lista-concluidas").appendChild(postit);
    } else {
        document.querySelector("#lista-tarefas").appendChild(postit);
    }
}

botao.addEventListener("click", function () {
    let titulo = document.querySelector("#titulo").value;
    let descricao = document.querySelector("#descricao").value;
    let prioridade = document.querySelector('input[name="prioridade"]:checked').value;
    let categoria = document.querySelector("#categoria").value;
    let data = document.querySelector("#data-limite").value;

    let tarefa = {
        titulo: titulo,
        descricao: descricao,
        categoria: categoria,
        data: data,
        prioridade: prioridade,
        concluida: false,
        excluida: false
    };
    
    tarefas.push(tarefa);
    salvarTarefas();
    criarPostit(tarefa);
    ordenarPostits();
    atualizarDashboard();

    novaTarefa.style.display = "none";
    fundoModal.style.display = "none";
});

let botaoLixeira = document.querySelector("#abrir-lixeira");
let areaLixeira = document.querySelector("#area-lixeira");

botaoLixeira.addEventListener("click", function () {
    areaLixeira.style.display = "flex";
});

let botaoFecharLixeira = document.querySelector("#fechar-lixeira");

botaoFecharLixeira.addEventListener("click", function () {
    areaLixeira.style.display = "none";
});

let tarefasSalvas = localStorage.getItem("tarefas");
if (tarefasSalvas !== null) {
    tarefas = JSON.parse(tarefasSalvas);
    tarefas.forEach(function (tarefa) {
        criarPostit(tarefa);
    });
    ordenarPostits();
}
atualizarDashboard();