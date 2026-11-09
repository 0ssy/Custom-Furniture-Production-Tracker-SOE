// The categories and units. These are the same words as in Jose's
// Material.ts model, so the backend will not reject them.
export const MATERIAL_CATEGORIES = ['Timber', 'Hardware', 'Fabric', 'Finishing', 'Other'] as const
export const MATERIAL_UNITS = ['Pieces', 'Metres', 'Sheets', 'Litres', 'Kilograms'] as const

// A material as the backend sends it
export type ApiMaterial = {
  _id: string
  name: string             // at least 2 characters
  description: string      // required, at least 3 characters
  category: string
  unit: string
  quantityInStock: number  // 0 or more
  unitCost: number         // 0 or more, in KES
  reorderLevel: number     // stock at or below this is LOW STOCK
}

// What the form sends to the backend (everything except the _id)
export type MaterialInput = Omit<ApiMaterial, '_id'>