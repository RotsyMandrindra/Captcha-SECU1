import React, { useEffect, useRef } from 'react';
import { AwsWafCaptcha } from '@aws-sdk/client-waf';

const AWSWAFComponent = ({ onCaptchaCompleted }) => {
  const captchaContainerRef = useRef(null);

  useEffect(() => {
    const loadCaptchaScript = async () => {
      const script = document.createElement('script');
      script.src = 'src="https://b82b1763d1c3.eu-west-3.captcha-sdk.awswaf.com/b82b1763d1c3.jsapi.js"';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        AwsWafCaptcha.renderCaptcha(
          captchaContainerRef.current,
          {
            apiKey: 'YOUR_API_KEY',
            onSuccess: () => {
              onCaptchaCompleted();
            },
            onError: (error) => {
              console.error('CAPTCHA error:', error);
            },
          }
        );
      };

      document.body.appendChild(script);
    };

    loadCaptchaScript();
  }, []);

  return <div ref={captchaContainerRef} />;
};

export default AWSWAFComponent;
