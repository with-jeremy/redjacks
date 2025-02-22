import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { SearchUsers } from './SearchUsers'
import { clerkClient } from '@clerk/nextjs/server'
import { removeRole, setRole } from './_actions'

export default async function UserDashboard(params: {
  searchParams: Promise<{ search?: string }>
}) {
  if (!checkRole('admin')) {
    redirect('/')
  }

  const query = (await params.searchParams).search

  const client = await clerkClient()

  const users = query ? (await client.users.getUserList({ query })).data : []


  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <SearchUsers />

      <div className="mt-6 space-y-4">
        {users.map((user) => {
          return (
            <div key={user.id} className="p-4 bg-gray-900 rounded-md shadow-sm">
              <div className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </div>

              <div className="text-gray-100">
                {
                  user.emailAddresses.find((email: { id: string; emailAddress: string }) => email.id === user.primaryEmailAddressId)
                    ?.emailAddress
                }
              </div>

              <div className="text-gray-100">{user.publicMetadata.role as string}</div>

              <div className="mt-4 space-y-2 space-x-2">
                <form action={async (formData) => {
                  try {
                    const result = await setRole(formData);
                    alert(result.message); // Display message to the user
                  } catch (error: Error | any) {
                    alert(error.message || 'An error occurred.');
                  }
                }} className="inline-block">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Make Admin
                  </button>
                </form>

                <form action={async (formData) => {
                  try {
                    const result = await setRole(formData);
                    alert(result.message); // Display message to the user
                  } catch (error: Error | any) {
                    alert(error.message || 'An error occurred.');
                  }
                }} className="inline-block">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="venue-owner" name="role" />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Make Venue Owner
                  </button>
                </form>

                <form action={async (formData) => {
                  try {
                    const result = await setRole(formData);
                    alert(result.message); // Display message to the user
                  } catch (error: Error | any) {
                    alert(error.message || 'An error occurred.');
                  }
                }} className="inline-block">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="moderator" name="role" />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Make Moderator
                  </button>
                </form>

                <form action={async (formData) => {
                  try {
                    const result = await removeRole(formData);
                    alert(result.message); // Display message to the user
                  } catch (error: Error | any) {
                    alert(error.message || 'An error occurred.');
                  }
                }} className="inline-block">
                  <input type="hidden" value={user.id} name="id" />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove Role
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}