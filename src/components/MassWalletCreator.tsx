import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { createWalletForUser } from '@/lib/sequenceWaas'
import { Loader2, Zap } from 'lucide-react'

export const MassWalletCreator = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const createWalletsForAllUsers = async () => {
    setIsCreating(true)
    setResult(null)
    
    try {
      console.log('🚀 Starting frontend mass wallet creation...')
      
      // Get all users without wallets
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email')
      
      if (profilesError) throw profilesError
      
      const { data: existingWallets, error: walletsError } = await supabase
        .from('user_wallets')
        .select('user_id')
      
      if (walletsError) throw walletsError
      
      const existingUserIds = new Set(existingWallets.map(w => w.user_id))
      const usersNeedingWallets = profiles.filter(p => !existingUserIds.has(p.user_id))
      
      console.log(`Found ${usersNeedingWallets.length} users needing wallets`)
      
      let walletsCreated = 0
      let errors = 0
      
      // Create wallets for users who don't have them
      for (const profile of usersNeedingWallets) {
        try {
          const result = await createWalletForUser(profile.user_id, profile.email)
          if (result.success) {
            walletsCreated++
          } else {
            errors++
            console.error('Failed to create wallet for user:', profile.user_id, result.error)
          }
        } catch (error) {
          errors++
          console.error('Exception creating wallet for user:', profile.user_id, error)
        }
      }
      
      const resultData = {
        walletsCreated,
        errors,
        totalProcessed: usersNeedingWallets.length
      }
      
      console.log('✅ Frontend mass wallet creation result:', resultData)
      setResult(resultData)
      
      toast({
        title: "Success!",
        description: `Created ${walletsCreated} wallets successfully!`,
        variant: "default"
      })
      
    } catch (error) {
      console.error('💥 Exception in frontend mass wallet creation:', error)
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