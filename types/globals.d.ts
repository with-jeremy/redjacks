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