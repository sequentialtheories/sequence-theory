import { createConfig } from "@0xsequence/connect";

export const sequenceWebConfig = createConfig("waas", {
  projectAccessKey: "AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE",
  chainIds: [80002], // Amoy testnet
  defaultChainId: 80002,
  appName: "Vault Club",
  waasConfigKey: "eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=",
  defaultTheme: 'dark',
  position: 'center',
  signIn: {
    projectName: "Vault Club",
    logoUrl: undefined, // Can be added later
  },
  email: true, // Enable email-based auth for embedded wallets
  enableConfirmationModal: false, // Skip confirmation for smoother UX
  // Disable external wallet options - only use embedded WaaS wallets
  walletConnect: false,
});