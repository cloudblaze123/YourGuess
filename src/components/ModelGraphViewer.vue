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


const data: Object[] = []
const links: any[] = []


function prepareData() {
    const inputNodes = new Array(weights.value[0].length)
    const outputNodes = new Array(weights.value.length)
    const inputLinks: Array<object[]> = []

    for (let i = 0; i < outputNodes.length; i++) {
        inputLinks[i] = new Array(inputNodes.length)
    }

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


    const maxWeight = Math.max(...weights.value.flat())
    const minWeight = Math.min(...weights.value.flat())
    let weightRange = maxWeight - minWeight
    if (weightRange === 0) {
        weightRange = 1
    }

    for (let i = 0; i < inputNodes.length; i++) {
        for (let j = 0; j < outputNodes.length; j++) {
            inputLinks[j][i] = {
                source: `Input ${i}`,
                target: `Output ${j}`,
                label: {
                    show: true,
                    formatter: `${weights.value[j][i]}`
                },
                lineStyle: {
                    width: weights.value[j][i] / weightRange * 5 + 1,
                }
            }
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

    chartInstance.on('click', function (params: any) {
        if (params.dataType !== 'node') {
            return
        }
        console.log(params.data);
        
        const name = params.data.name;
        for(const link of links){
            if(link.source !== name && link.target !== name){
                link.lineStyle.opacity = 0.1;
            } else {
                link.lineStyle.opacity = 0.9;
            }
        }

        chartInstance?.setOption({
            series: {
                links: links    
            }
        })
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
  