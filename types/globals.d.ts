export {}

// Create a type for the roles
export type Roles = 'admin' | 'venue-owner' | 'venue-staff'| 'customer' | 'band-manager' | 'band-member'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}

export type Events = {
  capacity: number
          created_at: string
          created_by: string
          description: string
          door_time: string
          id: number
          name: string
          price: number
          start_time: string
          updated_at: string
}