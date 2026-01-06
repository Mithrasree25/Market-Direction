import React from 'react';
import { VQCParameters } from '../types/market';
import { Settings, Play, Pause, RotateCcw } from 'lucide-react';

interface VQCControlsProps {
  parameters: VQCParameters;
  onParametersChange: (parameters: VQCParameters) => void;
  isTraining: boolean;
  onStartTraining: () => void;
  onStopTraining: () => void;
  onReset: () => void;
}

export const VQCControls: React.FC<VQCControlsProps> = ({
  parameters,
  onParametersChange,
  isTraining,
  onStartTraining,
  onStopTraining,
  onReset
}) => {
  const handleParameterChange = (key: keyof VQCParameters, value: any) => {
    onParametersChange({
      ...parameters,
      [key]: value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        VQC Configuration
      </h3>

      <div className="space-y-4">
        {/* Quantum Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qubits
            </label>
            <select
              value={parameters.qubits}
              onChange={(e) => handleParameterChange('qubits', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTraining}
            >
              <option value={2}>2 Qubits</option>
              <option value={3}>3 Qubits</option>
              <option value={4}>4 Qubits</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layers
            </label>
            <select
              value={parameters.layers}
              onChange={(e) => handleParameterChange('layers', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTraining}
            >
              <option value={1}>1 Layer</option>
              <option value={2}>2 Layers</option>
              <option value={3}>3 Layers</option>
              <option value={4}>4 Layers</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entanglement Strategy
          </label>
          <select
            value={parameters.entanglement}
            onChange={(e) => handleParameterChange('entanglement', e.target.value as 'linear' | 'circular' | 'full')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTraining}
          >
            <option value="linear">Linear</option>
            <option value="circular">Circular</option>
            <option value="full">Full</option>
          </select>
        </div>

        {/* Training Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learning Rate
            </label>
            <input
              type="number"
              value={parameters.learningRate}
              onChange={(e) => handleParameterChange('learningRate', parseFloat(e.target.value))}
              step="0.001"
              min="0.001"
              max="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTraining}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Iterations
            </label>
            <input
              type="number"
              value={parameters.iterations}
              onChange={(e) => handleParameterChange('iterations', parseInt(e.target.value))}
              min="10"
              max="1000"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTraining}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          {!isTraining ? (
            <button
              onClick={onStartTraining}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Start Training</span>
            </button>
          ) : (
            <button
              onClick={onStopTraining}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>Stop Training</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            disabled={isTraining}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};