import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContracts, type Contract, type UserContract } from '@/hooks/useContracts';
import { Coins, Users, Target, Calendar, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DepositDialog } from '@/components/DepositDialog';
import { CFG } from '@/lib/config';

const ContractCard: React.FC<{ contract: Contract; onJoin?: (id: string) => void }> = ({ 
  contract, 
  onJoin 
}) => {
  const progressPercentage = (contract.current_amount / contract.target_amount) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{contract.name}</CardTitle>
            <CardDescription className="mt-1">
              {contract.description}
            </CardDescription>
          </div>
          <Badge variant={contract.status === 'pending' ? 'default' : 'secondary'}>
            {contract.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>${contract.target_amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              <span>${contract.current_amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{contract.current_participants}/{contract.maximum_participants}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Min: ${contract.minimum_contribution}</span>
            </div>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          
          {onJoin && contract.status === 'pending' && (
            <Button 
              onClick={() => onJoin(contract.id)}
              className="w-full"
              disabled={contract.current_participants >= contract.maximum_participants}
            >
              {contract.current_participants >= contract.maximum_participants ? 'Full' : 'Join Contract'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const UserContractCard: React.FC<{ contract: UserContract }> = ({ contract }) => {
  const progressPercentage = (contract.current_amount / contract.target_amount) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{contract.contract_name}</CardTitle>
            <div className="flex gap-2 mt-2">
              {contract.is_creator && (
                <Badge variant="outline">Creator</Badge>
              )}
              {contract.is_participant && (
                <Badge variant="outline">Participant</Badge>
              )}
            </div>
          </div>
          <Badge variant={contract.status === 'pending' ? 'default' : 'secondary'}>
            {contract.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>${contract.target_amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              <span>${contract.current_amount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CreateContractDialog: React.FC<{ onContractCreated: () => void }> = ({ onContractCreated }) => {
  const { createContract } = useContracts();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    minimum_contribution: '',
    maximum_participants: '',
    start_date: '',
    end_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const contractData = {
      name: formData.name,
      description: formData.description || undefined,
      target_amount: parseFloat(formData.target_amount),
      minimum_contribution: parseFloat(formData.minimum_contribution),
      maximum_participants: parseInt(formData.maximum_participants),
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    };

    const result = await createContract(contractData);
    if (result) {
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        target_amount: '',
        minimum_contribution: '',
        maximum_participants: '',
        start_date: '',
        end_date: '',
      });
      onContractCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
          <DialogDescription>
            Create a new investment contract for your community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Contract Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_amount">Target Amount ($)</Label>
              <Input
                id="target_amount"
                type="number"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                required
                min="1"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="minimum_contribution">Min Contribution ($)</Label>
              <Input
                id="minimum_contribution"
                type="number"
                value={formData.minimum_contribution}
                onChange={(e) => setFormData({ ...formData, minimum_contribution: e.target.value })}
                required
                min="1"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="maximum_participants">Maximum Participants</Label>
            <Input
              id="maximum_participants"
              type="number"
              value={formData.maximum_participants}
              onChange={(e) => setFormData({ ...formData, maximum_participants: e.target.value })}
              required
              min="2"
              max="100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date (Optional)</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Contract</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ContractDashboard: React.FC = () => {
  const { contracts, userContracts, loading, joinContract, fetchContracts, fetchUserContracts } = useContracts();
  const [joiningContract, setJoiningContract] = useState<string | null>(null);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const handleJoinContract = async (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    if (CFG.SIMULATION_MODE) {
      setJoiningContract(contractId);
      
      const contributionAmount = prompt(
        `Enter your contribution amount (minimum $${contract.minimum_contribution}):`
      );
      
      if (contributionAmount) {
        const amount = parseFloat(contributionAmount);
        if (amount >= contract.minimum_contribution) {
          await joinContract(contractId, amount);
        } else {
          toast({
            title: "Invalid Amount",
            description: `Minimum contribution is $${contract.minimum_contribution}`,
            variant: "destructive",
          });
        }
      }
      
      setJoiningContract(null);
    } else {
      setSelectedContract(contract);
      setDepositDialogOpen(true);
    }
  };

  const handleDepositSuccess = async () => {
    if (selectedContract) {
      await joinContract(selectedContract.id, 0); // Amount handled by blockchain
      fetchContracts();
      fetchUserContracts();
    }
    setDepositDialogOpen(false);
    setSelectedContract(null);
  };

  const handleContractCreated = () => {
    fetchContracts();
    fetchUserContracts();
  };

  if (loading) {
    return <div className="text-center py-8">Loading contracts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investment Contracts</h2>
        <CreateContractDialog onContractCreated={handleContractCreated} />
      </div>
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available Contracts</TabsTrigger>
          <TabsTrigger value="my-contracts">My Contracts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4">
          {contracts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No available contracts at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  onJoin={handleJoinContract}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-contracts" className="space-y-4">
          {userContracts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You haven't created or joined any contracts yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userContracts.map((contract) => (
                <UserContractCard
                  key={contract.contract_id}
                  contract={contract}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Deposit Dialog */}
      {selectedContract && (
        <DepositDialog
          open={depositDialogOpen}
          onOpenChange={setDepositDialogOpen}
          contractId={selectedContract.id}
          minimumContribution={selectedContract.minimum_contribution}
          onSuccess={handleDepositSuccess}
        />
      )}
    </div>
  );
};
