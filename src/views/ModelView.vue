<template>
    <div class="lg:flex">
        <div class="w-64">
            <!-- sidebar header -->
            <div class="flex space-x-2">
                <h2 class="text-2xl mb-4">模型列表</h2>
                <button @click="navigation ='model-add'" class="btn btn-outline">添加</button>
            </div>

            <ModelList @select-model="onSelectModel" class="mt-8"/>
        </div>
        
        <div class="w-full lg:w-0 lg:flex-1">
            <div v-show="navigation ==='model-add'">
                <div class="flex flex-col mb-16">
                    <div>创建模型</div>
                    <div>用空格分隔的每层节点数，形如：2 4 3 1</div>
                    <input type="text" v-model="networkFormatStr" placeholder="用单个空格分隔的每层节点数，形如：2 4 3 1" />
                    <button @click="createModel" class="btn btn-primary">创建模型</button>
                </div>
                
                <div class="flex flex-col mt-16">
                    <div class="flex flex-col">
                        <div>加载模型：</div>
                        <textarea v-model="modelJsonStr" placeholder="要加载的模型的JSON数据"></textarea>
                        <button @click="loadModel" class="btn btn-primary">加载模型</button>
                    </div>
                </div>
            </div>

            <div v-show="navigation ==='model-view'">
                <h2 class="text-2xl mb-4 font-bold">{{ modelName }}</h2>
                <ModelViewer ref="modelViewerRef" />
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

import ModelViewer from '@/components/model/ModelViewer.vue'

import ModelList from '@/components/model/ModelList.vue'

type NavigationItem = 'model-add' | 'model-view'

const navigation = ref<NavigationItem>('model-add')




import { useModelStore } from '@/stores/model';
const modelStore = useModelStore();


const modelViewerRef = ref<any>()

const modelName = ref('')


function onSelectModel(propModelName: string) {
    console.log('onSelectModel', propModelName)
    navigation.value ='model-view'
    modelName.value = propModelName
    modelViewerRef.value!.setModel(modelStore.getModel(propModelName))
}




import { NeuralNetwork } from '@/model/neural-network';
const networkFormatStr = ref('2 4 3 1')

function createModel() {
    const networkStr = networkFormatStr.value.trim()
    if (networkStr === '') {
        return
    }
    const networkFormat = networkStr.split(/\s+/).map(Number)
    const nn = new NeuralNetwork(networkFormat)
    modelStore.addModel('model' + new Date().getTime(), nn)
}



const modelJsonStr = ref('')

function loadModel() {
    const json = JSON.parse(modelJsonStr.value);
    const nn = NeuralNetwork.fromJSON(json);
    modelStore.addModel('model' + new Date().getTime(), nn)
}
</script>
