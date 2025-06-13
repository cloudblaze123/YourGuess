<template>
    <div class="flex flex-col">
        <button class="btn btn-primary mb-4" @click="resetGame">重置游戏</button>
        <div v-if="debug">target: {{ target }}</div>
        
        <div class="lg:flex">
            <div class="flex justify-center lg:w-0 lg:flex-2/3">
                <GuessChartInput :guesses="guessHistory" :results="resultHistory" :game-instance="game" @guessed="handleGuess" />
            </div>
    
            <div class="flex lg:flex-1/3">
                <div class="flex flex-col w-full lg:w-80">
                    <label>Your Guess:</label>
                    <GuessInput :guess="guess" @guessed="handleGuess" />
                    <GuessHistory :guesses="guessHistory" :results="resultHistory" class="h-64 overflow-auto mb-4" />
                </div>
            </div>
        </div>
        
        <GameSettingView :game="game" @setting-updated="updateSetting" class="mt-4" />
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

import GuessChartInput from '@/components/game/GuessChartInput.vue'

import GuessHistory from '@/components/game/GuessHistory.vue'
import GuessInput from '@/components/game/GuessInput.vue'
import GameSettingView from '@/components/game/GameSetting.vue'

import { Result } from '@/game/game'
import { game } from '@/game/gameProvider'

const debug = true


const target = ref<number>(game.target)

const guess = ref<number>(0)

const result = ref(Result.CORRECT)


const guessHistory = ref<number[]>([])
const resultHistory = ref<Result[]>([])




import { GameEnvironment } from '@/game/game-environment';
import { HumanAgent } from '@/game/agent/human-agent';
import { RandomAgent } from '@/game/agent/random-agent'
import { SkipGuessedRandomAgent } from '@/game/agent/skip-guessed-random-agent';
import { HonestAgent } from '@/game/agent/honest-agent';


const attacker = new HumanAgent();
const defender = new HonestAgent();
const gameEnv = new GameEnvironment(game, attacker, defender);




game.onUpdate = () => {
    guess.value = game.history[game.history.length - 1].guess
    result.value = game.history[game.history.length - 1].result
    
    guessHistory.value.push(guess.value)
    resultHistory.value.push(result.value)
}


function handleGuess(guessNumber: number) {
    attacker.guess(guessNumber)
}


function resetGame() {
    gameEnv.start();
    target.value = game.target
    guess.value = 0
    guessHistory.value.length = 0
    resultHistory.value.length = 0
}


import { type GameOptions } from '@/game/game';
function updateSetting(newOptions: GameOptions) {
    game.setOptions(newOptions)
}
</script>
