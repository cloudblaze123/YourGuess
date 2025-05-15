<template>
    <div ref="chartRef" style="width: 600px; height: 400px;"></div>
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
    const xArray: number[] = [...guesses];
    const yArray: number[] = [];
    const labelArray: string[] = [];

    for (let i = 0; i < guesses.length; i++) {
        yArray.push(i+1);
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
    console.log(data)

    const game = props.gameInstance

    let yAxis = [
        {
            min: 0,
            max: data.length + 2,
        }
    ]
    let xAxis = [
        {
            min: 1,
            max: 100,
        }
    ]
    if (game) {
        xAxis = [
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

refreshChart()
watch(guesses, refreshChart)









type EChartsOption = echarts.EChartsOption;

function initChart() {
    chartInstance = echarts.init(chartRef.value);
    var option: EChartsOption;


    option = {
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'shadow'
        //     }
        // },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
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
                name: '次数',
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
                type: 'inside'
            }
        ]
    };


    option && chartInstance.setOption(option);

    chartInstance.getZr().on('click', function (params: MouseEvent) {
        // 获取 x 轴的值
        const offsetX = params.offsetX;
        let xAxisValue: number = chartInstance?.convertFromPixel(
            { xAxisIndex: 0 },
            offsetX
        ) as number
        // 对 x 四舍五入取整
        xAxisValue = Math.floor(xAxisValue+0.5)

        console.log(xAxisValue)

        emit('guessed', xAxisValue)

        refreshChart()
    });
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
  