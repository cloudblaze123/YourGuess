<template>
    <div>Hello Mathjs</div>
    <div>{{ matrixA }} + {{ matrixB }}</div>
    <div>result: {{ result }}</div>

    <header class="text-3xl font-bold">YourGuess</header>
    <RouterView />
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { matrix, add } from 'mathjs';

const matrixA = matrix([[1, 2], [3, 4]]);
const matrixB = matrix([[5, 6], [7, 8]]);
const result = add(matrixA, matrixB); // [[19, 22], [43, 50]]
</script>
