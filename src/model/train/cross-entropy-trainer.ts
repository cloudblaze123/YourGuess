import { GuesserNeuralNetwork } from "@/model/guesser-neural-network/guesser-neural-network";
import { NeuralNetwork } from "../neural-network/neural-network";


import { GameEnvironment } from "@/game/game-environment";
import { Game } from "@/game/game";
import { ModelAgent } from "@/game/agent/model-agent";
import { HonestAgent } from "@/game/agent/honest-agent";
import { TrainData } from "../guesser-neural-network/train-data";
import { TrainDataFactory } from "../guesser-neural-network/train-data";

import { Trainer } from "./trainer";

import { FixedSizeQueue } from "@/utils/queue";

import { Random } from "@/utils/math";

type Episode = TrainData[];




class CrossEntropyTrainer extends Trainer {
    progress: number = 0;
    trainTimes: number = 0;
    explorationRate: number = 0;

    batchNumber: number = 4;
    batchSize: number = 25;
    percentile: number = 0.25;

    lastBatchRewardBuffer: FixedSizeQueue = new FixedSizeQueue(40);

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
    async start(trainTimes: number, explorationRate: number, batchNumber: number = 10, batchSize: number = 25, percentile: number = 0.25): Promise<void> {
        this.explorationRate = explorationRate;
        this.trainTimes = trainTimes;
        this.progress = 0;

        this.batchNumber = batchNumber;
        this.batchSize = batchSize;
        this.percentile = percentile;

        // 奖励缓存至少能容纳 batchNumber * 3 个批次的奖励
        this.lastBatchRewardBuffer = new FixedSizeQueue(3 * batchNumber);

        while (this.progress < this.trainTimes) {
            await this._start(batchNumber, batchSize, percentile);
        }
    }


    async _start(batchNumber: number = 4, batchSize: number = 25, percentile: number = 0.25): Promise<void> {
        // 生成训练片段批
        const batches = await this.generateEpisodeBatches(batchNumber, batchSize);

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


    async generateEpisodeBatches(batchNumber: number, batchSize: number): Promise<Episode[][]> {
        const batches: Episode[][] = [];
        const seed = Math.random();
        for (let i = 0; i < batchNumber; i++) {
            // 使用相同的随机种子生成游戏
            // 确保不同批次之间的游戏对象产生的目标数序列是相同的
            // 以保证公平
            batches.push(await this.generateEpisodeBatch(batchSize, seed));
        }
        return batches;
    }

    // 生成训练片段批
    async generateEpisodeBatch(batchSize: number, seed: number = Math.random()): Promise<Episode[]> {
        const episodes: Episode[] = [];

        const game = this.game;
        const random = new Random(seed);
        game.random = random.next.bind(random)

        const attacker = new ModelAgent(this.network, this.explorationRate);
        const defender = new HonestAgent();
        const environment = new GameEnvironment(game, attacker, defender);
        environment.enableLog(false);

        for (let i = 0; i < batchSize; i++) {
            await environment.start();
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
        const retentionSize = Math.max(Math.floor(episodeBatches.length * percentile), 1);

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

        // console.log("rewardEpisodeBatchPairsSorted", rewardEpisodeBatchPairsSorted)
        console.log("sorted rewards", rewardEpisodeBatchPairsSorted.map(pair => pair.reward.toFixed(3)))
        
        
        // 更新奖励缓存
        for (const {reward} of rewardEpisodeBatchPairs) {
            this.lastBatchRewardBuffer.enqueue(reward);
        }


        // 选取排位前 retentionSize 个片段批
        for (let i = 0; filteredEpisodeBatches.length < retentionSize; i++) {
            const {batch} = rewardEpisodeBatchPairsSorted[i];
            filteredEpisodeBatches.push(batch);
        }


        // 应用基线奖励
        filteredEpisodeBatches.forEach(episodeBatch => {
            this.applyBaselineToBatch(episodeBatch);
        });
        console.log("baseline", this.calBaseline().toFixed(3))


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


    getLastAverageBatchReward(): number {
        if (this.lastBatchRewardBuffer.isEmpty()) {
            return 0;
        }
        let totalReward = 0;
        for (const reward of this.lastBatchRewardBuffer.queue) {
            totalReward += reward;
        }
        const averageReward = totalReward / this.lastBatchRewardBuffer.queue.length;
        return averageReward;
    }


    calBaseline() {
        return this.getLastAverageBatchReward() / this.batchSize;
    }

    applyBaselineToBatch(episodeBatch: Episode[]): void {
        const stepBaseline = this.calBaseline();
        for (const episode of episodeBatch) {
            this.applyBaseline(episode, stepBaseline);
        }
    }

    applyBaseline(episode: Episode, baseline: number): void {
        for (const data of episode) {
            // console.log('data.reward', data.reward)
            // console.log('after baseline', data.reward - baseline)
            data.reward -= baseline;
        }
    }
}


export { CrossEntropyTrainer }