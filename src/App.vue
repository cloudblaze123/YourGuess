<template>
    <TemporaryTest />
    <header class="text-3xl font-bold">YourGuess</header>
    <RouterView />
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TemporaryTest from '@/components/test/TemporaryTest.vue';
</script>
