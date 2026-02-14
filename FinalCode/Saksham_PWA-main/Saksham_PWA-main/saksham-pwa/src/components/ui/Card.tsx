import React from 'react';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  className = '',
  onClick,
}) => {
  const baseClasses = 'bg-white rounded-card p-5 border border-gray-200';
  const shadowClass = elevated ? 'shadow-card-elevated border-2 border-saffron' : 'shadow-card';
  const clickClass = onClick ? 'cursor-pointer hover:shadow-card-elevated transition-shadow' : '';

  return (
    <div
      className={`${baseClasses} ${shadowClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
