'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const cartItems = useSelector(state => state.cart?.items || [])
//   const wishlistItems = useSelector(state => state.wishlist?.items || [])

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

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
                className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                Categories
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-red-600">
              <HeartIcon className="h-6 w-6" />
              {/* {wishlistItems.length > 0 && ( */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {/* {wishlistItems.length} */}
                  3
                </span>
              {/* )} */}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-red-600">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                  5
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
          </div>
          {/* Mobile Search */}
          <div className="px-4 py-3 border-t">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                placeholder="Search products..."
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
