import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {ScanEye, ShieldCheck, ShieldX} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import CameraView from "@/components/ui/camera-view";
import {useToast} from "@/components/ui/use-toast";

export default function SettingsDialog() {
    const [isFaceAuthEnabled, setIsFaceAuthEnabled] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const {toast} = useToast()

    const handleFaceAuthToggle = (checked: boolean) => {
        if (checked) {
            setIsAlertOpen(true);
        } else {
            setIsFaceAuthEnabled(false);
            setIsCameraOpen(false);
        }
    };

    const handleAlertContinue = () => {
        setIsFaceAuthEnabled(true);
        setIsAlertOpen(false);
        setIsCameraOpen(true);
    };

    const handleCameraClose = () => {
        setIsCameraOpen(false);
    };

    return (
        <Dialog onOpenChange={handleCameraClose}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <ScanEye className="h-6 w-6"/>
                    <span className="sr-only">Settings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Toggle face verification</DialogTitle>
                    <DialogDescription>
                        Register a picture of your face for authentication purposes.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    {!isCameraOpen && (
                        <div>
                            <div className="flex items-center">
                                {isFaceAuthEnabled ? (
                                    <ShieldCheck className="h-6 w-6 text-green-500"/>
                                ) : (
                                    <ShieldX className="h-6 w-6 text-red-500"/>
                                )}
                                <p className="ml-2 text-sm text-gray-500">
                                    Face authentication is currently {isFaceAuthEnabled ? "enabled" : "disabled"}
                                </p>
                            </div>
                            <div className="mt-6 flex justify-center">
                                <Button onClick={() => handleFaceAuthToggle(!isFaceAuthEnabled)}>
                                    {isFaceAuthEnabled ? "Disable" : "Enable"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                {isCameraOpen && (
                    <div>
                        <h3 className="text-lg font-semibold">Camera View</h3>
                        <div className="bg-gray-100 p-4">
                            <CameraView width={500} height={500} onRegisterSuccess={() => {
                                handleCameraClose();
                                toast({
                                    title: "Image registered",
                                    description: "Your face has been successfully registered for authentication.",
                                    duration: 3000, variant: "success"
                                })
                            }}
                                        onRegisterFailure={() => {
                                            toast({
                                                title: "Failed image registration",
                                                description: "No face detected in the image. Please try again.",
                                                duration: 3000, variant: "error"
                                            })
                                        }}/>
                        </div>
                    </div>
                )}
            </DialogContent>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogTitle>Enable Face Authentication</AlertDialogTitle>
                    <AlertDialogDescription>
                        By enabling face authentication, you will be required to take a picture using your camera for
                        authentication purposes.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAlertContinue}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}