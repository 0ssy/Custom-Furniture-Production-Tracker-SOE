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

## Validation rules
- Name: required
- Phone: required, exactly 10 digits
- Email: optional, but must be a valid format if entered

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
| 7 | Enter email `abc` | "Email is not valid" shows |