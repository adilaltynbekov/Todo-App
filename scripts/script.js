const themeSwitchBtn = document.querySelector(".header__theme-switch-btn");
const themeBtnIcon = document.querySelector(".header__btn-icon");

const todoInput = document.querySelector(".app__todo-input");

themeSwitchBtn.addEventListener("click", function () {
  // Toggle between light and dark
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const isLight = currentTheme === "light";

  document.documentElement.setAttribute(
    "data-theme",
    isLight ? "dark" : "light",
  );
});
