export interface MarketData {
  id: string;
  timestamp: Date;
  price: number;
  volume: number;
  volatility: number;
  rsi: number;
  macd: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export interface VQCParameters {
  layers: number;
  qubits: number;
  learningRate: number;
  iterations: number;
  entanglement: 'linear' | 'circular' | 'full';
}

export interface ClassificationResult {
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  probability: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
  quantumState: string;
  features: {
    technical: number;
    momentum: number;
    volatility: number;
  };
}

export interface TrainingMetrics {
  accuracy: number;
  loss: number;
  epoch: number;
  validationAccuracy: number;
}

export interface RiskMetrics {
  valueAtRisk: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatilityIndex: number;
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface BacktestResult {
  totalReturn: number;
  winRate: number;
  totalTrades: number;
  avgHoldingPeriod: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
}