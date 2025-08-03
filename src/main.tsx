import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SequenceConnect } from "@0xsequence/connect"
import { sequenceConfig } from "./config/sequence"

function Dapp() {
  return (
    <SequenceConnect config={sequenceConfig}>
      <App />
    </SequenceConnect>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Dapp />
  </StrictMode>,
)
