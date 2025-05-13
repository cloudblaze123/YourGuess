<template>
    <div class="flex flex-col">
        <button class="btn btn-primary mb-4" @click="resetGame">重置游戏</button>
        <div v-if="debug">target: {{ target }}</div>
        <GuessHistory :guesses="guessHistory" :results="resultHistory" class="h-64 overflow-auto mb-4" />
        <form @submit.prevent="handleGuess">
            <input type="number" v-model="guess">
            <button class="btn btn-primary">Guess</button>
        </form>

        <GameSettingView class="mt-4" />
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import GuessHistory from '@/components/GuessHistory.vue';
import GameSettingView from '@/components/GameSetting.vue';

import { Result } from '@/game/game'
import { game } from '@/game/gameProvider'

const debug = true

game.initGame()

const target = ref<number>(game.targetNumber)



const result = ref(Result.CORRECT)

const guess = ref(0)

const guessHistory = ref<number[]>([])
const resultHistory = ref<Result[]>([])


function handleGuess() {
    result.value = game.guess(guess.value)

    guessHistory.value.push(guess.value)
    resultHistory.value.push(result.value)
}


function resetGame() {
    game.initGame()
    target.value = game.targetNumber
    guess.value = 0
    guessHistory.value.splice(0, guessHistory.value.length)
    resultHistory.value.splice(0, resultHistory.value.length)
}

</script>
