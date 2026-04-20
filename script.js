// =========================
// ADMIN MODE (persistent)
// =========================
let isAdmin = localStorage.getItem("isAdmin") === "true";

function enterAdminMode() {
  const password = prompt("Enter admin password:");

  if (password === "ragam123") {
    localStorage.setItem("isAdmin", "true");
    alert("Admin mode activated");
    location.reload();
  } else {
    alert("Wrong password");
  }
}

// =========================
// HOUSE IMAGE MAPPING 🏠
// =========================
const houseImages = {
  blue: "images/blue.png",
  pink: "images/pink.png",
  red: "images/red.png",
  green: "images/green.png",
  //yellow: "images/yellow.png"
};

// =========================
// REDIRECT FUNCTION
// =========================
function goToLetter() {
  window.location.href = "letter.html";
}

// =========================
// SAVE LETTER (LETTER PAGE)
// =========================
const form = document.getElementById("letterForm");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const to = document.getElementById("to").value;
    const message = document.getElementById("message").value;
    const authorInput = document.getElementById("author").value;
    const color = document.getElementById("color").value;

    const author = authorInput.trim() === "" ? "Anonymous" : authorInput;

    const letter = {
      id: Date.now(),
      to,
      message,
      author,
      color
    };

    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    letters.push(letter);

    localStorage.setItem("letters", JSON.stringify(letters));

    window.location.href = "index.html";
  });
}

// =========================
// DISPLAY LETTERS (HOME PAGE)
// =========================
const container = document.getElementById("lettersContainer");

if (container) {
  const letters = JSON.parse(localStorage.getItem("letters")) || [];

  letters.forEach((letter) => {
    const box = document.createElement("div");
    box.classList.add("letter-box");

    const color = letter.color || "blue";

    // 🏠 CREATE HOUSE IMAGE
    const img = document.createElement("img");
    img.src = houseImages[color];
    img.alt = "Letter House";
    img.classList.add("house-img");

    box.appendChild(img);

    box.addEventListener("click", () => {
      window.location.href = `view.html?id=${letter.id}`;
    });

    container.appendChild(box);
  });
}

// =========================
// VIEW LETTER (VIEW PAGE)
// =========================
const viewContainer = document.getElementById("letterView");

if (viewContainer) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let letters = JSON.parse(localStorage.getItem("letters")) || [];
  const letter = letters.find(l => l.id == id);

  if (letter) {
    viewContainer.innerHTML = `
      <h1>Dear ${letter.to},</h1>
      <p>${letter.message}</p>
      <br>
      <p><em>— ${letter.author}</em></p>
    `;

    // =========================
    // DELETE BUTTON (ONLY ADMIN)
    // =========================
    if (isAdmin) {
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete Letter";
      deleteBtn.style.marginTop = "20px";
      deleteBtn.style.padding = "10px";
      deleteBtn.style.background = "red";
      deleteBtn.style.color = "white";
      deleteBtn.style.border = "none";
      deleteBtn.style.cursor = "pointer";

      deleteBtn.addEventListener("click", () => {
        const confirmDelete = confirm("Are you sure you want to delete this letter?");
        
        if (confirmDelete) {
          const updatedLetters = letters.filter(l => l.id != id);
          localStorage.setItem("letters", JSON.stringify(updatedLetters));

          alert("Letter deleted");
          window.location.href = "index.html";
        }
      });

      viewContainer.appendChild(deleteBtn);
    }

  } else {
    viewContainer.innerHTML = "<p>Letter not found.</p>";
  }


}

// =========================
// COLOR PICKER INTERACTION
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const colorCircles = document.querySelectorAll(".color-circle");
  const preview = document.getElementById("housePreview");
  const colorInput = document.getElementById("color");

  colorCircles.forEach(circle => {
    circle.addEventListener("click", () => {
      // remove previous selection
      colorCircles.forEach(c => c.classList.remove("selected"));

      // select new
      circle.classList.add("selected");

      const chosenColor = circle.getAttribute("data-color");

      // update hidden input
      colorInput.value = chosenColor;

      // update preview image
      preview.src = `images/${chosenColor}.png`;
    });
  });
});