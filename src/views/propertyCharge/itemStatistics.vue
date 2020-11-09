<template>
    <div id="itemStatistics" ref="viewbox">
        <div class="thTitle" ref="thTitle">
            <i class="line"></i>收款员交款统计
        </div>
        <div class="searchline" ref="searchline">
            <mixSelect
                    class="margin"
                    v-model="payTypeCode"
                    :selectList="paywayList"
                    labelName="name"
                    valueName="code"
                    placeholder="收款方式"
                    style="width: 140px"
            >
            </mixSelect>
            <div class="margin item">
                收款时间
                <DatePicker type="datetimerange"
                            format="yyyy-MM-dd"
                            placeholder="开始时间   ~   结束时间"
                            style="width: 200px;margin-left: 8px"
                            @on-change="dateChange"
                            ref="timerange">
                </DatePicker>
            </div>

            <div class="margin item">
                <Input v-model="roomName" placeholder="房间代码" style="width: 200px;margin-right: 15px" @enter="getPage()"></Input>
                <Input v-model="createPerson" placeholder="请输入收款人姓名" style="width: 200px;margin-right: 15px" @enter="getPage()"></Input>
                <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                    <i class="iconfont iconsousuo"></i>搜索
                </div>
                <div class="pmbtn" @click="resetSearch">
                    <i class="iconfont iconzhongzhi"></i>重置
                </div>

            </div>
            <div class="pmbtn margin" >
                <i class="iconfont icondaoru"></i>导出
            </div>
        </div>
        <el-table
                stripe
                v-loading="loading"
                class="myTable"
                :data="tableData"
                :height="formHeight"
        >
            <template slot="empty" >
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>
            <el-table-column
                    prop="documentCode"
                    label="单据编号"
                    min-width="150"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    prop="personName"
                    label="收款人"
                    min-width="80"
            ></el-table-column>
            <el-table-column
                    prop="roomName"
                    label="房间代码"
                    min-width="140"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    prop="projectName"
                    label="收费项目"
                    min-width="120"
            ></el-table-column>
            <el-table-column
                    prop="paidTime"
                    label="收款日期"
                    min-width="170"
            ></el-table-column>
            <el-table-column
                    prop="payType"
                    label="收款方式"
                    min-width="100"
            ></el-table-column>
            <el-table-column
                    prop="totalAp"
                    label="实收金额(元)"
                    min-width="120"
            ></el-table-column>
        </el-table>
        <div class="bottomLine">
            <div class="moneySum" ref="moneySum" v-show="show">
                <div class="aggregate" v-for="item in totalDate">
                    <img v-if="item.id === `total`" src="../../images/总计.png">
                    <img v-else-if="item.id === `2`"  src="../../images/现金.png">
                    <img v-else-if="item.id === `3`" src="../../images/手机.png">
                    <img v-else-if="item.id === `1`" src="../../images/POS.png">
                    <i class="a">{{item.name}}</i>
                    <i>￥</i>
                    <i class="b">{{item.count}}</i>
                </div>
            </div>
            <Page show-elevator show-total
                  :page-size="pages.pageSize"
                  :current="pages.pageNum"
                  :total="pages.totalElements"
                  @on-change="getPage"
                  ref="pagebox"
                  style="width: 504px"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {Select,  Page, Button, Option, Icon, Spin, DatePicker, RadioGroup, Radio} from 'view-design'
    import { Tree } from 'iview'
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue'
    import * as api from '@manage/api/propertyCharge/itemStatistics'

    @Component({
        components: {
            Icon,
            Input,
            Select,
            Option,
            Tree,
            Page,
            Button,
            Spin,
            DatePicker,
            mixSelect,
            RadioGroup,
            Radio
        }
    })

    export default class itemStatistics extends Vue {

        roomName:string = '';
        createPerson:string = '';
        payTypeCode:string = '';
        startTime:string = '';
        endTime:string = '';


        tableData: any = [];
        totalDate:Array<{
            "id": string,
            "name": string,
            "count": number,
            "keyName": string
        }> = [];
        paywayList: any = [];
        show: boolean = true

        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        formHeight: number = 600
        loading: boolean = false

        mounted() {
            this.getPayType();
            this.$nextTick(() => {
                let refs: any = this.$refs;
                let maxHeight = refs.viewbox.clientHeight - 10;
                let thTitle = refs.thTitle.clientHeight;
                let searchline = refs.searchline.clientHeight;
                this.formHeight = maxHeight - thTitle - searchline - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                this.resetSearch();
            })
        }

        async getCashlist(){
            this.loading = true;
            try {
                let {data: {content, totalElements}} = await api.getCashlist({
                    pageNum:this.pages.pageNum,
                    pageSize:this.pages.pageSize,
                    startTime:this.startTime,
                    endTime:this.endTime,
                    createPerson:this.createPerson,
                    payTypeCode:this.payTypeCode,
                    roomName:this.roomName,
                });
                this.tableData = content;
                this.pages.totalElements = totalElements;
                this.loading = false;
            }catch (e) {
                this.loading = false;
                this.$message.error(`获取统计列表失败！`)
            }
        }
        async getCashTotal(){

            try {
                let {data} = await api.getCashTotal({
                    pageNum:this.pages.pageNum,
                    pageSize:this.pages.pageSize,
                    startTime:this.startTime,
                    endTime:this.endTime,
                    createPerson:this.createPerson,
                    payTypeCode:this.payTypeCode,
                    roomName:this.roomName,
                });
                this.totalDate = data;
            }catch (e) {
                this.$message.error(`获取统计数据失败！`)
            }
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getCashlist();
            this.getCashTotal();
        }

        resetSearch(){
            this.roomName = '';
            this.createPerson = '';
            this.payTypeCode = '';
            this.startTime = '';
            this.endTime = '';

            let refs:any = this.$refs;
            refs.timerange.handleClear();
            this.getPage();
        }

        //支付方式
        async getPayType() {
            let {data} = await api.getInfoByName('支付方式')
            this.paywayList = data
            this.paywayList.unshift({
                name:'所有方式',
                code:''
            })
        }

        dateChange(val) {
            this.startTime = val[0];
            this.endTime = val[1];
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #itemStatistics {
        font-size: 14px;
        .searchline {
            padding: 20px 0px;
            display: flex;
            flex-wrap: wrap;

            .margin {
                margin-right: 15px;
                display: flex;
                align-items: center;
            }
        }

        .bottomLine{
            display: flex;
            align-content: center;
            justify-content: space-between;
            .moneySum {
                height: 54px;
                display: flex;
                align-items: center;
                flex:1;
                max-width: 1000px;
                justify-content: space-between;

                .aggregate {
                    height: 24px;
                    display: flex;
                    align-items: center;
                    margin-right: 10px;

                    .a {
                        white-space: nowrap;
                        padding: 0 10px;
                        color: $second-font-color;
                    }

                    .b {
                        font-size: 18px;
                        white-space: nowrap;
                    }
                }
            }
        }

    }
</style>
<style lang="scss">

    #itemStatistics {
        .el-table::before {
            height: 0;
        }

    }
</style>
