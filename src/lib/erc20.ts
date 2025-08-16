import { Contract, parseUnits, formatUnits } from 'ethers';
import { getReadProvider, getSignerProvider } from './chain';
import { CFG } from './config';

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

export function getErc20(): Contract {
  const address = CFG.STABLE_TOKEN_ADDRESS;
  if (!address) {
    throw new Error('STABLE_TOKEN_ADDRESS configuration is required');
  }
  return new Contract(address, ERC20_ABI, getReadProvider());
}

export function getErc20WithSigner(): Contract | null {
  const signer = getSignerProvider();
  if (!signer) return null;
  
  const address = CFG.STABLE_TOKEN_ADDRESS;
  if (!address) {
    throw new Error('STABLE_TOKEN_ADDRESS configuration is required');
  }
  return new Contract(address, ERC20_ABI, signer);
}

export function toUnits(amount: string): bigint {
  const decimals = CFG.STABLE_TOKEN_DECIMALS;
  return parseUnits(amount, decimals);
}

export function fromUnits(units: bigint): string {
  const decimals = CFG.STABLE_TOKEN_DECIMALS;
  return formatUnits(units, decimals);
}

export async function getTokenBalance(userAddress: string): Promise<string> {
  const token = getErc20();
  const balance = await token.balanceOf(userAddress);
  return fromUnits(balance);
}

export async function getAllowance(userAddress: string, spenderAddress: string): Promise<string> {
  const token = getErc20();
  const allowance = await token.allowance(userAddress, spenderAddress);
  return fromUnits(allowance);
}

export async function approveToken(spenderAddress: string, amount: string): Promise<string> {
  const token = getErc20WithSigner();
  if (!token) {
    throw new Error('Signer not available for token approval');
  }
  
  const amountUnits = toUnits(amount);
  const tx = await token.approve(spenderAddress, amountUnits);
  return tx.hash;
}

export async function getTokenInfo(): Promise<{
  name: string;
  symbol: string;
  decimals: number;
  address: string;
}> {
  const token = getErc20();
  const [name, symbol, decimals] = await Promise.all([
    token.name(),
    token.symbol(),
    token.decimals()
  ]);
  
  return {
    name,
    symbol,
    decimals: Number(decimals),
    address: CFG.STABLE_TOKEN_ADDRESS
  };
}
