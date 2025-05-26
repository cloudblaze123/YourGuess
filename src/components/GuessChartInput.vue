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

    
    const xAxisData = data.map(item => item.x)
    const rightSpaceData = [1,2,3,4,5].map(item => item + xAxisData.length)
    xAxisData.push(...rightSpaceData)
    let xAxis = [
        {
            data: xAxisData
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
                        const result = results[params.dataIndex]
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

                animationDuration: 500,
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
  