import { KPI } from '../../types';
import { LucideIcon } from 'lucide-react';
import { 
  GraduationCap, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
};

export const KPICard = ({ label, value, icon, trend, trendValue }: KPI) => {
  const Icon = iconMap[icon] || GraduationCap;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold mb-2" style={{ color: '#002147' }}>{value}</p>
          {trend && trendValue && (
            <div className="flex items-center space-x-1">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : null}
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {trend === 'up' ? '+' : ''}{trendValue}% {trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : ''}
              </span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 33, 71, 0.1)' }}>
          <Icon className="h-6 w-6" style={{ color: '#002147' }} />
        </div>
      </div>
    </div>
  );
};

