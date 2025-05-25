<template>
    <div class="flex flex-col">
        <button class="btn btn-primary mb-4" @click="resetGame">重置游戏</button>
        <div v-if="debug">target: {{ target }}</div>
        
        <GuessChartInput :guesses="guessHistory" :results="resultHistory" :game-instance="game" @guessed="handleGuess" />

        <GuessHistory :guesses="guessHistory" :results="resultHistory" class="h-64 overflow-auto mb-4" />
        <GuessInput :guess="guess" @guessed="handleGuess" />

        <GameSettingView class="mt-4" />
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

import GuessChartInput from '@/components/GuessChartInput.vue'

import GuessHistory from '@/components/GuessHistory.vue'
import GuessInput from '@/components/GuessInput.vue'
import GameSettingView from '@/components/GameSetting.vue'

import { Result } from '@/game/game'
import { game } from '@/game/gameProvider'

const debug = true


const target = ref<number>(game.target)

const guess = ref<number>(0)

const result = ref(Result.CORRECT)


const guessHistory = ref<number[]>([])
const resultHistory = ref<Result[]>([])


resetGame()


function handleGuess(guessNumber: number) {
    guess.value = guessNumber
    result.value = game.guess(guessNumber)

    guessHistory.value.push(guessNumber)
    resultHistory.value.push(result.value)
}


function resetGame() {
    game.initGame()
    target.value = game.target
    guess.value = 0
    guessHistory.value.length = 0
    resultHistory.value.length = 0
}

</script>
