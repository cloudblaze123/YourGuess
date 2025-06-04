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




import { type WeightNet } from '@/model/type';

import { concat } from 'mathjs';

let weightNets = ref<WeightNet[]>([]);

function convertNNToWeightNets(nn: NeuralNetwork): WeightNet[] {
    const weightNets: WeightNet[] = [];
    for (let i = 0; i < nn.layers.length; i++) {
        const layer = nn.layers[i];
        const weights = layer.weights.toArray() as WeightNet;
        const bais = layer.bias.toArray() as WeightNet;

        const weightNet = concat(weights, bais, 1) as WeightNet;
        weightNets.push(weightNet);
    }
    return weightNets;
}






const modelJsonStr = ref('')

function setModel(modelArg: NeuralNetwork){
    model = modelArg
    weightNets.value = convertNNToWeightNets(model)
    modelJsonStr.value = JSON.stringify(model.toJSON())
}
</script>
