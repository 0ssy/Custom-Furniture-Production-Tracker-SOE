# Frontend Feature 13: Payments Connected to the Backend

## What it does
Records customer payments against real orders. A new payment starts as Pending and
only counts toward the balance once it is marked Completed. The page shows each
order's total, paid, pending and balance, a payment status (Unpaid, Partial, Paid),
three summary cards and a payment history. Replaces `frontend-07-payments.md`.

## What changed from the mock version
| Before (mock) | Now (backend) |
| --- | --- |
| `method`: Cash, M-Pesa, Bank Transfer | `paymentMethod`: Cash, Bank Transfer, Card, Mobile Money |
| `reference` | `transactionReference` |
| `orderId` | `order` |
| no payment status | `paymentStatus`: Pending, Completed, Failed, Refunded |
| payment date typed in | `paymentDate` set by the backend |
| every payment counted | only Completed payments count |

## Files
- `src/types/payment.ts`, `src/components/PaymentForm.tsx`, `src/pages/Payments.tsx`
- `src/utils/money.ts`, `src/utils/order.ts`, `src/utils/paymentMath.ts` (shared helpers)

## Backend endpoints used
| Action | Endpoint |
| --- | --- |
| List payments and orders | `GET /api/payments`, `GET /api/orders` |
| Record | `POST /api/payments` with `order`, `amount`, `paymentMethod`, `transactionReference` |
| Change status | `PUT /api/payments/:id` with `paymentStatus` |
| Delete (Admin only) | `DELETE /api/payments/:id` |

## Validation rules
- Order: must be chosen
- Amount: at least 0.01 and not more than the open balance (total minus completed minus pending)
- Reference: required for Mobile Money, and must not already be used

## How it was tested
Tested manually at `localhost:5173/payments`, logged in, backend running, with an order of KES 32,000 for Mary Wanjiku.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check payments page | TC01: Page loads from the database | Logged in, orders exist | 1. Click Payments | None | Cards and the order table show; Mary's order is Unpaid with balance 32,000 | The data loaded and the order showed Unpaid | Pass |
| Check form validation | TC02: Save an empty form | Payments page is open | 1. Click + Record Payment<br>2. Click Save Payment | Empty inputs | Errors show for order and amount | Both errors showed | Pass |
| Check form validation | TC03: Amount above the balance | Form is open | 1. Choose Mary's order<br>2. Type the amount<br>3. Save | Amount: `40000` | "Amount cannot be more than the balance still open (32,000)" shows | The error was shown | Pass |
| Check form validation | TC04: Mobile Money without a code | Form is open | 1. Choose the order<br>2. Amount `5000`<br>3. Method Mobile Money<br>4. Save | Reference empty | "Please enter the M-Pesa / mobile money code" shows | The error was shown | Pass |
| Check record payment | TC05: Record a cash payment | Form is open | 1. Choose the order<br>2. Amount `10000`, Cash<br>3. Save | Amount: `10000` | A history row shows with status Pending; Paid stays 0 and Pending shows 10,000 | The row showed as Pending and Paid stayed 0 | Pass |
| Check status change | TC06: Mark a payment Completed | TC05 done | 1. Click Mark Completed on the row | None | Status becomes Completed; Paid 10,000, balance 22,000, order status Partial | The values updated | Pass |
| Check record payment | TC07: Record a mobile money payment | Form is open | 1. Choose the order<br>2. Amount `5000`, Mobile Money, reference `SKL4F7G2QW`<br>3. Save | Reference: `SKL4F7G2QW` | New Pending row with the reference | The row appeared | Pass |
| Check duplicate reference | TC08: Reuse the same reference | TC07 done | 1. Record another payment with the same reference in small letters | `skl4f7g2qw` | "This reference is already recorded" shows | The error was shown | Pass |
| Check status change | TC09: Mark a payment Failed | A Pending payment exists | 1. Click Mark Failed | None | Status Failed, and the amount is not counted | The status changed and balance did not change | Pass |
| Check full payment | TC10: Pay the whole balance | Order has an open balance | 1. Record the remaining open amount in cash<br>2. Mark it Completed | Remaining amount | Status Paid, balance 0, Record Payment button greyed out | Status became Paid and the button was greyed out | Pass |
| Check search and filter | TC11: Search and filter orders | Orders exist | 1. Type `mary`<br>2. Choose Paid in the filter | `mary`, Paid | Only matching orders show | The list was filtered | Pass |
| Check roles | TC12: Staff does not see Delete | Logged in as Staff | 1. Look at the history Action column | None | No Delete button | No Delete was shown | Pass |
| Check roles | TC13: Admin can delete | Logged in as Admin | 1. Click Delete<br>2. Confirm | Admin account | The payment disappears and stays gone after F5 | The payment was deleted | Pass |
| Check cancel | TC14: Cancel the form | Form is open | 1. Type something<br>2. Click Cancel | Any text | Form closes | The form closed | Pass |

## Known issues / to do
- The backend ignores the payment date on create, so it is always the day the payment was recorded.
- The backend does not stop duplicate references or overpayment. The frontend does.
- The frontend works out balance and status. The backend does not store them.
- The real M-Pesa Daraja API is not connected. Payments are only recorded.
- Cancelled orders are hidden from this page.