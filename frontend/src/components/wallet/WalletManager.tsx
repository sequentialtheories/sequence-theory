/**
 * WALLET MANAGER COMPONENT
 * 
 * Allows users to view and manage their non-custodial wallet.
 * Users can:
 * - View their wallet address
 * - Export their seed phrase (with password)
 * - Export their private key (with password)
 * - Delete their wallet (with warnings)
 */

import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Wallet, 
  Copy, 
  Key, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Eye,
  EyeOff,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const WalletManager: React.FC = () => {
  const { state, exportSeedPhrase, exportPrivateKey, deleteWallet } = useWallet();
  
  const [showSeedDialog, setShowSeedDialog] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [revealedData, setRevealedData] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showData, setShowData] = useState(false);

  const handleExportSeed = async () => {
    setError('');
    const result = await exportSeedPhrase(password);
    if (result.success && result.mnemonic) {
      setRevealedData(result.mnemonic);
    } else {
      setError(result.error || 'Failed to decrypt');
    }
  };

  const handleExportKey = async () => {
    setError('');
    const result = await exportPrivateKey(password);
    if (result.success && result.privateKey) {
      setRevealedData(result.privateKey);
    } else {
      setError(result.error || 'Failed to decrypt');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const resetDialog = () => {
    setPassword('');
    setRevealedData('');
    setError('');
    setShowData(false);
  };

  const handleDeleteWallet = () => {
    deleteWallet();
    setShowDeleteDialog(false);
    setConfirmDelete(false);
  };

  if (!state.hasWallet) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle>Your Wallet</CardTitle>
        </div>
        <CardDescription>
          Non-custodial wallet - only you have access
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Wallet Address */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Wallet Address</Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
              {state.address}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(state.address || '')}
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(`https://polygonscan.com/address/${state.address}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Non-Custodial Wallet</AlertTitle>
          <AlertDescription>
            Sequence Theory has no access to your private keys. Only you can control this wallet.
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Export Seed Phrase */}
          <Dialog open={showSeedDialog} onOpenChange={(open) => { setShowSeedDialog(open); if (!open) resetDialog(); }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                View Seed Phrase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Seed Phrase</DialogTitle>
                <DialogDescription>
                  Enter your password to reveal your 12-word seed phrase.
                </DialogDescription>
              </DialogHeader>
              
              {!revealedData ? (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Never share your seed phrase with anyone. Anyone with this phrase can access your funds.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your wallet password"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm relative">
                    {showData ? (
                      <div className="grid grid-cols-3 gap-2">
                        {revealedData.split(' ').map((word, index) => (
                          <div key={index} className="flex gap-2">
                            <span className="text-muted-foreground w-5">{index + 1}.</span>
                            <span>{word}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-20 flex items-center justify-center text-muted-foreground">
                        Click "Show" to reveal
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowData(!showData)} className="flex-1">
                      {showData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showData ? 'Hide' : 'Show'}
                    </Button>
                    <Button variant="outline" onClick={() => copyToClipboard(revealedData)} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                {!revealedData && (
                  <Button onClick={handleExportSeed}>Reveal Seed Phrase</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Export Private Key */}
          <Dialog open={showKeyDialog} onOpenChange={(open) => { setShowKeyDialog(open); if (!open) resetDialog(); }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                View Private Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Private Key</DialogTitle>
                <DialogDescription>
                  Enter your password to reveal your private key.
                </DialogDescription>
              </DialogHeader>
              
              {!revealedData ? (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Never share your private key. Anyone with this key has full control of your wallet.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your wallet password"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg font-mono text-xs relative break-all">
                    {showData ? revealedData : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowData(!showData)} className="flex-1">
                      {showData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showData ? 'Hide' : 'Show'}
                    </Button>
                    <Button variant="outline" onClick={() => copyToClipboard(revealedData)} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                {!revealedData && (
                  <Button onClick={handleExportKey}>Reveal Private Key</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Delete Wallet */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Wallet from Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Wallet</DialogTitle>
              <DialogDescription>
                This will remove your wallet from this device.
              </DialogDescription>
            </DialogHeader>
            
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                If you haven't backed up your seed phrase, you will permanently lose access to this wallet and any funds in it.
                Sequence Theory cannot help you recover it.
              </AlertDescription>
            </Alert>

            <div className="flex items-start gap-3 p-4 border border-destructive rounded-lg">
              <Checkbox
                id="confirm-delete"
                checked={confirmDelete}
                onCheckedChange={(checked) => setConfirmDelete(checked === true)}
              />
              <Label htmlFor="confirm-delete" className="text-sm cursor-pointer">
                I understand this action is irreversible and I have backed up my seed phrase.
              </Label>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteWallet} disabled={!confirmDelete}>
                Delete Wallet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
