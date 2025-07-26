// Basic profile structure if not using generated types
export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
    // Additional fields for profile management
    emergency_contact_1?: string | null;
    emergency_contact_2?: string | null;
    address?: string | null;
    city?: string | null;
    blood_group?: string | null;
    medical_conditions?: string | null;
    emergency_message?: string | null;
    location_sharing_enabled?: boolean;
    push_notifications_enabled?: boolean;
}

export interface Contact {
    id: number;
    user_id: string;
    name: string;
    phone_number: string;
    created_at: string;
}

export interface Message {
    id: number;
    user_id: string;
    content: string;
    created_at: string;
    // Add profile details if joining
    profiles?: {
        username?: string | null;
        avatar_url?: string | null;
    } | null;
}