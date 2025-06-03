<template>
    <div>训练模型</div>

    <ModelGraphViewer :weightNets="weightNets" />

    <div class="flex flex-col mt-8">
        <div>请输入用单个空格分隔的【输入值】（偏置节点无需输入）</div>
        <input type="text" v-model="inputsNumbers" placeholder="用空格分隔的输入值形如 0.9 0.1 0.8">
        <div>请输入用单个空格分隔的【目标值】（1到0之间）</div>
        <input type="text" v-model="targetNumbers" placeholder="用空格分隔的目标值 形如 1 0">
        <div>训练次数</div>
        <input type="number" v-model="trainTimes" placeholder="训练次数">
        <button @click="trainModel" class="btn btn-primary">训练模型</button>
    </div>

    <div class="flex flex-col mt-16">
        <div>请输入用单个空格分隔的【输入值】（偏置节点无需输入）</div>
        <input type="text" v-model="forwardInput" placeholder="用空格分隔的输入值形如 0.9 0.1 0.8">
        <button @click="forward" class="btn btn-primary">前向传播</button>
        <div>前向传播结果：{{ forwardResults }}</div>
    </div>

    <div class="flex flex-col mt-16">
        <div class="flex flex-col">
            <div>加载模型：</div>
            <textarea v-model="model" placeholder="要加载的模型的JSON数据"></textarea>
            <button @click="loadModel" class="btn btn-primary">加载模型</button>
        </div>

        <div class="flex flex-col mt-8">
            <div>导出模型：</div>
            <button @click="exportModel" class="btn btn-primary">导出当前模型</button>
            <textarea v-model="currentModel" placeholder="当前模型的JSON数据" readonly disabled></textarea>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'


const inputsNumbers = ref('0.9 0.1 0.8')
const targetNumbers = ref('1.0 0.0')
const trainTimes = ref(100)

const forwardInput = ref('0.9 0.1 0.8')
const forwardResults = ref('')




import { NeuralNetwork } from '@/model/neural-network'

// 创建神经网络实例
let nn = new NeuralNetwork([3, 4, 2]);


function trainModel() {
    // 示例数据
    const input = inputsNumbers.value.split(' ').map(Number);
    const target = targetNumbers.value.split(' ').map(Number);

    // 训练神经网络
    for (let i = 0; i < trainTimes.value; i++) {
        nn.train(input, target);
    }

    weightNets.value = convertNNToWeightNets(nn);
}


function forward() {
    const input = forwardInput.value.split(' ').map(Number);
    const output = nn.forward(input);
    forwardResults.value = output.map((v) => v.toFixed(3)).join('   ');
}



import { concat } from 'mathjs';
import { type WeightNet } from '@/model/type';
import ModelGraphViewer from '@/components/model/ModelGraphViewer.vue';

let weightNets = ref(convertNNToWeightNets(nn));

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




const model = ref('')
const currentModel = ref('')


function loadModel() {
    const json = JSON.parse(model.value);
    nn = NeuralNetwork.fromJSON(json);
    weightNets.value = convertNNToWeightNets(nn);
}

function exportModel() {
    const json = JSON.stringify(nn.toJSON());
    currentModel.value = json;
}

</script>
