'use client'
import { useGetProductsQuery } from '@/store/slices/apiSlice'
import ProductCard from '@/components/products/ProductCard'

export default function TrendingProducts() {
  
  const { data, isLoading, error } = useGetProductsQuery({
    limit: 12,
    skip: 0,
    sortBy: 'rating',
    order: 'desc'
  })

  // Get 6 random products from the fetched data
  const getTrendingProducts = () => {
    if (!data?.products) return []
    
    const shuffled = [...data.products].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 6)
  }

  const trendingProducts = getTrendingProducts()

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Trending Products
            </h2>
          </div>
          
          {/* Loading skeleton */}
          <div className="flex gap-6 overflow-x-auto">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-none w-72 animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !trendingProducts.length) {
    return null 
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Trending Products
            </h2>
            <p className="text-gray-600">
              Discover what's popular right now
            </p>
          </div>
          
        </div>

        {/* Products Horizontal Scroll */}
        <div className="relative">
          <div
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {trendingProducts.map((product, index) => (
              <div key={`${product.id}-${index}`} className="flex-none w-72">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="hidden md:block absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
        
        <div className="text-center mt-8">
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}
