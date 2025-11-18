// start Dragula
const drake = dragula(Array.from(document.querySelectorAll(".tasks")), {
  revertOnSpill: true,
});

// Function to save local storage
function saveKanbanState() {
  const state = {};
  document.querySelectorAll(".tasks").forEach((column) => {
    state[column.id] = Array.from(column.querySelectorAll(".task")).map(
      (task) => task.outerHTML
    );
  });
  localStorage.setItem("kanbanState", JSON.stringify(state));
}

// load state
function loadKanbanState() {
  const savedState = localStorage.getItem("kanbanState");
  if (!savedState) return;

  const state = JSON.parse(savedState);

  // clean all columns
  document.querySelectorAll(".tasks").forEach((column) => {
    column.innerHTML = "";
  });

  // re-build tasks
  Object.keys(state).forEach((columnId) => {
    const column = document.getElementById(columnId);
    if (column) {
      state[columnId].forEach((taskHTML) => {
        column.insertAdjacentHTML("beforeend", taskHTML);
      });
    }
  });

  // re-enable drag
  document.querySelectorAll(".task").forEach((task) => {
    task.setAttribute("draggable", "true");
  });
}

// Dragula events

// animation effects
drake.on("drag", function (el, source) {
  // add column effect animate
  document.querySelectorAll(".task-column").forEach((column) => {
    column.classList.add("drop-ready");
  });
});

drake.on("dragend", function (el) {
  // remove the effect
  document.querySelectorAll(".task-column").forEach((column) => {
    column.classList.remove("drop-ready");
  });
});

// task fade animation
drake.on("drop", function (el, target, source, sibling) {
  el.classList.add("fade-in-bottom");

  // remove after animation ends
  setTimeout(() => {
    el.classList.remove("fade-in-bottom");
  }, 500);

  // save state
  saveKanbanState();
});

// load state at reload page
document.addEventListener("DOMContentLoaded", function () {
  loadKanbanState();
});
