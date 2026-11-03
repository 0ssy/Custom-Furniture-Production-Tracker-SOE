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
Tested manually in the browser at `localhost:5173`.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check navigation menu | TC01: Check the sidebar shows all menu items | Frontend is running with `npm run dev` | 1. Open `localhost:5173` | None | Sidebar shows 9 items: Dashboard, Customers, Orders, Furniture, Materials, Production, Payments, Deliveries, Reports | All 9 items were shown | Pass |
| Check navigation menu | TC02: Click a menu item | App is open | 1. Click Customers in the sidebar | None | Page changes without a full reload | Page changed without reloading | Pass |
| Check navigation menu | TC03: Check the active item is highlighted | App is open | 1. Click any menu item | None | Clicked item is highlighted in amber | Item was highlighted | Pass |
| Check dashboard | TC04: Check the dashboard cards | App is open | 1. Click Dashboard | None | 3 cards show: Total Orders, In Production, Pending Deliveries | 3 cards were shown | Pass |

## Known issues / to do
- No "Not Found" page yet
- Dashboard numbers are hardcoded, will come from the API later
- Login page and role-based menu to be added