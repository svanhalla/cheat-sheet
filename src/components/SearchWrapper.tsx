import { Suspense } from 'react'
import Search from './Search'

export default function SearchWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search commands... (⌘K)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled
        />
      </div>
    }>
      <Search />
    </Suspense>
  )
}
