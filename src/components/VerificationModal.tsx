
import { useEffect, useState, useRef } from "react";
import { User, VerificationMethod } from "../utils/types";
import { verifyBiometric, registerBiometric } from "../utils/auth";
import { Check, X, Fingerprint, Camera } from "lucide-react";
import { toast } from "sonner";

interface VerificationModalProps {
  user: User;
  type: "face" | "fingerprint";
  isRegister?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  required?: boolean;
}

const VerificationModal = ({
  user,
  type,
  isRegister = false,
  onSuccess,
  onCancel,
  required = false,
}: VerificationModalProps) => {
  const [status, setStatus] = useState<VerificationMethod["status"]>(
    isRegister ? "not-registered" : "registered"
  );
  const [accessRequested, setAccessRequested] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Request camera access for face verification
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: "user"
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
      
      setAccessGranted(true);
      toast.success("Camera access granted");
      return true;
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Camera access denied. Please allow camera access to continue.");
      return false;
    }
  };

  // Request fingerprint access
  const requestFingerprintAccess = async () => {
    if (!window.PublicKeyCredential) {
      toast.error("Fingerprint API not supported in this browser");
      return false;
    }
    
    try {
      // Check if user verifying platform authenticator is available
      const result = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (result) {
        toast.success("Fingerprint sensor detected");
        setAccessGranted(true);
        return true;
      } else {
        toast.error("No fingerprint sensor detected on this device");
        return false;
      }
    } catch (error) {
      console.error("Error accessing fingerprint sensor:", error);
      toast.error("Failed to access fingerprint sensor");
      return false;
    }
  };

  const captureFaceImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        // In a real app, you would send this image to your server for face recognition
        return true;
      }
    }
    return false;
  };

  const startVerification = async () => {
    setStatus("in-progress");
    
    try {
      // For face verification, attempt to capture an image first
      if (type === "face" && !captureFaceImage()) {
        throw new Error("Failed to capture face image");
      }
      
      // Simulate biometric verification with the backend
      const result = isRegister 
        ? await registerBiometric(type, user.id)
        : await verifyBiometric(type, user.id);
        
      if (result) {
        setStatus("success");
        setTimeout(() => {
          onSuccess();
          toast.success(`${type === "face" ? "Facial" : "Fingerprint"} verification successful`);
          
          // Clean up camera resources if used
          if (type === "face" && mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
          }
        }, 1000);
      } else {
        setStatus("failure");
        toast.error(`${type === "face" ? "Facial" : "Fingerprint"} verification failed`);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("failure");
      toast.error(`${type === "face" ? "Facial" : "Fingerprint"} verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    // Request access to the appropriate sensor
    const requestAccess = async () => {
      if (!accessRequested) {
        setAccessRequested(true);
        
        let accessSuccess = false;
        if (type === "face") {
          accessSuccess = await requestCameraAccess();
        } else {
          accessSuccess = await requestFingerprintAccess();
        }
        
        if (accessSuccess) {
          // After a short delay to show the camera feed, start the verification
          setTimeout(() => {
            startVerification();
          }, 1500);
        } else {
          // If access denied, allow retry
          setStatus("failure");
        }
      }
    };
    
    if (status === "registered" || status === "not-registered") {
      requestAccess();
    }
    
    // Clean up
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [status, type, accessRequested]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background rounded-xl max-w-md w-full shadow-lg animate-scale-in">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-2">
              {isRegister ? "Register" : "Verify"} {type === "face" ? "Face" : "Fingerprint"}
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              {isRegister
                ? `Please ${type === "face" ? "allow camera access" : "place your finger on the sensor"} to register your ${type === "face" ? "face" : "fingerprint"}.`
                : `Please ${type === "face" ? "look at the camera" : "place your finger on the scanner"} for verification.`}
            </p>

            <div className="w-48 h-48 mb-6 relative">
              {type === "face" ? (
                <div className="w-full h-full rounded-lg overflow-hidden border-2 border-primary relative face-recognition-grid">
                  {/* Camera feed for face recognition */}
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay 
                    muted 
                    playsInline
                  />
                  
                  {/* Hidden canvas used for capturing image */}
                  <canvas 
                    ref={canvasRef} 
                    className="hidden" 
                  />
                  
                  {status === "in-progress" && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary/80 scanner-line animate-scanning"></div>
                  )}
                  {status === "success" && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="h-16 w-16 text-primary" />
                    </div>
                  )}
                  {status === "failure" && (
                    <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                      <X className="h-16 w-16 text-destructive" />
                    </div>
                  )}
                  {!accessGranted && status !== "failure" && status !== "success" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="h-16 w-16 text-primary/50 animate-pulse-light" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-lg overflow-hidden border-2 border-primary relative fingerprint-scan bg-accent">
                  {status === "in-progress" && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary/80 scanner-line animate-scanning"></div>
                  )}
                  {status === "success" && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="h-16 w-16 text-primary" />
                    </div>
                  )}
                  {status === "failure" && (
                    <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                      <X className="h-16 w-16 text-destructive" />
                    </div>
                  )}
                  {status !== "failure" && status !== "success" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Fingerprint className="h-16 w-16 text-primary/50 animate-pulse-light" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center">
              {!accessGranted && status !== "failure" && (
                <p className="text-sm">
                  Requesting {type === "face" ? "camera" : "fingerprint sensor"} access...
                </p>
              )}
              {accessGranted && status === "in-progress" && (
                <p className="text-sm">
                  {isRegister ? "Registering" : "Verifying"}...
                </p>
              )}
              {status === "success" && (
                <p className="text-sm text-primary">
                  {isRegister ? "Registration" : "Verification"} successful!
                </p>
              )}
              {status === "failure" && (
                <p className="text-sm text-destructive">
                  {!accessGranted 
                    ? `${type === "face" ? "Camera" : "Fingerprint sensor"} access denied` 
                    : `${isRegister ? "Registration" : "Verification"} failed!`}
                  {required && " This is required to continue."}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex border-t p-4">
          <button
            onClick={() => {
              // Stop media tracks if any
              if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
              }
              onCancel();
            }}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md border hover:bg-accent"
          >
            {required ? "Try Later" : "Cancel"}
          </button>
          {status === "failure" && (
            <button
              onClick={() => {
                setRetryCount(retryCount + 1);
                setAccessRequested(false);
                setAccessGranted(false);
                setStatus(isRegister ? "not-registered" : "registered");
              }}
              className="flex-1 ml-3 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
