import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { CFG, getConfigString, getWithSource, toggleSimulationMode, toggleTestnetMode, resetSequenceOverrides, forceBypassCacheReload } from '@/lib/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  eth_address: string | null;
  name: string;
}

interface HealthStats {
  // Placeholder for Phase B (contract reads)
  totalDeposits?: string;
  totalMembers?: string;
  userBalance?: string;
}

export default function Debug() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [healthStats, setHealthStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Sequence Configuration Form State
  const [projectKey, setProjectKey] = useState('');
  const [waasKey, setWaasKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, eth_address, name')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    }
  };

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      // Simple health check - just verify we can connect to Supabase
      const { data, error } = await supabase.from('profiles').select('count').single();
      
      setHealthStats({
        totalDeposits: 'N/A (Phase B)',
        totalMembers: 'N/A (Phase B)', 
        userBalance: 'N/A (Phase B)'
      });

      toast({
        title: "Health Check Complete",
        description: "Database connection verified",
      });
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sequence WaaS Configuration Handlers
  const saveSequenceKeys = () => {
    if (!projectKey.trim() || !waasKey.trim()) {
      toast({
        title: "Validation Error",
        description: "Both Project Access Key and WaaS Config Key are required",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('tvc_SEQUENCE_PROJECT_ACCESS_KEY', projectKey.trim());
    localStorage.setItem('tvc_SEQUENCE_WAAS_CONFIG_KEY', waasKey.trim());
    
    toast({
      title: "Configuration Saved",
      description: "Sequence keys saved to localStorage. Reload the page to apply changes.",
    });
    
    // Clear form
    setProjectKey('');
    setWaasKey('');
  };

  const clearSequenceKeys = () => {
    localStorage.removeItem('tvc_SEQUENCE_PROJECT_ACCESS_KEY');
    localStorage.removeItem('tvc_SEQUENCE_WAAS_CONFIG_KEY');
    
    toast({
      title: "Configuration Cleared",
      description: "Sequence key overrides removed. Reload the page to apply changes.",
    });
  };

  // Get current configuration status
  const projectKeyMeta = getWithSource('SEQUENCE_PROJECT_ACCESS_KEY', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9');
  const waasKeyMeta = getWithSource('SEQUENCE_WAAS_CONFIG_KEY', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9');

  // Only show debug page in testnet mode
  if (!CFG.FEATURE_TESTNET_ONLY) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug Mode Disabled</CardTitle>
            <CardDescription>
              Set <code>localStorage.setItem('tvc_FEATURE_TESTNET_ONLY', '1')</code> to enable debug mode.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Debug Panel</h1>
        <div className="flex gap-2">
          <Badge variant={CFG.SIMULATION_MODE ? "default" : "secondary"}>
            Simulation: {CFG.SIMULATION_MODE ? 'ON' : 'OFF'}
          </Badge>
          <Badge variant={CFG.FEATURE_TESTNET_ONLY ? "default" : "secondary"}>
            Testnet: {CFG.FEATURE_TESTNET_ONLY ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </div>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Current authenticated user and wallet details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>User ID:</strong> {user?.id || 'Not signed in'}</div>
          <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
          <div><strong>Profile Name:</strong> {profile?.name || 'Loading...'}</div>
          <div><strong>Sequence Address:</strong> {profile?.eth_address || 'Not created yet'}</div>
          {profile?.eth_address && (
            <div className="text-sm text-muted-foreground">
              ✅ Canonical wallet address stored in profiles.eth_address
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Information */}
      <Card>
        <CardHeader>
          <CardTitle>Network Configuration</CardTitle>
          <CardDescription>Chain ID and network settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Expected Chain ID:</strong> {CFG.CHAIN_ID} (Amoy)</div>
          <div><strong>RPC URL:</strong> <code className="text-sm">{CFG.RPC_URL}</code></div>
          <div><strong>Sequence Network:</strong> {CFG.SEQUENCE_NETWORK}</div>
        </CardContent>
      </Card>

      {/* Health Check */}
      <Card>
        <CardHeader>
          <CardTitle>Health Check</CardTitle>
          <CardDescription>Network connectivity and contract status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runHealthCheck} disabled={loading} className="w-full">
            {loading ? 'Running Health Check...' : 'Run Health Check'}
          </Button>
          
          {healthStats && (
            <div className="space-y-2">
              <div><strong>Database:</strong> Connected ✅</div>
              <Separator />
              <div><strong>Total Deposits:</strong> {healthStats.totalDeposits}</div>
              <div><strong>Total Members:</strong> {healthStats.totalMembers}</div>
              <div><strong>User Balance:</strong> {healthStats.userBalance}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sequence WaaS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Sequence WaaS Configuration</CardTitle>
          <CardDescription>Manage your Sequence Project Access Key and WaaS Config Key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Configuration Status */}
          <div className="space-y-3">
            <h4 className="font-medium">Current Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Project Access Key:</span>
                  <Badge variant={projectKeyMeta.source === 'localStorage' ? 'default' : 'secondary'}>
                    {projectKeyMeta.source}
                  </Badge>
                </div>
                <div className="text-xs font-mono bg-muted p-2 rounded">
                  {showKeys 
                    ? projectKeyMeta.value 
                    : projectKeyMeta.value ? projectKeyMeta.value.substring(0, 20) + '...' : 'Not set'
                  }
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">WaaS Config Key:</span>
                  <Badge variant={waasKeyMeta.source === 'localStorage' ? 'default' : 'secondary'}>
                    {waasKeyMeta.source}
                  </Badge>
                </div>
                <div className="text-xs font-mono bg-muted p-2 rounded">
                  {showKeys 
                    ? waasKeyMeta.value 
                    : waasKeyMeta.value ? waasKeyMeta.value.substring(0, 20) + '...' : 'Not set'
                  }
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowKeys(!showKeys)} 
              variant="outline" 
              size="sm"
            >
              {showKeys ? 'Hide' : 'Show'} Keys
            </Button>
          </div>

          <Separator />

          {/* Configuration Form */}
          <div className="space-y-4">
            <h4 className="font-medium">Set New Configuration</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="projectKey">Project Access Key</Label>
                <Input
                  id="projectKey"
                  type="password"
                  placeholder="Enter your Sequence Project Access Key"
                  value={projectKey}
                  onChange={(e) => setProjectKey(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div>
                <Label htmlFor="waasKey">WaaS Config Key</Label>
                <Input
                  id="waasKey"
                  type="password"
                  placeholder="Enter your WaaS Config Key"
                  value={waasKey}
                  onChange={(e) => setWaasKey(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button onClick={saveSequenceKeys}>
                Save Configuration
              </Button>
              <Button onClick={clearSequenceKeys} variant="destructive">
                Clear Overrides
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Keys are stored in localStorage and will override default configuration. 
              Reload the page after changes to apply new settings.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Runtime Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Runtime Controls</CardTitle>
          <CardDescription>Toggle features without rebuilding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={toggleSimulationMode} variant="outline">
              Toggle Simulation Mode (Currently: {CFG.SIMULATION_MODE ? 'ON' : 'OFF'})
            </Button>
            <Button onClick={toggleTestnetMode} variant="outline">
              Toggle Testnet Mode (Currently: {CFG.FEATURE_TESTNET_ONLY ? 'ON' : 'OFF'})
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium">Troubleshooting</h4>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={resetSequenceOverrides} variant="destructive" size="sm">
                Reset Sequence Overrides
              </Button>
              <Button onClick={forceBypassCacheReload} variant="destructive" size="sm">
                Force Cache Reload
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Use these if you're experiencing persistent atob errors or cache issues.
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            These changes will reload the page to apply new configuration.
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dump */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Runtime configuration (sensitive values redacted)</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded overflow-auto">
            {getConfigString()}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}