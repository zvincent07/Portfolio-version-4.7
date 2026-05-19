# Project Rules & Documentation

## 1. Folder Structure
- `src/components/`: Reusable UI components (buttons, cards, etc.)
- `src/layouts/`: Structural components (Sidebar, Topbar, Footer, Layout wrapper)
- `src/pages/` or `src/sections/`: Main content sections (Hero, About, Projects)
- `src/assets/`: Static assets (images, global icons)
- `src/styles/` or colocated CSS: Stylesheets

## 2. Theme & Colors
- **Primary**: `#ff4654` (Red Accent)
- **Secondary**: `#ba3a46` (Darker Red Accent)
- **Background**: `#111823` (Dark Navy/Black)
- **Text**: `#ffffff` (White)

## 3. Component Guidelines
- Use functional components and React Hooks.
- Keep components small and focused on a single responsibility.
- Use `lucide-react` for consistent iconography.

## 4. Styling Guidelines
- Maintain the grid texture background on the root layout.
- Distinct surface areas (Sidebar, Content) should use slight variations of the background color (e.g., `#151d2a`) or low-opacity white overlays (`rgba(255, 255, 255, 0.02)`) to create depth.
- Ensure active states and hover states consistently use the Primary color.
