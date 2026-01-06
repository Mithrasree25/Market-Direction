import React from 'react';
import { ClassificationResult } from '../types/market';
import { TrendingUp, TrendingDown, Minus, Activity, Zap, BarChart3 } from 'lucide-react';

interface ClassificationResultsProps {
  result: ClassificationResult | null;
  isProcessing: boolean;
}

export const ClassificationResults: React.FC<ClassificationResultsProps> = ({ result, isProcessing }) => {
  if (isProcessing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">VQC Classification</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Processing quantum classification...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">VQC Classification</h3>
        <div className="text-center py-8 text-gray-500">
          No classification results yet. Start training to see predictions.
        </div>
      </div>
    );
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'bullish':
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      default:
        return <Minus className="w-6 h-6 text-gray-500" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'bullish':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">VQC Classification Results</h3>

      {/* Main Prediction */}
      <div className={`p-4 rounded-lg border-2 mb-6 ${getDirectionColor(result.direction)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getDirectionIcon(result.direction)}
            <div>
              <h4 className="text-xl font-bold capitalize">{result.direction}</h4>
              <p className="text-sm opacity-75">Market Direction Prediction</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{(result.confidence * 100).toFixed(1)}%</div>
            <div className="text-sm opacity-75">Confidence</div>
          </div>
        </div>
      </div>

      {/* Probability Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Probability Distribution</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm">Bullish</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${result.probability.bullish * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {(result.probability.bullish * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm">Bearish</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${result.probability.bearish * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {(result.probability.bearish * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Minus className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Neutral</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: `${result.probability.neutral * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {(result.probability.neutral * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Analysis */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Feature Analysis</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-blue-800">Technical</div>
            <div className="text-lg font-bold text-blue-600">
              {(result.features.technical * 100).toFixed(0)}
            </div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Activity className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-purple-800">Momentum</div>
            <div className="text-lg font-bold text-purple-600">
              {(result.features.momentum * 100).toFixed(0)}
            </div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Zap className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-orange-800">Volatility</div>
            <div className="text-lg font-bold text-orange-600">
              {(result.features.volatility * 100).toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Quantum State */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quantum State</h4>
        <div className="font-mono text-xs text-gray-600 break-all">
          {result.quantumState}
        </div>
      </div>
    </div>
  );
};