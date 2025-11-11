// Inicializa o Dragula
const drake = dragula(Array.from(document.querySelectorAll(".tasks")), {
  revertOnSpill: true,
});

// Função para salvar o estado no Local Storage
function saveKanbanState() {
  const state = {};
  document.querySelectorAll(".tasks").forEach((column) => {
    state[column.id] = Array.from(column.querySelectorAll(".task")).map(
      (task) => task.textContent
    );
  });
  localStorage.setItem("kanbanState", JSON.stringify(state));
}

// Função para carregar o estado do Local Storage
function loadKanbanState() {
  const savedState = localStorage.getItem("kanbanState");
  if (savedState) {
    const state = JSON.parse(savedState);

    // Limpa todas as colunas
    document.querySelectorAll(".tasks").forEach((column) => {
      column.innerHTML = "";
    });

    // Recria as tarefas nas colunas salvas
    Object.keys(state).forEach((columnId) => {
      const column = document.getElementById(columnId);
      if (column) {
        state[columnId].forEach((taskText) => {
          const task = document.createElement("li");
          task.className = "task";
          task.draggable = true;
          task.textContent = taskText;
          column.appendChild(task);
        });
      }
    });
  }
}

// Eventos do Dragula para animações
drake.on("drag", function (el, source) {
  // Adiciona classe de feedback às colunas quando o arrasto começa
  document.querySelectorAll(".task-column").forEach((column) => {
    column.classList.add("drop-ready");
  });
});

drake.on("dragend", function (el) {
  // Remove classe de feedback das colunas quando o arrasto termina
  document.querySelectorAll(".task-column").forEach((column) => {
    column.classList.remove("drop-ready");
  });
});

drake.on("drop", function (el, target, source, sibling) {
  // Animação de tremor no elemento solto
  el.classList.add("shake");

  // Remove a classe de animação após ela terminar
  setTimeout(() => {
    el.classList.remove("shake");
  }, 500);

  // Salva o estado
  saveKanbanState();
});

// Carrega o estado salvo quando a página é carregada
document.addEventListener("DOMContentLoaded", function () {
  loadKanbanState();
});
