export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          email: string | null;
          avatar_url: string | null;
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          email?: string | null;
          avatar_url?: string | null;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          avatar_url?: string | null;
          is_favorite?: boolean;
          updated_at?: string;
        };
      };
      call_logs: {
        Row: {
          id: string;
          user_id: string;
          contact_id: string | null;
          phone_number: string;
          contact_name: string | null;
          call_type: 'incoming' | 'outgoing' | 'missed';
          duration: number; // in seconds
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_id?: string | null;
          phone_number: string;
          contact_name?: string | null;
          call_type: 'incoming' | 'outgoing' | 'missed';
          duration?: number;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_id?: string | null;
          phone_number?: string;
          contact_name?: string | null;
          call_type?: 'incoming' | 'outgoing' | 'missed';
          duration?: number;
          timestamp?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      call_type: 'incoming' | 'outgoing' | 'missed';
    };
  };
};
