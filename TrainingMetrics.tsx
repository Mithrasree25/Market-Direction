import React from 'react';
import { TrainingMetrics } from '../types/market';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';

interface TrainingMetricsProps {
  metrics: TrainingMetrics[];
  isTraining: boolean;
}

export const TrainingMetricsComponent: React.FC<TrainingMetricsProps> = ({ metrics, isTraining }) => {
  const latestMetrics = metrics[metrics.length - 1];

  if (metrics.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Training Metrics</h3>
        <div className="text-center py-8 text-gray-500">
          No training data available. Start training to see metrics.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Training Metrics
        {isTraining && (
          <div className="ml-auto flex items-center text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></div>
            Training...
          </div>
        )}
      </h3>

      {/* Current Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {(latestMetrics.accuracy * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-sm text-blue-800 mt-1">Accuracy</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span className="text-2xl font-bold text-red-600">
              {latestMetrics.loss.toFixed(3)}
            </span>
          </div>
          <div className="text-sm text-red-800 mt-1">Loss</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {(latestMetrics.validationAccuracy * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-sm text-green-800 mt-1">Val. Accuracy</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              {latestMetrics.epoch}
            </span>
          </div>
          <div className="text-sm text-purple-800 mt-1">Epoch</div>
        </div>
      </div>

      {/* Training Progress Chart */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Training Progress</h4>
        <div className="relative h-32 bg-gray-50 rounded-lg p-4">
          <svg width="100%" height="100%" className="absolute inset-4">
            {/* Accuracy line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={metrics.map((m, i) => 
                `${(i / (metrics.length - 1)) * 100}%,${(1 - m.accuracy) * 100}%`
              ).join(' ')}
            />
            
            {/* Validation accuracy line */}
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="5,5"
              points={metrics.map((m, i) => 
                `${(i / (metrics.length - 1)) * 100}%,${(1 - m.validationAccuracy) * 100}%`
              ).join(' ')}
            />
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-2 right-2 text-xs space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-blue-500 mr-2"></div>
              <span>Training Accuracy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-green-500 border-dashed mr-2"></div>
              <span>Validation Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Epochs */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Epochs</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {metrics.slice(-5).reverse().map((metric, index) => (
            <div key={metric.epoch} className="flex items-center justify-between text-sm py-1 px-2 bg-gray-50 rounded">
              <span className="font-medium">Epoch {metric.epoch}</span>
              <div className="flex space-x-4 text-xs">
                <span className="text-blue-600">Acc: {(metric.accuracy * 100).toFixed(1)}%</span>
                <span className="text-red-600">Loss: {metric.loss.toFixed(3)}</span>
                <span className="text-green-600">Val: {(metric.validationAccuracy * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};