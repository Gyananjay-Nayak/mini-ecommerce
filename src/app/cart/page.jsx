'use client'
import { useSelector } from 'react-redux'
import { selectCartItems, selectCartSummary } from '@/store/slices/cartSlice'
import CartHeader from '@/components/cart/CartHeader'
import CartItemsList from '@/components/cart/CartItemsList'
import CartSummary from '@/components/cart/CartSummary'
import EmptyCart from '@/components/cart/EmptyCart'
// import RecommendedProducts from '@/components/cart/RecommendedProducts'

export default function CartPage() {
  const cartItems = useSelector(selectCartItems)
  const cartSummary = useSelector(selectCartSummary)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader itemsCount={cartSummary.itemsCount} />
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItemsList items={cartItems} />
            </div>
            <div className="lg:col-span-1">
              <CartSummary summary={cartSummary} />
            </div>
          </div>
        )}
        
        {/* <RecommendedProducts /> */}
      </div>
    </div>
  )
}
