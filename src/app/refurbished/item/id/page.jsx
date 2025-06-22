import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Header from "../../../../components/header"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { ArrowLeft, Heart, Share2, Star, Shield, Award, Leaf, ShoppingCart } from "lucide-react"

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

// Add mock items for lookup
const refItems = {
  "refurb-1": {
    id: "refurb-1",
    name: "iPhone 13 Pro - Refurbished",
    originalPrice: 999.99 * 83,
    price: 649.99 * 83,
    savings: 350.0 * 83,
    condition: "Excellent",
    warranty: "1 Year Apple Warranty",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    brand: "Apple",
    category: "smartphones",
    inStock: true,
    features: ["128GB Storage", "Face ID", "Triple Camera System", "5G Ready"],
    detailedDescription: "This iPhone 13 Pro has been professionally refurbished to excellent condition. It features the powerful A15 Bionic chip, stunning Super Retina XDR display, and an advanced triple-camera system. The device has been thoroughly tested and cleaned, with any necessary parts replaced to ensure optimal performance.",
    specifications: {
      Display: "6.1-inch Super Retina XDR",
      Chip: "A15 Bionic",
      Storage: "128GB",
      Camera: "Triple 12MP system",
      Battery: "Up to 22 hours video playback",
      "Water Resistance": "IP68",
      "5G": "Yes",
      "Face ID": "Yes",
    },
    conditionDetails: [
      "Screen is in perfect condition with no scratches",
      "Body shows minimal signs of use",
      "All buttons and ports function perfectly",
      "Battery health is 85% or higher",
      "Camera lenses are clear and scratch-free",
    ],
    whatsIncluded: ["iPhone 13 Pro device", "Lightning to USB-C cable", "Documentation", "1 Year Apple Warranty"],
    seller: {
      name: "TechHub Electronics",
      isVerified: true,
      rating: 4.8,
      totalSales: 1247,
    },
  },
  // ...repeat for all refurb-2, refurb-3, etc. from main page...
}

export default function RefurbishedItemPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Lookup for mock smartphones
  const item = refItems[params.id] || refItems["refurb-1"]

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "text-green-500"
      case "very good":
        return "bg-blue-100 text-blue-800"
      case "good":
        return "bg-yellow-100 text-yellow-800"
      case "fair":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const savingsPercentage = Math.round((item.savings / item.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Refurbished Items
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white rounded-lg overflow-hidden">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover w-full h-full" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-red-100 text-red-800 font-bold">Save ₹{item.savings.toLocaleString('en-IN')}</Badge>
                <Badge className={getConditionColor(item.condition)}>{item.condition}</Badge>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-100 text-green-800">Refurbished</Badge>
              </div>
            </div>

            {/* Additional product images would go here */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-green-500"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={`${item.name} view ${i}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.brand}</span>
                <Badge className="bg-green-100 text-green-800">Refurbished</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>

              {/* Seller Info */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-medium text-gray-900">Sold by: {item.seller.name}</span>
                {item.seller.isVerified && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Seller
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">{renderStars(item.seller.rating)}</div>
                <span className="text-sm text-gray-600">({item.seller.totalSales} total sales)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-green-600">₹{item.price.toLocaleString('en-IN')}</span>
                <span className="text-xl text-gray-500 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-lg text-green-600 font-semibold mb-2">
                You save ₹{item.savings.toLocaleString('en-IN')} ({savingsPercentage}% off)
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Shield className="w-4 h-4" />
                <span>{item.warranty}</span>
              </div>
            </div>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {item.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart Section */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-green-600 font-medium">{item.inStock ? "✓ In Stock" : "Out of Stock"}</div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600" size="lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-red-500 border-red-200" : ""}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Eco & Quality Assurance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Eco & Quality Promise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">A sustainable choice that reduces e-waste.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Professionally inspected, tested, and cleaned.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {/* These would be state-controlled tabs */}
              <a href="#" className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-green-500 text-green-600">
                Detailed Description
              </a>
              <a href="#" className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Specifications
              </a>
              <a href="#" className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Condition Details
              </a>
              <a href="#" className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                What's Included
              </a>
            </nav>
          </div>
          <div className="py-6">
            {/* Tab content would be rendered here */}
            <p className="text-gray-700 leading-relaxed">{item.detailedDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 