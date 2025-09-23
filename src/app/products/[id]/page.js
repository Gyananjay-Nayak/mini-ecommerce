'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetProductByIdQuery, useGetProductsQuery } from '@/store/slices/apiSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { useWishlist } from '@/hooks/useLocalStorage'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'
import { 
  ArrowLeftIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const PLACEHOLDER = 'https://via.placeholder.com/500x500/ef4444/ffffff?text=Product'

export default function ProductDetailPage() {
  const params = useParams()
  const dispatch = useDispatch()
  const productId = parseInt(params.id)
  
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId)
  const { data: similarData } = useGetProductsQuery({ 
    category: product?.category, 
    limit: 4 
  })
  
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(productId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-red-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images?.length ? product.images : [product.thumbnail]
  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
  }

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(productId)
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail
      })
    }
  }

  const similarProducts = similarData?.products?.filter(p => p.id !== productId)?.slice(0, 4) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/products" className="hover:text-red-600 flex items-center gap-1">
            <ArrowLeftIcon className="w-4 h-4" />
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-400">{product.title}</span>
        </div>

        {/* Main Product */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-lg mb-4 overflow-hidden">
              <Image
                src={images[currentImage] || PLACEHOLDER}
                alt={product.title}
                width={500}
                height={500}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER }}
              />
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-16 h-16 rounded overflow-hidden border-2 ${
                      currentImage === index ? 'border-red-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img || PLACEHOLDER}
                      alt=""
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = PLACEHOLDER }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-red-600 uppercase mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.rating) ? (
                      <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                    )
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      {Math.round(product.discountPercentage)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="mb-6">
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            {!isOutOfStock && (
              <div className="space-y-4">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className="p-3 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {inWishlist ? (
                      <HeartIconSolid className="w-5 h-5 text-red-600" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="pt-6 border-t">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct.id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
