import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function CartHeader({ itemsCount }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/products" 
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {itemsCount === 0 
              ? 'Your cart is empty' 
              : `${itemsCount} item${itemsCount > 1 ? 's' : ''} in your cart`
            }
          </p>
        </div>
      </div>
      
      {itemsCount > 0 && (
        <Link
          href="/products"
          className="hidden sm:inline-flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          Continue Shopping
        </Link>
      )}
    </div>
  )
}
