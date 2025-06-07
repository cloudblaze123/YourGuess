<template>
    <div ref="chartRef" style="width: 600px; height: 600px;"></div>
</template>


<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { GameRecord } from '@/game/game-record'


let record: GameRecord | null = null;


defineExpose({
    play
})

// 播放开始后初始化图表
function play(propRecord: GameRecord) {
    record = propRecord
    if (!record) {
        console.log('record is null')
        return;
    }
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
    initChart()
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
    if (!record) {
        console.log('record is null')
        return
    }
    const history = record.history
    const guessData = history.map(item => item.guess)
    const resultData = history.map(item => item.result)
    
    updateChart(chartInstance, guessData, resultData)
}




function initChart() {
    chartInstance = echarts.init(chartRef.value);
    const option = generateChartOption(record!.max, record!.min);
    option && chartInstance.setOption(option);
}


// 在组件销毁前销毁 ECharts 实例
onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
});
</script>
  