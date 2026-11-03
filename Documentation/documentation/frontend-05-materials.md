# Frontend Feature 05: Materials Inventory

## What it does
Shows the materials kept in the workshop store with the quantity in stock.
The user can search by name, show only low-stock items, add a new material
and edit an existing one. A material is "Low stock" when its quantity is
equal to or below its reorder level. It uses mock data for now.

## Files
- `src/types/material.ts`: the Material type and the list of units
- `src/data/mockMaterials.ts`: fake materials used for testing
- `src/components/MaterialForm.tsx`: form for adding and editing, with validation
- `src/pages/Materials.tsx`: table, search, low-stock filter and add/edit logic
- `src/App.tsx`: the `/materials` route now points to the Materials page

## Material fields
| Field | Meaning |
| --- | --- |
| `_id` | Unique id (MongoDB will create it, we fake it for now) |
| `name` | Name of the material, e.g. Mahogany Timber (required) |
| `unit` | planks, sheets, pieces, metres, litres, kg or pieces |
| `quantityInStock` | How much is in the store (0 or more) |
| `reorderLevel` | Stock at or below this is "Low stock" (0 or more) |
| `unitCost` | Cost of one unit in KES (above 0) |
| `supplier` | Who it is bought from (optional) |

## How it works
`Materials.tsx` keeps the materials in state. The function `isLow` returns
true when `quantityInStock <= reorderLevel`. It is used to show the red "Low
stock" label, to count the warning banner and to power the "Low stock only"
checkbox. The search and the checkbox work together.

## Validation rules
- Name: required
- Unit: must be chosen
- Quantity in stock and reorder level: a number, 0 or more
- Unit cost: a number above 0

## How it was tested
Tested manually in the browser at `localhost:5173/materials`.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check materials list display | TC01: Check the list shows on opening the page | Frontend is running with `npm run dev` | 1. Open `localhost:5173`<br>2. Click Materials in the sidebar | None | Table shows 4 materials; a red warning says 1 material is low on stock | 4 materials and the warning were shown | Pass |
| Check search | TC02: Search by name | Materials page is open | 1. Click the search box<br>2. Type the name | `timber` | Only Mahogany Timber is shown | Only Mahogany Timber was shown | Pass |
| Check search | TC03: Search with no match | Materials page is open | 1. Click the search box<br>2. Type text that matches nothing | `zzz` | "No materials found." message shows | Message was shown | Pass |
| Check low stock label | TC04: Check the low stock label | Materials page is open | 1. Look at the Status column | None | Wood Varnish (8 litres, level 10) shows red "Low stock"; the others show green "In stock" | Only Wood Varnish was marked Low stock | Pass |
| Check low stock filter | TC05: Show low stock only | Materials page is open | 1. Tick "Low stock only" | Checkbox ticked | Only Wood Varnish is shown | Only Wood Varnish was shown | Pass |
| Check low stock filter | TC06: Untick the filter | Checkbox is ticked | 1. Untick "Low stock only" | Checkbox unticked | All 4 materials show again | All 4 were shown again | Pass |
| Check add form validation | TC07: Save an empty form | Materials page is open | 1. Click + Add Material<br>2. Leave all inputs empty<br>3. Click Save | Empty inputs | Errors show for name, unit, stock, reorder level and unit cost; nothing is saved | All 5 errors showed, nothing was saved | Pass |
| Check add form validation | TC08: Enter negative stock | Add form is open | 1. Fill the other inputs correctly<br>2. Type the stock<br>3. Click Save | Stock: `-1` | "Stock must be a number, 0 or more" shows | Stock error was shown, nothing was saved | Pass |
| Check add material | TC09: Add a material with valid details | Add form is open | 1. Fill the inputs<br>2. Click Save | Name: `Nails`<br>Unit: kg<br>Stock: `30`<br>Reorder level: `10`<br>Unit cost: `250` | Material appears with "In stock"; the form closes | Nails appeared as In stock and the form closed | Pass |
| Check edit material | TC10: Restock a low material | Materials page is open (run after TC05 and TC06) | 1. Click Edit on Wood Varnish<br>2. Change the stock<br>3. Click Save | Stock: `20` | Wood Varnish now shows "In stock" and the warning banner disappears | Label changed to In stock, banner was gone | Pass |
| Check cancel | TC11: Cancel the form | Add or edit form is open | 1. Type something in an input<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed, no changes | Pass |

## Known issues / to do
- Data resets to the 4 mock materials when the page is refreshed or when the
  user leaves the page and returns. This will be solved when the list comes
  from the backend API.
- Stock is changed by editing the material. Automatic reduction of stock when
  production starts can be added once production and the backend are ready.
- No delete button yet (not in the requirements).
- Replace the mock data with real API calls once the backend is ready.
- Confirm the field names with Jose (backend developer).
