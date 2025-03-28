import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const questions = [
  {
    id: 1,
    question: "Jaký je váš oblíbený způsob trávení volného času?",
    options: [
      "Čtení knih",
      "Sport",
      "Hraní her",
      "Sledování filmů"
    ]
  },
  {
    id: 2,
    question: "Jak se cítíte ve společnosti?",
    options: [
      "Pohodlně a energicky",
      "Trochu nejistě",
      "Velmi nejistě",
      "Záleží na situaci"
    ]
  },
  // Můžete přidat další otázky
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: answer
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      saveResults();
    }
  };

  const saveResults = async () => {
    try {
      await addDoc(collection(db, "quiz-results"), {
        answers,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Chyba při ukládání výsledků:", error);
    }
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Děkujeme za vyplnění kvízu!</h2>
        <p>Vaše odpovědi byly úspěšně uloženy.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Otázka {currentQuestion + 1} z {questions.length}
        </h2>
        <p className="text-lg">{questions[currentQuestion].question}</p>
      </div>
      
      <div className="space-y-4">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz; 