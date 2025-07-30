import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Loader2, Zap } from 'lucide-react'

export const MassWalletCreator = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const createWalletsForAllUsers = async () => {
    setIsCreating(true)
    setResult(null)
    
    try {
      console.log('🚀 Starting mass wallet creation...')
      
      const { data, error } = await supabase.functions.invoke('ensure-all-users-have-wallets', {
        body: {}
      })
      
      if (error) {
        console.error('❌ Error in mass wallet creation:', error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
        return
      }
      
      console.log('✅ Mass wallet creation result:', data)
      setResult(data)
      
      toast({
        title: "Success!",
        description: `Created ${data.walletsCreated} wallets successfully!`,
        variant: "default"
      })
      
    } catch (error) {
      console.error('💥 Exception in mass wallet creation:', error)
      toast({
        title: "Error",
        description: "Failed to create wallets",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Emergency Wallet Fix
        </CardTitle>
        <CardDescription>
          Create wallets for ALL users who don't have them
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createWalletsForAllUsers}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Wallets...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Fix All Wallets Now
            </>
          )}
        </Button>
        
        {result && (
          <div className="text-sm bg-muted p-3 rounded">
            <div className="font-medium">Results:</div>
            <div>✅ Wallets Created: {result.walletsCreated}</div>
            <div>❌ Errors: {result.errors}</div>
            <div>📊 Total Processed: {result.totalProcessed}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}