import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import VerificationCameraView from "@/components/ui/verification-camera-view";
import {useRouter} from "next/navigation";

export default function VerificationDialog({ open, onOpenChange, token }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    token: string | null;
}) {
    const [showCamera, setShowCamera] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleContinue = () => {
        setShowCamera(true);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    const handleVerificationSuccess = () => {
        onOpenChange(false);
        router.push("/");
    };

    const handleVerificationFailure = (error: string) => {
        toast({
            title: "Failed image registration",
            description: "Verification time expired. Please try again.",
            duration: 3000,
            variant: "error",
        });
        setShowCamera(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={(open: boolean) => {
            onOpenChange(open);
            if (!open) setShowCamera(false);
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Face Verification Required</DialogTitle>
                    <DialogDescription>
                        Please smile for the camera to verify your identity.
                    </DialogDescription>
                </DialogHeader>
                {!showCamera && (
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleContinue}>Continue</Button>
                    </DialogFooter>
                )}
                {showCamera && (
                    <div>
                        <div className="bg-gray-100 p-4">
                            <VerificationCameraView
                                token={token}
                                width={500}
                                height={500}
                                onVerificationSuccess={handleVerificationSuccess}
                                onVerificationFailure={handleVerificationFailure}
                            />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}