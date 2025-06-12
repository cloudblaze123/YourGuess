import { NeuralNetwork } from "../neural-network";

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
        if (Math.random() < this.explorationRate) {
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
        const guess = Math.round(output * (max - min) + min);

        return guess;
    }

    makeRandomGuess(gameState: GameState): number {
        const max = gameState.max;
        const min = gameState.min;
        const guess = Math.round(Math.random() * (max - min) + min);
        logger.log("random guess", guess);
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
        
        const reward = trainData.reward;
        // 奖励越高，学习率越大
        const newLearningRate = 0.2 * Math.min(Math.exp(reward), 1);

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