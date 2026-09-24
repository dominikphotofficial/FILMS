document.addEventListener("DOMContentLoaded", () => {
    // Mobile Hamburger Menu Logic
    const hamburger = document.querySelector(".hamburger");
    const overlayMenu = document.querySelector(".overlay-menu");
    const menuLinks = document.querySelectorAll(".menu-link");

    const toggleMenu = () => {
        if (!hamburger || !overlayMenu) return;
        hamburger.classList.toggle("active");
        overlayMenu.classList.toggle("active");
        document.body.style.overflow = overlayMenu.classList.contains("active") ? "hidden" : "";
    };

    if (hamburger) {
        hamburger.addEventListener("click", toggleMenu);
    }

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (overlayMenu && overlayMenu.classList.contains("active")) toggleMenu();
        });
    });

    // Scroll Reveal Logic with IntersectionObserver
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.12 };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

    // Magnetic Interactive Effect on Buttons and Key Elements
    const magnetics = document.querySelectorAll(".magnetic");
    magnetics.forEach(magnetic => {
        magnetic.addEventListener("mousemove", (e) => {
            const position = magnetic.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            magnetic.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
        });

        magnetic.addEventListener("mouseleave", () => {
            magnetic.style.transform = "translate(0px, 0px)";
            magnetic.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
        });

        magnetic.addEventListener("mouseenter", () => {
            magnetic.style.transition = "none";
        });
    });

    // Cinematic Rolling 24 FPS Timecode (Camera HUD)
    const timecodeEl = document.getElementById("timecode-display");
    let frames = 12;
    let seconds = 28;
    let minutes = 14;
    let hours = 0;

    const updateTimecode = () => {
        if (!timecodeEl) return;
        frames++;
        if (frames >= 24) {
            frames = 0;
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours = (hours + 1) % 24;
                }
            }
        }
        const pad = (n) => String(n).padStart(2, '0');
        timecodeEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
    };
    if (timecodeEl) {
        setInterval(updateTimecode, 1000 / 24); // 24 frames per second
    }

    // Live Kaunas Local Timecode (EET/EEST)
    const liveTimeEl = document.getElementById("live-time");
    const updateKaunasTime = () => {
        if (!liveTimeEl) return;
        try {
            const now = new Date();
            const timeString = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Europe/Vilnius",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }).format(now);
            liveTimeEl.textContent = timeString;
        } catch (e) {
            const now = new Date();
            liveTimeEl.textContent = now.toTimeString().split(' ')[0];
        }
    };
    updateKaunasTime();
    setInterval(updateKaunasTime, 1000);
});
