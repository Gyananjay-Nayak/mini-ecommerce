'use client'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99, 
  size = 'md' 
}) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const buttonSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-lg">
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={`${buttonSizeClasses[size]} flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      >
        <MinusIcon className="w-4 h-4" />
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={`${sizeClasses[size]} w-12 text-center border-0 focus:outline-none`}
      />
      
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={`${buttonSizeClasses[size]} flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
