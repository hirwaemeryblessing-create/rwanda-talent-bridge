export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          answers: string | null
          cover_letter: string | null
          created_at: string
          cv_path: string | null
          document_paths: string[]
          id: string
          job_id: string
          seeker_id: string
          status: string
          updated_at: string
        }
        Insert: {
          answers?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_path?: string | null
          document_paths?: string[]
          id?: string
          job_id: string
          seeker_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          answers?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_path?: string | null
          document_paths?: string[]
          id?: string
          job_id?: string
          seeker_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_seeker_profile_fk"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "seeker_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          institution_id: string
          seeker_id: string
          updated_at: string
        }
        Insert: {
          id?: string
          institution_id: string
          seeker_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          institution_id?: string
          seeker_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conv_inst_profile_fk"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversations_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_profiles: {
        Row: {
          address: string | null
          contact_name: string | null
          contact_position: string | null
          created_at: string
          description: string | null
          district: string | null
          institution_type: string | null
          logo_url: string | null
          name: string
          province: string | null
          user_id: string
          verified: boolean
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          contact_position?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          institution_type?: string | null
          logo_url?: string | null
          name: string
          province?: string | null
          user_id: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          contact_position?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          institution_type?: string | null
          logo_url?: string | null
          name?: string
          province?: string | null
          user_id?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institution_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string
          id: string
          location: string | null
          mode: string
          notes: string | null
          scheduled_at: string
          status: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          location?: string | null
          mode?: string
          notes?: string | null
          scheduled_at: string
          status?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          location?: string | null
          mode?: string
          notes?: string | null
          scheduled_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          additional_requirements: string | null
          category: string | null
          certifications: string | null
          created_at: string
          deadline: string | null
          description: string
          education_level: string | null
          employment_type: string | null
          fields_of_study: string[]
          gender_requirement: string
          id: string
          institution_id: string
          instructions: string | null
          is_international: boolean
          languages: string[]
          location: string
          match_count: number
          min_experience: number
          positions: number
          qualifications: string | null
          reference: string | null
          required_documents: string | null
          salary_max: number | null
          salary_min: number | null
          skills_preferred: string[]
          skills_required: string[]
          status: string
          title: string
        }
        Insert: {
          additional_requirements?: string | null
          category?: string | null
          certifications?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          education_level?: string | null
          employment_type?: string | null
          fields_of_study?: string[]
          gender_requirement?: string
          id?: string
          institution_id: string
          instructions?: string | null
          is_international?: boolean
          languages?: string[]
          location?: string
          match_count?: number
          min_experience?: number
          positions?: number
          qualifications?: string | null
          reference?: string | null
          required_documents?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills_preferred?: string[]
          skills_required?: string[]
          status?: string
          title: string
        }
        Update: {
          additional_requirements?: string | null
          category?: string | null
          certifications?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          education_level?: string | null
          employment_type?: string | null
          fields_of_study?: string[]
          gender_requirement?: string
          id?: string
          institution_id?: string
          instructions?: string | null
          is_international?: boolean
          languages?: string[]
          location?: string
          match_count?: number
          min_experience?: number
          positions?: number
          qualifications?: string | null
          reference?: string | null
          required_documents?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills_preferred?: string[]
          skills_required?: string[]
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_institution_profile_fk"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institution_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          job_id: string
          score: number
          seeker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          score?: number
          seeker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          score?: number
          seeker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_seeker_profile_fk"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "seeker_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string | null
          created_at: string
          id: string
          job_id: string | null
          kind: string
          read: boolean
          recipient_id: string
          sender_id: string | null
          subject: string | null
        }
        Insert: {
          body: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          kind?: string
          read?: boolean
          recipient_id: string
          sender_id?: string | null
          subject?: string | null
        }
        Update: {
          body?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          kind?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          language: string
          phone: string | null
          status: string
        }
        Insert: {
          account_type: string
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          language?: string
          phone?: string | null
          status?: string
        }
        Update: {
          account_type?: string
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          language?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_id: string
          status: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_id?: string
          status?: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          status?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string
          id: string
          job_id: string
          seeker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          seeker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          seeker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seeker_profiles: {
        Row: {
          cv_path: string | null
          date_of_birth: string | null
          district: string | null
          education_level: string | null
          experience_summary: string | null
          experience_years: number
          field_of_study: string | null
          gender: string | null
          languages: string[]
          preferred_location: string | null
          preferred_sector: string | null
          province: string | null
          qualifications: string | null
          skills: string[]
          updated_at: string
          user_id: string
          visible_to_employers: boolean
        }
        Insert: {
          cv_path?: string | null
          date_of_birth?: string | null
          district?: string | null
          education_level?: string | null
          experience_summary?: string | null
          experience_years?: number
          field_of_study?: string | null
          gender?: string | null
          languages?: string[]
          preferred_location?: string | null
          preferred_sector?: string | null
          province?: string | null
          qualifications?: string | null
          skills?: string[]
          updated_at?: string
          user_id: string
          visible_to_employers?: boolean
        }
        Update: {
          cv_path?: string | null
          date_of_birth?: string | null
          district?: string | null
          education_level?: string | null
          experience_summary?: string | null
          experience_years?: number
          field_of_study?: string | null
          gender?: string | null
          languages?: string[]
          preferred_location?: string | null
          preferred_sector?: string | null
          province?: string | null
          qualifications?: string | null
          skills?: string[]
          updated_at?: string
          user_id?: string
          visible_to_employers?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "seeker_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      app_parties: { Args: { _app: string; _user: string }; Returns: string }
      can_view_seeker: {
        Args: { _seeker: string; _viewer: string }
        Returns: boolean
      }
      edu_rank: { Args: { _lvl: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_eligible: {
        Args: {
          j: Database["public"]["Tables"]["jobs"]["Row"]
          s: Database["public"]["Tables"]["seeker_profiles"]["Row"]
        }
        Returns: boolean
      }
      job_owner: { Args: { _job: string }; Returns: string }
      notify_match: {
        Args: { _job: string; _seeker: string }
        Returns: undefined
      }
      run_job_matching: { Args: { _job: string }; Returns: number }
    }
    Enums: {
      app_role: "admin" | "seeker" | "institution"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "seeker", "institution"],
    },
  },
} as const
