import React, {useRef, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Camera, Loader2, RotateCcw, SendHorizonal} from "lucide-react";

interface CameraViewProps {
    width: number;
    height: number;
    onRegisterSuccess: () => void;
    onRegisterFailure: () => void;
}

export default function CameraView({width, height, onRegisterSuccess, onRegisterFailure}: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL("image/jpeg");
            setCapturedImage(dataUrl);
            console.log(dataUrl);
        }
    };

    const handleSend = async () => {
        if (capturedImage) {
            setIsLoading(true);

            // Simulating an asynchronous registration process
            setTimeout(() => {
                setIsLoading(false);

                const success = true;

                if (success) {
                    onRegisterSuccess();
                } else {
                    onRegisterFailure();
                    // Show the captured image again or perform any other actions on failure
                }
            }, 1500);
        }
    };

    const handleRetry = () => {
        setCapturedImage(null);
    };

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: true});
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };

        if (!capturedImage) {
            startCamera();
        }

        return () => {
            const stream = videoRef.current?.srcObject as MediaStream | null;
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [capturedImage]);

    return (
        <div>
            {isLoading ? (
                <div style={{height: height / 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Loader2 className="mr-2 h-10 w-10 animate-spin"/>
                </div>
            ) : capturedImage ? (
                <div>
                    <img src={capturedImage} alt="Captured" width={width} height={height}/>

                    <div className="flex justify-between mt-4">
                        <Button onClick={handleRetry} variant="outline">
                            Retry
                            <RotateCcw className="w-6 h-6 pl-2"/>
                        </Button>
                        <Button onClick={handleSend} variant="outline">
                            Register
                            <SendHorizonal className="w-6 h-6 pl-2"/>
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <video ref={videoRef} autoPlay width={width} height={height}/>
                    <div className="flex justify-center">
                        <Button
                            onClick={(event) => {
                                event.preventDefault();
                                captureImage();
                            }}
                            className="mt-4"
                            variant="outline"
                        >

                            <Camera className="w-6 h-6 pr-2"/>
                            Take picture
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}