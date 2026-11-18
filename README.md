# Venkata Guru Prasad Gummadi — Portfolio

Personal engineering portfolio of **Venkata Guru Prasad Gummadi** (Computer Science & Engineering — IoT, Hyderabad, India), designed with a Glacier Blue, Deep Navy, and Lemon architectural aesthetic.

## Highlights

- **Editorial Portrait Hero & Dual Theme**: Light Glacier (`#EAF4FB`) and Dark Deep Navy (`#081426`) modes with persistent theme preference, pairing `Cormorant Garamond`, `Plus Jakarta Sans`, and `JetBrains Mono`.
- **Interactive System Architecture Blueprints**: Filterable **Work** showcase with scroll-based parallax vector schematics and a slide-over **Architecture Drawer** detailing engineering challenges, decisions, and data flow diagrams.
- **Global Command Palette (`⌘K` / `Ctrl+K`)**: Keyboard-navigable launcher for jumping across views (`Overview`, `Work`, `Experience`, `Notes`, `Contact`), inspecting architecture blueprints, reading engineering notes, toggling themes, or copying contact info.
- **Tactile Motion & Canvas Backdrop**: Retina-DPI `<canvas>` architectural dot-and-hairline constellation background, spring-damped magnetic hover pulls on primary buttons and navigation links, and `prefers-reduced-motion` support.
- **Experience, Notes & Contact**: Chronological AI/ML internships, education, verified industry certifications, technical notes reader modal with copyable code snippets, and a client-validated inquiry form.

## Technology Stack

- **Framework**: React 19 & TypeScript
- **Build Tool**: Vite 8 (configured with `base: './'` for root and subpath static hosting)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation**: Motion (`motion/react`)
- **Icons**: Lucide React
- **CI/CD**: GitHub Actions (`actions/deploy-pages`)

## Getting Started Locally

### Prerequisites

- **Node.js** `22 LTS` (recommended) or `20.19+`
- **npm** (or **Bun**)

### 1. Install Dependencies

The repository includes an `.npmrc` (`legacy-peer-deps=true`) so `npm install` resolves dependencies cleanly without peer-range conflicts:

```bash
npm install
```

### 2. Run the Development Server

Starts Vite on `http://localhost:3000`:

```bash
npm run dev
```

### 3. Typecheck & Build for Production

Run TypeScript type checking and compile the static production bundle into `dist/`:

```bash
npm run lint
npm run build
```

### 4. Preview the Production Build Locally

Serve the compiled `dist/` directory over HTTP to verify production assets locally:

```bash
npm run preview
```

## Deploying to GitHub Pages

This repository includes `.github/workflows/deploy.yml` and `public/.nojekyll` for automated static deployment:

1. Push your commits to the `main` or `master` branch.
2. In your GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. GitHub Actions will automatically install dependencies, run `npm run build`, and publish `dist/` to your GitHub Pages URL.

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the local Vite development server on port `3000` |
| `npm run build` | Compile the production static site into `dist/` |
| `npm run preview` | Preview the built `dist/` bundle locally over HTTP |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |
