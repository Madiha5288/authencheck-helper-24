
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

// Request biometric authentication
export const requestBiometricAuth = async (): Promise<boolean> => {
  if (!await isBiometricSupported()) {
    throw new Error('Biometric authentication not supported on this device');
  }

  try {
    const challenge = generateChallenge();
    
    // This is a simplified implementation that uses the platform authenticator
    // In a production environment, you would need a proper WebAuthn registration flow first
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: [], // Empty to allow any registered credential
        userVerification: 'required',
      }
    });

    // In a real app, you would send the credential to your server for verification
    // For our mock implementation, we'll consider the authentication successful if we get here
    return !!credential;
  } catch (error) {
    console.error('Biometric auth error:', error);
    return false;
  }
};
