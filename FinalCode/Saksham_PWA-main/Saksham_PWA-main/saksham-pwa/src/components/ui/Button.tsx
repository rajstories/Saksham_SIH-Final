import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon: Icon,
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-indian-blue text-white h-button rounded-button shadow-button hover:bg-govt-blue px-6 text-button',
    secondary: 'bg-saffron text-white h-button rounded-button shadow-button hover:bg-amber px-6 text-button',
    success: 'bg-indian-green text-white h-button rounded-button shadow-button hover:bg-success-green px-6 text-button',
    danger: 'bg-danger-red text-white h-button rounded-button shadow-button hover:bg-red-700 px-6 text-button',
    icon: 'w-icon-button h-icon-button rounded-full bg-white shadow-card touch-target',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {Icon && <Icon size={variant === 'icon' ? 24 : 20} />}
      {children}
    </button>
  );
};
