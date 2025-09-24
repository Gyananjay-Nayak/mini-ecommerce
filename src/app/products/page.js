'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useGetProductsQuery } from '@/store/slices/apiSlice'
import { 
  setCategory, 
  setPriceRange, 
  setMinRating, 
  setSortBy, 
  setOrder, 
  setSearchQuery, 
  setCurrentPage, 
  selectFilters, 
  selectPagination,
  selectActiveFiltersCount 
} from '@/store/slices/filtersSlice'
import ProductCard from '@/components/products/ProductCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import SortDropdown from '@/components/products/SortDropdown'
import FilterModal from '@/components/products/FilterModal'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  
  // Memoized Redux selectors
  const filters = useSelector(selectFilters)
  const pagination = useSelector(selectPagination)
  const activeFiltersCount = useSelector(selectActiveFiltersCount)
  
  // Local state
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  // API query
  const { data, isLoading, error, isFetching } = useGetProductsQuery({
    limit: pagination.itemsPerPage,
    skip: pagination.skip,
    category: filters.category === 'all' ? undefined : filters.category,
    search: filters.searchQuery || undefined,
    sortBy: filters.sortBy,
    order: filters.order,
  })

  // Reset products when filters change (except pagination)
  useEffect(() => {
    setProducts([])
    dispatch(setCurrentPage(1))
    setHasMore(true)
  }, [filters.category, filters.searchQuery, filters.sortBy, filters.order, filters.priceRange, filters.minRating, dispatch])

  // Handle product data
  useEffect(() => {
    if (data?.products) {
      const filteredProducts = filterProducts(data.products)
      
      if (pagination.currentPage === 1) {
        setProducts(filteredProducts)
      } else {
        setProducts(prev => [...prev, ...filteredProducts])
        setIsLoadingMore(false)
      }
      
      setTotalProducts(data.total)
      const totalLoaded = pagination.currentPage * pagination.itemsPerPage
      setHasMore(totalLoaded < data.total)
    }
  }, [data, pagination.currentPage, filters.priceRange, filters.minRating])

  // Client-side filtering for price and rating
  const filterProducts = useCallback((productList) => {
    return productList.filter(product => {
      // Price filter
      const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100)
      if (discountedPrice < filters.priceRange || discountedPrice > filters.priceRange) {
        return false
      }
      
      // Rating filter
      if ((product.rating || 0) < filters.minRating) {
        return false
      }
      
      return true
    })
  }, [filters.priceRange, filters.minRating])

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop 
      >= document.documentElement.offsetHeight - 1000 &&
      hasMore &&
      !isFetching &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true)
      dispatch(setCurrentPage(pagination.currentPage + 1))
    }
  }, [hasMore, isFetching, isLoadingMore, pagination.currentPage, dispatch])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const getCategoryTitle = useCallback(() => {
    if (filters.searchQuery) {
      return `Search Results for "${filters.searchQuery}"`
    }
    if (filters.category === 'all') return 'All Products'
    return filters.category.charAt(0).toUpperCase() + filters.category.slice(1).replace('-', ' ')
  }, [filters.searchQuery, filters.category])

  if (isLoading && pagination.currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(20)].map((_, index) => (
              <div key={index} className="animate-pulse">
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t load the products. Please try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {getCategoryTitle()}
          </h1>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {filters.searchQuery && (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">
                    Found {products.length} results
                  </div>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-400 px-2 py-2 text-sm rounded-lg text-red-500"
                  onClick={()=>dispatch(setSearchQuery(''))}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <SortDropdown />
              <span className="text-sm text-gray-600 hidden sm:block">
                {products.length} of {totalProducts} products
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product, index) => (
                <ProductCard key={`${product.id}-${index}`} product={product} />
              ))}
            </div>

            {/* Load More Indicator */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
                <span className="ml-3 text-gray-600">
                  Loading more products...
                </span>
              </div>
            )}

            {/* End of products message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  You&apos;ve reached the end of our product catalog!
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <AdjustmentsHorizontalIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Adjust Filters
              </button>
              <button
                onClick={() => {
                  dispatch(setSearchQuery(""));
                  dispatch(setCategory("all"));
                  dispatch(setPriceRange([0, 2000]));
                  dispatch(setMinRating(0));
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
    </div>
  );
}
