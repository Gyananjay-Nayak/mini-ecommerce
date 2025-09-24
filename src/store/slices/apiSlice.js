import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com/',
  }),
  tagTypes: ['Product', 'Category'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ limit = 20, skip = 0, category, search, sortBy, order } = {}) => {
        let url = 'products'
        const params = new URLSearchParams()
        
        // Handle search
        if (search) {
          url = 'products/search'
          params.append('q', search)
        } 
        // Handle category filtering
        else if (category && category !== 'all') {
          url = `products/category/${category}`
        }
        
        // Add pagination
        if (limit) params.append('limit', limit.toString())
        if (skip) params.append('skip', skip.toString())
        
        // Add sorting
        if (sortBy) params.append('sortBy', sortBy)
        if (order) params.append('order', order)
          const queryString = params.toString()
        return queryString ? `${url}?${queryString}` : url
      },
      providesTags: ['Product'],
      transformResponse: (response) => ({
        products: response.products || [],
        total: response.total || 0,
        skip: response.skip || 0,
        limit: response.limit || 20,
      }),
    }),

    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Get all categories
    getCategories: builder.query({
      query: () => 'products/categories',
      providesTags: ['Category'],
    }),

    // Get products by specific category
    getProductsByCategory: builder.query({
      query: ({ category, limit = 20, skip = 0 }) => {
        const params = new URLSearchParams()
        if (limit) params.append('limit', limit.toString())
        if (skip) params.append('skip', skip.toString())
        
        return `products/category/${category}?${params.toString()}`
      },
      providesTags: ['Product'],
    }),

    // Search products
    searchProducts: builder.query({
      query: ({ q, limit = 20, skip = 0 }) => {
        const params = new URLSearchParams()
        params.append('q', q)
        if (limit) params.append('limit', limit.toString())
        if (skip) params.append('skip', skip.toString())
        
        return `products/search?${params.toString()}`
      },
      providesTags: ['Product'],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
} = apiSlice
