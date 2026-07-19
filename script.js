document.addEventListener("DOMContentLoaded", () => {
    // Hamburger Menu Logic
    const hamburger = document.querySelector(".hamburger");
    const overlayMenu = document.querySelector(".overlay-menu");
    const menuLinks = document.querySelectorAll(".menu-link");

    const toggleMenu = () => {
        hamburger.classList.toggle("active");
        overlayMenu.classList.toggle("active");
        document.body.style.overflow = overlayMenu.classList.contains("active") ? "hidden" : "";
    };

    hamburger.addEventListener("click", toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (overlayMenu.classList.contains("active")) toggleMenu();
        });
    });

    // Scroll Reveal Logic
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

    // Magnetic Effect Logic
    const magnetics = document.querySelectorAll(".magnetic");
    magnetics.forEach(magnetic => {
        magnetic.addEventListener("mousemove", (e) => {
            const position = magnetic.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            magnetic.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        magnetic.addEventListener("mouseleave", () => {
            magnetic.style.transform = "translate(0px, 0px)";
            magnetic.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        });

        magnetic.addEventListener("mouseenter", () => {
            magnetic.style.transition = "none";
        });
    });

    // Calculator Logic
    const calcDuration = document.getElementById("calc-duration");
    const calcComplexity = document.getElementById("calc-complexity");
    const calcTotal = document.getElementById("calc-total");

    const calculatePrice = () => {
        const duration = parseFloat(calcDuration.value) || 0;
        const complexity = parseFloat(calcComplexity.value) || 1;
        const basePricePerMinute = 10;
        let total = duration * basePricePerMinute * complexity;
        if (total < 20) total = 20;
        calcTotal.textContent = Math.round(total);
    };

    if (calcDuration && calcComplexity && calcTotal) {
        calcDuration.addEventListener("input", calculatePrice);
        calcComplexity.addEventListener("change", calculatePrice);
    }

    // Language Toggle Logic
    const langToggle = document.getElementById("lang-toggle");
    let currentLang = "lt";
    const translatableElements = document.querySelectorAll("[data-lt]");

    langToggle.addEventListener("click", () => {
        currentLang = currentLang === "lt" ? "en" : "lt";
        langToggle.textContent = currentLang === "lt" ? "EN" : "LT";
        
        translatableElements.forEach(el => {
            el.innerHTML = el.getAttribute(`data-${currentLang}`);
        });
    });
});