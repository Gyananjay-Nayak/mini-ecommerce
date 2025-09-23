'use client'
import { useState } from 'react'
import Button from '@/components/common/Button'

export default function PromoCodeInput({ onSubmit, onCancel, error }) {
  const [code, setCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.trim()) {
      onSubmit(code.trim().toUpperCase())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter promo code"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Apply
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
