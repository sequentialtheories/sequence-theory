interface FeatureFlags {
  SIMULATION_MODE: boolean;
  DISABLE_METAMASK: boolean;
  TESTNET_ONLY: boolean;
  DEBUG_MODE: boolean;
}

interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  tvcApiBase: string;
  chainId: number;
  sequenceProjectAccessKey: string;
  sequenceWaasConfigKey: string;
  vaultClubApiKey: string;
  appEnv: string;
  featureFlags: FeatureFlags;
}

class ConfigService {
  private config: AppConfig;
  private featureFlagsCache: FeatureFlags | null = null;
  private lastFetchTime = 0;
  private readonly CACHE_DURATION = 30000;

  constructor() {
    this.config = this.loadEnvironmentConfig();
  }

  private loadEnvironmentConfig(): AppConfig {
    return {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGpobG5zcGhsaXhtenpyZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTQyNjgsImV4cCI6MjA2ODU5MDI2OH0.mIYpRjdBedu6VQl4wBUIbNM1WwOAN_vHdKNhF5l4g9o',
      tvcApiBase: import.meta.env.VITE_TVC_API_BASE || '',
      chainId: parseInt(import.meta.env.CHAIN_ID || '80002'),
      sequenceProjectAccessKey: import.meta.env.VITE_SEQUENCE_PROJECT_ACCESS_KEY || '',
      sequenceWaasConfigKey: import.meta.env.VITE_SEQUENCE_WAAS_CONFIG_KEY || '',
      vaultClubApiKey: import.meta.env.VITE_VAULT_CLUB_API_KEY || '',
      appEnv: import.meta.env.VITE_APP_ENV || 'development',
      featureFlags: {
        SIMULATION_MODE: import.meta.env.SIMULATION_MODE === '1' || import.meta.env.SIMULATION_MODE === 'true',
        DISABLE_METAMASK: import.meta.env.VITE_DISABLE_METAMASK === '1' || import.meta.env.VITE_DISABLE_METAMASK === 'true',
        TESTNET_ONLY: import.meta.env.FEATURE_TESTNET_ONLY === '1' || import.meta.env.FEATURE_TESTNET_ONLY === 'true',
        DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true'
      }
    };
  }

  private async fetchRuntimeFeatureFlags(): Promise<FeatureFlags> {
    try {
      const response = await fetch(`${this.config.supabaseUrl}/functions/v1/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.supabaseAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          SIMULATION_MODE: data.SIMULATION_MODE ?? this.config.featureFlags.SIMULATION_MODE,
          DISABLE_METAMASK: data.DISABLE_METAMASK ?? this.config.featureFlags.DISABLE_METAMASK,
          TESTNET_ONLY: data.TESTNET_ONLY ?? this.config.featureFlags.TESTNET_ONLY,
          DEBUG_MODE: data.DEBUG_MODE ?? this.config.featureFlags.DEBUG_MODE
        };
      }
    } catch (error) {
      console.warn('Failed to fetch runtime feature flags, using environment defaults');
    }

    return this.config.featureFlags;
  }

  async getFeatureFlags(): Promise<FeatureFlags> {
    const now = Date.now();
    
    if (!this.featureFlagsCache || (now - this.lastFetchTime) > this.CACHE_DURATION) {
      this.featureFlagsCache = await this.fetchRuntimeFeatureFlags();
      this.lastFetchTime = now;
    }

    return this.featureFlagsCache;
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  getSupabaseUrl(): string {
    return this.config.supabaseUrl;
  }

  getSupabaseAnonKey(): string {
    return this.config.supabaseAnonKey;
  }

  getTvcApiBase(): string {
    return this.config.tvcApiBase;
  }

  getChainId(): number {
    return this.config.chainId;
  }

  isSimulationMode(): Promise<boolean> {
    return this.getFeatureFlags().then(flags => flags.SIMULATION_MODE);
  }

  isMetaMaskDisabled(): Promise<boolean> {
    return this.getFeatureFlags().then(flags => flags.DISABLE_METAMASK);
  }

  isTestnetOnly(): Promise<boolean> {
    return this.getFeatureFlags().then(flags => flags.TESTNET_ONLY);
  }
}

export const configService = new ConfigService();
export type { FeatureFlags, AppConfig };
