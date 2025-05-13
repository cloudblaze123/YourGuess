import { matrix, Matrix, multiply, add, subtract, map, random, dotMultiply, transpose } from 'mathjs';


// 定义激活函数及其导数
function sigmoid(x: Matrix): Matrix {
    return map(x, (value) => 1 / (1 + Math.exp(-value)));
}

function sigmoidDerivative(x: Matrix): Matrix {
    return map(x, (value) => value * (1 - value));
}

class NeuralNetwork {
    inputNodes: number;
    hiddenNodes: number;
    outputNodes: number;
    learningRate: number;

    weightsInputHidden: Matrix;
    weightsHiddenOutput: Matrix;
    biasInputHidden: Matrix;
    biasHiddenOutput: Matrix;

    constructor(inputNodes: number, hiddenNodes: number, outputNodes: number, learningRate: number = 0.1) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;
        this.learningRate = learningRate;

        // 初始化权重和偏置
        this.weightsInputHidden = matrix(random([hiddenNodes, inputNodes]));
        this.weightsHiddenOutput = matrix(random([outputNodes, hiddenNodes]));
        this.biasInputHidden = matrix(random([hiddenNodes, 1]));
        this.biasHiddenOutput = matrix(random([outputNodes, 1]));
    }

    // 前向传播
    forward(inputs: number[]): Matrix {
        // const inputArray = matrix(inputs);
        // // 计算隐藏层的输入
        // const hiddenInputs = add(dotMultiply(this.weightsInputHidden, transpose(inputArray)), transpose(this.biasInputHidden));
        // // 计算隐藏层的输出
        // const hiddenOutputs = sigmoid(hiddenInputs);
        // // 计算输出层的输入
        // const finalInputs = add(dotMultiply(this.weightsHiddenOutput, hiddenOutputs), this.biasHiddenOutput);
        // // 计算输出层的输出
        // const finalOutputs = sigmoid(finalInputs);


        const inputArray = transpose(matrix([inputs]));

        const hiddenInputs = add(multiply(this.weightsInputHidden, inputArray), this.biasInputHidden);
        const hiddenOutputs = sigmoid(hiddenInputs);

        const finalInputs = add(multiply(this.weightsHiddenOutput, hiddenOutputs), this.biasHiddenOutput);
        const finalOutputs = sigmoid(finalInputs);

        return finalOutputs;
    }

    // 反向传播和训练
    train(inputs: number[], targets: number[]): void {
        const inputArray = transpose(matrix([inputs]));
        const targetArray = transpose(matrix([targets]));

        // console.log(inputArray.size())
        // console.log(multiply(this.weightsInputHidden, inputArray).size())
        const hiddenInputs = add(multiply(this.weightsInputHidden, inputArray), this.biasInputHidden);
        const hiddenOutputs = sigmoid(hiddenInputs);
        // console.log('hiddenOutputs.size()')
        // console.log(hiddenOutputs.size())
        // console.log('this.weightsHiddenOutput.size()')
        // console.log(this.weightsHiddenOutput.size())
        const finalInputs = add(multiply(this.weightsHiddenOutput, hiddenOutputs), this.biasHiddenOutput);
        const finalOutputs = sigmoid(finalInputs);
        // console.log(finalOutputs.size())
        
        // 计算输出层的误差
        const outputErrors = subtract(targetArray, finalOutputs);

        // 计算隐藏层的误差
        const hiddenErrors = multiply(transpose(this.weightsHiddenOutput), outputErrors);

        // console.log('this.weightsInputHidden')
        // console.log(this.weightsInputHidden.size())

        // console.log('this.biasHiddenOutput')
        // console.log(this.biasHiddenOutput.size())

        // 更新隐藏层到输出层的权重
        const gradientOutput = dotMultiply(sigmoidDerivative(finalOutputs), outputErrors);
        const gradientOutputScaled = multiply(gradientOutput, this.learningRate);
        // console.log(gradientOutputScaled.size())
        // console.log(transpose(hiddenOutputs).size())
        this.weightsHiddenOutput = add(this.weightsHiddenOutput, dotMultiply(gradientOutputScaled, transpose(hiddenOutputs)));
        this.biasHiddenOutput = add(this.biasHiddenOutput, multiply(gradientOutputScaled, 1));

        // console.log('this.biasHiddenOutput')
        // console.log(this.biasHiddenOutput.size())


        // 更新输入层到隐藏层的权重
        const gradientHidden = dotMultiply(sigmoidDerivative(hiddenOutputs), hiddenErrors);
        const gradientHiddenScaled = multiply(gradientHidden, this.learningRate);
        this.weightsInputHidden = add(this.weightsInputHidden, dotMultiply(gradientHiddenScaled, transpose(inputArray)));
        this.biasInputHidden = add(this.biasInputHidden, multiply(gradientHiddenScaled, 1));

        // console.log('this.weightsInputHidden')
        // console.log(this.weightsInputHidden.size())
        // console.log('ddddddddddddddddddd')
    }
}

// 示例数据
const input = [0.9, 0.1, 0.8];
const target = [1, 0];

// 创建神经网络实例
const nn = new NeuralNetwork(3, 4, 2);

// 训练神经网络
for (let i = 0; i < 1000; i++) {
    nn.train(input, target);
}

// 前向传播测试
const output = nn.forward(input);
console.log(output.valueOf());
