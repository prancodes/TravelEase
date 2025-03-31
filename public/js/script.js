(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// JavaScript to add 'active' class based on the current URL
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  
  // Add null checks before accessing elements
  const exploreLink = document.getElementById("explore-link");
  const addLink = document.getElementById("add-link");
  // const userLink = document.getElementById("user-link");

  if (currentPath === "/listings" && exploreLink) {
    exploreLink.classList.add("active");
  } else if (currentPath === "/listings/add" && addLink) {
    addLink.classList.add("active");
  } 
  // else if (currentPath === "/user" && userLink) {
  //   signupLink.classList.add("active");
  // }

  // Add active class for category links
  const categoryLinks = document.querySelectorAll(".nav-link.nav-tabs");
  categoryLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("copyLink").addEventListener("click", function () {
    const url = "https://travelease.up.railway.app";

    navigator.clipboard
      .writeText(url)
      .then(() => {
        let flashContainer = document.querySelector(".flash-msg-box");
        flashContainer.innerHTML = "";

        const flashMessage = document.createElement("div");
        flashMessage.className =
          "alert alert-success alert-dismissible fade show flash-msg";
        flashMessage.setAttribute("role", "alert");
        flashMessage.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="currentColor" class="check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Success:">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          <strong>Link copied to clipboard!</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        flashContainer.appendChild(flashMessage);
      })
      .catch((err) => {
        flashContainer = document.createElement("div");
        flashContainer.className = "flash-msg-box";
        flashContainer.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show flash-msg" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <strong>Please try again!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;

        // Insert the new flash container immediately after the navbar-Tab element.
        const navbarTab = document.querySelector(".navbar-Tab");
        navbarTab.insertAdjacentElement("afterend", flashContainer);
        return;
      });
  });
});


// Password View toggle function
const togglePass = document.querySelector("#togglePassword");
const password = document.querySelector("#pass");

togglePass.addEventListener("click", () => {
  // Toggle type
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);

  // Toggle icon
  const icon = togglePass.querySelector("i");
  icon.classList.toggle('fa-eye-slash');
  icon.classList.toggle('fa-eye');
});
