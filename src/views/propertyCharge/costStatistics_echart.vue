<template>
    <div class="viewbox" ref="viewbox">
        <div class="header">
            <div class="moneyInfo">
                <div class="items">
                    <div class="graph" style=" background-image: linear-gradient(270deg, #1e71ff 0%, #3db1ff 100%);">
                        <i class="iconfont iconjine"></i>
                    </div>
                    <div class="character">
                        <div class="des">应收费总金额</div>
                        <div class="money">
                            <i>￥</i>
                            <i style="font-size: 22px">12340.00</i>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <div class="graph" style="background-image: linear-gradient(271deg, #3fe8b5 0%, #00c2e1 100%);">
                        <i>收</i>
                    </div>
                    <div class="character">
                        <div class="des">已收费金额</div>
                        <div class="money">
                            <i>￥</i>
                            <i style="font-size: 22px">12340.00</i>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <div class="graph" style="background-image: linear-gradient(269deg,#ff762e 0%,#ffbd24 100%);">
                        <i>欠</i>
                    </div>
                    <div class="character">
                        <div class="des">欠收费金额</div>
                        <div class="money">
                            <i>￥</i>
                            <i style="font-size: 22px">12340.00</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search">
                <mixSelect
                        class="selectLeft"
                        v-model="estateId"
                        :selectList="orderStateList"
                        labelName="name"
                        valueName="val"
                        childrenName="children"
                        placeholder="小区"
                >
                </mixSelect>
                <mixSelect
                        class="selectLeft"
                        v-model="year"
                        :selectList="yearlist"
                        labelName="name"
                        valueName="val"
                        childrenName="children"
                        placeholder="2020"
                >
                </mixSelect>
            </div>
        </div>
        <div class="echart">
            <div class="myChart">
                <div class="thTitle">
                    <i class="line"></i>项目收费统计
                </div>
                <v-chart :options="option1" :autoResize="true"
                         style="width:100%;height:calc(100% - 55px);position: relative;"/>
            </div>
            <div class="myChart2">
                <div class="charge">
                    <div class="thTitle">
                        <i class="line"></i>收费月统计
                    </div>
                    <v-chart :options="option2" :autoResize="true"
                             style="width:100%;height:calc(100% - 55px);position: relative;"/>
                </div>
                <div class="arrearage">
                    <div class="thTitle">
                        <i class="line"></i>欠费月趋势
                    </div>
                    <v-chart :options="option3" :autoResize="true"
                             style="width:100%;height:calc(100% - 55px);position: relative;"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';

    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            tabNav,
            mixSelect,
        }
    })

    export default class costStatistics extends Vue {

        orderStateList: any = [
            {
                val: '',
                name: '全部小区',
            },
            {
                val: '0',
                name: '畅和园',
            },
            {
                val: '1',
                name: '和合苑',
            },
            {
                val: '3',
                name: '拱山小区',
            },
            {
                val: '4',
                name: '丽景园',
            },
        ];
        yearlist:any=[
            {
                name:'2020',
                val:'2020'
            },
            {
                name:'2019',
                val:'2019'
            },
            {
                name:'2018',
                val:'2018'
            },
            {
                name:'2017',
                val:'2017'
            },
        ]
        estateId: string = '';
        year:string='';
        option1 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
                },
                backgroundColor: '#fff',
                textStyle: {
                    color: '#7c8185'
                },
                extraCssText: 'width:140px;height:72px;box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);border-radius: 4px;',
                formatter: function (params) {
                    var showdata = params[0];
                    var showdata2 = params[1];
                    return `
<div style="width: 14px;height: 14px;background-color: #ccdcff;border-radius: 2px; margin: 10px 0 0 10px; line-height: 14px">
<i style="padding-left: 22px">应收：</i><i style="color: #30374a">${showdata2.data}</i></div>
<div style="width: 14px;height: 14px;background-color: #568eff;border-radius: 2px;margin: 15px 0 0 10px;line-height: 14px">
                            <i style="padding-left: 22px">实收：</i><i style="color: #30374a">${showdata.data}</i></div>
                           `
                }
            },
            legend: {
                data: ['应收', '实收'],
                itemWidth: 14,
                itemHeight: 14,
                itemGap: 48,
                top: '20px',
                right: '20'
            },
            grid: {
                left: '27px',
                right: '20px',
                bottom: '30px',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['租金', '租金', '租金', '租金', '租金', '租金', '租金', '租金', '租金', '租金', '租金', '租金', '租金', '租金', '租金'],
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#c6c9ce'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#333'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '金额/元',
                    interval: 1000,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#dde4eb',
                            width: 1
                        }
                    },
                    nameTextStyle: {
                        color: ' #30374a',
                        align: 'right',
                        verticalAlign: 'bottom'
                    },
                    nameGap: 30,
                    axisLabel: {
                        textStyle: {
                            color: '#7c8185'
                        }
                    }
                }
            ],
            series: [

                {
                    name: '实收',
                    type: 'bar',
                    barWidth: '18px',
                    color: '#568eff',
                    z: 10,
                    data: [1000, 2000, 2000, 3000, 3400, 4000, 2200, 2000, 2000, 3000, 4000, 5000, 1000, 5000, 5000]
                },
                {
                    barGap: '-100%',
                    name: '应收',
                    type: 'bar',
                    barWidth: '18px',
                    color: '#ccdfff',
                    data: [2000, 4000, 3000, 5000, 4000, 5000, 3000, 2000, 4000, 6000, 8000, 6000, 5000, 7000, 5000]
                },
            ]
        }
        option2 = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['实收金额', '同比欠收率'],
                top: '20px',
                icon: "roundRect",
                itemWidth: 14,
                itemHeight: 14,
                itemGap: 48,
            },
            grid: {
                left: '27px',
                right: '20px',
                bottom: '30px',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],

                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#c6c9ce'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#333'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '实收金额/元',
                    max: 8000,
                    min: 0,
                    interval: 1000,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#dde4eb',
                            width: 1
                        }
                    },
                    nameTextStyle: {
                        color: ' #30374a',
                        align: 'center',
                        verticalAlign: 'bottom',
                        padding: [0, 20, 0, 0],
                    },
                    nameGap: 30,
                    axisLabel: {
                        textStyle: {
                            color: '#7c8185'
                        }
                    }
                },
                {
                    type: 'value',
                    name: '同比欠收率',
                    interval: 0.1,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#dde4eb',
                            width: 1
                        }
                    },
                    nameTextStyle: {
                        color: ' #30374a',
                        align: 'center',
                        verticalAlign: 'bottom'
                    },
                    nameGap: 30,
                    axisLabel: {
                        textStyle: {
                            color: '#7c8185'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '实收金额',
                    type: 'bar',
                    barWidth: '18px',
                    color: '#568eff',
                    data: [6000, 3000, 5000, 6000, 4400, 3000, 4200, 5000, 2900, 4000, 6000, 4500]
                },
                {
                    name: '同比欠收率',
                    type: 'line',
                    yAxisIndex: 1,
                    symbol: 'none',
                    color: '#ffc400',
                    lineStyle: {
                        height: 3,
                        type: 'dashed',
                        color: '#ffc400',
                    },
                    data: [-0.1, 0, -0.2, -0.15, 0, -0.1, 0.1, 0.4, 0, -0.4, 0, 0.4]
                },
            ]
        }

        option3 = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '27px',
                right: '20px',
                bottom: '30px',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],

                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#c6c9ce'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#333'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '欠收金额/元',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#dde4eb',
                            width: 1
                        }
                    },
                    nameTextStyle: {
                        color: ' #30374a',
                        align: 'center',
                        verticalAlign: 'bottom',
                        padding: [0, 20, 0, 0],
                    },
                    nameGap: 30,
                    axisLabel: {
                        textStyle: {
                            color: '#7c8185'
                        }
                    }
                }
            ],
            series: [

                {
                    name: '欠收金额',
                    type: 'line',
                    symbol: 'none',
                    lineStyle: {
                        color: '#6ca9ff',
                        width: 2
                    },
                    data: [1000, 2000, 2000, 3000, 3400, 4000, 2200, 8000, 5000, 6000, 1000, 2000],
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 1,
                            x2: 0,
                            y2: 0,
                            colorStops: [
                                {offset: 0, color: 'rgba(86, 142, 255, 0.19)'},
                                {offset: 1, color: '#568eff'}],
                            global: false
                        },
                        opacity: 0.16
                    },
                },
            ]
        }

        mounted() {
        }

        projectSearch(val) {
            console.log(val)
        }


    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    .header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-top: 5px;
        .moneyInfo {
            display: flex;
            .items {
                width: 240px;
                height: 80px;
                background-color: #ffffff;
                box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
                border-radius: 4px;
                padding-left: 15px;
                margin-right: 20px;
                display: flex;
                align-items: center;

                .graph {
                    width: 50px;
                    height: 50px;
                    margin-right: 12px;
                    border-radius: 100%;
                    display: flex;

                    i {
                        color: #fff;
                        font-size: 22px;
                        margin: auto;
                    }
                }

                .des {
                    color: #7c8185
                }
            }
        }

        .search {
            display: flex;
            width: 275px;

            .selectLeft {
                margin-left: 15px;
                height: 36px;
            }
        }
    }

    .echart {
        height: calc(100% - 90px);
        display: flex;
        flex-wrap: wrap;
        padding-top: 20px;

        .myChart {
            width: 100%;
            height: calc(50% - 10px);
            background-color: #ffffff;
            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
        }

        .myChart2 {
            width: 100%;
            height: calc(50% - 10px);
            display: flex;
            margin-top: 20px;

            .charge {
                width: 50%;
                height: 100%;
                background-color: #ffffff;
                box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                margin-right: 20px;
            }

            .arrearage {
                width: 50%;
                height: 100%;
                background-color: #ffffff;
                box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
                border-radius: 4px;
            }
        }
    }

    .thTitle {
        border-bottom: 0;

        .line {
            width: 4px;
            height: 12px;
            background-color: #3a7ef3;
            border-radius: 2px;
            margin-right: 10px;
        }
        margin: 0 15px;
        font-size: 16px;
        display: flex;
        align-items: center;
        height: 50px;
    }
</style>
<style lang="scss">

</style>
