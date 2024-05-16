import React, {useRef, useEffect} from "react";

interface CameraViewProps {
    width: number;
    height: number;
}

export default function CameraView({width, height}: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

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

        startCamera();

        return () => {
            const stream = videoRef.current?.srcObject as MediaStream | null;
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay width={width} height={height}/>
        </div>
    );
}