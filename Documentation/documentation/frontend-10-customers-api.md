# Frontend Feature 10: Customers Connected to the Backend

## What it does
The Customers page now reads and saves customers in the real database through
Jose's API, instead of mock data.

## What changed from Feature 02
| Before (mock) | Now (backend) |
| --- | --- |
| `name` | `fullName` |
| email optional | email required and unique |
| address optional | address required, at least 3 characters |
| data lost on refresh | data saved in MongoDB |
| `createdAt` was a date | `createdAt` is a date with time, we show the first 10 characters |

## Files
- `src/types/customer.ts`: new `ApiCustomer` type (the old `Customer` stays for pages still on mock data)
- `src/components/CustomerForm.tsx`: new field names, email and address required, Saving state
- `src/pages/Customers.tsx`: loads with GET, adds with POST, edits with PUT, shows loading and error messages

## Backend endpoints used
| Action | Endpoint |
| --- | --- |
| List | `GET /api/customers` |
| Add | `POST /api/customers` |
| Edit | `PUT /api/customers/:id` |

## How it was tested
Tested manually at `localhost:5173/customers`, logged in, backend running.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check customer list | TC01: List loads from the database | Logged in, backend running | 1. Click Customers | None | "Loading customers..." shows briefly, then the saved customers appear | The database customers were shown | Pass |
| Check search | TC02: Search by name | Customers exist | 1. Type part of a name in the search box | A name from the list | Only matching customers show | Only matching customers were shown | Pass |
| Check form validation | TC03: Save an empty form | Customers page is open | 1. Click + Add Customer<br>2. Click Save | Empty inputs | Errors show for name, phone, email and address, nothing is sent | All 4 errors showed | Pass |
| Check form validation | TC04: Enter an invalid email | Add form is open | 1. Fill the other inputs correctly<br>2. Type the email<br>3. Click Save | Email: `a@b..com` | "A valid email is required" shows | Error was shown | Pass |
| Check add customer | TC05: Add a valid customer | Add form is open | 1. Fill the inputs<br>2. Click Save | Name: `Mary Wanjiku`<br>Phone: `0712345678`<br>Email: `mary@test.com`<br>Address: `Nairobi, Kilimani` | Customer appears in the table and stays after pressing F5 | Customer appeared and stayed after refresh | Pass |
| Check duplicate email | TC06: Add a customer with an email already used | TC05 was done | 1. Add another customer with `mary@test.com` | Email: `mary@test.com` | A red message from the backend shows and the form stays open | The backend error was shown | Pass |
| Check edit customer | TC07: Edit a customer | Customers exist | 1. Click Edit<br>2. Change the address<br>3. Click Save | Address: `Nairobi, Karen` | Table shows the new address and it stays after F5 | Address was updated and saved | Pass |
| Check cancel | TC08: Cancel the form | Form is open | 1. Type something<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed | Pass |

## Known issues / to do
- There is no Delete button. The backend allows delete only for Admin, so it
  will be added with the role-based features.
- Orders, Production, Payments and Deliveries still use mock customers, so a
  customer added here does not appear on those pages until they are connected.
- The list code accepts either an array or `{ customers: [...] }` from the backend.
- The other pages will be connected one by one.
- The form asks for exactly 10 digits for the phone number, which is stricter
  than the backend (7 or more characters). This is a deliberate rule for local
  numbers, and international numbers with a + are not accepted yet.