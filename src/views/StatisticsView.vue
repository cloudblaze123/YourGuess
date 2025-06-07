<template>
    <div>统计页面</div>
    <form @submit.prevent="handleAgentSelect">
        <select name="select" v-model="selectedOption" class="dark:bg-base-100 dark:text-white">
            <option v-for="value, key in items" :value="key">{{ key }}</option>
        </select>
        <button type="submit" class="btn btn-primary">确认</button>
    </form>

    <div class="flex flex-col">
        <div class="text-xl">Setting</div>
        <form @submit.prevent="updateSetting">
            <div class="flex mt-2">
                <label for="min">Min:</label>
                <input type="number" v-model="min">
                <label for="max">Max:</label>
                <input type="number" v-model="max">
            </div>
            <button class="btn btn-primary mt-2">Confirm</button>
        </form>
    </div>

    <GraphGameEnvironment ref="graphGameEnvironmentRef" :attacker="attacker" :defender="defender" />
</template>


<script setup lang="ts">
import { ref } from 'vue'

import GraphGameEnvironment from '@/components/static/GraphGameEnvironment.vue';



const graphGameEnvironmentRef = ref<InstanceType<typeof GraphGameEnvironment> | null>(null);
const max = ref(100);
const min = ref(1);


function updateSetting() {
    graphGameEnvironmentRef.value?.setupGame(min.value, max.value)
}




import { Agent } from '@/game/agent/agent';
import { RandomAgent } from '@/game/agent/random-agent';
import { SkipGuessedRandomAgent } from '@/game/agent/skip-guessed-random-agent';
import { GradualIncreaseAgent } from '@/game/agent/gradual-increase-agent';
import { GradualDecreaseAgent } from '@/game/agent/gradual-decrease-agent';
import { ModelAgent } from '@/game/agent/model-agent';
import { HonestAgent } from '@/game/agent/honest-agent';


const items = ref<Record<string, Agent>>({
    RandomAgent: new RandomAgent(),
    SkipGuessedRandomAgent: new SkipGuessedRandomAgent(),
    GradualIncreaseAgent: new GradualIncreaseAgent(),
    GradualDecreaseAgent: new GradualDecreaseAgent(),
    ModelAgent: new ModelAgent(null),
})
const selectedOption = ref('RandomAgent')


const attacker = ref<Agent>(items.value[selectedOption.value]);
const defender = new HonestAgent();


function handleAgentSelect() {
    attacker.value = items.value[selectedOption.value];
}

</script>
