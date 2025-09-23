import Link from 'next/link'
import Button from '@/components/common/Button'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <ShoppingCartIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet. 
          Discover our amazing products and start shopping!
        </p>
        <Link href="/products">
          <Button size="lg" className="px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
