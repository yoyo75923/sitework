import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../components/auth-provider"

export default function HomePage() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate("/ecosmart")
      } else {
        navigate("/login")
      }
    }
  }, [user, isLoading, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Amazon Green...</p>
      </div>
    </div>
  )
}