<template>
    <div class="flex flex-col">
        <div class="text-xl">Setting</div>
        <form @submit.prevent="updateSetting">
            <div class="flex mt-2">
                <label for="min">Min:</label>
                <input type="number" step="1" v-model="min">
                <label for="max">Max:</label>
                <input type="number" step="1" v-model="max">
            </div>
            <button class="btn btn-primary mt-2">Confirm</button>
        </form>
    </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'

import { Game, type GameOptions } from '@/game/game'


const props = defineProps({
    game: {
        type: Game,
    }
})


const emit = defineEmits(['settingUpdated'])


const min = ref(1)
const max = ref(10)


watch(() => props.game, (newVal) => {
    if (!newVal) return
    min.value = newVal.min
    max.value = newVal.max
}, { immediate: true })




function updateSetting() {
    if (!props.game) return

    const options: GameOptions = {
        min: min.value,
        max: max.value
    }
    emit('settingUpdated', options)
}

</script>
