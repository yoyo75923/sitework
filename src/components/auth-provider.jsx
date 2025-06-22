import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session only on client side
    if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem("amazon-green-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    // Demo authentication
    if (email === "customer@amazon-green.com" && password === "Customer123!") {
      const customerUser = { email, type: "customer", name: "Satvik" }
      setUser(customerUser)
      if (typeof window !== 'undefined') {
      localStorage.setItem("amazon-green-user", JSON.stringify(customerUser))
      }
      return true
    } else if (email === "seller@amazon-green.com" && password === "Seller123!") {
      const sellerUser = { email, type: "seller", name: "Green Seller Co." }
      setUser(sellerUser)
      if (typeof window !== 'undefined') {
      localStorage.setItem("amazon-green-user", JSON.stringify(sellerUser))
      }
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
    localStorage.removeItem("amazon-green-user")
    // Redirect to login page
    window.location.href = "/login"
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 