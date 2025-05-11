export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  age?: string;
  bloodGroup?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  isEmergency: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface EmergencyService {
  id: string;
  name: string;
  number: string;
  type: 'police' | 'ambulance' | 'fire' | 'other';
}