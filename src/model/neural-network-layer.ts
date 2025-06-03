import { matrix, Matrix, multiply, add, subtract, map, random, dotMultiply, transpose } from 'mathjs';


// 定义激活函数及其导数
function sigmoid(x: Matrix): Matrix {
    return map(x, (value) => 1 / (1 + Math.exp(-value)));
}

function sigmoidDerivative(x: Matrix): Matrix {
    return map(x, (value) => value * (1 - value));
}


// 定义神经网络层
class NeuralNetworkLayer {
    inputNodes: number;
    outputNodes: number;
    learningRate: number;

    weights: Matrix;
    bias: Matrix;

    constructor(inputNodes: number, outputNodes: number, learningRate: number = 0.1) {
        this.inputNodes = inputNodes;
        this.outputNodes = outputNodes;
        this.learningRate = learningRate;

        // 初始化权重和偏置
        this.weights = matrix(random([outputNodes, inputNodes]));
        this.bias = matrix(random([outputNodes, 1]));
    }

    // 前向传播
    forward(inputs: Matrix): Matrix {
        const outputs = add(multiply(this.weights, inputs), this.bias);
        const outputsActivated = sigmoid(outputs);
        return outputsActivated;
    }

    // 反向传播
    backward(errors: Matrix): Matrix {
        return multiply(transpose(this.weights), errors);
    }

    // 训练
    train(inputs: Matrix, errors: Matrix): void {
        const outputs = this.forward(inputs);
        
        // 计算权重更新量
        const gradientOutput = dotMultiply(sigmoidDerivative(outputs), errors);
        const gradientOutputScaled = multiply(gradientOutput, this.learningRate);
        const deltaWeightsScaled = multiply(gradientOutputScaled, transpose(inputs));

        // 更新权重
        this.weights = add(this.weights, deltaWeightsScaled);
        this.bias = add(this.bias, dotMultiply(gradientOutputScaled, 1));
    }

    toJSON(): object {
        return {
            inputNodes: this.inputNodes,
            outputNodes: this.outputNodes,
            learningRate: this.learningRate,
            weights: this.weights.toArray(),
            bias: this.bias.toArray()
        };
    }

    static fromJSON(json: any): NeuralNetworkLayer {
        const layer = new NeuralNetworkLayer(json.inputNodes, json.outputNodes, json.learningRate);
        layer.weights = matrix(json.weights);
        layer.bias = matrix(json.bias);
        return layer;
    }
}


export { NeuralNetworkLayer }