// The units shown in the dropdown, written once here.
export const MATERIAL_UNITS = ['pieces', 'sheets', 'planks', 'metres', 'litres', 'kg'] as const

// A material kept in the workshop store.
// Field names must match what Jose uses in the backend.
export type Material = {
  _id: string           // unique id (MongoDB creates this automatically)
  name: string          // e.g. "Mahogany Timber"
  unit: string          // how we count it: planks, litres, kg...
  quantityInStock: number // how much we have now
  reorderLevel: number  // when stock falls to this or below, it is LOW STOCK
  unitCost: number      // cost of one unit in KES
  supplier: string      // who we buy it from (optional)
}