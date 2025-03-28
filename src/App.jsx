import React from "react";
import AITypologyQuiz from "./components/AITypologyQuiz";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6">AI Typology Quiz</h1>
      <AITypologyQuiz />
    </div>
  );
}
