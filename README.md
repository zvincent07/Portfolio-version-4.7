# John Vincent Laylo — Professional Portfolio

A premium, highly interactive, and responsive portfolio web application designed for maximum visual polish and smooth navigation. Built with React, TypeScript, Vite, and powered by custom motion mechanics.

---

## 🚀 Key Highlights & Premium Features

### 1. Choreographed Sequential Loading Screen
* **Staggered Text Loop:** Spawns a letter-by-letter bounce wave (`translateY`) and opacity pulse on `"Loading ..."` upon initial site entry.
* **Full-screen Background Reveal:** Fades out the loading text first, followed by the dark solid overlay background (`#loading-bg`) to reveal the main landing page.
* **FLIP Avatar Flight:** Performs viewport calculations to translate and scale the loading avatar from the exact center of the screen to its designated profile slot, gliding in with a custom bezier deceleration (`cubicBezier(0.22, 1, 0.36, 1)`).
* **Delayed Section Mounts:** Typewriter split text, banner slides, and scroll-triggers wait to initialize until the loader completes to avoid layout collision.

### 2. Clean HTML5 History API Routing
* **No More Hashes:** Completely transitioned from hash-anchors (like `/#projects`) to clean, modern pathname routing (like `/projects`, `/experience`, etc.).
* **State Synchronization:** Custom listeners bind popstate, manual clicks, touch swiping, and wheel scroll boundaries, keeping sidebar indicators and animations perfectly in sync.
* **Hard Refresh Resilience:** Built to load specific subroutes directly without breaking or defaulting layouts.

### 3. Falling Snowflakes Physics Background
* **Physics & Swaying Particles:** Employs Anime.js to generate and animate a falling snow background.
* **Brand Unified Colors:** Particles alternate between the primary red accent (`#ff4654`) and white text (`#ffffff`) color, styled with matching soft glows.
* **Natural Wind Drift:** Employs nested sinusoidal timelines to simulate drifting back and forth horizontally.
* **User Control (Toggle):** Includes a floating toggle button in the bottom right corner with state saved to `localStorage` to turn off or enable the snowflakes.

### 4. Interactive Navigation & Micro-Animations
* **Scroll & Swipe Bindings:** Allows boundary swiping (on touchscreens) and boundary scroll wheeling to cleanly transition page views.
* **Typewriter Splitting:** Splices strings into clipped lines and characters, executing randomized entry animations upon profile section updates.

---

## 🛠️ Technology Stack
* **Core:** React, TypeScript
* **Bundler & Server:** Vite
* **Styling:** TailwindCSS (Base utilities) & Vanilla CSS (Layout custom values)
* **Animation System:** Anime.js
* **Icons:** Lucide React

---

## ⚙️ Installation & Local Setup

1. **Clone the Repository & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run in Development Mode:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Build for Production:**
   ```bash
   npm run build
   ```
   Compiles static assets into the `/dist` directory.

---

## 📄 ATS-First CV & Graphical Resume Generation

The portfolio features programmatically generated PDFs: an ATS-friendly single-column CV, and a custom two-column Graphical Resume with a profile picture. The source text and layout are defined in HTML templates and compiled using Chrome in headless mode.

### How to update and compile:
1. **Modify the Source:**
   Edit the HTML and stylesheet in `cv.html` (for the ATS CV) or `resume.html` (for the Graphical Resume) in the root of the project to update text or layout details.

2. **Run the Compiler:**
   Run the Python automation script to compile the HTML into the final PDFs:
   ```bash
   python generate_pdf.py
   ```

*Note: The script requires `pypdf` (`pip install pypdf`) and Chrome installed at the standard Windows path. It automatically runs multi-pass layout optimization to adjust typography and margins so the output fits perfectly onto a single page.*

