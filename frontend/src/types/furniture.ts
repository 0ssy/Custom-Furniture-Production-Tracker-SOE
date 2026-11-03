// The categories shown in the dropdown, written once here.
// "as const" tells TypeScript these exact words will not change.
export const FURNITURE_CATEGORIES = [
  'Wardrobe',
  'Bed',
  'Sofa',
  'Dining Table',
  'Chair',
  'Cabinet',
  'Other',
] as const

// A furniture item in the catalogue (a product the workshop can make).
// Field names must match what Jose uses in the backend.
export type Furniture = {
  _id: string       // unique id (MongoDB creates this automatically)
  name: string      // e.g. "Queen Bed"
  category: string  // one of the categories above
  heightCm: number  // size in centimetres
  widthCm: number
  depthCm: number
  material: string  // main material, e.g. Mahogany
  colour: string    // e.g. Dark brown
  design: string    // optional design notes, e.g. "Carved headboard"
  price: number     // base price in KES
}