import React, {useRef, useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import {compareFaces} from "@/api/user.api";
import {useToast} from "@/components/ui/use-toast";

interface VerificationCameraViewProps {
    width: number;
    height: number;
    onVerificationSuccess: () => void;
    onVerificationFailure: (error: string) => void;
    token: string | null;
}

export default function VerificationCameraView({width, height, onVerificationSuccess, onVerificationFailure, token}: VerificationCameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();

    const startVerification = () => {
        let remainingAttempts = 6;

        const timer = setInterval(() => {
            console.log("Remaining attempts:", remainingAttempts);
            if (remainingAttempts > 0) {
                captureAndSendImage();
                if (videoRef.current) {
                    remainingAttempts--;
                } else {
                    clearInterval(timer);
                }
            } else {
                clearInterval(timer);
                onVerificationFailure("Verification failed. Please try again.");
            }
        }, 1000);
    };

    const captureAndSendImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL("image/jpeg");
            sendImage(dataUrl);
        }
    };

    const sendImage = async (image: string) => {

        console.log("Sending image");
        console.log("Token:", token);
        try {
            if (token) {
                const result = await compareFaces(image, token);
                console.log("Result:", result)
                if (result) {
                    if (result.status === 200) {
                        localStorage.setItem('user', JSON.stringify(result.data.result.user));
                        localStorage.setItem('token', result.data.result.token);
                        console.log("Result:", result.data);
                        const similarity : number = result.data.cosine_similarity.toFixed(3);
                        toast({
                            title: "Verification successful",
                            description: `Faces are match with a similarity of ${similarity}`,
                            duration: 5000,
                            variant: "success",
                        });
                        onVerificationSuccess();
                    } else {
                        console.log("Error sending image:", result);
                    }
                } else {
                    console.log("Error sending image:", result);
                }
            }
        } catch (error) {
            console.error("Error sending image:", error);
        }
    };

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: true});
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                startVerification();
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };
        startCamera();
    }, []);

    return (
        <div>
            {isLoading ? (
                <div style={{height: height / 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Loader2 className="mr-2 h-10 w-10 animate-spin"/>
                </div>
            ) : (
                <div>
                    <video ref={videoRef} autoPlay width={width} height={height}/>
                    <div className="flex justify-center pt-6">
                        Verification is in progress
                        <Loader2 className="ml-3 h-7 w-7 animate-spin"/>
                    </div>
                </div>
            )}
        </div>
    );
}