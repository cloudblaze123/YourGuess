import { Result } from '@/game/game';
import type { ECharts, EChartsOption } from 'echarts';
import { getResultMessage } from '@/game/game';




function generateChartOption(max: number, min: number, animation: boolean = false) {
    const option:EChartsOption = {
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

                data : [],

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

                min: min,
                max: max,

                axisPointer: {
                    show: true,
                    type: 'line',
                    label: {
                        formatter: (params: any) => {
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
                    formatter: (params: any) => {
                        return `${params.data.value}\n${getResultMessage(params.data.result)}`
                    }
                },
                itemStyle: {
                    color: (params: any) => {
                        const result = params.data.result;
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
        animation: animation,
        animationDuration: 200,
    };
    
    return option;
}


function updateChart(chart: ECharts, guessData: number[], resultData: Result[]) {
    const xAxisData = Array(guessData.length + 5)
        .fill(0)
        .map((_, i) => i+1)
    const xAxis = [
        {
            data: xAxisData
        }
    ]

    chart.setOption({
        xAxis: xAxis,
        series: [
            {
                data: guessData.map((value, index) => {
                    return {
                        value: value,
                        result: resultData[index]
                    }
                })
            }
        ]
    });
}


export { generateChartOption, updateChart }