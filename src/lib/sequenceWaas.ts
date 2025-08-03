import { SequenceWaaS } from '@0xsequence/waas'

export const sequenceWaas = new SequenceWaaS({
  projectAccessKey: 'AQAAAAAAAGnT6xW89IPGbUhQ0d3a1d8BKXU',
  waasConfigKey: 'eyJwcm9qZWN0SWQiOjE4MzQ5LCJlbWFpbFJlZ2lvbiI6InVzLWVhc3QtMSIsImVtYWlsQ2xpZW50S2V5IjoiOGZlNDczYjYtYmNlNy00OWExLWI1OTktM2Q1MDIyNGJkNmZhIn0=',
  network: 'polygon'
})

// Helper function to get current wallet
export const getCurrentWallet = async () => {
  try {
    // Try to get the wallet address from the current session
    const sessionId = sequenceWaas.getSessionId()
    if (!sessionId) {
      return null
    }
    
    // Get wallet details
    const walletAddress = await sequenceWaas.getAddress()
    return { address: walletAddress }
  } catch (error) {
    console.error('Error getting wallet:', error)
    return null
  }
}