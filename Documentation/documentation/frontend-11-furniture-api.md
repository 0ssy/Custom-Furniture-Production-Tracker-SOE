# Frontend Feature 11: Furniture Connected to the Backend

## What it does
The Furniture page now reads and saves the furniture catalogue in the real
database through Jose's API. The user can search by name, filter by category,
add an item, edit an item and mark it available or not. Admins can also delete.
This replaces the mock version described in `frontend-04-furniture.md`.

## What changed from the mock version
| Before (mock) | Now (backend) |
| --- | --- |
| `price` | `basePrice` |
| `heightCm`, `widthCm`, `depthCm` | `dimensions` with `length`, `width`, `height` |
| `material`, `colour`, `design` | not stored by the backend, removed |
| optional design notes | `description` is required, at least 3 characters |
| none | `isAvailable` (Yes/No) |
| Wardrobe, Dining Table and others | Chair, Table, Bed, Sofa, Cabinet, Other |
| data lost on refresh | data saved in MongoDB |

## Files
- `src/services/list.ts`: helper that finds the list in the backend answer
- `src/types/furniture.ts`: the new `ApiFurniture` type and the six categories
- `src/components/FurnitureForm.tsx`: form for adding and editing, with validation
- `src/pages/Furniture.tsx`: table, search, category filter, add, edit and Admin-only delete

## Backend endpoints used
| Action | Endpoint |
| --- | --- |
| List | `GET /api/furniture` |
| Add | `POST /api/furniture` |
| Edit | `PUT /api/furniture/:id` |
| Delete (Admin only) | `DELETE /api/furniture/:id` |

## Validation rules
- Name: at least 2 characters
- Category: must be chosen
- Description: at least 3 characters
- Base price, length, width and height: a number above 0

## How it was tested
Tested manually at `localhost:5173/furniture`, logged in, backend running.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check furniture list | TC01: List loads from the database | Logged in, backend running | 1. Click Furniture in the sidebar | None | "Loading furniture..." shows briefly, then the saved items appear (or "No furniture found." if none yet) | The list loaded from the database | Pass |
| Check form validation | TC02: Save an empty form | Furniture page is open | 1. Click + Add Furniture<br>2. Click Save | Empty inputs | Errors show for name, category, description, price, length, width and height; nothing is sent | All 7 errors showed | Pass |
| Check form validation | TC03: Enter a negative length | Add form is open | 1. Fill the other inputs correctly<br>2. Type the length<br>3. Click Save | Length: `-5` | "Length must be a number above 0" shows | Error was shown, nothing was sent | Pass |
| Check form validation | TC04: Enter a huge price | Add form is open | 1. Fill the other inputs correctly<br>2. Type the price<br>3. Click Save | Price: `1e999` | "Price must be a number above 0" shows | Error was shown | Pass |
| Check add furniture | TC05: Add an item with valid details | Add form is open | 1. Fill the inputs<br>2. Click Save | Name: `Queen Bed`<br>Category: Bed<br>Description: `Pine bed with carved headboard`<br>Price: `32000`<br>L/W/H: `200`, `160`, `110` | Item appears in the table with price 32,000 and Available "Yes", and stays after F5 | Item appeared and stayed after refresh | Pass |
| Check add furniture | TC06: Add a second and third item | TC05 was done | 1. Add the items below | `Three-Seater Sofa`, Sofa, `Grey fabric sofa`, `52000`, `90`, `210`, `90`<br>`Office Chair`, Chair, `Black office chair`, `12000`, `100`, `60`, `60` | Both appear in the table | Both items appeared | Pass |
| Check search | TC07: Search by name | 3 items exist | 1. Type in the search box | `bed` | Only Queen Bed shows | Only Queen Bed was shown | Pass |
| Check search | TC08: Search with no match | Furniture page is open | 1. Type in the search box | `zzz` | "No furniture found." shows | Message was shown | Pass |
| Check category filter | TC09: Filter by category | 3 items exist | 1. Open the category dropdown<br>2. Choose Sofa | Sofa | Only the sofa shows; All categories shows all 3 again | The filter worked both ways | Pass |
| Check edit furniture | TC10: Edit the price | Items exist | 1. Click Edit on Queen Bed<br>2. Change the price<br>3. Click Save | Price: `35000` | Table shows 35,000 and it stays after F5 | Price updated and saved | Pass |
| Check availability | TC11: Mark an item unavailable | Items exist | 1. Click Edit on Office Chair<br>2. Untick "Available for orders"<br>3. Click Save | Checkbox unticked | Available column shows a red "No" | The column showed "No" | Pass |
| Check cancel | TC12: Cancel the form | Form is open | 1. Type something<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed | Pass |
| Check roles | TC13: Staff does not see Delete | Logged in as Staff | 1. Look at the Action column | None | Only Edit is shown, no Delete button | Only Edit was shown | Pass |
| Check roles | TC14: Admin can delete | Logged in as Admin, an item exists | 1. Click Delete on Office Chair<br>2. Confirm | Admin account | The item disappears and stays gone after F5 | The item was deleted | Pass |

## Known issues / to do
- The backend does not say which unit the dimensions use. We label them as cm.
- `material`, `colour` and `design` from the mock version are not stored by the
  backend, so they were removed. They could be added to the backend later.
- Orders, Production, Payments and Deliveries still use mock data. The Orders
  page will use this real furniture list when it is connected.
- The old mock files (`mockFurniture.ts` and the `Furniture` type) are no longer
  used by the page and can be deleted.
- The list helper accepts a plain array or any named list from the backend.
- Delete is hidden for Staff in the interface, but the backend is what really
  enforces it.