# Frontend Feature 07: Payments

## What it does
Records customer payments and deposits for orders. The page shows each order's
total, the amount paid, the outstanding balance and the payment status
(Unpaid, Partial or Paid). Three summary cards show the total billed, total
received and total outstanding. A payment history table lists every payment.
It uses mock data for now because the backend is not finished yet.

## Files
- `src/utils/date.ts`: helper that gives today's date as YYYY-MM-DD
- `src/types/payment.ts`: the Payment type, the payment methods, the statuses and the status function
- `src/data/mockPayments.ts`: fake payments used for testing
- `src/components/PaymentForm.tsx`: form for recording a payment, with validation
- `src/pages/Payments.tsx`: summary cards, order balances, search, filter and history
- `src/App.tsx`: the `/payments` route now points to the Payments page

## Payment fields
| Field | Meaning |
| --- | --- |
| `_id` | Unique id (MongoDB will create it, we fake it for now) |
| `orderId` | The `_id` of the order being paid for |
| `amount` | Amount paid in KES (above 0, not more than the balance) |
| `method` | Cash, M-Pesa or Bank Transfer |
| `reference` | M-Pesa code or bank reference (required and unique for M-Pesa) |
| `paymentDate` | Day the money was received (not in the future) |

## How it works
`Payments.tsx` keeps the payments in state (`useState`). The amount paid for an
order is the sum of all its payments. The balance is the order total minus the
amount paid. The status is Unpaid when nothing is paid, Paid when the balance
is zero, and Partial in between. None of these three are typed in or stored,
they are worked out every time the page is drawn. The balance is kept exact for
all checks and rounded to 2 decimals only when shown on screen. Cancelled
orders are left out. The Record Payment button on a row opens the form with
that order already chosen, and is disabled when the balance is zero. Payments
cannot be edited or deleted, because changing a money record afterwards is bad
practice. An M-Pesa code that was already recorded is rejected, whether it is
typed in capital or small letters.

## Validation rules
- Order: must be chosen
- Amount: a number above 0, and not more than the balance of the order
- Reference: required when the method is M-Pesa, and must not be a code already recorded
- Payment date: required, and not in the future

## How it was tested
Tested manually in the browser at `localhost:5173/payments`.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check payments display | TC01: Check the cards and balances on opening the page | Frontend is running with `npm run dev` | 1. Open `localhost:5173`<br>2. Click Payments in the sidebar | None | Cards show Billed 173,000, Received 83,000 and Outstanding 90,000. Balances table shows 3 orders. History shows 3 payments | Cards and tables showed the expected numbers | Pass |
| Check payment status | TC02: Check the status of each order | Payments page is open | 1. Look at the Status column | None | Wardrobe is Unpaid (balance 45,000), Sofa is Partial (balance 45,000), Dining Table is Paid (balance 0) | The three statuses were shown correctly | Pass |
| Check search | TC03: Search by customer name | Payments page is open | 1. Click the search box<br>2. Type the name | `mary` | Only Mary's Wardrobe order is shown | Only the Wardrobe order was shown | Pass |
| Check search | TC04: Search with no match | Payments page is open | 1. Click the search box<br>2. Type text that matches nothing | `zzz` | "No orders found." message shows | Message was shown | Pass |
| Check status filter | TC05: Filter by status | Payments page is open | 1. Open the status dropdown<br>2. Choose Partial | Partial | Only the Sofa order is shown | Only the Sofa order was shown | Pass |
| Check status filter | TC06: Reset the filter | Filter is set to Partial | 1. Choose All statuses | All statuses | All 3 orders show again | All 3 orders were shown again | Pass |
| Check form validation | TC07: Save an empty form | Payments page is open | 1. Click + Record Payment<br>2. Leave the order and amount empty<br>3. Click Save Payment | Empty order and amount | Errors show for order and amount, nothing is saved | Both errors showed, nothing was saved | Pass |
| Check form validation | TC08: Enter an invalid amount | Form is open | 1. Choose an order<br>2. Type the amount<br>3. Click Save Payment | Order: Wardrobe<br>Amount: `abc` | "Amount must be a number greater than 0" shows | The amount error was shown, nothing was saved | Pass |
| Check form validation | TC09: Enter more than the balance | Form is open | 1. Choose the Wardrobe order<br>2. Type the amount<br>3. Click Save Payment | Amount: `50000` | "Amount cannot be more than the balance (45,000)" shows | The balance error was shown, nothing was saved | Pass |
| Check form validation | TC10: M-Pesa without a code | Form is open | 1. Choose an order<br>2. Type a valid amount<br>3. Choose M-Pesa<br>4. Leave the reference empty<br>5. Click Save Payment | Order: Wardrobe<br>Amount: `5000`<br>Method: M-Pesa | "Please enter the M-Pesa code" shows | The reference error was shown, nothing was saved | Pass |
| Check form validation | TC11: Enter a future date | Form is open | 1. Choose an order<br>2. Type a valid amount<br>3. Pick a date after today<br>4. Click Save Payment | Order: Wardrobe<br>Amount: `5000`<br>Date: tomorrow | "Payment date cannot be in the future" shows | The date error was shown, nothing was saved | Pass |
| Check order dropdown | TC12: Only orders with a balance are listed | Form is open | 1. Open the Order dropdown | None | Wardrobe and Sofa are listed. Dining Table is not, because it is fully paid | Only Wardrobe and Sofa were listed | Pass |
| Check pre-selected order | TC13: Record Payment on a row chooses that order | Payments page is open | 1. Click Record Payment on the Sofa row | None | The form opens with the Sofa order already chosen and "Balance: KES 45,000" shown | The Sofa was chosen and the balance was shown | Pass |
| Check disabled button | TC14: Record Payment is disabled on a paid order | Payments page is open | 1. Look at the Dining Table row | None | The Record Payment button is greyed out | The button was greyed out | Pass |
| Check record payment | TC15: Record a partial payment | Form is open | 1. Choose the Wardrobe order<br>2. Type the amount<br>3. Keep Cash<br>4. Click Save Payment | Order: Wardrobe<br>Amount: `20000`<br>Method: Cash | Wardrobe shows Paid 20,000, Balance 25,000, status Partial. A new row shows in history. Received becomes 103,000 and Outstanding 70,000 | The row, history and cards updated as expected | Pass |
| Check record payment | TC16: Pay the remaining balance | TC15 was done | 1. Click Record Payment on the Wardrobe row<br>2. Type the amount<br>3. Click Save Payment | Amount: `25000` | Wardrobe shows Balance 0 and status Paid, and its button is greyed out | Status changed to Paid and the button was greyed out | Pass |
| Check cancel | TC17: Cancel the form | Form is open | 1. Type something in an input<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed, no changes | Pass |
| Check form validation | TC18: Repeat an M-Pesa code | Form is open | 1. Choose the Wardrobe order<br>2. Type the amount<br>3. Choose M-Pesa<br>4. Type an existing code<br>5. Click Save Payment | Amount: `5000`<br>Reference: `SKL4F7G2QW` | "This M-Pesa code is already recorded" shows, nothing is saved | The duplicate code error was shown, nothing was saved | Pass |
| Check form validation | TC19: Repeat an M-Pesa code in small letters | Form is open | 1. Same steps as TC18<br>2. Type the code in small letters | Reference: `skl4f7g2qw` | The same duplicate error shows | The duplicate code error was shown, nothing was saved | Pass |

## Known issues / to do
- Data resets to the 3 mock payments when the page is refreshed or when the user
  leaves the page and returns. This will be solved when the list comes from the
  backend API.
- Payments are only recorded. The real M-Pesa Daraja API is not connected.
- Payments cannot be edited or deleted. If a mistake is made, the backend
  could add a reversal or an admin-only correction later.
- Balance and status are calculated in the frontend. They may move to the
  backend once Jose confirms.
- Orders and customers come from the original mock lists, so ones added on
  other pages do not appear here until we use the real backend.
- Cancelling an order on the Orders page does not hide it here, because each page
  has its own mock data. This is solved once all pages use the backend.
- Cancelled orders are hidden. If a customer paid a deposit before cancelling,
  the refund is not tracked.
- Payment history shows same-day payments in the order they were recorded, not
  newest first. A creation time from the backend can fix this.
- A payment form left open past midnight uses the date from when the page last
  drew. Very rare, and not handled.
- `crypto.randomUUID()` only works on `localhost` or HTTPS. This goes away when
  the backend creates the ids.
- Replace the mock data with real API calls once the backend is ready.
- Confirm the field names with Jose (backend developer).

## Fixes made after code review
- The same M-Pesa code can no longer be recorded twice (capital and small letters
  count as the same code).
- The balance is now kept exact for checks and rounded only when shown on screen,
  so a tiny amount owed can never be hidden.