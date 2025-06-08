<template>
    <!-- <div class="text-lg font-bold">训练模型</div> -->

    <div class="mt-4 lg:flex lg:space-x-2">
        <div class="flex flex-col lg:w-52">
            <div>
                当前模型：<span class="outline w-fit p-1 rounded-sm">{{ modelName }}</span>
            </div>
            
            <div class="collapse collapse-arrow">
                <input type="checkbox" checked/>
                <div class="collapse-title font-semibold">模型列表</div>
                <div class="collapse-content text-sm">
                    <ModelList @select-model="onModelSelected" />
                </div>
            </div>
        </div>


        <div class="lg:w-52">
            <div class="flex flex-col">
                <div>训练次数</div>
                <input type="number" v-model="trainTimesRef">
                <button @click="train" class="btn btn-primary">开始训练</button>
                <div class="mt-4">
                    <label>
                        <input type="checkbox" v-model="showChart" />
                        显示猜数过程图表
                    </label>
                </div>
            </div>

            <div v-if="isTraining">训练进度 {{ trainProgress }} / {{ trainTimesRef }}</div>
        </div>


        <div class="lg:w-0 lg:flex-1">
            <div v-if="showChart">
                <div>Target {{ targetNumber }}</div>

                <GameRecordPlayer ref="gameRecordPlayerRef" />
            </div>

            <div>
                <div>模型结构</div>
                <ModelGraphViewer ref="modelGraphViewerRef" />
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import ModelList from '../model/ModelList.vue';
import GameRecordPlayer from '../static/GameRecordPlayer.vue';


import ModelGraphViewer from '@/components/model/ModelGraphViewer.vue'
const modelGraphViewerRef = ref<InstanceType<typeof ModelGraphViewer> | null>(null)


const modelName = ref('');

import { useModelStore } from '@/stores/model';
const modelStore = useModelStore();

function onModelSelected(propModelName: string) {
    modelName.value = propModelName
    model = modelStore.getModel(propModelName)
    modelGraphViewerRef.value!.updateChart(model);
}




import { NeuralNetwork } from '@/model/neural-network';
let model: NeuralNetwork


const trainTimesRef = ref(1);

const gameRecordPlayerRef = ref<typeof GameRecordPlayer | null>(null);

const showChart = ref(false);

const isTraining = ref(false);
const trainProgress = ref(-1);
const targetNumber = ref(-1);


import { Game } from '@/game/game'
import { ModelAgent } from '@/game/agent/model-agent';
import { HonestAgent } from '@/game/agent/honest-agent';
import { GameEnvironment } from '@/game/game-environment';

import { GuesserNeuralNetwork } from '@/model/guesser-neural-network';
import { GameRecord } from '@/game/game-record';

import { sleep } from '@/utils/common';
async function train() {
    if (!model) {
        alert('请先选择模型')
        return
    }

    const trainTimes = trainTimesRef.value;
    const guesserNetwork = new GuesserNeuralNetwork(model);

    const game = new Game();
    game.max = 20;
    game.min = 1;
    const attacker = new ModelAgent(model);
    const defender = new HonestAgent();
    const environment = new GameEnvironment(game, attacker, defender);

    isTraining.value = true;
    for (let i = 0; i < trainTimes; i++) {
        await sleep(1) // 需要增加一点延迟，视图才会正常更新，原因未明了

        await environment.start();

        // 每达到1%的训练进度，更新一次视图
        if (i % Math.round(trainTimes / 100 + 1) === 0) {
            trainProgress.value = i;

            if (showChart.value) {
                const record = GameRecord.generateFromGame(game);
                gameRecordPlayerRef.value?.play(record);
                targetNumber.value = game.target;
            }
        }

        guesserNetwork.trainByGame(game);
    }
    isTraining.value = false;

    if (showChart.value) {
        const record = GameRecord.generateFromGame(game);
        gameRecordPlayerRef.value?.play(record);
        targetNumber.value = game.target;
    }
}

</script>
