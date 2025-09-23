import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-red-400 mb-4">FLAERHomes</h3>
            <p className="text-gray-300 mb-4">
              Your trusted online shopping destination for quality products at great prices.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=electronics" className="text-gray-300 hover:text-white">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing" className="text-gray-300 hover:text-white">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/products?category=home" className="text-gray-300 hover:text-white">
                  Home & Garden
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: support@flaerhomes.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Commerce St, City, State 12345</p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
