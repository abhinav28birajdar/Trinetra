// E:/programming/React Native/women_safety_app/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  emergencyContacts: Contact[];
  profileImage?: string;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: string;
  isTrusted: boolean;
  isFavorite: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SOSState {
  isActive: boolean;
  countdown: number;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  activatedAt: Date | null;
  notifiedContacts: string[];
  sirenActive: boolean;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  locationSharing: boolean;
  autoSOS: boolean;
  sosCountdownDuration: number;
  sirenEnabled: boolean;
  vibrationEnabled: boolean;
  language: "en" | "hi" | "es" | "fr";
}

export interface SafetyResource {
  id: string;
  title: string;
  description: string;
  url?: string;
  type: "article" | "video" | "link" | "tip";
}

export interface EvidenceItem {
  id: string;
  type: "photo" | "video" | "audio" | "note";
  uri: string;
  timestamp: Date;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
}

// Define the specific categories expected by SafetyTipCard
export type SafetyTipCategory =
  | "general"
  | "travel"
  | "home"
  | "digital"
  | "public"
  | "planning"
  | "awareness"
  | "preparedness"
  | string; // Allow base string for flexibility, but prioritize known categories

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: SafetyTipCategory; // Use the specific category type union
}