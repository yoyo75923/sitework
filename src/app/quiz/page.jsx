import { useState, useEffect, useMemo } from "react"
import Header from "../../components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { 
  Brain, 
  Leaf, 
  Award, 
  Clock, 
  Users, 
  TrendingUp, 
  BookOpen, 
  CheckCircle,
  Play,
  Star,
  Target,
  Zap
} from "lucide-react"
import { getAllQuizzes, getQuizzesByCategory } from "../../lib/quiz-data"
import { useQuiz } from "../../components/quiz-provider"
import { useAuth } from "../../components/auth-provider"
import { Link } from "react-router-dom"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter
} from "../../components/ui/dialog";

const categoryIcons = {
  'sustainability': Leaf,
  'eco-products': Award,
  'climate-change': TrendingUp,
  'recycling': BookOpen,
  'energy': Zap
}

const categoryColors = {
  'sustainability': 'bg-green-100 text-green-800 border-green-200',
  'eco-products': 'bg-blue-100 text-blue-800 border-blue-200',
  'climate-change': 'bg-orange-100 text-orange-800 border-orange-200',
  'recycling': 'bg-purple-100 text-purple-800 border-purple-200',
  'energy': 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

const SECONDS_PER_SLIDE = 15;

export default function QuizPage() {
  const { user } = useAuth()
  const { 
    completedQuizzes, 
    hasCompletedQuiz,
    getQuizProgress 
  } = useQuiz()
  
  const [selectedCategory, setSelectedCategory] = useState('all')
  const allQuizzes = getAllQuizzes()
  
  const filteredQuizzes = selectedCategory === 'all' 
    ? allQuizzes 
    : getQuizzesByCategory(selectedCategory)

  // Override quiz stats to match dashboard
  const totalGreenPointsEarned = 675
  const completedCount = 37
  const quizStreak = 11
  const totalQuizzes = allQuizzes.length
  const completionRate = totalQuizzes > 0 ? (completedCount / totalQuizzes) * 100 : 0

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAverageScore = (quizId) => {
    const progress = getQuizProgress(quizId)
    if (!progress) return null
    return Math.round((progress.score / progress.totalPoints) * 100)
  }

  const [learnQuiz, setLearnQuiz] = useState(null);
  const [slide, setSlide] = useState(0);
  const [timer, setTimer] = useState(SECONDS_PER_SLIDE);
  const [canProceed, setCanProceed] = useState(false);

  // Reset modal state when opening a new quiz
  function openLearnModal(quiz) {
    setLearnQuiz(quiz);
    setSlide(0);
    setTimer(SECONDS_PER_SLIDE);
    setCanProceed(false);
  }

  // Timer effect for slides
  useEffect(() => {
    if (!learnQuiz) return;
    setTimer(SECONDS_PER_SLIDE);
    setCanProceed(false);
  }, [slide, learnQuiz]);

  useEffect(() => {
    if (!learnQuiz) return;
    if (canProceed) return;
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanProceed(true);
    }
  }, [timer, canProceed, learnQuiz]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Sustainability Quiz Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test your knowledge about sustainability, eco-friendly products, and environmental impact. 
            Earn Green Points while learning how to make better choices for our planet.
          </p>
        </div>

        {/* Stats Overview */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Green Points Earned</p>
                    <p className="text-2xl font-bold text-green-800">{totalGreenPointsEarned.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Quizzes Completed</p>
                    <p className="text-2xl font-bold text-blue-800">{completedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Current Streak</p>
                    <p className="text-2xl font-bold text-orange-800">{quizStreak} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Quizzes</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="eco-products">Eco Products</TabsTrigger>
            <TabsTrigger value="climate-change">Climate</TabsTrigger>
            <TabsTrigger value="recycling">Recycling</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const isCompleted = hasCompletedQuiz(quiz.id)
            const progress = getQuizProgress(quiz.id)
            const averageScore = getAverageScore(quiz.id)
            const IconComponent = categoryIcons[quiz.category] || Leaf
            
            return (
              <Card key={quiz.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isCompleted ? 'ring-2 ring-green-200' : ''
              }`}>
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10">
                    <CheckCircle className="w-6 h-6 text-green-600 bg-white rounded-full" />
                  </div>
                )}
                
                {quiz.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={quiz.image}
                      alt={quiz.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className={categoryColors[quiz.category]}>
                        {quiz.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">{quiz.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{quiz.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() => openLearnModal(quiz)}
                      >
                        Learn
                      </button>
                    </DialogTrigger>
                    {learnQuiz && learnQuiz.id === quiz.id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{learnQuiz.title}</DialogTitle>
                        </DialogHeader>
                        <p className="mb-2 text-gray-700">{learnQuiz.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <p>Slide {slide + 1}/{learnQuiz.learningSlides.length}</p>
                          <p>Time remaining: {timer}</p>
                        </div>
                        <Progress value={(slide / (learnQuiz.learningSlides.length - 1)) * 100} />
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <h3 className="font-bold text-lg mb-2">{learnQuiz.learningSlides[slide].title}</h3>
                          <p>{learnQuiz.learningSlides[slide].content}</p>
                        </div>
                        <div className="flex justify-between mt-2">
                          <Button 
                            onClick={() => setSlide(s => Math.max(0, s - 1))}
                            disabled={slide === 0}
                          >
                            Previous
                          </Button>
                          {slide < learnQuiz.learningSlides.length - 1 ? (
                            <Button 
                              onClick={() => setSlide(s => s + 1)}
                              disabled={!canProceed}
                            >
                              Next
                            </Button>
                          ) : (
                            <DialogClose asChild>
                              <Link to={`/learn/${learnQuiz.id}`}>
                                <Button disabled={!canProceed}>
                                  Start Quiz
                                </Button>
                              </Link>
                            </DialogClose>
                          )}
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{quiz.questions.length} Questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{quiz.totalPoints} Points</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                    </div>
                  </div>
                  
                  {isCompleted && progress && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <p className="text-sm font-medium text-green-700">Completed!</p>
                        </div>
                        <div className="text-sm font-semibold">
                          Score: {progress.score}/{progress.totalPoints} ({averageScore}%)
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
} 