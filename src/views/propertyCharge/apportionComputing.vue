<template>
    <div id="apportionComputing">
        <tabNav :tabList="tabList" ref="tabNav" @tabChange="tabChange"></tabNav>
        <transition name="leftSlide">
            <div class="viewbox" ref="viewbox" v-show="tabName === '公摊记录'">
                <div v-if="noSettings" class="viewboxMain empty">
                    <img src="@manage/images/暂无1.png" >
                    <br>
                    <p>暂无数据，请先至 <i @click="tabGo">公摊设定</i> 处进行设置</p>
                </div>
                <div v-else class="viewboxMain">
                    <div class="searchline" ref="searchline">
                        <div class="left">
                            <mixSelect
                                    class="margin"
                                    v-model="rdId"
                                    :selectList="communityList"
                                    labelName="title"
                                    valueName="id"
                                    placeholder="全部小区"
                                    style="width: 140px"
                                    @sentTo="getProjectList"
                            >
                            </mixSelect>
                            <mixSelect
                                    :disabled="rdId===''"
                                    class="margin"
                                    v-model="projectTypeCode"
                                    :selectList="projectList"
                                    labelName="name"
                                    valueName="id"
                                    placeholder="收费项目"
                                    style="width: 140px"
                            >
                            </mixSelect>
                            <mixSelect
                                    class="margin"
                                    v-model="sharedTypeCode"
                                    :selectList="statusList"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="公摊状态"
                                    style="width: 140px"
                            >
                            </mixSelect>
                            <div class="margin">
                                <i class="item">收费年月</i>
                                <DatePicker
                                        type="daterange"
                                        format="yyyy-MM-dd"
                                        placeholder="开始时间   ~   结束时间"
                                        style="width: 200px;"
                                        @on-change="setTimelist"
                                        ref="timelist"
                                ></DatePicker>

                            </div>

                            <div class="margin">
                                <Input v-model="keyword" placeholder="请输入关键字"
                                       style="width: 200px;margin-right: 15px" @enter="getPage()"></Input>
                                <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                                    <i class="iconfont iconsousuo"></i>搜索
                                </div>
                                <div class="pmbtn" @click="reset">
                                    <i class="iconfont iconzhongzhi"></i>重置
                                </div>
                            </div>
                        </div>

                        <div class="item" style="margin-bottom: 20px">
                            <div class="pmbtn primary" @click="openDialog('新增')">
                                <i class="iconfont icontianjia"></i>
                                新增公摊费用
                            </div>
                        </div>
                    </div>
                    <el-table
                            :data="sharedList"
                            stripe
                            v-loading="loading"
                            class="myWisdomTable"
                            :height="formHeight"
                            @selection-change="handleSelectionChange"
                    >
                        <template slot="empty">
                            <img src="@manage/images/暂无数据.png">
                            <br>
                            暂无内容
                        </template>
                        <el-table-column
                                prop="ruleName"
                                label="公摊名称"
                                min-width="140px"
                                show-overflow-tooltip
                        >
                        </el-table-column>

                        <el-table-column
                                prop="rdName"
                                label="所属小区"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>

                        <el-table-column
                                prop="projectTypeCode"
                                label="类型"
                                width="140px"
                                show-overflow-tooltip
                        >
                            <template slot-scope="{row}">
                                <div v-if="row.projectTypeCode == 2 && row.sharedPayTypeCode == 1">走表-直接设定金额</div>
                                <div v-else-if="row.projectTypeCode == 2 && row.sharedPayTypeCode == 2">走表-计量收费</div>
                                <div v-else-if="row.projectTypeCode == 3">其他</div>
                                <div v-else>-</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="projectName"
                                label="收费项目"
                                min-width="90px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="chargingDate"
                                label="收费年月"
                                min-width="90px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="roomNum"
                                label="公摊户数"
                                min-width="90px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="sharedBillingStatusCode"
                                label="公摊状态"
                                min-width="90px"
                                show-overflow-tooltip
                        >
                            <template slot-scope="{row}">
                                <div v-if="row.sharedBillingStatusCode==='0'" style="color: #ff9900;">未公摊</div>
                                <div v-else-if="row.sharedBillingStatusCode==='1'" style="color: #ff2c2c;">已公摊</div>
                                <div v-else-if="row.sharedBillingStatusCode==='2'" style="color: #7c8185;">已出账</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="totalMeterReading"
                                label="公摊用量"
                                width="90px"
                        >
                            <template slot-scope="{row}">
                                {{row.totalMeterReading || '-'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="originalAp"
                                label="公摊总额(元)"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="sharedRadio"
                                label="公摊比例"
                                min-width="90px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="totalAp"
                                label="应出账总额(元)"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop=""
                                label="计费周期"
                                min-width="200px"
                                show-overflow-tooltip
                        >
                            <template slot-scope="{row}">
                                {{row.payStartDate}} ~ {{row.payEndDate}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="billingDate"
                                label="出账日期"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="170px"
                        >
                            <template slot-scope="{row}">
                                <div class="tableEdit">
                                    <div class="item" v-if="row.sharedBillingStatusCode == 0" @click="sharedCalc(row)">
                                        公摊计算
                                    </div>
                                    <div class="item" v-else @click="tableCostFlag = true;resultId = row.id">公摊结果</div>
                                    <div v-if="row.sharedBillingStatusCode==='2'" class="item" @click="openEditDialog(row)">详情</div>
                                    <div v-else class="item" @click="openEditDialog(row)">修改</div>

                                    <div class="item delete" @click="deleteInfo(row)">删除</div>
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
            </div>

        </transition>
        <transition name="rightSlide">
            <apportionSet v-show="tabName === '公摊设定'" :setShow="tabName === '公摊设定'"></apportionSet>
        </transition>

        <transition name="rightSlide">
            <resultTable v-show="tableCostFlag" :resultShow="tableCostFlag" :resultId='resultId'
                         @close="closeTable"></resultTable>
        </transition>

        <el-dialog
                :visible.sync="dialogVisible"
                custom-class="emDialog"
                width="545px"
                top="6vh"
                :close-on-click-modal="false"
                @close="closeDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                {{dialogType === '详情' ? '' : dialogType}}公摊费用
            </div>
            <div class="MuModalContent">

                <div class="aline">
                    <div class="label">选择类型</div>
                    <div class="info">
                        <mixSelect
                                :disabled="dialogType === '详情'"
                                v-model="addApportionFee.projectTypeCode"
                                :selectList="selectType"
                                labelName="name"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">选择公摊</div>
                    <div class="info">
                        <mixSelect
                                :disabled="dialogType === '详情'"
                                v-model="addApportionFee.ruleId"
                                :selectList="ruleList"
                                labelName="name"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">选择年月</div>
                    <div class="info">
                        <DatePicker
                                :disabled="dialogType === '详情'"
                                type="month"
                                format="yyyy-MM"
                                placeholder="请选择"
                                style="width: 100%"
                                @on-change="setMonth"
                                ref="setMonthpick"
                                v-model="chargingDate">
                        </DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">计费周期</div>
                    <div class="info">
                        <DatePicker  :disabled="dialogType === '详情'"
                                     type="daterange"
                                     format="yyyy-MM-dd"
                                     placeholder="开始时间   ~   结束时间"
                                    style="width: 100%"
                                     v-model="addTimeArr"
                                     @on-change="addTimeArrChange"
                                    ref="payDate"></DatePicker>
                    </div>
                </div>
                <div class="aline" v-show="addApportionFee.projectTypeCode==='2'">
                    <div class="label">费用类型</div>
                    <div class="info">
                        <mixSelect
                                :disabled="dialogType === '详情'"
                                v-model="addApportionFee.sharedPayTypeCode"
                                :selectList="feeType"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentTo="sharedPayTypeCodeChange"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline" v-show="addApportionFee.sharedPayTypeCode!=='2'|| addApportionFee.projectTypeCode==='3'">
                    <div class="label">公摊金额</div>
                    <div class="info">
                        <Input :disabled="dialogType === '详情'" v-model="addApportionFee.originalAp" placeholder="公摊金额" type="2fixed" ></Input>
                    </div>
                </div>

                <div v-show="addApportionFee.sharedPayTypeCode==='2'&&addApportionFee.projectTypeCode==='2'">
                    <div class="aline">
                        <div class="label">上次抄表读数</div>
                        <div class="info">
                            <Input :disabled="dialogType === '详情'" v-model="addApportionFee.meterReading.lastMeterReading" type="float" ></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">上次抄表日期</div>
                        <div class="info">
                            <DatePicker  :disabled="dialogType === '详情'"
                                         type="date"
                                         format="yyyy-MM-dd"
                                         placeholder="请选择"
                                         style="width: 100%"
                                         @on-change="setDatef1"
                                         ref="setDatepick1"
                                         v-model="lastReadingDate"></DatePicker>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">本次抄表读数</div>
                        <div class="info">
                            <Input :disabled="dialogType === '详情'" v-model="addApportionFee.meterReading.currentMeterReading" placeholder="请输入" type="float" ></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">本次抄表日期</div>
                        <div class="info">
                            <DatePicker  :disabled="dialogType === '详情'"
                                         type="date"
                                         format="yyyy-MM-dd"
                                         placeholder="请选择"
                                         style="width: 100%"
                                         @on-change="setDatef2"
                                         ref="setDatepick2"
                                         v-model="currentReadingDate"></DatePicker>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">是否转表</div>
                        <div class="info">
                            <RadioGroup v-model="addApportionFee.meterReading.meterTurn">
                                <Radio :disabled="dialogType === '详情'" :label="1" style="margin-right: 50px">是</Radio>
                                <Radio :disabled="dialogType === '详情'" :label="0">否</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">是否换表</div>
                        <div class="info">
                            <RadioGroup v-model="addApportionFee.meterReading.meterChange" @on-change="handCharnge">
                                <Radio :disabled="dialogType === '详情'" :label="1" style="margin-right: 50px">是</Radio>
                                <Radio :disabled="dialogType === '详情'" :label="0">否</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div v-if="addApportionFee.meterReading.meterChange === 1">
                        <div class="aline">
                            <div class="label">旧表终止数</div>
                            <div class="info">
                                <Input :disabled="dialogType === '详情'" v-model="addApportionFee.meterReading.oldMeterReading" placeholder="请输入" type="float" ></Input>
                            </div>
                        </div>
                        <div class="aline">
                            <div class="label">新表起始数</div>
                            <div class="info">
                                <Input :disabled="dialogType === '详情'" v-model="addApportionFee.meterReading.newMeterReading" placeholder="请输入" type="float" ></Input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div v-if="dialogType === `新增`" class="pmbtn primary" style="margin-right: 10px"
                     @click="addSharedRecord">确定
                </div>
                <div v-if="dialogType === `修改`" class="pmbtn primary" style="margin-right: 10px"
                     @click="editSharedRecord">确定
                </div>

                <div v-if="dialogType === '详情'" class="pmbtn primary" @click="closeDialog">确定</div>
                <div v-else class="pmbtn" @click="closeDialog">取消</div>
            </div>
        </el-dialog>

        <el-dialog
                :visible.sync="hintDialog"
                custom-class="emDialog"
                width="460px"
                class="hintDialog"
        >
            <div slot="title" style="display: flex;align-items: center">
                <i class="el-icon-warning" style="font-size: 19px;color: #ff6161"></i>
                <i style="font-weight: bolder;margin-left: 10px;font-size: 16px;">提示操作</i>
            </div>
            <div>
                <i>该项费用已有用户完成缴费，无法修改数据。</i>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" @click="hintDialog = false">确定</div>
            </div>
        </el-dialog>

        <el-dialog
                :visible.sync="deleteDintDialog"
                custom-class="emDialog"
                width="460px"
                class="hintDialog"
        >
            <div slot="title" style="display: flex;align-items: center">
                <i class="el-icon-warning" style="font-size: 18px;color: #ff6161"></i>
                <i style="font-weight: bolder;margin-left: 10px;font-size: 16px;">{{titleHintDetele}}</i>
            </div>
            <div>
                <i>删除后，相关账单将会删除，已收款账单请于 </i>
                <i style="color: #3a7ef3;">“计费收款” </i>
                <i>的收款记录处做相关退款处理！</i>
            </div>
            <div slot="footer">
                <div class="pmbtn" @click="deleteDintDialog=false" style="margin-right: 10px">取消</div>
                <div class="pmbtn primary" @click="deleteRecord">删除</div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator"
    import {Page, Icon, Spin, DatePicker, RadioGroup, Radio} from 'view-design'
    import {Tree} from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import apportionSet from './apportionSet.vue';
    import resultTable from './apportionComputing_result.vue';
    import * as api from '@manage/api/propertyCharge/apportion'

    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            tabNav,
            mixSelect,
            Input,
            apportionSet,
            resultTable,
            RadioGroup,
            Radio
        }
    })

    export default class apportionComputing extends Vue {
        tabName: string = '公摊记录';
        @Watch(`tabName`)
        async tabNameChange(){
            if(this.tabName === '公摊记录'){
                let {data: {totalElements}} = await api.getApportionList({
                    pageNum: 1,
                    pageSize: 3,
                });
                if (totalElements > 0) {
                    this.noSettings = false;
                    setTimeout(()=>{
                        this.setPageSize();
                        this.reset();
                    },100)
                }
                else{
                    this.noSettings = true;
                }
            }
        }
        tabList: Array<{ name: string }> = [
            {
                name: '公摊记录',
            },
            {
                name: '公摊设定',
            },
        ];
        tableCostFlag: boolean = false;
        tableOwnFlag: boolean = false;
        deleteDintDialog: boolean = false

        communityList: any = [];
        statusList: any = [];
        projectList: any = [];

        rdId: string = '';
        projectTypeCode: string = '';
        keyword: string = '';
        sharedTypeCode: string = '';

        sharedList: any = [];
        subFlag: boolean = true;


        resultId: string = '';
        hintDialog: boolean = false
        addApportionFee: any = {
            projectTypeCode: '',
            ruleId: '',
            sharedPayTypeCode: '',
            originalAp: '',
            payStartDate: '',
            payEndDate: '',
            chargingDate: "",
            meterReading: {
                lastMeterReading: 0,
                lastReadingDate: '',
                currentMeterReading: '',
                currentReadingDate: '',
                meterTurn: 0,
                meterChange: 0,
                oldMeterReading: 0,
                newMeterReading: 0,
            }
        }
        addTimeArr: any = [];
        selectType: any = [
            {
                name: '走表',
                id: '2'
            },
            {
                name: '其他',
                id: '3'
            },
        ]
        feeType: any = []
        ruleList: any = []

        dialogVisible: boolean = false
        formHeight: number = 600;

        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };

        loading: boolean = true;
        checkList: Array<any> = [];
        noSettings:boolean = false;

        mounted() {
            this.$nextTick(async () => {
                let {data: {totalElements}} = await api.getApportionList({
                    pageNum: 1,
                    pageSize: 3,
                });
                if (totalElements > 0) {
                    this.noSettings = false;
                    setTimeout(()=>{
                        this.setPageSize();
                        this.reset();
                    },100)
                }
                else{
                    this.noSettings = true;
                }
            })

            this.getcommunityList();
            this.getSelection(`statusList`, `公摊状态`);
            this.getSelection(`feeType`, `公摊费用类型`);

        }
        setPageSize(){
            let refs: any = this.$refs;
            let maxHeight = refs.viewbox.clientHeight - 15;
            let searchline = refs.searchline.clientHeight;
            this.formHeight = maxHeight - searchline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        async getcommunityList() {
            let {data} = await api.getTree1();
            this.communityList = data;
        }

        async getSelection(Array: string, name: string) {
            let {data} = await api.getSelection(name);
            this[`${Array}`] = data;
        }

        async getProjectList() {
            try {
                let {data} = await api.getProjectList('', this.rdId);
                this.projectList = data;
            } catch (e) {

            }
        }

        timeList: any = [];

        setTimelist(val) {
            this.timeList = val
        }

        async getApportionList() {
            this.loading = true;
            try {
                let {data: {content, totalElements}} = await api.getApportionrecord({
                    keyword: this.keyword,
                    pageNum: this.pages.pageNum,
                    pageSize: this.pages.pageSize,
                    projectId: this.projectTypeCode,
                    rdId: this.rdId,
                    sharedBillingStatusCode: this.sharedTypeCode,
                    startTime: this.timeList[0],
                    endTime: this.timeList[1],
                });
                this.sharedList = content;
                this.pages.totalElements = totalElements;
                this.loading = false;
            } catch (e) {
                this.loading = false;
            }

        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getApportionList();
        }

        reset() {
            this.keyword = ''
            this.pages.pageNum = 1
            this.projectTypeCode = ''
            this.rdId = ''
            this.sharedTypeCode = ''
            let refs: any = this.$refs;
            refs.timelist.handleClear();
            this.timeList = []
            this.getPage();
        }


        tabChange(item: any) {
            this.tabName = item.name;
        }

        handleSelectionChange(val) {
            this.checkList = val;
        }


        closeTable() {
            this.tableCostFlag = false;
            this.tableOwnFlag = false;
        }

        sharedPayTypeCodeChange(val) {
            if (val == 1) {
                this.addApportionFee.meterReading = {
                    lastMeterReading: 0,
                    lastReadingDate: '',
                    currentMeterReading: '',
                    currentReadingDate: '',
                    meterTurn: 0,
                    meterChange: 0,
                    oldMeterReading: 0,
                    newMeterReading: 0,
                }
            } else {
                this.addApportionFee.originalAp = '';

            }
        }

        chargingDate: string = '';

        setMonth(str) {
            this.addApportionFee.chargingDate = str + `-01`
        }

        lastReadingDate: string = '';

        setDatef1(val) {
            this.addApportionFee.meterReading.lastReadingDate = val;
        }

        currentReadingDate: string = '';

        setDatef2(val) {
            this.addApportionFee.meterReading.currentReadingDate = val;
        }

        handCharnge(val) {
            this.addApportionFee.meterReading.oldMeterReading = 0;
            this.addApportionFee.meterReading.newMeterReading = 0;
        }

        dialogType: string = '';

        openEditDialog(row) {
            api.judgeShared(row.id).then(res => {
                if (res.data.result === 0) {
                    api.getApportionrecordDetail(row.id).then(res => {
                        this.addApportionFee = res.data;
                        if (this.addApportionFee.meterReading === null) {
                            this.addApportionFee.meterReading = {
                                lastMeterReading: 0,
                                lastReadingDate: '',
                                currentMeterReading: '',
                                currentReadingDate: '',
                                meterTurn: 0,
                                meterChange: 0,
                                oldMeterReading: 0,
                                newMeterReading: 0,
                            }
                        }
                        this.chargingDate = this.addApportionFee.chargingDate
                        this.addTimeArr = [this.addApportionFee.payStartDate, this.addApportionFee.payEndDate];
                        this.lastReadingDate = this.addApportionFee.meterReading.lastReadingDate
                        this.currentReadingDate = this.addApportionFee.meterReading.currentReadingDate
                        if(row.sharedBillingStatusCode==='2'){
                            this.openDialog(`详情`)
                        }
                        else{
                            this.openDialog(`修改`)
                        }
                    })
                } else {
                    this.hintDialog = true
                }
            })

        }

        async openDialog(type: string) {
            this.dialogType = type;
            this.dialogVisible = true;
            let {data: {content}} = await api.getApportionList({
                pageNum: 1,
                pageSize: 99,
            });
            this.ruleList = content;
        }

        closeDialog() {
            let refs: any = this.$refs;
            this.addApportionFee = {
                projectTypeCode: '',
                ruleId: '',
                sharedPayTypeCode: '',
                originalAp: '',
                payStartDate: '',
                payEndDate: '',
                chargingDate: "",
                meterReading: {
                    lastMeterReading: 0,
                    lastReadingDate: '',
                    currentMeterReading: '',
                    currentReadingDate: '',
                    meterTurn: 0,
                    meterChange: 0,
                    oldMeterReading: 0,
                    newMeterReading: 0,
                }
            }
            refs.payDate.handleClear()
            refs.setMonthpick.handleClear()
            refs.setDatepick1.handleClear()
            refs.setDatepick2.handleClear()
            this.dialogVisible = false
        }

        addTimeArrChange(val) {
            this.addApportionFee.payStartDate = val[0]
            this.addApportionFee.payEndDate = val[1]
        }


        async addSharedRecord() {
            if (this.subFlag) {
                this.subFlag = false;
                if (this.$utils.isntNull(this.addApportionFee, {
                    projectTypeCode: '费用类型',
                    ruleId: '公摊规则',
                    chargingDate: '收费年月',

                })) {
                    if (this.addApportionFee.sharedPayTypeCode !== '2') {
                        delete this.addApportionFee.meterReading
                    }
                    try {
                        await api.addApportionrecord(this.addApportionFee)
                        this.reset();
                        this.$message.success(`新增成功！`)
                        this.closeDialog();
                    } catch (e) {
                        this.$message.error(`新增失败！`)
                    }
                }
                this.subFlag = true;
            }


        }

        async editSharedRecord() {
            this.$confirm('修改后需重新进行公摊计算并生成相关账单，是否确认修改？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                if (this.addApportionFee.sharedPayTypeCode !== '2') {
                    delete this.addApportionFee.meterReading
                }
                try {
                    await api.updateApportionrecord(this.addApportionFee)
                    this.reset();
                    this.$message.success(`修改成功！`)
                    this.closeDialog();
                } catch (e) {
                    this.$message.error(`修改失败！`)
                }
            }).catch(() => {

            });
        }


        titleHintDetele: string = ''
        deleteId: string = ''

        deleteInfo(row) {
            this.deleteDintDialog = true;
            this.deleteId = row.id;
            this.titleHintDetele = `确定要删除"${row.ruleName}"${row.chargingDate}的公摊记录？`
        }

        async deleteRecord() {
            try {
                await api.deleteApportionrecord([this.deleteId]);
                this.$message.success(`删除成功！`)
                this.reset();
                this.deleteDintDialog = false;
            } catch (e) {
                this.$message.error(`删除失败！`)
            }
        }

        async sharedCalc(row) {
            if (this.subFlag) {
                this.subFlag = false;
                try {
                    await api.sharedCalc(row.id, false);
                    this.$message.success(`计算成功！`)
                    this.reset();
                } catch (e) {
                    this.$message.error(`计算失败！`)
                }
                this.subFlag = true;
            }
        }
        tabGo(){
            this.tabName = '公摊设定';
            let refs:any = this.$refs;
            refs.tabNav.tabIndex = 1;
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #apportionComputing {

        position: relative;

        .viewbox {
            padding-top: 15px;
            height: calc(100% - 60px);
            width: 100%;



            .searchline {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .left {
                    display: flex;
                }

                .margin {
                    margin-right: 15px;
                    margin-bottom: 20px;
                    display: flex;
                    flex: none;
                }

                .item {
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    flex: none;
                    margin-right: 15px;
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
    }

    .aline {
        .label {
            width: 100px;
        }
    }
</style>
<style lang="scss">

    .create-isLoading {
        .el-loading-spinner {
            top: 20%;
            left: 50%;
            margin-left: -55px;
            background: #fff;
            padding: 20px;
            border-radius: 4px;
            width: auto;
            text-align: center;
            position: absolute;

            i {
                color: #30374a;
            }

            .el-loading-text {
                color: #30374a;
            }
        }
    }
</style>
