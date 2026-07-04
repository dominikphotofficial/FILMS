document.addEventListener("DOMContentLoaded", () => {
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
            if (overlayMenu.classList.contains("active")) {
                toggleMenu();
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach(element => {
        observer.observe(element);
    });

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
});