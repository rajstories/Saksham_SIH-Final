import { useState, useCallback, useRef } from 'react';

interface VoiceInputOptions {
  language?: string;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface VoiceInputReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  detectedLanguage: string | null;
}

export const useVoiceInput = ({
  language = 'hi-IN',
  onResult,
  onError,
}: VoiceInputOptions = {}): VoiceInputReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const startListening = useCallback(() => {
    if (!isSupported) {
      onError?.('Speech recognition is not supported in this browser');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;

        setTranscript(transcriptResult);

        // Auto-detect language based on script
        if (/[\u0900-\u097F]/.test(transcriptResult)) {
          setDetectedLanguage('hi-IN');
        } else {
          setDetectedLanguage('en-IN');
        }

        if (event.results[current].isFinal) {
          onResult?.(transcriptResult);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        onError?.(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError?.('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [isSupported, language, onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    detectedLanguage,
  };
};
