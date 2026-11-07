// The categories shown in the dropdown. These are the same six words
// that Jose's Furniture.ts model accepts, so the backend will not reject them.
export const FURNITURE_CATEGORIES = [
  'Chair',
  'Table',
  'Bed',
  'Sofa',
  'Cabinet',
  'Other',
] as const

// OLD shape, only used by the mock file mockFurniture.ts.
// It can be deleted together with that file later.
export type Furniture = {
  _id: string
  name: string
  category: string
  heightCm: number
  widthCm: number
  depthCm: number
  material: string
  colour: string
  design: string
  price: number
}

// REAL shape, the same names as Jose's Furniture.ts model.
export type ApiFurniture = {
  _id: string          // MongoDB creates this
  name: string         // at least 2 characters
  description: string  // required, at least 3 characters
  category: string     // one of the six categories above
  basePrice: number    // price in KES, not negative
  dimensions: {
    length: number     // each must be greater than 0
    width: number
    height: number
  }
  isAvailable: boolean // true = can still be ordered
}

// What the form sends to the backend (everything except the _id)
export type FurnitureInput = Omit<ApiFurniture, '_id'>