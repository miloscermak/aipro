import React, { useState } from "react";
import jsPDF from "jspdf";

const questions = [
  {
    text: "Vaše křestní jméno:",
    input: true,
    key: "firstName"
  },
  {
    text: "Vaše profese:",
    input: true,
    key: "profession"
  },
  {
    text: "Vyberte svou věkovou skupinu:",
    options: [
      "Do 25 let",
      "26–35 let",
      "36–50 let",
      "51–65 let",
      "Nad 65 let"
    ],
    key: "ageGroup"
  },
  {
    text: "Kterou z těchto vět byste pravděpodobně řekli v pondělí ráno?",
    options: [
      "Mám plán, potřebuji, aby všechno běželo hladce.",
      "Potřebuju někoho, s kým to proberu.",
      "Nechci slyšet výmluvy, jen chci výsledky.",
      "Doufám, že dnes přijde nějaký zajímavý podnět.",
      "Zase mi bude AI nabízet pomoc, kterou nechci."
    ]
  },
  {
    text: "Jak by vypadala ideální interakce s AI během vaší pracovní rutiny?",
    options: [
      "Předám jí úkol, ona ho udělá.",
      "Diskutujeme nad zadáním, ladíme výstup.",
      "AI mě upozorní, když dělám chybu.",
      "AI mi řekne něco, co bych sám neodhadl.",
      "Zkouším ji ignorovat, ale stejně se ozve."
    ]
  },
  {
    text: "Jak se tváříte, když AI začne odpovídat na něco, co jste jí nezadal/a?",
    options: [
      "Přerušuju ji. Nechci ztrácet čas.",
      "Občas mě inspiruje, nechám ji domluvit.",
      "Zajímá mě, kam tím míří – třeba mě prověří.",
      "Naslouchám, může z toho vypadnout vhled.",
      "Zavírám záložku. Děkuji, nechci."
    ]
  },
  {
    text: "Představte si, že vám AI každý den položí jednu otázku. Jaká by měla být?",
    options: [
      "Co pro vás dnes mohu udělat?",
      "Co si o tom myslíte vy?",
      "Jste si tím jistý/á?",
      "Napadlo vás na to podívat se jinak?",
      "Můžu vám znovu připomenout, že existuji?"
    ]
  },
  {
    text: "Kterou z těchto vět by o vás řekl váš ideální AI pomocník?",
    options: [
      "Vždy ví, co chce, a já to dodám.",
      "Potřebuje se občas ujistit, že jde správným směrem.",
      "Nespokojí se s prvním návrhem, rád/a mě testuje.",
      "Nechá mě tvořit a pak si z toho vybere.",
      "Většinou mě nechce slyšet, ale já to zkouším."
    ]
  },
  {
    text: "Kterou schopnost by měla mít AI, aby se vám skutečně hodila?",
    options: [
      "Precizně zformulovat text podle zadání.",
      "Doplnit moje myšlení, když se zaseknu.",
      "Upozornit mě, když přehlížím chybu.",
      "Překvapit mě novým nápadem.",
      "Držet se zpátky, dokud ji opravdu nepotřebuju."
    ]
  },
  {
    text: "Jak vypadá vaše typická práce s informacemi?",
    options: [
      "Shromáždit, zformátovat, odevzdat.",
      "Zapsat si nápady a postupně je ladit.",
      "Hledám slabiny a ladím přesnost.",
      "Chytám se jakéhokoli podnětu k inovaci.",
      "Všechno si dělám sám/sama, nechci pomoc."
    ]
  },
  {
    text: "Který z těchto obrazů nejlépe vystihuje vaši spolupráci s AI?",
    options: [
      "Letištní věž a pilot – já řídím, ona naviguje.",
      "Spoluautoři – navrhujeme, přepisujeme, ladíme.",
      "Trenér a sportovec – AI mě nutí jet na hraně.",
      "Průvodce v cizím městě – ukazuje cesty, které bych minul.",
      "Kolega, co pořád něco říká přes stěnu."
    ]
  },
  {
    text: "Když si AI zvolíte jako nástroj, co od ní v hloubi duše očekáváte?",
    options: [
      "Aby pracovala bez řečí.",
      "Aby mě motivovala ke zlepšení.",
      "Aby mě podržela i zpochybnila.",
      "Aby mě překvapila.",
      "Aby mě nechala na pokoji."
    ]
  },
  {
    text: "Jaká AI by vám skutečně imponovala?",
    options: [
      "Tichá a precizní.",
      "Přemýšlivá a pozorná.",
      "Přísná a férová.",
      "Podivná a geniální.",
      "Mlčící a nenápadná."
    ]
  }
];

const resultTypes = ["Asistent (Alfred)", "Parťák (Watson)", "Kouč (Mickey)", "Guru (Džin)", "Nechtěný kamarád (Clippy)"];

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

  const handleSubmit = () => {
    setSubmitted(true);
    const result = calculateResult();
    setResults({ [result]: 100 });
    setShowResults(true);
  };

  const calculateResult = () => {
    const counts = [0, 0, 0, 0, 0];
    let totalAnswers = 0;

    answers.forEach((answer, index) => {
      if (questions[index].input) return;
      
      if (answer !== null && answer >= 0 && answer < 5) {
        counts[answer]++;
        totalAnswers++;
      }
    });

    if (totalAnswers === 0) return resultTypes[0];

    const maxIndex = counts.indexOf(Math.max(...counts));
    return resultTypes[maxIndex];
  };

  const handleSaveData = () => {
    const payload = {
      answers,
      metadata,
      result: calculateResult(),
      timestamp: new Date().toISOString()
    };
    
    fetch(`https://script.google.com/macros/s/${process.env.REACT_APP_GOOGLE_SCRIPT_ID}/exec`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Chyba při ukládání dat');
      }
      console.log('Data byla úspěšně uložena');
    })
    .catch(error => {
      console.error('Chyba:', error);
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
            onClick={() => {
              handleSubmit();
              handleSaveData();
            }}
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
