# Frontend Feature 02: Customer Management

## What it does
Shows a list of customers and lets the user search by name or phone,
add a new customer and edit an existing one. It uses mock data for now
because the backend is not finished yet.

## Files
- `src/types/customer.ts`: the Customer type (field names)
- `src/data/mockCustomers.ts`: fake customers used for testing
- `src/components/CustomerForm.tsx`: form for adding and editing, with validation
- `src/pages/Customers.tsx`: table, search box and the add/edit logic
- `src/App.tsx`: the `/customers` route now points to the Customers page

## Customer fields
| Field | Meaning |
| --- | --- |
| `_id` | Unique id (MongoDB will create it, we fake it for now) |
| `name` | Customer name (required) |
| `phone` | Phone number (required, 10 digits) |
| `email` | Email (optional) |
| `address` | Address (optional) |
| `createdAt` | Date the customer was registered |

## How it works
`Customers.tsx` keeps the list of customers in state (`useState`).
The search box filters that list by name or phone as the user types.
The same form component is used for adding and editing. If a customer is
passed to the form it edits that customer, otherwise it adds a new one.
The form checks the inputs before saving and shows an error message
under any input that is wrong.

New customers get a unique fake id from `crypto.randomUUID()` and today's
date in the computer's local timezone (`toLocaleDateString('en-CA')`).
The real backend will create the `_id` later.

## Validation rules
- Name: required
- Phone: required, exactly 10 digits
- Email: optional, but if entered it must have exactly one @, a dot after it,
  and no two dots in a row

## How it was tested
Tested manually in the browser with `npm run dev` at `localhost:5173/customers`.

| # | Test | Expected | Result |
| --- | --- | --- | --- |
| 1 | Open the Customers page | Table shows 3 mock customers | Passed. Mary, John and Faith were shown. |
| 2 | Search `mary` | Only Mary Wanjiku shows | Passed |
| 3 | Search `0723` | Only John Otieno shows | Passed |
| 4 | Search `zzz` | "No customers found." message | Passed |
| 5 | Click Add Customer and Save with empty fields | "Name is required" and "Phone must be 10 digits" show | Passed. Both errors appeared and nothing was saved. |
| 6 | Enter phone `123` | "Phone must be 10 digits" shows | Passed |
| 7 | Enter email `abc` | "Email is not valid" shows | Passed |
| 8 | Add a valid customer (name and 10-digit phone) | New customer appears in the table | Passed |
| 9 | Click Edit on a customer, change the name, Save | Table shows the updated name | Passed |
| 10 | Click Cancel on the form | Form closes and nothing changes | Passed |
| 11 | Add a customer and check the registration date | Today's local date shows | Passed |
| 12 | Email `a@b@c.com` | "Email is not valid" shows | Passed |
| 13 | Email `a@b..com` | "Email is not valid" shows | Passed |
| 14 | Email `mary@example.com` | Accepted, customer saves | Passed |

## Known issues / to do
- Data resets to the 3 mock customers when the page is refreshed, because
  nothing is saved anywhere yet.
- Customers added or edited are also lost when the user leaves the page and
  returns, because the list is reset from mock data each time. This will be
  solved when the list comes from the backend API.
- Replace the mock data with real API calls once the backend is ready.
- Confirm the field names with Jose (backend developer).
- No delete button yet (not in the requirements, can add if needed).

## Fixes made after code review
- Replaced `Date.now()` with `crypto.randomUUID()` so two customers can never
  get the same id.
- Registration date now uses local time instead of UTC, so it is correct in
  Kenya between midnight and 3 AM.
- Email validation now rejects a second @ and consecutive dots.