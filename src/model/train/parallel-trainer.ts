import { TrainerWorkerProvider } from "./trainer-worker-provider";

import { NeuralNetwork } from "../neural-network/neural-network";
import { Game } from "@/game/game";



class ParallelTrainer {
    network: NeuralNetwork;
    game: Game;

    networksTrained: NeuralNetwork[] = [];

    onUpdate: (currentTrainTimes: number) => void = () => { };


    _startPromiseResolve: () => void = () => { };


    constructor(network: NeuralNetwork, game: Game) {
        this.network = network;
        this.game = game;
    }




    start(trainTimes: number, trainerName: string, explorationRate: number): Promise<void> {
        // 并行训练数
        const batchSize = 4;
        const trainTimesPerBatch = Math.ceil(trainTimes / batchSize);


        const workerProvider = new TrainerWorkerProvider();

        workerProvider.onFinished = (trainedNetwork) => {
            this.networksTrained.push(trainedNetwork);
            this.onUpdate(trainTimesPerBatch * this.networksTrained.length);
        }

        workerProvider.onAllFinished = () => {
            const averageNetwork = NeuralNetwork.averageNetworks(this.networksTrained);
            this.network.setBy(averageNetwork)
            console.log("all Training finished");
            this._startPromiseResolve();
        }


        for (let i = 0; i < batchSize; i++) {
            workerProvider.create(this.network, this.game, trainTimesPerBatch, trainerName, explorationRate);
            
            trainTimes -= trainTimesPerBatch;
            if (trainTimes <= 0) {
                // 如果训练次数已分配完毕，则提前结束分配
                // 发生在训练次数比并行训练数还少时的情况
                break;
            }
        }


        return new Promise(resolve => {
            this._startPromiseResolve = resolve;
        });
    }

}


export { ParallelTrainer }