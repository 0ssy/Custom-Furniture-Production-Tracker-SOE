// All the stages a production job goes through, in order.
// Written once here so the form, the filter and the progress bar
// all use the same list. "as const" means these words will not change.
export const PRODUCTION_STAGES = [
  'Not Started',
  'Cutting',
  'Assembly',
  'Sanding',
  'Finishing',
  'Quality Check',
  'Completed',
] as const

// ProductionStage can only be one of the words above, nothing else.
export type ProductionStage = (typeof PRODUCTION_STAGES)[number]

// This describes one production job (one order being made).
// Field names must match what Jose uses in the backend.
export type ProductionJob = {
  _id: string              // unique id (MongoDB creates this automatically)
  orderId: string          // the _id of the order being made
  stage: ProductionStage   // where the job is now
  assignedTo: string       // the worker or team making it
  startDate: string        // day production was assigned, like 2026-11-03
  expectedEndDate: string  // day it should be finished
  notes: string            // extra notes (optional)
}

// Works out the progress percentage from the stage.
// The position of the stage in the list is divided by the last position.
// Not Started = 0%, Completed = 100%, the rest are in between.
export function getProgress(stage: ProductionStage) {
  const position = PRODUCTION_STAGES.indexOf(stage)
  const lastPosition = PRODUCTION_STAGES.length - 1
  return Math.round((position / lastPosition) * 100)
}