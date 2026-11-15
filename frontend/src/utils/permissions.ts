import type { UserRole } from '../services/api'

// The parts of the system that have their own permissions
export type ModuleName =
  | 'customers'
  | 'furniture'
  | 'materials'
  | 'orders'
  | 'payments'
  | 'production'
  | 'deliveries'

// Who may create and edit in each module. This copies the rules Jose put in
// his route files. Every role can VIEW every module.
const EDITORS: Record<ModuleName, UserRole[]> = {
  customers: ['Administrator', 'Manager', 'Sales'],
  furniture: ['Administrator', 'Manager'],
  materials: ['Administrator', 'Manager', 'Production'],
  orders: ['Administrator', 'Manager', 'Sales'],
  payments: ['Administrator', 'Manager', 'Sales'],
  production: ['Administrator', 'Manager', 'Production'],
  deliveries: ['Administrator', 'Manager', 'Delivery'],
}

// true if this role may add or edit in the module
export function canEdit(role: UserRole | undefined, module: ModuleName) {
  return !!role && EDITORS[module].includes(role)
}

// Only the Administrator may delete anything
export function canDelete(role: UserRole | undefined) {
  return role === 'Administrator'
}