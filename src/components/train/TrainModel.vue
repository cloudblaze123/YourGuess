<template>
    <!-- <div class="text-lg font-bold">训练模型</div> -->

    <div class="mt-4 lg:flex lg:space-x-2">
        <div class="flex flex-col lg:w-52">
            <div>
                当前模型：<span v-if="modelName" class="outline w-fit p-1 rounded-sm">{{ modelName }}</span>
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
            <div class="flex flex-col space-y-2">
                <MiniGameSetting :game="game" @setting-updated="onSettingUpdated" />

                <div class="flex flex-col">
                    <div>探索率</div>
                    <input type="number" min="0" max="1" step="0.01" v-model="explorationRate">
                </div>

                <div class="flex flex-col">
                    <div>训练次数</div>
                    <input type="number" v-model="trainTimesRef">
                </div>

                <div class="flex flex-col mt-2">
                    <label class="cursor-pointer">
                        <input type="checkbox" v-model="isUsingCrossEntropy" class="toggle"/>
                        使用交叉熵算法
                    </label>
                </div>

                <button @click="train" class="btn btn-primary mt-4">开始训练</button>
                <div class="mt-4 space-y-4">
                    <div>
                        <label class="cursor-pointer">
                            <input type="checkbox" v-model="showChart" class="toggle"/>
                            显示猜数过程图表
                        </label>
                    </div>
                    <div>
                        <label class="cursor-pointer">
                            <input type="checkbox" v-model="isEnableParrallel" class="toggle"/>
                            开启并行训练
                        </label>
                    </div>
                </div>
            </div>

            <div v-if="isTraining">训练进度 {{ trainProgress }} / {{ trainTimesRef }}</div>
            <div>训练用时 {{ trainingTime }} 秒</div>
        </div>


        <div class="lg:w-0 lg:flex-1">
            <div v-show="modelName">
                <div v-if="showChart">
                    <div>Target {{ targetNumber }}</div>
    
                    <GameRecordPlayer ref="gameRecordPlayerRef" />
                </div>
    
                <div>
                    <div>模型结构</div>
                    <ModelGraphViewer ref="modelGraphViewerRef" />
                </div>
            </div>
            <div v-show="!modelName" class="text-lg">请先选择模型</div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import ModelList from '../model/ModelList.vue';

import MiniGameSetting from '@/components/train/MiniGameSetting.vue';
import GameRecordPlayer from '../static/GameRecordPlayer.vue';


import ModelGraphViewer from '@/components/model/ModelGraphViewer.vue'
const modelGraphViewerRef = ref<InstanceType<typeof ModelGraphViewer> | null>(null)


const modelName = ref('');

import { useModelStore } from '@/stores/model';
const modelStore = useModelStore();

function onModelSelected(propModelName: string) {
    modelName.value = propModelName
    model = modelStore.getModel(propModelName)
    updateModelChart()
}




const game = new Game();
game.max = 20;
game.min = 1;

import { type GameOptions } from '@/game/game';
function onSettingUpdated(newOptions: GameOptions) {
    game.setOptions(newOptions)
}





function updateModelChart() {
    modelGraphViewerRef.value!.updateChart(model);
}


function updateGuessChart(game:Game) {
    const record = GameRecord.generateFromGame(game);
    gameRecordPlayerRef.value?.play(record);
    targetNumber.value = game.target;
}


import { NeuralNetwork } from '@/model/neural-network/neural-network';
let model: NeuralNetwork

const explorationRate = ref(0.1);
const trainTimesRef = ref(1);
const isUsingCrossEntropy = ref(true);

const gameRecordPlayerRef = ref<typeof GameRecordPlayer | null>(null);

const showChart = ref(false);

const isTraining = ref(false);
const trainProgress = ref(-1);
const targetNumber = ref(-1);


import { Game } from '@/game/game'
import { TrainEnvironment } from '@/model/train/train-environment';

import { GameRecord } from '@/game/game-record';


const isEnableParrallel = ref(true);

const trainingTime = ref(0);


async function train() {
    if (!model) {
        alert('请先选择模型')
        return
    }
    // const modelCopy = model.copy();

    const trainTimes = trainTimesRef.value;
    const startTime = new Date().getTime();
    


    let trainerType: '' | 'cross-entropy' = '';
    if (isUsingCrossEntropy.value) {
        console.log('using cross-entropy algorithm');
        trainerType = 'cross-entropy';
    }
    const trainEnv = new TrainEnvironment(model, game, trainerType, explorationRate.value);
    
    trainEnv.onUpdate = (currentTrainTimes: number) => {
        trainProgress.value = currentTrainTimes;
        
        if (showChart.value) {
            const chartUpdateInterval = 100;
            if (currentTrainTimes % chartUpdateInterval === 0) {
                updateGuessChart(game);
            }
        }
    }
    

    trainProgress.value = 0;

    // 训练开始
    isTraining.value = true;
    await trainEnv.start(trainTimes, isEnableParrallel.value);
    isTraining.value = false;


    const endTime = new Date().getTime();
    trainingTime.value = (endTime - startTime) / 1000;

    
    // 打印模型权重变化，用于检查并行训练功能是否正常
    // const modelWeight0Array = model.layers[0].weights.toArray() as number[][];
    // const modelCopyWeight0Array = modelCopy.layers[0].weights.toArray() as number[][];
    // for (let i = 0; i < modelWeight0Array.length; i++) {
    //     for (let j = 0; j < modelWeight0Array[i].length; j++) {
    //         if (modelWeight0Array[i][j] !== modelCopyWeight0Array[i][j]) {
    //             console.log('model weight changed', i, j, modelWeight0Array[i][j] - modelCopyWeight0Array[i][j])
    //         }
    //     }
    // }


    if (showChart.value) {
        updateGuessChart(game);
    }

    updateModelChart()
}

</script>
