import HeroBanner from '@/components/home/HeroBanner'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import TrendingProducts from '@/components/home/TrendingProducts'

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Featured Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Shop by Category
          </h2>
          <FeaturedCategories />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Trending Products
          </h2>
          <TrendingProducts />
        </div>
      </section>
    </div>
  )
}
