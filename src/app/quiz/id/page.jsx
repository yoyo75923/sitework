import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import Header from "../../../components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Progress } from "../../../components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "../../../components/ui/alert"
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Award, 
  Clock, 
  Brain,
  Leaf,
  Info,
  Play,
  RotateCcw,
  Home
} from "lucide-react"
import { getQuizById } from "../../../lib/quiz-data"
import { useQuiz } from "../../../components/quiz-provider"
import { useAuth } from "../../../components/auth-provider"

export default function QuizPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const { 
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    quizCompleted,
    quizScore,
    totalPossibleScore,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz
  } = useQuiz()
  
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  const quiz = getQuizById(id)

  useEffect(() => {
    if (!quiz) {
      navigate('/quiz')
      return
    }

    if (!currentQuiz || currentQuiz.id !== quiz.id) {
      startQuiz(quiz)
    }
  }, [quiz, currentQuiz, startQuiz, navigate])

  useEffect(() => {
    if (!currentQuiz || quizCompleted) return

    // Set timer if quiz has time limit
    if (currentQuiz.timeLimit) {
      setTimeLeft(currentQuiz.timeLimit * 60) // Convert to seconds
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            completeQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuiz, quizCompleted, completeQuiz])

  if (!quiz || !currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-600 mb-2">Quiz not found</h1>
            <p className="text-gray-500 mb-6">The quiz you're looking for doesn't exist.</p>
            <Link to="/quiz">
              <Button>
                <Home className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex]
  const totalQuestions = currentQuiz.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const answeredQuestions = userAnswers.filter(answer => answer !== -1).length

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answerIndex) => {
    answerQuestion(answerIndex)
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      completeQuiz()
    } else {
      nextQuestion()
      setShowExplanation(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (quizCompleted) {
    const percentage = Math.round((quizScore / totalPossibleScore) * 100)
    const isPerfect = percentage === 100
    const isGood = percentage >= 80
    const isPassing = percentage >= 60

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {isPerfect ? (
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-10 h-10 text-green-600" />
                  </div>
                ) : isGood ? (
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                    <Brain className="w-10 h-10 text-orange-600" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isPerfect ? 'Perfect Score!' : isGood ? 'Great Job!' : 'Quiz Completed!'}
              </CardTitle>
              <p className="text-gray-600">
                {isPerfect 
                  ? 'You aced this quiz! You\'re a sustainability expert!'
                  : isGood 
                    ? 'Excellent work! You have a strong understanding of sustainability.'
                    : 'Good effort! Keep learning and improving your knowledge.'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {quizScore}/{totalPossibleScore}
                </div>
                <div className="text-lg text-gray-600 mb-4">
                  {percentage}% Accuracy
                </div>
                <Progress value={percentage} className="h-3 mb-4" />
                <div className="text-sm text-gray-500">
                  You earned <span className="font-semibold text-green-600">{quizScore} Green Points</span>!
                </div>
              </div>

              {/* Green Points Info */}
              <Alert className="border-green-200 bg-green-50">
                <Award className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>{quizScore} Green Points</strong> have been added to your account. 
                  You can use these points to get discounts on eco-friendly products in your next purchase!
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Link to="/quiz" className="flex-1">
                  <Button className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Quizzes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/quiz">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Leaf className="w-4 h-4" />
                  <span>Category: {currentQuiz.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={getDifficultyColor(currentQuiz.difficulty)}>{currentQuiz.difficulty}</Badge>
                </div>
              </div>
            </div>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-lg font-semibold bg-white px-4 py-2 rounded-lg shadow-sm">
                <Clock className="w-5 h-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          <Progress value={progress} />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-semibold">{currentQuestion.text}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = userAnswers[currentQuestionIndex] === index
                const isCorrect = currentQuestion.correctAnswer === index
                
                let buttonClass = "justify-start text-left h-auto py-3 px-4 whitespace-normal "
                if (showExplanation) {
                  if (isCorrect) {
                    buttonClass += "bg-green-100 border-green-300 hover:bg-green-200 text-green-900"
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "bg-red-100 border-red-300 hover:bg-red-200 text-red-900"
                  } else {
                    buttonClass += "bg-gray-100 text-gray-600"
                  }
                }

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                    {showExplanation && (
                      <div className="ml-auto pl-2">
                        {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                    )}
                  </Button>
                )
              })}
            </div>

            {showExplanation && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong className="block mb-1">Explanation</strong>
                  {currentQuestion.explanation}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!showExplanation}
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 