export interface User {
  id: string;
  username: string;
  email: string;
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
  isEmergencyContact: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
}