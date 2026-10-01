import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../../../components/header'
import ProductCard from '../../../components/product-card'
import { Button } from '../../../components/ui/button'
import { Filter } from 'lucide-react'
import { categories } from '../../../lib/products-data'
import { productAPI } from '../../../services/api'

export default function CategoryPage() {
  const { slug } = useParams()
  const [rawProducts, setRawProducts] = useState([])
  const [products, setProducts] = useState([])
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState('all')

  const category = categories.find((cat) => cat.id === slug) || {
    id: slug,
    name: slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : 'Eco Products',
    icon: '🌱'
  }

  useEffect(() => {
    productAPI.getByCategory(slug)
      .then(res => {
        const prods = (res && res.products) ? res.products : (Array.isArray(res) ? res : []);
        setRawProducts(prods.map(p => ({
          ...p,
          id: p.legacyId || p._id,
          name: p.name || p.title,
          price: p.price || p.refurbishedPrice || 0,
          originalPrice: p.originalPrice || Math.round((p.price || p.refurbishedPrice || 0) * 1.25),
          rating: p.rating || 4.5,
          reviewCount: p.reviewCount || 120,
          greenRating: p.greenRating || 5,
          certifications: p.certifications || 3,
          image: p.image || (p.images && p.images[0]) || "",
        })));
      })
      .catch(err => {
        console.error("Error loading category products from DB:", err);
      });
  }, [slug])

  useEffect(() => {
    let categoryProducts = [...rawProducts]

    // Apply sorting
    if (sortBy === 'price-low') {
      categoryProducts = categoryProducts.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      categoryProducts = categoryProducts.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      categoryProducts = categoryProducts.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'green-rating') {
      categoryProducts = categoryProducts.sort((a, b) => b.greenRating - a.greenRating)
    }

    // Apply price filter (handling INR thresholds)
    if (priceRange === 'under-1000' || priceRange === 'under-25') {
      categoryProducts = categoryProducts.filter((p) => p.price < 1000)
    } else if (priceRange === '1000-5000' || priceRange === '25-50') {
      categoryProducts = categoryProducts.filter((p) => p.price >= 1000 && p.price <= 5000)
    } else if (priceRange === '5000-10000' || priceRange === '50-100') {
      categoryProducts = categoryProducts.filter((p) => p.price >= 5000 && p.price <= 10000)
    } else if (priceRange === 'over-10000' || priceRange === 'over-100') {
      categoryProducts = categoryProducts.filter((p) => p.price > 10000)
    }

    setProducts(categoryProducts)
  }, [rawProducts, sortBy, priceRange])

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600">The category you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-600 mt-1">Showing {products.length} sustainable products</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="green-rating">Green Rating</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Prices</option>
              <option value="under-1000">Under ₹1,000</option>
              <option value="1000-5000">₹1,000 - ₹5,000</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="over-10000">Over ₹10,000</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new products</p>
            <Link to="/">
              <Button className="bg-green-600 hover:bg-green-700">View All Categories</Button>
            </Link>
          </div>
        )}

        {/* Load More */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
