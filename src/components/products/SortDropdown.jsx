'use client'
import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSortBy, setOrder, selectFilters } from '@/store/slices/filtersSlice'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const sortOptions = [
  { label: 'Relevance', sortBy: 'id', order: 'asc' },
  { label: 'Price: Low to High', sortBy: 'price', order: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', order: 'desc' },
  { label: 'Name: A to Z', sortBy: 'title', order: 'asc' },
  { label: 'Name: Z to A', sortBy: 'title', order: 'desc' },
  { label: 'Rating: High to Low', sortBy: 'rating', order: 'desc' },
  { label: 'Newest First', sortBy: 'id', order: 'desc' },
]

export default function SortDropdown() {
  const dispatch = useDispatch()
  const { sortBy, order } = useSelector(selectFilters)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentSort = sortOptions.find(option => option.sortBy === sortBy && option.order === order) 
    || sortOptions

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSortChange = (option) => {
    dispatch(setSortBy(option.sortBy))
    dispatch(setOrder(option.order))
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px]"
      >
        <span className="text-sm font-medium text-gray-700">
          Sort by: {currentSort.label}
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={`${option.sortBy}-${option.order}`}
                onClick={() => handleSortChange(option)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  currentSort.sortBy === option.sortBy && currentSort.order === option.order
                    ? 'text-red-600 bg-red-50 font-medium'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
