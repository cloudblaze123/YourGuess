import { NeuralNetwork } from "../neural-network/neural-network";

import { GameState } from "./game-state";
import { TrainData, TrainDataFactory } from "./train-data";
import { Game } from "@/game/game";

import { Logger } from "@/utils/logger";


const logger = new Logger('guesser-neural-network', false);



class GuesserNeuralNetwork {
    network: NeuralNetwork;
    explorationRate: number;

    constructor(network: NeuralNetwork, explorationRate: number = 0.5) {
        this.network = network;
        this.explorationRate = explorationRate;
    }

    isInputAffordable(gameState: GameState) {
        const inputLength = this.network.getInputLength();
        if (gameState.getEncodedState().length > inputLength) {
            return false;
        }
        return true;
    }

    // inputs 不够长的用 0 补齐，超长的截断靠近 0 索引的项
    _normalizeInputs(inputs: number[]): number[] {
        const inputLength = this.network.getInputLength();
        if (inputs.length < inputLength) {
            inputs = inputs.concat(Array(inputLength - inputs.length).fill(0));
        }
        if (inputs.length > inputLength) {
            inputs = inputs.slice(0, inputLength);
        }
        return inputs;
    }

    makeGuess(gameState: GameState): number {
        if (Math.random() <= this.explorationRate) {
            return this.makeRandomGuess(gameState);
        } else {
            return this.makeNetworkGuess(gameState);
        }
    }

    makeNetworkGuess(gameState: GameState): number {
        if (!this.isInputAffordable(gameState)){
            console.error("can't afford gameState", gameState);
            throw new Error("can't afford gameState");
        }
        const normalizedInputs = this._normalizeInputs(gameState.getEncodedState());
        
        const max = gameState.max;
        const min = gameState.min;
        const output = this.network.forward(normalizedInputs)[0];
        const guess = this._makeGuess(output, min, max);

        return guess;
    }

    makeRandomGuess(gameState: GameState): number {
        const max = gameState.max;
        const min = gameState.min;
        const guess = this._makeGuess(Math.random(), min, max);
        logger.log("random guess", guess);
        return guess;
    }


    // normalizedGuess 范围为 [0, 1]
    // 返回值范围为 [min, max]
    _makeGuess(normalizedGuess: number, min: number, max: number): number {
        const range = max - min + 1;
        const guess = Math.min(
            Math.floor(normalizedGuess * range + min), 
            max
        );
        return guess;
    }




    trainByGame(game: Game): void {
        const datas = TrainDataFactory.fromGame(game);
        this.train(datas);
    }


    train(datas: TrainData[]): void {
        for (const data of datas) {
            this._train(data);
        }
    }

    
    _train(trainData: TrainData): void {
        if (trainData.done) {
            return;
        }
        const inputs = this._normalizeInputs(trainData.state);
        const targets = [trainData.action];
        
        let reward = trainData.reward;


        // 奖励最大不超过1
        reward = Math.min(reward, 1);

        // 奖励为负数时，最小不小于 0.1 * 奖励
        reward = Math.max(reward, 0.1*reward);
        // 同时奖励为负数时，最小不小于一个小负数，防止过大的负奖励破坏训练
        reward = Math.max(reward, -0.01);

        
        // 奖励越高，学习率越大
        const newLearningRate = 0.1 * reward;

        // console.log("reward", reward);
        // console.log("newLearningRate", newLearningRate);

        // 调试日志
        logger.log("guess", trainData.originGuess);
        logger.log("reward", trainData.reward);
        logger.log("newLearningRate", newLearningRate);

        this.network.setLearningRate(newLearningRate);
        this.network.train(inputs, targets);
    }


    static encodeGameState(game:Game): GameState {
        return GameState.fromGame(game);
    }


    static generateTrainDataFromGame(game:Game){
        return TrainDataFactory.fromGame(game);
    }
}


export { GuesserNeuralNetwork }