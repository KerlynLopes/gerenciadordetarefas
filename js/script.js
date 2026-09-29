let tarefas = [];

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

botaoCriarCategoria.addEventListener("click", function () {
    let nomeCategoria = prompt("Qual será o nome da nova categoria?");

    if (nomeCategoria === null || nomeCategoria.trim() === "") {
        return;
    }

    nomeCategoria = nomeCategoria.trim();

    let listaCategorias = document.querySelector("#menu-categorias");
    let novaOpcao = document.createElement("li");
    let novoBotao = document.createElement("button");

    novoBotao.textContent = "📁 " + nomeCategoria;
    novoBotao.dataset.categoria = nomeCategoria.toLowerCase().replace(/\s+/g, "-");
    ativarBotaoCategoria(novoBotao);
    novaOpcao.appendChild(novoBotao);

    listaCategorias.insertBefore(novaOpcao, botaoCriarCategoria.parentElement);
});

filtrarTarefas("todas");
document.querySelector('[data-categoria="todas"]').classList.add("ativo");

let botao = document.querySelector("#adicionar");
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

function criarPostit(tarefa) {
    let postit = document.createElement("div");

    postit.classList.add("postit");
    postit.classList.add(tarefa.categoria);
    postit.dataset.prioridade = tarefa.prioridade;

    postit.innerHTML = `
        <h2>${tarefa.titulo}</h2>
        <p>${tarefa.descricao}</p>
        <p>Prioridade: ${tarefa.prioridade}</p>
        <p>Categoria: ${tarefa.categoria}</p>
    `;

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
            }
        });

        document.querySelector("#lista-excluidas").appendChild(postit);
        return;
    }

    let botaoConcluir = document.createElement("button");
    botaoConcluir.textContent = "Concluir";
    botaoConcluir.classList.add("concluir");

    let botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("excluir");

    postit.appendChild(botaoConcluir);
    postit.appendChild(botaoExcluir);

    botaoExcluir.addEventListener("click", function () {
        tarefa.excluida = true;
        salvarTarefas();

        postit.remove();
        criarPostit(tarefa);
    });

    botaoConcluir.addEventListener("click", function () {
        tarefa.concluida = true;
        salvarTarefas();

        postit.remove();
        criarPostit(tarefa);
    });

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

    let tarefa = {
        titulo: titulo,
        descricao: descricao,
        categoria: categoria,
        prioridade: prioridade,
        concluida: false,
        excluida: false
    };
    
    tarefas.push(tarefa);
    salvarTarefas();
    criarPostit(tarefa);
    ordenarPostits();
    novaTarefa.style.display = "none";
    fundoModal.style.display = "none";
});

let botaoLixeira = document.querySelector("#abrir-lixeira");
let areaLixeira = document.querySelector("#area-lixeira");

botaoLixeira.addEventListener("click", function () {
    if (areaLixeira.style.display === "block") {
        areaLixeira.style.display = "none";
    } else {
        areaLixeira.style.display = "block";
    }
});

let tarefasSalvas = localStorage.getItem("tarefas");
if (tarefasSalvas !== null) {
    tarefas = JSON.parse(tarefasSalvas);
    tarefas.forEach(function (tarefa) {
        criarPostit(tarefa);
    });
    ordenarPostits();
}