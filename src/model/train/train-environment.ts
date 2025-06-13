import { TrainerFactory, type TrainerType } from "./trainer-factory";
import { Trainer } from "./trainer";
import { ParallelTrainer } from "./parallel-trainer";

import { NeuralNetwork } from "../neural-network";

import { Game } from "@/game/game";




class TrainEnvironment {
    network: NeuralNetwork;
    game: Game;
    trainerType: TrainerType;
    explorationRate: number;

    trainer: Trainer;
    parallelTrainer: ParallelTrainer;


    onUpdate: (currentTrainTimes: number) => void = () => { };

    
    constructor(network: NeuralNetwork, game: Game, trainerType: TrainerType = '', explorationRate: number = 0.1) {
        this.network = network;
        this.game = game;
        this.trainerType = trainerType;
        this.explorationRate = explorationRate;

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
    async start(trainTimes: number, openParallel: boolean = false): Promise<void> {
        if (!openParallel) {
            await this.trainer.start(trainTimes, this.explorationRate);
            console.log('训练结束');
        } else {
            await this.parallelTrainer.start(trainTimes, this.trainerType, this.explorationRate);
        }
    }

}


export { TrainEnvironment }