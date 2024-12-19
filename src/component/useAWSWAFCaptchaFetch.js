import { useState } from 'react';
import { AwsWafIntegration } from '@aws-sdk/client-waf';

const useAWSWAFCaptchaFetch = () => {
  const [captchaToken, setCaptchaToken] = useState(null);

  const captchaFetch = async (url, options) => {
    if (!captchaToken) {
      throw new Error('CAPTCHA token is required');
    }

    try {
      const response = await AwsWafIntegration.fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'x-amzn-waf-action': 'captcha',
          'x-amzn-waf-token': captchaToken,
        },
      });
      return response;
    } catch (error) {
      if (error.response && error.response.status === 405) {
        throw new Error('CAPTCHA required');
      }
      throw error;
    }
  };

  return [captchaFetch];
};

export default useAWSWAFCaptchaFetch;
