import React, { useState } from 'react';
import { BacktestResult } from '../types/market';
import { BarChart3, Play, Calendar, Target, TrendingUp, Award } from 'lucide-react';

interface BacktestingProps {
  onRunBacktest: (startDate: Date, endDate: Date, initialCapital: number) => void;
  backtestResult: BacktestResult | null;
  isRunning: boolean;
}

export const Backtesting: React.FC<BacktestingProps> = ({ onRunBacktest, backtestResult, isRunning }) => {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [initialCapital, setInitialCapital] = useState(10000);

  const handleRunBacktest = () => {
    onRunBacktest(new Date(startDate), new Date(endDate), initialCapital);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
        Strategy Backtesting
      </h3>

      {/* Backtest Configuration */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Capital ($)
          </label>
          <input
            type="number"
            value={initialCapital}
            onChange={(e) => setInitialCapital(parseInt(e.target.value))}
            min="1000"
            step="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isRunning}
          />
        </div>

        <button
          onClick={handleRunBacktest}
          disabled={isRunning}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          <span>{isRunning ? 'Running Backtest...' : 'Run Backtest'}</span>
        </button>
      </div>

      {/* Backtest Results */}
      {backtestResult && (
        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Backtest Results</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {backtestResult.totalReturn.toFixed(2)}%
                </span>
              </div>
              <div className="text-sm text-green-800 mt-1">Total Return</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {backtestResult.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-blue-800 mt-1">Win Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-xl font-bold text-purple-600">
                  {backtestResult.totalTrades}
                </span>
              </div>
              <div className="text-sm text-purple-800 mt-1">Total Trades</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="text-xl font-bold text-orange-600">
                  {backtestResult.avgHoldingPeriod.toFixed(1)}d
                </span>
              </div>
              <div className="text-sm text-orange-800 mt-1">Avg Hold Period</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {backtestResult.maxConsecutiveWins}
              </div>
              <div className="text-xs text-gray-600">Max Consecutive Wins</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {backtestResult.maxConsecutiveLosses}
              </div>
              <div className="text-xs text-gray-600">Max Consecutive Losses</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};