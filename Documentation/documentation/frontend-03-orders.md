# Frontend Feature 03: Order Management

## What it does
Shows a list of furniture orders. The user can search by customer name or
furniture type, filter by status, add a new order and edit an existing one.
It uses mock data for now because the backend is not finished yet.

## Files
- `src/types/order.ts`: the Order type and the list of statuses
- `src/data/mockOrders.ts`: fake orders used for testing
- `src/components/OrderForm.tsx`: form for adding and editing, with validation
- `src/pages/Orders.tsx`: table, search, status filter and add/edit logic
- `src/App.tsx`: the `/orders` route now points to the Orders page

## Order fields
| Field | Meaning |
| --- | --- |
| `_id` | Unique id (MongoDB will create it, we fake it for now) |
| `customerId` | The `_id` of the customer who made the order |
| `furnitureType` | Type of furniture, e.g. Wardrobe |
| `quantity` | Number of pieces (whole number, 1 or more) |
| `totalAmount` | Total price in KES (greater than 0) |
| `specifications` | Extra details like size, colour, material (optional) |
| `status` | Pending, In Production, Completed, Delivered or Cancelled |
| `createdAt` | Date the order was made |

## How it works
`Orders.tsx` keeps the orders in state (`useState`). An order only stores the
`customerId`, so the page looks up the customer's name from the customer list
to show it in the table. The search and the status filter work together:
an order shows only if it matches both. The same form is used for adding and
editing. The customer dropdown is filled from the customer list.

## Validation rules
- Customer: must be chosen
- Furniture type: must be chosen
- Quantity: whole number of 1 or more
- Total amount: number greater than 0

## How it was tested
Tested manually in the browser at `localhost:5173/orders`.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check order list display | TC01: Check the list shows on opening the page | Frontend is running with `npm run dev` | 1. Open `localhost:5173`<br>2. Click Orders in the sidebar | None | Table shows 3 mock orders with customer names | Table showed 3 orders with the names Mary, John and Faith | Pass |
| Check search | TC02: Search by customer name | Orders page is open | 1. Click the search box<br>2. Type the name | `mary` | Only Mary's order is shown | Only Mary's Wardrobe order was shown | Pass |
| Check search | TC03: Search by furniture type | Orders page is open | 1. Click the search box<br>2. Type the furniture | `sofa` | Only the Sofa order is shown | Only the Sofa order was shown | Pass |
| Check search | TC04: Search with no match | Orders page is open | 1. Click the search box<br>2. Type text that matches nothing | `zzz` | "No orders found." message shows | Message "No orders found." was shown | Pass |
| Check status filter | TC05: Filter by status | Orders page is open | 1. Open the status dropdown<br>2. Choose In Production | In Production | Only the Sofa order is shown | Only the Sofa order was shown | Pass |
| Check status filter | TC06: Reset the filter | Filter is set to In Production | 1. Choose All statuses | All statuses | All 3 orders show again | All 3 orders were shown again | Pass |
| Check add form validation | TC07: Save an empty form | Orders page is open | 1. Click + Add Order<br>2. Clear the amount if filled<br>3. Click Save | Customer and type not chosen | Errors show for customer, furniture type and amount, nothing is saved | Errors showed for customer, furniture type and amount, nothing was saved | Pass |
| Check add form validation | TC08: Enter quantity 0 | Add form is open | 1. Fill the other inputs<br>2. Type the quantity<br>3. Click Save | Quantity: `0` | "Quantity must be a whole number of 1 or more" shows | The quantity error was shown and nothing was saved | Pass |
| Check add form validation | TC09: Enter a decimal quantity | Add form is open | 1. Fill the other inputs<br>2. Type the quantity<br>3. Click Save | Quantity: `1.5` | Quantity error shows | The quantity error was shown and nothing was saved | Pass |
| Check add form validation | TC10: Enter an invalid amount | Add form is open | 1. Fill the other inputs<br>2. Type the amount<br>3. Click Save | Amount: `abc` | "Amount must be a number greater than 0" shows | The amount error was shown and nothing was saved | Pass |
| Check add order | TC11: Add an order with valid details | Add form is open | 1. Fill the inputs<br>2. Click Save | Customer: Mary Wanjiku<br>Type: Bed<br>Quantity: `2`<br>Amount: `60000` | Order appears in the table with today's date, amount shows as 60,000, form closes | New Bed order appeared with today's date, amount showed as 60,000 and the form closed | Pass |
| Check edit order | TC12: Change an order's status | Orders page is open | 1. Click Edit on the Wardrobe order<br>2. Change status to In Production<br>3. Click Save | Status: In Production | Table shows the new status | The Wardrobe order now shows In Production | Pass |
| Check cancel | TC13: Cancel the form | Add or edit form is open | 1. Type something in an input<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed and the table did not change | Pass |

## Known issues / to do
- Data resets to the 3 mock orders when the page is refreshed or when the user
  leaves the page and returns. This will be solved when the list comes from
  the backend API.
- The customer dropdown uses the original mock customers, so customers added on
  the Customers page do not appear here until we use the real backend.
- Replace the mock data with real API calls once the backend is ready.
- Confirm the field names with Jose (backend developer).
- Status can be edited freely. Rules about which status can follow which
  (for example a Delivered order cannot go back to Pending) can be added later.