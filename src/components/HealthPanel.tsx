import React, { useState } from 'react';
import { healthCheck } from '@/lib/contracts';
import { CFG } from '@/lib/config';

interface HealthCheckResult {
  success: boolean;
  data?: {
    totalDeposits: string;
    totalMembers: string;
    contractAddress: string;
    chainId: number;
    rpcLatency: number;
  };
  error?: string;
}

export function HealthPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HealthCheckResult | null>(null);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const checkResult = await healthCheck();
      setResult(checkResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 p-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
        title="Health Check"
      >
        🏥
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-96 bg-white border border-gray-300 rounded-lg shadow-lg">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Contract Health Check</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="text-xs text-gray-600 space-y-1">
          <div>Chain ID: {CFG.CHAIN_ID}</div>
          <div>Vault: {CFG.VAULT_ADDRESS || 'Not configured'}</div>
          <div>RPC: {CFG.RPC_URL || 'Not configured'}</div>
          <div>Mode: {CFG.SIMULATION_MODE ? 'Simulation' : 'Live'}</div>
        </div>

        <button
          onClick={runHealthCheck}
          disabled={isLoading || !CFG.VAULT_ADDRESS || !CFG.RPC_URL}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Running...' : 'Run Health Check'}
        </button>

        {result && (
          <div className="mt-4 p-3 rounded-md text-xs">
            {result.success ? (
              <div className="bg-green-50 border border-green-200">
                <div className="font-medium text-green-800 mb-2">✅ Health Check Passed</div>
                <div className="space-y-1 text-green-700">
                  <div>Total Deposits: {result.data?.totalDeposits}</div>
                  <div>Total Members: {result.data?.totalMembers}</div>
                  <div>RPC Latency: {result.data?.rpcLatency}ms</div>
                  <div>Contract: {result.data?.contractAddress?.slice(0, 10)}...</div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200">
                <div className="font-medium text-red-800 mb-2">❌ Health Check Failed</div>
                <div className="text-red-700">{result.error}</div>
              </div>
            )}
          </div>
        )}

        {!CFG.VAULT_ADDRESS && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ VAULT_ADDRESS not configured
          </div>
        )}
      </div>
    </div>
  );
}
