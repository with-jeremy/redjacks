export {}

// Create a type for the roles
export type Roles = 'admin' 

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}

export type Shows = {
  capacity: number
  created_at: string
  created_by: string
  description: string
  door_time: string
  id: number
  name: string
  price: number
  show_flyer: string
  start_time: string
  updated_at: string
};
export type Tickets = {
  created_at: string;
  show_id: number | null;
  id: number;
  stripe_confirmation: string;
  updated_at: string;
  user_id: number;
  };