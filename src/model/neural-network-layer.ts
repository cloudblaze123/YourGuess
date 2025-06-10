import {
    matrix,
    Matrix,
    multiply,
    divide,
    add,
    map,
    random,
    zeros,
    dotMultiply,
    transpose
} from 'mathjs';


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




    copy(): NeuralNetworkLayer {
        const newLayer = new NeuralNetworkLayer(this.inputNodes, this.outputNodes, this.learningRate);
        newLayer.weights = this.weights.clone();
        newLayer.bias = this.bias.clone();
        return newLayer;
    }




    /**
     * 计算将多个神经网络层的权重取平均后的结果
     * @param layers 需要取平均的多个神经网络层，每个层结构需相同
     * @returns 对所给多个神经网络层取平均后的新的神经网络层
     */
    static averageLayers(layers: NeuralNetworkLayer[]): NeuralNetworkLayer {
        const inputNodes = layers[0].inputNodes;
        const outputNodes = layers[layers.length - 1].outputNodes;
        const learningRate = layers[0].learningRate;

        let weights = zeros([outputNodes, inputNodes]);
        let bias = zeros([outputNodes, 1]);

        layers.forEach((layer) => {
            weights = add(weights, layer.weights);
            bias = add(bias, layer.bias);
        });

        const averageLayer = new NeuralNetworkLayer(inputNodes, outputNodes, learningRate);
        averageLayer.weights = divide(weights, layers.length) as Matrix;
        averageLayer.bias = divide(bias, layers.length) as Matrix;

        return averageLayer;
    }
}


export { NeuralNetworkLayer }