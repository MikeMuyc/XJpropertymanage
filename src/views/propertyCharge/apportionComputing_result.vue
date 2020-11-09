<template>
    <div class="costTable" ref="costTable">
        <div class="costTitle" ref="costTitle">
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            公摊结果
        </div>
        <div class="middleline" ref="middleline">
            <div class="iconbox">
                <i class="iconfont iconjine"></i>
            </div>
            <div class="infoShow">
                <div class="leftInfo">
                    <i style="font-size: 18px;font-weight: bolder;">{{detailObj.ruleName}}</i>
                    <i style="font-size: 16px" v-if="detailObj.chargingDate"> / {{detailObj.chargingDate}}</i>
                    公摊结果
                    <div class="btnIcon green" v-if="detailObj.sharedBillingStatusCode == 2">已出账</div>
                    <div class="btnIcon orange" v-else>未出账</div>
                </div>
                <div class="rightInfo">
                    <div style="padding-right: 60px">
                        <i style="font-size: 16px;padding-right: 20px">应出账金额:</i>
                        <em style="color: #3a7ef3;">¥</em>
                        <em style="font-size: 22px;color: #3a7ef3;">{{detailObj.totalAp || 0}}</em>
                    </div>
                    <div style="padding-right: 60px">
                        <i style="font-size: 16px;padding-right: 20px">实出账金额:</i>
                        <em style="color: #ff2c2c;">¥</em>
                        <em style="font-size: 22px;color: #ff2c2c;">{{factCoast || 0}}</em>
                    </div>
                    <div style="display: flex">
                        <div class="pmbtn primary" style="margin-right: 15px" @click="recalculate">
                            <i class="iconfont iconbianji"></i>重新计算
                        </div>
                        <div class="pmbtn " @click="dialogVisible = true" >
                            <i class="iconfont iconzhangdan"></i>生成账单
                        </div>
                       <!-- <div class="pmbtn "  style="color: #c6c9ce;border: solid 1px #c6c9ce;">
                            <i class="iconfont iconzhangdan" style="color:#c6c9ce "></i>生成账单
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="searchline" ref="searchline">
            <mixSelect
                    class="margin"
                    v-model="sharedFeeStatus"
                    :selectList="villageList"
                    labelName="name"
                    valueName="code"
                    placeholder="费用状态"
                    style="width: 140px"
            >
            </mixSelect>
            <div class="margin" style="display: flex">
                <Input v-model="keyword" placeholder="请输入关键字" style="width: 200px;margin-right: 15px" @enter="getPage()"></Input>
                <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                    <i class="iconfont iconsousuo"></i>搜索
                </div>
                <div class="pmbtn" @click="reset">
                    <i class="iconfont iconzhongzhi"></i>重置
                </div>
            </div>
        </div>
        <el-table
                :data="resultList"
                stripe
                class="myWisdomTable"
                :height="formHeight"
                v-loading="loading"
                highlight-current-row
        >
            <template slot="empty" >
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>
            <el-table-column
                    label="序号"
                    width="60px"
                    align="center"
            >
                <template slot-scope="{row,$index}">
                    {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="roomName"
                    label="房间代码"
                    min-width="120px"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="proprietorName"
                    label="业主名称"
                    min-width="120px"
                    show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
                    prop="sharedMoney"
                    label="公摊金额(元)"
                    min-width="120px"
            >
                <template slot-scope="{row}">
                    <div v-show="row.id!==tableId" style="margin-left: 10px">{{row.sharedMoney}}</div>
                    <Input style="width: 50%" v-show="row.id===tableId" v-model="money"></Input>
                </template>
            </el-table-column>

            <el-table-column
                    prop="sharedFeeStatus"
                    label="费用状态"
                    min-width="120px"
                    show-overflow-tooltip
            >
                <template slot-scope="{row}">
                    <div v-if="row.sharedFeeStatus == 0" style="color:#ff9900">未缴费</div>
                    <div v-else-if="row.sharedFeeStatus == 1" style="color: #7c8185;">已缴费</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop=""
                    label="计费周期"
                    min-width="120px"
                    show-overflow-tooltip
            >
                <template slot-scope="{row}">
                    {{row.payStartDate}} ~ {{row.payEndDate}}
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="120px"
            >
                <template slot-scope="{row}">
                    <div class="tableEdit">
                        <div class="item" @click="editMoney(row.sharedMoney,row.id)"
                             v-show="row.id!==tableId&&row.sharedFeeStatus == 0">修改金额
                        </div>
                        <div v-show="row.id===tableId" style="display: flex;color: #3a7ef3;">
                            <div class="item" style="margin-right: 20px;cursor: pointer" @click="resetResult">确定</div>
                            <div class="item" @click="tableId=''" style="cursor: pointer">取消</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <Page show-elevator show-total
              :page-size="pages.pageSize"
              :current="pages.pageNum"
              :total="pages.totalElements"
              @on-change="getPage"
              ref="pagebox"
        />
        <el-dialog
                :visible.sync="dialogVisible"
                :append-to-body="true"
                custom-class="emDialog"
                width="400px"
                @click="closeDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                生成账单
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    设置应交日期
                </div>
                <div class="aline">
                    <div class="info">
                        <DatePicker type="date" placeholder="设置应交日期" style="width: 100%;" ref="payDate" @on-change="setPayDate"></DatePicker>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="confimBill">确定</div>
                <div class="pmbtn" @click="closeDialog">取消</div>
            </div>
        </el-dialog>

        <el-dialog
                :visible.sync="hintDialog"
                :append-to-body="true"
                custom-class="emDialog"
                width="460px"
                class="hintDialog"
        >
            <div slot="title" style="display: flex;align-items: center">
                <i class="el-icon-success" style="font-size: 19px;color: #1fbe07"></i>
                <i style="font-weight: bolder;margin-left: 10px;font-size: 16px;">操作成功</i>
            </div>
            <div>
                账单生成成功！请于<i style="color: #3a7ef3;">“计费收款”</i>处做相关收退费操作。
            </div>
            <div slot="footer">
                <div class="pmbtn primary" @click="hintDialog = false">确定</div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/propertyCharge/apportion'

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
            Input
        }
    })

    export default class costStatistics extends Vue {
        @Prop({
            default: '',
        }) resultId!: string;
        @Prop({
            default: false,
        }) resultShow!: boolean;

        @Watch(`resultShow`)
        setHeight() {
            if (this.resultShow) {
                let refs: any = this.$refs;
                //Page组件高度为53px
                this.formHeight = (refs.costTable.clientHeight - refs.searchline.clientHeight - refs.middleline.clientHeight - refs.costTitle.clientHeight) - 40 - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);

                this.getApportionrecordDetail();
                this.reset();
            }
        }

        detailObj: any = {
            ruleName: '',
            chargingDate: '',
            sharedBillingStatusCode: '',
            originalAp: '',
            totalAp: ''
        }

        money: number = 0
        villageList: any = [];

        resultList: any = [];
        formHeight: number = 900;
        dialogVisible: boolean = false

        sharedFeeStatus: string = '';
        keyword: string = '';
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        payDate:string='';
        hintDialog:boolean = false;
        subFlag: boolean = true;
        mounted() {
            this.getSelection(`villageList`, `公摊费用状态`);
        }

        async getSelection(Array: string, name: string) {
            let {data} = await api.getSelection(name);
            this[`${Array}`] = data;
        }

        async getApportionrecordDetail() {
            let {data} = await api.getApportionrecordDetail(this.resultId);
            this.detailObj = data;
        }
        factCoast:string | number = '';
        async sharedFact() {
            let {data:{count}} = await api.sharedFact({
                sharedFeeId: this.resultId,
                roomName: this.keyword,
                sharedFeeStatus: this.sharedFeeStatus,
            });
            this.factCoast = count;
        }

        loading:boolean = false
        async getResultList() {
            this.sharedFact();
            this.loading = true
            try {
                let {data: {content, totalElements}} = await api.getResultList({
                    pageNum: this.pages.pageNum,
                    pageSize: this.pages.pageSize,
                    sharedFeeId: this.resultId,
                    roomName: this.keyword,
                    sharedFeeStatus: this.sharedFeeStatus,
                });
                this.resultList = content;
                this.pages.totalElements = totalElements;
                this.loading = false
            }catch (e) {
                this.loading = false
            }
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getResultList();
        }

        reset() {
            this.keyword = '';
            this.sharedFeeStatus = '';
            this.getPage();
        }

        backClose() {
            this.$emit(`close`)
        }

        tableId: string = ''

        editMoney(money, id) {

            this.money = money
            this.tableId = id
        }
        async resetResult() {
            if (this.subFlag) {
                this.subFlag = false;
                try {
                    await api.resetResult(this.tableId, this.money)
                    this.tableId = ''
                    this.$message.success(`修改成功！`)
                    this.reset();
                } catch (e) {
                    this.$message.error(`修改失败！`)
                }
                this.subFlag = true;
            }


        }

        closeDialog(){
            let refs:any = this.$refs;
            refs.payDate.handleClear();
            this.dialogVisible = false;
        }
        setPayDate(val){
            this.payDate = val;
        }


        async confimBill() {
            if (this.subFlag) {
                this.subFlag = false;
                try {
                    await api.createAccount(this.resultId,this.payDate);
                    this.dialogVisible=false;
                    this.hintDialog = true;
                } catch (e) {
                    this.$message.error(`账单生成失败！`)
                }
                this.subFlag = true;
            }

        }

        recalculate() {
            api.judgeShared(this.resultId).then(res=>{
                if(res.data.result === 0){
                    this.sharedCalc()
                }
                else{
                    this.$message.error(`该项费用已有用户完成缴费，无法重新计算。`)
                }
            })
        }
        async sharedCalc(){
            if (this.subFlag) {
                this.subFlag = false;
                try {
                    await api.sharedCalc(this.resultId,true);
                    this.$message.success(`计算成功！`)
                    this.reset();
                } catch (e) {
                    this.$message.error(`计算失败！`)
                }
                this.subFlag = true;
            }

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

        .costTitle {
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;

            .back {
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

                .iconfont {
                    color: $theme-color;
                    font-size: 12px;
                    line-height: 1;
                    margin-right: 4px;
                    margin-bottom: 2px;
                }
            }
        }

        .middleline {
            height: 60px;
            background-color: #f8f9fc;
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            margin: 20px 0;

            .iconbox {
                height: 100%;
                width: 70px;
                background-image: linear-gradient(313deg,
                        #4d9aff 0%,
                        #3b66f6 100%);
                display: inline-flex;
                align-items: center;
                justify-content: center;

                .iconfont {
                    color: #fff;
                    font-size: 28px;
                }
            }

            .infoShow {
                width: 100%;
                padding: 0 20px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;

                .el-button {
                    padding: 0;
                    margin-left: 15px;
                    width: 63px;
                    height: 28px;
                    font-size: 13px;
                    border-radius: 4px;
                }

                .rightInfo {
                    display: flex;
                    align-items: center;

                    .iconbianji {
                        padding-right: 6px;
                        font-size: 18px;
                    }
                }
            }
        }

        .searchline {
            display: flex;
            flex-wrap: wrap;

            .margin {
                margin-right: 15px;
                margin-bottom: 20px;
                flex: none;
            }

            .item {
                height: 36px;
                display: inline-flex;
                align-items: center;
            }
        }

        .tableEdit {
            display: inline-flex;

            > .item {
                margin-right: 15px;
                color: $second-font-color;
                cursor: pointer;

                &:hover {
                    color: $theme-color;
                }

                &.delete:hover {
                    color: $error-color;
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    .btnIcon {
        padding: 0 10px;
        color: #ffffff;
        height: 28px;
        margin: 0 10px;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;

        &.green {
            background-color: #1fbe07;
        }

        &.orange {
            background-color: #ff9900;
        }
    }

</style>
