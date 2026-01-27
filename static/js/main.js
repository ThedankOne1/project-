console.log("JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // INFO PANELS
  // =========================
  const panels = document.querySelectorAll(".panel");

  panels.forEach(panel => {
    panel.addEventListener("click", () => {
      if (window.innerWidth <= 768) return;

      panels.forEach(p => p.classList.remove("active"));
      panel.classList.add("active");
    });
  });

  // =========================
  // CHATBOT
  // =========================
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatbotClose = document.getElementById("chatbot-close");

  if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener("click", () => {
      chatbotWindow.classList.toggle("hidden");
    });
  }

  if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener("click", () => {
      chatbotWindow.classList.add("hidden");
    });
  }

  // =========================
  // LOCATION FILL
  // =========================
  const useLocation = document.getElementById("useLocation");
  const addressField = document.getElementById("addressField");

  if (useLocation && addressField && navigator.geolocation) {
    useLocation.addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        addressField.value = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
      });
    });
  }

  // =========================
  // MUSIC TOGGLE
  // =========================
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.remove("muted");
      } else {
        bgMusic.pause();
        musicToggle.classList.add("muted");
      }
    });
  }

});
