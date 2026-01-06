import React, { useState, useEffect, useCallback } from 'react';
import { VQCParameters, MarketData, ClassificationResult, TrainingMetrics } from './types/market';
import { VQCSimulator } from './utils/quantumSimulator';
import { MarketDataGenerator } from './utils/marketDataGenerator';
import { QuantumCircuit } from './components/QuantumCircuit';
import { VQCControls } from './components/VQCControls';
import { MarketChart } from './components/MarketChart';
import { ClassificationResults } from './components/ClassificationResults';
import { TrainingMetricsComponent } from './components/TrainingMetrics';
import { RiskAnalysis } from './components/RiskAnalysis';
import { Portfolio } from './components/Portfolio';
import { Backtesting } from './components/Backtesting';
import { AlertSystem } from './components/AlertSystem';
import { Brain, TrendingUp, Zap } from 'lucide-react';
import { RiskMetrics, PortfolioPosition, BacktestResult } from './types/market';

function App() {
  const [parameters, setParameters] = useState<VQCParameters>({
    layers: 2,
    qubits: 3,
    learningRate: 0.01,
    iterations: 100,
    entanglement: 'linear'
  });

  const [vqcSimulator, setVqcSimulator] = useState<VQCSimulator | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [predictions, setPredictions] = useState<ClassificationResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ClassificationResult | null>(null);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    valueAtRisk: 2.5,
    sharpeRatio: 1.2,
    maxDrawdown: 8.3,
    volatilityIndex: 15.7
  });
  const [portfolioPositions, setPortfolioPositions] = useState<PortfolioPosition[]>([
    {
      symbol: 'AAPL',
      quantity: 100,
      entryPrice: 150.00,
      currentPrice: 155.50,
      pnl: 550,
      pnlPercent: 3.67
    },
    {
      symbol: 'GOOGL',
      quantity: 50,
      entryPrice: 2800.00,
      currentPrice: 2750.00,
      pnl: -2500,
      pnlPercent: -1.79
    }
  ]);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'prediction' as const,
      title: 'Strong Bullish Signal',
      message: 'VQC detected high confidence bullish pattern',
      timestamp: new Date(),
      severity: 'high' as const,
      read: false
    },
    {
      id: '2',
      type: 'risk' as const,
      title: 'Volatility Spike',
      message: 'Market volatility increased by 25%',
      timestamp: new Date(Date.now() - 300000),
      severity: 'medium' as const,
      read: false
    }
  ]);

  // Initialize market data
  useEffect(() => {
    const historicalData = MarketDataGenerator.generateHistoricalData(100);
    setMarketData(historicalData);
  }, []);

  // Initialize VQC simulator when parameters change
  useEffect(() => {
    const simulator = new VQCSimulator(parameters);
    setVqcSimulator(simulator);
  }, [parameters]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (marketData.length > 0) {
        const lastPrice = marketData[marketData.length - 1].price;
        const newData = MarketDataGenerator.generateRealTimeData(lastPrice);
        
        setMarketData(prev => [...prev.slice(-99), newData]);
        
        // Generate prediction for new data if VQC is available
        if (vqcSimulator && !isTraining) {
          setIsProcessing(true);
          setTimeout(() => {
            const result = vqcSimulator.classify(newData);
            setCurrentResult(result);
            setPredictions(prev => [...prev.slice(-99), result]);
            setIsProcessing(false);
          }, 1000); // Simulate processing time
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [marketData, vqcSimulator, isTraining]);

  const handleStartTraining = useCallback(() => {
    if (!vqcSimulator || marketData.length === 0) return;

    setIsTraining(true);
    setTrainingMetrics([]);
    
    // Simulate training process
    let epoch = 0;
    const trainingInterval = setInterval(() => {
      epoch++;
      
      // Simulate training metrics
      const accuracy = Math.min(0.5 + (epoch / parameters.iterations) * 0.4 + Math.random() * 0.1, 0.95);
      const loss = Math.max(1.0 - (epoch / parameters.iterations) * 0.8 - Math.random() * 0.1, 0.05);
      const validationAccuracy = accuracy - 0.05 + Math.random() * 0.1;
      
      const metrics: TrainingMetrics = {
        accuracy,
        loss,
        epoch,
        validationAccuracy: Math.max(0, Math.min(1, validationAccuracy))
      };
      
      setTrainingMetrics(prev => [...prev, metrics]);
      
      if (epoch >= parameters.iterations) {
        clearInterval(trainingInterval);
        setIsTraining(false);
        
        // Generate initial prediction after training
        if (marketData.length > 0) {
          const latestData = marketData[marketData.length - 1];
          const result = vqcSimulator.classify(latestData);
          setCurrentResult(result);
          setPredictions(prev => [...prev, result]);
        }
      }
    }, 100);
  }, [vqcSimulator, marketData, parameters.iterations]);

  const handleStopTraining = useCallback(() => {
    setIsTraining(false);
  }, []);

  const handleReset = useCallback(() => {
    setTrainingMetrics([]);
    setPredictions([]);
    setCurrentResult(null);
    const simulator = new VQCSimulator(parameters);
    setVqcSimulator(simulator);
  }, [parameters]);

  const handleRunBacktest = useCallback((startDate: Date, endDate: Date, initialCapital: number) => {
    setIsBacktesting(true);
    
    // Simulate backtesting process
    setTimeout(() => {
      const result: BacktestResult = {
        totalReturn: 15.7 + Math.random() * 10,
        winRate: 65 + Math.random() * 15,
        totalTrades: Math.floor(50 + Math.random() * 100),
        avgHoldingPeriod: 2.5 + Math.random() * 3,
        maxConsecutiveWins: Math.floor(3 + Math.random() * 5),
        maxConsecutiveLosses: Math.floor(2 + Math.random() * 4)
      };
      setBacktestResult(result);
      setIsBacktesting(false);
    }, 3000);
  }, []);

  const handleDismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const handleMarkAsRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  }, []);

  // Update risk metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRiskMetrics(prev => ({
        ...prev,
        valueAtRisk: 1.5 + Math.random() * 4,
        volatilityIndex: 10 + Math.random() * 20
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Update portfolio positions
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioPositions(prev => prev.map(position => {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = position.currentPrice * (1 + priceChange);
        const pnl = (newPrice - position.entryPrice) * position.quantity;
        const pnlPercent = ((newPrice - position.entryPrice) / position.entryPrice) * 100;
        
        return {
          ...position,
          currentPrice: newPrice,
          pnl,
          pnlPercent
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VQC Market Classifier</h1>
                <p className="text-sm text-gray-600">Variational Quantum Computing for Financial Prediction</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Live Market Data</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="w-4 h-4" />
                <span>Quantum Processing</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Controls and Circuit */}
          <div className="xl:col-span-1 space-y-6">
            <VQCControls
              parameters={parameters}
              onParametersChange={setParameters}
              isTraining={isTraining}
              onStartTraining={handleStartTraining}
              onStopTraining={handleStopTraining}
              onReset={handleReset}
            />
            
            <QuantumCircuit
              parameters={parameters}
              isTraining={isTraining}
            />
            
            <AlertSystem
              alerts={alerts}
              onDismissAlert={handleDismissAlert}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>

          {/* Middle Columns - Chart and Results */}
          <div className="xl:col-span-2 space-y-6">
            <MarketChart
              data={marketData}
              predictions={predictions}
            />
            
            <ClassificationResults
              result={currentResult}
              isProcessing={isProcessing}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Portfolio
                positions={portfolioPositions}
                totalValue={portfolioPositions.reduce((sum, pos) => sum + pos.currentPrice * pos.quantity, 0)}
                totalPnL={portfolioPositions.reduce((sum, pos) => sum + pos.pnl, 0)}
              />
              
              <Backtesting
                onRunBacktest={handleRunBacktest}
                backtestResult={backtestResult}
                isRunning={isBacktesting}
              />
            </div>
          </div>

          {/* Right Column - Training Metrics */}
          <div className="xl:col-span-1 space-y-6">
            <TrainingMetricsComponent
              metrics={trainingMetrics}
              isTraining={isTraining}
            />
            
            <RiskAnalysis
              riskMetrics={riskMetrics}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>VQC Market Classifier - Advanced Quantum Computing Prototype</p>
            <p className="mt-1">Simulated quantum processing for educational and research purposes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;