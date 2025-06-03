<template>
    <div>查看模型</div>
    <TestModel />
    <HelloEcharts />
    <ModelViewer />
    <ModelGraphViewer :weight-nets="weightNets"/>
</template>


<script setup lang="ts">
import TestModel from '@/components/test/TestModel.vue'
import HelloEcharts from '@/components/HelloEcharts.vue'

import ModelViewer from '@/components/model/ModelViewer.vue'
import ModelGraphViewer from '@/components/model/ModelGraphViewer.vue'


import { type WeightNet } from '@/model/type';

const weightNet1: WeightNet = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
]
const weightNet2: WeightNet = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
]

const weightNets = [weightNet1, weightNet2]
</script>
