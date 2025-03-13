export type Roles = "admin";
declare global {
  interface CustomJwtSessionClaims {
    firstName: string
    lastName: string
    fullName: string
    metadata: {
      role?: Roles
    }
  }
}