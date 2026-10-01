import { useEffect, useState } from "react";
import { quizAPI } from "../../services/api";
import { Link } from "react-router-dom";

export default function LearnPage() {
  const [topics, setTopics] = useState([]);
  const [today, setToday] = useState(null);

  useEffect(() => {
    setToday(new Date());
    quizAPI.getAll()
      .then(res => {
        if (res && res.length > 0) {
          setTopics(res.map(q => ({
            ...q,
            id: q.legacyId || q._id,
            availableDate: q.availableDate || '2024-01-01'
          })));
        }
      })
      .catch(err => console.error("Error loading learning topics from DB:", err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Learn & Earn</h1>
      <p className="mb-8 text-gray-700">
        Explore sustainability topics, learn with quick content, and earn green
        points by taking quizzes!
      </p>
      <ul className="space-y-6">
        {topics.map((topic) => {
          const available = today && new Date(topic.availableDate) <= today;
          return (
            <li
              key={topic.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={topic.image}
                  alt={topic.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-xl font-semibold">{topic.title}</h2>
                  <p className="text-gray-600">{topic.description}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                {today === null ? (
                  <span className="text-gray-400">Loading...</span>
                ) : available ? (
                  <Link
                    to={`/learn/${topic.id}`}
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Start Learning
                  </Link>
                ) : (
                  <span className="text-gray-400">
                    Available on{" "}
                    {new Date(topic.availableDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 