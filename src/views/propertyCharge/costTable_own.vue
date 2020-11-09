<template>
    <div class="costTable">
        <div class="costTitle">
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            小区收费汇总表
        </div>

        <div class="searchline">
            <div class="left">
                <div class="margin item" style="width: 180px">
                    小区
                    <mixSelect
                            v-model="villageId"
                            :selectList="villageList"
                            labelName="name"
                            valueName="val"
                            placeholder="小区"
                            style="width: 140px;margin-left: 10px"
                    >
                    </mixSelect>
                </div>
                <div class="margin item">
                    收费年月
                    <DatePicker type="daterange" placeholder="" style="width: 200px;margin-left: 10px"></DatePicker>
                </div>
                <div class="pmbtn margin">
                    <i class="iconfont iconzhongzhi"></i>重置
                </div>
                <div class="item margin">
                    <Checkbox >只展示非零收费项目</Checkbox>
                </div>
                <div class="item margin">
                    <Checkbox >显示费用合计</Checkbox>
                </div>
            </div>
            <div class="right">
                <div class="pmbtn margin">
                    <i class="iconfont icondayin"></i>打印
                </div>
                <div class="pmbtn margin">
                    <i class="iconfont icondaochu"></i>导出
                </div>

            </div>
        </div>

        <div class="borderbox" >
            <div class="boxtitle">
                <input v-model="tableTitle"/>
            </div>
            <div class="tip">
                <div style="width: 600px;display: flex">
                    <div class="margin">收费日期：2019-06-01 ~ 2020-06-01</div>
                    <div class="margin">查询日期：2020-06-01</div>
                </div>

            </div>
            <vue-perfect-scrollbar style="width: 100%;max-height: calc(100% - 50px);display: flex;justify-content: center">
                <div class="tablebox" style="width: 600px">
                    <div class="th">
                        <div class="cell tri">
                            <div class="row">费用项目</div>
                            <div class="column">费用类型</div>
                        </div>
                        <div class="cell">租金</div>
                        <div class="cell">水费</div>
                        <div class="cell">有偿使用费</div>
                        <div class="cell">合计</div>
                    </div>
                    <div class="tr">
                        <div class="cell">应收</div>
                        <div class="cell">120.00</div>
                        <div class="cell">115.23</div>
                        <div class="cell">198.3</div>
                        <div class="cell">1203.33</div>
                    </div>
                    <div class="tr">
                        <div class="cell">实收</div>
                        <div class="cell">120.00</div>
                        <div class="cell">115.23</div>
                        <div class="cell">198.3</div>
                        <div class="cell">1203.33</div>
                    </div>
                    <div class="tr">
                        <div class="cell">欠收</div>
                        <div class="cell">120.00</div>
                        <div class="cell">115.23</div>
                        <div class="cell">198.3</div>
                        <div class="cell">1203.33</div>
                    </div>
                    <div class="tr">
                        <div class="cell">合计</div>
                        <div class="cell">120.00</div>
                        <div class="cell">115.23</div>
                        <div class="cell">198.3</div>
                        <div class="cell">1203.33</div>
                    </div>
                </div>
            </vue-perfect-scrollbar>

        </div>



    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox} from 'view-design'
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
            Checkbox,
            tabNav,
            mixSelect,
        }
    })

    export default class costStatistics extends Vue {

        costState:number = 0;
        villageId:string = '';
        villageList:any = [
            {
                name:'天恒小区',
                val:'1',
            },
            {
                name:'地贺小区',
                val:'2',
            },
        ];

        tableTitle:string = '如意小区应收、实收、欠收费用汇总表';
        echartTitle:string = '如意小区收费用统计图';
        lessonType: any =  {

            textStyle: {
                color: `#30374a`,
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    let str = '';
                    if(params.length==2){
                        str = `${params[0].name}:${params[0].value+params[1].value}<br/>${params[0].seriesName}:${params[0].value}<br/>${params[1].seriesName}:${params[1].value}`;
                    }
                    else if(params.length==1){
                        str = `${params[0].seriesName}:${params[0].value}`;
                    }

                    return str;
                }
            },
            color:[`#568eff`,`#ccdfff`],
            legend:{
                data: ['实收', '欠收'],
                top: `1`,
                right: `20`,
                itemGap: 20,
                itemWidth: 16,
                itemHeight: 12,
                textStyle: {
                    color: `#333`,
                    fontSize: 14,
                },
            },

            grid: {
                left: `44`,
                right: `64`,
                top: '44',
                bottom: '20',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['租金', '停车费', '服务费', '水费', '有偿使用费', '电梯费'],
                    name: '',
                    nameLocation: 'end',
                    nameTextStyle: {

                    },
                    splitNumber: 12,
                    minInterval: 1,

                    axisLabel: {
                        fontSize: 12,
                        interval: 0,
                        //rotate:-24,
                        margin:16,
                        textStyle: {
                            color: '#333333'
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: `#c6c9ce`,
                        }
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    name: '金额/元',
                    axisLabel: {
                        fontSize: 10,
                        showMaxLabel: 'false',
                        textStyle: {
                            color: '#30374a'
                        },
                    },
                    nameLocation: 'end',
                    axisTick: {
                        show: false
                    },
                    nameTextStyle: {
                        color: `#30374a`,
                        fontSize:16,
                        padding:[0,10,10,0]
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color:'#dde4eb',
                            type:'dashed',
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: `#30374a`,
                            width:0,
                        }
                    }
                }
            ],
            series: [
                {
                    name: '实收',
                    type: 'bar',
                    itemStyle: {
                        barBorderRadius: [2, 2, 0, 0]
                    },
                    barWidth: 20,
                    data: [1500, 1200, 1330, 1240, 230, 1512, 1620,],
                    stack: '1',
                },
                {
                    name: '欠收',
                    type: 'bar',
                    itemStyle: {
                        barBorderRadius: [2, 2, 0, 0]
                    },
                    barWidth: 20,
                    data: [0, 100, 130, 140, 50, 100, 200,],
                    stack: '1',
                }

            ]
        };
        mounted() {

        }

        stateChange(num:number){
            this.costState = num;
        }
        backClose(){
            this.$emit(`close`)
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";
    .costTable {
        padding: 0 15px;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        .costTitle{
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;
            font-weight: bold;
            .back{
                display: inline-flex;
                align-items: center;
                color: $theme-color;
                font-size: 14px;
                padding-right: 10px;
                margin-right: 10px;
                height: 16px;
                border-right: 1px solid #dde4eb;
                cursor: pointer;
                user-select: none;
                font-weight: normal;
                .iconfont{
                    color: $theme-color;
                    font-size: 12px;
                    line-height: 1;
                    margin-right: 4px;
                    margin-bottom: 2px;
                }
            }
        }

        .searchline{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 20px;
            .left{
                display: flex;
                width: 540px;
            }
            .margin{
                margin-right: 15px;
                margin-bottom: 20px;
                flex: none;
            }
            .item{
                height: 36px;
                display: inline-flex;
                align-items: center;
            }
        }
        .borderbox{
            border: 1px solid #dde4eb;
            padding: 20px;
            width: 100%;
            height: calc(100% - 60px - 20px - 56px - 15px);
            .boxtitle{
                text-align: center;
                margin-bottom: 20px;
                >input{
                    font-size: 20px;
                    font-weight: bold;
                    border: 0;
                    border-bottom: 1px solid #dde4eb;
                    min-width: 600px;
                    text-align: center;
                }
            }
            .tip{
                display: flex;
                @extend .tipsText;
                margin-bottom: 10px;
                justify-content: center;
                .margin{
                    margin-right: 20px;
                }
            }
            .tablebox{
                border-left: 1px solid #a0a5a9;
                display: flex;
                flex-wrap: wrap;
                .th{
                    display: inline-flex;
                    border-top: 1px solid #a0a5a9;
                    height: 80px;
                }
                .tr{
                    display: inline-flex;
                    height: 60px;
                }
                .cell{
                    flex: none;
                    display: inline-flex;
                    width: 120px;
                    height: 100%;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid #a0a5a9;
                    border-right: 1px solid #a0a5a9;
                    &.tri{
                        background: linear-gradient(
                                        to top right,
                                        rgba(160,165,169,0) 0%,
                                        rgba(160,165,169,0) calc(50% - 1.5px),
                                        rgba(160,165,169,1) 50%,
                                        rgba(160,165,169,0) calc(50% + 1.5px),
                                        rgba(160,165,169,0) 100%
                        );
                        position: relative;
                        .row{
                            position: absolute;
                            right: 10px;
                            top: 10px;
                        }
                        .column{
                            position: absolute;
                            left: 10px;
                            bottom: 10px;
                        }
                    }
                }
            }
        }
    }



</style>
