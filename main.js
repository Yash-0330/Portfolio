
/* ==========================================
   YASH RAKHUNDE — PORTFOLIO JAVASCRIPT

   Features:
   - Typed.js animation
   - Accessible mobile navigation
   - Scroll reveal animations
   - Active navigation highlighting
   - Optimized Three.js 3D animation
   - Mouse interaction
   - Responsive 3D canvas
   - Email copy functionality
   - Automatic footer year
========================================== */

(() => {
  "use strict";

  // Enables progressive-enhancement CSS.
  document.documentElement.classList.add("js");

  const $ = (selector) => document.querySelector(selector);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* ==========================================
     1. TYPED TEXT ANIMATION
  ========================================== */

  function initializeTypedText() {
    const element = $(".typed-text");

    if (!element) return;

    const phrases = [
      "Data Science.",
      "Machine Learning.",
      "Artificial Intelligence.",
      "Generative AI.",
      "Python & SQL."
    ];

    // Fallback when Typed.js is unavailable.
    element.textContent = phrases[0];

    if (
      typeof window.Typed !== "function" ||
      prefersReducedMotion.matches
    ) {
      return;
    }

    new window.Typed(".typed-text", {
      strings: phrases,
      typeSpeed: 65,
      backSpeed: 35,
      backDelay: 1500,
      startDelay: 300,
      smartBackspace: true,
      loop: true,
      showCursor: true,
      cursorChar: "|"
    });
  }

  /* ==========================================
     2. MOBILE NAVIGATION
  ========================================== */

  function initializeNavigation() {
    const menuToggle = $("#menu-toggle");
    const navbar = $("#navbar");

    if (!menuToggle || !navbar) return;

    function setMenu(open) {
      navbar.classList.toggle("open", open);

      menuToggle.setAttribute(
        "aria-expanded",
        String(open)
      );

      menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );

      const icon = menuToggle.querySelector("i");

      if (icon) {
        icon.className = open
          ? "bx bx-x"
          : "bx bx-menu";
      }
    }

    menuToggle.addEventListener("click", () => {
      setMenu(!navbar.classList.contains("open"));
    });

    navbar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenu(false);
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (
        !navbar.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setMenu(false);
      }
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 760) {
          setMenu(false);
        }
      },
      { passive: true }
    );
  }

  /* ==========================================
     3. SCROLL REVEAL ANIMATIONS
  ========================================== */

  function initializeScrollReveal() {
    const elements = document.querySelectorAll(".reveal");

    if (
      prefersReducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");

          currentObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -25px 0px",
        threshold: 0.08
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* ==========================================
     4. ACTIVE NAVIGATION ON SCROLL
  ========================================== */

  function initializeScrollNavigation() {
    const sections = [
      ...document.querySelectorAll("main section[id]")
    ];

    const links = [
      ...document.querySelectorAll(
        ".navbar a[href^='#']"
      )
    ];

    let framePending = false;

    function updateNavigation() {
      let currentSection = "home";

      const currentPosition = window.scrollY + 160;

      sections.forEach((section) => {
        if (section.offsetTop <= currentPosition) {
          currentSection = section.id;
        }
      });

      links.forEach((link) => {
        const isActive =
          link.getAttribute("href") ===
          `#${currentSection}`;

        link.classList.toggle("active", isActive);

        if (isActive) {
          link.setAttribute(
            "aria-current",
            "location"
          );
        } else {
          link.removeAttribute("aria-current");
        }
      });

      framePending = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (framePending) return;

        framePending = true;

        requestAnimationFrame(updateNavigation);
      },
      { passive: true }
    );

    updateNavigation();
  }

  /* ==========================================
     5. OPTIMIZED THREE.JS ANIMATION
  ========================================== */

  async function initializeThreeAnimation() {
    const container = $("#three-container");
    const visual = $(".hero-visual");

    if (!container || !visual) return;

    function showFallback() {
      visual.classList.add("fallback-visual");
    }

    // Respect accessibility and battery preferences.
    if (prefersReducedMotion.matches) {
      showFallback();
      return;
    }

    let renderer = null;
    let scene = null;

    const disposableResources = [];

    try {
      const THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
      );

      if (!container.isConnected) return;

      const width = Math.max(
        container.clientWidth,
        1
      );

      const height = Math.max(
        container.clientHeight,
        1
      );

      /* Scene */

      scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        100
      );

      camera.position.z = 7;

      /* Renderer */

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power"
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
      );

      renderer.setSize(width, height);

      renderer.setClearColor(0x000000, 0);

      renderer.domElement.setAttribute(
        "aria-hidden",
        "true"
      );

      container.appendChild(renderer.domElement);

      /* ======================================
         MAIN ICOSAHEDRON
      ====================================== */

      const mainGeometry =
        new THREE.IcosahedronGeometry(1.65, 2);

      const mainMaterial =
        new THREE.MeshBasicMaterial({
          color: 0x52e5ff,
          wireframe: true,
          transparent: true,
          opacity: 0.9
        });

      const mainObject = new THREE.Mesh(
        mainGeometry,
        mainMaterial
      );

      scene.add(mainObject);

      disposableResources.push(
        mainGeometry,
        mainMaterial
      );

      /* ======================================
         INNER ICOSAHEDRON
      ====================================== */

      const innerGeometry =
        new THREE.IcosahedronGeometry(1.15, 1);

      const innerMaterial =
        new THREE.MeshBasicMaterial({
          color: 0xa78bfa,
          wireframe: true,
          transparent: true,
          opacity: 0.75
        });

      const innerObject = new THREE.Mesh(
        innerGeometry,
        innerMaterial
      );

      scene.add(innerObject);

      disposableResources.push(
        innerGeometry,
        innerMaterial
      );

      /* ======================================
         ORBIT RINGS
      ====================================== */

      const ringGeometryOne =
        new THREE.TorusGeometry(
          2.15,
          0.012,
          8,
          96
        );

      const ringMaterialOne =
        new THREE.MeshBasicMaterial({
          color: 0x52e5ff,
          transparent: true,
          opacity: 0.55
        });

      const ringOne = new THREE.Mesh(
        ringGeometryOne,
        ringMaterialOne
      );

      ringOne.rotation.set(1.15, 0.3, 0);

      scene.add(ringOne);

      const ringGeometryTwo =
        new THREE.TorusGeometry(
          2.35,
          0.009,
          8,
          96
        );

      const ringMaterialTwo =
        new THREE.MeshBasicMaterial({
          color: 0xa78bfa,
          transparent: true,
          opacity: 0.45
        });

      const ringTwo = new THREE.Mesh(
        ringGeometryTwo,
        ringMaterialTwo
      );

      ringTwo.rotation.set(0.5, 1.1, 0);

      scene.add(ringTwo);

      disposableResources.push(
        ringGeometryOne,
        ringMaterialOne,
        ringGeometryTwo,
        ringMaterialTwo
      );

      /* ======================================
         FLOATING PARTICLES
      ====================================== */

      // Fewer particles for better performance.
      const particleCount = 160;

      const positions = new Float32Array(
        particleCount * 3
      );

      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;

        positions[index] =
          (Math.random() - 0.5) * 9;

        positions[index + 1] =
          (Math.random() - 0.5) * 9;

        positions[index + 2] =
          (Math.random() - 0.5) * 5;
      }

      const particleGeometry =
        new THREE.BufferGeometry();

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          positions,
          3
        )
      );

      const particleMaterial =
        new THREE.PointsMaterial({
          color: 0x52e5ff,
          size: 0.025,
          transparent: true,
          opacity: 0.7,
          sizeAttenuation: true
        });

      const particles = new THREE.Points(
        particleGeometry,
        particleMaterial
      );

      scene.add(particles);

      disposableResources.push(
        particleGeometry,
        particleMaterial
      );

      /* ======================================
         INTERACTIVE MOUSE MOVEMENT
      ====================================== */

      let targetRotationX = 0;
      let targetRotationY = 0;

      let mouseRotationX = 0;
      let mouseRotationY = 0;

      container.addEventListener(
        "pointermove",
        (event) => {
          if (event.pointerType === "touch") {
            return;
          }

          const rect =
            container.getBoundingClientRect();

          if (!rect.width || !rect.height) return;

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          targetRotationY = (x - 0.5) * 0.5;
          targetRotationX = (y - 0.5) * 0.5;
        },
        { passive: true }
      );

      container.addEventListener(
        "pointerleave",
        () => {
          targetRotationX = 0;
          targetRotationY = 0;
        }
      );

      /* ======================================
         ANIMATION CONTROLS
      ====================================== */

      let isVisible = false;
      let isDisposed = false;

      let animationFrame = null;
      let lastFrameTime = 0;
      let elapsedTime = 0;

      // Target approximately 30 FPS.
      const frameInterval = 1000 / 30;

      function shouldAnimate() {
        return (
          !isDisposed &&
          isVisible &&
          !document.hidden &&
          !prefersReducedMotion.matches
        );
      }

      function stopAnimation() {
        if (animationFrame !== null) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }

        lastFrameTime = 0;
      }

      function animate(time) {
        animationFrame = null;

        if (!shouldAnimate()) {
          return;
        }

        if (
          lastFrameTime === 0 ||
          time - lastFrameTime >= frameInterval
        ) {
          const delta = lastFrameTime
            ? Math.min(
                (time - lastFrameTime) / 1000,
                0.05
              )
            : 0;

          lastFrameTime = time;
          elapsedTime += delta;

          // Smooth automatic rotation.
          mainObject.rotation.x =
            elapsedTime * 0.12 + mouseRotationX;

          mainObject.rotation.y =
            elapsedTime * 0.18 + mouseRotationY;

          innerObject.rotation.x =
            -elapsedTime * 0.15;

          innerObject.rotation.y =
            -elapsedTime * 0.12;

          ringOne.rotation.z =
            elapsedTime * 0.09;

          ringTwo.rotation.z =
            -elapsedTime * 0.06;

          particles.rotation.y =
            elapsedTime * 0.025;

          // Smooth mouse interpolation.
          mouseRotationX +=
            (targetRotationX - mouseRotationX) * 0.06;

          mouseRotationY +=
            (targetRotationY - mouseRotationY) * 0.06;

          renderer.render(scene, camera);
        }

        animationFrame =
          requestAnimationFrame(animate);
      }

      function startAnimation() {
        if (
          animationFrame !== null ||
          !shouldAnimate()
        ) {
          return;
        }

        lastFrameTime = 0;

        animationFrame =
          requestAnimationFrame(animate);
      }

      /* ======================================
         PAUSE WHEN OFF-SCREEN
      ====================================== */

      let visibilityObserver = null;

      if ("IntersectionObserver" in window) {
        visibilityObserver =
          new IntersectionObserver(
            (entries) => {
              isVisible =
                entries[0]?.isIntersecting ??
                false;

              if (isVisible) {
                startAnimation();
              } else {
                stopAnimation();
              }
            },
            {
              threshold: 0.05
            }
          );

        visibilityObserver.observe(container);
      } else {
        isVisible = true;
        startAnimation();
      }

      /* ======================================
         RESPONSIVE RESIZING
      ====================================== */

      let resizeObserver = null;

      function resizeCanvas() {
        if (isDisposed) return;

        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        if (!newWidth || !newHeight) return;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
      }

      if ("ResizeObserver" in window) {
        resizeObserver =
          new ResizeObserver(resizeCanvas);

        resizeObserver.observe(container);
      } else {
        window.addEventListener(
          "resize",
          resizeCanvas,
          { passive: true }
        );
      }

      /* ======================================
         BROWSER TAB VISIBILITY
      ====================================== */

      function handleVisibilityChange() {
        if (document.hidden) {
          stopAnimation();
        } else {
          startAnimation();
        }
      }

      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      function handleMotionChange() {
        if (prefersReducedMotion.matches) {
          stopAnimation();
        } else {
          startAnimation();
        }
      }

      if (prefersReducedMotion.addEventListener) {
        prefersReducedMotion.addEventListener(
          "change",
          handleMotionChange
        );
      }

      /* ======================================
         RELEASE GPU RESOURCES
      ====================================== */

      function cleanup() {
        if (isDisposed) return;

        isDisposed = true;

        stopAnimation();

        visibilityObserver?.disconnect();
        resizeObserver?.disconnect();

        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );

        disposableResources.forEach(
          (resource) => resource.dispose()
        );

        renderer.dispose();
      }

      window.addEventListener(
        "pagehide",
        cleanup,
        { once: true }
      );

    } catch (error) {
      console.warn(
        "3D animation unavailable:",
        error
      );

      if (renderer) {
        renderer.dispose();
        renderer.domElement?.remove();
      }

      showFallback();
    }
  }

  /* ==========================================
     6. COPY EMAIL
  ========================================== */

  function initializeEmailCopy() {
    const button = $("#copy-email");
    const feedback = $("#copy-feedback");

    if (!button) return;

    const email = "yashrakhunde5@gmail.com";

    button.addEventListener(
      "click",
      async () => {
        try {
          if (!navigator.clipboard?.writeText) {
            throw new Error("Clipboard unavailable");
          }

          await navigator.clipboard.writeText(email);

          if (feedback) {
            feedback.textContent =
              "Email address copied successfully!";
          }

          button.innerHTML = `
            <i class="bx bx-check"></i>
            Copied!
          `;

        } catch (error) {
          if (feedback) {
            feedback.textContent =
              "Unable to copy automatically. Please use the email link.";
          }
        }
      }
    );
  }

  /* ==========================================
     7. AUTOMATIC FOOTER YEAR
  ========================================== */

  function initializeFooter() {
    const footer = document.querySelector(
      "footer p"
    );

    if (!footer) return;

    footer.textContent =
      `Designed & Built by Yash Rakhunde · ${new Date().getFullYear()}`;
  }

  /* ==========================================
     8. INITIALIZE WEBSITE
  ========================================== */

  function initializePortfolio() {
    initializeTypedText();
    initializeNavigation();
    initializeScrollReveal();
    initializeScrollNavigation();
    initializeEmailCopy();
    initializeFooter();

    // Load the Three.js visual after essential UI is ready.
    initializeThreeAnimation();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializePortfolio,
      { once: true }
    );
  } else {
    initializePortfolio();
  }

})();
