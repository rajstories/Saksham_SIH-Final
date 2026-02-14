import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceButtonProps {
  isRecording?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'inline' | 'fixed';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isRecording = false,
  onClick,
  className = '',
  size = 'large',
  position = 'inline',
}) => {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-voice-button h-voice-button',
  };

  const iconSizes = {
    small: 20,
    medium: 24,
    large: 32,
  };

  const positionClasses = position === 'fixed'
    ? 'fixed bottom-24 right-6 z-50'
    : '';

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${positionClasses}
        rounded-full bg-gradient-to-br from-saffron to-amber
        shadow-voice flex items-center justify-center
        transition-all duration-200 active:scale-95
        ${isRecording ? 'recording-pulse' : ''}
        ${className}
      `}
    >
      <Mic size={iconSizes[size]} className="text-white" />
      {isRecording && (
        <span className="absolute inset-0 rounded-full border-4 border-danger-red recording-pulse" />
      )}
    </button>
  );
};
