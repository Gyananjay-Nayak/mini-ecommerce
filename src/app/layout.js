import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import ReduxProvider from '@/store/providers/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mini E-Commerce Store',
  description: 'Your one-stop shop for amazing products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
