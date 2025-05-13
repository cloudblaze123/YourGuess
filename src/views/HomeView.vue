<template>
    <header class="text-3xl font-bold">YourGuess</header>
    <main class="flex flex-col">
        <div>{{ resultMessage }}</div>
        <input type="number" v-model="guess">
        <button class="btn btn-primary" @click="handleGuess">Guess</button>
    </main>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { getResultMessage } from '@/game/game'
import { Result, Game } from '@/game/game'


const game = new Game()
game.initGame()


const result = ref(Result.CORRECT)
const resultMessage = computed(() => getResultMessage(Number(result.value)))

const guess = ref(0)


function handleGuess() {
    result.value = game.guess(guess.value)
}

</script>
