<template>
    <div>
        <div v-for="_guess, index in guesses" class="flex">
            <span class="grow-1 basis-0">{{ guesses[index] }}</span>
            <span class="grow-1 basis-0">{{ resultMessages[index] }}</span>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import { Result, getResultMessage } from '@/game/game'



const props = defineProps({
    guesses: {
        type: Array<Number>,
        required: true
    },
    results: {
        type: Array<Result>,
        required: true
    }
});


const guesses = ref(props.guesses)
const results = ref(props.results)

const resultMessages = computed(() => results.value.map(result => getResultMessage(result)))

</script>
