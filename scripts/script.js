const themeSwitchBtn = document.querySelector(".header__theme-switch-btn");
const themeBtnIcon = document.querySelector(".header__btn-icon");

themeSwitchBtn.addEventListener("click", function () {
  // Toggle between light and dark
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const isLight = currentTheme === "light";

  document.documentElement.setAttribute(
    "data-theme",
    isLight ? "dark" : "light",
  );
});

const todoInput = document.querySelector(".app__todo-input");
const todoForm = document.querySelector(".app__todo-form");
const todoList = document.querySelector(".app__todo-list");

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
});

todoList.addEventListener("click", function (e) {
  const removeBtn = e.target.closest('.todo__btn--remove');
  if (removeBtn) {
    const todoItem = removeBtn.closest('li');
    todoItem.remove();
  }
});
