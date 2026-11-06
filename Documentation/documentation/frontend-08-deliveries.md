# Frontend Feature 08: Deliveries

## What it does
Shows the deliveries of the workshop. The user can schedule a delivery for an
order, move it from Pending to In Transit to Delivered, mark it Failed through
Edit, search, and filter by status. A delivery whose date has passed and is
not finished is marked Overdue. It uses mock data for now.

## Files
- `src/types/delivery.ts`: the Delivery type, the statuses and the next-status function
- `src/data/mockDeliveries.ts`: fake deliveries used for testing
- `src/components/DeliveryForm.tsx`: form for scheduling and editing, with validation
- `src/pages/Deliveries.tsx`: table, search, status filter and status buttons
- `src/App.tsx`: the `/deliveries` route now points to the Deliveries page

## Delivery fields
These names are the same as in the backend model `Delivery.ts` (Jose).
| Field | Meaning |
| --- | --- |
| `_id` | Unique id (MongoDB creates it, we fake it for now) |
| `order` | The `_id` of the order being delivered |
| `deliveryAddress` | Where to deliver (required) |
| `deliveryDate` | Planned day (required, not in the past for a new delivery) |
| `deliveryStatus` | Pending, In Transit, Delivered or Failed |
| `notes` | Extra instructions (optional) |

## How it works
`Deliveries.tsx` keeps the deliveries in state (`useState`). A delivery only
stores the order id, so the page finds the order and its customer to show text
like "Mary Wanjiku - Wardrobe (x1)". When an order is chosen in the form, the
address box is filled with the customer's address if it is still empty. The
status button moves a delivery one step forward (Pending to In Transit to
Delivered) and is disabled when there is no next step, or while the same
delivery is open in the edit form. The order dropdown only lists orders that
have no delivery yet and are not Cancelled or Delivered.

## Validation rules
- Order: must be chosen (when scheduling)
- Delivery address: required
- Delivery date: required, and not in the past for a new delivery

## How it was tested
Tested manually in the browser at `localhost:5173/deliveries`.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check delivery list display | TC01: Check the list shows on opening the page | Frontend is running with `npm run dev` | 1. Open `localhost:5173`<br>2. Click Deliveries in the sidebar | None | Table shows 2 deliveries: Faith's Dining Table (In Transit) and John's Sofa (Pending) | Table showed the 2 deliveries | Pass |
| Check overdue label | TC02: Overdue label shows for a late delivery | Deliveries page is open | 1. Look at the Dining Table row | None | A red "Overdue" label shows next to 2026-11-04 | The red Overdue label was shown | Pass |
| Check search | TC03: Search by order text | Deliveries page is open | 1. Click the search box<br>2. Type the furniture | `sofa` | Only the Sofa delivery is shown | Only the Sofa delivery was shown | Pass |
| Check search | TC04: Search by address | Deliveries page is open | 1. Click the search box<br>2. Type part of an address | `nakuru` | Only the Dining Table delivery is shown | Only the Dining Table delivery was shown | Pass |
| Check search | TC05: Search with no match | Deliveries page is open | 1. Click the search box<br>2. Type text that matches nothing | `zzz` | "No deliveries found." shows | Message was shown | Pass |
| Check status filter | TC06: Filter by status | Deliveries page is open | 1. Open the status dropdown<br>2. Choose Pending | Pending | Only the Sofa delivery is shown | Only the Sofa delivery was shown | Pass |
| Check status filter | TC07: Reset the filter | Filter is set to Pending | 1. Choose All statuses | All statuses | Both deliveries show again | Both were shown again | Pass |
| Check form validation | TC08: Save an empty form | Deliveries page is open | 1. Click + Schedule Delivery<br>2. Leave all inputs empty<br>3. Click Save | Empty inputs | Errors show for order, address and date, nothing is saved | All 3 errors showed, nothing was saved | Pass |
| Check order dropdown | TC09: Only orders without a delivery are listed | Schedule form is open | 1. Open the Order dropdown | None | Only "Mary Wanjiku - Wardrobe (x1)" is listed | Only the Wardrobe order was listed | Pass |
| Check address fill | TC10: Address fills from the customer | Schedule form is open | 1. Choose the Wardrobe order | Order: Wardrobe | Address box shows "Nairobi, Kilimani" | The address was filled in | Pass |
| Check form validation | TC11: Enter a past date | Schedule form is open | 1. Choose the order<br>2. Pick a date before today<br>3. Click Save | Date: yesterday | "Delivery date cannot be in the past" shows, nothing is saved | The date error was shown | Pass |
| Check schedule delivery | TC12: Schedule with valid details | Schedule form is open | 1. Choose the order<br>2. Pick a future date<br>3. Click Save | Order: Wardrobe<br>Date: any day after today | New row appears with status Pending; form closes | New Pending row appeared and the form closed | Pass |
| Check status button | TC13: Move Pending to In Transit | Deliveries page is open | 1. Click "Mark In Transit" on the Sofa row | None | Status changes to In Transit and the button becomes "Mark Delivered" | Status changed and the button text changed | Pass |
| Check status button | TC14: Move In Transit to Delivered | TC13 was done | 1. Click "Mark Delivered" on the Sofa row | None | Status changes to Delivered, the Overdue label is gone, the button is greyed out | Status became Delivered and the button was greyed out | Pass |
| Check edit delivery | TC15: Mark a delivery as Failed | Deliveries page is open | 1. Click Edit on the Dining Table row<br>2. Change status to Failed<br>3. Click Save | Status: Failed | Status shows Failed in red, the Overdue label is gone, the status button is greyed out | Status showed Failed and the button was greyed out | Pass |
| Check status button | TC16: Status button is disabled while editing | Deliveries page is open | 1. Click Edit on the Sofa row<br>2. Look at the Sofa row button | None | The button is greyed out until the form is saved or cancelled | The button was greyed out | Pass |
| Check cancel | TC17: Cancel the form | Form is open | 1. Type something<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed, no changes | Pass |

## Known issues / to do
- Data resets to the 2 mock deliveries on refresh or when leaving the page.
  Solved when the list comes from the backend API.
- Marking a delivery Delivered does not yet change the order's status. The pages
  will be connected when the backend is used.
- Orders and customers come from the original mock lists, so ones added on other
  pages do not appear here.
- Jose's backend does not restrict which orders can be delivered. The frontend
  hides Cancelled and Delivered orders only.
- Delivery staff cannot yet be assigned (no such field in the backend model).
- `crypto.randomUUID()` only works on `localhost` or HTTPS.
- The mock orders use a different shape from the real backend orders. This is
  handled when the API is connected.