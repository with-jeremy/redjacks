'use client'

import { usePathname, useRouter } from 'next/navigation'

export const SearchUsers = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="p-4 bg-gray-900 rounded-md shadow-md">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const queryTerm = formData.get('search') as string
          router.push(pathname + '?search=' + queryTerm)
        }}
        className="flex flex-col space-y-4"
      >
        <label htmlFor="search" className="text-lg font-medium">
          Search for users
        </label>
        <input
          id="search"
          name="search"
          type="text"
          className="p-2 border border-gray-300 rounded-md text-black"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  )
}