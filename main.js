/* =========================================
   YASH D RAKHUNDE - PORTFOLIO JAVASCRIPT
========================================= */


/* =========================================
   1. TYPED TEXT ANIMATION
========================================= */

if (window.Typed && document.querySelector(".typed-text")) {
    new Typed(".typed-text", {
        strings: [
            "Data Science.",
            "Machine Learning.",
            "Artificial Intelligence.",
            "Generative AI.",
            "Python & SQL."
        ],
        typeSpeed: 65,
        backSpeed: 35,
        backDelay: 1400,
        loop: true,
        smartBackspace: true
    });
} else {
    const typedElement = document.querySelector(".typed-text");

    if (typedElement) {
        typedElement.textContent = "Data Science.";
    }
}


/* =========================================
   2. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        menuToggle.innerHTML = isOpen
            ? '<i class="bx bx-x"></i>'
            : '<i class="bx bx-menu"></i>';
    });

    navbar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navbar.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
            menuToggle.innerHTML = '<i class="bx bx-menu"></i>';
        });
    });
}


/* =========================================
   3. SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}


/* =========================================
   4. ACTIVE NAVIGATION ON SCROLL
========================================= */

const pageSections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".navbar a");

function updateActiveNavigation() {
    let currentSection = "home";

    pageSections.forEach(section => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });
}

window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
});

updateActiveNavigation();


/* =========================================
   5. THREE.JS ANIMATED 3D VISUAL
========================================= */

async function createThreeAnimation() {
    const container = document.getElementById("three-container");
    const visual = document.querySelector(".hero-visual");

    if (!container || !visual) return;

    try {
        const THREE = await import(
            "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
        );

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        );

        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

        renderer.setClearColor(0x000000, 0);

        container.appendChild(renderer.domElement);


        // Main glowing geometry
        const geometry = new THREE.IcosahedronGeometry(1.65, 2);

        const material = new THREE.MeshStandardMaterial({
            color: 0x52e5ff,
            metalness: 0.65,
            roughness: 0.25,
            wireframe: true
        });

        const mainObject = new THREE.Mesh(geometry, material);
        scene.add(mainObject);


        // Inner object
        const innerGeometry = new THREE.IcosahedronGeometry(1.15, 1);

        const innerMaterial = new THREE.MeshStandardMaterial({
            color: 0xa78bfa,
            metalness: 0.8,
            roughness: 0.3,
            wireframe: true
        });

        const innerObject = new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );

        scene.add(innerObject);


        // Orbit rings
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x52e5ff,
            transparent: true,
            opacity: 0.55
        });

        const ringOne = new THREE.Mesh(
            new THREE.TorusGeometry(2.15, 0.012, 12, 120),
            ringMaterial
        );

        ringOne.rotation.x = 1.15;
        ringOne.rotation.y = 0.3;
        scene.add(ringOne);

        const ringTwo = new THREE.Mesh(
            new THREE.TorusGeometry(2.35, 0.009, 12, 120),
            new THREE.MeshBasicMaterial({
                color: 0xa78bfa,
                transparent: true,
                opacity: 0.45
            })
        );

        ringTwo.rotation.x = 0.5;
        ringTwo.rotation.y = 1.1;
        scene.add(ringTwo);


        // Lighting
        const ambientLight = new THREE.AmbientLight(
            0xffffff,
            1.2
        );

        scene.add(ambientLight);

        const cyanLight = new THREE.PointLight(
            0x52e5ff,
            35,
            15
        );

        cyanLight.position.set(3, 3, 4);
        scene.add(cyanLight);

        const purpleLight = new THREE.PointLight(
            0xa78bfa,
            30,
            15
        );

        purpleLight.position.set(-3, -2, 3);
        scene.add(purpleLight);


        // Floating particles
        const particleCount = 350;
        const particlePositions = new Float32Array(
            particleCount * 3
        );

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;

            particlePositions[index] = (Math.random() - 0.5) * 9;
            particlePositions[index + 1] = (Math.random() - 0.5) * 9;
            particlePositions[index + 2] = (Math.random() - 0.5) * 5;
        }

        const particleGeometry = new THREE.BufferGeometry();

        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(particlePositions, 3)
        );

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x52e5ff,
            size: 0.025,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(
            particleGeometry,
            particleMaterial
        );

        scene.add(particles);


        // Mouse interaction
        let targetRotationX = 0;
        let targetRotationY = 0;

        container.addEventListener("pointermove", event => {
            const rect = container.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            targetRotationY = (x - 0.5) * 0.7;
            targetRotationX = (y - 0.5) * 0.7;
        });


        // Animation loop control with IntersectionObserver
        let animationFrame;
        let isVisible = true;

        const visibilityObserver = new IntersectionObserver(entries => {
            isVisible = entries[0].isIntersecting;

            if (isVisible) {
                animate();
            } else {
                cancelAnimationFrame(animationFrame);
            }
        });

        visibilityObserver.observe(container);

        function animate() {
            if (!isVisible) return;

            animationFrame = requestAnimationFrame(animate);

            mainObject.rotation.x += 0.002;
            mainObject.rotation.y += 0.003;

            innerObject.rotation.x -= 0.003;
            innerObject.rotation.y -= 0.002;

            ringOne.rotation.z += 0.0015;
            ringTwo.rotation.z -= 0.001;

            particles.rotation.y += 0.0004;

            mainObject.rotation.x +=
                (targetRotationX - mainObject.rotation.x) * 0.015;

            mainObject.rotation.y +=
                (targetRotationY - mainObject.rotation.y) * 0.015;

            renderer.render(scene, camera);
        }

        animate();


        // Responsive container resizing
        const resizeObserver = new ResizeObserver(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;

            if (!width || !height) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        });

        resizeObserver.observe(container);


        // Pause performance when browser tab is hidden
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrame);
            } else if (isVisible) {
                animate();
            }
        });

    } catch (error) {
        console.warn(
            "Three.js could not load. Showing CSS fallback visual.",
            error
        );

        visual.classList.add("fallback-visual");
    }
}

window.copyEmail = async function () {
    try {
        await navigator.clipboard.writeText("yashrakhunde5@gmail.com");

        const feedback = document.getElementById("copy-feedback");

        if (feedback) {
            feedback.textContent = "Email copied!";
            feedback.style.opacity = "1";

            setTimeout(() => {
                feedback.style.opacity = "0";
            }, 2500);
        }
    } catch (error) {
        console.error("Failed to copy email:", error);
    }
};


/* =========================================
   6. START 3D ANIMATION
========================================= */

createThreeAnimation();


/* =========================================
   7. CURRENT YEAR IN FOOTER
========================================= */

const footerText = document.querySelector(".footer p") || document.querySelector("footer p");

if (footerText) {
    footerText.textContent =
        `Designed & built by Yash Dnyaneshwar Rakhunde · ${new Date().getFullYear()}`;
}

