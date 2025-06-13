<template>
    <h2 class="text-2xl">训练神经网络</h2>

    <div class="text-lg mt-16">
        <div>当前模型 {{ currentModel }}</div>
        <ModelList @select-model="onSelectModel" class="mt-8" />
    </div>

    <div class="flex flex-col mt-8">
        <div>【输入值】与【目标值】（1到0之间）之间用 > 分割</div>
        <div>多个值之间用空格分隔</div>
        <div>形如：0.1 0.2 0.3 > 1 0</div>
        <textarea v-model="trainData" rows="10" class="border-2"></textarea>
        <div>训练次数</div>
        <input type="number" v-model="trainTimes" placeholder="训练次数">
        <button @click="trainModel" class="btn btn-primary">开始训练</button>
    </div>

    <div class="flex flex-col mt-16">
        <div>请输入用空格分隔的【输入值】（偏置节点无需输入）</div>
        <input type="text" v-model="forwardInput" placeholder="用空格分隔的输入值形如 0.9 0.1 0.8">
        <button @click="forward" class="btn btn-primary">前向传播</button>
        <div>前向传播结果：{{ forwardResults }}</div>
    </div>

</template>


<script setup lang="ts">
import { ref } from 'vue'

import ModelList from '@/components/model/ModelList.vue'


const trainData = ref('0.1 0.2 0.3 > 1 0 \n0.3 0.2 0.1 > 0 1')
const trainTimes = ref(100)

const forwardInput = ref('0.1 0.2 0.3')
const forwardResults = ref('')




import { NeuralNetwork } from '@/model/neural-network/neural-network'

// 创建神经网络实例
let nn = new NeuralNetwork([3, 4, 2]);


function trainModel() {
    // 示例数据
    const dataStrArr = trainData.value.split('\n');
    const dataArr = dataStrArr.map((str) => {
        const [inputStr, targetStr] = str.split('>');
        const input = inputStr.match(/-?\d+(\.\d+)?/g)!.map(Number);
        const target = targetStr.match(/-?\d+(\.\d+)?/g)!.map(Number);
        return { input, target };
    });
    
    // 训练神经网络
    for (let i = 0; i < trainTimes.value; i++) {
        for (const { input, target } of dataArr) {
            nn.train(input, target);
        }
    }
}


function forward() {
    const input = forwardInput.value.split(/\s+/).map(Number);
    const output = nn.forward(input);
    forwardResults.value = output.map((v) => v.toFixed(3)).join('   ');
}


const currentModel = ref('')


import { useModelStore } from '@/stores/model'
const modelStore = useModelStore()


function onSelectModel(modelName: string) {
    const model = modelStore.models[modelName];
    nn = NeuralNetwork.fromJSON(model);
    currentModel.value = modelName;
}

</script>
