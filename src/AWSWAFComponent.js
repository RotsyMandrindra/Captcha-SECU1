import React, { useState, useEffect } from 'react';

function AWSWAFComponent({ onCaptchaCompleted }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://b82b1763d1c3.eu-west-3.captcha-sdk.awswaf.com/b82b1763d1c3/jsapi.js"; 
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.AwsWafIntegration.init({
        apiKey: 'YOUR_API_KEY', 
        captchaContainerId: 'captcha-container'
      });

      // Fonction pour afficher le CAPTCHA
      function showCaptcha() {
        const container = document.getElementById('captcha-container');
        window.AwsWafCaptcha.renderCaptcha(container, {
          apiKey: 'YOUR_API_KEY',
          onSuccess: handleCaptchaSuccess,
          onError: handleCaptchaError,
        });
      }

      // Fonctions pour gérer le succès et l'erreur du CAPTCHA
      function handleCaptchaSuccess(token) {
        console.log('CAPTCHA réussi avec token:', token);
        onCaptchaCompleted();
      }

      function handleCaptchaError(error) {
        console.error('Erreur CAPTCHA:', error);
      }

      showCaptcha();
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="captcha-container"></div>;
}

export default AWSWAFComponent;
