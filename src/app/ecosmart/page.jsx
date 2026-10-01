import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import { useAuth } from "../../components/auth-provider";
import { useCart } from "../../components/cart-provider";
import { productAPI } from "../../services/api";
export default function AmazonClone() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { logout } = useAuth();
  const { totalItems, addToCart, clearCart } = useCart();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("amazon-green-user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    }
  }, []);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    productAPI.getAll().then(res => {
      if (res && res.products) {
        setProducts(res.products.slice(0, 8).map(p => ({
          ...p,
          id: p.legacyId || p._id,
          name: p.name || p.title,
          price: p.price,
          originalPrice: p.originalPrice || Math.round(p.price * 1.2),
          image: p.image || (p.images && p.images[0]) || "",
          badge: p.rating >= 4.5 ? "Best Seller" : "Amazon's Choice",
          discount: "15% off",
          description: p.description,
          features: p.features || ["Eco-certified", "Sustainable materials"],
          specifications: p.specifications || {}
        })));
      }
    }).catch(err => console.error("Error fetching ecosmart products:", err));
  }, []);

  const handleAmazonGreen = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("amazon-green-user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.type === "seller") {
          navigate("/seller/dashboard");
          return;
        } else if (user.type === "customer") {
          navigate("/products");
          return;
        }
      }
    }
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header with greeting */}
      <div className="w-full bg-[#232f3e] text-white text-sm">
        <div className="max-w-6xl mx-auto flex justify-end items-center px-4 py-3 gap-4">
          <span>Hello, {userName ?? "Guest"}</span>
          <button
            onClick={() => {
              logout();
              clearCart();
            }}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition text-white text-xs font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>
      {/* Amazon-style Header */}
      <header className="bg-[#131921] text-white py-2 sticky top-0 z-40 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-label="cart">🛒</span>
            <span className="text-2xl font-bold cursor-pointer hover:text-orange-300 transition-colors select-none" onClick={() => navigate("/")}>amazon</span>
          </div>
          {/* Search bar */}
          <div className="flex-grow mx-2 max-w-2xl">
            <div className="relative flex rounded-lg overflow-hidden">
              {/* Filter Dropdown */}
              <button className="flex items-center px-4 py-3 bg-gray-200 text-black font-normal text-base rounded-l-lg border-r border-gray-300 focus:outline-none">
                Select Category
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search Amazon"
                className="flex-grow px-4 py-3 text-gray-700 text-base font-normal focus:outline-none bg-white"
                style={{ minWidth: 0 }}
              />
              <button className="px-6 bg-[#ff9900] hover:bg-[#f3a847] text-black text-lg rounded-r-lg transition-colors flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          {/* Right section */}
          <div className="flex items-center space-x-4 text-sm">
            {/* Prime Button */}
            <button
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow"
              style={{ fontSize: '1rem' }}
              onClick={handleAmazonGreen}
            >
              <span className="text-xl mr-1" role="img" aria-label="crown">👑</span>
              Prime
            </button>
            <button
              className="relative flex items-center hover:text-orange-300 transition-colors"
              onClick={() => navigate("/cart")}
            >
              <span className="text-2xl mr-1" role="img" aria-label="cart">🛍️</span>
              <span className="absolute -top-1 -right-1 text-xs bg-[#febd69] text-black px-1.5 py-0.5 rounded-full font-bold">
                {totalItems}
              </span>
              <span>Cart</span>
            </button>
            <button
              className="flex items-center gap-1 hover:text-orange-300 transition-colors"
              onClick={() => {
                if (typeof window !== "undefined") {
                  const storedUser = localStorage.getItem("amazon-green-user");
                  if (storedUser) {
                    const user = JSON.parse(storedUser);
                    if (user.type === "seller") {
                      navigate("/seller/dashboard");
                    } else if (user.type === "customer") {
                      navigate("/customer/dashboard");
                    } else {
                      navigate("/customer/dashboard");
                    }
                  } else {
                    navigate("/customer/dashboard");
                  }
                }
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              Account
            </button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="w-full bg-[#232f3e] text-white text-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-6 overflow-x-auto px-4 py-3">
          <button
            className="flex items-center gap-1 hover:text-orange-300 transition-colors font-semibold"
            onClick={() => navigate("/ecosmart")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            Home
          </button>
          <span className="cursor-pointer hover:text-orange-300 transition-colors whitespace-nowrap">Electronics</span>
          <span className="cursor-pointer hover:text-orange-300 transition-colors whitespace-nowrap">Books</span>
          <span className="cursor-pointer hover:text-orange-300 transition-colors whitespace-nowrap">Fashion</span>
          <span className="cursor-pointer hover:text-orange-300 transition-colors whitespace-nowrap">Home & Kitchen</span>
          <span className="cursor-pointer hover:text-orange-300 transition-colors whitespace-nowrap">Toys</span>
          <span className="cursor-pointer hover:text-orange-300 transition-colors whitespace-nowrap">Sports</span>
          <span className="cursor-pointer hover:text-orange-300 transition-colors whitespace-nowrap">More</span>
          <button
            onClick={handleAmazonGreen}
            className="ml-auto bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition text-white text-sm font-semibold shadow"
          >
            🌱 AmazonGreen
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative h-56 flex items-center justify-center bg-gradient-to-r from-yellow-50 to-blue-50 mb-8">
        <div className="text-center z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome to Amazon Marketplace</h2>
          <p className="text-gray-700 text-lg">Everything you need, delivered to your door. Discover millions of products at great prices.</p>
        </div>
        <div className="absolute inset-0 opacity-15 bg-gradient-to-r from-emerald-800 to-teal-900" />
      </section>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer flex flex-col"
              onClick={() => navigate(`/ecosmart/${product.id}`)}
            >
              <div className="relative h-44 bg-gray-50 rounded-t-lg flex items-center justify-center">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-contain p-4 h-full w-full"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h4>
                <div className="mt-auto flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>
                <button
                  className="mt-4 w-full bg-[#febd69] hover:bg-[#f3a847] text-black text-sm font-semibold py-2 rounded-md transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: String(product.id),
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      greenRating: 0,
                      certifications: 0,
                    });
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full bg-[#232f3e] text-white mt-12 py-6 text-center text-sm">
        <div className="font-bold text-lg mb-1">amazon</div>
        <div>© 2024, Amazon.com, Inc. or its affiliates</div>
      </footer>

      {selectedProduct && <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
