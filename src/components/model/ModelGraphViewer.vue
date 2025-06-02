<template>
    <div ref="chartRef" style="width: 600px; height: 400px;"></div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';

import { type WeightNet } from '@/model/type';


const weightNet1: WeightNet = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
]
const weightNet2: WeightNet = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
]

const weightNets = [weightNet1, weightNet2]




class Node{
    weightNet: WeightNet | null = null
    layer: number = 0
    index: number = 0

    name: string = ''
    x: number = 0
    y: number = 0

    static createByWeightNet(weightNet: WeightNet, layer: number, index: number) {
        const node = new Node()

        node.weightNet = weightNet
        node.layer = layer
        node.index = index

        node.name = `Layer ${layer} Node ${index}`
        node.x = 100 + layer * 150
        node.y = index * 100 + 100

        return node
    }

    toJSON() {
        return {
            name: this.name,
            x: this.x,
            y: this.y
        }
    }
}


class Link{
    from: Node | null = null
    to: Node | null = null
    value: number = -1

    static createByNodes(from: Node, to: Node) {
        const link = new Link()

        link.from = from
        link.to = to

        const weightNet = from.weightNet!
        link.value = weightNet[to.index][from.index]
        
        return link
    }

    _getRelativeWidth() {
        const weightNet = this.from!.weightNet!

        const maxWeight = Math.max(...weightNet.flat())
        const minWeight = Math.min(...weightNet.flat())

        let weightRange = maxWeight - minWeight
        if (weightRange === 0) {
            weightRange = 1
        }

        return (this.value / weightRange) * 5 + 1
    }


    toJSON() {
        return {
            source: this.from!.name,
            target: this.to!.name,
            label: {
                show: true,
                formatter: `${this.value}`
            },
            lineStyle: {
                width: this._getRelativeWidth()
            },
        }
    }
}




const nodesData: any[] = []
const linksData: any[] = []


function prepareWeightNetData(weightNet: WeightNet, layer: number) {
    const rows = weightNet.length
    const cols = weightNet[0].length

    // 准备输入和输出节点的数据
    const inputNodes = Array.from({ length: cols }, (_, i) => {
        return Node.createByWeightNet(weightNet, layer, i)
    })
    const outputNodes = Array.from({ length: rows }, (_, i) => {
        return Node.createByWeightNet(weightNet, layer+1, i)
    })

    // 准备链接的数据
    const links:Link[] = []
    for (let i = 0; i < inputNodes.length; i++) {
        for (let j = 0; j < outputNodes.length; j++) {
            links.push(Link.createByNodes(inputNodes[i], outputNodes[j]))
        }
    }

    return {
        inputNodes: inputNodes.map(node => node.toJSON()),
        outputNodes: outputNodes.map(node => node.toJSON()),
        links: links.map(link => link.toJSON()),
    }
}


function prepareData() {
    nodesData.length = 0
    linksData.length = 0

    for (let i = 0; i < weightNets.length; i++) {
        const weightNet = weightNets[i]

        const { inputNodes, outputNodes, links } = prepareWeightNetData(weightNet, i)
        if (i === 0) { nodesData.push(...inputNodes) }
        nodesData.push(...outputNodes)
        linksData.push(...links)
    }
}

prepareData()




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
                data: nodesData,
                links: linksData,
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
        for(const link of linksData){
            if(link.source !== name && link.target !== name){
                link.lineStyle.opacity = 0.1;
            } else {
                link.lineStyle.opacity = 0.9;
            }
        }

        chartInstance?.setOption({
            series: {
                links: linksData    
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
  