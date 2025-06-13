<template>
    <div>
        <div class="text-lg">ModelViewer</div>
        
        <ModelGraphViewer ref="modelGraphViewer" />

        <div>
            模型数据
            <textarea v-model="modelJsonStr" rows="10" disabled class="w-full"></textarea>
        </div>
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


const modelGraphViewer = ref<InstanceType<typeof ModelGraphViewer> | null>(null)

const modelJsonStr = ref('')

function setModel(modelArg: NeuralNetwork){
    model = modelArg
    modelGraphViewer.value!.updateChart(model)
    modelJsonStr.value = JSON.stringify(model.toJSON())
}
</script>
