import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { marketplaceAPI } from "../../services/api";
import Header from "../../components/header";
import { Card, CardContent, CardHeader, CardTitle, CardMedia } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  TrendingUp,
  Leaf,
  Award,
  Star,
  ArrowRight,
  Users,
  MapPin,
  Heart,
  Eye,
  Search,
} from "lucide-react";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    marketplaceAPI.getAll()
      .then(res => {
        if (res && res.listings) {
          const mapped = res.listings.map(l => ({
            ...l,
            id: l.legacyId || l._id,
            title: l.title,
            price: l.price,
            category: l.category,
            condition: l.condition,
            description: l.description,
            images: l.images && l.images.length > 0 ? l.images : (l.image ? [l.image] : []),
            hasReceipt: l.hasReceipt || false,
            location: l.location || "Mumbai, Maharashtra",
            views: l.views || 25,
            likes: l.likes || 5,
            sellerName: l.sellerName || "Marketplace Member",
            sellerRating: l.sellerRating || 4.8,
            sellerSales: l.sellerSales || 15,
            createdAt: l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : "2024-01-20"
          }));
          setItems(mapped);
        }
      })
      .catch(err => console.error("Error fetching marketplace listings from DB:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const marketplaceCategories = [
    { id: "clothing", name: "Clothing & Fashion", icon: "👕", itemCount: 156 },
    { id: "books", name: "Books & Media", icon: "📚", itemCount: 89 },
    { id: "home-decor", name: "Home & Decor", icon: "🏠", itemCount: 234 },
    { id: "sports", name: "Sports & Fitness", icon: "⚽", itemCount: 123 },
    { id: "toys", name: "Toys & Games", icon: "🧸", itemCount: 67 },
    { id: "electronics", name: "Small Electronics", icon: "📱", itemCount: 198 },
    { id: "beauty", name: "Beauty & Personal Care", icon: "💄", itemCount: 145 },
    { id: "accessories", name: "Accessories & Jewelry", icon: "👜", itemCount: 112 },
  ]

  const trendingItems = items
    .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
    .slice(0, 8)

  const getCategoryColor = (categoryId) => {
    switch (categoryId) {
      case 'clothing': return 'bg-blue-50 border-blue-200 hover:bg-blue-100'
      case 'books': return 'bg-amber-50 border-amber-200 hover:bg-amber-100'
      case 'home-decor': return 'bg-orange-50 border-orange-200 hover:bg-orange-100'
      case 'sports': return 'bg-green-50 border-green-200 hover:bg-green-100'
      case 'toys': return 'bg-purple-50 border-purple-200 hover:bg-purple-100'
      case 'electronics': return 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
      case 'beauty': return 'bg-pink-50 border-pink-200 hover:bg-pink-100'
      case 'accessories': return 'bg-teal-50 border-teal-200 hover:bg-teal-100'
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }
  }

  const getCategoryImage = (categoryId) => {
    const item = items.find(i => i.category === categoryId);
    return (item && ((item.images && item.images[0]) || item.image)) || "";
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "like-new": return "bg-green-100 text-green-800"
      case "good": return "bg-blue-100 text-blue-800"
      case "fair": return "bg-yellow-100 text-yellow-800"
      case "poor": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&type=marketplace`
    }
  }

return (
  <div className="min-h-screen bg-gray-50">
    <Header />

    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">P2P Marketplace</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Buy and sell pre-loved items with other eco-conscious community members. Give items a second life and reduce waste.
        </p>
      </div>

      <div className="mb-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for items in marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-2">
            Search across {marketplaceCategories.reduce((sum, cat) => sum + cat.itemCount, 0)}+ items from our community
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {marketplaceCategories.map((category) => (
            <Link key={category.id} to={`/marketplace/category/${category.id}`}>
              <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${getCategoryColor(category.id)}`}>
                <div className="relative h-40 overflow-hidden rounded-t-lg">
                  <img
                    src={getCategoryImage(category.id)}
                    alt={category.name}
                    className="object-cover transition-transform duration-300 hover:scale-110 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{category.name}</h3>
                        <p className="text-white/80 text-xs">{category.itemCount} items available</p>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span className="text-xs text-gray-600">Community</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Trending in Marketplace</h2>
          </div>
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingItems.map((item) => (
            <Link key={item.id} to={`/marketplace/item/${item.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-48">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={getConditionColor(item.condition)}>
                      {item.condition.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-green-600">₹{item.price.toLocaleString('en-IN')}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {item.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      {item.sellerRating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Join Our Community</h2>
          <p className="text-blue-700">Connect with eco-conscious buyers and sellers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-2">Active Community</h3>
            <p className="text-blue-700 text-sm">10,000+ verified members</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-2">Eco-Friendly</h3>
            <p className="text-blue-700 text-sm">Reduce waste through reuse</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-2">Trusted Sellers</h3>
            <p className="text-blue-700 text-sm">Verified profiles and ratings</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}