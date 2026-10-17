const themeSwitchBtn = document.querySelector(".header__theme-switch-btn");
const themeBtnIcon = document.querySelector(".header__btn-icon");
const itemsLeft = document.querySelector(".app__items-left");
const todoInput = document.querySelector(".app__todo-input");
const todoForm = document.querySelector(".app__todo-form");
const todoList = document.querySelector(".app__todo-list");

const moveCompletedTop = function () {
  const completedTodoElements = document.querySelectorAll(".todo-completed");

  for (const todo of completedTodoElements) {
    todoList.prepend(todo);
  }
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

  const inputText = todoInput.value;

  const newTodo = `<li class="app__todo">
                    <label class="todo__label">
                      <input type="checkbox" class="todo__input" />
                      <span class="todo__checkbox-custom">
                        <img
                          src="./images/icon-check.svg"
                          alt=""
                          class="todo__check-icon"
                        />
                      </span>
                    </label>
                    <span class="todo__task"
                      >${inputText}</span
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
                  </li>`;

  todoList.insertAdjacentHTML("beforeend", newTodo);
  todoInput.value = "";

  renderItemsLeft();
});

// Remove a todo element
todoList.addEventListener("click", function (e) {
  const removeBtn = e.target.closest(".todo__btn--remove");
  if (removeBtn) {
    const todoItem = removeBtn.closest("li");
    removeItem(todoItem);
  }
});

const removeItem = function (item) {
  item.classList.add("is-filtered-out");
  item.addEventListener("transitionend", function (e) {
    if (e.propertyName === "max-height") {
      item.remove();
      renderItemsLeft();
    }
  });
};

// Render current left-items counter
const renderItemsLeft = function () {
  const todoElements = document.querySelectorAll(".app__todo");
  let itemsCount = 0;
  for (let i = 0; i < todoElements.length; i++) {
    if (!todoElements[i].classList.contains("todo-completed")) {
      itemsCount++;
    }
  }
  itemsLeft.textContent = `${itemsCount} items left`;
};

renderItemsLeft();

// Toggle todo-completed
todoList.addEventListener("change", function (e) {
  const isChecked = e.target.checked;

  const labelElement = e.target.closest(".todo__label");
  const todoElement = labelElement.closest(".app__todo");

  if (labelElement) {
    todoElement.classList.toggle("todo-completed");

    if (isChecked) {
      moveCompletedTop();
    } else {
      todoList.append(todoElement);
    }

    applyFilter(filter);
    renderItemsLeft();
  }
});

// Clear completed
const clearCompletedButtonElement = document.querySelector(
  ".app__clear-completed-btn",
);

clearCompletedButtonElement.addEventListener("click", function () {
  const completedTodoElements = document.querySelectorAll(".todo-completed");
  if (completedTodoElements === 0) return;
  for (const todo of completedTodoElements) {
    todo.remove();
  }
});

moveCompletedTop();

let filter = "all";

const appFiltersElement = document.querySelector(".app__filters");

appFiltersElement.addEventListener("click", function (e) {
  const clickedElement = e.target.closest(".app__filter-btn");
  if (!clickedElement) return;
  filter = clickedElement?.dataset.filter;

  const allFilterBtns = document.querySelectorAll(".app__filter-btn");

  for (const btn of allFilterBtns) {
    btn.classList.remove("active-filter");
  }

  clickedElement?.classList.add("active-filter");

  applyFilter(filter);
});

const applyFilter = function (filterType) {
  // Make every todo visible
  const allTodoElements = document.querySelectorAll(".app__todo");
  for (const todo of allTodoElements) {
    todo.classList.remove("is-filtered-out");
  }

  switch (filterType) {
    case "all":
      break;
    case "active":
      const inActiveElements = document.querySelectorAll(".todo-completed");

      for (const todo of inActiveElements) {
        todo.classList.add("is-filtered-out");
      }

      break;
    case "completed":
      const activeElements = document.querySelectorAll(
        ".app__todo:not(.todo-completed)",
      );

      for (const todo of activeElements) {
        todo.classList.add("is-filtered-out");
      }

      break;
  }
};
