import React, { useEffect } from 'react';
import { X, Mic } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { Button } from './ui/Button';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
  language?: string;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onResult,
  language = 'hi-IN',
}) => {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    detectedLanguage,
  } = useVoiceInput({
    language,
    onResult: (text) => {
      onResult(text);
      setTimeout(onClose, 500);
    },
  });

  useEffect(() => {
    if (isOpen && isSupported) {
      startListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-card p-6 max-w-sm w-full">
          <p className="text-body text-center text-danger-red">
            Voice input is not supported in your browser
          </p>
          <Button onClick={onClose} className="mt-4" fullWidth>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-card p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-card-title font-semibold">Voice Input</h2>
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-saffron to-amber flex items-center justify-center">
              <Mic size={48} className="text-white" />
            </div>
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-danger-red recording-pulse" />
            )}
          </div>

          <div className="text-center">
            <p className="text-body font-medium text-indian-blue">
              {isListening ? '🎙️ Listening...' : 'Starting...'}
            </p>
            {detectedLanguage && (
              <p className="text-small text-gray-500 mt-1">
                Detected: {detectedLanguage === 'hi-IN' ? 'Hindi' : 'English'}
              </p>
            )}
          </div>
        </div>

        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-micro text-gray-500 mb-1">You said:</p>
            <p className="text-body">{transcript}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="danger"
            onClick={() => {
              stopListening();
              onClose();
            }}
            fullWidth
          >
            Cancel
          </Button>
          {transcript && (
            <Button
              onClick={() => {
                onResult(transcript);
                onClose();
              }}
              fullWidth
            >
              Use This
            </Button>
          )}
        </div>

        <p className="text-micro text-gray-500 text-center mt-4">
          Speak clearly in Hindi or English
        </p>
      </div>
    </div>
  );
};
