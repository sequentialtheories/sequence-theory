export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_access_logs: {
        Row: {
          api_key_id: string | null
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown | null
          request_data: Json | null
          response_status: number | null
          user_agent: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown | null
          request_data?: Json | null
          response_status?: number | null
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          request_data?: Json | null
          response_status?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_access_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      api_audit_logs: {
        Row: {
          api_key_id: string | null
          created_at: string
          endpoint: string
          id: string
          idempotency_key: string | null
          method: string
          request_hash: string | null
          request_meta: Json | null
          response_meta: Json | null
          status_code: number
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          endpoint: string
          id?: string
          idempotency_key?: string | null
          method: string
          request_hash?: string | null
          request_meta?: Json | null
          response_meta?: Json | null
          status_code: number
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          endpoint?: string
          id?: string
          idempotency_key?: string | null
          method?: string
          request_hash?: string | null
          request_meta?: Json | null
          response_meta?: Json | null
          status_code?: number
          user_id?: string | null
        }
        Relationships: []
      }
      api_idempotency: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          idempotency_key: string
          method: string
          response_body: Json
          status_code: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          idempotency_key: string
          method: string
          response_body: Json
          status_code: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          idempotency_key?: string
          method?: string
          response_body?: Json
          status_code?: number
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contract_deposits: {
        Row: {
          amount: number
          contract_id: string
          created_at: string
          deposit_date: string
          id: string
          participant_id: string
          status: string
          transaction_hash: string | null
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          amount: number
          contract_id: string
          created_at?: string
          deposit_date?: string
          id?: string
          participant_id: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          contract_id?: string
          created_at?: string
          deposit_date?: string
          id?: string
          participant_id?: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_deposits_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_deposits_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "contract_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_participants: {
        Row: {
          contract_id: string
          contribution_amount: number
          created_at: string
          id: string
          joined_at: string
          status: string
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          contract_id: string
          contribution_amount: number
          created_at?: string
          id?: string
          joined_at?: string
          status?: string
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          contract_id?: string
          contribution_amount?: number
          created_at?: string
          id?: string
          joined_at?: string
          status?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_participants_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          contract_type: string
          created_at: string
          current_amount: number
          current_participants: number
          description: string | null
          end_date: string | null
          id: string
          maximum_participants: number
          minimum_contribution: number
          name: string
          start_date: string | null
          status: string
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contract_type?: string
          created_at?: string
          current_amount?: number
          current_participants?: number
          description?: string | null
          end_date?: string | null
          id?: string
          maximum_participants?: number
          minimum_contribution?: number
          name: string
          start_date?: string | null
          status?: string
          target_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contract_type?: string
          created_at?: string
          current_amount?: number
          current_participants?: number
          description?: string | null
          end_date?: string | null
          id?: string
          maximum_participants?: number
          minimum_contribution?: number
          name?: string
          start_date?: string | null
          status?: string
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_messages: {
        Row: {
          body: string
          created_at: string
          created_by: string
          id: string
          topic_id: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by: string
          id?: string
          topic_id: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string
          id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          created_at: string
          created_by: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          category_index: number
          completed_at: string
          created_at: string
          id: string
          module_id: string
          module_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category_index: number
          completed_at?: string
          created_at?: string
          id?: string
          module_id: string
          module_index: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category_index?: number
          completed_at?: string
          created_at?: string
          id?: string
          module_id?: string
          module_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          joined_at: string
          role: string
          subclub_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          role?: string
          subclub_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          role?: string
          subclub_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_subclub_id_fkey"
            columns: ["subclub_id"]
            isOneToOne: false
            referencedRelation: "subclubs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subclubs: {
        Row: {
          created_at: string
          created_by: string
          id: string
          lock_months: number
          name: string
          rigor: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          lock_months: number
          name: string
          rigor: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          lock_months?: number
          name?: string
          rigor?: string
        }
        Relationships: []
      }
      tx_ledger: {
        Row: {
          amount_usdc: number | null
          created_at: string
          details: Json
          id: string
          idempotency_key: string
          kind: string
          status: string
          subclub_id: string
          user_id: string
        }
        Insert: {
          amount_usdc?: number | null
          created_at?: string
          details?: Json
          id?: string
          idempotency_key: string
          kind: string
          status: string
          subclub_id: string
          user_id: string
        }
        Update: {
          amount_usdc?: number | null
          created_at?: string
          details?: Json
          id?: string
          idempotency_key?: string
          kind?: string
          status?: string
          subclub_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tx_ledger_subclub_id_fkey"
            columns: ["subclub_id"]
            isOneToOne: false
            referencedRelation: "subclubs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          created_at: string
          email: string | null
          id: string
          network: string
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          network?: string
          updated_at?: string
          user_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          network?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      vault_epoch_deposits: {
        Row: {
          amount: number
          created_at: string
          epoch_number: number
          id: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          epoch_number: number
          id?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          epoch_number?: number
          id?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vault_epoch_deposits_epoch_number_fkey"
            columns: ["epoch_number"]
            isOneToOne: false
            referencedRelation: "vault_epochs"
            referencedColumns: ["epoch_number"]
          },
        ]
      }
      vault_epoch_harvests: {
        Row: {
          created_at: string
          epoch_number: number
          executed_by: string | null
          id: string
          yield_amount: number
        }
        Insert: {
          created_at?: string
          epoch_number: number
          executed_by?: string | null
          id?: string
          yield_amount?: number
        }
        Update: {
          created_at?: string
          epoch_number?: number
          executed_by?: string | null
          id?: string
          yield_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "vault_epoch_harvests_epoch_number_fkey"
            columns: ["epoch_number"]
            isOneToOne: false
            referencedRelation: "vault_epochs"
            referencedColumns: ["epoch_number"]
          },
        ]
      }
      vault_epochs: {
        Row: {
          created_at: string
          ends_at: string
          epoch_number: number
          id: string
          starts_at: string
          status: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          epoch_number: number
          id?: string
          starts_at: string
          status: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          epoch_number?: number
          id?: string
          starts_at?: string
          status?: string
        }
        Relationships: []
      }
      vault_states: {
        Row: {
          epoch_week: number
          p1_usdc: number
          p2_usdc: number
          p3_usdc: number
          subclub_id: string
          tvl_usdc: number
          wbtc_sats: number
        }
        Insert: {
          epoch_week: number
          p1_usdc: number
          p2_usdc: number
          p3_usdc: number
          subclub_id: string
          tvl_usdc: number
          wbtc_sats?: number
        }
        Update: {
          epoch_week?: number
          p1_usdc?: number
          p2_usdc?: number
          p3_usdc?: number
          subclub_id?: string
          tvl_usdc?: number
          wbtc_sats?: number
        }
        Relationships: [
          {
            foreignKeyName: "vault_states_subclub_id_fkey"
            columns: ["subclub_id"]
            isOneToOne: false
            referencedRelation: "subclubs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_contracts: {
        Args: Record<PropertyKey, never>
        Returns: {
          contract_id: string
          contract_name: string
          contract_type: string
          target_amount: number
          current_amount: number
          status: string
          is_creator: boolean
          is_participant: boolean
          created_at: string
        }[]
      }
      get_user_progress: {
        Args: Record<PropertyKey, never>
        Returns: {
          module_id: string
          category_index: number
          module_index: number
          completed_at: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      hash_api_key: {
        Args: { api_key: string }
        Returns: string
      }
      is_owner_of_subclub: {
        Args: { p_subclub_id: string }
        Returns: boolean
      }
      join_contract: {
        Args: {
          p_contract_id: string
          p_contribution_amount: number
          p_wallet_address?: string
        }
        Returns: boolean
      }
      log_api_access: {
        Args: {
          p_api_key_id: string
          p_endpoint: string
          p_ip_address: unknown
          p_user_agent: string
          p_request_data: Json
          p_response_status: number
        }
        Returns: undefined
      }
      save_learning_progress: {
        Args: {
          p_module_id: string
          p_category_index: number
          p_module_index: number
        }
        Returns: undefined
      }
      validate_api_key: {
        Args: { input_api_key: string }
        Returns: {
          key_id: string
          user_id: string
          permissions: Json
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
