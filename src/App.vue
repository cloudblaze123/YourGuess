<template>
    <TestModel />
    <header class="text-3xl font-bold">YourGuess</header>
    <RouterView />
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import TestModel from './views/TestModel.vue';
</script>
