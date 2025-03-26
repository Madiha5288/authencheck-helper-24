
import { useEffect, useState } from "react";
import { User, VerificationMethod } from "../utils/types";
import { verifyBiometric, registerBiometric } from "../utils/auth";
import { Check, X, Fingerprint, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface VerificationModalProps {
  user: User;
  type: "face" | "fingerprint";
  isRegister?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const VerificationModal = ({
  user,
  type,
  isRegister = false,
  onSuccess,
  onCancel,
}: VerificationModalProps) => {
  const [status, setStatus] = useState<VerificationMethod["status"]>(
    isRegister ? "not-registered" : "registered"
  );

  const startVerification = async () => {
    setStatus("in-progress");
    
    try {
      const result = isRegister 
        ? await registerBiometric(type, user.id)
        : await verifyBiometric(type, user.id);
        
      if (result) {
        setStatus("success");
        setTimeout(() => {
          onSuccess();
          toast.success(`${type === "face" ? "Facial" : "Fingerprint"} verification successful`);
        }, 1000);
      } else {
        setStatus("failure");
        toast.error(`${type === "face" ? "Facial" : "Fingerprint"} verification failed`);
      }
    } catch (error) {
      setStatus("failure");
      toast.error(`${type === "face" ? "Facial" : "Fingerprint"} verification failed`);
    }
  };

  useEffect(() => {
    if (status === "registered" || status === "not-registered") {
      const timer = setTimeout(() => {
        startVerification();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
                ? `Please stand still while we register your ${type === "face" ? "face" : "fingerprint"}.`
                : `Please ${type === "face" ? "look at the camera" : "place your finger on the scanner"} for verification.`}
            </p>

            <div className="w-48 h-48 mb-6 relative">
              {type === "face" ? (
                <div className="w-full h-full rounded-lg overflow-hidden border-2 border-primary relative face-recognition-grid">
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
                      <UserCheck className="h-16 w-16 text-primary/50 animate-pulse-light" />
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
              {status === "in-progress" && (
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
                  {isRegister ? "Registration" : "Verification"} failed!
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex border-t p-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md border hover:bg-accent"
          >
            Cancel
          </button>
          {status === "failure" && (
            <button
              onClick={startVerification}
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
