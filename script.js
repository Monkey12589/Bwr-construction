// Create image elements for a gallery section and append them to the container.
function createImages(containerId, folder, count) {
  let container = document.getElementById(containerId);

  for (let i = 1; i <= count; i++) {
    let img = document.createElement("img");

    img.src = `https://bwr-construction.pl/imgs/photos/${folder}/${i}.webp`;
    img.alt = `${folder} ${i}`;
    img.loading = "lazy";
    img.classList.add("gallery-img");

    // Open the fullscreen overlay when the image is clicked.
    img.addEventListener("click", () => {
      openFullscreen(containerId, i - 1);
    });

    container.appendChild(img);
  }
}

// Current fullscreen image index and list of images.
let currentIndex = 0;
let currentImages = [];

// Open a fullscreen overlay for the clicked image gallery.
function openFullscreen(containerId, index) {
  let container = document.getElementById(containerId);
  currentImages = Array.from(container.querySelectorAll(".gallery-img"));
  currentIndex = index;

  // Create overlay structure.
  let overlay = document.createElement("div");
  overlay.className = "overlay";

  let img = document.createElement("img");
  img.className = "overlay-img";

  let counter = document.createElement("div");
  counter.className = "counter";

  overlay.appendChild(img);
  overlay.appendChild(counter);

  let prev = document.createElement("div");
  prev.className = "nav prev";
  prev.innerHTML = "&#10094;";

  let next = document.createElement("div");
  next.className = "nav next";
  next.innerHTML = "&#10095;";

  overlay.appendChild(prev);
  overlay.appendChild(next);

  // Display the current image and update the counter label.
  function showImage(i) {
    currentIndex = (i + currentImages.length) % currentImages.length;
    img.src = currentImages[currentIndex].src;
    counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
  }

  prev.onclick = (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  };

  next.onclick = (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  };

  // Keyboard navigation support for the overlay.
  function keyHandler(e) {
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
    if (e.key === "Escape") close();
  }

  document.addEventListener("keydown", keyHandler);

  // Swipe support for touch devices.
  let startX = 0;

  overlay.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  });

  overlay.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].screenX;
    let diff = endX - startX;

    if (diff > 100) showImage(currentIndex - 1);
    if (diff < -100) showImage(currentIndex + 1);
  });

  function close() {
    overlay.remove();
    document.removeEventListener("keydown", keyHandler);
    document.body.style.overflow = "auto";
  }

  overlay.addEventListener("click", close);

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  showImage(currentIndex);
}

// Show the selected gallery section and lazy-load images if needed.
function d(e) {
  document.getElementById("d").style.display = "block";

  let section = document.getElementById("d" + e);
  section.style.display = "grid";

  document.body.style.overflowY = "hidden";

  if (!section.dataset.loaded) {
    createImages("d" + e, e);
    section.dataset.loaded = "true";
  }
}

// Hide the gallery overlay and all gallery sections.
function back() {
  document.querySelector(".d").style.display = "none";

  document.querySelectorAll("#d1, #d2, #d3, #d4").forEach((e) => {
    e.style.display = "none";
  });

  document.body.style.overflowY = "auto";
}

// Copy text from an element to clipboard and animate the related button icon.
function copy(e) {
  let t = document.getElementById(e).textContent;

  navigator.clipboard.writeText(t).then(() => {
    let t = document.querySelectorAll("button");
    t.forEach((t) => {
      if (t.previousElementSibling && t.previousElementSibling.id === e) {
        let l = t.querySelector("img");
        l.style.filter = "grayscale(100%) brightness(100%)";
        setTimeout(() => {
          l.style.filter = "none";
        }, 1000);
      }
    });
  });
}

// On page load, fade out the loader, show the content, and create the gallery thumbnails.
window.addEventListener("load", () => {
  let e = document.getElementById("loader"),
    t = document.getElementById("content");

  e.style.opacity = "0";

  setTimeout(() => {
    e.style.display = "none";
    t.style.display = "block";
    createImages("d1", "remonty", 26);
    createImages("d2", "wykonczenia", 36);
    createImages("d3", "prace", 61);
    createImages("d4", "elewacje", 24);
  }, 500);
});

// Handle contact form submission with AJAX and display response.
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let t = new FormData(this);

  fetch("mail.php", {
    method: "POST",
    body: t,
  })
    .then((e) => e.text())
    .then((e) => {
      alert(e);
      if (e.includes("Wiadomość wysłana pomyślnie")) {
        document.getElementById("contactForm").reset();
      }
    })
    .catch((e) => {
      alert("Wystąpił błąd: " + e);
    });
});

// Toggle active state on elements with the .toggle class when clicked.
const images = document.querySelectorAll(".toggle");
images.forEach((e) => {
  e.addEventListener("click", () => {
    e.classList.toggle("active");
  });
});

// For mobile devices, set phone links to a direct telephone number.
if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  let e = document.querySelectorAll(".phone-link");
  e.forEach((e) => {
    e.setAttribute("href", "tel:+48790881113");
  });
}
