import { MarketData } from '../types/market';

export class MarketDataGenerator {
  private static generateTechnicalIndicators(prices: number[], volumes: number[]) {
    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    const bollinger = this.calculateBollingerBands(prices);
    const volatility = this.calculateVolatility(prices);

    return { rsi, macd, bollinger, volatility };
  }

  private static calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    
    return 100 - (100 / (1 + rs));
  }

  private static calculateMACD(prices: number[]): number {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    return ema12 - ema26;
  }

  private static calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < Math.min(prices.length, period * 2); i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private static calculateBollingerBands(prices: number[], period: number = 20) {
    const recentPrices = prices.slice(-period);
    const sma = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / recentPrices.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: sma + (stdDev * 2),
      middle: sma,
      lower: sma - (stdDev * 2)
    };
  }

  private static calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * 100;
  }

  static generateHistoricalData(days: number = 100): MarketData[] {
    const data: MarketData[] = [];
    let basePrice = 100;
    const prices: number[] = [];
    const volumes: number[] = [];

    for (let i = 0; i < days; i++) {
      // Simulate price movement with some trend and noise
      const trend = Math.sin(i / 20) * 0.02;
      const noise = (Math.random() - 0.5) * 0.05;
      const change = trend + noise;
      
      basePrice *= (1 + change);
      const volume = Math.random() * 1000000 + 500000;
      
      prices.push(basePrice);
      volumes.push(volume);

      if (i >= 26) { // Need enough data for technical indicators
        const indicators = this.generateTechnicalIndicators(prices.slice(0, i + 1), volumes.slice(0, i + 1));
        
        data.push({
          id: `data-${i}`,
          timestamp: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
          price: basePrice,
          volume,
          volatility: indicators.volatility,
          rsi: indicators.rsi,
          macd: indicators.macd,
          bollinger: indicators.bollinger
        });
      }
    }

    return data;
  }

  static generateRealTimeData(lastPrice: number): MarketData {
    const change = (Math.random() - 0.5) * 0.02;
    const newPrice = lastPrice * (1 + change);
    const volume = Math.random() * 1000000 + 500000;

    // Simplified indicators for real-time data
    return {
      id: `realtime-${Date.now()}`,
      timestamp: new Date(),
      price: newPrice,
      volume,
      volatility: Math.abs(change) * 100,
      rsi: 30 + Math.random() * 40, // Simplified RSI
      macd: (Math.random() - 0.5) * 10,
      bollinger: {
        upper: newPrice * 1.02,
        middle: newPrice,
        lower: newPrice * 0.98
      }
    };
  }
}