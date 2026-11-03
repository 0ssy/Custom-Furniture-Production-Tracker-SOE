# Frontend Feature 04: Furniture Catalogue

## What it does
Shows the catalogue of furniture the workshop can make. The user can search
by name or category, add a new item and edit an existing one. Each item
records its dimensions, material, colour, design and price. It uses mock
data for now because the backend is not finished yet.

## Files
- `src/types/furniture.ts`: the Furniture type and the list of categories
- `src/data/mockFurniture.ts`: fake catalogue items used for testing
- `src/components/FurnitureForm.tsx`: form for adding and editing, with validation
- `src/pages/Furniture.tsx`: table, search and add/edit logic
- `src/App.tsx`: the `/furniture` route now points to the Furniture page

## Furniture fields
| Field | Meaning |
| --- | --- |
| `_id` | Unique id (MongoDB will create it, we fake it for now) |
| `name` | Name of the item, e.g. Queen Bed (required) |
| `category` | Wardrobe, Bed, Sofa, Dining Table, Chair, Cabinet or Other |
| `heightCm`, `widthCm`, `depthCm` | Size in centimetres (each above 0) |
| `material` | Main material (required) |
| `colour` | Colour (required) |
| `design` | Design notes (optional) |
| `price` | Base price in KES (above 0) |

## How it works
`Furniture.tsx` keeps the items in state (`useState`). The search box filters
by name or category as the user types. The same form is used for adding and
editing: if an item is passed in it edits that item, otherwise it adds a new
one. Numbers are typed as text and converted to numbers when saving.
`Number.isFinite` is used so values like `1e999` are rejected.

## Validation rules
- Name, material and colour: required
- Category: must be chosen
- Height, width, depth and price: a number above 0

## How it was tested
Tested manually in the browser at `localhost:5173/furniture`.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check furniture list display | TC01: Check the list shows on opening the page | Frontend is running with `npm run dev` | 1. Open `localhost:5173`<br>2. Click Furniture in the sidebar | None | Table shows 3 catalogue items with sizes like 200 x 150 x 60 | Table showed 3 items with their sizes | Pass |
| Check search | TC02: Search by name | Furniture page is open | 1. Click the search box<br>2. Type the name | `bed` | Only Queen Bed is shown | Only Queen Bed was shown | Pass |
| Check search | TC03: Search by category | Furniture page is open | 1. Click the search box<br>2. Type the category | `sofa` | Only Three-Seater Sofa is shown | Only the sofa was shown | Pass |
| Check search | TC04: Search with no match | Furniture page is open | 1. Click the search box<br>2. Type text that matches nothing | `zzz` | "No furniture found." message shows | Message was shown | Pass |
| Check add form validation | TC05: Save an empty form | Furniture page is open | 1. Click + Add Furniture<br>2. Leave all inputs empty<br>3. Click Save | Empty inputs | Errors show for name, category, height, width, depth, material, colour and price; nothing is saved | All 8 errors showed, nothing was saved | Pass |
| Check add form validation | TC06: Enter a negative height | Add form is open | 1. Fill the other inputs correctly<br>2. Type the height<br>3. Click Save | Height: `-5` | "Height must be a number above 0" shows | Height error was shown, nothing was saved | Pass |
| Check add form validation | TC07: Enter a price with letters | Add form is open | 1. Fill the other inputs correctly<br>2. Type the price<br>3. Click Save | Price: `abc` | "Price must be a number above 0" shows | Price error was shown | Pass |
| Check add form validation | TC08: Enter a huge price | Add form is open | 1. Fill the other inputs correctly<br>2. Type the price<br>3. Click Save | Price: `1e999` | "Price must be a number above 0" shows | Price error was shown | Pass |
| Check add furniture | TC09: Add an item with valid details | Add form is open | 1. Fill the inputs<br>2. Click Save | Name: `Office Chair`<br>Category: Chair<br>H/W/D: `100`, `60`, `60`<br>Material: `Oak`<br>Colour: `Black`<br>Price: `12000` | Item appears in the table, price shows as 12,000, form closes | New item appeared, price showed 12,000 and the form closed | Pass |
| Check edit furniture | TC10: Change an item's price | Furniture page is open | 1. Click Edit on Queen Bed<br>2. Change the price<br>3. Click Save | Price: `35000` | Table shows 35,000 for Queen Bed | Price updated to 35,000 | Pass |
| Check cancel | TC11: Cancel the form | Add or edit form is open | 1. Type something in an input<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed, no changes | Pass |

## Known issues / to do
- Data resets to the 3 mock items when the page is refreshed or when the user
  leaves the page and returns. This will be solved when the list comes from the
  backend API.
- The furniture type dropdown on the Orders page uses its own list and is not
  yet linked to this catalogue. Can be joined when the backend is ready.
- No delete button yet (not in the requirements).
- Replace the mock data with real API calls once the backend is ready.
- Confirm the field names with Jose (backend developer).