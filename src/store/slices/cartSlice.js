import { createSlice } from '@reduxjs/toolkit'

// Load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return { items: [], total: 0, itemsCount: 0 }
  
  try {
    const serializedCart = localStorage.getItem('flaerHomes_cart')
    if (serializedCart === null) return { items: [], total: 0, itemsCount: 0 }
    return JSON.parse(serializedCart)
  } catch (err) {
    return { items: [], total: 0, itemsCount: 0 }
  }
}

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  if (typeof window === 'undefined') return
  
  try {
    const serializedCart = JSON.stringify(cart)
    localStorage.setItem('flaerHomes_cart', serializedCart)
  } catch (err) {
    console.error('Could not save cart to localStorage', err)
  }
}

const initialState = {
  items: [],
  total: 0,
  itemsCount: 0,
  promoCode: null,
  discount: 0,
  ...loadCartFromStorage()
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage || 0,
          thumbnail: product.thumbnail,
          category: product.category,
          quantity,
          stock: product.stock,
        })
      }
      
      cartSlice.caseReducers.calculateTotals(state)
      saveCartToStorage(state)
    },

    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item.id !== productId)
      cartSlice.caseReducers.calculateTotals(state)
      saveCartToStorage(state)
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
        } else {
          // Check stock limit
          item.quantity = Math.min(quantity, item.stock)
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state)
      saveCartToStorage(state)
    },

    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemsCount = 0
      state.promoCode = null
      state.discount = 0
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('flaerHomes_cart')
      }
    },

    applyPromoCode: (state, action) => {
      const promoCode = action.payload.toUpperCase()
      
      // Mock promo codes for demo
      const validCodes = {
        'FLAER10': { discount: 0.1, type: 'percentage', description: '10% off' },
        'SAVE50': { discount: 50, type: 'fixed', description: '$50 off' },
        'WELCOME20': { discount: 0.2, type: 'percentage', description: '20% off for new customers' },
        'FREESHIP': { discount: 0, type: 'shipping', description: 'Free shipping' },
      }
      
      if (validCodes[promoCode]) {
        state.promoCode = promoCode
        const { discount, type } = validCodes[promoCode]
        
        if (type === 'percentage') {
          state.discount = state.total * discount
        } else if (type === 'fixed') {
          state.discount = Math.min(discount, state.total)
        } else {
          state.discount = 0 // For free shipping, handle separately in UI
        }
      } else {
        throw new Error('Invalid promo code')
      }
      
      saveCartToStorage(state)
    },

    removePromoCode: (state) => {
      state.promoCode = null
      state.discount = 0
      saveCartToStorage(state)
    },

    calculateTotals: (state) => {
      // Calculate items count
      state.itemsCount = state.items.reduce((total, item) => total + item.quantity, 0)
      
      // Calculate subtotal with individual discounts
      let subtotal = 0
      state.items.forEach(item => {
        const discountedPrice = item.price * (1 - (item.discountPercentage / 100))
        subtotal += discountedPrice * item.quantity
      })
      
      state.total = subtotal
      
      // Recalculate promo discount if exists
      if (state.promoCode) {
        const validCodes = {
          'FLAER10': { discount: 0.1, type: 'percentage' },
          'SAVE50': { discount: 50, type: 'fixed' },
          'WELCOME20': { discount: 0.2, type: 'percentage' },
          'FREESHIP': { discount: 0, type: 'shipping' },
        }
        
        const promoData = validCodes[state.promoCode]
        if (promoData) {
          if (promoData.type === 'percentage') {
            state.discount = state.total * promoData.discount
          } else if (promoData.type === 'fixed') {
            state.discount = Math.min(promoData.discount, state.total)
          }
        }
      }
    },

    hydrateCart: (state) => {
      const storedCart = loadCartFromStorage()
      return { ...state, ...storedCart }
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
  hydrateCart,
} = cartSlice.actions

export default cartSlice.reducer

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => Math.max(0, state.cart.total - (state.cart.discount || 0))
export const selectCartSubtotal = (state) => state.cart.total
export const selectCartItemsCount = (state) => state.cart.itemsCount
export const selectCartDiscount = (state) => state.cart.discount || 0
export const selectPromoCode = (state) => state.cart.promoCode
export const selectCartItemById = (state, productId) => 
  state.cart.items.find(item => item.id === productId)
