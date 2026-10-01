import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../../../components/header";
import { Card, CardContent, CardMedia } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Badge } from "../../../../components/ui/badge";
import {
  Search,
  Filter,
  MapPin,
  Heart,
  Eye,
  Shield,
  Users,
  Star,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import { productAPI } from "../../../../services/api";

export default function RefurbishedCategoryPage() {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    productAPI.getAll({ type: 'refurbished', category: slug })
      .then(res => {
        if (res && res.products) {
          const mapped = res.products.map(p => ({
            ...p,
            id: p.legacyId || p._id,
            title: p.title || p.name,
            refurbishedPrice: p.refurbishedPrice || p.price,
            originalPrice: p.originalPrice || Math.round((p.refurbishedPrice || p.price) * 1.3),
            images: p.images && p.images.length > 0 ? p.images : [p.image],
            warranty: p.warranty || '1 Year',
            sellerName: p.sellerName || 'Verified Refurbisher',
            sellerRating: p.sellerRating || 4.8,
            sellerSales: p.sellerSales || 50,
          }));
          setItems(mapped);
        }
      })
      .catch(err => console.error("Error fetching refurbished products from DB:", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const categoryInfo = {
    laptops: { name: "Laptops & Computers", icon: "💻", color: "blue" },
    smartphones: { name: "Smartphones", icon: "📱", color: "green" },
    phones: { name: "Smartphones", icon: "📱", color: "green" },
    tablets: { name: "Tablets", icon: "📱", color: "purple" },
    audio: { name: "Audio & Headphones", icon: "🎧", color: "orange" },
    headphones: { name: "Audio & Headphones", icon: "🎧", color: "orange" },
    smartwatches: { name: "Smartwatches & Wearables", icon: "⌚", color: "green" },
    gaming: { name: "Gaming Consoles", icon: "🎮", color: "indigo" },
    cameras: { name: "Cameras & Photography", icon: "📷", color: "teal" },
    accessories: { name: "Accessories", icon: "🔌", color: "teal" },
  };
  
  const category = categoryInfo[slug] || {
    name: slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : "Refurbished Items",
    icon: "♻️",
    color: "green"
  };
  
  useEffect(() => {
    let filtered = [...items];
  
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  
    // Condition filter
    if (selectedCondition !== "all") {
      filtered = filtered.filter((item) => item.condition === selectedCondition)
    }
  
    // Price filter
    if (priceRange !== "all") {
      if (priceRange === "under-200") {
        filtered = filtered.filter((item) => item.refurbishedPrice < 200 * 83)
      } else if (priceRange === "200-500") {
        filtered = filtered.filter((item) => item.refurbishedPrice >= 200 * 83 && item.refurbishedPrice <= 500 * 83)
      } else if (priceRange === "500-1000") {
        filtered = filtered.filter((item) => item.refurbishedPrice >= 500 * 83 && item.refurbishedPrice <= 1000 * 83)
      } else if (priceRange === "over-1000") {
        filtered = filtered.filter((item) => item.refurbishedPrice > 1000 * 83)
      }
    }
  
    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.refurbishedPrice - b.refurbishedPrice)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.refurbishedPrice - a.refurbishedPrice)
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.views + b.likes - (a.views + a.likes))
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  
    setFilteredItems(filtered)
  }, [items, slug, searchQuery, selectedCondition, priceRange, sortBy])
  
  const getConditionColor = (condition) => {
    switch (condition) {
      case "excellent": return "bg-green-100 text-green-800"
      case "very-good": return "bg-blue-100 text-blue-800"
      case "good": return "bg-yellow-100 text-yellow-800"
      case "fair": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }
  
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
            <Link to="/refurbished">
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Refurbished
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
  
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/refurbished" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Refurbished
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          </div>
          <p className="text-gray-600">
            Browse {filteredItems.length} refurbished items in {category.name.toLowerCase()}
          </p>
        </div>
  
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
  
          {/* Filters */}
          {showFilters && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Condition</label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="very-good">Very Good</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under-200">Under ₹200</SelectItem>
                        <SelectItem value="200-500">₹200 - ₹500</SelectItem>
                        <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                        <SelectItem value="over-1000">Over ₹1000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCondition("all")
                        setPriceRange("all")
                        setSortBy("newest")
                      }}
                      className="w-full"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
  
        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
          </p>
        </div>
  
        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Link to={`/refurbished/item/${item.id}`} key={item.id}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          {item.warranty}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge className={getConditionColor(item.condition)}>
                          {item.condition.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
  
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
  
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-2xl font-bold text-green-600">₹{item.refurbishedPrice.toLocaleString('en-IN')}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{item.likes}</span>
                        </div>
                      </div>
  
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
  
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {item.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {feature}
                            </Badge>
                          ))}
                          {item.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
  
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-sm font-medium text-gray-900">{item.sellerName}</span>
                              <div className="flex items-center">{renderStars(item.sellerRating)}</div>
                            </div>
                            <div className="text-xs text-gray-500">{item.sellerSales} sales</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                              <MapPin className="w-3 h-3" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Eye className="w-3 h-3" />
                              <span>{item.views} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCondition("all")
                setPriceRange("all")
                setSortBy("newest")
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}  