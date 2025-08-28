class SistemaTarefas {
    #listaTarefas = document.getElementById("listaTarefas");
    #modal = document.getElementById('modalEditar');

    constructor(materia = "", topico = "", data = "", tempo = "") {
        this.materia = materia;
        this.topico = topico;
        this.data = data;
        this.tempo = tempo;
    }

    // Getter para acessar os dados da tarefa
    get tarefas() {
        return {
            materia: this.materia,
            topico: this.topico,
            data: this.data,
            tempo: this.tempo
        };
    }

    #obterTarefas() {
        return JSON.parse(localStorage.getItem("novaTarefa")) || [];
    }

    #salvarTarefas(tarefas) {
        localStorage.setItem("novaTarefa", JSON.stringify(tarefas));
    }

    #validarCampos(tarefa) {
        return tarefa.materia?.trim() && 
               tarefa.topico?.trim() && 
               tarefa.data && 
               tarefa.tempo;
    }

    #mostrarModal(modalId, btnId) {
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        const btn = document.getElementById(btnId);
        btn.addEventListener("click", () => {
            window.location.reload();
        });
    }

    editarTarefa(index) {
        const tarefas = this.#obterTarefas();
        const modal = new bootstrap.Modal(this.#modal);
        modal.show();

        const salvaBTN = document.getElementById("salvaBTN");
        
        // Remove event listeners anteriores para evitar duplicação
        const novoSalvaBTN = salvaBTN.cloneNode(true);
        salvaBTN.parentNode.replaceChild(novoSalvaBTN, salvaBTN);
        
        novoSalvaBTN.addEventListener("click", () => {
            console.log("Salvando edição");
            
            const novaMateria = document.getElementById("editarMateria").value;
            const novoTopico = document.getElementById("editarTopico").value;
            const novaData = document.getElementById("editarData").value;
            const novoTempo = document.getElementById("editarTempo").value;
            
            console.log(novaMateria, novoTopico, novaData, novoTempo);

            if (novaMateria?.trim()) {
                tarefas[index].materia = novaMateria.trim();
            }
            if (novoTopico?.trim()) {
                tarefas[index].topico = novoTopico.trim();
            }
            if (novaData) {
                tarefas[index].data = novaData;
            }
            if (novoTempo) {
                tarefas[index].tempo = novoTempo;
            }

            this.#salvarTarefas(tarefas);
            
            if (this.#validarCampos(tarefas[index])) {
                modal.hide();
            }
            
            this.mostrarTarefas();
        });
    }

    excluirTarefa(index) {
        const tarefas = this.#obterTarefas().filter(tarefa => tarefa);
        tarefas.splice(index, 1);
        this.#salvarTarefas(tarefas);
    }

    enviarTarefa() {
        try {
            console.log("Tarefa enviada");
            const tarefasExistentes = this.#obterTarefas().filter(tarefa => tarefa);
            const novaTarefa = this.tarefas;

            if (!this.#validarCampos(novaTarefa)) {
                this.#mostrarModal("campVazioMsg", "campVazioBTN");
                return;
            }

            const existe = tarefasExistentes.some(tarefa =>
                tarefa.topico === novaTarefa.topico &&
                tarefa.data === novaTarefa.data &&
                tarefa.tempo === novaTarefa.tempo
            );

            if (existe) {
                this.#mostrarModal("exiMateriaMsg", "exiMateriaBTN");
                return;
            }

            tarefasExistentes.push(novaTarefa);
            this.#salvarTarefas(tarefasExistentes);
            this.mostrarTarefas();
            
            console.log("Tarefa adicionada:", novaTarefa);
        } catch (error) {
            console.error("Erro ao enviar tarefa:", error);
        }
    }

    mostrarTarefas() {
        console.log("Mostrando tarefas");
        this.#listaTarefas.innerHTML = "";
        const tarefas = this.#obterTarefas().filter(tarefa => tarefa);

        tarefas.forEach((tarefa, index) => {
            const card = this.#criarCardTarefa(tarefa, index);
            this.#listaTarefas.appendChild(card);
        });
    }

    #criarCardTarefa(tarefa, index) {
        const card = document.createElement("div");
        card.className = "col-md-6";

        const cardContent = document.createElement("div");
        cardContent.className = "card shadow-sm";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = tarefa.materia;

        const text = document.createElement("p");
        text.className = "card-text";
        text.innerHTML = `
            <strong>ID:</strong> ${index + 1}<br>
            <strong>Tópico:</strong> ${tarefa.topico}<br>
            <strong>Data:</strong> ${tarefa.data}<br>
            <strong>Tempo:</strong> ${tarefa.tempo} min
        `;

        const buttonContainer = this.#criarBotoesCard(index, card);

        cardBody.appendChild(title);
        cardBody.appendChild(text);
        cardBody.appendChild(buttonContainer);
        cardContent.appendChild(cardBody);
        card.appendChild(cardContent);

        return card;
    }

    #criarBotoesCard(index, card) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "d-flex justify-content-end gap-2";

        const excluirBTN = document.createElement("button");
        excluirBTN.className = "btn btn-danger";
        excluirBTN.innerHTML = `<i class="bi bi-trash"></i> Excluir`;

        excluirBTN.addEventListener("click", () => {
            card.classList.add("fade-out");
            setTimeout(() => {
                this.excluirTarefa(index);
                this.mostrarTarefas();
            }, 400);
        });

        const editBTN = document.createElement("button");
        editBTN.className = "btn btn-sm btn btn-primary";
        editBTN.innerHTML = `<i class="bi bi-pencil"></i> Editar`;

        editBTN.addEventListener("click", () => {
            this.editarTarefa(index);
        });

        buttonContainer.appendChild(excluirBTN);
        buttonContainer.appendChild(editBTN);

        return buttonContainer;
    }

    static criar(materia = "", topico = "", data = "", tempo = "") {
        return new SistemaTarefas(materia, topico, data, tempo);
    }

    limparFormulario() {
        document.getElementById("materia").value = "";
        document.getElementById("topico").value = "";
        document.getElementById("data").value = "";
        document.getElementById("tempo").value = "";
    }
}

// Instância global do sistema
let sistemaTarefas;

window.onload = () => {
    sistemaTarefas = new SistemaTarefas();
    sistemaTarefas.mostrarTarefas();
};

function _adicionar() {
    const materia = document.getElementById("materia").value;
    const topico = document.getElementById("topico").value;
    const data = document.getElementById("data").value;
    const tempo = document.getElementById("tempo").value;

    const novaTarefa = new SistemaTarefas(materia, topico, data, tempo);
    novaTarefa.enviarTarefa();    
    novaTarefa.limparFormulario();
}
