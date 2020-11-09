<template>
    <div id="calcCharge">
        <tabNav :tabList="tabList" @tabChange="tabChange"></tabNav>

        <div class="viewbox" ref="viewbox">
            <div v-if="buildingTree.length === 0" class="viewboxMain empty">
                <img src="@manage/images/暂无2.png">
                <br>
                <p>暂无数据，请先至 <i @click="$router.push({name:'房产管理'})">房产管理</i> 处添加小区</p>
            </div>
            <div v-else class="viewboxMain">

                <buildingTree @inited="inited"></buildingTree>
                <div class="borderRight"></div>
                <transition name="leftSlide">
                    <div v-show="tabName === '欠款明细'" class="rightMain">
                        <div v-show="curObject.id" style="width: 100%;height: 100%;" ref="rightMain">
                            <div class="searchline" ref="searchline">
                                <div style="display: flex;flex-wrap: wrap">
                                    <mixSelect
                                            class="margin"
                                            v-model="projectType"
                                            :selectList="projectTypeList"
                                            labelName="name"
                                            valueName="code"
                                            placeholder="收费类型"
                                            style="width: 140px"
                                            @sentItem="feeProjrctType"
                                    >
                                    </mixSelect>
                                    <mixSelect
                                            :disabled="projectType === ''"
                                            class="margin"
                                            v-model="projectId"
                                            :selectList="projectList"
                                            labelName="name"
                                            valueName="id"
                                            placeholder="收费项目"
                                            style="width: 140px"
                                    >
                                    </mixSelect>
                                    <div class="margin item">
                                        收费年月
                                        <DatePicker
                                                type="month"
                                                placeholder="开始时间"
                                                style="width: 140px;margin: 0 10px"
                                                @on-change="paysDate"
                                                :options="paysDateOpt">
                                        </DatePicker>
                                        -
                                        <DatePicker
                                                type="month"
                                                placeholder="结束时间"
                                                style="width: 140px;margin: 0 10px"
                                                @on-change="payeDate"
                                                :options="payeDateOpt">
                                        </DatePicker>
                                    </div>

                                    <div class="margin item">
                                        应交日期
                                        <DatePicker ref="dateForm" type="daterange" placeholder="开始时间 ~ 结束时间"
                                                    style="width: 200px;margin-left: 8px"
                                                    @on-change="payableDate"></DatePicker>
                                    </div>
                                    <div class="margin" style="display: flex">
                                        <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px"
                                               v-model="keyword" @enter="getPage()"></Input>
                                        <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                                            <i class="iconfont iconsousuo"></i>搜索
                                        </div>
                                        <div class="pmbtn" @click="resetInfo">
                                            <i class="iconfont iconzhongzhi"></i>重置
                                        </div>
                                    </div>
                                </div>
                                <div class="margin item">
                                    <div class="pmbtn primary" :class="{disable:checkList.length === 0}"
                                         style="margin-right: 15px" @click="openReceive">
                                        <i class="iconfont iconwuyeshoukuan"></i>
                                        收款
                                    </div>
                                    <div class="pmbtn" style="margin-right: 15px" @click="noticeShow = true">
                                        打印通知单
                                    </div>
                                    <div class="pmbtn" style="margin-right: 15px" @click="openTemporary">临时收费</div>
                                    <div class="pmbtn" style="margin-right: 15px" @click="calcHover = !calcHover"
                                         v-clickoutside="closeHover1">
                                        提前计算
                                        <div class="btnSelection" :class="{active:calcHover === true}">
                                            <div class="selItem" @click="openAdvance">当前房间</div>
                                            <div class="selItem" @click="openGroupAdvance">批量计算</div>
                                        </div>
                                    </div>


                                    <div class="pmbtn" @click="calcHover2 = !calcHover2" v-clickoutside="closeHover2">
                                        走表录入
                                        <div class="btnSelection" :class="{active:calcHover2 === true}">
                                            <div class="selItem" @click="openMeter">当前房间</div>
                                            <div class="selItem">批量导入</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="middleline" ref="middleline">
                                <div class="iconbox">
                                    <i class="iconfont iconjine"></i>
                                </div>
                                <div class="info">
                                    账户余额：
                                    <i style="color: #3a7ef3;">￥</i>
                                    <em style="color: #3a7ef3;">{{proprietorNum}}</em>
                                </div>
                                <div class="info" v-if="checkList.length===0">
                                    欠交总额：
                                    <i>￥</i>
                                    <em>{{total.count || 0}}</em>
                                </div>
                                <div class="info" v-else>
                                    已选欠交总额：
                                    <i>￥</i>
                                    <em>{{sumFeeDialog || 0}}</em>
                                </div>
                            </div>
                            <el-table
                                    :data="LackOfDetailTable"
                                    stripe
                                    v-loading="loading"
                                    class="myWisdomTable"
                                    :height="formHeight"
                                    @selection-change="handleSelectionChange"
                                    ref="LackOfDetailRef"
                            >
                                <template slot="empty">
                                    <img src="@manage/images/暂无数据.png">
                                    <br>
                                    暂无内容
                                </template>
                                <el-table-column
                                        type="selection"
                                        width="60">
                                </el-table-column>
                                <!-- <el-table-column
                                         prop="proprietorName"
                                         label="客户名称"
                                         min-width="120px"
                                         show-overflow-tooltip
                                 >
                                 </el-table-column>-->

                                <el-table-column
                                        prop="chargingDate"
                                        label="收费年月"
                                        width="120px"
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="projectTypeCode"
                                        label="收费类型"
                                        min-width="100px"
                                        show-overflow-tooltip
                                >
                                    <template slot-scope="{row,$index}">
                                        {{projectTypeRename(row.projectTypeCode)}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="projectName"
                                        label="收费项目"
                                        min-width="120px"
                                        show-overflow-tooltip
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="capital"
                                        label="本金金额(元)"
                                        min-width="120px"
                                        show-overflow-tooltip
                                >
                                </el-table-column>
                                <el-table-column
                                        prop="lateFee"
                                        label="滞纳金金额(元)"
                                        min-width="120px"
                                        show-overflow-tooltip
                                >
                                </el-table-column>
                                <el-table-column
                                        label="欠交金额(元)"
                                        min-width="120px"
                                        show-overflow-tooltip
                                >
                                    <template slot-scope="{row,$index}">
                                        <div style="color: #ff3737;">{{row.totalAp}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="temporary"
                                        label="是否临时收费"
                                        min-width="120px"
                                        show-overflow-tooltip
                                >
                                    <template slot-scope="{row}">
                                        <div v-if="row.temporary===0">否</div>
                                        <div v-else>是</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop=""
                                        label="计费周期"
                                        min-width="210px"
                                        show-overflow-tooltip
                                >
                                    <template slot-scope="{row}">
                                        {{row.payStartDate}} ~ {{row.payEndDate}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="payableDate"
                                        label="应交日期"
                                        min-width="120px"
                                        show-overflow-tooltip
                                >
                                    <template slot-scope="{row}">
                                        {{row.payableDate||`无`}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="remark"
                                        label="备注"
                                        min-width="120px"
                                        show-overflow-tooltip
                                >
                                    <template slot-scope="{row,$index}">
                                        <div style="color: #7c8185;">{{row.remark}}</div>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                        label="操作"
                                        width="120px"
                                >
                                    <template slot-scope="{row}">
                                        <div class="tableEdit">
                                            <div class="item" @click="resetCrash(row)">重置金额</div>
                                            <div class="item delete" @click="deleteFee([row.id])">删除</div>
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
                        </div>
                        <div v-show="curObject.id === ''" class="empty">
                            <img src="@manage/images/暂无1.png" alt="">
                            <p>请在左侧选择一个房间</p>
                        </div>
                    </div>
                </transition>
                <transition name="rightSlide">
                    <chargeList v-show="tabName === '缴费记录'"
                                :showFlag="tabName === '缴费记录'"
                                :curObject="curObject"
                                :projectTypeList="projectTypeList"
                                :buildingTree="buildingTree"
                                :fTreeObj="curObject"
                    >
                    </chargeList>
                </transition>
            </div>
        </div>


        <el-dialog
                :visible.sync="resetDialog"
                custom-class="emDialog"
                width="520px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close="closeReset"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                重置金额
            </div>
            <div class="resetModalContent">
                <div class="aline">
                    <div class="label">房间代码</div>
                    <div class="info">
                        <div class="disabledbox">{{curObject.title}}</div>
                    </div>
                </div>
                <!--<div class="aline">
                    <div class="label">客户名称</div>
                    <div class="info">
                        <div class="disabledbox">{{LackOfDetailById.proprietorName}}</div>
                    </div>
                </div>-->
                <div class="aline">
                    <div class="label">收费年月</div>
                    <div class="info">
                        <div class="disabledbox">{{LackOfDetailById.chargingDate}}</div>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">收费项目</div>
                    <div class="info">
                        <div class="disabledbox">{{LackOfDetailById.projectName}}</div>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">原收费金额</div>
                    <div class="info">
                        <div class="disabledbox">{{LackOfDetailById.capital}}
                            <!--{{LackOfDetailById.totalAp + LackOfDetailById.adjustAp}}--></div>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">欠交金额</div>
                    <div class="info">
                        <div class="disabledbox" style="color: #ff2c2c;">{{LackOfDetailById.totalAp}}</div>
                    </div>
                </div>
                <div class="aline" style="margin-bottom: 0">
                    <div class="label">新收费金额</div>
                    <div class="info">
                        <Input type="2fixed" v-model="rePay" placeholder="请输入新收费金额"></Input>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="confirmReast">确定</div>
                <div class="pmbtn" @click="closeReset">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                v-if="receiveDialog"
                :visible.sync="receiveDialog"
                custom-class="emDialog"
                width="520px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close="closeReceive"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                收款
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">房间代码</div>
                    <div class="info" style="width:120px">
                        {{curObject.title}}
                    </div>
                    <div class="label" v-if="proprietorName">客户名称：</div>
                    <div class="info" v-if="proprietorName" style="width:120px">
                        {{proprietorName}}
                    </div>
                </div>
                <div class="aline">
                    <div class="label">费用合计</div>
                    <div class="info receive">
                        <i>￥</i>
                        <em>{{sumFeeDialog}}</em>
                    </div>
                    <div class="label">账户余额</div>
                    <div class="info receive">
                        <i>￥</i>
                        <em>{{proprietorNum}}</em>
                    </div>
                </div>
                <div class="borderLine"></div>
                <div class="aline">
                    <div class="label" style="color: #30374a;"><i class="fontSombal">*</i>付款方式</div>
                    <div class="info">
                        <RadioGroup v-model="charge.payTypeCode">
                            <Radio v-for="item in payType" :label="item.code" :key="item.code"
                                   style="margin-right: 30px">
                                <span>{{item.name}}</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #30374a;"><i class="fontSombal">*</i>单据编号</div>
                    <div class="info">
                        <Input v-model="charge.code" :disabled="checkCode" necessary></Input>
                    </div>
                </div>
                <div class="aline" v-if="!checkCode">
                    <div class="label">编号规则</div>
                    <div class="info tipsText">小区CODE+年月+10位数字，若不符合规则会导致收费失败。</div>
                </div>
                <div class="aline" style="margin-bottom: 0">
                    <div class="label"></div>
                    <div class="info" style="justify-content: space-between;padding-right: 60px">
                        <Checkbox v-model="checkCode" @on-change="handCheckboxCharnge">接上次单号</Checkbox>
                        <Checkbox>收款后打印凭证</Checkbox>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="collectFee">确定</div>
                <div class="pmbtn" @click="closeReceive">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                v-if="temporaryDialog"
                :visible.sync="temporaryDialog"
                custom-class="emDialog"
                width="520px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close="closeTemporary"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                临时收费
            </div>
            <div class="MuModalContent">
                <div class="aline" style="padding-left: 10px">
                    <RadioGroup v-model="temporaryType" @on-change="handRadioChange">
                        <Radio :label="1" style="margin-right: 40px">
                            临时增收本月费用
                        </Radio>
                        <Radio :label="2">
                            临时增收往月费用
                        </Radio>
                    </RadioGroup>
                </div>
                <div class="aline" v-if="temporaryType === 1">
                    <div class="label"><i class="fontSombal">*</i>收费年月</div>
                    <div class="info">
                        <Input style="width: 100%;" v-model="temporaryProTypeObj.chargingDate" :disabled="true"></Input>
                    </div>
                </div>
                <div class="aline" v-if="temporaryType === 2">
                    <div class="label"><i class="fontSombal">*</i>收费年月</div>
                    <div class="info">
                        <DatePicker v-model="nowMonth2" type="month" placeholder="收费年月" style="width: 100%;"
                                    @on-change="setchargingDate"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费项目</div>
                    <div class="info">
                        <mixSelect
                                v-model="temporaryProTypeObj.projectId"
                                :selectList="projectList2"
                                labelName="name"
                                valueName="id"
                                placeholder="收费项目"
                                @sentItem="getStandard"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline" style="margin-top:-15px;margin-bottom: 5px" v-if="temporaryType === 1">
                    <div class="label"></div>
                    <div class="info tips">
                        <i class="iconfont iconzhushi"></i>
                        <i style="color: #a0a5a9;font-size: 13px">增收本月费用，只能添加其他费用类型</i>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费标准</div>
                    <div class="info">
                        <mixSelect
                                :disabled="temporaryProTypeObj.projectId === ''"
                                v-model="temporaryProTypeObj.psId"
                                :selectList="standardList"
                                labelName="name"
                                valueName="id"
                                placeholder="收费标准"
                                @sentItem="getStandardObj"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline" v-if="temporaryType===1">
                    <div class="label"><i class="fontSombal">*</i>单价</div>
                    <div class="info">
                        <Input v-model="temporaryProTypeObj.unitPrice" :disabled="true" ></Input>
                    </div>
                </div>
                <div class="aline" v-if="temporaryType===1">
                    <div class="label"><i class="fontSombal">*</i>单位</div>
                    <div class="info">
                        <Input v-model="temporaryProTypeObj.unit" :disabled="true"></Input>
                    </div>
                </div>
                <div class="aline" v-if="temporaryType===1&&temporaryProTypeObj.projectTypeCode === '3'">
                    <div class="label"><i class="fontSombal">*</i>数量</div>
                    <div class="info">
                        <Input v-model="temporaryProTypeObj.quantity" type="number" @blur="setAllCost" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>应收金额</div>
                    <div class="info">
                        <Input v-model="temporaryProTypeObj.totalAp" :disabled="temporaryType===1" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>计费周期</div>
                    <div class="info">
                        <DatePicker type="daterange" style="width: 100%;" @on-change="setPayDateArea"
                                    ref="setPayDateArea" placeholder="开始时间 ~ 结束时间"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">备注</div>
                    <div class="info">
                         <textarea style="width: 100%"
                                   v-model="temporaryProTypeObj.remark"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">
                        <Checkbox v-model="payDateChecked">应交日期</Checkbox>
                    </div>
                    <div class="info">
                        <DatePicker type="date" style="width: 100%;" :disabled="!payDateChecked" ref="setPayDate"
                                    @on-change="setPayDate"></DatePicker>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="temporaryCharge">确定</div>
                <div class="pmbtn" @click="closeTemporary">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                v-if="advanceDialog"
                :visible.sync="advanceDialog"
                custom-class="emDialog"
                width="520px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close="closeAdvance"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                提前计算费用
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>房间代码</div>
                    <div class="info">
                        <Input :disabled="true" v-model="curObject.title"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费项目</div>
                    <div class="info">
                        <vue-perfect-scrollbar
                                style="max-height:240px;margin-right: -15px;padding-right: 15px;padding-top: 8px">
                            <CheckboxGroup style="width: 100%" @on-change="getPayTypeFun" v-model="checkboxProjectId">
                                <Checkbox
                                        v-for="item in projectList2"
                                        :label="item.id"
                                        :key="item.id"
                                        style="font-size: 14px;margin-bottom: 10px;width: 100%">
                                    {{item.projectName}}——{{item.standardName}}
                                </Checkbox>
                            </CheckboxGroup>
                        </vue-perfect-scrollbar>
                    </div>
                </div>
                <div class="aline" style="margin-bottom: 5px">
                    <div class="label"><i class="fontSombal">*</i>提前周期</div>
                    <div class="info">
                        <Input type="number" v-model="period" necessary @blur="checkPeriod"></Input>
                    </div>
                </div>
                <div class="aline" style="margin-bottom: 0">
                    <div class="label"></div>
                    <div class="info">
                        <em style="color: #ff2c2c;margin-right: 5px">*</em>
                        <i style="color: #a0a5a9;font-size:13px">最大值60</i>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="calcInfo">确定</div>
                <div class="pmbtn" @click="closeAdvance">取消</div>
            </div>
        </el-dialog>


        <!--批量提前计算-->
        <calcChargeGroup ref="calcChargeGroup" @success="resetInfo"></calcChargeGroup>
        <meterWatch ref="meterWatch" @success="resetInfo" :roomObj="curObject"></meterWatch>

        <warningBox ref="warningbox"></warningBox>

        <transition name="rightSlide">
            <noticePrint v-show="noticeShow" @close="noticeClose"></noticePrint>
        </transition>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator"
    import {Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design'
    import {Tree} from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import chargeList from './chargeList.vue';
    import calcChargeGroup from './components/calcChargeGroup.vue';
    import meterWatch from './components/meterWatch.vue';
    import noticePrint from './components/noticePrint.vue';

    import * as api from '@manage/api/propertyCharge/calcCharge'
    import buildingTree from './components/buildingTreeLevel3.vue'
    import warningBox from './components/warningMessage.vue'
    @Component({
        components: {
            Tree,
            Page,
            Spin,
            DatePicker,
            RadioGroup,
            Radio,
            CheckboxGroup,
            Checkbox,
            tabNav,
            Input,
            mixSelect,
            chargeList,
            calcChargeGroup,
            meterWatch,
            noticePrint,
            buildingTree,
            warningBox
        }
    })

    export default class mainView extends Vue {
        noticeShow: boolean = false;
        projectList: any = [];
        projectList2: any = [];
        standardList: any = [];
        tabName: string = '欠款明细';
        tabList: Array<{ name: string }> = [
            {
                name: '欠款明细',
            },
            {
                name: '缴费记录',
            },
        ];

        loading: boolean = false;

        projectTypeList: any = []

        LackOfDetailTable: any = []
        LackOfDetailById: any = []

        projectType: string = ''
        projectId: string = ''
        chargingStartDate: any = null
        chargingEndDate: any = null
        startTime: string = ''
        endTime: string = ''
        keyword: string = ''


        sumFeeDialog: number = 0
        proprietorName:string = '';
        proprietorNum: number = 0
        curObject: any = {
            id: '',
        }
        checkCode: boolean = true;
        charge: any = {
            "ids": [],
            "payTypeCode": "",
            "code": "",
            "totalAp": 0,
            "advanceFee": 0
        }
        payType: any = []
        total: any = {
            count: 0,
        }
        checkboxProjectId: any = []
        checkboxProject: any = []
        nowMonth: string = ''
        nowMonth2: string = ''
        period: number = 1;
        subFlag: boolean = true;

        checkList: Array<any> = [];

        renderContent(h, {root, node, data}) {
            return h('div', {
                    attrs: {
                        title: data.title,
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: 'calc(100% - 20px)',
                        height: '36px',
                        overflow: 'hidden',
                    },
                    class: {
                        treeActive: this.curObject.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 3) {
                                this.curObject = data;
                                setTimeout(() => {
                                    if (this.tabName === `欠款明细`) {
                                        this.setPagesize();
                                        this.resetInfo();
                                    }
                                }, 200)

                            } else {
                                this.gethouseData(data)
                            }
                        }
                    }
                },
                [
                    h('i', {
                        class: {
                            iconfont: true,
                            iconxiaoqu: data.level === 1,
                            iconlouyu: data.level === 2,
                        },
                        style: {
                            lineHeight: `1`,
                            marginRight: '8px',
                            marginLeft: '8px',
                            cursor: `pointer`,
                        },
                    }),

                    h('i', {

                        style: {
                            fontStyle: 'normal',
                            fontSize: data.level === 1 ? '15px' : '14px',
                            fontWeight: data.level === 1 ? '600' : 'normal',
                            lineHeight: `16px`,
                            cursor: `pointer`,
                            overflow: `hidden`,
                            whiteSpace: `nowrap`,
                            textOverflow: `ellipsis`
                        },
                    }, data.title),


                ]);
        };

        buildingTree: any = [{}]

        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 10,
        };

        resetDialog: boolean = false;
        rePay: number | string = 0;

        receiveDialog: boolean = false;
        temporaryDialog: boolean = false;
        temporaryType: number | string = 1;

        temporaryProTypeObj: any = {
            chargingDate: '',
            projectId: '',
            psId: '',
            projectTypeCode: '',
            unitPrice: '',
            payStartDate: '',
            payEndDate: '',
            unit: '',
            quantity: 1,
            totalAp: '',
            payableDate: '',
            remark: '',
        };

        advanceDialog: boolean = false;
        calcHover: boolean = false;
        calcHover2: boolean = false;
        unitList: any = [];
        payDateChecked: boolean = false;


        created(): void {
            //this.gethouseData1()
            this.getProjectType()
            this.getUnit()
            this.getPayType();
        }
        inited(curObj:any){
            this.curObject = curObj;
            if (this.tabName === `欠款明细`) {
                setTimeout(()=>{
                    this.setPagesize();
                    this.resetInfo();
                },200)
            }
        }
        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let searchline = refs.searchline.clientHeight;
            let middleline = refs.middleline.clientHeight + 10;
            //Page组件高度为53px，rightTitle:46,middleline:152
            this.formHeight = maxHeight - searchline - middleline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        //单位
        async getUnit() {
            let {data} = await api.getInfoByName('单位')
            this.unitList = data
        }

        feeProjrctType(val) {
            this.projectId = '';
            this.getProjectList(this.keyword, val.code, this.curObject.rdId)
        }

        feeProjrct() {
            this.getLackOfDetail()
            this.getTotal()
        }

        get paysDateOpt() {
            let htu: any = {}

            if (this.chargingEndDate) {
                let timer = new Date(this.chargingEndDate).getTime() - 86400000;
                htu = {
                    disabledDate(time) {
                        return time.getTime() > timer
                    }
                };
            }

            return htu;
        }

        get payeDateOpt() {
            let htu: any = {}
            if (this.chargingStartDate) {
                let timer = new Date(this.chargingStartDate).getTime();
                htu = {
                    disabledDate(time) {
                        return time.getTime() < timer
                    }
                };
            }
            return htu;
        }

        paysDate(val) {
            this.chargingStartDate = val ? val : null
        }

        payeDate(val) {
            this.chargingEndDate = val ? val : null
        }

        payableDate(daterange) {
            this.startTime = daterange[0]
            this.endTime = daterange[1]
        }

        selectInfo() {
            this.getLackOfDetail()
            this.getTotal()
            this.getPayAccount();
        }

        resetInfo() {
            let refs: any = this.$refs;
            this.projectType = ''
            this.projectId = ''
            this.chargingStartDate = null
            this.chargingEndDate = null

            this.startTime = ''
            this.endTime = ''
            this.keyword = ''

            refs.dateForm.handleClear()
            this.getPage()
        }

        tabChange(item: any) {
            this.tabName = item.name;
        }

        handleSelectionChange(val) {
            this.sumFeeDialog = 0
            this.checkList = val;
            this.charge.ids = [];
            for (let i in this.checkList) {
                this.charge.ids.push(this.checkList[i].id)
                this.sumFeeDialog = Number(this.checkList[i].totalAp) + this.sumFeeDialog
            }
        }

        handCheckboxCharnge(val) {
            if (val) {
                this.getCode()
            } else {
                this.charge.code = ''
            }
        }

        async handRadioChange(val) {
            this.temporaryProTypeObj = {
                chargingDate: '',
                projectId: '',
                psId: '',
                projectTypeCode: '',
                unitPrice: '',
                payStartDate: '',
                payEndDate: '',
                unit: '',
                quantity: 1,
                totalAp: '',
                payableDate: '',
            };
            if (val === 1) {
                this.temporaryProTypeObj.projectTypeCode = 3;
                this.temporaryProTypeObj.chargingDate = this.nowMonth;
            } else {
                this.nowMonth2 = this.nowMonth;
                this.temporaryProTypeObj.chargingDate = this.nowMonth;
                delete this.temporaryProTypeObj.quantity;
            }
            let {data} = await api.getProjectList(null, this.temporaryProTypeObj.projectTypeCode, this.curObject.rdId)
            this.projectList2 = data;
        }

        //查询标准
        async getStandard(item) {
            let {data} = await api.getStandard(item.id)
            this.standardList = data;
            this.temporaryProTypeObj.psId = '';
        }

        getStandardObj(item) {
            this.temporaryProTypeObj.psId = item.id;
            this.temporaryProTypeObj.projectTypeCode = item.projectTypeCode;
            this.temporaryProTypeObj.unitPrice = item.paymentStandardOther.unitPrice;

            if (item.projectTypeCode === '3') {
                this.temporaryProTypeObj.unit = this.unitList.find(item1 => item1.code === item.paymentStandardOther.quantityUnitCode).name;
                this.setAllCost();
            }
        }


        getPayTypeFun(data) {
            this.checkboxProject = [];
            data.forEach(item => {
                let obj = this.projectList2.find(item1 => item1.id === item);
                if (obj) {
                    this.checkboxProject.push(obj);
                }
            })

        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.selectInfo()
        }

        hintDialog: boolean = false;

        //根据id查询明细详情
        resetCrash(item) {
            if (item.projectTypeCode == 2) {
                let warningbox:any = this.$refs.warningbox;
                warningbox.openWarningbox(`走表费用不能重置金额，请到<i style="color: #3a7ef3;">“抄表管理”</i>处修改相关抄表数据。`)
            } else {
                this.LackOfDetailById = item
                this.resetDialog = true;
            }

        }

        //重置金额
        async confirmReast() {
            try {
                await api.updateMoney(this.LackOfDetailById.id, this.rePay)
                this.$message.success('重置金额成功')
                this.resetInfo();
                this.resetDialog = false
            } catch (e) {
                this.$message.error('重置金额失败')
            }
        }

        closeReset() {
            this.rePay = 0;
            this.resetDialog = false;
        }

        openReceive() {
            if (this.checkList.length > 0) {
                this.receiveDialog = true;
                this.getCode();
            } else {
                this.$message.warning(`请至少勾选一项收费！`)
            }
        }
        async getPayAccount(){
            try {
                let {data} = await api.getPayAccount(this.curObject.id)
                if(data){
                    this.proprietorName = data.clientName;
                    this.proprietorNum = data.balance;
                }
                else{
                    this.proprietorName = '';
                    this.proprietorNum = 0;
                }
            }catch (e) {

            }
        }

        closeReceive() {
            this.receiveDialog = false;
            this.charge = {
                "ids": [],
                "payTypeCode": "",
                "code": "",
                "totalAp": 0,
                "advanceFee": 0
            }
        }


        closeHover1() {
            this.calcHover = false
        }

        closeHover2() {
            this.calcHover2 = false
        }

        //结构树
        async gethouseData1() {
            try {
                let {data} = await api.getTree(0)
                data.forEach(item => {
                    if (item.belongNum !== 0) {
                        item.children = [{}];
                    }
                })
                this.buildingTree = data
            } catch (e) {
                this.buildingTree = [];
                this.$message.error(`获取小区数据失败！`)
            }

        }

        treeExpand(data) {
            this.gethouseData(data, true)
        }

        async gethouseData(obj: any, bl?: boolean) {
            let {data} = await api.getTree(obj.level, obj.id);

            if (data) {
                obj.children = data;
            }
            if (obj.level === 1) {
                obj.children.forEach(item => {
                    item.rdId = obj.id;
                    if (item.belongNum !== 0) {
                        item.children = [{}];
                    }
                })

            } else if (obj.level === 2) {
                obj.children.forEach(item => {
                    item.rdId = obj.rdId;
                })
            }
            if (!bl) {
                obj.expand = !obj.expand;
            }
        }

        //查询项目
        async getProjectList(name, priceTypeCode, id) {
            let {data} = await api.getProjectList('', priceTypeCode, id)
            this.projectList = data
        }

        //欠款明细
        async getLackOfDetail() {
            this.loading = true;
            try {
                let obj = {
                    pageNum: this.pages.pageNum,
                    pageSize: this.pages.pageSize,
                    endTime: this.endTime,
                    keyword: this.keyword,
                    chargingStartDate: this.chargingStartDate,
                    chargingEndDate: this.chargingEndDate,

                    projectId: this.projectId,
                    roomId: this.curObject.id,
                    startTime: this.startTime,
                    paid: 0,
                    projectTypeCode: this.projectType
                }

                let {data} = await api.getLackOfDetail(obj)
                this.pages.totalElements = data.totalElements
                this.LackOfDetailTable = data.content
                this.loading = false;
            } catch (e) {
                this.loading = false;
            }
        }


        //批量删除
        async deleteFee(ids) {
            if (ids.length === 0) {

            } else {
                this.$confirm('此操作将永久删除选中的记录, 是否继续?', '操作提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await api.deleteFee(ids)
                        this.resetInfo()
                        this.$message.success('删除成功')
                    } catch (e) {
                        this.$message.error('删除失败')
                    }
                }).catch(() => {

                });
            }

        }

        //获取当前可用单据编号
        async getCode() {
            let {data} = await api.getCode(this.curObject.rdId)
            this.charge.code = data.code
        }

        //收费
        async collectFee() {
            if (this.charge.payTypeCode === '') {
                this.$message.warning('请选择付款方式!')
            } else if (this.charge.code === '') {
                this.$message.warning('请填写单据编号!')
            } else if (this.charge.payTypeCode === '4' && this.proprietorNum < this.sumFeeDialog) {
                let warningbox:any = this.$refs.warningbox;
                warningbox.openWarningbox(`该账户余额不足，请到<i style="color: #3a7ef3;">“预收款管理”</i>处进行充值,或选用其他付款方式！`)
            } else if (this.subFlag) {
                this.subFlag = false;
                this.charge.totalAp = this.sumFeeDialog
                if(this.charge.payTypeCode === '4'){
                    this.charge.advanceFee = this.sumFeeDialog;
                }
                else{
                    this.charge.advanceFee = 0;
                }
                try {
                    await api.collectFee(this.charge)
                    this.resetInfo();
                    this.closeReceive();
                    this.$message.success('完成收费');

                } catch (e) {
                    this.$message.error(`${e.msg}`)
                }
                this.subFlag = true;
            }
        }

        //打开临时收费
        openTemporary() {
            this.projectList2 = []
            let now = new Date(); // 当前日期
            let nowMonth: any = now.getMonth(); // 当前月
            let nowYear: any = now.getFullYear();
            if (nowMonth < 10) {
                nowMonth = `0${nowMonth + 1}`
            } else {
                nowMonth = `${nowMonth + 1}`
            }
            this.nowMonth = `${nowYear}-${nowMonth}`
            this.temporaryType = 1;
            this.handRadioChange(1);


            this.payDateChecked = false;
            this.temporaryDialog = true;
            setTimeout(() => {
                let refs: any = this.$refs;
                refs.setPayDateArea.handleClear();
                refs.setPayDate.handleClear();

            }, 200)

        }

        closeTemporary() {

            this.temporaryDialog = false;
        }

        setPayDate(val) {
            this.temporaryProTypeObj.payableDate = val;
        }

        setPayDateArea(val) {
            this.temporaryProTypeObj.payStartDate = val[0];
            this.temporaryProTypeObj.payEndDate = val[1];
        }

        setchargingDate(val) {
            this.temporaryProTypeObj.chargingDate = val;
        }

        setAllCost() {
            this.temporaryProTypeObj.totalAp = this.temporaryProTypeObj.quantity * this.temporaryProTypeObj.unitPrice;
        }

        //增加临时收费
        async temporaryCharge() {
            if (this.temporaryProTypeObj.projectId == '') {
                this.$message.warning(`请选择收费项目！`)
            } else if (this.temporaryProTypeObj.psId == '') {
                this.$message.warning(`请选择收费标准！`)
            } else if (this.temporaryProTypeObj.projectTypeCode === '3' && this.temporaryProTypeObj.quantity == 0) {
                this.$message.warning(`数量不能为0`)
            } else if (this.subFlag) {
                this.subFlag = false;
                let obj = {
                    roomId: this.curObject.id,
                    chargingDate: this.temporaryProTypeObj.chargingDate,
                    projectId: this.temporaryProTypeObj.projectId,
                    projectTypeCode: this.temporaryProTypeObj.projectTypeCode,
                    psId: this.temporaryProTypeObj.psId,
                    payStartDate: this.temporaryProTypeObj.payStartDate,
                    payEndDate: this.temporaryProTypeObj.payEndDate,
                    totalAp: this.temporaryProTypeObj.totalAp,
                    quantity: this.temporaryProTypeObj.quantity,
                    payableDate: this.temporaryProTypeObj.payableDate,
                    temporary: 1,
                }
                if (!this.payDateChecked) {
                    delete obj.payableDate
                }
                try {
                    await api.temporaryCharge(obj);
                    this.$message.success(`添加成功！`);
                    this.closeTemporary();
                    this.selectInfo();
                    this.subFlag = true;
                } catch (e) {
                    this.$message.error(`添加失败！`);
                    this.subFlag = true;
                }
            }


        }


        //提前计算
        async calcInfo() {
            this.checkboxProject.forEach(item => {
                delete item.id;
                delete item.projectName;
                delete item.roomName;
                delete item.standardName;
            })
            if (this.period > 60) {
                this.period = 1
                this.$message.warning('提前计算周期不能大于60！')
            } else if (this.checkboxProject.length === 0) {
                this.$message.warning('请选择收费项目')
            } else if (this.subFlag) {
                this.subFlag = false
                try {
                    await api.calcFee(this.period, this.checkboxProject)
                    this.$message.success('计算成功')
                    this.closeAdvance();
                    this.selectInfo();
                    this.subFlag = true
                } catch (e) {
                    this.$message.error('计算失败')
                    this.subFlag = true
                }
            }

        }


        async openAdvance() {
            if (this.curObject.id === '') {
                this.$message.info("请选择房间")
            } else {
                let {data} = await api.getStandardByRoomId(this.curObject.id, '');
                this.projectList2 = data;
                for (let i = 0; i < this.projectList2.length; i++) {
                    if (this.projectList2[i].projectTypeCode !== '1') {
                        this.projectList2.splice(i, 1);
                        i--
                    }
                }
                if (this.projectList2.length > 0) {
                    this.advanceDialog = true
                } else {
                    this.$message.warning(`该房间没有绑定常规类型的收费标准，无法提前计算费用！`)
                }
            }
        }


        closeAdvance() {
            this.period = 1;
            this.checkboxProject = []
            this.checkboxProjectId = []
            this.advanceDialog = false;
        }

        openGroupAdvance() {
            let refs: any = this.$refs;
            refs.calcChargeGroup.openAdvance();
        }

        openMeter() {
            let refs: any = this.$refs;
            refs.meterWatch.openMeter();
        }

        //总金额
        async getTotal() {
            try {
                let obj = {
                    paid: 0,
                    roomId: this.curObject.id,
                    keyword: this.keyword,
                    chargingStartDate: this.chargingStartDate,
                    chargingEndDate: this.chargingEndDate,
                    projectId: this.projectId,

                    startTime: this.startTime,
                    endTime: this.endTime,
                    projectTypeCode: this.projectType
                }
                let {data} = await api.getTotal(obj)
                this.total = data
            } catch (e) {
                this.total.count = 0
            }
        }


        //收费类型
        async getProjectType() {
            let {data} = await api.getInfoByName('支付项目类型')
            this.projectTypeList = data
        }

        //支付方式
        async getPayType() {
            let {data} = await api.getInfoByName('支付方式')
            this.payType = data
        }

        projectTypeRename(projectTypeCode: string) {
            let obj: any = this.projectTypeList.find(item => item.code === projectTypeCode)
            return obj ? obj.name : `-`
        }

        noticeClose() {
            this.noticeShow = false;
        }
        checkPeriod(){
            if(this.period < 1){
                this.period = 1
                this.$message.warning(`提前周期不能小于1！`)
            }
            else if(this.period > 60){
                this.period = 60
                this.$message.warning(`提前周期不能大于60！`)
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #calcCharge {
        position: relative;

        .viewbox {
            padding-top: 15px;
            height: calc(100% - 60px);
            width: 100%;

            .viewboxMain {
                display: flex;
            }

            .leftTree {

            }

            .borderRight {
                width: 1px;
                height: 100%;
                background-color: #dde4eb;
                box-shadow: 1px 0px 3px 0px #dde4eb;
                flex: none;
            }

            .rightMain {
                width: calc(100% - 221px);
                height: 100%;
                padding: 0 5px 0 20px;
                overflow: hidden;

                .searchline {
                    display: flex;
                    flex-wrap: wrap;

                    .margin {
                        margin-right: 15px;
                        margin-bottom: 20px;
                    }

                    > .item {
                        height: 36px;
                        display: inline-flex;
                        align-items: center;
                    }
                }

                .middleline {
                    height: 60px;
                    background-color: #f8f9fc;
                    border-radius: 4px;
                    overflow: hidden;
                    display: flex;
                    margin-bottom: 10px;

                    .iconbox {
                        height: 100%;
                        width: 60px;
                        background-image: linear-gradient(269deg,
                                #ff762e 0%,
                                #ffbd24 100%);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;

                        .iconfont {
                            color: #fff;
                            font-size: 26px;
                        }
                    }

                    .info {
                        flex: 1;
                        height: 100%;
                        padding: 10px 20px;
                        display: inline-flex;
                        align-items: baseline;
                        color: $second-font-color;

                        em, i {
                            color: $error-color;
                        }

                        em {
                            font-size: 24px;
                        }
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

                .empty {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;

                    > p {
                        color: $third-font-color;
                        margin-top: 10px;
                    }
                }
            }
        }


    }

    .resetModalContent {
        .aline {
            .label {
                width: 84px;
            }
        }
    }

    .borderLine {
        width: 100%;
        height: 1px;
        background-color: #dde4eb;
        margin-bottom: 15px;
    }

    .advanceContent {
        display: flex;
        border-bottom: 1px solid #eaf0f6;
        margin: -20px -20px 15px;
        flex-wrap: wrap;

        .halfPart {
            width: 50%;
            height: 460px;
            padding: 0 20px;

            &.shadow {
                border-right: 1px solid #eaf0f6;
            }

            .tit {
                height: 40px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #dde4eb;
                font-size: 16px;
                margin-bottom: 10px;
            }
        }
    }

    .iconzhushi {
        color: $warning-color;
        font-size: 14px;
        margin-right: 8px;
    }
</style>

