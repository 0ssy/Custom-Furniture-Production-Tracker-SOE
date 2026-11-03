import type { Furniture } from '../types/furniture'

// Fake catalogue items so we can build and test without the backend.
// When Jose finishes the API we delete this file and fetch real data.
export const mockFurniture: Furniture[] = [
  {
    _id: 'f1',
    name: 'Executive Wardrobe',
    category: 'Wardrobe',
    heightCm: 200,
    widthCm: 150,
    depthCm: 60,
    material: 'Mahogany',
    colour: 'Dark brown',
    design: '3 doors with a mirror',
    price: 45000,
  },
  {
    _id: 'f2',
    name: 'Queen Bed',
    category: 'Bed',
    heightCm: 110,
    widthCm: 160,
    depthCm: 200,
    material: 'Pine',
    colour: 'Natural',
    design: 'Carved headboard',
    price: 32000,
  },
  {
    _id: 'f3',
    name: 'Three-Seater Sofa',
    category: 'Sofa',
    heightCm: 90,
    widthCm: 210,
    depthCm: 90,
    material: 'Cypress and foam',
    colour: 'Grey',
    design: '', // no design notes, to test the "-" display
    price: 52000,
  },
]