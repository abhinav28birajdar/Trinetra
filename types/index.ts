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
  user_id: string;
  name: string;
  phone_number: string;
  relationship?: string;
  is_emergency_contact?: boolean;
  created_at: string;
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