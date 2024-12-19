import React, { useState } from 'react';
import AWSWAFComponent from './AWSWAFComponent';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!/^\d+$/.test(inputValue) || inputValue < 1 || inputValue > 1000) {
      alert('Veuillez entrer un nombre entre 1 et 1000');
      return;
    }
  
    setLoading(true);
    setShowCaptcha(false);
  
    if (inputValue === '100') {
      setShowCaptcha(true);
      return;
    }
  
    generateSequence();
  };
  

  const generateSequence = async () => {
    setLoading(true);
    setShowCaptcha(false);
  
    const sequence = Array.from({ length: parseInt(inputValue) }, (_, i) => `Forbidden ${i + 1}`);
  
    const callAPIWithDelay = async (index) => {
      await delay(1000); 
      try {
        const response = await fetch('https://api.prod.jcloudify.com/whoami');
        console.log(`Réponse de l'API à l'index ${index}:`, await response.json());
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setShowCaptcha(true);
        }
        throw error;
      }
    };
  
    for (let i = 0; i < sequence.length; i++) {
      await callAPIWithDelay(i);
    }
  
    setSequence(sequence);
    setLoading(false);
  };
  
  

  rreturn (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h2>Générer la séquence</h2>
        <label htmlFor="numberInput">Entrez un nombre entre 1 et 1000 :</label>
        <input
          type="number"
          id="numberInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          min="1"
          max="1000"
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
        <AWSWAFComponent onCaptchaCompleted={() => setShowCaptcha(false)} />
      )}
    </div>
  );
}

export default App;