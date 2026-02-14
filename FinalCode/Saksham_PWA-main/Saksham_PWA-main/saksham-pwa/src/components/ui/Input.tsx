import React from 'react';
import { Mic } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  voiceEnabled?: boolean;
  onVoiceClick?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  voiceEnabled = false,
  onVoiceClick,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-small font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full h-input px-4 border-2 border-gray-200 rounded-input text-body
            focus:outline-none focus:border-indian-blue focus:ring-4 focus:ring-indian-blue/10
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-danger-red' : ''}
            ${voiceEnabled ? 'pr-14' : ''}
            ${className}`}
          {...props}
        />
        {voiceEnabled && (
          <button
            type="button"
            onClick={onVoiceClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-amber flex items-center justify-center hover:shadow-voice transition-shadow"
          >
            <Mic size={20} className="text-white" />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-small text-danger-red">{error}</p>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  voiceEnabled?: boolean;
  onVoiceClick?: () => void;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  voiceEnabled = false,
  onVoiceClick,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-small font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          className={`w-full min-h-[120px] px-4 py-3 border-2 border-gray-200 rounded-input text-body
            focus:outline-none focus:border-indian-blue focus:ring-4 focus:ring-indian-blue/10
            disabled:bg-gray-100 disabled:cursor-not-allowed resize-y
            ${error ? 'border-danger-red' : ''}
            ${voiceEnabled ? 'pr-14' : ''}
            ${className}`}
          {...props}
        />
        {voiceEnabled && (
          <button
            type="button"
            onClick={onVoiceClick}
            className="absolute right-2 top-2 w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-amber flex items-center justify-center hover:shadow-voice transition-shadow"
          >
            <Mic size={20} className="text-white" />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-small text-danger-red">{error}</p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-small font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full h-input px-4 border-2 border-gray-200 rounded-input text-body
          focus:outline-none focus:border-indian-blue focus:ring-4 focus:ring-indian-blue/10
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-danger-red' : ''}
          ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-small text-danger-red">{error}</p>
      )}
    </div>
  );
};
