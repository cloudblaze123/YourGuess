<template>
    <div>
        <div class="text-lg font-bold">
            胜率评估
        </div>

        <div class="space-x-2">
            <label for="sample-number">采样次数</label>
            <input type="number" min="1" step="1" id="sample-number" v-model="sampleNumber" />
            <button @click="startAssessment" class="btn btn-primary">开始评估</button>
        </div>

        <div v-if="!hasAssembled">
            暂无数据，请先开始评估
        </div>
        <div v-else>
            <div v-if="isEvaluating">
                <span>
                    正在评估中...
                </span>
            </div>
            <div v-else class="space-x-2">
                <span>
                    获胜次数: {{ winCount }}
                </span>
                <span>
                    胜率: {{ winRate.toFixed(2) }}%
                </span>
                <span>
                    平均步数：{{ averageRound }}
                </span>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

import { Agent } from '@/game/agent/agent';

import { Game } from '@/game/game';
import { GameEnvironment } from '@/game/game-environment';
import { HonestAgent } from '@/game/agent/honest-agent';


const sampleNumber = ref(10);

const hasAssembled = ref(false);

const winCount = ref(0);

const winRate = ref(-1);


const averageRound = ref(0);



const isEvaluating = ref(false);


const props = defineProps({
    attacker: {
        type: Agent,
        required: true
    },
    game: {
        type: Game,
        required: true
    }
})


async function startAssessment() {
    const attacker = props.attacker;

    if (!attacker) {
        alert('请先选择猜数者');
        return;
    }
    if (sampleNumber.value <= 0) {
        alert('请设置评估次数');
        return;
    }

    hasAssembled.value = true;


    let sampleNumber_ = sampleNumber.value;
    let winCount_ = 0;
    let round = 0;

    const game = props.game;
    const defender = new HonestAgent();
    const gameEnv = new GameEnvironment(game, attacker, defender);
    gameEnv.enableLog(false);

    isEvaluating.value = true;
    for (let i = 0; i < sampleNumber_; i++) {
        await gameEnv.start();
        if (gameEnv.getWinner() === attacker) {
            winCount_++;
        }
        round += gameEnv.getRounds();
    }
    isEvaluating.value = false;


    winCount.value = winCount_;
    winRate.value = winCount_ / sampleNumber_ * 100;
    averageRound.value = round / sampleNumber_;
}

</script>
  