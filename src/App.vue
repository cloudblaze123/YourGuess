<template>
    <TestModel />
    <HelloEcharts />
    <ModelGraphViewer />
    <header class="text-3xl font-bold">YourGuess</header>
    <RouterView />
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import TestModel from './views/TestModel.vue'
import HelloEcharts from './components/HelloEcharts.vue'
import ModelGraphViewer from './components/ModelGraphViewer.vue'
</script>
