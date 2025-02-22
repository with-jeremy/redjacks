'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

export async function setRole(formData: FormData): Promise<{ message: string }> {
  const client = await clerkClient()

  // Check that the user trying to set the role is an admin
  if (!checkRole('admin')) {
    return { message: 'Not Authorized' }
  }

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') },
    })
    return { message: JSON.stringify(res.publicMetadata) }
  } catch (err) {
    return { message: String(err) }
  }
}

export async function removeRole(formData: FormData): Promise<{ message: string }> {
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null },
    })
    return { message: JSON.stringify(res.publicMetadata) }
  } catch (err) {
    return { message: String(err) }
  }
}