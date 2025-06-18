<template>
    <!-- <TemporaryTest /> -->
    <div class="min-h-dvh p-4">
        <header class="text-3xl font-bold text-center">YourGuess</header>
        <RouterView />
    </div>
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import TemporaryTest from '@/components/test/TemporaryTest.vue';

document.body.dataset.theme = localStorage.getItem('theme') || 'emerald';
</script>
