import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  category: 'all',
  priceRange: [0, 2000], // Based on DummyJSON price range
  minRating: 0,
  sortBy: 'id', // DummyJSON supports: id, title, price
  order: 'asc', // asc or desc
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 20,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload
      state.currentPage = 1 // Reset page when changing category
    },

    setPriceRange: (state, action) => {
      state.priceRange = action.payload
      state.currentPage = 1
    },

    setMinRating: (state, action) => {
      state.minRating = action.payload
      state.currentPage = 1
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload
      state.currentPage = 1
    },

    setOrder: (state, action) => {
      state.order = action.payload
      state.currentPage = 1
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },

    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload
      state.currentPage = 1
    },

    clearFilters: (state) => {
      state.category = 'all'
      state.priceRange = [0, 2000]
      state.minRating = 0
      state.searchQuery = ''
      state.currentPage = 1
      // Keep sortBy and order as user preference
    },

    resetPagination: (state) => {
      state.currentPage = 1
    },
  },
})

export const {
  setCategory,
  setPriceRange,
  setMinRating,
  setSortBy,
  setOrder,
  setSearchQuery,
  setCurrentPage,
  setItemsPerPage,
  clearFilters,
  resetPagination,
} = filtersSlice.actions

export default filtersSlice.reducer

// Selectors
export const selectFilters = (state) => state.filters
export const selectPagination = (state) => ({
  currentPage: state.filters.currentPage,
  itemsPerPage: state.filters.itemsPerPage,
  skip: (state.filters.currentPage - 1) * state.filters.itemsPerPage,
})

export const selectActiveFiltersCount = (state) => {
  const filters = state.filters
  let count = 0
  
  if (filters.category !== 'all') count++
  if (filters.priceRange > 0 || filters.priceRange < 2000) count++
  if (filters.minRating > 0) count++
  if (filters.searchQuery.trim()) count++
  
  return count
}

export const selectSortingParams = (state) => ({
  sortBy: state.filters.sortBy,
  order: state.filters.order,
})
