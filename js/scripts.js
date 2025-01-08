// Adding a 'click' event listener to the document
document.addEventListener("click", ({ target }) => {
  // Selecting the element with the class 'navbar-collapse' (collapsible menu)
  const navbarCollapse = document.querySelector(".navbar-collapse");

  // Getting the instance of the 'Collapse' class from Bootstrap library
  const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);

  // Checking if the collapsible menu is visible and the click happened outside of it
  if (navbarCollapse.classList.contains("show") && !navbarCollapse.contains(target)) {
    // If the menu is open and the click is outside of it, hide the menu
    bsCollapse.hide();
  }
});
