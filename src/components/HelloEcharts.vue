<template>
    <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';


// 创建一个 ref 来引用 DOM 元素
const chartRef = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 初始化 ECharts
const initChart = () => {
    if (chartRef.value) {
        // 初始化图表实例
        myChart = echarts.init(chartRef.value);

        // 配置项
        const option: echarts.EChartsOption = {
            title: {
                text: 'ECharts 示例'
            },
            tooltip: {},
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
            ]
        };

        // 设置配置项并渲染图表
        myChart.setOption(option);
    }
};

// 组件挂载时初始化图表
onMounted(() => {
    initChart();
});

// 组件卸载时销毁图表实例
onBeforeUnmount(() => {
    if (myChart) {
        myChart.dispose();
    }
});

</script>
