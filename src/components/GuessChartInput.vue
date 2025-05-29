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

    chartInstance.getZr().on('click', function (params: MouseEvent) {
        // 获取 y 轴的值
        const offsetY = params.offsetY;
        let yAxisValue: number = chartInstance?.convertFromPixel(
            { yAxisIndex: 0 },
            offsetY
        ) as number
        // 对 y 四舍五入取整
        yAxisValue = Math.floor(yAxisValue + 0.5)

        console.log(yAxisValue)

        emit('guessed', yAxisValue)

        refreshChart()
    });
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
  