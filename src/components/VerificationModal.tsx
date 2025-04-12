
import { useEffect, useState, useRef } from "react";
import { User } from "../utils/types";
import { verifyFaceId, registerFaceId } from "../utils/auth";
import { isBiometricSupported } from "../utils/biometricAuth";
import { Check, X, Camera, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface VerificationModalProps {
  user: User;
  type: "face";
  isRegister?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  required?: boolean;
}

const VerificationModal = ({
  user,
  isRegister = false,
  onSuccess,
  onCancel,
  required = false,
}: VerificationModalProps) => {
  const [status, setStatus] = useState<"not-registered" | "registered" | "in-progress" | "success" | "failure">(
    isRegister ? "not-registered" : "registered"
  );
  const [accessRequested, setAccessRequested] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isNativeBiometrics, setIsNativeBiometrics] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const supported = await isBiometricSupported();
      setIsNativeBiometrics(false); // Force to false to show simulated UI
      setIsSimulated(true); // Always use simulation for demo
      console.log(`Using simulated biometric authentication`);
    };
    
    checkBiometricSupport();
  }, []);

  const requestCameraAccess = async () => {
    // Skip camera access if we're using simulation
    if (isSimulated) {
      setAccessGranted(true);
      return true;
    }
    
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

  const captureFaceImage = () => {
    if (isSimulated) return true;
    
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        return true;
      }
    }
    return false;
  };

  const startVerification = async () => {
    setStatus("in-progress");
    
    try {
      // For simulation, always return true without capturing face
      const result = isRegister 
        ? await registerFaceId(user.id)
        : await verifyFaceId(user.id);
        
      if (result) {
        setStatus("success");
        setTimeout(() => {
          onSuccess();
          toast.success("Face verification successful");
          
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
          }
        }, 1000);
      } else {
        setStatus("failure");
        toast.error("Face verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("failure");
      toast.error(`Face verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    const requestAccess = async () => {
      if (!accessRequested) {
        setAccessRequested(true);
        
        // Always set to true for simulation
        setAccessGranted(true);
        
        setTimeout(() => {
          startVerification();
        }, 1500);
      }
    };
    
    if (status === "registered" || status === "not-registered") {
      requestAccess();
    }
    
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [status, accessRequested]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background rounded-xl max-w-md w-full shadow-lg animate-scale-in">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-2">
              {isRegister ? "Register" : "Verify"} Face ID
            </h3>
            
            <p className="text-muted-foreground text-center mb-6">
              <ShieldAlert className="inline-block mr-1 h-5 w-5 text-amber-500" />
              Using simulated Face ID for demonstration.
            </p>

            <div className="w-48 h-48 mb-6 relative">
              <div className="w-full h-full rounded-lg overflow-hidden border-2 border-primary relative face-recognition-grid">
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                  <ShieldAlert className="h-16 w-16 text-primary/70" />
                </div>
                
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
              </div>
            </div>

            <div className="text-center">
              {status === "in-progress" && (
                <p className="text-sm">
                  {isRegister ? "Registering" : "Verifying"} Face ID...
                </p>
              )}
              {status === "success" && (
                <p className="text-sm text-primary">
                  {isRegister ? "Face ID registration" : "Face ID verification"} successful!
                </p>
              )}
              {status === "failure" && (
                <p className="text-sm text-destructive">
                  {`${isRegister ? "Face ID registration" : "Face ID verification"} failed!`}
                  {required && " This is required to continue."}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex border-t p-4">
          <button
            onClick={() => {
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
