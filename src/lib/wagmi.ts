import { createConfig, http } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'

export const config = createConfig({
  chains: [polygon, polygonAmoy],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
})

export const sequenceConfig = {
  appName: 'VaultClub Learning Platform',
  projectAccessKey: 'AKfycbzQHBmtE_UbNBNBh8OhYgXQq-4R7AhCFhJrHrL5BV0', // Replace with your actual project access key
  chainId: 137, // Polygon mainnet
  defaultNetwork: 'polygon'
}