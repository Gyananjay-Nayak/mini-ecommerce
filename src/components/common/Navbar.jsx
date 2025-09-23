'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { setSearchQuery } from '@/store/slices/filtersSlice'
import { useWishlist } from '@/hooks/useLocalStorage'
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  
  const cartItems = useSelector(state => state.cart?.items || [])
  const { wishlistCount} = useWishlist();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      // Update Redux state
      dispatch(setSearchQuery(searchInput.trim()))
      
      // Navigate to products page with search
      const params = new URLSearchParams()
      // params.set('search', searchInput.trim())
      router.push(`/products?${params.toString()}`)
      
      // Clear search input
      setSearchInput('')
    }
  }

  const handleSearchClear = () => {
    setSearchInput('')
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-red-600">
              FLAERHomes
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-900 hover:text-red-600'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/products' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-900 hover:text-red-600'
                }`}
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/categories' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-900 hover:text-red-600'
                }`}
              >
                Categories
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="Search products..."
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-md"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
              <HeartIcon className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/"
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                pathname === '/' ? 'text-red-600 bg-red-50' : 'text-gray-900 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                pathname === '/products' ? 'text-red-600 bg-red-50' : 'text-gray-900 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                pathname === '/categories' ? 'text-red-600 bg-red-50' : 'text-gray-900 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
          </div>
          
          {/* Mobile Search */}
          <div className="px-4 py-3 border-t">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Search products..."
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}
