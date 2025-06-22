import { useEffect, useState } from "react";
import { getLearningTopicById } from "../../../lib/quiz-data";
import { Link, useParams, useNavigate } from "react-router-dom";
import { quizzes } from "../../../lib/quiz-data";
import Quiz from "./quiz";

export default function LearningTopicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const topic = getLearningTopicById(id);

  const [today, setToday] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  useEffect(() => {
    if (!topic) {
      navigate("/404"); // Or a dedicated not-found page
    }
    setToday(new Date());
  }, [topic, navigate]);

  if (!topic) return null;

  const available = today && new Date(topic.availableDate) <= today;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
      <p className="mb-4 text-gray-700">{topic.description}</p>
      <div className="mb-6">
        <img
          src={topic.image}
          alt={topic.title}
          className="rounded-lg w-full max-w-md mx-auto mb-4"
        />
        {!showQuiz ? (
          <>
            <h2 className="text-lg font-semibold mb-2">Key Points</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-800">
              {topic.pointsToRead.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
            {today === null ? (
              <span className="text-gray-400">Loading...</span>
            ) : available ? (
              <button
                onClick={() => setShowQuiz(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Start Quiz
              </button>
            ) : (
              <span className="text-gray-400">
                Quiz available on{" "}
                {new Date(topic.availableDate).toLocaleDateString()}
              </span>
            )}
          </>
        ) : (
          <Link
            to={`/quiz/${topic.id}`}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Go to Quiz
          </Link>
        )}
      </div>
    </div>
  );
} 