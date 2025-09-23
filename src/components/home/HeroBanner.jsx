'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const heroSlides = [
  {
    id: 1,
    image: "/images/hero/hero_1.jpg",
    bgColor: "from-red-600 to-red-800"
  },
  {
    id: 2,
    image: "/images/hero/hero_2.jpg",
    bgColor: "from-red-700 to-red-900"
  },
  {
    id: 3,
    image: "/images/hero/hero_3.jpg",
    bgColor: "from-red-800 to-red-600"
  },
  {
    id: 4,
    image: "/images/hero/hero_4.jpg",
    bgColor: "from-red-800 to-red-600"
  }
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const handleImageError = (slideId) => {
    setImageErrors(prev => ({ ...prev, [slideId]: true }))
  }

  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {!imageErrors[slide.id] ? (
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt='Best Plywood in Hyderabad'
                fill
                className="object-cover"
                priority={index === 0}
                onError={() => handleImageError(slide.id)}
              />
            </div>
          ) : (
            // Fallback to solid color background if image fails
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`} />
          )}
          
          {/*text overlay at bottom */}
          <div className="absolute bottom-4 left-4 text-white/80 text-sm">
            FLAERHomes • Slide {index + 1} of {heroSlides.length}
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
