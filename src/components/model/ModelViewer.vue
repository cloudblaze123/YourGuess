<template>
    <div>
        <div class="text-lg">ModelViewer</div>
        
        <div class="flex flex-col">
            <table class="border-collapse border-gray-300">
                <tr v-for="(row, index) in weights">
                    <td v-for="(col, colIndex) in row" class="border-2 border-gray-300">
                        {{ col }}
                    </td>
                </tr>
            </table>
        </div>

        <div class="text-lg">ModelGraphViewer</div>
        <ModelGraphViewer :weight-nets="weightNets" />
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

import ModelGraphViewer from '@/components/model/ModelGraphViewer.vue'


const weights = ref([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
])




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
