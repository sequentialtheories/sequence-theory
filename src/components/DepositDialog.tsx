import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/components/WalletProvider';
import { CFG } from '@/lib/config';
import { getTokenBalance, getAllowance, approveToken, toUnits } from '@/lib/erc20';
import { getVaultWithSigner } from '@/lib/contracts';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  minimumContribution: number;
  onSuccess?: () => void;
}

export function DepositDialog({ 
  open, 
  onOpenChange, 
  contractId, 
  minimumContribution,
  onSuccess 
}: DepositDialogProps) {
  const { toast } = useToast();
  const { wallet } = useWallet();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'approve' | 'deposit' | 'success'>('input');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [allowance, setAllowance] = useState<string>('0');
  const [txHash, setTxHash] = useState<string>('');

  useEffect(() => {
    if (open && wallet?.address && CFG.VAULT_ADDRESS && CFG.STABLE_TOKEN_ADDRESS) {
      loadTokenData();
    }
  }, [open, wallet?.address, loadTokenData]);

  const loadTokenData = useCallback(async () => {
    if (!wallet?.address) return;
    
    try {
      const [balance, currentAllowance] = await Promise.all([
        getTokenBalance(wallet.address),
        getAllowance(wallet.address, CFG.VAULT_ADDRESS)
      ]);
      setTokenBalance(balance);
      setAllowance(currentAllowance);
    } catch (error) {
      console.error('Failed to load token data:', error);
    }
  }, [wallet?.address]);

  const handleApprove = async () => {
    if (!amount || !wallet?.address) return;
    
    setIsLoading(true);
    setStep('approve');
    
    try {
      const hash = await approveToken(CFG.VAULT_ADDRESS, amount);
      setTxHash(hash);
      
      toast({
        title: "Approval submitted",
        description: `Transaction hash: ${hash.slice(0, 10)}...`,
      });

      setTimeout(async () => {
        await loadTokenData();
        setStep('deposit');
        setIsLoading(false);
      }, 3000);
      
    } catch (error) {
      console.error('Approval failed:', error);
      toast({
        title: "Approval failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
      setStep('input');
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !wallet?.address) return;
    
    setIsLoading(true);
    
    try {
      const vault = getVaultWithSigner();
      if (!vault) {
        throw new Error('Vault contract not available');
      }

      const amountUnits = toUnits(amount);
      const tx = await vault.deposit(amountUnits);
      setTxHash(tx.hash);
      
      toast({
        title: "Deposit submitted",
        description: `Transaction hash: ${tx.hash.slice(0, 10)}...`,
      });

      await tx.wait();
      
      setStep('success');
      toast({
        title: "Deposit successful",
        description: `Successfully deposited ${amount} tokens`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Deposit failed:', error);
      toast({
        title: "Deposit failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const depositAmount = parseFloat(amount);
    
    if (depositAmount < minimumContribution) {
      toast({
        title: "Invalid amount",
        description: `Minimum contribution is $${minimumContribution}`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(tokenBalance) < depositAmount) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${tokenBalance} tokens available`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(allowance) < depositAmount) {
      await handleApprove();
    } else {
      setStep('deposit');
      await handleDeposit();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAmount('');
      setStep('input');
      setTxHash('');
      onOpenChange(false);
    }
  };

  const needsApproval = parseFloat(allowance) < parseFloat(amount || '0');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'input' && 'Make Deposit'}
            {step === 'approve' && 'Approve Token Spending'}
            {step === 'deposit' && 'Confirm Deposit'}
            {step === 'success' && 'Deposit Successful'}
          </DialogTitle>
          <DialogDescription>
            {step === 'input' && `Minimum contribution: $${minimumContribution}`}
            {step === 'approve' && 'Approving the vault contract to spend your tokens...'}
            {step === 'deposit' && 'Depositing tokens into the vault...'}
            {step === 'success' && 'Your deposit has been processed successfully'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'input' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Deposit Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min: ${minimumContribution}`}
                  min={minimumContribution}
                  step="0.01"
                  disabled={isLoading}
                />
                <div className="text-xs text-muted-foreground">
                  Available balance: {tokenBalance} tokens
                </div>
              </div>

              {CFG.SIMULATION_MODE ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-800">Simulation Mode</span>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    This will use database simulation instead of real blockchain transactions
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {needsApproval && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">Approval Required</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        You'll need to approve the vault contract to spend your tokens first
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {(step === 'approve' || step === 'deposit') && (
            <div className="text-center py-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {step === 'approve' ? 'Waiting for approval...' : 'Processing deposit...'}
              </p>
              {txHash && (
                <p className="text-xs text-muted-foreground mt-2">
                  TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Deposited {amount} tokens successfully
              </p>
              {txHash && (
                <p className="text-xs text-muted-foreground mt-2">
                  TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            {step === 'success' ? 'Close' : 'Cancel'}
          </Button>
          {step === 'input' && (
            <Button 
              onClick={handleSubmit}
              disabled={!amount || parseFloat(amount) < minimumContribution || isLoading}
            >
              {needsApproval ? 'Approve & Deposit' : 'Deposit'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
