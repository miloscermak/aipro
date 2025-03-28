import React, { useState } from 'react';

function AITypologyQuiz() {
  const questions = [
    {
      text: 'Když si představíte ideálního pomocníka ve své práci, jaký by měl být?',
      options: [
        'Tichý, spolehlivý, efektivní.',
        'Schopný se mnou přemýšlet.',
        'Náročný, pomáhá mi růst.',
        'Inspirativní a překvapivý.',
        'Otravný, ale pořád se snaží.'
      ]
    },
    {
      text: 'Která z vět vás nejvíc vystihuje?',
      options: [
        'Chci, aby to fungovalo.',
        'Chci spolupracovat.',
        'Chci být lepší.',
        'Chci být překvapen.',
        'Chci mít klid.'
      ]
    }
  ];

  const resultTypes = [
    'Asistent (Alfred)',
    'Parťák (Watson)',
    'Kouč (Mickey)',
    'Guru (Džin)',
    'Nechtěný kamarád (Clippy)'
  ];

  const descriptions = {
    'Asistent (Alfred)': 'AI má dělat, co řeknete. Spolehlivě, včas a v pozadí.',
    'Parťák (Watson)': 'AI je pro vás sparring partner pro přemýšlení a tvorbu.',
    'Kouč (Mickey)': 'Chcete od AI výzvu. A respektujete její názor.',
    'Guru (Džin)': 'AI má přinášet nečekané vhledy. Nápady. Možnosti.',
    'Nechtěný kamarád (Clippy)': 'AI vám zatím leze na nervy. Ale možná si zvyknete.'
  };

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (qIndex, optIndex) => {
    const updated = [...answers];
    updated[qIndex] = optIndex;
    setAnswers(updated);
  };

  const calculateResult = () => {
    const counts = [0, 0, 0, 0, 0];
    answers.forEach(a => {
      if (a !== null) counts[a]++;
    });
    const maxIndex = counts.indexOf(Math.max(...counts));
    return resultTypes[maxIndex];
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    const result = calculateResult();
    return (
      <div>
        <h2>Výsledek: {result}</h2>
        <p>{descriptions[result]}</p>
      </div>
    );
  }

  return (
    <div>
      {questions.map((q, qIdx) => (
        <div key={qIdx} style={{ marginBottom: '1.5rem' }}>
          <strong>{q.text}</strong>
          <div>
            {q.options.map((opt, optIdx) => (
              <label key={optIdx} style={{ display: 'block', marginTop: '0.25rem' }}>
                <input
                  type="radio"
                  name={`q${qIdx}`}
                  checked={answers[qIdx] === optIdx}
                  onChange={() => handleAnswer(qIdx, optIdx)}
                />
                {' '}{opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} disabled={answers.includes(null)}>
        Odeslat
      </button>
    </div>
  );
}

export default AITypologyQuiz;
