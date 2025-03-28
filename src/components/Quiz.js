import React, { useState } from "react";
import jsPDF from "jspdf";

const questions = [
  {
    key: "firstName",
    text: "Jak se jmenujete?",
    input: true
  },
  {
    key: "profession",
    text: "Jaká je vaše profese?",
    input: true
  },
  {
    key: "ageGroup",
    text: "Do jaké věkové skupiny patříte?",
    options: ["18-24", "25-34", "35-44", "45-54", "55+"]
  },
  {
    text: "Jaký je váš oblíbený způsob trávení volného času?",
    options: [
      "Čtení knih",
      "Sport",
      "Hraní her",
      "Sledování filmů"
    ]
  },
  {
    text: "Jak se cítíte ve společnosti?",
    options: [
      "Pohodlně a energicky",
      "Trochu nejistě",
      "Velmi nejistě",
      "Záleží na situaci"
    ]
  },
  {
    text: "Jak řešíte problémy?",
    options: [
      "Logicky a systematicky",
      "Intuitivně a kreativně",
      "S pomocí druhých",
      "Zkusím to a uvidím"
    ]
  },
  {
    text: "Jaký je váš ideální pracovní den?",
    options: [
      "Strukturovaný a plánovaný",
      "Flexibilní a spontánní",
      "Spolupráce s ostatními",
      "Samostatná práce"
    ]
  },
  {
    text: "Jak se učíte nové věci?",
    options: [
      "Čtením a studiem",
      "Praktickým zkoušením",
      "Diskuzí s ostatními",
      "Vlastním tempem"
    ]
  },
  {
    text: "Jaký je váš přístup k rozhodování?",
    options: [
      "Analytický a promyšlený",
      "Intuitivní a rychlý",
      "Konzultuji s ostatními",
      "Záleží na situaci"
    ]
  },
  {
    text: "Jak se vyrovnáváte se stresem?",
    options: [
      "Plánováním a organizací",
      "Meditací a relaxací",
      "Mluvím o tom s ostatními",
      "Sportem a aktivitou"
    ]
  }
];

const resultTypes = ["Asistent (Alfred)", "Parťák (Watson)", "Kouč (Mickey)", "Guru (Džin)", "Nechtěný kamarád (Clippy)"];

// Mapování odpovědí na typy AI
const answerMapping = {
  // Otázka 3 (volný čas)
  3: {
    0: 0, // Čtení knih -> Alfred
    1: 1, // Sport -> Watson
    2: 2, // Hraní her -> Mickey
    3: 3  // Sledování filmů -> Džin
  },
  // Otázka 4 (společnost)
  4: {
    0: 1, // Pohodlně a energicky -> Watson
    1: 2, // Trochu nejistě -> Mickey
    2: 4, // Velmi nejistě -> Clippy
    3: 0  // Záleží na situaci -> Alfred
  },
  // Otázka 5 (řešení problémů)
  5: {
    0: 0, // Logicky a systematicky -> Alfred
    1: 3, // Intuitivně a kreativně -> Džin
    2: 1, // S pomocí druhých -> Watson
    3: 2  // Zkusím to a uvidím -> Mickey
  },
  // Otázka 6 (pracovní den)
  6: {
    0: 0, // Strukturovaný a plánovaný -> Alfred
    1: 3, // Flexibilní a spontánní -> Džin
    2: 1, // Spolupráce s ostatními -> Watson
    3: 4  // Samostatná práce -> Clippy
  },
  // Otázka 7 (učení)
  7: {
    0: 0, // Čtením a studiem -> Alfred
    1: 2, // Praktickým zkoušením -> Mickey
    2: 1, // Diskuze s ostatními -> Watson
    3: 3  // Vlastním tempem -> Džin
  },
  // Otázka 8 (rozhodování)
  8: {
    0: 0, // Analytický a promyšlený -> Alfred
    1: 3, // Intuitivní a rychlý -> Džin
    2: 1, // Konzultuji s ostatními -> Watson
    3: 2  // Záleží na situaci -> Mickey
  },
  // Otázka 9 (stres)
  9: {
    0: 0, // Plánováním a organizací -> Alfred
    1: 3, // Meditací a relaxací -> Džin
    2: 1, // Mluvím o tom s ostatními -> Watson
    3: 2  // Sportem a aktivitou -> Mickey
  }
};

export default function AITypologyQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [metadata, setMetadata] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleInputChange = (key, value) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const calculateResult = () => {
    const counts = [0, 0, 0, 0, 0];
    let totalAnswers = 0;

    // Procházíme všechny odpovědi
    Object.entries(answers).forEach(([questionIndex, answerIndex]) => {
      const questionNum = parseInt(questionIndex);
      
      // Přeskočíme textové otázky a věkovou skupinu
      if (questions[questionNum].input || questionNum === 2) return;
      
      // Pokud máme mapování pro tuto otázku a odpověď
      if (answerMapping[questionNum] && answerMapping[questionNum][answerIndex] !== undefined) {
        const aiTypeIndex = answerMapping[questionNum][answerIndex];
        counts[aiTypeIndex]++;
        totalAnswers++;
      }
    });

    // Pokud nejsou žádné odpovědi, vrátíme výchozí hodnotu
    if (totalAnswers === 0) return resultTypes[0];

    // Najdeme index s nejvyšším počtem odpovědí
    const maxIndex = counts.indexOf(Math.max(...counts));
    return resultTypes[maxIndex];
  };

  const handleSaveData = () => {
    const result = calculateResult();
    const payload = {
      timestamp: new Date().toISOString(),
      firstName: metadata.firstName || '',
      profession: metadata.profession || '',
      ageGroup: questions[2].options[answers[2] || 0] || '',
      result: result,
      answers: Object.entries(answers)
        .filter(([index]) => !questions[parseInt(index)].input && parseInt(index) !== 2)
        .map(([index, answerIndex]) => ({
          question: questions[parseInt(index)].text,
          answer: questions[parseInt(index)].options[answerIndex]
        }))
        .map(qa => `${qa.question}: ${qa.answer}`)
        .join('\n')
    };
    
    console.log('Odesílám data:', payload);
    
    // Nejprve zobrazíme výsledky
    setSubmitted(true);
    setShowResults(true);
    setResults({ [result]: 100 });

    // Pak se pokusíme uložit data
    fetch(`https://script.google.com/macros/s/${process.env.REACT_APP_GOOGLE_SCRIPT_ID}/exec`, {
      method: "POST",
      mode: "no-cors",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log('Odpověď ze serveru:', response);
      // V no-cors módu nemůžeme kontrolovat response.ok
      // Data už jsou zobrazena, takže jen logujeme úspěch
      console.log('Data byla úspěšně odeslána');
    })
    .catch(error => {
      console.error('Chyba při ukládání:', error);
      // Přidáme informaci o chybě pro uživatele
      alert('Nepodařilo se uložit data do tabulky. Výsledky kvízu jsou zobrazeny, ale data nemusí být uložena. Zkuste to prosím znovu.');
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Výsledky kvízu", 20, 20);
    doc.text(`Výsledek: ${calculateResult()}`, 20, 30);
    doc.save("vysledky-kvizu.pdf");
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Výsledky kvízu</h2>
        <div className="space-y-4">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{key}:</span>
                <span className={`font-bold ${value > 50 ? 'text-green-600' : 'text-red-600'}`}>
                  {value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    value > 50 ? 'bg-green-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <p className="text-gray-600">Vaše odpovědi byly úspěšně uloženy.</p>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
              setResults({});
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Vyplnit kvíz znovu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 animate-slide-in">
        <h2 className="text-2xl font-bold mb-4">
          Otázka {currentQuestion + 1} z {questions.length}
        </h2>
        <p className="text-lg">{questions[currentQuestion].text}</p>
      </div>
      
      <div className="space-y-4">
        {questions[currentQuestion].input ? (
          <input
            type="text"
            value={metadata[questions[currentQuestion].key] || ''}
            onChange={(e) => handleInputChange(questions[currentQuestion].key, e.target.value)}
            className="w-full p-4 border rounded-lg"
            placeholder="Zadejte svou odpověď..."
          />
        ) : questions[currentQuestion].options ? (
          questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(currentQuestion, index)}
              className={`w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors animate-fade-in ${
                answers[currentQuestion] === index ? 'bg-blue-50 border-blue-500' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {option}
            </button>
          ))
        ) : null}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Předchozí
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSaveData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Dokončit kvíz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Další
          </button>
        )}
      </div>
    </div>
  );
}
