# Frontend Feature 12: Orders Connected to the Backend

## What it does
The Orders page now reads and saves orders in the real database through Jose's
API. An order belongs to a customer and has one or more items (furniture,
quantity and unit price). The user can search, filter by status, add an order
and edit its status and expected delivery date. Admins can delete.
This replaces the mock version in `frontend-03-orders.md`.

## What changed from the mock version
| Before (mock) | Now (backend) |
| --- | --- |
| one furniture type per order | `items` list, each with furniture, quantity, unit price |
| `customerId` | `customer` (the backend sends the whole customer) |
| `totalAmount` typed in | calculated by the backend from the items |
| `status` | `orderStatus`, with the new status Confirmed |
| `specifications` | not stored by the backend, removed |
| none | `expectedDeliveryDate` is required |
| `createdAt` | `orderDate` |

## Files
- `src/types/order.ts`: new `ApiOrder` type and the six statuses (old `Order` type kept for mock pages)
- `src/components/OrderForm.tsx`: add form with item rows and live total; edit form for status and date
- `src/pages/Orders.tsx`: loads orders, customers and furniture; search, filter, add, edit, Admin delete

## Backend endpoints used
| Action | Endpoint |
| --- | --- |
| List orders | `GET /api/orders` (answer is `{ count, orders }`) |
| List customers and furniture | `GET /api/customers`, `GET /api/furniture` |
| Add | `POST /api/orders` with `customer`, `items`, `expectedDeliveryDate` |
| Edit | `PUT /api/orders/:id` with `orderStatus`, `expectedDeliveryDate` |
| Delete (Admin only) | `DELETE /api/orders/:id` |

## How it works
`Orders.tsx` loads orders, customers and furniture together. Each item row in
the add form fills its unit price from the furniture's base price, which the
user can change. The form shows a live total, but the backend works out the
real `totalAmount` and sets the new order's status to Pending. Only furniture
marked available is listed. When editing, the customer and items are read-only,
and only the status and the expected delivery date are sent.

## Validation rules
- Customer: must be chosen
- Each item: furniture chosen, quantity a whole number of 1 or more, unit price above 0
- Expected delivery date: required, after today for a new order, and after the
  order date when editing (the backend rejects a date that is not in the future)

## How it was tested
Tested manually at `localhost:5173/orders`, logged in, backend running, with
customers (Mary, John, Faith) and furniture (Queen Bed, Three-Seater Sofa,
Office Chair) already added.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check order list | TC01: List loads from the database | Logged in, backend running | 1. Click Orders in the sidebar | None | "Loading orders..." shows briefly, then "No orders found." or the saved orders | The list loaded | Pass |
| Check form validation | TC02: Save an empty form | Orders page is open | 1. Click + Add Order<br>2. Click Save | Nothing chosen | Errors show for customer, item row and delivery date; nothing is sent | All errors showed | Pass |
| Check form validation | TC03: Quantity 0 | Add form is open | 1. Choose customer, furniture and date<br>2. Type the quantity<br>3. Click Save | Quantity: `0` | "Quantity must be a whole number of 1 or more" shows | Error was shown | Pass |
| Check form validation | TC04: Decimal quantity | Add form is open | 1. Same as TC03 | Quantity: `1.5` | The same quantity error shows | Error was shown | Pass |
| Check form validation | TC05: Delivery date today | Add form is open | 1. Fill everything correctly<br>2. Pick today's date<br>3. Click Save | Date: today | "Delivery date must be after today" shows | Error was shown | Pass |
| Check price fill | TC06: Unit price fills from the furniture | Add form is open | 1. Choose Queen Bed in the first row | Queen Bed | Unit price shows 32000 and Total shows 32,000 | Price and total were filled | Pass |
| Check add order | TC07: Add an order with one item | Add form is open | 1. Choose customer<br>2. Choose furniture<br>3. Set a future date<br>4. Click Save | Customer: Mary Wanjiku<br>Item: Queen Bed x1<br>Date: a week from today | Order appears with total 32,000, status Pending, and stays after F5 | Order appeared and stayed after refresh | Pass |
| Check add order | TC08: Add an order with two items | Add form is open | 1. Choose customer<br>2. Choose first item<br>3. Click "+ Add another item"<br>4. Choose second item<br>5. Save | John Otieno<br>Three-Seater Sofa x1 (52000)<br>Office Chair x2 (12000) | Total shows 76,000, both items in the Items column | Total was 76,000 | Pass |
| Check remove row | TC09: Remove an item row | Add form has two rows | 1. Click X on the second row | None | The row disappears; with one row left the X is greyed out | Row was removed | Pass |
| Check search | TC10: Search by customer | Orders exist | 1. Type in the search box | `mary` | Only Mary's order shows | Only Mary's order was shown | Pass |
| Check search | TC11: Search by furniture | Orders exist | 1. Type in the search box | `chair` | Only the order with the chair shows | Only that order was shown | Pass |
| Check status filter | TC12: Filter by status | Orders exist | 1. Choose Pending in the filter | Pending | Only Pending orders show; All statuses shows all again | The filter worked | Pass |
| Check edit order | TC13: Change the status | Orders exist | 1. Click Edit<br>2. Set status to Confirmed<br>3. Click Save | Status: Confirmed | Table shows Confirmed and it stays after F5; customer and items were read-only in the form | Status was updated and saved | Pass |
| Check edit order | TC14: Delivery date not after order date | Edit form is open | 1. Set the date to the order date<br>2. Click Save | Date: order date | "Delivery date must be after the order date" shows | Error was shown | Pass |
| Check roles | TC15: Staff does not see Delete | Logged in as Staff | 1. Look at the Action column | None | Only Edit is shown | Only Edit was shown | Pass |
| Check roles | TC16: Admin can delete | Logged in as Admin | 1. Click Delete<br>2. Confirm | Admin account | The order disappears and stays gone after F5 | The order was deleted | Pass |
| Check cancel | TC17: Cancel the form | Form is open | 1. Type something<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed | Pass |

## Known issues / to do
- Only the status and expected delivery date can be changed when editing. The
  backend also allows changing items and customer, which can be added later.
- Furniture or customers that are deleted later show as "Deleted item" or
  "Unknown customer" in old orders.
- Furniture marked unavailable cannot be added to a new order.
- Payments, Production and Deliveries still use mock orders, so they do not
  show these real orders yet. They will be connected next.
- `specifications` from the mock version is not stored by the backend.
- The old mock files (`mockOrders.ts` and the old `Order` type) are still used
  by the three mock pages and will be deleted when those are connected.
- Changing an order's status does not start production or create a delivery.