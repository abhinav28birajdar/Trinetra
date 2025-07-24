// Basic profile structure if not using generated types
export interface Profile {
    id: string;
    username?: string | null;
    email?: string | null;
    phone_number?: string | null;
    age?: number | null;
    blood_group?: string | null;
    avatar_url?: string | null;
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