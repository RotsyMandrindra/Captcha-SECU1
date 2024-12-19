import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [sequence, setSequence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSequence([]);

    // Vérifier si l'entrée est valide
    if (!/^\d+$/.test(inputValue) || inputValue < 1 || inputValue > 1000) {
      alert('Veuillez entrer un nombre entre 1 et 1000');
      return;
    }

    // Générer la séquence
    const generateSequence = async () => {
      for (let i = 1; i <= parseInt(inputValue); i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Délai de 1 seconde
        setSequence(prev => [...prev, `Forbidden ${i}`]);
        
        try {
          const response = await axios.get('https://api.prod.jcloudify.com/whoami');
          console.log(response.data);
        } catch (error) {
          if (error.response && error.response.status === 403) {
            setShowCaptcha(true);
            break;
          }
          throw error;
        }
      }
    };

    await generateSequence();

    setLoading(false);
  };

  const handleCaptchaResolved = async () => {
    setShowCaptcha(false);
    await generateSequence();
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          min="1"
          max="1000"
          required
        />
        <button type="submit">Générer la séquence</button>
      </form>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div>
          {sequence.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      )}

      {showCaptcha && (
        <div>
          <h3>Captcha résoudre</h3>
          <button onClick={handleCaptchaResolved}>Résoudre le captcha</button>
        </div>
      )}
    </div>
  );
}

export default App;
