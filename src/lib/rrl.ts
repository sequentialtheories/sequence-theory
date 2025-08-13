// Risk-Reward Ladder (RRL) Math Helper Functions

export interface PoolBalances {
  p1_usdc: number;
  p2_usdc: number;
  p3_usdc: number;
}

export interface WeeklyProfits {
  p1_profit: number;
  p2_profit: number;
  p3_profit: number;
}

export interface RRLResult {
  p1_net_change: number;
  p2_net_change: number;
  p3_net_change: number;
  routing_details: {
    p1: { reinvest: number; to_p2: number; to_p3: number };
    p2: { reinvest: number; to_p1: number; to_p3: number };
    p3: { reinvest: number; to_p1: number };
  };
}

// APY constants
export const APY_RATES = {
  p1: 0.052,  // 5.2%
  p2: 0.102,  // 10.2%
  p3: 0.125,  // 12.5%
} as const;

// Deposit split constants (60/10/30)
export const DEPOSIT_SPLIT = {
  p1_ratio: 0.6,  // 60%
  p2_ratio: 0.1,  // 10%
  p3_ratio: 0.3,  // 30%
} as const;

/**
 * Calculate weekly profits based on current pool balances and APY rates
 */
export function calculateWeeklyProfits(balances: PoolBalances): WeeklyProfits {
  return {
    p1_profit: balances.p1_usdc * (APY_RATES.p1 / 52),
    p2_profit: balances.p2_usdc * (APY_RATES.p2 / 52),
    p3_profit: balances.p3_usdc * (APY_RATES.p3 / 52),
  };
}

/**
 * Apply Risk-Reward Ladder routing rules:
 * - P1: 50% reinvest, 40%→P2, 10%→P3
 * - P2: 50% reinvest, 20%→P1, 30%→P3
 * - P3: 70% reinvest, 30%→P1
 */
export function applyRRL(profits: WeeklyProfits): RRLResult {
  const { p1_profit, p2_profit, p3_profit } = profits;

  // P1 routing: 50% reinvest, 40%→P2, 10%→P3
  const p1_reinvest = p1_profit * 0.5;
  const p1_to_p2 = p1_profit * 0.4;
  const p1_to_p3 = p1_profit * 0.1;

  // P2 routing: 50% reinvest, 20%→P1, 30%→P3
  const p2_reinvest = p2_profit * 0.5;
  const p2_to_p1 = p2_profit * 0.2;
  const p2_to_p3 = p2_profit * 0.3;

  // P3 routing: 70% reinvest, 30%→P1
  const p3_reinvest = p3_profit * 0.7;
  const p3_to_p1 = p3_profit * 0.3;

  return {
    p1_net_change: p1_reinvest + p2_to_p1 + p3_to_p1,
    p2_net_change: p2_reinvest + p1_to_p2,
    p3_net_change: p3_reinvest + p1_to_p3 + p2_to_p3,
    routing_details: {
      p1: { reinvest: p1_reinvest, to_p2: p1_to_p2, to_p3: p1_to_p3 },
      p2: { reinvest: p2_reinvest, to_p1: p2_to_p1, to_p3: p2_to_p3 },
      p3: { reinvest: p3_reinvest, to_p1: p3_to_p1 },
    }
  };
}

/**
 * Calculate deposit allocation across pools using 60/10/30 split
 */
export function calculateDepositSplit(amount: number) {
  return {
    p1_amount: amount * DEPOSIT_SPLIT.p1_ratio,
    p2_amount: amount * DEPOSIT_SPLIT.p2_ratio,
    p3_amount: amount * DEPOSIT_SPLIT.p3_ratio,
  };
}

/**
 * Validate pool balances are non-negative
 */
export function validateBalances(balances: PoolBalances): boolean {
  return balances.p1_usdc >= 0 && balances.p2_usdc >= 0 && balances.p3_usdc >= 0;
}

/**
 * Calculate total TVL from pool balances
 */
export function calculateTVL(balances: PoolBalances): number {
  return balances.p1_usdc + balances.p2_usdc + balances.p3_usdc;
}