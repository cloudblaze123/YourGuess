<template>
    <div>统计页面</div>
    <GraphGameEnvironment :attacker="attacker" :defender="defender" />
</template>


<script setup lang="ts">
import GraphGameEnvironment from '@/components/GraphGameEnvironment.vue';

import { SkipGuessedRandomAgent } from '@/game/agent/skip-guessed-random-agent';
import { HonestAgent } from '@/game/agent/honest-agent';


const attacker = new SkipGuessedRandomAgent();
const defender = new HonestAgent();

</script>
