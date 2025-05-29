<template>
    <button @click="play" class="btn btn-primary">play</button>
    <div ref="chartRef" style="width: 600px; height: 600px;"></div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Result, getResultMessage } from '@/game/game'
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


const data: any[] = []

function prepareData() {
    data.length = 0;

    const history = props.record.history;
    for (let i = 0; i < history.length; i++) {
        data.push({
            x: i+1,
            y: history[i].guess,
            label: history[i].guess + '\n' + getResultMessage(history[i].result),
            result: history[i].result,
        });
    }
}




// 定义一个 ref 来引用 DOM 元素
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;


function refreshChart() {
    prepareData();
    
    const xAxisData = data.map(item => item.x)
    const rightSpaceData = [1,2,3,4,5].map(item => item + xAxisData.length)
    xAxisData.push(...rightSpaceData)
    const xAxis = [
        {
            data: xAxisData
        }
    ]
    const yAxis = [
        {
            min: props.record.min - 1,
            max: props.record.max + 1,
        }
    ]


    if (chartInstance) {
        chartInstance.setOption({
            xAxis: xAxis,
            yAxis: yAxis,
            series: [
                {
                    data: data.map(item => item.y),
                }
            ]
        });
    }
}




type EChartsOption = echarts.EChartsOption;

function initChart() {
    chartInstance = echarts.init(chartRef.value);
    var option: EChartsOption;


    option = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                name: '次数',
                type: 'category',
                data: data.map(item => item.x),
                axisLabel: {
                    show: true,
                    formatter: '{value}'
                },
                axisTick: {
                    alignWithLabel: true,
                },
                splitLine: {
                    show: false,
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                minInterval: 1, // 最小间隔为整数
                axisPointer: {
                    show: true,
                    type: 'line',
                    label: {
                        formatter: (params) => {
                            const value = Math.floor(Number(params.value) + 0.5);
                            return value.toString();
                        }
                    }
                },
                splitLine: {
                    show: false,
                },
            }
        ],
        series: [
            {
                name: 'Guess',
                type: 'bar',
                label: {
                    show: true,
                    position: 'top',
                    formatter: (params) => {
                        return `${data[params.dataIndex].label}`
                    }
                },
                itemStyle: {
                    color: (params: any) => {
                        const result = data[params.dataIndex].result;
                        if (result === Result.CORRECT) {
                            return '#33d07c' // 绿色
                        } else if (result === Result.TOO_SMALL) {
                            return '#d03737' // 红色
                        } else if (result === Result.TOO_BIG) {
                            return '#2b80d0' //蓝色
                        } else {
                            return 'black' //不应该有这个颜色的情况，有则数据有误
                        }
                    },
                    borderRadius: [3, 3, 0, 0],
                },
                barWidth: '95%',

                animationDuration: 50,
            },
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: 0,
            },
            {
                type: 'slider',
                yAxisIndex: 0,
                filterMode: 'none',
            }
        ],
    };


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
  