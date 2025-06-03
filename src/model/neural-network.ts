import { matrix, Matrix, transpose, flatten, subtract } from 'mathjs';
import { NeuralNetworkLayer } from './neural-network-layer';




class NeuralNetwork {
    layers: NeuralNetworkLayer[] = [];

    constructor(networkFormat: number[], learningRate: number = 0.1) {
        for (let i = 0; i < networkFormat.length - 1; i++) {
            const layer = new NeuralNetworkLayer(networkFormat[i], networkFormat[i + 1], learningRate);
            this.layers.push(layer);
        }
    }

    // 前向传播接口
    forward(inputs: number[]): number[] {
        const inputsMatrix = transpose(matrix([inputs])); // 将输入转化为列矩阵
        const outputsMatrix = this._forward(inputsMatrix); // 前向传播
        return flatten(outputsMatrix).toArray() as number[]; // 将结果转化为数组输出
    }
    // 前向传播
    _forward(inputs: Matrix): Matrix {
        let outputs = inputs;
        for (let i = 0; i < this.layers.length; i++) {
            outputs = this.layers[i].forward(outputs);
        }
        return outputs;
    }


    // 反向传播接口
    backward(inputs: number[]): number[] {
        let inputsMatrix = transpose(matrix([inputs])); // 将输入转化为列矩阵
        const outputsMatrix = this._backward(inputsMatrix); // 反向传播
        return flatten(outputsMatrix).toArray() as number[]; // 将结果转化为数组输出
    }
    // 反向传播
    _backward(inputs: Matrix): Matrix {
        let outputs = inputs;
        for (let i = this.layers.length - 1; i >= 0; i--) {
            outputs = this.layers[i].backward(outputs);
        }
        return outputs;
    }


    // 训练
    train(inputsArray: number[], targetsArray: number[]): void {
        const inputs = transpose(matrix([inputsArray])); // 列向量 inputs
        const targets = transpose(matrix([targetsArray])); // 列向量 targets
        
        this._train(0, inputs, targets);
    //     const LayerOutputs: Matrix[] = []; // 每层的输出
    //     for(let i = 0; i < this.layers.length; i++) {
    //         const layer = this.layers[i];
    //         if (i === 0) {
    //             LayerOutputs.push(layer.forward(inputs));
    //         } else {
    //             LayerOutputs.push(layer.forward(LayerOutputs[i-1]));
    //         }
    //         console.log(LayerOutputs[i].toArray());
    //     }

    //     let errors = subtract(targets, LayerOutputs[LayerOutputs.length-1]) as Matrix;
    //     for (let i = this.layers.length -1; i >= 0 ; i++) {
    //         const layer = this.layers[i];
    //         errors = layer.backward(errors);
    //         layer.train(LayerOutputs[i], errors);
    //     }
    }
    // 递归训练
    // 训练第 n 层时，需要第 n-1 层的输出作为输入，并将第 n+1 层的误差反向传播作为第 n 层的误差
    _train(layerIndex: number, inputs: Matrix, targets: Matrix): Matrix {
        if (layerIndex >= this.layers.length) {
            return subtract(targets, inputs);
        }

        const layer = this.layers[layerIndex];
        const outputs = layer.forward(inputs);

        // 获得来自下一层的反向误差
        const errorsNext = this._train(layerIndex + 1, outputs, targets);
        // 训练当前层
        layer.train(inputs, errorsNext);
        
        // 返回经反向传播后的误差值
        const errorsBackward = layer.backward(errorsNext);
        return errorsBackward;
    }
}

// 示例数据
const input = [0.9, 0.1, 0.8];
const target = [1, 0];

// 创建神经网络实例
const nn = new NeuralNetwork([3, 4, 2]);

// 训练神经网络
for (let i = 0; i < 1000; i++) {
    nn.train(input, target);
}

// 前向传播测试
const output = nn.forward(input);
console.log(output.valueOf());
