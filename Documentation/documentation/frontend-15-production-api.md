# Frontend Feature 15: Production Connected to the Backend

## What it does
Assigns real orders to production and tracks them through Not Started, In Progress, Completed
and On Hold. Four cards count the jobs by status. Moving a job to In Progress makes its order
In Production, and Completed makes the order Completed. Replaces `frontend-06-production.md`.

## What changed from the mock version
| Before (mock) | Now (backend) |
| --- | --- |
| 7 stages with a progress bar | 4 statuses |
| assigned person and expected end date | not stored by the backend, use Notes |
| start date typed in | `startDate` and `completionDate` come from the backend if it sets them |

## Files
- `src/types/production.ts`, `src/components/ProductionForm.tsx`, `src/pages/Production.tsx`

## Backend endpoints used
| Action | Endpoint |
| --- | --- |
| List | `GET /api/production`, `GET /api/orders` |
| Assign | `POST /api/production` with `order`, `notes` |
| Update | `PUT /api/production/:id` with `productionStatus`, `notes` |
| Delete (Admin only) | `DELETE /api/production/:id` |

## How it was tested
Tested manually at `localhost:5173/production`, logged in, backend running, with a Pending order.

| Test Scenario | Test Case | Pre-Conditions | Test Steps | Test Data | Expected Results | Actual Results | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check production page | TC01: Page loads | Logged in | 1. Click Production | None | Four cards and "No production jobs found." or the saved jobs | The page loaded | Pass |
| Check form validation | TC02: Save without an order | Page open | 1. Click + Assign Order<br>2. Click Save | No order | "Please choose an order" shows | The error was shown | Pass |
| Check assign | TC03: Assign an order | Form open | 1. Choose a Pending order<br>2. Add a note<br>3. Save | Note: `Cutting timber` | New row, status Not Started; stays after F5; Not Started card shows 1 | The row appeared | Pass |
| Check order dropdown | TC04: Assigned orders are hidden | TC03 done | 1. Open + Assign Order | None | The assigned order is not listed | It was not listed | Pass |
| Check status button | TC05: Move to In Progress | TC03 done | 1. Click Move to In Progress<br>2. Open Orders | None | Job is In Progress and the order is In Production | Both showed the new status | Pass |
| Check edit | TC06: Put a job On Hold | A job in progress | 1. Click Edit<br>2. Status On Hold<br>3. Save | On Hold | Status On Hold in red | The status changed | Pass |
| Check status button | TC07: Resume a job | TC06 done | 1. Click Move to In Progress | None | Status In Progress again | The status changed | Pass |
| Check status button | TC08: Complete a job | Job In Progress | 1. Click Move to Completed<br>2. Open Orders | None | Job Completed, button shows Finished and is greyed; order is Completed | Both showed Completed | Pass |
| Check search and filter | TC09: Search and filter | Jobs exist | 1. Type a customer name<br>2. Choose a status | Any | Only matching rows show | The list was filtered | Pass |
| Check roles | TC10: Delete is Admin only | Staff, then Admin | 1. Look at Action as Staff<br>2. Delete as Admin | None | Staff sees no Delete; Admin can delete | Behaved as expected | Pass |
| Check cancel | TC11: Cancel the form | Form open | 1. Type something<br>2. Click Cancel | Any | Form closes | The form closed | Pass |

## Known issues / to do
- Start and completion dates only show if the backend sets them. They are shown as "-" otherwise.
- There is no assigned person field in the backend. Notes can hold the name.
- Completed, Delivered and Cancelled orders cannot be assigned.