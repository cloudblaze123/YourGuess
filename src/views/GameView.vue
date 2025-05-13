<template>
    <div class="flex flex-col">
        <GuessHistory :guesses="guessHistory" :results="resultHistory" class="h-64 overflow-auto mb-4" />
        <form @submit.prevent="handleGuess">
            <input type="number" v-model="guess">
            <button class="btn btn-primary">Guess</button>
        </form>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import GuessHistory from '@/components/GuessHistory.vue';

import { Result, Game } from '@/game/game'


const game = new Game()
game.initGame()


const result = ref(Result.CORRECT)

const guess = ref(0)

const guessHistory = ref<number[]>([])
const resultHistory = ref<Result[]>([])


function handleGuess() {
    result.value = game.guess(guess.value)

    guessHistory.value.push(guess.value)
    resultHistory.value.push(result.value)
}

</script>
