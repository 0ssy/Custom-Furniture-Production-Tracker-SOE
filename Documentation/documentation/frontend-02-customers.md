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
Tested manually in the browser at `localhost:5173/customers`.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check customer list display | TC01: Check the list shows on opening the page | Frontend is running with `npm run dev` | 1. Open `localhost:5173`<br>2. Click Customers in the sidebar | None | Table shows 3 mock customers | Mary, John and Faith were shown | Pass |
| Check search | TC02: Search by name | Customers page is open | 1. Click the search box<br>2. Type the name | `mary` | Only Mary Wanjiku is shown | Only Mary was shown | Pass |
| Check search | TC03: Search by phone | Customers page is open | 1. Click the search box<br>2. Type the phone digits | `0723` | Only John Otieno is shown | Only John was shown | Pass |
| Check search | TC04: Search with no match | Customers page is open | 1. Click the search box<br>2. Type text that matches nobody | `zzz` | "No customers found." message shows | Message was shown | Pass |
| Check add form validation | TC05: Save an empty form | Customers page is open | 1. Click + Add Customer<br>2. Leave all inputs empty<br>3. Click Save | Empty inputs | "Name is required" and "Phone must be 10 digits" show, nothing is saved | Both errors showed, nothing was saved | Pass |
| Check add form validation | TC06: Enter a short phone number | Add form is open | 1. Type a name<br>2. Type a short phone<br>3. Click Save | Name: `Test`<br>Phone: `123` | "Phone must be 10 digits" shows | Error was shown | Pass |
| Check add form validation | TC07: Enter an email with no @ | Add form is open | 1. Fill name and valid phone<br>2. Type the email<br>3. Click Save | Email: `abc` | "Email is not valid" shows | Error was shown | Pass |
| Check add form validation | TC08: Enter an email with two @ | Add form is open | 1. Fill name and valid phone<br>2. Type the email<br>3. Click Save | Email: `a@b@c.com` | "Email is not valid" shows | Error was shown | Pass |
| Check add form validation | TC09: Enter an email with two dots in a row | Add form is open | 1. Fill name and valid phone<br>2. Type the email<br>3. Click Save | Email: `a@b..com` | "Email is not valid" shows | Error was shown | Pass |
| Check add customer | TC10: Add a customer with valid details | Add form is open | 1. Fill the inputs<br>2. Click Save | Name: `Peter Kamau`<br>Phone: `0745678901`<br>Email: `mary@example.com` | Customer appears in the table, form closes | Customer was added to the table | Pass |
| Check add customer | TC11: Check the registration date of a new customer | Customer from TC10 was added | 1. Look at the Registered column of the new customer | None | Today's local date is shown | Today's date was shown | Pass |
| Check edit customer | TC12: Edit a customer's name | Customers page is open | 1. Click Edit on Mary<br>2. Change the name<br>3. Click Save | Name: `Mary W. Njeri` | Table shows the updated name | Name was updated in the table | Pass |
| Check cancel | TC13: Cancel the form | Add or edit form is open | 1. Type something in an input<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed, no changes | Pass |

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