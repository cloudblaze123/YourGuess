import {
    matrix,
    Matrix,
    multiply,
    divide,
    add,
    random,
    zeros,
    dotMultiply,
    transpose
} from 'mathjs';


import { type ActivationType, Activation } from './activation';




// 定义神经网络层
class NeuralNetworkLayer {
    inputNodes: number;
    outputNodes: number;
    learningRate: number;

    weights: Matrix;
    bias: Matrix;

    activation: Activation;

    constructor(inputNodes: number, outputNodes: number, learningRate: number = 0.1, activationOption: ActivationType = 'sigmoid') {
        this.inputNodes = inputNodes;
        this.outputNodes = outputNodes;
        this.learningRate = learningRate;

        // 初始化权重和偏置
        this.weights = matrix(random([outputNodes, inputNodes]));
        this.bias = matrix(random([outputNodes, 1]));

        this.activation = Activation.get(activationOption);
    }

    // 前向传播
    forward(inputs: Matrix): Matrix {
        const outputs = add(multiply(this.weights, inputs), this.bias);
        const outputsActivated = this.activation.activate(outputs);
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
        const gradientOutput = dotMultiply(this.activation.derivative(outputs), errors);
        const deltaWeights = multiply(gradientOutput, transpose(inputs));
        const deltaWeightsScaled = multiply(deltaWeights, this.learningRate);
        
        // 更新权重
        this.weights = add(this.weights, deltaWeightsScaled);


        // 计算偏置更新量
        const gradientBias = gradientOutput;
        const deltaBias = dotMultiply(gradientBias, 1);
        const deltaBiasScaled = multiply(deltaBias, this.learningRate);

        // 更新偏置
        this.bias = add(this.bias, dotMultiply(deltaBiasScaled, 1));
    }


    toJSON(): object {
        return {
            inputNodes: this.inputNodes,
            outputNodes: this.outputNodes,
            learningRate: this.learningRate,
            weights: this.weights.toArray(),
            bias: this.bias.toArray(),
            activation: this.activation.toJSON(),
        };
    }

    static fromJSON(json: any): NeuralNetworkLayer {
        const layer = new NeuralNetworkLayer(json.inputNodes, json.outputNodes, json.learningRate);
        layer.weights = matrix(json.weights);
        layer.bias = matrix(json.bias);
        layer.activation = Activation.fromJSON(json.activation);
        return layer;
    }




    copy(): NeuralNetworkLayer {
        const newLayer = new NeuralNetworkLayer(this.inputNodes, this.outputNodes, this.learningRate);
        newLayer.weights = this.weights.clone();
        newLayer.bias = this.bias.clone();
        newLayer.activation = this.activation.copy();
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