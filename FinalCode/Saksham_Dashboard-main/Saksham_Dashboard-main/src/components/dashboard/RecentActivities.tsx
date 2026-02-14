import { mockActivities } from '../../data/mockData';
import { Activity } from '../../types';
import { 
  AlertTriangle, 
  Upload, 
  CheckCircle, 
  Server,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'incident':
      return AlertTriangle;
    case 'ngo_upload':
      return Upload;
    case 'approval':
      return CheckCircle;
    case 'system_event':
      return Server;
    default:
      return Clock;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'incident':
      return 'bg-red-100 text-red-600';
    case 'ngo_upload':
      return 'bg-blue-100 text-blue-600';
    case 'approval':
      return 'bg-green-100 text-green-600';
    case 'system_event':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getStatusIcon = (status?: Activity['status']) => {
  if (!status) return null;
  return status === 'approved' ? (
    <CheckCircle2 className="h-4 w-4 text-green-600" />
  ) : status === 'rejected' ? (
    <XCircle className="h-4 w-4 text-red-600" />
  ) : (
    <Clock className="h-4 w-4 text-yellow-600" />
  );
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (hours < 1) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const RecentActivities = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#002147' }}>
        Recent Activities
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {mockActivities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          const StatusIcon = getStatusIcon(activity.status);

          return (
            <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                  {StatusIcon && <div className="flex-shrink-0">{StatusIcon}</div>}
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{activity.user}</span>
                  <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

