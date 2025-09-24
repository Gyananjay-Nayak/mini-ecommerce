'use client'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/store/slices/cartSlice'
import { useWishlist } from '@/hooks/useLocalStorage'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, ShoppingCartIcon } from '@heroicons/react/24/solid'

const PRODUCT_PLACEHOLDER = '/images/common/placeholder.jpg'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ product, quantity: 1 }))
    
    // Optional: Show toast notification
    console.log(`Added ${product.title} to cart`)
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100)
  const hasDiscount = product.discountPercentage > 0

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-50">
            <Image
              src={product.thumbnail || PRODUCT_PLACEHOLDER}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = PRODUCT_PLACEHOLDER
              }}
            />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <div className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-md">
                -{Math.round(product.discountPercentage)}%
              </div>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <div className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded-md">
                Only {product.stock} left
              </div>
            )}
            {product.stock === 0 && (
              <div className="bg-gray-500 text-white px-2 py-1 text-xs font-semibold rounded-md">
                Out of Stock
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-sm text-red-600 font-medium mb-1 capitalize">
            {product.category?.replace('-', ' ')}
          </p>
          
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.rating || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{discountedPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          <ShoppingCartIcon className="w-4 h-4" />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  )
}
