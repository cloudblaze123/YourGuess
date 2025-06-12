import { GuesserNeuralNetwork } from "@/model/guesser-neural-network/guesser-neural-network";
import { NeuralNetwork } from "../neural-network";


import { GameEnvironment } from "@/game/game-environment";
import { Game } from "@/game/game";
import { ModelAgent } from "@/game/agent/model-agent";
import { HonestAgent } from "@/game/agent/honest-agent";
import { TrainData } from "../guesser-neural-network/train-data";
import { TrainDataFactory } from "../guesser-neural-network/train-data";

import { Trainer } from "./trainer";


type Episode = TrainData[];




class CrossEntropyTrainer extends Trainer {
    progress: number = 0;
    trainTimes: number = 0;

    constructor(network: NeuralNetwork, game: Game) {
        super(network, game);
    }


    /**
     * 
     * @param trainTimes 训练次数
     * @param batchNumber 分批数
     * @param batchSize 批大小
     * @param percentile 保留百分比
     */
    async start(trainTimes: number, batchNumber: number = 4, batchSize: number = 20, percentile: number = 0.5): Promise<void> {
        this.trainTimes = trainTimes;
        this.progress = 0;

        // 生成训练片段批
        const batches = this.generateEpisodeBatches(batchNumber, batchSize);

        // 选取精英片段批
        const filteredEpisodeBatches = this.filterEpisodeBatches(batches, percentile);

        // 使用精英片段批训练
        for (const episodeBatch of filteredEpisodeBatches) {
            if (this.progress >= this.trainTimes) {
                break;
            }
            this.trainByEpisodeBatch(episodeBatch);
        }
    }


    trainByEpisodeBatch(Batch: Episode[]): void {
        const guesserNetwork = new GuesserNeuralNetwork(this.network);
        for (const episode of Batch) {
            if (this.progress >= this.trainTimes) {
                break;
            }

            guesserNetwork.train(episode);

            this.onUpdate(++this.progress);
        }
    }


    generateEpisodeBatches(batchNumber: number, batchSize: number): Episode[][] {
        const batches: Episode[][] = [];
        for (let i = 0; i < batchNumber; i++) {
            batches.push(this.generateEpisodeBatch(batchSize));
        }
        return batches;
    }

    // 生成训练片段批
    generateEpisodeBatch(batchSize: number): Episode[] {
        const episodes: Episode[] = [];

        const game = this.game;
        const attacker = new ModelAgent(this.network);
        const defender = new HonestAgent();
        const environment = new GameEnvironment(game, attacker, defender);
        environment.enableLog(false);

        for (let i = 0; i < batchSize; i++) {
            environment.start();
            const episode = TrainDataFactory.fromGame(game);
            episodes.push(episode);
        }

        return episodes;
    }




    /**
     * 过滤训练片段批
     * @param episodeBatches 要过滤的片段批
     * @param percentile 保留的片段排位百分比（使用小数表示）
     * @returns 
     */
    filterEpisodeBatches(episodeBatches: Episode[][], percentile: number): Episode[][] {
        if (percentile < 0 || percentile > 1) {
            throw new Error("Percentile must be between 0 and 1");
        }
        
        const filteredEpisodeBatches: Episode[][] = [];
        const retentionSize = Math.floor(episodeBatches.length * percentile);

        const rewardEpisodeBatchPairs = episodeBatches.map(
            (episodeBatch) => {
                const reward = this.calEpisodeBatchReward(episodeBatch);
                return {
                    reward: reward,
                    batch: episodeBatch
                };
            }
        );
        // 按片段奖励排序，从高到低
        const rewardEpisodeBatchPairsSorted = rewardEpisodeBatchPairs.sort((a, b) => {
            return b.reward - a.reward;
        });        

        for (let i = 0; filteredEpisodeBatches.length < retentionSize; i++) {
            const {batch} = rewardEpisodeBatchPairsSorted[i];
            filteredEpisodeBatches.push(batch);
        }

        return filteredEpisodeBatches;
    }




    // 计算片段批总奖励
    calEpisodeBatchReward(episodeBatch: Episode[]): number {
        let totalReward = 0;
        for (const episode of episodeBatch) {
            totalReward += this.calEpisodeReward(episode);
        }
        return totalReward;
    }


    // 计算片段奖励
    calEpisodeReward(episode: Episode): number {
        return episode[0].reward;
    }

}


export { CrossEntropyTrainer }