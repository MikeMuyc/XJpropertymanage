<template>
    <div class="noticePrint">
        <div class="costTitle">
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            收款通知单
        </div>

        <div class="searchline">
            <div class="left">
                <div class="margin item" >
                    收费项目
                    <mixSelect
                            v-model="projectId"
                            :selectList="projectList"
                            labelName="name"
                            valueName="val"
                            placeholder="项目"
                            style="width: 140px;margin-left: 10px"
                    >
                    </mixSelect>
                </div>
                <div class="margin item">
                    收费年月
                    <DatePicker type="daterange" placeholder="开始时间  ~  结束时间" style="width: 200px;margin-left: 10px"></DatePicker>
                </div>
                <div class="pmbtn margin">
                    <i class="iconfont iconzhongzhi"></i>重置
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

        <div class="noticeBox">
            <div class="noticeTitle">收款通知单</div>
            <div class="secondLine">
                <div class="item">
                    <div class="item">管理区名称：如意苑</div>
                    <div class="item">大楼名称：如意苑01号楼</div>
                </div>
                <div class="right">打印日期：2020-06-01</div>
            </div>
            <div class="noticeMain">
                <div class="noticeLine gray">
                    <div class="noticeItem flex5">
                        房间代码：RYY-2-1-101&nbsp;&nbsp;&nbsp;&nbsp;
                        户主名称：刘阳
                    </div>
                </div>
                <div class="noticeLine gray">
                    <div class="noticeItem">收费名称</div>
                    <div class="noticeItem">上月读数</div>
                    <div class="noticeItem">本月读数</div>
                    <div class="noticeItem">计费用量</div>
                    <div class="noticeItem">标准单价</div>
                    <div class="noticeItem">计外单价</div>
                    <div class="noticeItem">本月费用</div>
                    <div class="noticeItem">往月欠交</div>
                    <div class="noticeItem">滞纳金</div>
                    <div class="noticeItem">应交合计</div>
                </div>
                <div class="noticeLine">
                    <div class="noticeItem">固定停车费</div>
                    <div class="noticeItem flex5">2020年6月1日 ~2020年6月30日</div>

                    <div class="noticeItem">80.00</div>
                    <div class="noticeItem">12.00</div>
                    <div class="noticeItem">1.50</div>
                    <div class="noticeItem">140.00</div>
                </div>
                <div class="noticeLine">
                    <div class="noticeItem">水费</div>
                    <div class="noticeItem">12</div>
                    <div class="noticeItem">16</div>
                    <div class="noticeItem">1.06</div>
                    <div class="noticeItem">2.50</div>
                    <div class="noticeItem">0</div>
                    <div class="noticeItem">32.00</div>
                    <div class="noticeItem">0.00</div>
                    <div class="noticeItem">0.00</div>
                    <div class="noticeItem">32.00</div>
                </div>
                <div class="noticeLine">
                    <div class="noticeItem">合计金额(小写)</div>
                    <div class="noticeItem flex5"></div>

                    <div class="noticeItem">112.00</div>
                    <div class="noticeItem">12.00</div>
                    <div class="noticeItem">1.50</div>
                    <div class="noticeItem">172.00</div>
                </div>
                <div class="noticeLine gray">
                    <div class="noticeItem" style="width:100%;justify-content: center">
                        ¥ 肆佰捌拾伍元捌角
                    </div>
                </div>
                <div class="bottomLine">
                    <div class="left"></div>
                    <div class="right"></div>
                </div>
            </div>
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

        projectId:string = '';
        projectList:any = [
            {
                name:'水费',
                val:'1',
            },
            {
                name:'电费',
                val:'2',
            },
        ];

        mounted() {

        }

        stateChange(num:number){

        }
        backClose(){
            this.$emit(`close`)
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/standard-global";
    .noticePrint {
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

        .noticeBox{
            padding: 30px 20px;
            border: solid 1px #dde4eb;
            font-size: 15px;
            .noticeTitle{
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 30px;
                text-align: center;
            }
            .secondLine{
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                .item{
                    display: inline-flex;
                    margin-right: 80px;
                }
            }
            .noticeMain{
                border: solid 1px #dde4eb;
            }
            .noticeLine{
                border-bottom: solid 1px #dde4eb;
                display: flex;
                align-items: center;
                &.gray{
                    background-color: #f4f6f9;
                }
                >.noticeItem{
                    display: flex;
                    align-items: center;
                    height: 50px;
                    width: 10%;
                    padding: 0 20px;
                    border-right: solid 1px #dde4eb;
                    &.flex5{
                        width: 50%;
                    }
                    &:last-child{
                        border-right: 0;
                    }
                }
            }
            .bottomLine{
                display: flex;
                height: 160px;
                .left{
                    width: 80%;
                }
                .right{
                    width: 20%;
                    border-left: solid 1px #dde4eb;
                }
            }
        }
    }



</style>
