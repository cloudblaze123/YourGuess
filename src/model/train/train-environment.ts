import { TrainerFactory, type TrainerType } from "./trainer-factory";
import { Trainer } from "./trainer";
import { ParallelTrainer } from "./parallel-trainer";

import { NeuralNetwork } from "../neural-network";

import { Game } from "@/game/game";




class TrainEnvironment {
    network: NeuralNetwork;
    game: Game;
    trainer: Trainer;
    parallelTrainer: ParallelTrainer;


    onUpdate: (currentTrainTimes: number) => void = () => { };

    
    constructor(network: NeuralNetwork, game: Game, trainerType: TrainerType = '') {
        this.network = network;
        this.game = game;

        this.trainer = TrainerFactory.create(network, game, trainerType);
        this.trainer.onUpdate = (currentTrainTimes) => {
            this.onUpdate(currentTrainTimes);
        }

        this.parallelTrainer = new ParallelTrainer(network, game);
        this.parallelTrainer.onUpdate = (currentTrainTimes) => {
            this.onUpdate(currentTrainTimes);
        }
    }


    /**
     * 开始训练
     * @param trainTimes 训练次数
     * @param trainerName 训练器名称
     * @param openParallel 是否开启并行训练
     */
    async start(trainTimes: number, trainerName: TrainerType = '', openParallel: boolean = false): Promise<void> {
        if (!openParallel) {
            await this.trainer.start(trainTimes);
        } else {
            await this.parallelTrainer.start(trainTimes, trainerName);
        }
    }

}


export { TrainEnvironment }