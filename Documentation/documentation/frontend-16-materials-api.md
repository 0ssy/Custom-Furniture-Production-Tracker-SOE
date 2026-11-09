# Frontend Feature 16: Materials Connected to the Backend

## What it does
Manages the material inventory in the real database. The user can search, filter by category,
show only low-stock items, add and edit materials. A material is Low stock when its quantity
is at or below its reorder level, and a red banner counts them. Admins can delete.
Replaces `frontend-05-materials.md`.

## What changed from the mock version
| Before (mock) | Now (backend) |
| --- | --- |
| no category | `category`: Timber, Hardware, Fabric, Finishing, Other |
| units: pieces, sheets, planks, metres, litres, kg | Pieces, Metres, Sheets, Litres, Kilograms |
| `supplier` | not stored, removed |
| no description | `description` is required, at least 3 characters |

## Files
- `src/types/material.ts`, `src/components/MaterialForm.tsx`, `src/pages/Materials.tsx`

## Backend endpoints used
`GET`, `POST /api/materials`, `PUT /api/materials/:id`, and `DELETE /api/materials/:id` (Admin only).

## How it was tested
Tested manually at `localhost:5173/materials`, logged in, backend running.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check materials page | TC01: Page loads | Logged in | 1. Click Materials | None | "No materials found." or the saved materials | The page loaded | Pass |
| Check form validation | TC02: Save an empty form | Page open | 1. Click + Add Material<br>2. Click Save | Empty inputs | Errors show for name, category, description, unit, stock, reorder level and cost | All 7 errors showed | Pass |
| Check form validation | TC03: Negative stock | Form open | 1. Fill the rest correctly<br>2. Type the stock<br>3. Save | Stock: `-1` | "Stock must be a number, 0 or more" shows | The error was shown | Pass |
| Check add material | TC04: Add timber | Form open | 1. Fill the inputs<br>2. Save | `Mahogany Timber`, Timber, `Seasoned mahogany planks`, Pieces, stock `120`, reorder `50`, cost `1500` | Row shows "120 Pieces" and green In stock; stays after F5 | The row appeared | Pass |
| Check low stock | TC05: Add a low-stock material | Form open | 1. Fill the inputs<br>2. Save | `Wood Varnish`, Finishing, `Clear wood varnish`, Litres, stock `8`, reorder `10`, cost `1200` | Red "Low stock" label and a banner "1 material(s) are low on stock" | The label and banner showed | Pass |
| Check low stock filter | TC06: Low stock only | TC05 done | 1. Tick Low stock only | Ticked | Only Wood Varnish shows; unticking shows all | The filter worked | Pass |
| Check search and filter | TC07: Search and category | Materials exist | 1. Type `timber`<br>2. Choose Finishing | `timber`, Finishing | Search shows the timber; the category filter shows only finishing | Both worked | Pass |
| Check edit | TC08: Restock | TC05 done | 1. Click Edit on Wood Varnish<br>2. Set stock to `20`<br>3. Save | Stock: `20` | Label becomes In stock and the banner disappears | The label and banner updated | Pass |
| Check roles | TC09: Delete is Admin only | Staff, then Admin | 1. Look at Action as Staff<br>2. Delete as Admin | None | Staff sees no Delete; Admin can delete | Behaved as expected | Pass |
| Check cancel | TC10: Cancel the form | Form open | 1. Type something<br>2. Click Cancel | Any | Form closes | The form closed | Pass |

## Known issues / to do
- Stock is changed by editing. It is not reduced automatically when production starts.
- There is no supplier field because the backend does not have one.