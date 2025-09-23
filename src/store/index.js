import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice'
import cartSlice from './slices/cartSlice'
import filtersSlice from './slices/filtersSlice'

export const store = configureStore({
  reducer: {
    // RTK Query API slice
    api: apiSlice.reducer,
    
    // Regular slices
    cart: cartSlice,
    filters: filtersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export const RootState = store.getState
export const AppDispatch = store.dispatch
