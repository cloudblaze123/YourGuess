<template>
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
</template>


<script setup lang="ts">
import { ref } from 'vue'

import { game } from '@/game/gameProvider'


const min = ref(game.min)
const max = ref(game.max)


function updateSetting() {
    game.min = min.value
    game.max = max.value
}

</script>
