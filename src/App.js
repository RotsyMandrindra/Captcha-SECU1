import React, { useState } from 'react';
import AWSWAFComponent from './AWSWAFComponent';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sequence, setSequence] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setShowCaptcha(false);

    if (!/^\d+$/.test(inputValue) || inputValue < 1 || inputValue > 100) {
      alert('Veuillez entrer un nombre entre 1 et 100');
      setLoading(false);
      return;
    }

    setShowCaptcha(true);
  };

  const handleCaptchaComplete = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.prod.jcloudify.com/whoami`, {
        method: 'GET',
        headers: {
          'x-amzn-waf-action': 'challenge',
          'x-amzn-waf-token': token,
        },
      });
      const data = await response.json();
      console.log('Réponse:', data);
      
      // Générer la séquence
      const sequenceData = Array.from({ length: parseInt(inputValue) }, (_, i) => `Forbidden ${i + 1}`);
      setSequence(sequenceData);

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Générer la séquence</h2>
        <label htmlFor="numberInput">Entrez un nombre entre 1 et 100 :</label>
        <input
          type="number"
          id="numberInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          min="1"
          max="100"
          required
        />
        <button type="submit" disabled={loading}>Générer</button>
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
        <AWSWAFComponent onCaptchaCompleted={handleCaptchaComplete} />
      )}
    </div>
  );
}

export default App;
