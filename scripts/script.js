const themeSwitchBtn = document.querySelector(".header__theme-switch-btn");
const themeBtnIcon = document.querySelector(".header__btn-icon");
const itemsLeft = document.querySelector(".app__items-left");
const todoInput = document.querySelector(".app__todo-input");
const todoForm = document.querySelector(".app__todo-form");
const todoList = document.querySelector(".app__todo-list");
const clearCompletedButtonElement = document.querySelector(
  ".app__clear-completed-btn",
);
const appFiltersElement = document.querySelector(".app__filters");

let filter = "all";

let todos = [
  { id: crypto.randomUUID(), text: "First todo", completed: false },
  {
    id: crypto.randomUUID(),
    text: "Second todo",
    completed: true,
    completedAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    text: "Third todo",
    completed: true,
    completedAt: Date.now(),
  },
  { id: crypto.randomUUID(), text: "Forth todo", completed: false },
];

const renderTodos = function () {
  // 1. Take the array of objects and map every object into an HTML string
  const todoHTMLArray = todos
    .slice()
    .sort((a, b) => {
      // If a and b are different
      if (a.completed !== b.completed) {
        return b.completed - a.completed;
      }
      // If both are uncompleted (false)
      if (!a.completed && !b.completed) {
        return 0;
      }
      // If both are completed
      return a.completedAt - b.completedAt;
    })
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .map((todo) => {
      return `
      <li class="app__todo ${todo.completed ? "todo-completed" : ""}" data-id="${todo.id}">
        <div class="todo__wrapper">
          <label class="todo__label">
            <input type="checkbox" class="todo__input" ${todo.completed ? "checked" : ""}/>
            <span class="todo__checkbox-custom">
              <img
                src="./images/icon-check.svg"
                alt=""
                class="todo__check-icon"
              />
            </span>
          </label>
          <span class="todo__task"
            >${todo.text}</span
          >
          <button
            class="todo__btn--remove"
            type="button"
            aria-label="Remove task"
          >
            <img
              class="todo__icon--cross"
              src="./images/icon-cross.svg"
              alt=""
            />
          </button>
        </div>
      </li>`;
    });
  // 2. Use .join("") to glue the HTML strings together into one single giant HTML string!
  todoList.innerHTML = todoHTMLArray.join("");

  // 3. Update the counter footer
  renderItemsLeft();
};

themeSwitchBtn.addEventListener("click", function () {
  // Toggle between light and dark
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const isLight = currentTheme === "light";

  document.documentElement.setAttribute(
    "data-theme",
    isLight ? "dark" : "light",
  );
});

// Add a new todo
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const inputText = todoInput.value.trim();
  if (!inputText) return;

  // 1. Create a new todo object
  const newTodoObj = {
    id: crypto.randomUUID(),
    text: inputText,
    completed: false,
  };

  // 2. Push a new object into the array
  todos.push(newTodoObj);

  // 3. Clear input
  todoInput.value = "";

  // 4. Trigger the render function to updtae the screen
  renderTodos();
});

// Remove a todo element
todoList.addEventListener("click", function (e) {
  const removeBtn = e.target.closest(".todo__btn--remove");
  if (!removeBtn) return;

  const todoItem = removeBtn.closest(".app__todo");
  removeItem(todoItem);
});

const removeItem = function (item) {
  // 1. Grab the unique ID from the DOM element's data-id attribute
  console.log(item);
  const todoId = item.dataset.id;

  item.classList.add("is-collapsing");
  // 2. Remove the item from the array using .filter()
  todos = todos.filter((todo) => todo.id !== todoId);
  renderItemsLeft();

  const handleTransitionEnd = (event) => {
    if (event.propertyName === "grid-template-rows") {
      item.removeEventListener("transitionend", handleTransitionEnd);

      // 3. Re-render the UI from the update state array
      item.remove();
    }
  };

  item.addEventListener("transitionend", handleTransitionEnd);
};

// Render current left-items counter
const renderItemsLeft = function () {
  const incompletedTodos = todos.filter((todo) => !todo.completed);
  const itemsCount = incompletedTodos.length;

  itemsLeft.textContent = `${itemsCount} ${itemsCount > 1 || itemsCount === 0 ? "items left" : "item left"}`;
};

// Mark a checkbox (complete todo)
todoList.addEventListener("change", function (e) {
  // const isChecked = e.target.checked;

  // Selecting an li element that has been changed
  const todoElement = e.target.closest(".app__todo");

  // Checking if it exists
  if (!todoElement) return;

  // Selecting an id of of a changed element
  const todoId = todoElement.dataset.id;

  const targetTodo = todos.find((t) => t.id === todoId);

  if (targetTodo) {
    const nextCompleted = !targetTodo.completed;

    // Create the updated version of the clicked todo
    const updatedTodo = {
      ...targetTodo,
      completed: nextCompleted,
      completedAt: nextCompleted ? Date.now() : null,
    };

    if (!nextCompleted) {
      // Unmarking: Remove it from its spot and append to the bottom
      const remainingTodos = todos.filter((t) => t.id !== todoId);
      todos = [...remainingTodos, updatedTodo];
    } else {
      // Marking: Standart ummutable update (letting .sort() handle where it goes)
      todos = todos.map((t) => (t.id === todoId ? updatedTodo : t));
    }

    todoElement.classList.toggle("todo-completed");

    const taskElement = todoElement.querySelector(".todo__task");

    if (
      (filter === "active" && nextCompleted) ||
      (filter === "completed" && !nextCompleted)
    ) {
      taskElement.addEventListener(
        "transitionend",
        (taskEvent) => {
          if (taskEvent.propertyName === "color") {
            todoElement.classList.add("is-collapsing");

            todoElement.addEventListener("transitionend", (event) => {
              if (event.propertyName === "grid-template-rows") {
                todoElement.remove();
              }
            });
          }
        },
        { once: true },
      );
    } else {
      taskElement.addEventListener(
        "transitionend",
        (event) => {
          if (event.propertyName === "color") {
            const todoElements = todoList.querySelectorAll(".app__todo");

            const initialElementsPositions = [];
            todoElements.forEach((el) => {
              initialElementsPositions.push(el.getBoundingClientRect());
            });

            if (!nextCompleted) {
              todoList.appendChild(todoElement);
            } else {
              const firstUncompletedTodo = todoList.querySelector(
                ".app__todo:not(.todo-completed)",
              );
              todoList.insertBefore(todoElement, firstUncompletedTodo);
            }

            const finalElementsPositions = [];
            todoElements.forEach((el) => {
              finalElementsPositions.push(el.getBoundingClientRect());
            });

            // Bystanders
            for (const [index, el] of todoElements.entries()) {
              const difference =
                initialElementsPositions[index].top -
                finalElementsPositions[index].top;

              el.style.transitionProperty = "transform";
              el.style.transitionDuration = "0s";
              el.style.transform = `translateY(${difference}px)`;

              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  el.style.transitionProperty = "";
                  el.style.transitionDuration = "";
                  el.style.transform = "translateY(0px)";
                });
              });
            }
          }
        },
        { once: true },
      );
    }

    renderItemsLeft();
  }
});

// Clear completed
clearCompletedButtonElement.addEventListener("click", function () {
  if (todos.some((todo) => todo.completed)) {
    const completedElements = [
      ...todoList.querySelectorAll(".app__todo.todo-completed"),
    ];

    if (completedElements.length === 0) {
      todos = todos.filter((todo) => !todo.completed);
      renderTodos();
      return;
    }

    completedElements.forEach((el) => {
      el.classList.add("is-collapsing");
    });

    const lastCompletedEl = completedElements[completedElements.length - 1];

    lastCompletedEl.addEventListener("transitionend", function handler(event) {
      if (event.propertyName === "grid-template-rows") {
        lastCompletedEl.removeEventListener("transitionend", handler);

        todos = todos.filter((todo) => !todo.completed);
        renderTodos();
      }
    });
  }
});

// Filter todo list
appFiltersElement.addEventListener("click", function (e) {
  const clickedElement = e.target.closest(".app__filter-btn");
  if (!clickedElement) return;
  if (filter === clickedElement?.dataset.filter) return;

  filter = clickedElement?.dataset.filter;

  const allFilterBtns = document.querySelectorAll(".app__filter-btn");

  for (const btn of allFilterBtns) {
    btn.classList.remove("active-filter");
  }
  clickedElement?.classList.add("active-filter");

  renderTodos();
});

renderTodos();