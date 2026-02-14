import { Training, Incident, Organization, Activity, KPI } from '../types';

export const mockKPIs: KPI[] = [
  {
    id: 'total-trainings',
    label: 'Total Trainings',
    value: '2,847',
    icon: 'GraduationCap',
    trend: 'up',
    trendValue: 12.5
  },
  {
    id: 'active-incidents',
    label: 'Active Incidents',
    value: '23',
    icon: 'AlertTriangle',
    trend: 'down',
    trendValue: 8.3
  },
  {
    id: 'registered-ngos',
    label: 'Registered NGOs',
    value: '1,234',
    icon: 'Building2',
    trend: 'up',
    trendValue: 5.2
  },
  {
    id: 'states-onboarded',
    label: 'States Onboarded',
    value: '28/29',
    icon: 'MapPin',
    trend: 'neutral'
  },
  {
    id: 'pending-approvals',
    label: 'Pending Approvals',
    value: '47',
    icon: 'Clock',
    trend: 'down',
    trendValue: 15.0
  }
];

export const mockTrainings: Training[] = [
  {
    id: 't1',
    title: 'Flood Management Workshop',
    theme: 'Flood Management',
    location: {
      lat: 25.5941,
      lng: 85.1376,
      state: 'Bihar',
      district: 'Patna',
      address: 'Patna District Office'
    },
    institution: 'Bihar SDMA',
    institutionType: 'SDMA',
    attendees: 45,
    date: '2024-11-28',
    status: 'completed',
    verified: true
  },
  {
    id: 't2',
    title: 'Earthquake Preparedness Training',
    theme: 'Earthquake Preparedness',
    location: {
      lat: 28.7041,
      lng: 77.1025,
      state: 'Delhi',
      district: 'New Delhi',
      address: 'NDMA Headquarters'
    },
    institution: 'NDMA',
    institutionType: 'Government',
    attendees: 120,
    date: '2024-11-29',
    status: 'completed',
    verified: true
  },
  {
    id: 't3',
    title: 'Cyclone Response Workshop',
    theme: 'Cyclone Response',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      state: 'Maharashtra',
      district: 'Mumbai',
      address: 'Mumbai Municipal Corporation'
    },
    institution: 'Mumbai Disaster Management',
    institutionType: 'Government',
    attendees: 78,
    date: '2024-11-27',
    status: 'completed',
    verified: true
  },
  {
    id: 't4',
    title: 'First Aid Training',
    theme: 'First Aid',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      state: 'Karnataka',
      district: 'Bangalore',
      address: 'Bangalore NGO Center'
    },
    institution: 'Help Foundation',
    institutionType: 'NGO',
    attendees: 32,
    date: '2024-11-30',
    status: 'completed',
    verified: false
  },
  {
    id: 't5',
    title: 'Fire Safety Workshop',
    theme: 'Fire Safety',
    location: {
      lat: 22.5726,
      lng: 88.3639,
      state: 'West Bengal',
      district: 'Kolkata',
      address: 'Kolkata Fire Station'
    },
    institution: 'West Bengal SDMA',
    institutionType: 'SDMA',
    attendees: 56,
    date: '2024-11-26',
    status: 'completed',
    verified: true
  },
  {
    id: 't6',
    title: 'Search & Rescue Training',
    theme: 'Search & Rescue',
    location: {
      lat: 26.9124,
      lng: 75.7873,
      state: 'Rajasthan',
      district: 'Jaipur',
      address: 'Jaipur Training Center'
    },
    institution: 'Rajasthan ATI',
    institutionType: 'ATI',
    attendees: 89,
    date: '2024-11-25',
    status: 'completed',
    verified: true
  },
  {
    id: 't7',
    title: 'Evacuation Procedures',
    theme: 'Evacuation Procedures',
    location: {
      lat: 17.3850,
      lng: 78.4867,
      state: 'Telangana',
      district: 'Hyderabad',
      address: 'Hyderabad Emergency Center'
    },
    institution: 'Telangana SDMA',
    institutionType: 'SDMA',
    attendees: 67,
    date: '2024-11-24',
    status: 'completed',
    verified: true
  },
  {
    id: 't8',
    title: 'Communication Training',
    theme: 'Communication',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      state: 'Tamil Nadu',
      district: 'Chennai',
      address: 'Chennai NGO Hub'
    },
    institution: 'Community Connect NGO',
    institutionType: 'NGO',
    attendees: 41,
    date: '2024-11-23',
    status: 'completed',
    verified: false
  },
  {
    id: 't9',
    title: 'Disaster Response Training',
    theme: 'Search & Rescue',
    location: {
      lat: 30.7333,
      lng: 76.7794,
      state: 'Punjab',
      district: 'Chandigarh',
      address: 'Chandigarh Emergency Services'
    },
    institution: 'Punjab SDMA',
    institutionType: 'SDMA',
    attendees: 65,
    date: '2024-11-22',
    status: 'completed',
    verified: true
  },
  {
    id: 't10',
    title: 'Flood Preparedness Workshop',
    theme: 'Flood Management',
    location: {
      lat: 26.1445,
      lng: 91.7362,
      state: 'Assam',
      district: 'Guwahati',
      address: 'Assam Disaster Management Center'
    },
    institution: 'Assam SDMA',
    institutionType: 'SDMA',
    attendees: 52,
    date: '2024-11-21',
    status: 'completed',
    verified: true
  },
  {
    id: 't11',
    title: 'Cyclone Safety Training',
    theme: 'Cyclone Response',
    location: {
      lat: 20.2961,
      lng: 85.8245,
      state: 'Odisha',
      district: 'Bhubaneswar',
      address: 'Odisha Cyclone Center'
    },
    institution: 'Odisha SDMA',
    institutionType: 'SDMA',
    attendees: 94,
    date: '2024-11-20',
    status: 'completed',
    verified: true
  },
  {
    id: 't12',
    title: 'Community Resilience Program',
    theme: 'First Aid',
    location: {
      lat: 23.0225,
      lng: 72.5714,
      state: 'Gujarat',
      district: 'Ahmedabad',
      address: 'Gujarat NGO Alliance'
    },
    institution: 'Gujarat Relief Foundation',
    institutionType: 'NGO',
    attendees: 38,
    date: '2024-11-19',
    status: 'completed',
    verified: false
  },
  {
    id: 't13',
    title: 'Earthquake Safety Workshop',
    theme: 'Earthquake Preparedness',
    location: {
      lat: 30.0668,
      lng: 79.0193,
      state: 'Uttarakhand',
      district: 'Dehradun',
      address: 'Uttarakhand ATI'
    },
    institution: 'Uttarakhand ATI',
    institutionType: 'ATI',
    attendees: 71,
    date: '2024-11-18',
    status: 'completed',
    verified: true
  },
  {
    id: 't14',
    title: 'Emergency Communication Training',
    theme: 'Communication',
    location: {
      lat: 24.5854,
      lng: 73.7125,
      state: 'Rajasthan',
      district: 'Udaipur',
      address: 'Rajasthan Emergency Services'
    },
    institution: 'Rajasthan Government',
    institutionType: 'Government',
    attendees: 48,
    date: '2024-11-17',
    status: 'completed',
    verified: true
  },
  {
    id: 't15',
    title: 'Disaster Risk Reduction',
    theme: 'Flood Management',
    location: {
      lat: 10.8505,
      lng: 76.2711,
      state: 'Kerala',
      district: 'Kochi',
      address: 'Kerala Disaster Management'
    },
    institution: 'Kerala SDMA',
    institutionType: 'SDMA',
    attendees: 83,
    date: '2024-11-16',
    status: 'completed',
    verified: true
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'i1',
    title: 'Flood Alert - Bihar',
    type: 'Flood',
    location: {
      lat: 25.5941,
      lng: 85.1376,
      state: 'Bihar',
      district: 'Patna'
    },
    severity: 'high',
    status: 'active',
    reportedAt: '2024-11-30T10:30:00Z'
  },
  {
    id: 'i2',
    title: 'Cyclone Warning - Odisha',
    type: 'Cyclone',
    location: {
      lat: 20.2961,
      lng: 85.8245,
      state: 'Odisha',
      district: 'Bhubaneswar'
    },
    severity: 'critical',
    status: 'active',
    reportedAt: '2024-11-30T08:15:00Z'
  }
];

export const mockOrganizations: Organization[] = [
  {
    id: 'o1',
    name: 'Help Foundation',
    type: 'NGO',
    state: 'Karnataka',
    status: 'active',
    registeredAt: '2024-01-15'
  },
  {
    id: 'o2',
    name: 'Community Connect NGO',
    type: 'NGO',
    state: 'Tamil Nadu',
    status: 'active',
    registeredAt: '2024-03-20'
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'ngo_upload',
    title: 'New Training Data Uploaded',
    description: 'Help Foundation uploaded training data for First Aid Training in Bangalore',
    user: 'Help Foundation',
    timestamp: '2024-11-30T14:30:00Z',
    status: 'pending'
  },
  {
    id: 'a2',
    type: 'incident',
    title: 'New Incident Reported',
    description: 'Flood Alert reported in Patna, Bihar',
    user: 'Bihar SDMA',
    timestamp: '2024-11-30T10:30:00Z'
  },
  {
    id: 'a3',
    type: 'approval',
    title: 'NGO Registration Approved',
    description: 'Community Connect NGO registration has been approved',
    user: 'Admin',
    timestamp: '2024-11-30T09:15:00Z',
    status: 'approved'
  },
  {
    id: 'a4',
    type: 'system_event',
    title: 'System Backup Completed',
    description: 'Daily system backup completed successfully',
    user: 'System',
    timestamp: '2024-11-30T06:00:00Z'
  },
  {
    id: 'a5',
    type: 'ngo_upload',
    title: 'Training Data Uploaded',
    description: 'Community Connect NGO uploaded Communication Training data',
    user: 'Community Connect NGO',
    timestamp: '2024-11-29T16:45:00Z',
    status: 'pending'
  },
  {
    id: 'a6',
    type: 'incident',
    title: 'Cyclone Warning Issued',
    description: 'Cyclone warning issued for Odisha coast',
    user: 'Odisha SDMA',
    timestamp: '2024-11-30T08:15:00Z'
  }
];

