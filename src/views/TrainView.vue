<template>
    <div>训练模型</div>

    <div class="flex flex-col mt-8">
        <div>请输入【3】个用单个空格分隔的【输入值】</div>
        <input type="text" v-model="inputsNumbers" placeholder="用空格分隔的输入值形如 0.9 0.1 0.8">
        <div>请输入【2】个用单个空格分隔的【目标值】（1到0之间）</div>
        <input type="text" v-model="targetNumbers" placeholder="用空格分隔的目标值 形如 1 0">
        <div>训练次数</div>
        <input type="number" v-model="trainTimes" placeholder="训练次数">
        <button @click="trainModel" class="btn btn-primary">训练模型</button>
    </div>

    <div class="flex flex-col mt-16">
        <div>请输入【3】个用单个空格分隔的【输入值】</div>
        <input type="text" v-model="forwardInput" placeholder="用空格分隔的输入值形如 0.9 0.1 0.8">
        <button @click="forward" class="btn btn-primary">前向传播</button>
        <div>前向传播结果：{{ forwardResults }}</div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'


const inputsNumbers = ref('0.9 0.1 0.8')
const targetNumbers = ref('1.0 0.0')
const trainTimes = ref(100)

const forwardInput = ref('0.9 0.1  0.8')
const forwardResults = ref('')




import { NeuralNetwork } from '@/model/neural-network'

// 创建神经网络实例
const nn = new NeuralNetwork([3, 4, 2]);


function trainModel() {
    // 示例数据
    const input = inputsNumbers.value.split(' ').map(Number);
    const target = targetNumbers.value.split(' ').map(Number);

    // 训练神经网络
    for (let i = 0; i < trainTimes.value; i++) {
        nn.train(input, target);
    }
}


function forward() {
    const input = [0.9, 0.1, 0.8];
    const output = nn.forward(input);
    forwardResults.value = output.map((v) => v.toFixed(3)).join('   ');
}
</script>
