import React from 'react';
import { MarketData, ClassificationResult } from '../types/market';
import { TrendingUp, TrendingDown, Minus, Activity, Target, Zap } from 'lucide-react';

interface MarketChartProps {
  data: MarketData[];
  predictions: ClassificationResult[];
}

export const MarketChart: React.FC<MarketChartProps> = ({ data, predictions }) => {
  if (data.length === 0) return null;

  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const chartHeight = 300;
  const chartWidth = 800;

  const getY = (price: number) => {
    return ((maxPrice - price) / priceRange) * (chartHeight - 40) + 20;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * (chartWidth - 80) + 40;
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'bullish':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'bearish':
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      default:
        return <Minus className="w-3 h-3 text-gray-600" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'bullish':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'bearish':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPredictionColor = (direction: string, confidence: number) => {
    const opacity = Math.max(0.3, confidence);
    switch (direction) {
      case 'bullish':
        return `rgba(34, 197, 94, ${opacity})`;
      case 'bearish':
        return `rgba(239, 68, 68, ${opacity})`;
      default:
        return `rgba(107, 114, 128, ${opacity})`;
    }
  };

  // Create price path
  const pricePath = data.map((d, i) => `${getX(i)},${getY(d.price)}`).join(' ');
  
  // Create Bollinger Band paths
  const upperBandPath = data.map((d, i) => `${getX(i)},${getY(d.bollinger.upper)}`).join(' ');
  const lowerBandPath = data.map((d, i) => `${getX(i)},${getY(d.bollinger.lower)}`).join(' ');
  const middleBandPath = data.map((d, i) => `${getX(i)},${getY(d.bollinger.middle)}`).join(' ');

  // Create volume bars (scaled)
  const maxVolume = Math.max(...data.map(d => d.volume));
  const volumeScale = 60; // Height for volume bars

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            Market Analysis & VQC Predictions
          </h3>
          <p className="text-sm text-gray-600 mt-1">Real-time price action with quantum classification overlay</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-blue-600"></div>
            <span className="text-gray-600">Price</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-gray-400 opacity-60"></div>
            <span className="text-gray-600">Bollinger</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 bg-blue-200"></div>
            <span className="text-gray-600">Volume</span>
          </div>
        </div>
      </div>
      
      <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-lg border">
        <svg width="100%" height={chartHeight + 100} viewBox={`0 0 ${chartWidth} ${chartHeight + 100}`} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="volumeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2"/>
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Volume bars */}
          {data.map((d, i) => {
            const barHeight = (d.volume / maxVolume) * volumeScale;
            const x = getX(i);
            const y = chartHeight - barHeight + 20;
            return (
              <rect
                key={`volume-${i}`}
                x={x - 1}
                y={y}
                width="2"
                height={barHeight}
                fill="url(#volumeGradient)"
                opacity="0.7"
              />
            );
          })}

          {/* Bollinger Bands */}
          <polyline
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="3,3"
            points={upperBandPath}
            opacity="0.8"
          />
          <polyline
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="1,2"
            points={middleBandPath}
            opacity="0.6"
          />
          <polyline
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="3,3"
            points={lowerBandPath}
            opacity="0.8"
          />

          {/* Price area fill */}
          <path
            d={`M 40,${chartHeight - 20} L ${pricePath} L ${getX(data.length - 1)},${chartHeight - 20} Z`}
            fill="url(#priceGradient)"
          />

          {/* Main price line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={pricePath}
            className="drop-shadow-sm"
          />

          {/* VQC Prediction overlays */}
          {data.slice(-Math.min(20, predictions.length)).map((d, i) => {
            const dataIndex = data.length - Math.min(20, predictions.length) + i;
            const prediction = predictions[predictions.length - Math.min(20, predictions.length) + i];
            if (!prediction) return null;
            
            const x = getX(dataIndex);
            const y = getY(d.price);
            const confidence = prediction.confidence;
            
            return (
              <g key={`prediction-${dataIndex}`}>
                {/* Confidence circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={4 + confidence * 6}
                  fill={getPredictionColor(prediction.direction, confidence * 0.3)}
                  stroke={getPredictionColor(prediction.direction, 1)}
                  strokeWidth="2"
                  className="animate-pulse"
                />
                
                {/* Direction indicator */}
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill={getPredictionColor(prediction.direction, 1)}
                />
                
                {/* Prediction arrow */}
                {prediction.direction === 'bullish' && (
                  <path
                    d={`M ${x-3} ${y+8} L ${x} ${y+5} L ${x+3} ${y+8}`}
                    stroke="#22c55e"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {prediction.direction === 'bearish' && (
                  <path
                    d={`M ${x-3} ${y-8} L ${x} ${y-5} L ${x+3} ${y-8}`}
                    stroke="#ef4444"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            );
          })}

          {/* Price labels */}
          {[maxPrice, (maxPrice + minPrice) / 2, minPrice].map((price, index) => (
            <g key={`price-label-${index}`}>
              <text
                x="10"
                y={20 + index * ((chartHeight - 40) / 2)}
                fontSize="11"
                fill="#6b7280"
                textAnchor="start"
                dominantBaseline="middle"
                className="font-mono"
              >
                ${price.toFixed(2)}
              </text>
              <line
                x1="35"
                y1={20 + index * ((chartHeight - 40) / 2)}
                x2={chartWidth - 40}
                y2={20 + index * ((chartHeight - 40) / 2)}
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="2,4"
              />
            </g>
          ))}

          {/* Time labels */}
          {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, index, filtered) => {
            const originalIndex = data.indexOf(d);
            return (
              <text
                key={`time-label-${originalIndex}`}
                x={getX(originalIndex)}
                y={chartHeight + 15}
                fontSize="10"
                fill="#9ca3af"
                textAnchor="middle"
                className="font-mono"
              >
                {d.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Enhanced prediction summary */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest Prediction */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Latest VQC Signal
          </h4>
          {predictions.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getDirectionIcon(predictions[predictions.length - 1].direction)}
                <span className="font-bold text-lg capitalize">
                  {predictions[predictions.length - 1].direction}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-700">
                  {(predictions[predictions.length - 1].confidence * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-blue-600">Confidence</div>
              </div>
            </div>
          )}
        </div>

        {/* Market Stats */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            Market Metrics
          </h4>
          {data.length > 0 && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Price:</span>
                <span className="font-mono font-bold">${data[data.length - 1].price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">RSI:</span>
                <span className="font-mono">{data[data.length - 1].rsi.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Volatility:</span>
                <span className="font-mono">{data[data.length - 1].volatility.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Quantum Performance */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            VQC Performance
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-700">Predictions:</span>
              <span className="font-bold">{predictions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Avg Confidence:</span>
              <span className="font-mono">
                {predictions.length > 0 
                  ? (predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100).toFixed(1) + '%'
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Status:</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent predictions timeline */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent VQC Classifications</h4>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {predictions.slice(-8).map((prediction, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm whitespace-nowrap transition-all hover:scale-105 ${getDirectionColor(prediction.direction)}`}
            >
              {getDirectionIcon(prediction.direction)}
              <span className="font-semibold capitalize">{prediction.direction}</span>
              <span className="text-xs opacity-75">
                {(prediction.confidence * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};