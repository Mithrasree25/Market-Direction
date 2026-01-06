import React from 'react';
import { PortfolioPosition } from '../types/market';
import { Briefcase, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PortfolioProps {
  positions: PortfolioPosition[];
  totalValue: number;
  totalPnL: number;
}

export const Portfolio: React.FC<PortfolioProps> = ({ positions, totalValue, totalPnL }) => {
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
        Portfolio Overview
      </h3>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">
              ${totalValue.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-blue-800 mt-1">Total Value</div>
        </div>

        <div className={`p-4 rounded-lg border ${totalPnL >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            {totalPnL >= 0 ? 
              <TrendingUp className="w-5 h-5 text-green-600" /> : 
              <TrendingDown className="w-5 h-5 text-red-600" />
            }
            <span className={`text-xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalPnL).toLocaleString()}
            </span>
          </div>
          <div className={`text-sm mt-1 ${totalPnL >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            Total P&L ({totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span className="text-xl font-bold text-purple-600">
              {positions.length}
            </span>
          </div>
          <div className="text-sm text-purple-800 mt-1">Active Positions</div>
        </div>
      </div>

      {/* Positions List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Current Positions</h4>
        {positions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No active positions
          </div>
        ) : (
          positions.map((position, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {position.symbol.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{position.symbol}</div>
                  <div className="text-xs text-gray-600">
                    {position.quantity} shares @ ${position.entryPrice.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  ${position.currentPrice.toFixed(2)}
                </div>
                <div className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};