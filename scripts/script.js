const themeSwitchBtn = document.querySelector(".header__theme-switch-btn");
const themeBtnIcon = document.querySelector(".header__btn-icon");
const itemsLeft = document.querySelector(".app__items-left");
const todoInput = document.querySelector(".app__todo-input");
const todoForm = document.querySelector(".app__todo-form");
const todoList = document.querySelector(".app__todo-list");

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

// If filter is 'all', don't add is-collapsing to the todos
// Else if filter is 'active', add is-collapsing to the todos if completed is 'true'
// Else if filter is 'completed', add is-collapsing to the todos if completed is 'false'

const renderTodos = function () {
  // 1. Take the array of objects and map every object into an HTML string
  console.log(todos);
  const todoHTMLArray = todos
    .slice()
    .sort((a, b) => {
      if (a.completed !== b.completed) {
        return b.completed - a.completed;
      }
      if (!a.completed && !b.completed) {
        return 0;
      }
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

  const handleTransitionEnd = (event) => {
    if (event.propertyName === "grid-template-rows") {
      item.removeEventListener("transitionend", handleTransitionEnd);

      // 2. Remove the item from the array using .filter()
      todos = todos.filter((todo) => todo.id !== todoId);

      // 3. Re-render the UI from the update state array
      renderTodos();
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
  const todoElement = e.target.closest(".app__todo");

  if (!todoElement) return;

  const todoId = todoElement.dataset.id;

  todos = todos.map((todo) => {
    if (todo.id === todoId) {
      const nextCompleted = !todo.completed;
      return {
        ...todo,
        completed: nextCompleted,
        completedAt: nextCompleted ? Date.now() : null,
      };
    }
    return todo;
  });

  renderTodos();

  // if (filter === "all") {
  //   runFlipAnimation(e);
  // } else {
  //   if (todoElement) {
  //     const taskElement = todoElement.querySelector(".todo__task");

  //     todoElement.classList.toggle("todo-completed");
  //     renderItemsLeft();

  //     const handleTaskTransitionEnd = (event) => {
  //       if (event.propertyName === "color") {
  //         taskElement.removeEventListener(
  //           "transitionend",
  //           handleTaskTransitionEnd,
  //         );

  //         requestAnimationFrame(() => {
  //           todoElement.classList.add("is-collapsing");
  //         });

  //         const handleTransitionEnd = (event) => {
  //           if (event.propertyName === "grid-template-rows") {
  //             todoElement.removeEventListener(
  //               "transitionend",
  //               handleTransitionEnd,
  //             );
  //             if (isChecked) {
  //               todoList.prepend(todoElement);
  //             } else {
  //               todoList.append(todoElement);
  //             }
  //             applyFilter(filter);
  //           }
  //         };

  //         todoElement.addEventListener("transitionend", handleTransitionEnd);
  //       }
  //     };

  //     taskElement.addEventListener("transitionend", handleTaskTransitionEnd);
  //   }
  // }
});

const runFlipAnimation = function (e) {
  const isChecked = e.target.checked;
  const labelElement = e.target.closest(".todo__label");
  const todoElement = labelElement.closest(".app__todo");
  const taskElement = todoElement.querySelector(".todo__task");

  if (labelElement) {
    todoElement.classList.toggle("todo-completed");
    renderItemsLeft();

    const handleTaskTransitionEnd = (event) => {
      if (event.propertyName === "color") {
        taskElement.removeEventListener(
          "transitionend",
          handleTaskTransitionEnd,
        );

        const firstRectPosition = todoElement.getBoundingClientRect();
        const allTodoElements = document.querySelectorAll(".app__todo");
        const todosArray = [...allTodoElements];

        for (const [index, todo] of todosArray.entries()) {
          if (todo === todoElement) {
            todosArray.splice(index, 1);
          }
        }

        let firstPositionsArray = [];
        for (const todo of todosArray) {
          firstPositionsArray.push(todo.getBoundingClientRect());
        }

        // Move the item in the DOM now that it's marked
        if (isChecked) {
          todoList.prepend(todoElement);
        } else {
          todoList.append(todoElement);
        }

        applyFilter(filter);

        const lastRectPosition = todoElement.getBoundingClientRect();
        const firstLastDifference =
          firstRectPosition.top - lastRectPosition.top;

        // todoElement.style.transition = "none";
        todoElement.style.transitionProperty = "transform";
        todoElement.style.transitionDuration = "0s";
        todoElement.style.transform = `translateY(${firstLastDifference}px)`;

        requestAnimationFrame(() => {
          // todoElement.style.transition = "";
          todoElement.style.transitionProperty = "";
          todoElement.style.transitionDuration = "";
          todoElement.style.transform = `translateY(0px)`;
        });

        // Animate bystanders elements
        let lastPositionsArray = [];
        for (const todo of todosArray) {
          lastPositionsArray.push(todo.getBoundingClientRect());
        }

        for (const [index, todo] of todosArray.entries()) {
          const theDifference =
            firstPositionsArray[index].top - lastPositionsArray[index].top;
          todo.style.transitionProperty = "transform";
          todo.style.transitionDuration = "0s";
          todo.style.transform = `translateY(${theDifference}px)`;

          requestAnimationFrame(() => {
            todo.style.transitionProperty = "";
            todo.style.transitionDuration = "";
            todo.style.transform = `translateY(0px)`;
          });
        }
      }
    };

    taskElement.addEventListener("transitionend", handleTaskTransitionEnd);
  }
};

// const moveCompletedTop = function () {
//   const completedTodoElements = document.querySelectorAll(".todo-completed");

//   for (const todo of completedTodoElements) {
//     todoList.prepend(todo);
//   }
// };

// Clear completed
const clearCompletedButtonElement = document.querySelector(
  ".app__clear-completed-btn",
);

clearCompletedButtonElement.addEventListener("click", function () {
  // const completedTodoElements = document.querySelectorAll(".todo-completed");
  // if (completedTodoElements === 0) return;
  // for (const todo of completedTodoElements) {
  //   removeItem(todo);
  // }

  todos = todos.filter(todo => !todo.completed);
  renderTodos();
});

// moveCompletedTop();

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

  renderTodos();
});

const applyFilter = function (filterType) {
  // Make every todo visible
  const allTodoElements = document.querySelectorAll(".app__todo");

  for (const todo of allTodoElements) {
    todo.classList.remove("is-collapsing");
  }

  switch (filterType) {
    case "all":
      break;
    case "active":
      const inActiveElements = document.querySelectorAll(".todo-completed");

      for (const todo of inActiveElements) {
        todo.classList.add("is-collapsing");
      }

      break;
    case "completed":
      const activeElements = document.querySelectorAll(
        ".app__todo:not(.todo-completed)",
      );

      for (const todo of activeElements) {
        todo.classList.add("is-collapsing");
      }

      break;
  }
};

renderTodos();
