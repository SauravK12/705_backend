import { createContext, useState, useEffect, useRef } from 'react';

const CameraContext = createContext();

export function CameraProvider({ children }) {
  const [stream, setStream] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    if (stream) {
      return stream; // Already have a stream
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      setStream(mediaStream);
      setIsInitialized(true);
      setError(null);
      return mediaStream;
    } catch (error) {
      console.error('Camera access error:', error);
      setError(error);
      setIsInitialized(true);
      throw error;
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsInitialized(false);
    setError(null);
  };

  // Cleanup when provider unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const contextValue = {
    stream,
    isInitialized,
    error,
    startCamera,
    stopCamera,
    videoRef
  };

  return (
    <CameraContext.Provider value={contextValue}>
      {children}
    </CameraContext.Provider>
  );
}

// Custom hook in separate file to avoid fast refresh issues
export { CameraContext };