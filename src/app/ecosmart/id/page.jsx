import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductDetailsClient from "./ProductDetailsClient";
import Header from "../../../components/header";
import { productAPI } from "../../../services/api";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productAPI.getById(id)
      .then(res => {
        if (res) {
          const mapped = {
            ...res,
            id: res.legacyId || res._id,
            name: res.name || res.title,
            price: res.price,
            originalPrice: res.originalPrice || Math.round(res.price * 1.2),
            image: res.image || (res.images && res.images[0]) || "",
            badge: res.rating >= 4.5 ? "Best Seller" : "Amazon's Choice",
            discount: "15% off",
            category: res.category || "electronics",
            description: res.description,
            features: res.features && res.features.length > 0 ? res.features : [
              "Industry-leading noise canceling / smart technology",
              "Long-lasting battery life",
              "Premium quality build and materials"
            ],
            specifications: res.specifications || {
              "Brand": res.brand || "Amazon Green",
              "Warranty": res.warranty || "1 Year",
              "Condition": "Certified"
            }
          };
          setProduct(mapped);

          // Fetch eco-friendly alternatives
          productAPI.getAll().then(allRes => {
            if (allRes && allRes.products) {
              const alts = allRes.products
                .filter(p => (p.legacyId || p._id) !== (res.legacyId || res._id))
                .slice(0, 3)
                .map(p => ({
                  id: p.legacyId || p._id,
                  name: p.name || p.title,
                  price: p.price,
                  image: p.image || (p.images && p.images[0]) || ""
                }));
              setAlternatives(alts);
            }
          }).catch(() => {});
        }
      })
      .catch(err => console.error("Error fetching product from DB:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading product details from database...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <a href="/ecosmart" className="text-blue-600 hover:underline">Back to EcoSmart</a>
      </div>
    );
  }

  return <ProductDetailsClient product={product} alternatives={alternatives} />;
}
