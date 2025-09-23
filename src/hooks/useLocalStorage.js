'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

// Wishlist hook
export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage('flaerHomes_wishlist', [])

  const addToWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id)
      if (!exists) {
        return [...prev, {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          category: product.category,
          addedAt: new Date().toISOString(),
        }]
      }
      return prev
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
  }
}
