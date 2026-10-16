/**
 * ===================================================================
 * INTERACTIVE CLI TERMINAL EMULATOR
 * ===================================================================
 * Tailored for Priyanshu Paliwal | IIT Kharagpur (24AI10043)
 */

/**
 * Standard 16-color Windows Console Color Palette mapped for Web UI
 */
const WIN_CONSOLE_COLORS = {
  '0': { name: 'Black',        hex: '#0c0c0c', isDark: true },
  '1': { name: 'Blue',         hex: '#0037da', isDark: true },
  '2': { name: 'Green',        hex: '#13a10e', isDark: true },
  '3': { name: 'Aqua',         hex: '#0891b2', isDark: true },
  '4': { name: 'Red',          hex: '#b91c1c', isDark: true },
  '5': { name: 'Purple',       hex: '#7e22ce', isDark: true },
  '6': { name: 'Yellow',       hex: '#a16207', isDark: true },
  '7': { name: 'White',        hex: '#e2e8f0', isDark: false },
  '8': { name: 'Gray',         hex: '#52525b', isDark: true },
  '9': { name: 'Light Blue',   hex: '#38bdf8', isDark: false },
  'a': { name: 'Light Green',  hex: '#22c55e', isDark: false },
  'b': { name: 'Light Aqua',   hex: '#2dd4bf', isDark: false },
  'c': { name: 'Light Red',    hex: '#f87171', isDark: false },
  'd': { name: 'Light Purple', hex: '#c084fc', isDark: false },
  'e': { name: 'Light Yellow', hex: '#fde047', isDark: false },
  'f': { name: 'Bright White', hex: '#ffffff', isDark: false }
};

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function blendHex(c1, c2, ratio) {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(
    r1 + (r2 - r1) * ratio,
    g1 + (g2 - g1) * ratio,
    b1 + (b2 - b1) * ratio
  );
}

function getLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

class EngineeringTerminal {
  constructor(containerId, inputId, data) {
    this.container = document.getElementById(containerId);
    this.input = document.getElementById(inputId);
    this.data = data;
    this.history = [];
    this.historyIndex = -1;

    this.init();
  }

  init() {
    if (!this.container || !this.input) return;

    // Restore persistent theme from localStorage if set
    try {
      const savedColor = localStorage.getItem("user-cmd-color");
      if (savedColor) {
        this.applyWindowsColor(savedColor, false);
      }
    } catch (e) {
      // Storage unavailable or blocked
    }

    this.printWelcome();

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.execute(cmd);
          this.input.value = "";
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = "";
        }
      }
    });

    // Keep focus when clicking inside terminal window
    if (this.container.parentElement) {
      this.container.parentElement.addEventListener("click", () => {
        this.input.focus();
      });
    }
  }

  printWelcome() {
    const welcomeHtml = `
      <div class="term-line term-dim">Priyanshu Paliwal // IIT Kharagpur AI & Systems CLI Shell v2.6.0</div>
      <div class="term-line term-dim">Type <span class="term-cyan">'help'</span> or try <span class="term-cyan">'color 0a'</span> to change the site color theme.</div>
      <div class="term-line term-dim">--------------------------------------------------------------------------------</div>
    `;
    this.appendOutput(welcomeHtml);
  }

  appendOutput(html) {
    const line = document.createElement("div");
    line.className = "term-output-block";
    line.innerHTML = html;
    this.container.appendChild(line);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  execute(command) {
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    // Echo the command
    const echoHtml = `
      <div class="term-line">
        <span class="term-prompt-label">guest@kgpian:~$</span>
        <span class="term-cmd-echo">${this.escapeHtml(command)}</span>
      </div>
    `;
    this.appendOutput(echoHtml);

    switch (cmd) {
      case "help":
        this.cmdHelp();
        break;
      case "whoami":
      case "bio":
        this.cmdWhoami();
        break;
      case "skills":
        this.cmdSkills();
        break;
      case "projects":
        this.cmdProjects();
        break;
      case "education":
      case "coursework":
        this.cmdEducation();
        break;
      case "experience":
        this.cmdExperience();
        break;
      case "awards":
      case "honors":
      case "achievements":
        this.cmdAwards();
        break;
      case "handles":
      case "cp":
        this.cmdHandles();
        break;
      case "contact":
        this.cmdContact();
        break;
      case "clear":
      case "cls":
        this.container.innerHTML = "";
        this.printWelcome();
        break;
      case "sudo":
        this.appendOutput(`<div class="term-line term-yellow">⚠️ Permission denied: guest is not in sudoers file. This incident will be reported to Priyanshu! 😄</div>`);
        break;
      case "cat":
        if (args.includes("resume") || args.includes("cv")) {
          this.cmdResume();
        } else {
          this.appendOutput(`<div class="term-line term-red">cat: ${this.escapeHtml(args || "file")}: No such file or directory. Try 'cat resume'</div>`);
        }
        break;
      case "matrix":
        this.cmdMatrix();
        break;
      case "date":
        this.appendOutput(`<div class="term-line term-cyan">${new Date().toLocaleString()}</div>`);
        break;
      case "color":
      case "theme":
        this.cmdColor(args);
        break;
      default:
        this.appendOutput(`
          <div class="term-line term-red">zsh: command not found: ${this.escapeHtml(cmd)}</div>
          <div class="term-line term-dim">Type <span class="term-cyan">'help'</span> for a list of valid commands.</div>
        `);
    }
  }

  cmdHelp() {
    const helpHtml = `
      <div class="term-table">
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">color [attr]</div>
          <div class="term-table-cell term-dim">Change site color (e.g. 'color 0a', 'color 1f', 'color /?')</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">whoami</div>
          <div class="term-table-cell term-dim">Print engineer bio, institute, and status</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">skills</div>
          <div class="term-table-cell term-dim">List programming languages, ML stack, and databases</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">projects</div>
          <div class="term-table-cell term-dim">Display systems and AI engineering projects</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">awards</div>
          <div class="term-table-cell term-dim">Show JEE Advanced rank, CP ratings, and quant results</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">handles</div>
          <div class="term-table-cell term-dim">View competitive programming profiles (Codeforces, CodeChef, AtCoder)</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">education</div>
          <div class="term-table-cell term-dim">Show IIT Kharagpur degree, CGPA, and coursework</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">experience</div>
          <div class="term-table-cell term-dim">Review leadership & positions of responsibility</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">cat resume</div>
          <div class="term-table-cell term-dim">Print formatted plain-text CV summary</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">contact</div>
          <div class="term-table-cell term-dim">Get email and profile links</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-cyan">clear</div>
          <div class="term-table-cell term-dim">Clear the terminal window</div>
        </div>
      </div>
    `;
    this.appendOutput(helpHtml);
  }

  cmdWhoami() {
    const p = this.data.personal;
    const html = `
      <div class="term-line term-green"><strong>${p.name}</strong> • Roll: ${p.rollNumber}</div>
      <div class="term-line term-dim">${p.title}</div>
      <div class="term-line term-yellow">Status: ${p.status}</div>
      <div class="term-line term-dim">Location: ${p.location}</div>
      <div class="term-line" style="margin-top:6px;">${p.tagline}</div>
    `;
    this.appendOutput(html);
  }

  cmdSkills() {
    let html = `<div class="term-line term-cyan"><strong>TECHNICAL SKILLS & COMPETENCIES</strong></div>`;
    this.data.skills.categories.forEach((cat) => {
      const topSkills = cat.items.map(s => s.highlight ? `<span class="term-green">${s.name}*</span>` : s.name).join(", ");
      html += `
        <div class="term-line" style="margin-top:4px;">
          <span class="term-yellow">[${cat.name}]</span>: ${topSkills}
        </div>
      `;
    });
    html += `<div class="term-line term-dim" style="margin-top:4px;">* Denotes primary proficiency</div>`;
    this.appendOutput(html);
  }

  cmdProjects() {
    let html = `<div class="term-line term-cyan"><strong>FEATURED PROJECTS</strong></div>`;
    this.data.projects.forEach((proj, idx) => {
      html += `
        <div class="term-line" style="margin-top:6px;">
          <span class="term-green">[${idx + 1}] ${proj.title}</span> <span class="term-dim">(${proj.period})</span>
          <div class="term-dim" style="padding-left:14px;">${proj.summary}</div>
          <div class="term-yellow" style="padding-left:14px;">Stack: ${proj.tags.join(" • ")}</div>
        </div>
      `;
    });
    this.appendOutput(html);
  }

  cmdAwards() {
    let html = `<div class="term-line term-cyan"><strong>AWARDS & ACHIEVEMENTS</strong></div>`;
    this.data.education.honors.forEach((h, idx) => {
      html += `
        <div class="term-line" style="margin-top:4px;">
          <span class="term-yellow">•</span> <span>${h}</span>
        </div>
      `;
    });
    this.appendOutput(html);
  }

  cmdHandles() {
    const p = this.data.personal;
    const html = `
      <div class="term-line term-cyan"><strong>COMPETITIVE PROGRAMMING HANDLES</strong></div>
      <div class="term-line">• Codeforces: <span class="term-green">CapLevi04</span> (Expert, Peak: 1600) — <a href="${p.codeforces}" target="_blank" class="term-cyan">${p.codeforces}</a></div>
      <div class="term-line">• CodeChef: <span class="term-green">cap_levi04</span> (3 Star, Peak: 1752) — <a href="${p.codechef}" target="_blank" class="term-cyan">${p.codechef}</a></div>
      <div class="term-line">• AtCoder: <span class="term-green">CapLevi04</span> (4 Kyu, Peak: 1292) — <a href="${p.atcoder}" target="_blank" class="term-cyan">${p.atcoder}</a></div>
    `;
    this.appendOutput(html);
  }

  cmdEducation() {
    const ed = this.data.education;
    const courses = ed.coursework.map(c => `${c.name}`).slice(0, 6).join(", ");
    let html = `
      <div class="term-line term-green"><strong>${ed.degree}</strong></div>
      <div class="term-line term-dim">${ed.university} | ${ed.duration}</div>
      <div class="term-line term-yellow">Cumulative CGPA: ${ed.gpa}</div>
      <div class="term-line term-dim" style="margin-top:4px;">Schooling:</div>
    `;
    ed.schooling.forEach(s => {
      html += `<div class="term-line" style="padding-left:14px;">• ${s.level}: ${s.institute} — <span class="term-green">${s.score}</span> (${s.year})</div>`;
    });
    html += `<div class="term-line" style="margin-top:4px;">Sample Courses: <span class="term-dim">${courses}...</span></div>`;
    this.appendOutput(html);
  }

  cmdExperience() {
    let html = `<div class="term-line term-cyan"><strong>POSITIONS OF RESPONSIBILITY</strong></div>`;
    this.data.experience.forEach((exp) => {
      html += `
        <div class="term-line" style="margin-top:6px;">
          <span class="term-green">${exp.role}</span> @ <span class="term-yellow">${exp.organization}</span>
          <span class="term-dim">(${exp.period})</span>
          <div class="term-dim" style="padding-left:14px;">${exp.description}</div>
        </div>
      `;
    });
    this.appendOutput(html);
  }

  cmdContact() {
    const p = this.data.personal;
    const html = `
      <div class="term-line term-cyan"><strong>CONTACT & PROFILES</strong></div>
      <div class="term-line">Email: <span class="term-green">${p.email}</span></div>
      <div class="term-line">Codeforces: <a href="${p.codeforces}" target="_blank" class="term-cyan">${p.codeforces}</a></div>
      <div class="term-line">CodeChef: <a href="${p.codechef}" target="_blank" class="term-cyan">${p.codechef}</a></div>
      <div class="term-line">AtCoder: <a href="${p.atcoder}" target="_blank" class="term-cyan">${p.atcoder}</a></div>
      <div class="term-line">GitHub: <a href="${p.github}" target="_blank" class="term-cyan">${p.github}</a></div>
      <div class="term-line">LinkedIn: <a href="${p.linkedin}" target="_blank" class="term-cyan">${p.linkedin}</a></div>
    `;
    this.appendOutput(html);
  }

  cmdResume() {
    const p = this.data.personal;
    const ed = this.data.education;
    const html = `
      <div class="term-line term-yellow">===================================================</div>
      <div class="term-line term-green"><strong>${p.name}</strong> | Roll: ${p.rollNumber}</div>
      <div class="term-line term-dim">${p.title} | ${p.email}</div>
      <div class="term-line term-yellow">===================================================</div>
      <div class="term-line term-cyan">EDUCATION:</div>
      <div class="term-line">${ed.degree} — CGPA: ${ed.gpa}</div>
      <div class="term-line term-dim">${ed.university} (${ed.duration})</div>
      <div class="term-line term-cyan" style="margin-top:6px;">TOP HONORS:</div>
      <div class="term-line">• JEE Advanced 2024: AIR 821 (among 160,000 candidates)</div>
      <div class="term-line">• Codeforces: Expert (1600) | CodeChef: 3 Star (1752) | AtCoder: 4 Kyu (1292)</div>
      <div class="term-line">• IMC Prosperity 4: Rank 207 globally & 26th in India (18,000+ teams)</div>
      <div class="term-line term-yellow" style="margin-top:6px;">===================================================</div>
    `;
    this.appendOutput(html);
  }

  cmdMatrix() {
    const quotes = [
      "Wake up, Neo... The Matrix has you.",
      "There is no spoon.",
      "C++ query optimization: Bitmask DP initialized.",
      "Myers edit graph calculated: Minimum edit script found."
    ];
    const rand = quotes[Math.floor(Math.random() * quotes.length)];
    const rain = "01010000 01010010 01001001 01011001 01000001 01001110 01010011 01001000 01010101";
    this.appendOutput(`
      <div class="term-line term-green" style="font-size:0.8rem; letter-spacing:2px;">${rain}</div>
      <div class="term-line term-green"><em>"${rand}"</em></div>
    `);
  }

  applyWindowsColor(attr, save = true) {
    const clean = (attr || "").trim().toLowerCase();

    // Reset condition
    if (!clean || clean === "reset" || clean === "default") {
      const root = document.documentElement;
      const cssProps = [
        "--bg-primary",
        "--bg-subtle",
        "--bg-highlight",
        "--color-primary-blue",
        "--color-blue-hover",
        "--color-orange-active",
        "--text-primary",
        "--text-secondary",
        "--text-muted",
        "--border-light",
        "--border-divider",
        "--terminal-bg",
        "--terminal-header-bg",
        "--terminal-text",
        "--term-prompt",
        "--btn-text-color"
      ];
      cssProps.forEach((prop) => root.style.removeProperty(prop));
      if (save) {
        try {
          localStorage.removeItem("user-cmd-color");
        } catch (e) {}
      }
      return { success: true, isReset: true };
    }

    // Windows CMD allows 1 hex digit (defaults background to 0)
    let parsedAttr = clean;
    if (parsedAttr.length === 1) {
      parsedAttr = "0" + parsedAttr;
    }

    if (parsedAttr.length !== 2) {
      return {
        success: false,
        msg: "Invalid color attribute. Type 'color /?' for help."
      };
    }

    const bgKey = parsedAttr[0];
    const fgKey = parsedAttr[1];

    if (!WIN_CONSOLE_COLORS[bgKey] || !WIN_CONSOLE_COLORS[fgKey]) {
      return {
        success: false,
        msg: "Invalid color attribute. Each digit must be 0-9 or A-F. Type 'color /?' for help."
      };
    }

    // Windows CMD error if identical colors
    if (bgKey === fgKey) {
      return {
        success: false,
        msg: "Background and foreground colors cannot be identical."
      };
    }

    const bg = WIN_CONSOLE_COLORS[bgKey];
    const fg = WIN_CONSOLE_COLORS[fgKey];
    const root = document.documentElement;

    const fgLum = getLuminance(fg.hex);

    let bgSubtle, bgHighlight, borderLight, borderDivider;
    let textSec, textMuted, termBg, termHeaderBg;

    if (bg.isDark) {
      bgSubtle = blendHex(bg.hex, "#ffffff", 0.08);
      bgHighlight = blendHex(bg.hex, fg.hex, 0.22);
      borderLight = blendHex(bg.hex, fg.hex, 0.32);
      borderDivider = blendHex(bg.hex, fg.hex, 0.18);
      textSec = blendHex(fg.hex, bg.hex, 0.28);
      textMuted = blendHex(fg.hex, bg.hex, 0.52);
      termBg = blendHex(bg.hex, "#000000", 0.25);
      termHeaderBg = blendHex(bg.hex, "#ffffff", 0.08);
    } else {
      bgSubtle = blendHex(bg.hex, "#000000", 0.05);
      bgHighlight = blendHex(bg.hex, fg.hex, 0.18);
      borderLight = blendHex(bg.hex, fg.hex, 0.26);
      borderDivider = blendHex(bg.hex, fg.hex, 0.14);
      textSec = blendHex(fg.hex, bg.hex, 0.32);
      textMuted = blendHex(fg.hex, bg.hex, 0.55);
      termBg = blendHex(bg.hex, "#ffffff", 0.35);
      termHeaderBg = blendHex(bg.hex, "#000000", 0.06);
    }

    const btnTextColor = fgLum > 0.55 ? "#0c0c0c" : "#ffffff";
    const hoverColor = bg.isDark ? blendHex(fg.hex, "#ffffff", 0.22) : blendHex(fg.hex, "#000000", 0.22);

    root.style.setProperty("--bg-primary", bg.hex);
    root.style.setProperty("--bg-subtle", bgSubtle);
    root.style.setProperty("--bg-highlight", bgHighlight);
    root.style.setProperty("--color-primary-blue", fg.hex);
    root.style.setProperty("--color-blue-hover", hoverColor);
    root.style.setProperty("--text-primary", fg.hex);
    root.style.setProperty("--text-secondary", textSec);
    root.style.setProperty("--text-muted", textMuted);
    root.style.setProperty("--border-light", borderLight);
    root.style.setProperty("--border-divider", borderDivider);
    root.style.setProperty("--terminal-bg", termBg);
    root.style.setProperty("--terminal-header-bg", termHeaderBg);
    root.style.setProperty("--terminal-text", fg.hex);
    root.style.setProperty("--term-prompt", fg.hex);
    root.style.setProperty("--btn-text-color", btnTextColor);

    if (save) {
      try {
        localStorage.setItem("user-cmd-color", parsedAttr);
      } catch (e) {}
    }

    return {
      success: true,
      attr: parsedAttr,
      bgName: bg.name,
      fgName: fg.name,
      bgHex: bg.hex,
      fgHex: fg.hex
    };
  }

  cmdColor(args) {
    const raw = (args || "").trim();
    const lower = raw.toLowerCase();

    if (lower === "/?" || lower === "help" || lower === "-h" || lower === "--help") {
      this.cmdColorHelp();
      return;
    }

    if (!raw || lower === "reset" || lower === "default") {
      this.applyWindowsColor("reset");
      this.appendOutput(`
        <div class="term-line term-green">Restored default academic color scheme (white & blue).</div>
      `);
      return;
    }

    const res = this.applyWindowsColor(raw);
    if (!res.success) {
      this.appendOutput(`
        <div class="term-line term-red">${this.escapeHtml(res.msg)}</div>
      `);
      return;
    }

    const bDigit = res.attr[0].toUpperCase();
    const fDigit = res.attr[1].toUpperCase();
    this.appendOutput(`
      <div class="term-line term-green">Website color scheme updated to <strong>[${bDigit}${fDigit}]</strong>:</div>
      <div class="term-line" style="padding-left:14px;">
        Background: <span style="display:inline-block; width:12px; height:12px; vertical-align:middle; background:${res.bgHex}; border:1px solid #777; border-radius:2px; margin-right:4px;"></span>[${bDigit}] ${res.bgName} (${res.bgHex})<br>
        Foreground: <span style="display:inline-block; width:12px; height:12px; vertical-align:middle; background:${res.fgHex}; border:1px solid #777; border-radius:2px; margin-right:4px;"></span>[${fDigit}] ${res.fgName} (${res.fgHex})
      </div>
      <div class="term-line term-dim" style="margin-top:4px;">Tip: Type <span class="term-cyan">'color reset'</span> to return to the original theme, or <span class="term-cyan">'color /?'</span> for the color table.</div>
    `);
  }

  cmdColorHelp() {
    const helpHtml = `
      <div class="term-line term-cyan"><strong>Sets default website foreground and background colors (Windows CMD syntax).</strong></div>
      <div class="term-line term-yellow" style="margin-top:4px;">COLOR [attr]</div>
      <div class="term-line term-dim" style="margin:4px 0 8px;">
        attr specifies color attribute of console & website output.<br>
        Specified by TWO hex digits: 1st digit = Background, 2nd digit = Foreground.
      </div>
      <div class="term-table">
        <div class="term-table-row">
          <div class="term-table-cell term-dim">0 = Black</div>
          <div class="term-table-cell term-dim">8 = Gray</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-dim">1 = Blue</div>
          <div class="term-table-cell term-dim">9 = Light Blue</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-dim">2 = Green</div>
          <div class="term-table-cell term-dim">A = Light Green</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-dim">3 = Aqua</div>
          <div class="term-table-cell term-dim">B = Light Aqua</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-dim">4 = Red</div>
          <div class="term-table-cell term-dim">C = Light Red</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-dim">5 = Purple</div>
          <div class="term-table-cell term-dim">D = Light Purple</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-dim">6 = Yellow</div>
          <div class="term-table-cell term-dim">E = Light Yellow</div>
        </div>
        <div class="term-table-row">
          <div class="term-table-cell term-dim">7 = White</div>
          <div class="term-table-cell term-dim">F = Bright White</div>
        </div>
      </div>
      <div class="term-line term-dim" style="margin-top:6px;">
        <strong>Examples:</strong><br>
        • <span class="term-green">color 0a</span> &nbsp;&rarr; Classic Hacker Light Green on Black<br>
        • <span class="term-green">color 0b</span> &nbsp;&rarr; Cyberpunk Light Aqua on Black<br>
        • <span class="term-green">color 1f</span> &nbsp;&rarr; PowerShell Bright White on Blue<br>
        • <span class="term-green">color f0</span> &nbsp;&rarr; Clean Black on Bright White<br>
        • <span class="term-green">color reset</span> &rarr; Restore default academic theme
      </div>
    `;
    this.appendOutput(helpHtml);
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

if (typeof window !== "undefined") {
  window.EngineeringTerminal = EngineeringTerminal;
}
