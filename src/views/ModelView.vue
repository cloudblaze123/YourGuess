<template>
    <ModelViewer />
    
    <ModelList class="mt-8"/>

    <div class="flex flex-col">
        <div>创建模型</div>
        <div>用单个空格分隔的每层节点数，形如：2 4 3 1</div>
        <input type="text" v-model="networkFormatStr" placeholder="用单个空格分隔的每层节点数，形如：2 4 3 1" />
        <button @click="createModel" class="btn btn-primary">创建模型</button>
        <textarea v-model="modelCreated" rows="10" disabled></textarea>
    </div>
</template>


<script setup lang="ts">
import ModelViewer from '@/components/model/ModelViewer.vue'

import ModelList from '@/components/model/ModelList.vue'




import { ref } from 'vue'
import { useModelStore } from '@/stores/model';
const modelStore = useModelStore();


import { NeuralNetwork } from '@/model/neural-network';
const networkFormatStr = ref('2 4 3 1')
const modelCreated = ref('')

function createModel() {
    const networkStr = networkFormatStr.value.trim()
    if (networkStr === '') {
        return
    }
    const networkStrArr = networkStr.split(' ')
    const networkFormat = networkStrArr.map(str => parseInt(str))
    const nn = new NeuralNetwork(networkFormat)
    const nnJSON = nn.toJSON()
    modelStore.addModel('model' + new Date().getTime(), nnJSON)
    const modelStr = JSON.stringify(nnJSON)
    modelCreated.value = modelStr
}

</script>
