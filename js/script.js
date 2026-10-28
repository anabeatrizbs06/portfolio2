
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
    );
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
    });
});

function updateTheme(isLight) {
    document.body.classList.toggle("light-theme", isLight);

    themeToggle.textContent = isLight ? "☾" : "☼";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Ativar tema escuro" : "Ativar tema claro"
    );

    document.querySelector('meta[name="theme-color"]')
        .setAttribute("content", isLight ? "#f6f0ff" : "#0b0910");
}

themeToggle.addEventListener("click", () => {
    const isLight = !document.body.classList.contains("light-theme");
    updateTheme(isLight);
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    const name = document.querySelector("#contact-name").value.trim();
    const email = document.querySelector("#contact-email").value.trim();
    const message = document.querySelector("#contact-message").value.trim();

    if (!name || !email || !message) {
        formStatus.textContent = "Preencha todos os campos.";
        return;
    }

    const recipient = document.querySelector("[data-email-link]")
        .getAttribute("href")
        .replace(/^mailto:/i, "");

    if (
        !recipient ||
        recipient.includes("SEUEMAIL") ||
        recipient.includes("exemplo.com")
    ) {
        formStatus.textContent =
            "O formulário está validado! Configure seu e-mail no HTML para preparar o envio.";
        return;
    }

    const subject = encodeURIComponent(`Mensagem do portfólio — ${name}`);
    const body = encodeURIComponent(
        `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`
    );

    formStatus.textContent = "Abrindo seu aplicativo de e-mail...";

    window.location.href =
        `mailto:${recipient}?subject=${subject}&body=${body}`;
});
