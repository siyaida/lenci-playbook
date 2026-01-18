const languageButtons = document.querySelectorAll(".lang-toggle");
const pages = document.querySelectorAll(".page");

const setLanguage = (language) => {
  pages.forEach((page) => {
    page.hidden = page.dataset.language !== language;
  });

  languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.language === language);
  });

  document.documentElement.lang = language;
};

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.language);
  });
});

setLanguage("en");
