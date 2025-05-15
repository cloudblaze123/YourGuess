<template>
    <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';


const weights = ref([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
])


// // 定义数据
// const data = [
//     {
//         name: 'Node 1',
//         x: 300,
//         y: 300
//     },
//     {
//         name: 'Node 2',
//         x: 800,
//         y: 300
//     },
//     {
//         name: 'Node 3',
//         x: 550,
//         y: 100
//     },
//     {
//         name: 'Node 4',
//         x: 550,
//         y: 500
//     }
// ];


// const links = [
//     {
//         source: 0,
//         target: 1,
//         symbolSize: [5, 20],
//         label: {
//             show: true
//         },
//         lineStyle: {
//             width: 5,
//             curveness: 0.2
//         }
//     },
//     {
//         source: 'Node 2',
//         target: 'Node 1',
//         label: {
//             show: true
//         },
//         lineStyle: {
//             curveness: 0.2
//         }
//     },
//     {
//         source: 'Node 1',
//         target: 'Node 3'
//     },
//     {
//         source: 'Node 2',
//         target: 'Node 3'
//     },
//     {
//         source: 'Node 2',
//         target: 'Node 4'
//     },
//     {
//         source: 'Node 1',
//         target: 'Node 4'
//     }
// ]
const data:Object[] = []
const links:Object[] = []


function prepareData() {
    const inputNodes = []
    const outputNodes = []
    const inputLinks:Array<object[]> = []

    inputNodes.length = weights.value[0].length
    outputNodes.length = weights.value.length
    inputLinks.length = outputNodes.length
    inputLinks.fill([])

    for (let i = 0; i < inputNodes.length; i++) {
        inputNodes[i] = {
            name: `Input ${i}`,
            x: 100,
            y: i * 100 + 100
        }
    }
    for (let i = 0; i < outputNodes.length; i++) {
        outputNodes[i] = {
            name: `Output ${i}`,
            x: 300,
            y: i * 100 + 100
        }
    }
    for (let i = 0; i < inputNodes.length; i++) {
        for (let j = 0; j < outputNodes.length; j++) {
            inputLinks[i].push({
                source: `Input ${i}`,
                target: `Output ${j}`,
                label: {
                    show: true,
                    formatter: `${weights.value[j][i]}`
                }
            })
        }
    }

    data.push(...inputNodes, ...outputNodes)
    for (let i = 0; i < inputLinks.length; i++) {
        links.push(...inputLinks[i])
    }
}
prepareData()

console.log(data)
console.log(links)




// 定义一个 ref 来引用 DOM 元素
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

type EChartsOption = echarts.EChartsOption;

function initChart() {
    chartInstance = echarts.init(chartRef.value);
    var option: EChartsOption;

    option = {
        title: {
            text: 'Basic Graph'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 50,
                roam: true,
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: 20
                },
                data: data,
                links: links,
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        ]
    };

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
  