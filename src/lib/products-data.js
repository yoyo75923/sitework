// Category taxonomy metadata for Amazon Green
export const categories = [
  { id: "clothing", name: "Sustainable Fashion", icon: "👕" },
  { id: "electronics", name: "Green Electronics", icon: "📱" },
  { id: "footwear", name: "Eco Footwear", icon: "👟" },
  { id: "home-garden", name: "Home & Garden", icon: "🏠" },
  { id: "personal-care", name: "Personal Care", icon: "🧴" },
  { id: "beauty-skincare", name: "Beauty & Skincare", icon: "💄" },
  { id: "sports-fitness", name: "Sports & Fitness", icon: "🏃‍♀️" },
  { id: "books-education", name: "Books & Education", icon: "📚" },
  { id: "pet-care", name: "Pet Care", icon: "🐾" },
  { id: "baby-kids", name: "Baby & Kids", icon: "👶" },
  { id: "office-stationery", name: "Office & Stationery", icon: "📝" },
  { id: "outdoor-camping", name: "Outdoor & Camping", icon: "🏕️" },
];

// All products are stored in and fetched dynamically from MongoDB via the /api/products backend.
export const allProducts = [];

export function getProductById(id) {
  return null;
}

export function getProductsByCategory(category) {
  return [];
}

export function searchProducts(query) {
  return [];
}
