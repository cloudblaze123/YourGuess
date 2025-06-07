<template>
    <div class="text-lg font-bold">训练模型</div>

    <div>
        <div>选择要训练的模型</div>
        <ModelList @select-model="onModelSelected" />
    </div>

    <div class="flex flex-col mt-8">
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

    <GameRecordPlayer ref="gameRecordPlayerRef" />
</template>


<script setup lang="ts">
import { ref } from 'vue'
import ModelList from '../model/ModelList.vue';
import GameRecordPlayer from '../static/GameRecordPlayer.vue';


import { useModelStore } from '@/stores/model';
const modelStore = useModelStore();
function onModelSelected(modelName: string){
    model = modelStore.getModel(modelName)
}




import { NeuralNetwork } from '@/model/neural-network';
let model:NeuralNetwork


const trainTimesRef = ref(1);

const gameRecordPlayerRef = ref<typeof GameRecordPlayer | null>(null);

const showChart = ref(false);



import { Game } from '@/game/game'
import { ModelAgent } from '@/game/agent/model-agent';
import { HonestAgent } from '@/game/agent/honest-agent';
import { GameEnvironment } from '@/game/game-environment';

import { GuesserNeuralNetwork } from '@/model/guesser-neural-network';
import { GameRecord } from '@/game/game-record';
async function train() {
    if(!model){
        alert('请先选择模型')
        return
    }
    
    const trainTimes = trainTimesRef.value;
    const guesserNetwork = new GuesserNeuralNetwork(model);

    for (let i = 0; i < trainTimes; i++) {
        const game = new Game();
        const attacker = new ModelAgent(model);
        const defender = new HonestAgent();
        const environment = new GameEnvironment(game, attacker, defender);
        await environment.start();

        if (showChart.value) {
            const record = GameRecord.generateFromGame(game);
            gameRecordPlayerRef.value?.play(record);
        }

        guesserNetwork.trainByGame(game);
    }
}

</script>
