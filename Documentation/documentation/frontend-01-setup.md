# Frontend Feature 01: Setup, Layout and Navigation

## What it does
Sets up the React + TypeScript project and creates the main layout
(sidebar + page area) with navigation to all the system modules.

## Tools used
- Vite (creates and runs the React project)
- React + TypeScript
- Tailwind CSS (styling)
- React Router (moving between pages)

## Files
- `src/main.tsx`: app entry point, wraps the app in BrowserRouter
- `src/App.tsx`: list of all routes
- `src/components/Layout.tsx`: sidebar and page area
- `src/pages/Dashboard.tsx`: dashboard with summary cards
- `src/pages/PagePlaceholder.tsx`: temporary page for unbuilt modules

## How it works
Layout is the parent route. Each page is displayed inside its Outlet,
so the sidebar stays on screen while only the right side changes.

## How it was tested
Ran `npm run dev` and checked that all 9 menu links open the right page,
the active link is highlighted, and the dashboard cards display.

## Known issues / to do
- No "Not Found" page yet
- Dashboard numbers are hardcoded, will come from the API later
- Login page and role-based menu to be added