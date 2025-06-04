<template>
    <div>
        <div ref="chartRef" style="width: 600px; height: 400px;"></div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';

import { NeuralNetwork } from '@/model/neural-network';
import { NeuralNetworkLayer } from '@/model/neural-network-layer';


defineExpose({
    updateChart
});


let network: NeuralNetwork | null = null;

function updateChart(v_network: NeuralNetwork) {
    network = v_network;
    refreshChart();
}




class Node {
    layer?: NeuralNetworkLayer
    index: number = 0
    type: 'node' | 'bias' = 'node'

    name: string = ''
    x: number = 0
    y: number = 0

    constructor(layer: NeuralNetworkLayer, nodeLayerIndex: number, index: number) {
        this.layer = layer
        this.index = index
        this.name = `${nodeLayerIndex} ${index}`
    }


    static layoutNodes(nodeLayers: Node[][]) {
        for (let i = 0; i < nodeLayers.length; i++) {
            const layer = nodeLayers[i]
            for (let j = 0; j < layer.length; j++) {
                const node = layer[j]
                node.x = i * 100
                node.y = j * 100
            }
        }
    }


    // NodeLayer 和 NeuralNetworkLayer 不同
    // NodeLayer 指的是图中的节点，NeuralNetworkLayer 指的是神经网络中的连接层
    // 所以 NodeLayer 的数量比 NeuralNetworkLayer 多 1
    static createNodeLayers() {
        // console.log('createNodeLayers')
        const nodeLayers: Node[][] = []

        const layers = network?.layers

        // 注意 NodeLayer 的数量比 NeuralNetworkLayer 多 1
        for (let i = 0; i < layers!.length + 1; i++) {
            const nodes = Node.createNodeLayer(i)
            nodeLayers.push(nodes)
        }

        Node.layoutNodes(nodeLayers)

        return nodeLayers
    }
    // 函数返回值示例 [Node, Node, Node, BiasNode]
    static createNodeLayer(layerIndex: number) {
        // console.log('createNodeLayer', layerIndex)
        const nodes: Node[] = []

        const layers = network?.layers

        if (layerIndex < layers!.length) { // 创建第 layerIndex 层的 NodeLayer，相当于 NeuralNetworkLayer 第 layerIndex 层的输入节点
            const layer = layers![layerIndex]
            for (let i = 0; i < layer.inputNodes; i++) {
                const node = new Node(layer, layerIndex, i)
                nodes.push(node)
            }
            nodes.push(new BiasNode(layer, layerIndex, 0))
            
        } else { // 创建最后一层 NodeLayer，相当于 NeuralNetworkLayer 最后一层的输出节点
            const layer = layers![layers!.length - 1]
            for (let i = 0; i < layer.outputNodes; i++) {
                const node = new Node(layer, layerIndex, i)
                nodes.push(node)
            }
            nodes.push(new BiasNode(layer, layerIndex, 0)) // 增加偏置节点
        }

        return nodes
    }


    static convertNodeLayersToNodeArr(nodeLayers: Node[][]) {
        return nodeLayers.flat()
    }


    getWeightTo(to: Node): number {
        const toIndex = to.index
        const weights = this.layer!.weights
        const weightsSize = weights.size()
        if (toIndex >= weightsSize[0] || this.index >= weightsSize[1]){
            console.log('this', this)
            console.log('toIndex', toIndex)
            console.log('this.index', this.index)
            console.log('weights.size()', weightsSize)
            console.warn('index out of range')
            return -1
        }
        const weight = this.layer!.weights.get([toIndex, this.index]) as number
        return weight
    }

    toJSON() {
        return {
            name: this.name,
            x: this.x,
            y: this.y
        }
    }
}


class BiasNode extends Node {
    constructor(layer: NeuralNetworkLayer, nodeLayerIndex: number, index: number) {
        super(layer, nodeLayerIndex, index)
        this.type = 'bias'
        this.name = `${nodeLayerIndex} bias_${index}`
    }

    getWeightTo(to: Node): number {
        const toIndex = to.index
        const bias = this.layer!.bias
        const biasSize = bias.size()
        if (toIndex >= biasSize[0] || this.index >= biasSize[1]){
            console.log('this', this)
            console.log('toIndex', toIndex)
            console.log('this.index', this.index)
            console.log('bias.size()', biasSize)
            console.warn('index out of range')
            return -1
        }
        const weight = this.layer!.bias.get([toIndex, 0]) as number
        return weight
    }
}




class Link {
    from: Node | null = null
    to: Node | null = null
    value: number = -1

    static createByNodes(from: Node, to: Node) {
        const link = new Link()

        link.from = from
        link.to = to

        const weight = from.getWeightTo(to)
        link.value = weight

        return link
    }

    static createBetweenNodeLayer(fromLayer: Node[], toLayer: Node[]) {
        const links: Link[] = []

        // console.log('fromLayer', fromLayer)
        // console.log('toLayer', toLayer)

        for (let i = 0; i < fromLayer.length; i++) {
            const fromNode = fromLayer[i]
            for (let j = 0; j < toLayer.length; j++) {
                const toNode = toLayer[j]
                if (toNode.type === 'bias') { // 偏置节点无需输入
                    continue
                }
                const link = Link.createByNodes(fromNode, toNode)
                links.push(link)
            }
        }

        return links
    }

    static createByNodeLayers(nodeLayer: Node[][]) {
        const links: Link[] = []

        for (let i = 0; i < nodeLayer.length - 1; i++) {
            const fromLayer = nodeLayer[i]
            const toLayer = nodeLayer[i + 1]

            links.push(...Link.createBetweenNodeLayer(fromLayer, toLayer))
        }

        return links
    }

    _getRelativeWidth() {
        const layers = network?.layers
        const weightsArr = layers!.map(layer => layer.weights.toArray()) as Array<number[][]>
        const flattenWeights = weightsArr.flat().flat() as number[]

        const maxWeight = Math.max(...flattenWeights)
        const minWeight = Math.min(...flattenWeights)

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
                formatter: `${this.value.toFixed(2)}`
            },
            lineStyle: {
                width: this._getRelativeWidth(),
                color: this.value > 0 ? '#5ab1ef' : '#f46542' // 正数为蓝色，负数为红色
            },
        }
    }
}




const nodesData: any[] = []
const linksData: any[] = []


function prepareData() {
    if (!network) {
        console.log('network is null')
        return
    }
    nodesData.length = 0
    linksData.length = 0

    const nodeLayers = Node.createNodeLayers()
    const nodes = Node.convertNodeLayersToNodeArr(nodeLayers)
    const links = Link.createByNodeLayers(nodeLayers)

    nodesData.push(...nodes.map(node => node.toJSON()))
    linksData.push(...links.map(link => link.toJSON()))

    // console.log('nodesData', nodesData)
    // console.log('linksData', linksData)
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
        for (const link of linksData) {
            if (link.source !== name && link.target !== name) {
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


function refreshChart() {
    prepareData()
    chartInstance?.setOption({
        series: {
            data: nodesData,
            links: linksData
        }
    })
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
  