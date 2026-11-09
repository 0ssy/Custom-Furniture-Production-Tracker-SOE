# Frontend Feature 17: Dashboard, Reports and Not Found Page

## What it does
The Dashboard shows live numbers from the database: customers, orders, pending orders, orders
in production, pending deliveries, money received, outstanding balance, low-stock materials
and the five newest orders. The Reports page shows a sales report, payments by method,
a production report, a delivery report and a low-stock list, and can be printed.
Unknown addresses show a "Page not found" page. Replaces the placeholder pages.

## Files
- `src/services/useSystemData.ts`: loads all lists at the same time
- `src/pages/Dashboard.tsx`, `src/pages/Reports.tsx`, `src/pages/NotFound.tsx`
- `src/App.tsx`: routes, including the catch-all route
- `src/components/Layout.tsx`: sidebar hidden when printing

## How the numbers are worked out
- Money numbers leave out Cancelled orders.
- Received money counts only Completed payments.
- Outstanding is billed minus received.
- Low stock means stock at or below the reorder level.
- Pending deliveries are Pending plus In Transit.

## How it was tested
Tested manually at `localhost:5173`, logged in, with orders, payments, deliveries and materials added.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check dashboard | TC01: Cards load | Data exists | 1. Click Dashboard | None | Eight cards show numbers that match the other pages | The cards matched | Pass |
| Check dashboard | TC02: Recent orders | Orders exist | 1. Look at Recent Orders | None | Up to five newest orders, newest first | The list was correct | Pass |
| Check dashboard link | TC03: Numbers update | A payment is marked Completed | 1. Complete a payment<br>2. Open Dashboard | None | Received goes up and Outstanding goes down | The numbers changed | Pass |
| Check reports | TC04: Reports load | Data exists | 1. Click Reports | None | Five report sections show, with a report date | All sections showed | Pass |
| Check reports | TC05: Sales report matches Payments | Payments exist | 1. Compare Billed, Received and Outstanding with the Payments page | None | The numbers are equal | They matched | Pass |
| Check reports | TC06: Status tables add up | Data exists | 1. Add up the order counts per status | None | The total equals the number of orders | It matched | Pass |
| Check reports | TC07: Low stock list | A low material exists | 1. Look at Low Stock Materials | None | The low material is listed | It was listed | Pass |
| Check printing | TC08: Print Report | Reports open | 1. Click Print Report | None | The print window opens and the sidebar is not in the preview | The sidebar was hidden | Pass |
| Check not found | TC09: Unknown address | Logged in | 1. Open `localhost:5173/xyz` | `/xyz` | "Page not found" with a link back to the Dashboard | The page showed | Pass |
| Check page protection | TC10: Logged out | Logged out | 1. Open `localhost:5173/reports` | None | Redirected to the login page | It redirected | Pass |

## Known issues / to do
- Numbers are calculated in the browser from full lists. A large system would ask the backend for totals.
- Reports cover all dates. A date filter can be added later.
- Staff and Admin see the same menu. The backend enforces what each can do.