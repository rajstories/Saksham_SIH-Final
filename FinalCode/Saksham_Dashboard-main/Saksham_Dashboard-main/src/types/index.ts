export interface Training {
  id: string;
  title: string;
  theme: string;
  location: {
    lat: number;
    lng: number;
    state: string;
    district: string;
    address: string;
  };
  institution: string;
  institutionType: 'NGO' | 'Government' | 'ATI' | 'SDMA';
  attendees: number;
  date: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  verified: boolean;
}

export interface Incident {
  id: string;
  title: string;
  type: string;
  location: {
    lat: number;
    lng: number;
    state: string;
    district: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'monitoring';
  reportedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'NGO' | 'Government' | 'ATI' | 'SDMA';
  state: string;
  status: 'active' | 'pending' | 'suspended';
  registeredAt: string;
}

export interface Activity {
  id: string;
  type: 'incident' | 'ngo_upload' | 'approval' | 'system_event';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface MapCoordinates {
  lat: number;
  lng: number;
  state: string;
  district?: string;
}

export interface KPI {
  id: string;
  label: string;
  value: number | string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}
