# Frontend Feature 06: Production Tracking

## What it does
Shows the production jobs of the workshop. The user can assign an order to
production, move a job to its next stage, edit a job, search, and filter by
stage. Progress is worked out from the stage. A job whose end date has passed
and is not completed is marked Overdue. It uses mock data for now because
the backend is not finished yet.

## Files
- `src/types/production.ts`: the ProductionJob type, the list of stages and the progress function
- `src/data/mockProduction.ts`: fake production jobs used for testing
- `src/components/ProductionForm.tsx`: form for assigning and editing, with validation
- `src/pages/Production.tsx`: table, progress bar, search, stage filter, Next Stage button
- `src/App.tsx`: the `/production` route now points to the Production page

## Production job fields
| Field | Meaning |
| --- | --- |
| `_id` | Unique id (MongoDB will create it, we fake it for now) |
| `orderId` | The `_id` of the order being made |
| `stage` | Not Started, Cutting, Assembly, Sanding, Finishing, Quality Check or Completed |
| `assignedTo` | Worker or team making the order (required) |
| `startDate` | Day the order was assigned to production |
| `expectedEndDate` | Day it should be finished (required, not before start date) |
| `notes` | Extra notes (optional) |

## How it works
`Production.tsx` keeps the jobs in state (`useState`). A job only stores the
`orderId`, so the page finds the order and its customer to show text like
"Mary Wanjiku - Wardrobe (x1)". Progress is not typed in. It is worked out from
the position of the stage in the list: Not Started is 0% and Completed is 100%.
The Next Stage button moves the job one step forward and is disabled on
Completed, and also while the same job is open in the edit form. The assign
dropdown only lists orders that are not in production yet and are not
Cancelled, Delivered or Completed. Today's date is built by hand as
`YYYY-MM-DD` so it is the same in every browser.

## Validation rules
- Order: must be chosen (when assigning)
- Assigned to: required
- Expected end date: required, and not before the start date

## How it was tested
Tested manually in the browser at `localhost:5173/production`.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check production list display | TC01: Check the list shows on opening the page | Frontend is running with `npm run dev` | 1. Open `localhost:5173`<br>2. Click Production in the sidebar | None | Table shows 2 jobs: John Otieno's Sofa at Assembly and Faith Achieng's Dining Table at Completed | Table showed the 2 jobs | Pass |
| Check progress display | TC02: Check progress bars and percentages | Production page is open | 1. Look at the Progress column | None | Sofa shows 33%, Dining Table shows 100% | Sofa showed 33% and Dining Table showed 100% | Pass |
| Check search | TC03: Search by assigned person | Production page is open | 1. Click the search box<br>2. Type the name | `samuel` | Only the Dining Table job is shown | Only the Dining Table job was shown | Pass |
| Check search | TC04: Search by order text | Production page is open | 1. Click the search box<br>2. Type the furniture | `sofa` | Only the Sofa job is shown | Only the Sofa job was shown | Pass |
| Check search | TC05: Search with no match | Production page is open | 1. Click the search box<br>2. Type text that matches nothing | `zzz` | "No production jobs found." message shows | Message was shown | Pass |
| Check stage filter | TC06: Filter by stage | Production page is open | 1. Open the stage dropdown<br>2. Choose Assembly | Assembly | Only the Sofa job is shown | Only the Sofa job was shown | Pass |
| Check stage filter | TC07: Reset the filter | Filter is set to Assembly | 1. Choose All stages | All stages | Both jobs show again | Both jobs were shown again | Pass |
| Check assign form validation | TC08: Save an empty form | Production page is open | 1. Click + Assign Order<br>2. Leave all inputs empty<br>3. Click Save | Empty inputs | Errors show for order, assigned to and expected end date; nothing is saved | All 3 errors showed, nothing was saved | Pass |
| Check assign dropdown | TC09: Check only unassigned orders are listed | Assign form is open | 1. Open the Order dropdown | None | Only "Mary Wanjiku - Wardrobe (x1)" is listed, because the other two orders already have jobs | Only the Wardrobe order was listed | Pass |
| Check assign form validation | TC10: Enter an end date before today | Assign form is open | 1. Choose the order<br>2. Type a name<br>3. Pick a date before today<br>4. Click Save | Order: Wardrobe<br>Assigned to: `Daniel Kiprop`<br>Date: yesterday | "End date cannot be before the start date" error shows, nothing is saved | The date error was shown, nothing was saved | Pass |
| Check assign order | TC11: Assign an order with valid details | Assign form is open | 1. Choose the order<br>2. Type a name<br>3. Pick a future date<br>4. Click Save | Order: Wardrobe<br>Assigned to: `Daniel Kiprop`<br>Date: any day after today | New row appears with stage Not Started, 0% progress and today as the start date; form closes | New row appeared with Not Started, 0% and today's date; form closed | Pass |
| Check next stage | TC12: Move a job to the next stage | Production page is open | 1. Click Next Stage on the Sofa job | None | Sofa stage changes from Assembly to Sanding and progress changes to 50% | Stage changed to Sanding and progress showed 50% | Pass |
| Check next stage | TC13: Next Stage is disabled on a completed job | Production page is open | 1. Look at the Dining Table row<br>2. Try to click Next Stage | None | The button is greyed out and nothing happens | The button was greyed out and did nothing | Pass |
| Check edit job | TC14: Edit a job's stage and person | Production page is open | 1. Click Edit on the Sofa job<br>2. Change the stage and the name<br>3. Click Save | Stage: Finishing<br>Assigned to: `Paul Mutua` | Table shows Finishing, 67% and Paul Mutua | Table showed Finishing, 67% and Paul Mutua | Pass |
| Check overdue label | TC15: Overdue label shows for a late job | Production page is open | 1. Click Edit on the Sofa job<br>2. Change the end date to `2026-11-02` (the start date)<br>3. Click Save | End date: `2026-11-02` | A red "Overdue" label shows next to the date, because the date has passed and the job is not completed | The red Overdue label was shown | Pass |
| Check cancel | TC16: Cancel the form | Assign or edit form is open | 1. Type something in an input<br>2. Click Cancel | Any text | Form closes, nothing changes | Form closed, no changes | Pass |
| Check assign dropdown | TC17: Completed orders are not listed | Assign form is open | 1. Open the Order dropdown | None | Faith Achieng's Dining Table (Completed) is not listed | The Completed order was not listed | Pass |
| Check next stage | TC18: Next Stage is disabled while the job is being edited | Production page is open | 1. Click Edit on the Sofa job<br>2. Look at the Sofa row's Next Stage button | None | The Sofa's Next Stage button is greyed out until the form is saved or cancelled | The button was greyed out while the form was open | Pass |

## Known issues / to do
- Data resets to the 2 mock jobs when the page is refreshed or when the user
  leaves the page and returns. This will be solved when the list comes from the
  backend API.
- Moving a job to Completed does not yet change the order's status on the Orders
  page. The two pages will be connected when the backend is ready.
- Orders and customers come from the original mock lists, so ones added on
  other pages do not appear here until we use the real backend.
- Materials are not yet reduced when production starts.
- `crypto.randomUUID()` only works on `localhost` or HTTPS. This goes away when
  the backend creates the ids.
- Customers and Orders still use `toLocaleDateString('en-CA')` for the date. It
  works in Chrome. Production now uses a hand-built `YYYY-MM-DD` helper, and the
  other pages can be switched to it later.
- The stage names were chosen by us and may change once the lecturer or Jose
  confirms the real workshop process.
- Replace the mock data with real API calls once the backend is ready.
- Confirm the field names with Jose (backend developer).

## Fixes made after code review
- Completed orders can no longer be assigned to production.
- The Next Stage button is disabled while the same job is open in the edit form,
  so saving the form cannot undo a stage change.
- Today's date is now built as `YYYY-MM-DD` by hand so it is the same in every browser.