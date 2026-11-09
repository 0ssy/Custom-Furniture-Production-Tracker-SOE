# Frontend Feature 14: Deliveries Connected to the Backend

## What it does
Schedules deliveries for real orders, moves them Pending, In Transit, Delivered, and lets the
user mark one Failed through Edit. An Overdue label shows when the date has passed and the
delivery is not finished. When a delivery becomes Delivered, its order becomes Delivered too.
Replaces `frontend-08-deliveries.md`.

## Files
- `src/types/delivery.ts`, `src/components/DeliveryForm.tsx`, `src/pages/Deliveries.tsx`
- `src/services/orderStatus.ts` (changes an order's status)

## Backend endpoints used
| Action | Endpoint |
| --- | --- |
| List | `GET /api/deliveries`, `GET /api/orders` |
| Schedule | `POST /api/deliveries` with `order`, `deliveryAddress`, `deliveryDate`, `notes` |
| Update | `PUT /api/deliveries/:id` |
| Order becomes Delivered | `PUT /api/orders/:id` with `orderStatus` |
| Delete (Admin only) | `DELETE /api/deliveries/:id` |

## Validation rules
- Order: must be chosen (new delivery)
- Address: at least 3 characters (filled from the customer's address)
- Date: required, not in the past for a new delivery

## How it was tested
Tested manually at `localhost:5173/deliveries`, logged in, backend running, with orders for Mary and John.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check delivery list | TC01: Page loads from the database | Logged in | 1. Click Deliveries | None | "No deliveries found." or the saved deliveries | The page loaded | Pass |
| Check form validation | TC02: Save an empty form | Page open | 1. Click + Schedule Delivery<br>2. Click Save | Empty inputs | Errors show for order, address and date | All errors showed | Pass |
| Check address fill | TC03: Address fills from the customer | Form open | 1. Choose Mary's order | Mary's order | The address box shows Mary's address | The address was filled | Pass |
| Check form validation | TC04: Past date | Form open | 1. Choose an order<br>2. Pick yesterday<br>3. Save | Date: yesterday | "Delivery date cannot be in the past" shows | The error was shown | Pass |
| Check schedule delivery | TC05: Schedule with valid details | Form open | 1. Choose an order<br>2. Pick a future date<br>3. Save | Mary's order, a week from today | New row with status Pending; stays after F5 | The row appeared and stayed | Pass |
| Check order dropdown | TC06: Ordered items already scheduled are hidden | TC05 done | 1. Open + Schedule Delivery<br>2. Open the Order dropdown | None | Mary's order is not listed | It was not listed | Pass |
| Check status button | TC07: Pending to In Transit | A Pending delivery exists | 1. Click Mark In Transit | None | Status In Transit; button becomes Mark Delivered | The status changed | Pass |
| Check status link | TC08: In Transit to Delivered | TC07 done | 1. Click Mark Delivered<br>2. Open Orders | None | Delivery is Delivered with the button greyed; the order shows Delivered | Both showed Delivered | Pass |
| Check overdue | TC09: Overdue label | A Pending delivery exists | 1. Click Edit<br>2. Change the date to an earlier day<br>3. Save | Date: an earlier day | A red Overdue label shows | The label was shown | Pass |
| Check edit | TC10: Mark Failed | A delivery exists | 1. Click Edit<br>2. Status Failed<br>3. Save | Status: Failed | Status Failed in red; button greyed | The status showed Failed | Pass |
| Check search and filter | TC11: Search and filter | Deliveries exist | 1. Type part of an address<br>2. Choose a status | Any | Only matching rows show | The list was filtered | Pass |
| Check roles | TC12: Delete is Admin only | Staff, then Admin | 1. Look at Action as Staff<br>2. Delete as Admin | None | Staff sees no Delete; Admin can delete | Behaved as expected | Pass |
| Check cancel | TC13: Cancel the form | Form open | 1. Type something<br>2. Click Cancel | Any | Form closes | The form closed | Pass |

## Known issues / to do
- Delivery staff cannot be assigned, because the backend has no field for it.
- If the order cannot be updated after Delivered, a message tells the user.
- Orders already Delivered or Cancelled cannot get a new delivery.