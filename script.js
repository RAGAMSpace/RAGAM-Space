// =========================
// P5 PARTY SETUP 🌍
// =========================
let shared;

function setup() {
  if (typeof partyConnect !== "undefined") {
    noCanvas();

    partyConnect(
      "wss://p5party.org",
      "ragam-space",
      "main-room"
    );

    shared = partyLoadShared("letters", {
      letters: []
    });
  }
}

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

    if (!shared) return;

    const to = document.getElementById("to").value;
    const message = document.getElementById("message").value;
    const authorInput = document.getElementById("author").value;
    const color = document.getElementById("color").value;

    if (!to || !message) return;

    const author = authorInput.trim() === "" ? "Anonymous" : authorInput;

    const letter = {
      id: Date.now(),
      to,
      message,
      author,
      color
    };

    shared.letters.push(letter);

    window.location.href = "index.html";
  });
}

// =========================
// DISPLAY LETTERS (HOME PAGE)
// =========================
const container = document.getElementById("lettersContainer");

function renderLetters() {
  if (!container || !shared) return;

  container.innerHTML = "";

  shared.letters.forEach((letter) => {
    const box = document.createElement("div");
    box.classList.add("letter-box");

    const color = letter.color || "blue";

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
// REAL-TIME SYNC
// =========================
function draw() {
  renderLetters();
}

// =========================
// VIEW LETTER (VIEW PAGE)
// =========================
const viewContainer = document.getElementById("letterView");

if (viewContainer) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  function renderView() {
    if (!shared) return;

    const letter = shared.letters.find(l => l.id == id);

    if (letter) {
      viewContainer.innerHTML = `
        <h1>Dear ${letter.to},</h1>
        <p>${letter.message}</p>
        <br>
        <p><em>— ${letter.author}</em></p>
      `;

      // DELETE BUTTON (ADMIN ONLY)
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
          shared.letters = shared.letters.filter(l => l.id != id);
          window.location.href = "index.html";
        });

        viewContainer.appendChild(deleteBtn);
      }

    } else {
      viewContainer.innerHTML = "<p>Letter not found.</p>";
    }
  }

  function draw() {
    renderView();
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
      colorCircles.forEach(c => c.classList.remove("selected"));

      circle.classList.add("selected");

      const chosenColor = circle.getAttribute("data-color");

      colorInput.value = chosenColor;
      preview.src = `images/${chosenColor}.png`;
    });
  });
});
