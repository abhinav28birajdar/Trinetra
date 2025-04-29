export interface User {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    homeAddress?: string;
    profilePicture?: string;
  }
  
  export interface EmergencyContact {
    id: string;
    fullName: string;
    phoneNumber: string;
    relationship: string;
    isPrimary: boolean;
  }
  
  export interface SafetyTip {
    id: string;
    title: string;
    description: string;
    icon: string;
  }
  
  export interface Helpline {
    id: string;
    service: string;
    number: string;
    description: string;
  }
  
  export interface AppSettings {
    enableSiren: boolean;
    autoCallPrimary: boolean;
    language: 'en' | 'hi' | 'es';
    enableFakeCall: boolean;
    darkMode: boolean;
  }
  
  export interface Evidence {
    id: string;
    type: 'photo' | 'video' | 'audio';
    uri: string;
    timestamp: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    shared: boolean;
  }