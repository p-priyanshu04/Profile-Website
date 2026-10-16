# Engineering Student Profile & Portfolio Website

A fast, modern personal portfolio website built with semantic HTML5, Vanilla CSS3, and Modular JavaScript. Engineered specifically for engineering students to showcase technical projects, research experiences, coursework, and technical skills with an interactive command-line terminal emulator.

---

## 🚀 Quick Start / How to Run Locally

You do not need any frameworks or build steps. You can run and view the website instantly:

### Option 1: Python HTTP Server (Recommended)
Open a terminal in this directory and run:
```bash
python -m http.server 8000
```
Then visit [http://localhost:8000](http://localhost:8000) in your web browser.

### Option 2: Direct Open
Double click `index.html` to open directly in Google Chrome, Edge, Brave, or Firefox.

### Option 3: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 🛠️ Effortless Personalization (`js/data.js`)

All content on the website is data-driven. You do **not** need to edit complex HTML tags. Simply open `js/data.js` in your editor and update the fields:

### 1. Personal Information & Bio
- Change `name`, `preferredName`, `title`, `tagline`, `location`, `status`, `email`, and social URLs (`github`, `linkedin`).
- Update `specializations` array to adjust the dynamic typewriter words in the hero section.

### 2. Projects Showcase
- Add, edit, or reorder projects in the `projects` array.
- Each project supports:
  - `title`, `subtitle`, `category` (`hardware`, `software`, `ai`)
  - `image` (place screenshot in `assets/images/`)
  - `tags` (e.g., `["C++", "ROS 2", "ESP32"]`)
  - `metrics` (e.g., `[{ label: "Latency", value: "<40ms" }]`)
  - `caseStudy` object (`problem`, `solution`, `architecture`, `results`) which powers the interactive popup modal!

### 3. Education & Coursework
- Update `university`, `degree`, `duration`, `gpa`, and honors awards.
- Add your actual courses and letter grades in `coursework`.

### 4. Technical Skills Matrix
- Organize your languages, embedded/hardware tools, frameworks, and DevOps tools with percentage proficiency.
- Set `highlight: true` to mark your primary engineering proficiencies with a star badge.

### 5. Work & Leadership Timeline
- Update `experience` with your internships, co-ops, or research assistantships.
- Update `leadership` with your engineering design teams (e.g. Formula SAE, Robotics Club, IEEE, GDSC) or hackathon wins.

---

## 🎨 Design Features
- **Dark & Light Mode**: Persistent theme switch with smooth transitions.
- **Interactive Engineering Terminal**: Interactive CLI shell emulator supporting `help`, `whoami`, `skills`, `projects`, `education`, `experience`, `contact`, `matrix`, `clear`, and arrow-key history navigation.
- **Glassmorphism & Responsive Grid**: Optimized for mobile phones (375px+), tablets, and 4K displays.
- **Project Case Study Modals**: In-depth breakdown for recruiters showing engineering problems, system architectures, and measured results.
- **1-Click Copy Email & Direct Transmission**: Quick clipboard copy with toast feedback and form validation.

---

## 🌐 1-Click Free Deployment

You can deploy this site for free in under 2 minutes:
1. **GitHub Pages**:
   - Push this repo to GitHub.
   - Go to **Settings** > **Pages** > Select `main` branch `/ (root)` > Click **Save**.
2. **Vercel / Netlify**:
   - Drag and drop this folder onto [Netlify Drop](https://app.netlify.com/drop) or import from GitHub on Vercel with zero build command settings.
