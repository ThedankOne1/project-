document.addEventListener("DOMContentLoaded", () => {

    // Info panels (desktop only)
    if (window.innerWidth > 768) {
        const panels = document.querySelectorAll(".panel");
        panels.forEach(panel => {
            panel.addEventListener("click", () => {
                panels.forEach(p => p.classList.remove("active"));
                panel.classList.add("active");
            });
        });
    }

    // Confirmation countdown + confetti
    const countdown = document.getElementById("countdown");
    if (countdown) {
        let time = 60;
        confetti({ particleCount: 150, spread: 80 });

        setInterval(() => {
            time--;
            countdown.textContent = time;
            if (time <= 0) window.location.href = "/";
        }, 1000);
    }
});

// Use current location for address (UI hook only)
document.addEventListener("DOMContentLoaded", () => {
    const useLocationBtn = document.getElementById("useLocation");
    const addressField = document.getElementById("addressField");

    if (!useLocationBtn || !addressField) return;

    useLocationBtn.addEventListener("click", () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        useLocationBtn.textContent = "Getting location…";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lon = position.coords.longitude.toFixed(6);

                addressField.value =
                    `Latitude: ${lat}, Longitude: ${lon}\n(Exact address will be confirmed later)`;

                useLocationBtn.textContent = "Location added";
            },
            () => {
                alert("Unable to retrieve your location. Please enter address manually.");
                useLocationBtn.textContent = "Use my current location";
            }
        );
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("bgMusic");
    const toggle = document.getElementById("musicToggle");

    if (!audio || !toggle) return;

    audio.volume = 0.25;

    // Default state: music ON
    let isMuted = sessionStorage.getItem("bgMusicMuted") === "true";
    let savedTime = sessionStorage.getItem("bgMusicTime");

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    if (isMuted) {
        toggle.classList.add("muted");
    }

    // Try to play on first user interaction (Safari requirement)
    const tryAutoPlay = () => {
        if (!isMuted) {
            audio.play().catch(() => {});
        }
        document.removeEventListener("click", tryAutoPlay);
        document.removeEventListener("touchstart", tryAutoPlay);
    };

    document.addEventListener("click", tryAutoPlay);
    document.addEventListener("touchstart", tryAutoPlay);

    // Toggle mute/unmute
    toggle.addEventListener("click", (e) => {
        e.stopPropagation(); // don’t interfere with autoplay trigger

        if (audio.paused) {
            audio.play();
            toggle.classList.remove("muted");
            sessionStorage.setItem("bgMusicMuted", "false");
        } else {
            audio.pause();
            toggle.classList.add("muted");
            sessionStorage.setItem("bgMusicMuted", "true");
        }
    });

    // Save playback position
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("bgMusicTime", audio.currentTime);
    });
});
