/**
 * WALLET SETUP COMPONENT
 * 
 * Guides users through creating or importing a non-custodial wallet.
 * 
 * IMPORTANT DISCLOSURES (shown to user):
 * - Sequence Theory CANNOT access your private keys
 * - Sequence Theory CANNOT move your funds
 * - Only YOU control your wallet
 * - Your seed phrase is your ONLY backup
 */

import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Key, AlertTriangle, Copy, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';

type SetupStep = 'intro' | 'create' | 'backup' | 'import' | 'complete';

export const WalletSetup: React.FC = () => {
  const { createWallet, importWallet, state } = useWallet();
  
  const [step, setStep] = useState<SetupStep>('intro');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [importMnemonic, setImportMnemonic] = useState('');
  const [backedUp, setBackedUp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [understoodDisclosure, setUnderstoodDisclosure] = useState(false);

  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await createWallet(password);
    
    setLoading(false);

    if (result.success && result.mnemonic) {
      setMnemonic(result.mnemonic);
      setStep('backup');
    } else {
      setError(result.error || 'Failed to create wallet');
    }
  };

  const handleImportWallet = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await importWallet(importMnemonic, password);
    
    setLoading(false);

    if (result.success) {
      setStep('complete');
    } else {
      setError(result.error || 'Failed to import wallet');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleBackupComplete = () => {
    if (!backedUp) {
      setError('Please confirm you have backed up your seed phrase');
      return;
    }
    setStep('complete');
  };

  if (state.hasWallet) {
    return null; // Wallet already exists
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle>Secure Wallet Setup</CardTitle>
        </div>
        <CardDescription>
          Create your non-custodial wallet. You have full control.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Step: Introduction & Disclosure */}
        {step === 'intro' && (
          <div className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Your Wallet, Your Control</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>Before you begin, please understand:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Sequence Theory cannot access your private keys</strong></li>
                  <li><strong>Sequence Theory cannot move your funds</strong></li>
                  <li><strong>Only you control your wallet</strong></li>
                  <li><strong>Your seed phrase is your only backup</strong></li>
                  <li>If you lose your seed phrase, your wallet cannot be recovered</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox
                id="disclosure"
                checked={understoodDisclosure}
                onCheckedChange={(checked) => setUnderstoodDisclosure(checked === true)}
              />
              <Label htmlFor="disclosure" className="text-sm leading-relaxed cursor-pointer">
                I understand that Sequence Theory has no access to my private keys or funds. 
                I am solely responsible for backing up my seed phrase and securing my wallet.
              </Label>
            </div>

            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create New Wallet</TabsTrigger>
                <TabsTrigger value="import">Import Existing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Create a brand new wallet with a secure seed phrase.
                </p>
                <Button 
                  onClick={() => setStep('create')} 
                  className="w-full"
                  disabled={!understoodDisclosure}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Create New Wallet
                </Button>
              </TabsContent>
              
              <TabsContent value="import" className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Import an existing wallet using your 12-word seed phrase.
                </p>
                <Button 
                  onClick={() => setStep('import')} 
                  variant="outline" 
                  className="w-full"
                  disabled={!understoodDisclosure}
                >
                  Import Wallet
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Step: Create Wallet - Set Password */}
        {step === 'create' && (
          <div className="space-y-4">
            <Alert variant="default">
              <Lock className="h-4 w-4" />
              <AlertTitle>Set Your Password</AlertTitle>
              <AlertDescription>
                This password encrypts your wallet on this device. It never leaves your browser.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('intro')}>
                Back
              </Button>
              <Button onClick={handleCreateWallet} disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Wallet'}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Backup Seed Phrase */}
        {step === 'backup' && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>CRITICAL: Backup Your Seed Phrase</AlertTitle>
              <AlertDescription>
                Write down these 12 words in order. This is the ONLY way to recover your wallet.
                Sequence Theory cannot help you if you lose this.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg font-mono text-sm relative">
              <div className="grid grid-cols-3 gap-2">
                {mnemonic.split(' ').map((word, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-muted-foreground w-5">{index + 1}.</span>
                    <span>{word}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-start gap-3 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
              <Checkbox
                id="backed-up"
                checked={backedUp}
                onCheckedChange={(checked) => setBackedUp(checked === true)}
              />
              <Label htmlFor="backed-up" className="text-sm leading-relaxed cursor-pointer">
                I have written down my seed phrase and stored it in a safe place. 
                I understand that if I lose it, my wallet cannot be recovered by anyone.
              </Label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleBackupComplete} className="w-full">
              I've Backed Up My Seed Phrase
            </Button>
          </div>
        )}

        {/* Step: Import Wallet */}
        {step === 'import' && (
          <div className="space-y-4">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertTitle>Import Your Wallet</AlertTitle>
              <AlertDescription>
                Enter your 12-word seed phrase to restore your wallet.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="mnemonic">Seed Phrase</Label>
              <textarea
                id="mnemonic"
                className="w-full h-24 p-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                value={importMnemonic}
                onChange={(e) => setImportMnemonic(e.target.value.toLowerCase())}
                placeholder="Enter your 12 words separated by spaces"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-password">Set Password</Label>
              <Input
                id="import-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('intro')}>
                Back
              </Button>
              <Button onClick={handleImportWallet} disabled={loading} className="flex-1">
                {loading ? 'Importing...' : 'Import Wallet'}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">Wallet Created Successfully!</h3>
            <p className="text-muted-foreground">
              Your wallet address: <code className="text-xs">{state.address}</code>
            </p>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Remember: Only you have access to your wallet. Keep your seed phrase safe!
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
