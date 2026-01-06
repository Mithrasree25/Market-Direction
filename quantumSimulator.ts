import { VQCParameters, ClassificationResult, MarketData } from '../types/market';

// Quantum gate operations simulation
export class QuantumGate {
  static hadamard(qubit: number[]): number[] {
    const [a, b] = qubit;
    return [(a + b) / Math.sqrt(2), (a - b) / Math.sqrt(2)];
  }

  static rotationY(qubit: number[], theta: number): number[] {
    const [a, b] = qubit;
    const cos = Math.cos(theta / 2);
    const sin = Math.sin(theta / 2);
    return [cos * a - sin * b, sin * a + cos * b];
  }

  static cnot(control: number[], target: number[]): [number[], number[]] {
    if (Math.abs(control[0]) > Math.abs(control[1])) {
      return [control, target];
    } else {
      return [control, [target[1], target[0]]];
    }
  }
}

export class VQCSimulator {
  private parameters: VQCParameters;
  private weights: number[][];

  constructor(parameters: VQCParameters) {
    this.parameters = parameters;
    this.weights = this.initializeWeights();
  }

  private initializeWeights(): number[][] {
    const weights: number[][] = [];
    for (let layer = 0; layer < this.parameters.layers; layer++) {
      const layerWeights: number[] = [];
      for (let qubit = 0; qubit < this.parameters.qubits; qubit++) {
        layerWeights.push(Math.random() * 2 * Math.PI - Math.PI);
      }
      weights.push(layerWeights);
    }
    return weights;
  }

  private encodeData(data: MarketData): number[][] {
    // Normalize market data to quantum state amplitudes
    const features = [
      data.rsi / 100,
      Math.tanh(data.macd / 100),
      Math.min(data.volatility / 50, 1),
      (data.price - data.bollinger.middle) / (data.bollinger.upper - data.bollinger.lower)
    ];

    const qubits: number[][] = [];
    for (let i = 0; i < this.parameters.qubits; i++) {
      const amplitude = features[i % features.length];
      qubits.push([Math.sqrt(1 - amplitude * amplitude), amplitude]);
    }
    return qubits;
  }

  private applyVariationalLayer(qubits: number[][], layerIndex: number): number[][] {
    const newQubits = [...qubits];
    
    // Apply rotation gates
    for (let i = 0; i < newQubits.length; i++) {
      newQubits[i] = QuantumGate.rotationY(newQubits[i], this.weights[layerIndex][i]);
    }

    // Apply entanglement based on strategy
    if (this.parameters.entanglement === 'linear') {
      for (let i = 0; i < newQubits.length - 1; i++) {
        const [control, target] = QuantumGate.cnot(newQubits[i], newQubits[i + 1]);
        newQubits[i] = control;
        newQubits[i + 1] = target;
      }
    } else if (this.parameters.entanglement === 'circular') {
      for (let i = 0; i < newQubits.length; i++) {
        const nextIndex = (i + 1) % newQubits.length;
        const [control, target] = QuantumGate.cnot(newQubits[i], newQubits[nextIndex]);
        newQubits[i] = control;
        newQubits[nextIndex] = target;
      }
    }

    return newQubits;
  }

  private measureQubits(qubits: number[][]): number[] {
    return qubits.map(qubit => Math.abs(qubit[0]) ** 2);
  }

  classify(data: MarketData): ClassificationResult {
    let qubits = this.encodeData(data);

    // Apply variational layers
    for (let layer = 0; layer < this.parameters.layers; layer++) {
      qubits = this.applyVariationalLayer(qubits, layer);
    }

    const measurements = this.measureQubits(qubits);
    const sum = measurements.reduce((a, b) => a + b, 0);
    const normalized = measurements.map(m => m / sum);

    // Map quantum measurements to market directions
    const bullishProb = normalized[0] || 0;
    const bearishProb = normalized[1] || 0;
    const neutralProb = 1 - bullishProb - bearishProb;

    const maxProb = Math.max(bullishProb, bearishProb, neutralProb);
    let direction: 'bullish' | 'bearish' | 'neutral';
    
    if (maxProb === bullishProb) direction = 'bullish';
    else if (maxProb === bearishProb) direction = 'bearish';
    else direction = 'neutral';

    return {
      direction,
      confidence: maxProb,
      probability: {
        bullish: bullishProb,
        bearish: bearishProb,
        neutral: neutralProb
      },
      quantumState: qubits.map(q => `|${q[0].toFixed(3)}, ${q[1].toFixed(3)}⟩`).join(' ⊗ '),
      features: {
        technical: data.rsi / 100,
        momentum: Math.tanh(data.macd / 100),
        volatility: Math.min(data.volatility / 50, 1)
      }
    };
  }

  updateWeights(gradients: number[][]): void {
    for (let layer = 0; layer < this.weights.length; layer++) {
      for (let weight = 0; weight < this.weights[layer].length; weight++) {
        this.weights[layer][weight] -= this.parameters.learningRate * gradients[layer][weight];
      }
    }
  }
}