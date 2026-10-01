import { createContext, useContext, useState, useEffect } from "react"
import { cartAPI } from "../services/api"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const storedCart = localStorage.getItem("amazon-green-cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (e) {}
    }

    // Try fetching live cart from backend
    cartAPI.get()
      .then(res => {
        if (res && res.items && res.items.length > 0) {
          const mapped = res.items.map(ci => ({
            id: ci.product?._id || ci.product?.id || ci.product,
            name: ci.product?.name || "Eco Product",
            price: ci.price || ci.product?.price || 0,
            quantity: ci.quantity,
            image: ci.product?.image || (ci.product?.images && ci.product?.images[0]),
            greenRating: ci.product?.greenRating,
          }))
          setItems(mapped)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem("amazon-green-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (item) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })

    if (item.id) {
      cartAPI.addItem(item.id, 1).catch(() => {})
    }
  }

  const removeFromCart = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    cartAPI.removeItem(id).catch(() => {})
  }

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      removeFromCart(id)
    } else {
      setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
      cartAPI.updateItem(id, quantity).catch(() => {})
    }
  }

  const clearCart = () => {
    setItems([])
    cartAPI.clear().catch(() => {})
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 