const criaMateria = (materia, topico, data, tempo) => {
    console.log("materia criada");
    console.log(materia, topico, data, tempo);

    return {
        listaTarefas: document.getElementById("listaTarefas"),

        modal: document.getElementById('modalEditar'),

        tarefas: {
            materia,
            topico,
            data,
            tempo
        },


        editTarefa(i) {
            const editaMateria = (JSON.parse(localStorage.getItem("novaTarefa")) || []);

            const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
            modal.show();

            
            const salvaBTN = document.getElementById("salvaBTN");
            salvaBTN.addEventListener("click", () => {
                console.log("Salvando edição")
                const novaMateria = document.getElementById("editarMateria").value;
                const novoTopico = document.getElementById("editarTopico").value;
                const novaData = document.getElementById("editarData").value;
                const novoTempo = document.getElementById("editarTempo").value;
                console.log(novaMateria, novoTopico, novaData, novoTempo)
                
                if (novaMateria?.trim()) {
                editaMateria[i].materia = novaMateria.trim();
                }

                if (novoTopico?.trim()) {
                editaMateria[i].topico = novoTopico.trim();
                }

                if (novaData) {
                editaMateria[i].data = novaData;
                }

                if (novoTempo) {
                editaMateria[i].tempo = novoTempo;
                }

                localStorage.setItem("novaTarefa", JSON.stringify(editaMateria))
                const camposVazios = !editaMateria.materia || !editaMateria.topico || !editaMateria.data || !editaMateria.tempo;
                if (!camposVazios) {modal.hide();}
                this.listaTarefas.innerHTML = "";
                this.mostraTarefa();

            })
        },


        excluirTarefa(i) {
            const tarefa = (JSON.parse(localStorage.getItem("novaTarefa")) || []).filter(u => u);
            tarefa.splice(i, 1);
            localStorage.setItem("novaTarefa", JSON.stringify(tarefa));
        },


        enviaTarefa() {
            try {
                console.log("tarefa enviada");
                const tarefasExistentes = (JSON.parse(localStorage.getItem("novaTarefa")) || []).filter(u => u);
                const novaTarefa = this.tarefas;

                const camposVazios = !novaTarefa.materia || !novaTarefa.topico || !novaTarefa.data || !novaTarefa.tempo;

                if (camposVazios) {
                    const campVazio = new bootstrap.Modal(document.getElementById("campVazioMsg"));
                    campVazio.show();
                    const campVazioBTN = document.getElementById("campVazioBTN");
                    campVazioBTN.addEventListener("click", () => {
                        window.location.reload();
                    })
                    return;
                }

                const existe = tarefasExistentes.some(u =>
                    u.topico === novaTarefa.topico &&
                    u.data === novaTarefa.data &&
                    u.tempo === novaTarefa.tempo
                );

                if (existe) {
                    const exiMateria = new bootstrap.Modal(document.getElementById("exiMateriaMsg"));
                    exiMateria.show();
                    const exiMateriaBTN = document.getElementById("exiMateriaBTN");
                    exiMateriaBTN.addEventListener("click", () => {
                        window.location.reload();
                    })
                    return;
                }

                tarefasExistentes.push(novaTarefa);
                localStorage.setItem("novaTarefa", JSON.stringify(tarefasExistentes));
                this.mostraTarefa();
                console.log(tarefasExistentes.tempo)

            } catch (error) {
                console.error("Erro ao enviar tarefa:", error);
            }
        },


        mostraTarefa() {
            console.log("mostrando tarefa");
            this.listaTarefas.innerHTML = "";

            const tarefas = (JSON.parse(localStorage.getItem("novaTarefa")) || []).filter(user => user);
            console.log(tarefas.tempo)

            tarefas.forEach((user, index) => {
                const card = document.createElement("div");
                card.className = "col-md-6";


                const cardContent = document.createElement("div");
                cardContent.className = "card shadow-sm";

                
                const cardBody = document.createElement("div");
                cardBody.className = "card-body";


                const title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = user.materia;


                const text = document.createElement("p");
                text.className = "card-text";
                text.innerHTML = `
                    <strong>ID:</strong> ${index + 1}<br>
                    <strong>Tópico:</strong> ${user.topico}<br>
                    <strong>Data:</strong> ${user.data}<br>
                    <strong>Tempo:</strong> ${user.tempo} min
                `;


                const buttonContainer = document.createElement("div");
                buttonContainer.className = "d-flex justify-content-end gap-2";


                const excluirBTN = document.createElement("button");
                excluirBTN.className = "btn btn-danger";
                excluirBTN.innerHTML = `<i class="bi bi-trash"></i> Excluir`;


                excluirBTN.addEventListener("click", () => {
                    card.classList.add("fade-out");

                
                    setTimeout(() => {
                        this.excluirTarefa(index);
                        this.listaTarefas.innerHTML = "";
                        this.mostraTarefa();
                    }, 400); // tempo da animação
                });


                const editBTN = document.createElement("button");
                editBTN.className = "btn btn-sm btn btn-primary";
                editBTN.innerHTML = `<i class="bi bi-pencil"></i> Editar`;


                editBTN.addEventListener("click", () => {
                    this.editTarefa(index);
                    this.listaTarefas.innerHTML = "";
                    this.mostraTarefa();

                });


                buttonContainer.appendChild(excluirBTN);
                buttonContainer.appendChild(editBTN);
                cardBody.appendChild(title);
                cardBody.appendChild(text);
                cardBody.appendChild(buttonContainer);
                cardContent.appendChild(cardBody);
                card.appendChild(cardContent);
                this.listaTarefas.appendChild(card);
            });
        },
    };
};


window.onload = () => {
    criaMateria("", "", "", "").mostraTarefa();
};


const adicionar = () => {
    const m = document.getElementById("materia").value;
    const t = document.getElementById("topico").value;
    const d = document.getElementById("data").value;
    const te = document.getElementById("tempo").value;


    const newMateria = criaMateria(m, t, d, te);
    newMateria.enviaTarefa();
};
