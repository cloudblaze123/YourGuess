<template>
    <div class="space-y-8">
        <div>统计页面</div>
        
        <div class="space-x-2">
            <label class="text-md">猜数代理</label>
            <select name="select" v-model="selectedOption" @change="handleAgentSelect" class="dark:bg-base-100 dark:text-white">
                <option v-for="value, key in items" :value="key">{{ key }}</option>
            </select>
        </div>

        <div v-if="selectedOption === 'ModelAgent'">
            当前模型：{{ currentModelName }}
            <div>模型列表</div>
            <ModelList @selectModel="handleModelSelect" />
        </div>

        <div class="collapse collapse-arrow">
            <input type="checkbox" checked />
            <div class="collapse-title font-semibold">Setting</div>
            <div class="collapse-content text-sm">
                <GameSetting :game="game" @settingUpdated="updateSetting" />
            </div>
        </div>

        <WinRateAssessment :attacker="attacker" :game="game" />
        <GraphGameEnvironment ref="graphGameEnvironmentRef" :attacker="attacker" :defender="defender" :default-game-options="game.getOptions()"/>

    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

import ModelList from '@/components/model/ModelList.vue';

import GameSetting from '@/components/game/GameSetting.vue';
import WinRateAssessment from '@/components/static/WinRateAssessment.vue';
import GraphGameEnvironment from '@/components/static/GraphGameEnvironment.vue';


import { useModelStore } from '@/stores/model'
const modelStore = useModelStore()

const currentModelName = ref('')

function handleModelSelect(modelName: string) {
    const model = modelStore.getModel(modelName)
    if (model) {
        attacker.value = new ModelAgent(model, 0)
        currentModelName.value = modelName
    } else {
        alert('Model not found')
    }
}





const graphGameEnvironmentRef = ref<InstanceType<typeof GraphGameEnvironment> | null>(null);


import { Game } from '@/game/game';
const game = ref(new Game());
game.value.min = 1;
game.value.max = 20;


import { type GameOptions } from '@/game/game';
function updateSetting(newOptions: GameOptions) {
    graphGameEnvironmentRef.value?.setupGame(newOptions.min!, newOptions.max!)
    game.value.setOptions(newOptions)
}




import { Agent } from '@/game/agent/agent';
import { RandomAgent } from '@/game/agent/random-agent';
import { SkipGuessedRandomAgent } from '@/game/agent/skip-guessed-random-agent';
import { GradualIncreaseAgent } from '@/game/agent/gradual-increase-agent';
import { GradualDecreaseAgent } from '@/game/agent/gradual-decrease-agent';
import { BinaryStrategyAgent } from '@/game/agent/binary-strategy-agent';
import { ModelAgent } from '@/game/agent/model-agent';
import { HonestAgent } from '@/game/agent/honest-agent';


const items = ref<Record<string, Agent>>({
    RandomAgent: new RandomAgent(),
    SkipGuessedRandomAgent: new SkipGuessedRandomAgent(),
    GradualIncreaseAgent: new GradualIncreaseAgent(),
    GradualDecreaseAgent: new GradualDecreaseAgent(),
    BinaryStrategyAgent: new BinaryStrategyAgent(),
    ModelAgent: new ModelAgent(null),
})
const selectedOption = ref('RandomAgent')


const attacker = ref<Agent>(items.value[selectedOption.value]);
const defender = new HonestAgent();


function handleAgentSelect() {
    attacker.value = items.value[selectedOption.value];
    currentModelName.value = '';
}

</script>
