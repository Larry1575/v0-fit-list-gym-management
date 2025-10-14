// Tipos TypeScript para FitList

export type MemberStatus = "active" | "inactive" | "suspended"
export type MembershipStatus = "active" | "expired" | "cancelled"
export type PaymentMethod = "cash" | "card" | "transfer" | "other"
export type BookingStatus = "confirmed" | "cancelled" | "attended"

export interface Member {
  id: string
  member_number: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  photo_url?: string
  status: MemberStatus
  created_at: string
  updated_at: string
}

export interface MembershipType {
  id: string
  name: string
  description?: string
  duration_days: number
  price: number
  class_limit?: number
  features?: Record<string, any>
  is_active: boolean
  created_at: string
}

export interface Membership {
  id: string
  member_id: string
  membership_type_id: string
  start_date: string
  end_date: string
  status: MembershipStatus
  auto_renew: boolean
  created_at: string
  updated_at: string
  membership_type?: MembershipType
  member?: Member
}

export interface Payment {
  id: string
  member_id: string
  membership_id?: string
  amount: number
  payment_method: PaymentMethod
  payment_date: string
  concept: string
  notes?: string
  receipt_number?: string
  created_by?: string
  created_at: string
  member?: Member
}

export interface Class {
  id: string
  name: string
  description?: string
  instructor?: string
  day_of_week: number
  start_time: string
  end_time: string
  max_capacity: number
  is_active: boolean
  created_at: string
}

export interface ClassBooking {
  id: string
  class_id: string
  member_id: string
  booking_date: string
  status: BookingStatus
  created_at: string
  class?: Class
  member?: Member
}

export interface Attendance {
  id: string
  member_id: string
  check_in_time: string
  check_out_time?: string
  class_booking_id?: string
  notes?: string
  member?: Member
}

// Tipos para formularios
export interface MemberFormData {
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

export interface PaymentFormData {
  member_id: string
  membership_id?: string
  amount: number
  payment_method: PaymentMethod
  payment_date: string
  concept: string
  notes?: string
}
