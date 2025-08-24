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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          assessment_data_json: Json | null
          completed_at: string | null
          confidence_score: number | null
          correct_answers: number | null
          created_at: string
          final_level: string | null
          id: string
          questions_answered: number | null
          session_id: string
          status: string | null
          strengths_json: Json | null
          updated_at: string
          user_id: string
          weaknesses_json: Json | null
        }
        Insert: {
          assessment_data_json?: Json | null
          completed_at?: string | null
          confidence_score?: number | null
          correct_answers?: number | null
          created_at?: string
          final_level?: string | null
          id?: string
          questions_answered?: number | null
          session_id: string
          status?: string | null
          strengths_json?: Json | null
          updated_at?: string
          user_id: string
          weaknesses_json?: Json | null
        }
        Update: {
          assessment_data_json?: Json | null
          completed_at?: string | null
          confidence_score?: number | null
          correct_answers?: number | null
          created_at?: string
          final_level?: string | null
          id?: string
          questions_answered?: number | null
          session_id?: string
          status?: string | null
          strengths_json?: Json | null
          updated_at?: string
          user_id?: string
          weaknesses_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      competency_framework: {
        Row: {
          category: string
          competency_id: string
          competency_name: string
          created_at: string
          description: string
          examples_json: Json | null
          id: string
          level: number
          prerequisites_json: Json | null
          world_name: string
        }
        Insert: {
          category: string
          competency_id: string
          competency_name: string
          created_at?: string
          description: string
          examples_json?: Json | null
          id?: string
          level: number
          prerequisites_json?: Json | null
          world_name: string
        }
        Update: {
          category?: string
          competency_id?: string
          competency_name?: string
          created_at?: string
          description?: string
          examples_json?: Json | null
          id?: string
          level?: number
          prerequisites_json?: Json | null
          world_name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string | null
          messages_json: Json | null
          performance_data_json: Json | null
          type: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          messages_json?: Json | null
          performance_data_json?: Json | null
          type?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          messages_json?: Json | null
          performance_data_json?: Json | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          adapted_content: Json | null
          competency: string
          completed_at: string | null
          completion_time_seconds: number | null
          created_at: string
          feedback_json: Json | null
          id: string
          lesson_id: string
          lesson_type: string
          mistakes_json: Json | null
          score: number | null
          status: string | null
          target_level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          adapted_content?: Json | null
          competency: string
          completed_at?: string | null
          completion_time_seconds?: number | null
          created_at?: string
          feedback_json?: Json | null
          id?: string
          lesson_id: string
          lesson_type: string
          mistakes_json?: Json | null
          score?: number | null
          status?: string | null
          target_level: number
          updated_at?: string
          user_id: string
        }
        Update: {
          adapted_content?: Json | null
          competency?: string
          completed_at?: string | null
          completion_time_seconds?: number | null
          created_at?: string
          feedback_json?: Json | null
          id?: string
          lesson_id?: string
          lesson_type?: string
          mistakes_json?: Json | null
          score?: number | null
          status?: string | null
          target_level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          competency: string
          content_type: string | null
          created_at: string
          duration: number | null
          exercises_json: Json | null
          id: string
          island: string
          level: string
          razia_prompts_json: Json | null
          title: string
          world: string
        }
        Insert: {
          competency: string
          content_type?: string | null
          created_at?: string
          duration?: number | null
          exercises_json?: Json | null
          id?: string
          island: string
          level: string
          razia_prompts_json?: Json | null
          title: string
          world: string
        }
        Update: {
          competency?: string
          content_type?: string | null
          created_at?: string
          duration?: number | null
          exercises_json?: Json | null
          id?: string
          island?: string
          level?: string
          razia_prompts_json?: Json | null
          title?: string
          world?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          ends_at: string | null
          features_unlocked_json: Json | null
          id: string
          starts_at: string | null
          status: string | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          features_unlocked_json?: Json | null
          id?: string
          starts_at?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          features_unlocked_json?: Json | null
          id?: string
          starts_at?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          conversation_count: number | null
          created_at: string
          id: string
          island_name: string
          lessons_completed: number | null
          mastery_score: number | null
          strengths_json: Json | null
          updated_at: string
          user_id: string
          voice_recordings_used: number | null
          weaknesses_json: Json | null
          world_name: string
        }
        Insert: {
          conversation_count?: number | null
          created_at?: string
          id?: string
          island_name: string
          lessons_completed?: number | null
          mastery_score?: number | null
          strengths_json?: Json | null
          updated_at?: string
          user_id: string
          voice_recordings_used?: number | null
          weaknesses_json?: Json | null
          world_name: string
        }
        Update: {
          conversation_count?: number | null
          created_at?: string
          id?: string
          island_name?: string
          lessons_completed?: number | null
          mastery_score?: number | null
          strengths_json?: Json | null
          updated_at?: string
          user_id?: string
          voice_recordings_used?: number | null
          weaknesses_json?: Json | null
          world_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accent_preference: string | null
          age_group: string | null
          assessed_level: number | null
          assessment_completed: boolean | null
          country: string | null
          created_at: string
          current_level: string | null
          daily_goal_minutes: number | null
          email: string
          explanation_preference: string | null
          gender: string | null
          id: string
          journey_unlocked: boolean | null
          learning_goal: string | null
          onboarding_completed: boolean | null
          subscription_status: string | null
          target_ielts_band: number | null
          updated_at: string
          worlds_unlocked: number | null
        }
        Insert: {
          accent_preference?: string | null
          age_group?: string | null
          assessed_level?: number | null
          assessment_completed?: boolean | null
          country?: string | null
          created_at?: string
          current_level?: string | null
          daily_goal_minutes?: number | null
          email: string
          explanation_preference?: string | null
          gender?: string | null
          id?: string
          journey_unlocked?: boolean | null
          learning_goal?: string | null
          onboarding_completed?: boolean | null
          subscription_status?: string | null
          target_ielts_band?: number | null
          updated_at?: string
          worlds_unlocked?: number | null
        }
        Update: {
          accent_preference?: string | null
          age_group?: string | null
          assessed_level?: number | null
          assessment_completed?: boolean | null
          country?: string | null
          created_at?: string
          current_level?: string | null
          daily_goal_minutes?: number | null
          email?: string
          explanation_preference?: string | null
          gender?: string | null
          id?: string
          journey_unlocked?: boolean | null
          learning_goal?: string | null
          onboarding_completed?: boolean | null
          subscription_status?: string | null
          target_ielts_band?: number | null
          updated_at?: string
          worlds_unlocked?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: { admin_email: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      make_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      subscription_status: "trial" | "active" | "expired" | "cancelled"
      user_role: "student" | "admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      cefr_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      subscription_status: ["trial", "active", "expired", "cancelled"],
      user_role: ["student", "admin"],
    },
  },
} as const
