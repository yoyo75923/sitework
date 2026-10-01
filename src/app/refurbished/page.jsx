import { useState, useEffect, useMemo } from "react";
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
  Shield,
  Recycle,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { productAPI } from "../../services/api";

export default function RefurbishedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    productAPI.getAll({ type: 'refurbished' })
      .then(res => {
        if (res && res.products) {
          const mapped = res.products.map(p => ({
            ...p,
            id: p.legacyId || p._id,
            name: p.name || p.title,
            price: p.refurbishedPrice || p.price,
            originalPrice: p.originalPrice || Math.round((p.refurbishedPrice || p.price) * 1.3),
            savings: p.savings || Math.max(0, (p.originalPrice || Math.round((p.refurbishedPrice || p.price) * 1.3)) - (p.refurbishedPrice || p.price)),
            condition: p.condition || 'Excellent',
            warranty: p.warranty || '1 Year Warranty',
            image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || ''),
            brand: p.brand || 'Certified',
            category: p.category || 'smartphones',
            inStock: p.inStock !== false,
            features: p.features || [],
            seller: {
              name: p.sellerName || 'Verified Refurbisher',
              isVerified: true,
              rating: p.sellerRating || 4.8,
              totalSales: p.sellerSales || 150
            }
          }));
          setItems(mapped);
        }
      })
      .catch(err => console.error("Error fetching refurbished items from DB:", err));
  }, []);

  const refurbishedCategories = [
    {
      id: "smartphones",
      name: "Smartphones",
      icon: "📱",
      itemCount: 234,
      avgSavings: 35,
    },
    {
      id: "laptops",
      name: "Laptops",
      icon: "💻",
      itemCount: 156,
      avgSavings: 40,
    },
    { id: "tablets", name: "Tablets", icon: "📱", itemCount: 89, avgSavings: 30 },
    {
      id: "smartwatches",
      name: "Smartwatches",
      icon: "⌚",
      itemCount: 67,
      avgSavings: 25,
    },
    {
      id: "headphones",
      name: "Headphones",
      icon: "🎧",
      itemCount: 123,
      avgSavings: 45,
    },
    {
      id: "cameras",
      name: "Cameras",
      icon: "📷",
      itemCount: 78,
      avgSavings: 50,
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: "🎮",
      itemCount: 45,
      avgSavings: 35,
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: "🔌",
      itemCount: 189,
      avgSavings: 20,
    },
  ];

  const trendingItems = items
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 8);

  const getCategoryColor = (categoryId) => {
    switch (categoryId) {
      case "smartphones":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "laptops":
        return "bg-indigo-50 border-indigo-200 hover:bg-indigo-100";
      case "tablets":
        return "bg-purple-50 border-purple-200 hover:bg-purple-100";
      case "smartwatches":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "headphones":
        return "bg-orange-50 border-orange-200 hover:bg-orange-100";
      case "cameras":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case "gaming":
        return "bg-pink-50 border-pink-200 hover:bg-pink-100";
      case "accessories":
        return "bg-teal-50 border-teal-200 hover:bg-teal-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const getCategoryImage = (categoryId) => {
    const item = items.find(i => i.category === categoryId);
    return (item && (item.image || (item.images && item.images[0]))) || "";
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Very Good":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
  
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refurbished Products</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover a wide range of high-quality refurbished products—smartphones, laptops, tablets, accessories, and more. All items are professionally restored, come with warranties, and help you save money while reducing waste and supporting the circular economy.
          </p>
        </div>
  
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for refurbished products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-2">
              Search across {refurbishedCategories.reduce((sum, cat) => sum + cat.itemCount, 0)}+ refurbished items
            </p>
          </div>
        </div>
  
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {refurbishedCategories.map((category) => (
              <Link key={category.id} to={`/refurbished/category/${category.id}`}>
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
                          <p className="text-white/80 text-xs">{category.itemCount} items • {category.avgSavings}% avg savings</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Recycle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-gray-600">Refurbished</span>
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
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Biggest Savings</h2>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Recycle className="w-3 h-3 mr-1" />
              Top Deals
            </Badge>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingItems.map((item) => (
              <Link key={item.id} to={`/refurbished/item/${item.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={getConditionColor(item.condition)}>
                        {item.condition}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-100 text-green-800 text-xs font-bold">
                        Save ₹{item.savings.toLocaleString('en-IN')}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-lg font-bold text-green-600">₹{item.price.toLocaleString('en-IN')}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-500">{item.warranty}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {item.seller.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{item.seller.name}</span>
                        {item.seller.isVerified && (
                          <Shield className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
  
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Why Choose Refurbished?</h2>
            <p className="text-green-700">Quality electronics at a fraction of the price</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Reduce E-Waste</h3>
              <p className="text-green-700 text-sm">Give electronics a second life</p>
            </div>
  
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Warranty Protected</h3>
              <p className="text-green-700 text-sm">All items come with warranty</p>
            </div>
  
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Quality Tested</h3>
              <p className="text-green-700 text-sm">Rigorous testing and certification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}