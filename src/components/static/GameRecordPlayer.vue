<template>
    <button @click="play" class="btn btn-primary">play</button>
    <div ref="chartRef" style="width: 600px; height: 600px;"></div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GameRecord } from '@/game/game-record'


const props = defineProps({
    record: {
        type: GameRecord,
        required: true,
    },
});




function play() {
    refreshChart()
}




import * as echarts from 'echarts';
import { generateChartOption, updateChart } from '@/charts/game-chart'


// 定义一个 ref 来引用 DOM 元素
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;


function refreshChart() {
    if (!chartInstance) {
        console.log('chartInstance is null')
        return
    }

    const history = props.record.history
    const guessData = history.map(item => item.guess)
    const resultData = history.map(item => item.result)
    
    updateChart(chartInstance, guessData, resultData)
}




function initChart() {
    chartInstance = echarts.init(chartRef.value);
    const option = generateChartOption(props.record.max, props.record.min);
    option && chartInstance.setOption(option);
}




// 在组件挂载后初始化图表
onMounted(() => {
    initChart();
});

// 在组件销毁前销毁 ECharts 实例
onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
});
</script>
  