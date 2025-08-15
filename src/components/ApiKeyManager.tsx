import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Copy, Plus, Trash2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  permissions: { read_wallet?: boolean };
}

export const ApiKeyManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  // Fetch API keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ApiKey[];
    },
    enabled: !!user,
  });

  // Create API key mutation
  const createKeyMutation = useMutation({
    mutationFn: async (name: string) => {
      // Generate the API key
      const { data: keyData, error: keyError } = await supabase.rpc('generate_api_key');
      if (keyError) throw keyError;
      
      const apiKey = keyData as string;
      const keyPrefix = apiKey.substring(0, 12) + '...';
      
      // Hash the key for storage
      const { data: hashData, error: hashError } = await supabase.rpc('hash_api_key', { api_key: apiKey });
      if (hashError) throw hashError;
      
      // Store the API key
      const { error: insertError } = await supabase
        .from('api_keys')
        .insert({
          user_id: user?.id,
          name,
          key_hash: hashData,
          key_prefix: keyPrefix,
          permissions: { read_wallet: true }
        });
      
      if (insertError) throw insertError;
      
      return apiKey;
    },
    onSuccess: (apiKey) => {
      setGeneratedKey(apiKey);
      setNewKeyName('');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Key Created",
        description: "Your API key has been generated successfully. Make sure to copy it as you won't see it again.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create API key: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Delete API key mutation
  const deleteKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Key Deleted",
        description: "The API key has been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete API key: " + error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Please log in to manage your API keys.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Key Management</h2>
          <p className="text-muted-foreground">
            Generate API keys for external access to your wallet data
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            
            {generatedKey ? (
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Save this API key now. You won't be able to see it again.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label>Your new API key:</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showKey ? "text" : "password"}
                      value={generatedKey}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(generatedKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    setGeneratedKey(null);
                    setShowCreateDialog(false);
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">API Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Devin AI Integration"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Read Wallet Data</Badge>
                      <span className="text-sm text-muted-foreground">
                        Access wallet address and email
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => createKeyMutation.mutate(newKeyName)}
                    disabled={!newKeyName.trim() || createKeyMutation.isPending}
                  >
                    Create Key
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {isLoading ? (
        <div className="text-center py-8">Loading API keys...</div>
      ) : apiKeys && apiKeys.length > 0 ? (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{key.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={key.is_active ? "default" : "secondary"}>
                      {key.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteKeyMutation.mutate(key.id)}
                      disabled={deleteKeyMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">Key Prefix</Label>
                    <p className="font-mono">{key.key_prefix}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Created</Label>
                    <p>{formatDate(key.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Last Used</Label>
                    <p>{key.last_used_at ? formatDate(key.last_used_at) : 'Never'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Expires</Label>
                    <p>{key.expires_at ? formatDate(key.expires_at) : 'Never'}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Permissions</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {key.permissions.read_wallet && (
                      <Badge variant="outline" className="text-xs">Read Wallet Data</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No API Keys</h3>
            <p className="text-muted-foreground mb-4">
              Create your first API key to enable external access to your wallet data.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>API Endpoint:</strong> Use your API key with the header `x-api-key` to access 
          <code className="mx-1 px-1 bg-muted rounded">GET /external-api/user-wallets</code>
          at <code className="mx-1 px-1 bg-muted rounded">${VITE_SUPABASE_URL}/functions/v1/external-api/user-wallets</code>
        </AlertDescription>
      </Alert>
    </div>
  );
};
