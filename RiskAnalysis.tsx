import React from 'react';
import { RiskMetrics } from '../types/market';
import { AlertTriangle, Shield, TrendingDown, Activity } from 'lucide-react';

interface RiskAnalysisProps {
  riskMetrics: RiskMetrics;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ riskMetrics }) => {
  const getRiskLevel = (var95: number) => {
    if (var95 < 2) return { level: 'Low', color: 'text-green-600 bg-green-50 border-green-200' };
    if (var95 < 5) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    return { level: 'High', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const riskLevel = getRiskLevel(riskMetrics.valueAtRisk);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-blue-600" />
        Risk Analysis
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${riskLevel.color}`}>
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-2xl font-bold">
              {riskMetrics.valueAtRisk.toFixed(2)}%
            </span>
          </div>
          <div className="text-sm mt-1">Value at Risk (95%)</div>
          <div className="text-xs mt-1 opacity-75">Risk Level: {riskLevel.level}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <TrendingDown className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {riskMetrics.maxDrawdown.toFixed(2)}%
            </span>
          </div>
          <div className="text-sm text-blue-800 mt-1">Max Drawdown</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-xl font-bold text-purple-600">
              {riskMetrics.sharpeRatio.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-purple-800 mt-1">Sharpe Ratio</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <Activity className="w-5 h-5 text-orange-600" />
            <span className="text-xl font-bold text-orange-600">
              {riskMetrics.volatilityIndex.toFixed(1)}
            </span>
          </div>
          <div className="text-sm text-orange-800 mt-1">Volatility Index</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Assessment</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• VaR indicates potential loss in worst 5% of scenarios</p>
          <p>• Sharpe ratio measures risk-adjusted returns</p>
          <p>• Max drawdown shows largest peak-to-trough decline</p>
        </div>
      </div>
    </div>
  );
};