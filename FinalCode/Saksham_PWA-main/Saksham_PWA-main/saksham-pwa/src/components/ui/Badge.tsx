import React from 'react';
import { type LucideIcon, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export type BadgeVariant = 'online' | 'offline' | 'syncing' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string; icon?: LucideIcon }> = {
  online: { bg: 'bg-indian-green', text: 'text-white', icon: Wifi },
  offline: { bg: 'bg-amber', text: 'text-white', icon: WifiOff },
  syncing: { bg: 'bg-blue-500', text: 'text-white', icon: RefreshCw },
  success: { bg: 'bg-success-green', text: 'text-white' },
  warning: { bg: 'bg-amber', text: 'text-white' },
  danger: { bg: 'bg-danger-red', text: 'text-white' },
};

export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  showIcon = true,
  className = '',
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-small font-medium ${config.bg} ${config.text} ${className}`}
    >
      {showIcon && Icon && (
        <Icon
          size={14}
          className={variant === 'syncing' ? 'animate-spin' : ''}
        />
      )}
      {children}
    </span>
  );
};

interface StatusDotProps {
  variant: 'online' | 'offline' | 'active';
  pulse?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ variant, pulse = false }) => {
  const colors = {
    online: 'bg-indian-green',
    offline: 'bg-amber',
    active: 'bg-success-green',
  };

  return (
    <span className="relative inline-flex">
      <span className={`w-2 h-2 rounded-full ${colors[variant]}`} />
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${colors[variant]} opacity-75 animate-ping`}
        />
      )}
    </span>
  );
};
