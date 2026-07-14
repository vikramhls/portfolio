# Galekto-Style Interactive Animations for Portfolio

Add premium cursor-driven animations, project hover image previews, interactive journey section, and smooth parallax effects inspired by [galekto.com](https://galekto.com/).

## What Galekto Does (Key Patterns to Replicate)

### 1. **Cursor + Image Interaction** (Hero Section)
- **Portrait reacts to cursor**: The hero portrait image shifts/parallaxes based on mouse position (you already have this ✅)
- **Color reveal mask follows cursor**: A radial gradient mask reveals color on B&W image (you already have this ✅)
- **3D tilt effect**: Galekto adds a subtle `perspective` + `rotateX/rotateY` tilt on the image based on cursor position — your portfolio currently only translates, no tilt
- **Smooth spring-like easing**: Galekto uses `requestAnimationFrame` with lerp (linear interpolation) for buttery smooth movement instead of direct CSS updates

### 2. **Project Section — Cursor-Following Image Previews**
- When hovering over a project row, a **preview image appears and follows the cursor** vertically
- The image **slides in with scale animation** and **fades out** when leaving
- Each project row shows a different preview image
- This is the **most impactful missing feature** from your portfolio

### 3. **Journey/Timeline — Interactive Scroll Animations**
- Timeline items have **staggered reveal** with scroll-triggered animations
- Each item has a **horizontal slide-in** with easing
- The timeline line **draws/fills** as you scroll through items
- Dots **pulse and glow** as their corresponding item enters the viewport
- Hover on timeline items causes **magnetic expansion** and content highlight

### 4. **Enhanced Cursor System**
- Galekto uses a **magnetic cursor** — when near interactive elements, the cursor is subtly "pulled" toward them
- On project rows, the cursor ring **expands and shows "VIEW"** text
- Cursor has **blend mode difference** for contrast against all backgrounds

### 5. **Smooth Scroll Parallax**
- Multiple layers of content move at different scroll speeds
- Side labels (PROJECTS / JOURNEY) have subtle parallax offsets
- Background numbers slide at a slower rate than the foreground

---

## Proposed Changes

### Hero Section (Enhance existing)

#### [MODIFY] [script.js](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/script.js)
- **Add 3D tilt to hero image**: Calculate `rotateX` and `rotateY` from cursor position, apply via `transform` with `perspective(800px)` — gives the image a depth effect as the cursor moves
- **Use `requestAnimationFrame` lerp loop** for all hero parallax instead of direct assignment in `mousemove` — creates buttery smooth, spring-like animation instead of 1:1 mouse tracking
- **Add magnetic cursor effect**: When cursor is near interactive elements (project rows, buttons, timeline dots), apply a subtle pull force that smoothly attracts the cursor ring toward the element center

#### [MODIFY] [style.css](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/style.css)
- Add `perspective` and `transform-style: preserve-3d` to hero face container for 3D tilt
- Add transition smoothing for the tilt transforms

---

### Project Section — Cursor-Following Image Previews (New Feature)

#### [MODIFY] [index.html](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/index.html)
- Add a `<div class="project-preview">` container with `<img>` elements for each project
- Add `data-preview` attributes to each `.project-row` linking to a preview image

#### [MODIFY] [script.js](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/script.js)
- On project row `mouseenter`: show the corresponding preview image, animate it in with scale + opacity
- On `mousemove` within project rows: the preview image follows the cursor's Y position (and offset to the side)
- On `mouseleave`: animate the preview out
- Use `requestAnimationFrame` lerp for smooth following

#### [MODIFY] [style.css](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/style.css)
- Style `.project-preview` as a fixed/absolute positioned floating image container
- Add scale/opacity/clip-path transitions for reveal animation
- Give it `pointer-events: none` so it doesn't interfere with hover

> [!IMPORTANT]
> I'll need to generate 3 preview images (one per project) using the image generation tool since we need actual images for the hover previews.

---

### Journey/Timeline — Enhanced Interactivity (Enhance existing)

#### [MODIFY] [script.js](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/script.js)
- **Scroll-driven timeline fill**: As each timeline item scrolls into view, the timeline `::before` line grows in height dynamically via a CSS variable
- **Staggered item animations**: Timeline items slide in from alternating sides (left/right) instead of all from bottom
- **Dot activation**: When a timeline item enters the viewport center, its dot pulses/glows and stays highlighted
- **Hover magnetic effect**: On hover, the timeline item content subtly shifts toward the cursor

#### [MODIFY] [style.css](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/style.css)
- Timeline items get alternating left/right slide-in animations
- Active dots get glow pulse animation
- Add hover state that causes subtle magnetic movement and background highlight
- Timeline line height controlled by CSS variable `--timeline-progress`

---

### Cursor System — Magnetic + View Label (Enhance existing)

#### [MODIFY] [script.js](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/script.js)
- **Magnetic effect**: For each interactive element, calculate distance from cursor. When within ~100px, apply a small offset to the cursor ring position that pulls it toward the element center
- **"VIEW" label on project hover**: When cursor enters a project row, inject/show a "VIEW" text inside the cursor ring
- **Cursor ring size changes**: Different sizes for different contexts (default, hover, project, timeline)

#### [MODIFY] [style.css](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/style.css)
- Add `.cursor-ring.project-hover` with larger size + "VIEW" text via `::after`
- Add `.cursor-ring.timeline-hover` variant
- Smooth transitions between all cursor states

---

### Smooth Scroll Parallax Layers (New)

#### [MODIFY] [script.js](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/script.js)
- Add a global scroll-based parallax system that moves elements at different rates based on `data-parallax-speed` attributes
- Apply to: section labels, hero side texts, background numbers, section titles

#### [MODIFY] [style.css](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/style.css)
- Add `will-change: transform` and `transform: translateZ(0)` for GPU-accelerated parallax layers

---

## Summary of All Files Modified

| File | Changes |
|------|---------|
| [index.html](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/index.html) | Add project preview container, data-preview attributes |
| [style.css](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/style.css) | 3D tilt CSS, project preview styles, enhanced timeline, cursor variants, parallax layers |
| [script.js](file:///c:/Users/Harsh/OneDrive/Desktop/portfolio/script.js) | Lerp-based hero parallax with tilt, project image previews, timeline scroll-fill, magnetic cursor, scroll parallax |

## Verification Plan

### Manual Verification
- Open the portfolio in a browser and verify:
  1. Hero image tilts smoothly with cursor movement (3D perspective effect)
  2. Moving cursor over project rows shows a floating preview image that follows the cursor
  3. Scrolling through the timeline shows the line filling up and dots activating
  4. Cursor has magnetic pull near interactive elements
  5. All animations feel smooth and spring-like (no jank)
  6. Mobile responsiveness is preserved (cursor effects disabled on touch devices)
