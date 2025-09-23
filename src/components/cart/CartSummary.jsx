'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { applyPromoCode, removePromoCode } from '@/store/slices/cartSlice'
import Button from '@/components/common/Button'
import PromoCodeInput from './PromoCodeInput'
import { ShoppingBagIcon, CreditCardIcon } from '@heroicons/react/24/outline'

export default function CartSummary({ summary }) {
  const dispatch = useDispatch()
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoError, setPromoError] = useState('')

  const handlePromoSubmit = (code) => {
    try {
      dispatch(applyPromoCode(code))
      setShowPromoInput(false)
      setPromoError('')
    } catch (error) {
      setPromoError('Invalid promo code')
    }
  }

  const handleRemovePromo = () => {
    dispatch(removePromoCode())
    setPromoError('')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Summary Items */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({summary.itemsCount} items)</span>
          <span className="font-medium">₹{summary.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">FREE</span>
        </div>
        
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Discount
              {summary.promoCode && (
                <span className="text-red-600 ml-1">({summary.promoCode})</span>
              )}
            </span>
            <span className="font-medium text-red-600">
              -₹{summary.discount.toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">Calculated at checkout</span>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        {summary.promoCode ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <div className="text-sm font-medium text-green-800">
                Promo code applied
              </div>
              <div className="text-xs text-green-600">
                {summary.promoCode}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemovePromo}
              className="text-green-700 hover:text-green-800"
            >
              Remove
            </Button>
          </div>
        ) : showPromoInput ? (
          <PromoCodeInput
            onSubmit={handlePromoSubmit}
            onCancel={() => {
              setShowPromoInput(false)
              setPromoError('')
            }}
            error={promoError}
          />
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowPromoInput(true)}
            className="w-full"
          >
            Add promo code
          </Button>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
        <span>Total</span>
        <span>₹{summary.total.toFixed(2)}</span>
      </div>

      {/* Checkout Buttons */}
      <div className="space-y-3">
        <Button className="w-full" size="lg">
          <CreditCardIcon className="w-5 h-5 mr-2" />
          Proceed to Checkout
        </Button>
        
        <Button variant="outline" className="w-full" size="lg">
          <ShoppingBagIcon className="w-5 h-5 mr-2" />
          Continue Shopping
        </Button>
      </div>

      {/* Security Note */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 Secure checkout powered by SSL encryption</p>
      </div>
    </div>
  )
}
