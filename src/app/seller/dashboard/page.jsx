import { useAuth } from "../../../components/auth-provider"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Header from "../../../components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"
import { Checkbox } from "../../../components/ui/checkbox"
import {
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  Upload,
  Leaf,
  Award,
  Eye,
  BarChart3,
  Star,
  Globe,
  Flag,
  MapPin,
  Recycle,
  RefreshCw,
  Shield,
  Clock,
  Camera,
  Repeat,
  Edit,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"

const productCategories = [
    {
      id: "clothing",
      name: "Clothing & Apparel",
      description: "Sustainable fashion, organic textiles, eco-friendly clothing",
      fields: ["size", "material", "color", "brand", "careInstructions"],
    },
    {
      id: "electronics",
      name: "Electronics",
      description: "Energy-efficient devices, refurbished electronics, eco-tech",
      fields: ["brand", "model", "specifications", "energyRating", "warranty"],
    },
    {
      id: "home-garden",
      name: "Home & Garden",
      description: "Eco-friendly home products, sustainable gardening supplies",
      fields: ["dimensions", "material", "capacity", "powerSource", "installation"],
    },
    {
      id: "beauty-health",
      name: "Beauty & Health",
      description: "Natural cosmetics, organic health products, cruelty-free items",
      fields: ["ingredients", "skinType", "volume", "expiryDate", "certifications"],
    },
    {
      id: "sports-outdoors",
      name: "Sports & Outdoors",
      description: "Sustainable sports gear, eco-friendly outdoor equipment",
      fields: ["size", "weight", "material", "weatherResistance", "activityType"],
    },
    {
      id: "books-media",
      name: "Books & Media",
      description: "Educational content, sustainable living guides, eco-awareness media",
      fields: ["author", "publisher", "isbn", "format", "language"],
    },
    {
      id: "toys-games",
      name: "Toys & Games",
      description: "Eco-friendly toys, educational games, sustainable play items",
      fields: ["ageRange", "material", "safetyStandards", "batteryType", "dimensions"],
    },
    {
      id: "automotive",
      name: "Automotive",
      description: "Electric vehicle accessories, eco-friendly car products",
      fields: ["compatibility", "material", "installation", "warranty", "certification"],
    },
    {
      id: "food-beverages",
      name: "Food & Beverages",
      description: "Organic foods, sustainable packaging, eco-friendly beverages",
      fields: ["ingredients", "nutritionFacts", "expiryDate", "storage", "certifications"],
    },
    {
      id: "office-supplies",
      name: "Office Supplies",
      description: "Recycled paper products, eco-friendly office equipment",
      fields: ["dimensions", "material", "compatibility", "recycledContent", "certifications"],
    },
]

export default function SellerDashboard() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddRefurbished, setShowAddRefurbished] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Eco-Friendly Bamboo Toothbrush Set",
      price: 199,
      status: "active",
      views: 1247,
      orders: 89,
      revenue: 1156.11,
      rating: 4.5,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&h=300&fit=crop",
      createdAt: "2024-01-15",
      type: "new",
      category: "beauty-health",
    },
    {
      id: "2",
      name: "Solar-Powered Phone Charger",
      price: 749,
      status: "active",
      views: 892,
      orders: 34,
      revenue: 1563.66,
      rating: 4.2,
      reviewCount: 28,
      image: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=300&h=300&fit=crop",
      createdAt: "2024-01-10",
      type: "new",
      category: "electronics",
    },
  ])

  const [refurbishedProducts, setRefurbishedProducts] = useState([
    {
      id: "ref-1",
      name: "Refurbished MacBook Air 13-inch",
      price: 79999,
      status: "active",
      views: 2341,
      orders: 12,
      revenue: 10799.88,
      rating: 4.6,
      reviewCount: 45,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
      createdAt: "2024-01-12",
      type: "refurbished",
      category: "electronics",
      condition: "very-good",
      warrantyMonths: 12,
      originalAccessories: ["Power Adapter", "USB-C Cable", "Documentation"],
      missingAccessories: [],
      cosmeticCondition: "Minor scratches on the lid, screen is pristine",
      functionalityTested: true,
      originalPackaging: false,
      returnDays: 90,
    },
  ])

  const [productForm, setProductForm] = useState({
    category: "",
    itemName: "",
    manufacturerName: "",
    price: "",
    packagingCert: "",
    materialCert: "",
    description: "",
    images: [],
    packagingCertFile: null,
    materialCertFile: null,
    otherCertFiles: [],
    categoryFields: {},
  })

  const [refurbishedForm, setRefurbishedForm] = useState({
    itemName: "",
    brand: "",
    model: "",
    category: "",
    price: "",
    condition: "",
    warrantyMonths: "12",
    originalAccessories: [],
    missingAccessories: [],
    cosmeticCondition: "",
    functionalityTested: false,
    originalPackaging: false,
    returnDays: "90",
    description: "",
    images: [],
    certificationDocs: [],
  })

  // Calculate totals for dashboard
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0) + 
                      refurbishedProducts.reduce((sum, p) => sum + p.revenue, 0)
  const totalOrders = products.reduce((sum, p) => sum + p.orders, 0) + 
                     refurbishedProducts.reduce((sum, p) => sum + p.orders, 0)

  useEffect(() => {
    if (!isLoading && (!user || user.type !== "seller")) {
      navigate("/login")
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user || user.type !== "seller") {
    return null
  }

  const handleImageUpload = (e) => {
    if (e.target.files) {
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files)],
      }))
    }
  }

  const handleRefurbishedImageUpload = (e) => {
    if (e.target.files) {
      setRefurbishedForm((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files)],
      }))
    }
  }

  const handleCertificationDocsUpload = (e) => {
    if (e.target.files) {
      setRefurbishedForm((prev) => ({
        ...prev,
        certificationDocs: [...prev.certificationDocs, ...Array.from(e.target.files)],
      }))
    }
  }

  const handlePackagingCertFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductForm((prev) => ({ ...prev, packagingCertFile: e.target.files[0] }))
    }
  }

  const handleMaterialCertFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductForm((prev) => ({ ...prev, materialCertFile: e.target.files[0] }))
    }
  }

  const handleOtherCertFilesUpload = (e) => {
    if (e.target.files) {
      setProductForm((prev) => ({
        ...prev,
        otherCertFiles: [...prev.otherCertFiles, ...Array.from(e.target.files)],
      }))
    }
  }

  const handleCategoryFieldChange = (fieldName, value) => {
    setProductForm((prev) => ({
      ...prev,
      categoryFields: {
        ...prev.categoryFields,
        [fieldName]: value,
      },
    }))
  }

  const handleCategoryChange = (categoryId) => {
    setProductForm((prev) => ({
      ...prev,
      category: categoryId,
      categoryFields: {}, // Reset fields when category changes
    }))
  }

  const handleAccessoryChange = (accessory, checked, type) => {
    setRefurbishedForm((prev) => {
      const currentList = prev[type]
      if (checked) {
        return { ...prev, [type]: [...currentList, accessory] }
      } else {
        return { ...prev, [type]: currentList.filter((item) => item !== accessory) }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic
    console.log("New Product:", productForm)

    const newProduct = {
      id: (products.length + 1).toString(),
      name: productForm.itemName,
      price: parseFloat(productForm.price),
      status: "pending",
      views: 0,
      orders: 0,
      revenue: 0,
      rating: 0,
      reviewCount: 0,
      image:
        productForm.images.length > 0
          ? URL.createObjectURL(productForm.images[0])
          : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      createdAt: new Date().toISOString().split("T")[0],
      type: "new",
      category: productForm.category,
    }

    setProducts((prev) => [...prev, newProduct])
    setShowAddProduct(false)
    // Reset form
    setProductForm({
        category: "",
        itemName: "",
        manufacturerName: "",
        price: "",
        packagingCert: "",
        materialCert: "",
        description: "",
        images: [],
        packagingCertFile: null,
        materialCertFile: null,
        otherCertFiles: [],
        categoryFields: {},
    })
  }

  const handleRefurbishedSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic
    console.log("New Refurbished Product:", refurbishedForm)

    const newRefurbishedProduct = {
      id: `ref-${refurbishedProducts.length + 1}`,
      name: refurbishedForm.itemName,
      price: parseFloat(refurbishedForm.price),
      status: "pending",
      views: 0,
      orders: 0,
      revenue: 0,
      rating: 0,
      reviewCount: 0,
      image:
        refurbishedForm.images.length > 0
          ? URL.createObjectURL(refurbishedForm.images[0])
          : "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop",
      createdAt: new Date().toISOString().split("T")[0],
      type: "refurbished",
      category: refurbishedForm.category,
      condition: refurbishedForm.condition,
      warrantyMonths: parseInt(refurbishedForm.warrantyMonths),
      originalAccessories: refurbishedForm.originalAccessories,
      missingAccessories: refurbishedForm.missingAccessories,
      cosmeticCondition: refurbishedForm.cosmeticCondition,
      functionalityTested: refurbishedForm.functionalityTested,
      originalPackaging: refurbishedForm.originalPackaging,
      returnDays: parseInt(refurbishedForm.returnDays),
    }

    setRefurbishedProducts((prev) => [...prev, newRefurbishedProduct])
    setShowAddRefurbished(false)
    // Reset form
    setRefurbishedForm({
        itemName: "",
        brand: "",
        model: "",
        category: "",
        price: "",
        condition: "",
        warrantyMonths: "12",
        originalAccessories: [],
        missingAccessories: [],
        cosmeticCondition: "",
        functionalityTested: false,
        originalPackaging: false,
        returnDays: "90",
        description: "",
        images: [],
        certificationDocs: [],
    })
  }

  const renderProductRow = (product) => (
    <Card key={product.id} className="grid grid-cols-12 items-center p-4 gap-4">
      <div className="col-span-1">
        <img
          src={product.image}
          alt={product.name}
          width={50}
          height={50}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="col-span-3">
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-gray-500">ID: {product.id}</p>
      </div>
      <div className="col-span-1">
        <Badge
          className={
            product.status === "active"
              ? "bg-green-100 text-green-800"
              : product.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }
        >
          {product.status}
        </Badge>
      </div>
      <div className="col-span-1 text-center">{product.views}</div>
      <div className="col-span-1 text-center">{product.orders}</div>
      <div className="col-span-1 text-center">₹{product.revenue.toFixed(2)}</div>
      <div className="col-span-2 flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        {product.rating} ({product.reviewCount})
      </div>
      <div className="col-span-2 flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </Card>
  )

  const getConditionColor = (condition) => {
    switch (condition) {
      case "like-new":
        return "bg-green-100 text-green-800"
      case "very-good":
        return "bg-blue-100 text-blue-800"
      case "good":
        return "bg-yellow-100 text-yellow-800"
      case "acceptable":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccessoriesForCategory = (category) => {
    // This would ideally come from a config or API
    switch (category) {
      case "electronics":
        return ["Power Adapter", "USB Cable", "Manual", "Original Box"]
      case "clothing":
        return ["Tags", "Original Bag"]
      default:
        return ["Manual", "Original Box"]
    }
  }

  const renderRefurbishedProductRow = (product) => (
    <Card key={product.id} className="grid grid-cols-12 items-center p-4 gap-4">
      <div className="col-span-1">
        <img
          src={product.image}
          alt={product.name}
          width={50}
          height={50}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="col-span-3">
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-gray-500">ID: {product.id}</p>
        <Badge className={getConditionColor(product.condition)}>{product.condition.replace("-", " ")}</Badge>
      </div>
      <div className="col-span-1">
        <Badge
          className={
            product.status === "active"
              ? "bg-green-100 text-green-800"
              : product.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }
        >
          {product.status}
        </Badge>
      </div>
      <div className="col-span-1 text-center">{product.views}</div>
      <div className="col-span-1 text-center">{product.orders}</div>
      <div className="col-span-1 text-center">₹{product.revenue.toFixed(2)}</div>
      <div className="col-span-2 flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        {product.rating} ({product.reviewCount})
      </div>
      <div className="col-span-2 flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </Card>
  )
    
  const renderCategorySpecificFields = (categoryId) => {
    const category = productCategories.find(c => c.id === categoryId);
    if (!category) return null;

    return (
      <div className="space-y-4">
        {category.fields.map(field => (
          <div key={field}>
            <Label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
            <Input
              id={field}
              value={productForm.categoryFields[field] || ''}
              onChange={(e) => handleCategoryFieldChange(field, e.target.value)}
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
      </div>
    );
  };
    
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Dashboard Header with Gradient and Summary Bar */}
      <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-blue-100 py-8 px-4 mb-8 rounded-b-3xl shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center text-2xl font-bold text-green-700 shadow">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <div className="text-green-700 text-sm font-medium">Seller Dashboard</div>
            </div>
          </div>
        </div>
      </div>

        {/* Add Product Modals */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Eco-Friendly Product</CardTitle>
                <CardDescription>Fill in the details to list your new sustainable product.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input
                        id="itemName"
                        value={productForm.itemName}
                        onChange={(e) => setProductForm({ ...productForm, itemName: e.target.value })}
                        placeholder="e.g., Organic Cotton T-Shirt"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="manufacturerName">Manufacturer Name</Label>
                      <Input
                        id="manufacturerName"
                        value={productForm.manufacturerName}
                        onChange={(e) => setProductForm({ ...productForm, manufacturerName: e.target.value })}
                        placeholder="e.g., GreenThreads Co."
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={handleCategoryChange} value={productForm.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {productForm.category && renderCategorySpecificFields(productForm.category)}
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g., 29.99"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Describe the product and its eco-friendly features"
                      required
                    />
                  </div>

                  {/* Certifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sustainability Certifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="packagingCert">Packaging Certification</Label>
                        <Select
                          onValueChange={(val) => setProductForm({ ...productForm, packagingCert: val })}
                          value={productForm.packagingCert}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select packaging certification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fsc">FSC Certified</SelectItem>
                            <SelectItem value="recycled">100% Recycled Content</SelectItem>
                            <SelectItem value="compostable">Compostable</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="file" onChange={handlePackagingCertFileUpload} className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="materialCert">Material Certification</Label>
                        <Select
                          onValueChange={(val) => setProductForm({ ...productForm, materialCert: val })}
                          value={productForm.materialCert}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select material certification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gots">GOTS (Organic Textile)</SelectItem>
                            <SelectItem value="fair-trade">Fair Trade Certified</SelectItem>
                            <SelectItem value="leed">LEED Certified</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="file" onChange={handleMaterialCertFileUpload} className="mt-2" />
                      </div>
                      <div>
                        <Label>Other Certifications (e.g., Cruelty-Free)</Label>
                        <Input type="file" onChange={handleOtherCertFilesUpload} multiple className="mt-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Image Upload */}
                  <div>
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</p>
                      <Input type="file" className="sr-only" onChange={handleImageUpload} multiple />
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {productForm.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview ${index}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddProduct(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Product</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {showAddRefurbished && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add Refurbished Product</CardTitle>
                <CardDescription>Provide details for the refurbished item.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRefurbishedSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="refurbItemName">Item Name</Label>
                      <Input
                        id="refurbItemName"
                        value={refurbishedForm.itemName}
                        onChange={(e) => setRefurbishedForm({ ...refurbishedForm, itemName: e.target.value })}
                        placeholder="e.g., iPhone 12 Pro"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={refurbishedForm.brand}
                        onChange={(e) => setRefurbishedForm({ ...refurbishedForm, brand: e.target.value })}
                        placeholder="e.g., Apple"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={refurbishedForm.model}
                        onChange={(e) => setRefurbishedForm({ ...refurbishedForm, model: e.target.value })}
                        placeholder="e.g., A2407"
                      />
                    </div>
                    <div>
                      <Label htmlFor="refurbCategory">Category</Label>
                       <Select onValueChange={(val) => setRefurbishedForm({...refurbishedForm, category: val})} value={refurbishedForm.category}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="refurbPrice">Price (₹)</Label>
                    <Input
                      id="refurbPrice"
                      type="number"
                      value={refurbishedForm.price}
                      onChange={(e) => setRefurbishedForm({ ...refurbishedForm, price: e.target.value })}
                      placeholder="e.g., 65000"
                      required
                    />
                  </div>
                  
                  {/* Condition Details */}
                  <Card>
                    <CardHeader><CardTitle>Condition</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="condition">Cosmetic Condition</Label>
                            <Select onValueChange={(val) => setRefurbishedForm({...refurbishedForm, condition: val})} value={refurbishedForm.condition} required>
                                <SelectTrigger><SelectValue placeholder="Select condition"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="like-new">Like New</SelectItem>
                                    <SelectItem value="very-good">Very Good</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="acceptable">Acceptable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="cosmeticConditionDetails">Cosmetic Details</Label>
                            <Textarea id="cosmeticConditionDetails" value={refurbishedForm.cosmeticCondition} onChange={(e) => setRefurbishedForm({...refurbishedForm, cosmeticCondition: e.target.value})} placeholder="e.g., Minor scratches on the back, screen is perfect."/>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Checkbox id="functionalityTested" checked={refurbishedForm.functionalityTested} onCheckedChange={(checked) => setRefurbishedForm({...refurbishedForm, functionalityTested: checked})} />
                           <Label htmlFor="functionalityTested">All functionality tested and verified</Label>
                        </div>
                    </CardContent>
                  </Card>

                   {/* Accessories and Packaging */}
                  <Card>
                    <CardHeader><CardTitle>Accessories & Packaging</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Original Accessories Included</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                            {getAccessoriesForCategory(refurbishedForm.category).map(acc => (
                                <div key={acc} className="flex items-center space-x-2">
                                <Checkbox id={`orig-acc-${acc}`} onCheckedChange={(checked) => handleAccessoryChange(acc, checked, 'originalAccessories')} />
                                <Label htmlFor={`orig-acc-${acc}`}>{acc}</Label>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div>
                            <Label>Missing Accessories</Label>
                             <div className="grid grid-cols-2 gap-2 mt-2">
                            {getAccessoriesForCategory(refurbishedForm.category).map(acc => (
                                <div key={acc} className="flex items-center space-x-2">
                                <Checkbox id={`miss-acc-${acc}`} onCheckedChange={(checked) => handleAccessoryChange(acc, checked, 'missingAccessories')} />
                                <Label htmlFor={`miss-acc-${acc}`}>{acc}</Label>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Checkbox id="originalPackaging" checked={refurbishedForm.originalPackaging} onCheckedChange={(checked) => setRefurbishedForm({...refurbishedForm, originalPackaging: checked})} />
                           <Label htmlFor="originalPackaging">Ships in Original Packaging</Label>
                        </div>
                    </CardContent>
                  </Card>
                  
                  {/* Warranty & Returns */}
                  <Card>
                    <CardHeader><CardTitle>Warranty & Returns</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="warranty">Warranty Period (Months)</Label>
                                <Input id="warranty" type="number" value={refurbishedForm.warrantyMonths} onChange={(e) => setRefurbishedForm({...refurbishedForm, warrantyMonths: e.target.value})} />
                            </div>
                            <div>
                                <Label htmlFor="returns">Return Period (Days)</Label>
                                <Input id="returns" type="number" value={refurbishedForm.returnDays} onChange={(e) => setRefurbishedForm({...refurbishedForm, returnDays: e.target.value})} />
                            </div>
                        </div>
                    </CardContent>
                  </Card>


                  <div>
                    <Label htmlFor="refurbDescription">Description</Label>
                    <Textarea
                      id="refurbDescription"
                      value={refurbishedForm.description}
                      onChange={(e) => setRefurbishedForm({ ...refurbishedForm, description: e.target.value })}
                      placeholder="Describe the refurbished item and what has been tested/replaced"
                      required
                    />
                  </div>
                  
                   {/* Image Upload */}
                  <div>
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</p>
                      <Input type="file" className="sr-only" onChange={handleRefurbishedImageUpload} multiple />
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {refurbishedForm.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview ${index}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                   {/* Certification Docs Upload */}
                    <div>
                        <Label>Certification Documents</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">Upload testing & certification documents</p>
                        <Input type="file" className="sr-only" onChange={handleCertificationDocsUpload} multiple />
                        </div>
                    </div>


                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddRefurbished(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Refurbished Product</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 border-b">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 font-medium ${
                  activeTab === "overview" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`py-4 px-1 font-medium ${
                  activeTab === "products" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("products")}
              >
                New Products
              </button>
              <button
                className={`py-4 px-1 font-medium ${
                  activeTab === "refurbished" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("refurbished")}
              >
                Refurbished Items
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="w-5 h-5 text-blue-500 bg-blue-100 rounded-full p-1" />
                      Total Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{products.length + refurbishedProducts.length}</div>
                    <p className="text-sm text-gray-600">{products.length} new, {refurbishedProducts.length} refurbished</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="w-5 h-5 text-green-500 bg-green-100 rounded-full p-1" />
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                    <p className="text-sm text-gray-600">Total earnings</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-purple-500 bg-purple-100 rounded-full p-1" />
                      Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalOrders}</div>
                    <p className="text-sm text-gray-600">Total orders</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Repeat className="w-5 h-5 text-yellow-500 bg-yellow-100 rounded-full p-1" />
                      Repeat Customer %
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">37%</div>
                    <p className="text-sm text-gray-600">Repeat customers</p>
                  </CardContent>
                </Card>
              </div>

              {/* Environmental Impact Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                      <Leaf className="w-5 h-5 text-green-600" />
                      CO₂ Prevented
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-700">2,847 kg</div>
                    <p className="text-sm text-green-600">Carbon emissions saved</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                      <RefreshCw className="w-5 h-5 text-blue-600" />
                      Items Renewed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-700">
                      {refurbishedProducts.reduce((sum, p) => sum + p.orders, 0)}
                    </div>
                    <p className="text-sm text-blue-600">Items given new life</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-yellow-800">
                      <Repeat className="w-5 h-5 text-yellow-600" />
                      Repeat Customer %
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-700">37%</div>
                    <p className="text-sm text-yellow-600">Percentage of customers who made more than one purchase</p>
                  </CardContent>
                </Card>
              </div>

              {/* Leaderboards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Globe className="w-5 h-5" />
                      Global Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="font-semibold">🥇 EcoTech Solutions</span>
                        <span className="text-sm text-gray-600">15.2M kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-semibold">🥈 Green Living Co.</span>
                        <span className="text-sm text-gray-600">12.8M kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="font-semibold">🥉 Sustainable Goods</span>
                        <span className="text-sm text-gray-600">9.4M kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-100 rounded border-2 border-green-300">
                        <span className="font-bold text-green-800">#{Math.floor(Math.random() * 50) + 15} You</span>
                        <span className="text-sm text-green-700 font-semibold">2.8k kg CO₂</span>
                      </div>
                    </div>
                </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Flag className="w-5 h-5" />
                      National Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="font-semibold">🥇 EcoTech Solutions</span>
                        <span className="text-sm text-gray-600">2.1M kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-semibold">🥈 Pure Earth</span>
                        <span className="text-sm text-gray-600">1.9M kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="font-semibold">🥉 Clean Future</span>
                        <span className="text-sm text-gray-600">1.6M kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-100 rounded border-2 border-green-300">
                        <span className="font-bold text-green-800">#{Math.floor(Math.random() * 20) + 8} You</span>
                        <span className="text-sm text-green-700 font-semibold">2.8k kg CO₂</span>
                      </div>
                    </div>
                </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <MapPin className="w-4 h-4" />
                      Local Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="font-semibold">🥇 Local Green Store</span>
                        <span className="text-sm text-gray-600">45k kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-semibold">🥈 EcoMart</span>
                        <span className="text-sm text-gray-600">32k kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="font-semibold">🥉 Green Choice</span>
                        <span className="text-sm text-gray-600">21k kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-100 rounded border-2 border-green-300">
                        <span className="font-bold text-green-800">#7 You</span>
                        <span className="text-sm text-green-700 font-semibold">2.8k kg CO₂</span>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* Sustainability Education Panel */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Leaf className="w-5 h-5" />
                  Seller Sustainability Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Award className="w-8 h-8 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Certification Verification</h3>
                      <p className="text-green-700 text-sm">
                        Learn how we verify sustainability certifications and what documentation is required for each type.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-8 h-8 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Eco-Friendly Packaging</h3>
                      <p className="text-green-700 text-sm">
                        Best practices for sustainable packaging that reduces waste and appeals to eco-conscious customers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-8 h-8 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Refurbished Standards</h3>
                      <p className="text-green-700 text-sm">
                        Quality standards and testing requirements for refurbished items to ensure customer satisfaction.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your New Products</h2>
              <Button onClick={() => setShowAddProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 p-4 text-sm font-semibold text-gray-500">
                <div className="col-span-1">Image</div>
                <div className="col-span-3">Name</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-center">Views</div>
                <div className="col-span-1 text-center">Orders</div>
                <div className="col-span-1 text-center">Revenue</div>
                <div className="col-span-2">Rating</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {products.map(renderProductRow)}
            </div>
          </div>
        )}

        {activeTab === "refurbished" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Refurbished Products</h2>
              <Button onClick={() => setShowAddRefurbished(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Refurbished Product
              </Button>
            </div>
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 p-4 text-sm font-semibold text-gray-500">
                <div className="col-span-1">Image</div>
                <div className="col-span-3">Name</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-center">Views</div>
                <div className="col-span-1 text-center">Orders</div>
                <div className="col-span-1 text-center">Revenue</div>
                <div className="col-span-2">Rating</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {refurbishedProducts.map(renderRefurbishedProductRow)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}