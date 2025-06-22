import React, { createContext, useContext, useState, useEffect } from "react"

const QuizContext = createContext(undefined)

export function QuizProvider({ children }) {
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [totalPossibleScore, setTotalPossibleScore] = useState(0)
  
  const [completedQuizzes, setCompletedQuizzes] = useState([])
  const [totalGreenPointsEarned, setTotalGreenPointsEarned] = useState(0)
  const [quizStreak, setQuizStreak] = useState(0)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCompletedQuizzes = localStorage.getItem('amazon-green-completed-quizzes')
    const savedTotalPoints = localStorage.getItem('amazon-green-quiz-points')
    const savedStreak = localStorage.getItem('amazon-green-quiz-streak')
    
    if (savedCompletedQuizzes) {
      setCompletedQuizzes(JSON.parse(savedCompletedQuizzes))
    }
    if (savedTotalPoints) {
      setTotalGreenPointsEarned(parseInt(savedTotalPoints))
    }
    if (savedStreak) {
      setQuizStreak(parseInt(savedStreak))
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('amazon-green-completed-quizzes', JSON.stringify(completedQuizzes))
    localStorage.setItem('amazon-green-quiz-points', totalGreenPointsEarned.toString())
    localStorage.setItem('amazon-green-quiz-streak', quizStreak.toString())
  }, [completedQuizzes, totalGreenPointsEarned, quizStreak])

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setUserAnswers(new Array(quiz.questions.length).fill(-1))
    setQuizCompleted(false)
    setQuizScore(0)
    setTotalPossibleScore(quiz.totalPoints)
  }

  const answerQuestion = (answerIndex) => {
    if (!currentQuiz) return
    
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length - 1) return
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  const previousQuestion = () => {
    if (currentQuestionIndex <= 0) return
    setCurrentQuestionIndex(currentQuestionIndex - 1)
  }

  const completeQuiz = () => {
    if (!currentQuiz) return

    // Calculate score
    let score = 0
    const answers = currentQuiz.questions.map((question, index) => {
      const userAnswer = userAnswers[index]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) {
        score += question.points
      }
      return {
        questionId: question.id,
        selectedAnswer: userAnswer,
        isCorrect
      }
    })

    const quizAttempt = {
      quizId: currentQuiz.id,
      score,
      totalPoints: currentQuiz.totalPoints,
      completedAt: new Date(),
      answers
    }

    // Update state
    setCompletedQuizzes(prev => [...prev, quizAttempt])
    setTotalGreenPointsEarned(prev => prev + score)
    setQuizStreak(prev => prev + 1)
    setQuizCompleted(true)
    setQuizScore(score)
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setQuizCompleted(false)
    setQuizScore(0)
    setTotalPossibleScore(0)
  }

  const getQuizProgress = (quizId) => {
    return completedQuizzes.find(attempt => attempt.quizId === quizId)
  }

  const hasCompletedQuiz = (quizId) => {
    return completedQuizzes.some(attempt => attempt.quizId === quizId)
  }

  const value = {
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    quizCompleted,
    quizScore,
    totalPossibleScore,
    completedQuizzes,
    totalGreenPointsEarned,
    quizStreak,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz,
    getQuizProgress,
    hasCompletedQuiz
  }

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
} 