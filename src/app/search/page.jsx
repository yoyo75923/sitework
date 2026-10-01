import { useEffect, useState, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Header from "../../components/header"
import ProductCard from "../../components/product-card"
import { Button } from "../../components/ui/button"
import { Search } from "lucide-react"
import { productAPI } from "../../services/api"

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [rawResults, setRawResults] = useState([])
  const [products, setProducts] = useState([])
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    if (query) {
      productAPI.search(query)
        .then(res => {
          const prods = (res && res.products) ? res.products : (Array.isArray(res) ? res : []);
          setRawResults(prods.map(p => ({
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
          console.error("Search error:", err);
          setRawResults([]);
        });
    } else {
      setRawResults([]);
    }
  }, [query])

  useEffect(() => {
    let results = [...rawResults]

    // Apply sorting
    if (sortBy === "price-low") {
      results = results.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      results = results.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      results = results.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "green-rating") {
      results = results.sort((a, b) => b.greenRating - a.greenRating)
    }

    // Apply price filter
    if (priceRange === "under-1000" || priceRange === "under-25") {
      results = results.filter((p) => p.price < 1000)
    } else if (priceRange === "1000-5000" || priceRange === "25-50") {
      results = results.filter((p) => p.price >= 1000 && p.price <= 5000)
    } else if (priceRange === "5000-10000" || priceRange === "50-100") {
      results = results.filter((p) => p.price >= 5000 && p.price <= 10000)
    } else if (priceRange === "over-10000" || priceRange === "over-100") {
      results = results.filter((p) => p.price > 10000)
    }

    setProducts(results)
  }, [rawResults, sortBy, priceRange])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Results Header */}
        <div className="flex items-center gap-2 mb-6">
          <Search className="w-5 h-5 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Search results for "{query}"</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? "result" : "results"} found
          </p>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="relevance">Sort by Relevance</option>
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

        {/* Search Results */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or browse our categories</p>
            <Button className="bg-green-600 hover:bg-green-700">Browse All Products</Button>
          </div>
        ) : null}
      </div>
    </div>
  )
} 