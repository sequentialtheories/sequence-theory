import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { getNetworkInfo, checkRpcLatency } from '@/lib/sequence';
import { CFG, getConfigString, toggleSimulationMode, toggleTestnetMode } from '@/lib/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  eth_address: string | null;
  name: string;
}

interface HealthStats {
  networkInfo: any;
  rpcLatency: number;
  rpcError: string | null;
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
      const [networkInfo, latencyResult] = await Promise.all([
        getNetworkInfo(),
        checkRpcLatency()
      ]);

      setHealthStats({
        networkInfo,
        rpcLatency: latencyResult.latency,
        rpcError: latencyResult.error,
        // Phase B: will add contract reads here
        totalDeposits: 'N/A (Phase B)',
        totalMembers: 'N/A (Phase B)', 
        userBalance: 'N/A (Phase B)'
      });

      toast({
        title: "Health Check Complete",
        description: `RPC latency: ${latencyResult.latency}ms`,
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
          {healthStats?.networkInfo && (
            <>
              <Separator />
              <div><strong>Signer Chain ID:</strong> {healthStats.networkInfo.signerChainId}</div>
              <div><strong>Provider Chain ID:</strong> {healthStats.networkInfo.providerChainId}</div>
              {healthStats.networkInfo.error && (
                <div className="text-destructive text-sm">Error: {healthStats.networkInfo.error}</div>
              )}
            </>
          )}
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
              <div><strong>RPC Latency:</strong> {healthStats.rpcLatency}ms</div>
              {healthStats.rpcError && (
                <div className="text-destructive text-sm">RPC Error: {healthStats.rpcError}</div>
              )}
              <Separator />
              <div><strong>Total Deposits:</strong> {healthStats.totalDeposits}</div>
              <div><strong>Total Members:</strong> {healthStats.totalMembers}</div>
              <div><strong>User Balance:</strong> {healthStats.userBalance}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Runtime Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Runtime Controls</CardTitle>
          <CardDescription>Toggle features without rebuilding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={toggleSimulationMode} variant="outline">
              Toggle Simulation Mode (Currently: {CFG.SIMULATION_MODE ? 'ON' : 'OFF'})
            </Button>
            <Button onClick={toggleTestnetMode} variant="outline">
              Toggle Testnet Mode (Currently: {CFG.FEATURE_TESTNET_ONLY ? 'ON' : 'OFF'})
            </Button>
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