
/**
 * Utility functions for biometric authentication using WebAuthn
 */

// Check if the device supports biometric authentication
export const isBiometricSupported = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return false;
  }

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Error checking biometric support:', error);
    return false;
  }
};

// Generate a random challenge
const generateChallenge = (): Uint8Array => {
  const arr = new Uint8Array(32);
  window.crypto.getRandomValues(arr);
  return arr;
};

// Request face authentication with fallback to simulation when in iframe
export const requestBiometricAuth = async (): Promise<boolean> => {
  if (!await isBiometricSupported()) {
    console.log('Face authentication not supported on this device, falling back to simulation');
    return simulatedBiometricAuth();
  }

  try {
    // Check if we're in an iframe - WebAuthn typically doesn't work in iframes
    const isInIframe = window !== window.top;
    
    if (isInIframe) {
      console.log('Running in iframe, using simulated authentication');
      return simulatedBiometricAuth();
    }
    
    const challenge = generateChallenge();
    
    // This is a simplified implementation that uses the platform authenticator
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: [], // Empty to allow any registered credential
        userVerification: 'required' // Explicitly require user verification (face ID)
      }
    });

    // In a real app, you would send the credential to your server for verification
    // For our mock implementation, we'll consider the authentication successful if we get here
    return !!credential;
  } catch (error) {
    console.error('Face authentication error:', error);
    
    // If we get a "NotAllowedError" with a specific message about publickey-credentials-get
    // feature not being enabled, it's likely we're in an iframe or restricted environment
    if (error instanceof Error && 
        error.name === 'NotAllowedError' && 
        error.message.includes('publickey-credentials-get')) {
      console.log('WebAuthn API restricted in this context, falling back to simulation');
      return simulatedBiometricAuth();
    }
    
    return false;
  }
};

// Simulated biometric authentication for development/demo purposes
const simulatedBiometricAuth = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate verification process with high success rate
    setTimeout(() => {
      // 95% success rate for simulation
      const success = Math.random() < 0.95;
      console.log(`Simulated face verification ${success ? 'succeeded' : 'failed'}`);
      resolve(success);
    }, 1000);
  });
};
