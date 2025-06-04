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
        <ModelGraphViewer ref="modelGraphViewer" />

        <textarea v-model="modelJsonStr" rows="10" disabled class="w-full"></textarea>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

import ModelGraphViewer from '@/components/model/ModelGraphViewer.vue'

import { NeuralNetwork } from '@/model/neural-network';


defineExpose({
    setModel,
});


let model: NeuralNetwork | null = null;


const weights = ref([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
])


const modelGraphViewer = ref<InstanceType<typeof ModelGraphViewer> | null>(null)

const modelJsonStr = ref('')

function setModel(modelArg: NeuralNetwork){
    model = modelArg
    modelGraphViewer.value!.updateChart(model)
    modelJsonStr.value = JSON.stringify(model.toJSON())
}
</script>
