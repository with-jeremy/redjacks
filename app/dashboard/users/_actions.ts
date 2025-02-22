'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

type ActionResponse = { message: string } | { message: string; error: any }

export async function setRole(formData: FormData): Promise<ActionResponse> {
  const client = await clerkClient()

  // Check that the user trying to set the role is an admin
  if (!checkRole('admin')) {
    return { message: 'Not Authorized' }
  }

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') as string },
    })
    return { message: JSON.stringify(res.publicMetadata) }
  } catch (err: any) {
    return { message: String(err), error: err }
  }
}

export async function removeRole(formData: FormData): Promise<ActionResponse> {
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null },
    })
    return { message: JSON.stringify(res.publicMetadata) }
  } catch (err: any) {
    return { message: String(err), error: err }
  }
}