import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("amazon-green-user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {}
      }
      // Verify session with backend if possible
      authAPI.getMe()
        .then(res => {
          if (res && res.user) {
            setUser(res.user)
            localStorage.setItem("amazon-green-user", JSON.stringify(res.user))
          }
        })
        .catch(() => {
          // If offline or not logged in, keep existing or clear
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [])

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password)
      if (res && res.user) {
        setUser(res.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem("amazon-green-user", JSON.stringify(res.user))
        }
        return true
      }
    } catch (err) {
      console.warn("API login attempt note:", err.message)
    }

    // Demo fallback authentication
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

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData)
      if (res && res.user) {
        setUser(res.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem("amazon-green-user", JSON.stringify(res.user))
        }
        return true
      }
    } catch (err) {
      throw err
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (e) {}
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("amazon-green-user")
      window.location.href = "/login"
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 