<template>
    <div ref="chartRef" style="width: 600px; height: 600px;"></div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Result, Game } from '@/game/game'


const emit = defineEmits(['guessed'])

const props = defineProps({
    guesses: {
        type: Array<number>,
        required: true
    },
    results: {
        type: Array<Result>,
        required: true
    },
    gameInstance: {
        type: Game,
        required: true
    }
});


defineExpose({
    updateChartFunc
})


function updateChartFunc() {
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
    initChart()
}


watch(props.guesses, refreshChart)


import * as echarts from 'echarts';
import { generateChartOption, updateChart } from '@/charts/game-chart'


// 定义一个 ref 来引用 DOM 元素
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;


function refreshChart() {
    console.log('refreshChart')

    if (!chartInstance) {
        console.log('chartInstance is null')
        return
    }

    const guessData = props.guesses
    const resultData = props.results

    updateChart(chartInstance, guessData, resultData)
}


function initChart() {
    chartInstance = echarts.init(chartRef.value);
    const option = generateChartOption(props.gameInstance.max, props.gameInstance.min);
    option && chartInstance.setOption(option);
    refreshChart();
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
  