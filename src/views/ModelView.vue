<template>
    <ModelViewer ref="modelViewerRef" />
    
    <ModelList @select-model="onSelectModel" class="mt-8"/>

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


const modelViewerRef = ref<any>()




function onSelectModel(modelName: string) {
    console.log('onSelectModel', modelName)
    modelViewerRef.value!.setModel(modelStore.getModel(modelName))
}




import { NeuralNetwork } from '@/model/neural-network';
const networkFormatStr = ref('2 4 3 1')

function createModel() {
    const networkStr = networkFormatStr.value.trim()
    if (networkStr === '') {
        return
    }
    const networkStrArr = networkStr.split(' ')
                                    .map(str => str.trim())
                                    .filter(str => str !== '')
                                    
    const networkFormat = networkStrArr.map(str => parseInt(str))
    const nn = new NeuralNetwork(networkFormat)
    modelStore.addModel('model' + new Date().getTime(), nn)
}

</script>
