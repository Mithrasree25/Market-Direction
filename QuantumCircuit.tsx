import React from 'react';
import { VQCParameters } from '../types/market';

interface QuantumCircuitProps {
  parameters: VQCParameters;
  isTraining: boolean;
}

export const QuantumCircuit: React.FC<QuantumCircuitProps> = ({ parameters, isTraining }) => {
  const renderQubit = (index: number) => (
    <div key={index} className="flex items-center space-x-2 mb-4">
      <div className="w-12 h-8 bg-blue-100 border-2 border-blue-300 rounded flex items-center justify-center text-sm font-mono">
        |q{index}⟩
      </div>
      <div className="flex-1 h-0.5 bg-gray-300 relative">
        {Array.from({ length: parameters.layers }).map((_, layerIndex) => (
          <div
            key={layerIndex}
            className={`absolute w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transform -translate-y-1/2 ${
              isTraining ? 'bg-yellow-200 border-yellow-400 animate-pulse' : 'bg-green-200 border-green-400'
            }`}
            style={{ left: `${(layerIndex + 1) * (100 / (parameters.layers + 1))}%` }}
          >
            R
          </div>
        ))}
      </div>
    </div>
  );

  const renderEntanglement = () => {
    if (parameters.entanglement === 'linear') {
      return (
        <div className="mt-4 space-y-2">
          {Array.from({ length: parameters.qubits - 1 }).map((_, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="w-2 h-8 bg-purple-300 rounded"></div>
              <div className="text-xs text-purple-600 ml-2">CNOT {index}-{index + 1}</div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        Quantum Circuit Visualization
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Qubits:</span> {parameters.qubits} | 
          <span className="font-medium ml-2">Layers:</span> {parameters.layers} | 
          <span className="font-medium ml-2">Entanglement:</span> {parameters.entanglement}
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        {Array.from({ length: parameters.qubits }).map((_, index) => renderQubit(index))}
        {renderEntanglement()}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-200 border border-green-400 rounded-full mr-1"></div>
            <span>Rotation Gate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-300 rounded mr-1"></div>
            <span>Entanglement</span>
          </div>
          {isTraining && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded-full mr-1 animate-pulse"></div>
              <span>Training</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};