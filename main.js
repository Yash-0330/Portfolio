/* Portfolio interactions — progressive enhancement, no runtime dependencies. */
document.documentElement.classList.add("js");

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("navbar");

function setMenu(open) {
    if (!menuToggle || !nav) return;
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    const icon = menuToggle.querySelector("i");
    if (icon) icon.className = open ? "bx bx-x" : "bx bx-menu";
}

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", event => {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) setMenu(false);
    });
}

const revealElements = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(element => element.classList.add("visible"));
} else {
    const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                instance.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -30px 0px", threshold: 0.08 });
    revealElements.forEach(element => observer.observe(element));
}

const pageSections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".navbar a"));
let scrollQueued = false;
function syncNavigation() {
    const position = window.scrollY + 160;
    let current = "home";
    for (const section of pageSections) {
        if (section.offsetTop <= position) current = section.id;
    }
    for (const link of navLinks) {
        const active = link.getAttribute("href") === "#" + current;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    }
    document.querySelector(".header")?.classList.toggle("scrolled", window.scrollY > 16);
    scrollQueued = false;
}
window.addEventListener("scroll", () => {
    if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(syncNavigation);
    }
}, { passive: true });
syncNavigation();

const emailButton = document.getElementById("copy-email");
const emailFeedback = document.getElementById("copy-feedback");
if (emailButton && emailFeedback) {
    emailButton.addEventListener("click", async () => {
        try {
            if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
            await navigator.clipboard.writeText("yashrakhunde5@gmail.com");
            emailFeedback.textContent = "Email address copied.";
            emailButton.innerHTML = '<i class="bx bx-check" aria-hidden="true"></i> Copied!';
        } catch (error) {
            emailFeedback.textContent = "Copy unavailable here. Use the email link below instead.";
        }
    });
}

const footer = document.querySelector("footer p");
if (footer) footer.textContent = "Designed & built by Yash Rakhunde · " + new Date().getFullYear();
