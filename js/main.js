/**
 * ===================================================================
 * ACADEMIC & MINIMALIST CLIENT CONTROLLER
 * ===================================================================
 * Dynamically populates data.js for Priyanshu Paliwal
 * Indian Institute of Technology (IIT) Kharagpur
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.profileData;
  if (!data) {
    console.error("Profile data not found. Ensure data.js is loaded first.");
    return;
  }

  // 1. Populate Header & Hero
  renderHero(data.personal);

  // 2. Populate Education, Schooling & Coursework
  renderEducation(data.education);

  // 3. Populate Projects (Academic & Research Project Listing with CV Bullets)
  renderProjects(data.projects);

  // 4. Populate Competitions & Awards
  renderAwards(data.education.honors);

  // 5. Populate Experience & Leadership (CV Format)
  renderExperienceAndLeadership(data.experience, data.leadership);

  // 6. Populate Skills Matrix
  renderSkills(data.skills);

  // 7. Setup Contact & Utilities
  setupContact(data.personal);

  // 8. Initialize Terminal if present
  if (window.EngineeringTerminal) {
    new EngineeringTerminal("terminal-body", "terminal-input", data);
  }

  // 9. Setup Case Study Modal
  setupProjectModal(data.projects);

  // 10. Setup ScrollSpy for Floating Sticky Navbar
  setupScrollspy();
});

/* --------------------------------------------------------------------------
   Header & Hero Section
   -------------------------------------------------------------------------- */
function renderHero(personal) {
  // Name
  const nameEl = document.getElementById("person-name");
  if (nameEl) nameEl.textContent = personal.name;

  // Header Sublinks
  const emailEl = document.getElementById("header-email");
  if (emailEl) emailEl.textContent = `${personal.email.replace("@", " [at] ")}`;

  const emailLink = document.getElementById("header-email-link");
  if (emailLink) emailLink.href = `mailto:${personal.email}`;

  const githubLink = document.getElementById("header-github-link");
  if (githubLink) {
    githubLink.href = personal.github || "https://github.com/p-priyanshu04";
    githubLink.title = "GitHub: p-priyanshu04";
  }

  const linkedinLink = document.getElementById("header-linkedin-link");
  if (linkedinLink) {
    linkedinLink.href = personal.linkedin;
    linkedinLink.title = "LinkedIn: Priyanshu Paliwal";
  }

  const cfLink = document.getElementById("header-cf-link");
  if (cfLink) {
    cfLink.href = personal.codeforces;
    cfLink.title = `Codeforces: ${personal.handles && personal.handles.codeforces ? personal.handles.codeforces : 'CapLevi04 (Expert)'}`;
  }

  const ccLink = document.getElementById("header-cc-link");
  if (ccLink) {
    ccLink.href = personal.codechef;
    ccLink.title = `CodeChef: ${personal.handles && personal.handles.codechef ? personal.handles.codechef : 'cap_levi04 (3★)'}`;
  }

  const atcoderLink = document.getElementById("header-atcoder-link");
  if (atcoderLink) {
    atcoderLink.href = personal.atcoder;
    atcoderLink.title = `AtCoder: ${personal.handles && personal.handles.atcoder ? personal.handles.atcoder : 'CapLevi04 (4 Kyu)'}`;
  }

  // Status Line
  const statusEl = document.getElementById("hero-status-line");
  if (statusEl) statusEl.textContent = personal.status;

  // Featured Focus in Hero
  const paperTitle = document.getElementById("hero-featured-title");
  if (paperTitle && personal.specializations) {
    paperTitle.textContent = personal.specializations.join(" • ");
  }

  // Bio Paragraphs
  const bioContainer = document.getElementById("hero-bio-container");
  if (bioContainer && personal.bio) {
    bioContainer.innerHTML = personal.bio.map(p => `<p class="bio-paragraph">${p}</p>`).join("");
  }

  // News & Updates Feed
  const newsList = document.getElementById("hero-news-list");
  if (newsList && personal.news && personal.news.length > 0) {
    newsList.innerHTML = personal.news.map(item => `
      <li class="news-item">
        <span class="news-date">${item.date}</span>
        <span class="news-text">${item.text}</span>
      </li>
    `).join("");
  }
}

/* --------------------------------------------------------------------------
   Education & Academic Highlights
   -------------------------------------------------------------------------- */
function renderEducation(education) {
  // Degree Block
  const degreeEl = document.getElementById("edu-degree-title");
  if (degreeEl) degreeEl.textContent = education.degree;

  const instEl = document.getElementById("edu-institution");
  if (instEl) instEl.textContent = `${education.university} • ${education.duration}`;

  const gpaEl = document.getElementById("edu-gpa-line");
  if (gpaEl) gpaEl.textContent = `Cumulative CGPA: ${education.gpa}`;

  // Schooling Table/List
  const schoolingContainer = document.getElementById("edu-schooling-list");
  if (schoolingContainer && education.schooling) {
    schoolingContainer.innerHTML = education.schooling.map(s => `
      <li class="academic-list-item">
        <span class="item-title-bold">${s.level}</span>: 
        <span>${s.institute}</span> — 
        <span style="color:var(--color-primary-blue); font-weight:700; font-family:var(--font-mono);">${s.score}</span> 
        <span class="item-muted">(${s.year})</span>
      </li>
    `).join("");
  }

  // Coursework Theory & Labs
  const theoryContainer = document.getElementById("coursework-theory-container");
  const labContainer = document.getElementById("coursework-lab-container");

  if (theoryContainer && education.coursework) {
    const theoryCourses = education.coursework.filter(c => c.type === "theory");
    theoryContainer.innerHTML = theoryCourses.map(c => `
      <span class="clean-course-tag">
        <span class="code">${c.code}</span>
        <span>${c.name}</span>
      </span>
    `).join("");
  }

  if (labContainer && education.coursework) {
    const labCourses = education.coursework.filter(c => c.type === "lab");
    labContainer.innerHTML = labCourses.map(c => `
      <span class="clean-course-tag">
        <span class="code">${c.code}</span>
        <span>${c.name}</span>
      </span>
    `).join("");
  }
}

/* --------------------------------------------------------------------------
   Projects Section (Clean Research / Engineering Listing)
   -------------------------------------------------------------------------- */
function renderProjects(projects) {
  const container = document.getElementById("projects-list-container");
  if (!container) return;

  container.innerHTML = projects.map(p => `
    <article class="project-entry">
      <div>
        <img src="${p.image}" alt="${p.title}" class="project-image-clean" loading="lazy" onerror="this.src='${p.fallbackImage || 'assets/images/rover.png'}'">
      </div>
      <div class="project-details">
        <div>
          <a href="${p.links.github}" target="_blank" rel="noopener" class="project-title-link">
            ${p.title}
          </a>
          <span class="project-subline"> — ${p.subtitle}</span>
          ${p.period ? `<span class="item-muted" style="margin-left:8px; font-family:var(--font-mono); font-size:0.8rem;">[${p.period}]</span>` : ''}
        </div>

        <ul class="cv-bullets" style="margin-top: 6px;">
          ${(p.bullets || [p.summary]).map(b => `<li>${b}</li>`).join("")}
        </ul>

        <div class="project-tags-inline">
          ${p.tags.map(t => `<span class="tag-clean">${t}</span>`).join("")}
        </div>

        <div class="project-action-links">
          <button class="clean-link-btn btn-open-modal" data-id="${p.id}">
            [Read System Architecture & Deep Dive]
          </button>
          <a href="${p.links.github}" target="_blank" rel="noopener" class="clean-link-btn">
            [Source Code]
          </a>
          ${p.links.demo && p.links.demo !== "#" ? `
            <a href="${p.links.demo}" target="_blank" rel="noopener" class="clean-link-btn">
              [Live Demo]
            </a>
          ` : ''}
        </div>
      </div>
    </article>
  `).join("");
}

/* --------------------------------------------------------------------------
   Competitions & Awards Section
   -------------------------------------------------------------------------- */
function renderAwards(honors) {
  const container = document.getElementById("awards-list-container");
  if (!container || !honors) return;

  container.innerHTML = honors.map(h => `
    <li class="academic-list-item">
      <span>${h}</span>
    </li>
  `).join("");
}

/* --------------------------------------------------------------------------
   Experience & Leadership (CV Format)
   -------------------------------------------------------------------------- */
function renderExperienceAndLeadership(experience, leadership) {
  // Positions of Responsibility
  const expContainer = document.getElementById("experience-cv-container");
  if (expContainer && experience) {
    expContainer.innerHTML = experience.map(exp => `
      <div class="cv-entry">
        <div class="cv-header-row">
          <span class="cv-role">${exp.role}</span>
          <span class="cv-period">${exp.period}</span>
        </div>
        <div class="cv-org">${exp.organization} — ${exp.location}</div>
        <ul class="cv-bullets">
          ${exp.highlights.map(h => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    `).join("");
  }
}

/* --------------------------------------------------------------------------
   Skills Matrix
   -------------------------------------------------------------------------- */
function renderSkills(skillsData) {
  const container = document.getElementById("skills-clean-container");
  if (!container || !skillsData) return;

  container.innerHTML = skillsData.categories.map(cat => `
    <div class="skills-clean-category">
      <h4>${cat.name}</h4>
      <ul class="skills-clean-list">
        ${cat.items.map(item => `
          <li class="skills-clean-item">
            <span>
              ${item.name}
              ${item.highlight ? '<span class="skill-highlight-dot">★</span>' : ''}
            </span>
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");
}

/* --------------------------------------------------------------------------
   Contact Form & Utilities
   -------------------------------------------------------------------------- */
function setupContact(personal) {
  const form = document.getElementById("contact-clean-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("clean-form-name").value.trim();
      const email = document.getElementById("clean-form-email").value.trim();
      if (!name || !email) return;

      showToast(`Thank you, ${name}. Message received.`);
      form.reset();
    });
  }

  const copyBtn = document.getElementById("clean-copy-email");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(personal.email).then(() => {
        showToast("Email address copied to clipboard!");
      });
    });
  }
}

function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* --------------------------------------------------------------------------
   Case Study Modal
   -------------------------------------------------------------------------- */
function setupProjectModal(projects) {
  const modalOverlay = document.getElementById("project-modal-overlay");
  const modalBody = document.getElementById("project-modal-content");
  const closeBtn = document.getElementById("project-modal-close");
  if (!modalOverlay || !modalBody) return;

  function openModal(projectId) {
    const p = projects.find(item => item.id === projectId);
    if (!p) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span style="font-family: var(--font-mono); color: var(--color-primary-blue); font-size: 0.85rem; text-transform: uppercase;">
          ${p.category} • Engineering Case Study • ${p.period}
        </span>
        <h2 style="font-size: 1.6rem; color: var(--color-primary-blue); margin-top: 4px;">${p.title}</h2>
        <div style="color: var(--text-muted); font-size: 0.95rem;">${p.subtitle}</div>
      </div>

      <div style="margin-bottom: 18px;">
        <h4 style="color: var(--text-primary); font-size: 1.05rem; margin-bottom: 6px;">The Engineering Challenge</h4>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">${p.caseStudy.problem}</p>
      </div>

      <div style="margin-bottom: 18px;">
        <h4 style="color: var(--text-primary); font-size: 1.05rem; margin-bottom: 6px;">Architectural Solution</h4>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">${p.caseStudy.solution}</p>
      </div>

      <div style="margin-bottom: 18px;">
        <h4 style="color: var(--text-primary); font-size: 1.05rem; margin-bottom: 6px;">System Pipeline & Architecture</h4>
        <ul style="padding-left: 20px; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
          ${p.caseStudy.architecture.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: var(--text-primary); font-size: 1.05rem; margin-bottom: 6px;">Verified Outcomes & Impact</h4>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">${p.caseStudy.results}</p>
      </div>

      <div style="display: flex; gap: 14px; border-top: 1px solid var(--border-light); padding-top: 16px;">
        <a href="${p.links.github}" target="_blank" rel="noopener" class="clean-submit-btn" style="text-decoration:none;">
          View Repository
        </a>
      </div>
    `;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-open-modal");
    if (btn) {
      const pid = btn.getAttribute("data-id");
      openModal(pid);
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });
}

/**
 * ScrollSpy: Automatically highlights active nav link as user scrolls
 */
function setupScrollspy() {
  const navLinks = document.querySelectorAll(".header-nav .nav-link");
  const sectionIds = ["home", "education", "projects", "awards", "experience", "skills", "contact"];

  function onScroll() {
    // 1. If reached bottom of document, activate last section ('contact')
    const scrollBottom = window.innerHeight + window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    if (scrollBottom >= docHeight - 50) {
      setActive("contact");
      return;
    }

    // 2. If at top of page, activate 'home'
    if (window.scrollY < 180) {
      setActive("home");
      return;
    }

    // 3. Find the section whose top is closest to or just passed the header threshold (130px)
    let currentId = "home";
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 130) {
          currentId = id;
        }
      }
    }

    setActive(currentId);
  }

  function setActive(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${id}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}
