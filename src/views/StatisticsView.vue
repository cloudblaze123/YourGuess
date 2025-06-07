<template>
    <div>统计页面</div>
    <form @submit.prevent="handleAgentSelect">
        <select name="select" v-model="selectedOption" class="dark:bg-base-100 dark:text-white">
            <option v-for="value, key in items" :value="key">{{ key }}</option>
        </select>
        <button type="submit" class="btn btn-primary">确认</button>
    </form>
    <GraphGameEnvironment :attacker="attacker" :defender="defender" />
    <GameRecordPlayer :record="record" />
</template>


<script setup lang="ts">
import { ref } from 'vue'

import GraphGameEnvironment from '@/components/static/GraphGameEnvironment.vue';


import GameRecordPlayer from '@/components/static/GameRecordPlayer.vue';

import { Game } from '@/game/game';
import { GameEnvironment } from '@/game/game-environment';
import { GameRecord } from '@/game/game-record';

const game = new Game();
const gameEnv = new GameEnvironment(game, new RandomAgent(), new HonestAgent());
// gameEnv.start();
const record = ref(GameRecord.readFromGame(game));




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
