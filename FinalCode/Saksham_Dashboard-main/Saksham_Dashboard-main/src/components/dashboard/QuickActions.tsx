import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Upload,
  Plus
} from 'lucide-react';

const actions = [
  {
    id: 'create-incident',
    label: 'Create Incident',
    icon: Plus,
    color: 'bg-red-100 text-red-600 hover:bg-red-200',
    action: () => console.log('Create Incident')
  },
  {
    id: 'send-alert',
    label: 'Send Alert',
    icon: Bell,
    color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    action: () => console.log('Send Alert')
  },
  {
    id: 'approve-ngo',
    label: 'Approve NGO',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600 hover:bg-green-200',
    action: () => console.log('Approve NGO')
  },
  {
    id: 'upload-training',
    label: 'Upload Training Data',
    icon: Upload,
    color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    action: () => console.log('Upload Training Data')
  }
];

export const QuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#002147' }}>
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`flex flex-col items-center justify-center p-6 rounded-lg transition-colors ${action.color}`}
            >
              <Icon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

