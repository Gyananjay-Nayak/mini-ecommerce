'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateQuantity, removeFromCart } from '@/store/slices/cartSlice'
import { useWishlist } from '@/hooks/useLocalStorage'
import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import QuantitySelector from '@/components/common/QuantitySelector'
import Button from '@/components/common/Button'

const PRODUCT_PLACEHOLDER = 'https://via.placeholder.com/200x200/ef4444/ffffff?text=Product'

export default function CartItem({ item }) {
  const dispatch = useDispatch()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isRemoving, setIsRemoving] = useState(false)
  
  const inWishlist = isInWishlist(item.id)
  const discountedPrice = item.price * (1 - (item.discountPercentage || 0) / 100)
  const itemTotal = discountedPrice * item.quantity

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      handleRemove()
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }))
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    setTimeout(() => {
      dispatch(removeFromCart(item.id))
    }, 150)
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(item.id)
    } else {
      const wishlistItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        category: item.category
      }
      addToWishlist(wishlistItem)
    }
  }

  return (
    <div className={`p-4 transition-all duration-150 ${isRemoving ? 'opacity-0 transform scale-95' : 'opacity-100'}`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <Link href={`/products/${item.id}`} className="flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={item.thumbnail || PRODUCT_PLACEHOLDER}
              alt={item.title}
              width={96}
              height={96}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = PRODUCT_PLACEHOLDER
              }}
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex-1">
              <Link 
                href={`/products/${item.id}`}
                className="text-sm sm:text-base font-medium text-gray-900 hover:text-red-600 transition-colors line-clamp-2"
              >
                {item.title}
              </Link>
              <p className="text-sm text-gray-500 capitalize mt-1">
                {item.category?.replace('-', ' ')}
              </p>
              
              {/* Stock Info */}
              {item.stock < 10 && (
                <p className="text-xs text-orange-600 mt-1">
                  Only {item.stock} left in stock
                </p>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ₹{itemTotal.toFixed(2)}
              </div>
              {item.discountPercentage > 0 && (
                <div className="text-sm text-gray-500">
                  <span className="line-through">₹{(item.price * item.quantity).toFixed(2)}</span>
                  <span className="ml-2 text-red-600 font-medium">
                    -{Math.round(item.discountPercentage)}%
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-500">
                ₹{discountedPrice.toFixed(2)} each
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
              max={item.stock}
              size="sm"
            />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlistToggle}
                className="text-gray-500 hover:text-red-600"
              >
                {inWishlist ? (
                  <HeartIconSolid className="w-4 h-4 text-red-600" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline ml-1">
                  {inWishlist ? 'Remove from Wishlist' : 'Save for Later'}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-gray-500 hover:text-red-600"
              >
                <TrashIcon className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
