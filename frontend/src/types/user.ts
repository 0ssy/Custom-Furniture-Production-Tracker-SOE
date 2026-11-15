import type { UserRole } from '../services/api'

// A user as the backend sends it (the password is never sent)
export type ApiUser = {
  _id: string
  fullName: string
  email: string
  role: UserRole
  createdAt: string
}