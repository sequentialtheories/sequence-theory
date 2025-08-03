import { createConfig } from "@0xsequence/connect";

export const sequenceConfig = createConfig("waas", {
  projectAccessKey: "AQAAAAAAAKg7Q8xQ94GXN9ogCwnDTzn-BkE",
  chainIds: [1], // mainnet
  defaultChainId: 1,
  appName: "Vault Club Academy",
  waasConfigKey: "eyJwcm9qZWN0SWQiOjQzMDY3LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0=",
});