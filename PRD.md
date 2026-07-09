# Product Requirements Document (PRD)
## Project: MAKAN - Cinematic Web Experience & Ordering System
**Version:** 1.0.0 | **Tier:** 0.01% Elite Execution

### 1. Product Vision & Philosophy
MAKAN is not a standard cafe; it is a "Digital Sanctuary." The objective of this project is to build a high-converting, psychology-driven Single Page Application (SPA). Every pixel, animation, and interaction must be reverse-engineered from behavioral psychology. The target audience includes engineers and high-end consumers who value precision, wabi-sabi aesthetics, and seamless systems. 

**CRITICAL SUCCESS FACTOR:** If the final output resembles a standard, template-based restaurant website, the project is considered a **CRITICAL FAILURE**. The execution must reflect a 0.01% global standard in UI/UX and system architecture.

### 2. Technical Stack & Infrastructure
The autonomous agent must utilize its Front-End, Back-End, and UI/UX Pro Max skills to build this utilizing the following stack:
*   **Front-End Engine:** Next.js (React) for server-side rendering, SEO optimization, and seamless component architecture. Ready for immediate Vercel deployment.
*   **Motion & Physics:** GSAP (GreenSock) combined with Lenis Smooth Scroll. The scrolling physics must be artificially slowed to enforce the "live in the moment" brand tone.
*   **Back-End & Database:** Supabase (for handling the mock reservation system and storing menu JSON data).
*   **Automation Routing:** The WhatsApp ordering system must be architected to easily integrate with n8n webhooks for future autonomous business routing.
*   **Styling:** Tailwind CSS with strict adherence to custom CSS variables (Design Tokens).

### 3. Core Features & UX Architecture

#### 3.1. The Cinematic Loader & Hero Hook
*   **Mechanics:** The site initializes in deep space black. The Makan "Arch" logo backlights slowly (amber glow).
*   **Hero Section:** Features slow-motion cinematic background visuals. 
*   **Action:** Dual Call-to-Action (CTA): A primary solid 'ORDER NOW' button and a secondary ghost 'EXPLORE MENU' button.

#### 3.2. Dual-Track Narrative Scrolling
*   **The Fire Chapter (Hot):** Displays Pizza and Beef Lounges. Uses warm colors, rust textures, and oven imagery.
*   **Thermal Transition:** A scroll-triggered GSAP morphing effect transitioning the UI from hot to cold tones.
*   **The Cold Chapter (Cold):** Displays V60, Frappé, and Smoothies with icy, deep dark visuals and condensation details.

#### 3.3. The Architectural Menu (Interactive Lounges)
*   **UI Constraint:** All product images and menu cards MUST be masked using the "Makan Arch" shape (`clip-path`).
*   **Interaction:** Hovering over a category smoothly changes the global background to a relevant cinematic, blurred image.

#### 3.4. Dynamic Cart & Multi-Channel Checkout
A floating cart system that compiles selected items. Upon checkout, the system must render a modal with 3 functional routes:
1.  **WhatsApp Order:** A script that compiles the cart array into a URL-encoded string and opens the WhatsApp API link. (Ready for n8n payload interception).
2.  **Direct Call:** Triggers a `tel:` protocol.
3.  **Web Order (Mock):** A frictionless UI form capturing user details, triggering a success state animation upon submission.

#### 3.5. Digital Sanctuary Reservation (Mock Backend)
*   **Form Structure:** Date, Time, Number of Guests, Lounge Selection.
*   **UX:** Minimalist input fields with strict validation, connected to a mock Supabase table, returning a cinematic success toast notification.

### 4. AI Image Generation Protocol
The agent must utilize its image generation skills to populate the UI. 
*   **Strict Rule:** All generated images MUST share a unified visual language. 
*   **Universal Prompt Suffix:** Every image prompt must end with: *"warm tadelakt plaster walls, dark wood and rattan textures, cinematic backlit golden lighting, deep shadows, moody editorial food photography, shot on 50mm, shallow depth of field, upscale casual dining aesthetic --ar 16:9 --v 6"*.
*   **Prohibition:** Do NOT generate brightly lit, generic, or overly saturated stock-style photos.

### 5. Quality Assurance & Constraint Checklist
- [ ] No fast or bouncy animations (strictly `power2.inOut` or slow linear).
- [ ] High contrast typography (Geometric Sans for headings, Serif for storytelling).
- [ ] Subtle "measurement lines" integrated into the background grid to appeal to the engineering persona.
- [ ] Zero deviation from the Wabi-Sabi / Modern Youthful Luxury aesthetic.