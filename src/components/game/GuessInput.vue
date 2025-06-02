<template>
    <form @submit.prevent="handleGuess" class="flex flex-col space-y-1">
        <input type="number" v-model="guess">
        <button class="btn btn-primary">Guess</button>
    </form>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['guessed'])

const props = defineProps({
    guess: {
        type: Number,
        required: true
    }
})

const guess = ref(props.guess)

function handleGuess(){
    emit('guessed', guess.value)
}
</script>
