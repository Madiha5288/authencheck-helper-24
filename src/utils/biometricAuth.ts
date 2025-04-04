
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

// Check if fingerprint authentication is available
export const isFingerPrintAvailable = async (): Promise<boolean> => {
  // First verify platform authenticator is available
  if (!await isBiometricSupported()) {
    return false;
  }
  
  // Additional check to verify it's specifically fingerprint authentication
  try {
    // Since WebAuthn API doesn't provide a direct method to check fingerprint specifically,
    // we make a more general check and ensure we're requiring user verification
    const result = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
    // Additional platform-specific checks could be added here for more precise detection
    // This would require checking the user agent and platform-specific APIs
    
    return result;
  } catch (error) {
    console.error('Error checking fingerprint availability:', error);
    return false;
  }
};

// Request biometric authentication
export const requestBiometricAuth = async (): Promise<boolean> => {
  // For fingerprint authentication, require fingerprint availability
  if (!await isFingerPrintAvailable()) {
    throw new Error('Fingerprint authentication not supported on this device');
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
        userVerification: 'required', // Explicitly require user verification (fingerprint, etc)
        authenticatorSelection: {
          userVerification: 'required',
          requireResidentKey: false,
          authenticatorAttachment: 'platform' // Ensure we're using the built-in authenticator
        }
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
