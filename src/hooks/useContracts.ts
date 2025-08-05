import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface Contract {
  id: string;
  user_id: string;
  contract_type: string;
  name: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  minimum_contribution: number;
  maximum_participants: number;
  current_participants: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractParticipant {
  id: string;
  contract_id: string;
  user_id: string;
  contribution_amount: number;
  wallet_address: string | null;
  joined_at: string;
  status: 'active' | 'withdrawn' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface UserContract {
  contract_id: string;
  contract_name: string;
  contract_type: string;
  target_amount: number;
  current_amount: number;
  status: string;
  is_creator: boolean;
  is_participant: boolean;
  created_at: string;
}

export const useContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [userContracts, setUserContracts] = useState<UserContract[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all available contracts
  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts((data || []) as Contract[]);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: "Error",
        description: "Failed to load contracts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's contracts (created or participated)
  const fetchUserContracts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_contracts');

      if (error) throw error;
      setUserContracts(data || []);
    } catch (error) {
      console.error('Error fetching user contracts:', error);
      toast({
        title: "Error",
        description: "Failed to load your contracts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new contract
  const createContract = async (contractData: {
    name: string;
    description?: string;
    target_amount: number;
    minimum_contribution: number;
    maximum_participants: number;
    start_date?: string;
    end_date?: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a contract",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          user_id: user.id,
          contract_type: 'vault_club',
          ...contractData,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract created successfully",
      });

      await fetchUserContracts();
      return data;
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive",
      });
      return null;
    }
  };

  // Join a contract
  const joinContract = async (
    contractId: string,
    contributionAmount: number,
    walletAddress?: string
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join a contract",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('join_contract', {
        p_contract_id: contractId,
        p_contribution_amount: contributionAmount,
        p_wallet_address: walletAddress,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully joined the contract",
      });

      await fetchUserContracts();
      await fetchContracts();
      return true;
    } catch (error) {
      console.error('Error joining contract:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join contract",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get contract participants
  const getContractParticipants = async (contractId: string) => {
    try {
      const { data, error } = await supabase
        .from('contract_participants')
        .select(`
          *,
          profiles!inner(name, email)
        `)
        .eq('contract_id', contractId)
        .eq('status', 'active');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contract participants:', error);
      return [];
    }
  };

  // Update contract status
  const updateContractStatus = async (
    contractId: string,
    status: Contract['status']
  ) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', contractId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Contract ${status} successfully`,
      });

      await fetchUserContracts();
      return true;
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast({
        title: "Error",
        description: "Failed to update contract status",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchContracts();
    if (user) {
      fetchUserContracts();
    }
  }, [user]);

  return {
    contracts,
    userContracts,
    loading,
    createContract,
    joinContract,
    getContractParticipants,
    updateContractStatus,
    fetchContracts,
    fetchUserContracts,
  };
};