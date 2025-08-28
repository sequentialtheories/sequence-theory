import { createConfig } from "@0xsequence/connect";

export const sequenceWebConfig = createConfig("waas", {
  projectAccessKey: "AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE",
  chainIds: [137], // Polygon mainnet
  defaultChainId: 137,
  appName: "Vault Club",
  waasConfigKey: "eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=",
  defaultTheme: 'dark',
  position: 'center',
  signIn: {
    projectName: "Vault Club",
    logoUrl: undefined,
  },
  email: true,
  enableConfirmationModal: false,
  walletConnect: false,
});