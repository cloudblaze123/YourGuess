<template>
    <div>查看模型</div>
    <TestModel />
    <HelloEcharts />
    <ModelViewer />
    <ModelGraphViewer />
</template>


<script setup lang="ts">
import TestModel from '@/components/test/TestModel.vue'
import HelloEcharts from '@/components/HelloEcharts.vue'

import ModelViewer from '@/components/model/ModelViewer.vue'
import ModelGraphViewer from '@/components/model/ModelGraphViewer.vue'
</script>
