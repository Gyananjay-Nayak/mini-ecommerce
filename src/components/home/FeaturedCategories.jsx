'use client'
import { useGetCategoriesQuery } from '@/store/slices/apiSlice'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { categoryImageMap } from '@/constants/categoryImages'


const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Category'

const featuredCategoryIds = [
  'furniture',
  'home-decoration', 
  'kitchen-accessories',
  'fragrances',
  'beauty',
  'skin-care'
]

export default function FeaturedCategories() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery()
  const [imageErrors, setImageErrors] = useState({})

  const handleImageError = (categorySlug) => {
    setImageErrors(prev => ({ ...prev, [categorySlug]: true }))
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-2xl mb-3"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    console.log('Error fetching categories:', error, categories)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load categories. Please try again later.</p>
      </div>
    )
  }

  const featuredCategories = categories?.filter(cat => 
    featuredCategoryIds.includes(cat.slug)
  ) || []

  const remainingCategories = categories?.filter(cat => 
    !featuredCategoryIds.includes(cat.slug)
  ).slice(0, Math.max(0, 6 - featuredCategories.length)) || []

  const displayCategories = [...featuredCategories, ...remainingCategories].slice(0, 6)

  const getImageSrc = (category) => {
    if (imageErrors[category.slug]) {
      return PLACEHOLDER_IMAGE
    }
    return categoryImageMap[category.slug] || PLACEHOLDER_IMAGE
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {displayCategories.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group text-center hover:transform hover:scale-105 transition-all duration-300"
        >
          <div className="relative overflow-hidden rounded-2xl mb-3 aspect-square bg-gray-100 group-hover:shadow-lg">
            <Image
              src={getImageSrc(category)}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => handleImageError(category.slug)}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300 capitalize">
            {category.name.replace('-', ' ')}
          </h3>
        </Link>
      ))}
    </div>
  )
}
