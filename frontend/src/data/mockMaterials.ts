import type { Material } from '../types/material'

// Fake materials for testing without the backend.
// Wood Varnish has 8 in stock and a reorder level of 10,
// so it will show as LOW STOCK on the page.
export const mockMaterials: Material[] = [
  {
    _id: 'm1',
    name: 'Mahogany Timber',
    unit: 'planks',
    quantityInStock: 120,
    reorderLevel: 50,
    unitCost: 1500,
    supplier: 'Kamau Timber Yard',
  },
  {
    _id: 'm2',
    name: 'Wood Varnish',
    unit: 'litres',
    quantityInStock: 8,
    reorderLevel: 10,
    unitCost: 1200,
    supplier: 'Nairobi Paints',
  },
  {
    _id: 'm3',
    name: 'Foam Sheets',
    unit: 'sheets',
    quantityInStock: 40,
    reorderLevel: 15,
    unitCost: 2200,
    supplier: '', // no supplier, to test the "-" display
  },
  {
    _id: 'm4',
    name: 'Door Hinges',
    unit: 'pieces',
    quantityInStock: 200,
    reorderLevel: 100,
    unitCost: 150,
    supplier: 'Hardware World',
  },
]