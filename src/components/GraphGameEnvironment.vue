<template>
    <div class="flex flex-col">
        <h1>Graph Game Environment</h1>
        <button class="btn btn-primary mb-4" @click="resetGame">重置游戏</button>
        <div>target: {{ target }}</div>
        
        <GuessChartInput :guesses="guessHistory" :results="resultHistory" :game-instance="game" />

    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

import GuessChartInput from '@/components/GuessChartInput.vue'

import { Result } from '@/game/game'
import { Game } from '@/game/game'

import { Agent } from '@/game/agent/agent'


const props = defineProps({
    attacker: {
        type: Agent,
        required: true
    },
    defender: {
        type: Agent,
        required: true
    }
})




const game = new Game()


const target = ref<number>(game.target)

const guess = ref<number>(0)

const result = ref(Result.CORRECT)


const guessHistory = ref<number[]>([])
const resultHistory = ref<Result[]>([])




import { GameEnvironment } from '@/game/game-environment';




game.onUpdate = () => {
    guess.value = game.history[game.history.length - 1].guess
    result.value = game.history[game.history.length - 1].result
    
    guessHistory.value.push(guess.value)
    resultHistory.value.push(result.value)
}


function resetGame() {
    const attacker = props.attacker
    const defender = props.defender
    const gameEnv = new GameEnvironment(game, attacker, defender);
    gameEnv.start();
    target.value = game.target
    guess.value = 0
    guessHistory.value.length = 0
    resultHistory.value.length = 0
}

</script>
