import React, { useState } from 'react';
import { CFG, setConfig } from '@/lib/config';


export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [simulationMode, setSimulationMode] = useState(CFG.SIMULATION_MODE);
  const [disableMetamask, setDisableMetamask] = useState(CFG.DISABLE_METAMASK);
  const [walletProvider, setWalletProvider] = useState(CFG.WALLET_PROVIDER);

  const handleSimulationModeChange = (checked: boolean) => {
    setSimulationMode(checked);
    setConfig('SIMULATION_MODE', checked);
    window.location.reload();
  };

  const handleDisableMetamaskChange = (checked: boolean) => {
    setDisableMetamask(checked);
    setConfig('DISABLE_METAMASK', checked);
    window.location.reload();
  };

  const handleWalletProviderChange = (value: 'sequence' | 'metamask') => {
    setWalletProvider(value);
    setConfig('WALLET_PROVIDER', value);
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        title="Debug Panel"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Debug Panel</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="simulation-mode"
            checked={simulationMode}
            onChange={(e) => handleSimulationModeChange(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="simulation-mode" className="text-sm">
            Simulation Mode
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="disable-metamask"
            checked={disableMetamask}
            onChange={(e) => handleDisableMetamaskChange(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="disable-metamask" className="text-sm">
            Disable MetaMask
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Wallet Provider</label>
          <select 
            value={walletProvider} 
            onChange={(e) => handleWalletProviderChange(e.target.value as 'sequence' | 'metamask')}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="sequence">Sequence</option>
            <option value="metamask">MetaMask</option>
          </select>
        </div>

        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
          <div>Chain ID: {CFG.CHAIN_ID}</div>
          <div>Simulation: {CFG.SIMULATION_MODE ? 'ON' : 'OFF'}</div>
          <div>Provider: {CFG.WALLET_PROVIDER}</div>
        </div>
      </div>
    </div>
  );
}
