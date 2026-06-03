document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    /* ==========================================================================
       MOBILE MENU NAV TOGGLE
       ========================================================================== */
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            
            // Toggle between Menu and Close icon
            const icon = navToggle.querySelector("i");
            if (icon) {
                if (navMenu.classList.contains("active")) {
                    icon.setAttribute("data-lucide", "x");
                } else {
                    icon.setAttribute("data-lucide", "menu");
                }
                lucide.createIcons();
            }
        });
    }

    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu) {
                navMenu.classList.remove("active");
                const icon = navToggle?.querySelector("i");
                if (icon) {
                    icon.setAttribute("data-lucide", "menu");
                    lucide.createIcons();
                }
            }
        });
    });

    /* ==========================================================================
       STICKY HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
    });

    /* ==========================================================================
       ACTIVE LINK ON SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    const sections = document.querySelectorAll("section[id]");
    
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Triggers when section occupies middle of screen
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    /* ==========================================================================
       PROJECT FILTER LOGIC
       ========================================================================== */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(button => button.classList.remove("active"));
            e.currentTarget.classList.add("active");

            const filterValue = e.currentTarget.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                
                // Add fade-out transition before hiding
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";
                
                setTimeout(() => {
                    if (filterValue === "all" || category === filterValue) {
                        card.classList.remove("hide");
                        // Trigger reflow to restart transition
                        void card.offsetWidth;
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    } else {
                        card.classList.add("hide");
                    }
                }, 200);
            });
        });
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitBtn = document.getElementById("form-submit-btn");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                showFormStatus("All fields are required!", "error");
                return;
            }

            // Simulate loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalContent = submitBtn.innerHTML;
                submitBtn.innerHTML = `<span>Sending...</span><i data-lucide="loader" class="icon-sm spin"></i>`;
                lucide.createIcons();
                
                // Add CSS spinner style dynamically
                const styleSheet = document.createElement("style");
                styleSheet.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`;
                document.head.appendChild(styleSheet);
                
                setTimeout(() => {
                    // Success Simulation
                    showFormStatus(`Thank you, ${name}! Your message has been sent. I will reply to ${email} shortly.`, "success");
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    lucide.createIcons();
                }, 1500);
            }
        });
    }

    function showFormStatus(text, type) {
        if (formStatus) {
            formStatus.textContent = text;
            formStatus.className = `form-status ${type}`;
            
            // Fade out warning/error status after 5s, keep success visible
            if (type === "error") {
                setTimeout(() => {
                    formStatus.textContent = "";
                    formStatus.className = "form-status";
                }, 5000);
            }
        }
    }
});
