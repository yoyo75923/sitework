import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { marketplaceAPI } from "../../../../services/api";
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
  Receipt,
  Users,
  Star,
  ArrowLeft,
} from "lucide-react";

export default function MarketplaceCategoryPage() {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    marketplaceAPI.getAll({ category: slug })
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
      .catch(err => console.error("Error fetching category marketplace listings:", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categoryInfo = {
    clothing: { name: "Clothing & Fashion", icon: "👕", color: "blue" },
    books: { name: "Books & Media", icon: "📚", color: "amber" },
    "home-decor": { name: "Home & Decor", icon: "🏠", color: "orange" },
    sports: { name: "Sports & Fitness", icon: "⚽", color: "green" },
    toys: { name: "Toys & Games", icon: "🧸", color: "purple" },
    electronics: { name: "Small Electronics", icon: "📱", color: "indigo" },
    beauty: { name: "Beauty & Personal Care", icon: "💄", color: "pink" },
    accessories: { name: "Accessories & Jewelry", icon: "👜", color: "teal" },
  };

  const category = categoryInfo[slug];

  useEffect(() => {
    let filtered = items.filter((item) => item.category === slug);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Condition filter
    if (selectedCondition !== "all") {
      filtered = filtered.filter((item) => item.condition === selectedCondition);
    }

    // Price filter
    if (priceRange !== "all") {
      if (priceRange === "under-25") {
        filtered = filtered.filter((item) => item.price < 25);
      } else if (priceRange === "25-50") {
        filtered = filtered.filter((item) => item.price >= 25 && item.price <= 50);
      } else if (priceRange === "50-100") {
        filtered = filtered.filter((item) => item.price >= 50 && item.price <= 100);
      } else if (priceRange === "over-100") {
        filtered = filtered.filter((item) => item.price > 100);
      }
    }

    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.views + b.likes - (a.views + a.likes));
    } else if (sortBy === "newest") {
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setFilteredItems(filtered);
  }, [items, slug, searchQuery, selectedCondition, priceRange, sortBy]);

  const getConditionColor = (condition) => {
    switch (condition) {
      case "like-new":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link to="/marketplace">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{category.icon}</span>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          </div>
          <p className="text-gray-600">
            Browse {filteredItems.length} items in {category.name.toLowerCase()}
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
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
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
                        <SelectItem value="under-25">Under $25</SelectItem>
                        <SelectItem value="25-50">$25 - $50</SelectItem>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="over-100">Over $100</SelectItem>
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
                        setSearchQuery("");
                        setSelectedCondition("all");
                        setPriceRange("all");
                        setSortBy("newest");
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
              <Link to={`/marketplace/item/${item.id}`} key={item.id}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative aspect-square">
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {item.hasReceipt && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Receipt className="w-3 h-3 mr-1" />
                            Receipt
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge className={getConditionColor(item.condition)}>
                          {item.condition.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-blue-600">₹{item.price.toLocaleString('en-IN')}</span>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{item.likes}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                      {/* Seller Info */}
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
                setSearchQuery("");
                setSelectedCondition("all");
                setPriceRange("all");
                setSortBy("newest");
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 