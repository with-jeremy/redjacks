// This function checks if the current user is an admin. If the user is an admin, it returns true. Otherwise, it returns false.
// This function is used in the middleware.ts file to check if the user has access to the protected route. If the user is not an admin, they will be redirected to the sign-in page.
import { currentUser } from '@clerk/nextjs/server'

export const checkRole = async () => {
  const user = await currentUser()

  if (!user || user.publicMetadata.role !== 'admin') {
    return false
  }


  console.log(`User role: ${user.publicMetadata.role}`)

  return true
}
 