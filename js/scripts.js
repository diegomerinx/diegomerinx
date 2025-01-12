document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "dark";

  document.documentElement.classList.add("no-transition");

  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
    themeToggle.textContent = "🌞";
  }

  setTimeout(() => {
    document.documentElement.classList.remove("no-transition");
  }, 100);

  themeToggle.addEventListener("click", function () {
    document.documentElement.classList.remove("no-transition");

    themeToggle.classList.add("animate");

    setTimeout(() => {
      document.documentElement.classList.toggle("dark-mode");
      const theme = document.documentElement.classList.contains("dark-mode")
        ? "dark"
        : "light";
      localStorage.setItem("theme", theme);
      themeToggle.textContent = theme === "dark" ? "🌞" : "🌙";

      themeToggle.classList.remove("animate");
    }, 500);
  });

  const sections = document.querySelectorAll("*");

  const revealSection = () => {
    sections.forEach((section) => {
      if (!section.classList.contains("reveal")) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight) {
          section.classList.add("reveal");
        }
      }
    });
  };

  window.setInterval(() => {
    revealSection();
  }, 0);

  const projectCards = document.querySelectorAll(".project-card");

  let isMobile = window.innerWidth <= 767;
  let observer;

  const setupMobileObserver = () => {
    if (observer) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target;
          if (entry.isIntersecting) {
            card.visibilityTimer = setTimeout(() => {
              card.classList.add("mobile-show-video");
              const video = card.querySelector(".video-content");
              video.style.display = 'block';
              video.play();
              card.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 2500); // 5000ms = 5s
          } else {
            clearTimeout(card.visibilityTimer);
            const video = card.querySelector(".video-content");
            if (card.classList.contains("mobile-show-video")) {
              video.pause();
              video.currentTime = 0;
              video.style.display = 'none';
              card.classList.remove("mobile-show-video");
            }
          }
        });
      },
      { threshold: 1.0 }
    );

    projectCards.forEach((card) => observer.observe(card));
  };

  const setupDesktopHover = () => {
    projectCards.forEach((card) => {
      let hoverTimer;
      card.addEventListener("mouseenter", function () {
        hoverTimer = setTimeout(() => {
          card.classList.add("show-video");
          const video = card.querySelector(".video-content");
          video.style.display = 'block';
          video.play();
          card.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 1000);
      });

      card.addEventListener("mouseleave", function () {
        clearTimeout(hoverTimer);
        const video = card.querySelector(".video-content");
        if (card.classList.contains("show-video")) {
          video.pause();
          video.currentTime = 0;
          video.style.display = 'none';
          card.classList.remove("show-video");
        }
      });
    });
  };

  const setupClickRedirection = () => {
    projectCards.forEach((card) => {
      card.addEventListener("click", function () {
        const projectName = card.getAttribute("data-github");
        if (projectName) {
          window.open(`https://github.com/diegomerinx/${projectName}`, "_blank");
        }
      });
    });
  };

  const initialize = () => {
    if (isMobile) {
      setupMobileObserver();
    } else {
      setupDesktopHover();
    }
    setupClickRedirection();
  };

  initialize();

  window.addEventListener("resize", function () {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 767;

    if (wasMobile !== isMobile) {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      initialize();
    }
  });
});
