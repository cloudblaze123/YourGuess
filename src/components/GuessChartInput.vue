<template>
    <div ref="chartRef" style="width: 600px; height: 600px;"></div>
</template>


<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Result, getResultMessage, Game } from '@/game/game'


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
        type: Game
    }
});

const guesses = props.guesses
const results = props.results

const resultMessages = computed(() => results.map(result => getResultMessage(result)))




import * as echarts from 'echarts';


const data: any[] = []

function prepareData() {
    const xArray: number[] = [];
    const yArray: number[] = [...guesses];
    const labelArray: string[] = [];

    for (let i = 0; i < guesses.length; i++) {
        xArray.push(i + 1);
    }
    for (let i = 0; i < resultMessages.value.length; i++) {
        labelArray.push(guesses[i] + '\n' + resultMessages.value[i]);
    }

    data.length = 0;
    for (let i = 0; i < xArray.length; i++) {
        data.push({
            x: xArray[i],
            y: yArray[i],
            label: labelArray[i]
        });
    }
}




// 定义一个 ref 来引用 DOM 元素
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;


function refreshChart() {
    prepareData();

    const game = props.gameInstance

    let xAxis = [
        {
            min: 0,
            max: data.length + 2,
        }
    ]
    let yAxis = [
        {
            min: 1,
            max: 100,
        }
    ]
    if (game) {
        yAxis = [
            {
                min: game.min - 1,
                max: game.max + 1,
            }
        ]
    }


    if (chartInstance) {
        chartInstance.setOption({
            yAxis: yAxis,
            xAxis: xAxis,
            series: [
                {
                    data: data.map(item => [item.x, item.y])
                }
            ]
        });
    }
}


watch(guesses, refreshChart)









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
                type: 'value',
                // interval: 0, // 显示所有刻度标签
                minInterval: 1, // 最小间隔
                maxInterval: 100, // 最大间隔
                splitNumber: 10,
                // axisTick: {
                //     show: false  // 不显示刻度线
                // },
                axisLabel: {
                    show: true,
                    formatter: '{value}'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
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
            }
        ],
        series: [
            {
                name: 'Direct',
                type: 'bar',
                barWidth: '10%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: (params) => {
                        return `${data[params.dataIndex].label}`
                    }
                },
                data: data.map(item => [item.x, item.y])
            },
        ],
        dataZoom: [
            {
                type: 'inside',
                yAxisIndex: 0,
            }
        ],
    };


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
  