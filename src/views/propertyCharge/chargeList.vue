<template>
    <div id="chargeList" ref="viewbox">
        <!--<div v-if="buildingTree.length === 0" class="viewboxMain empty">
            <img src="@manage/images/暂无2.png" >
            <br>
            <p>暂无数据，请先至 <i @click="$router.push({name:'房产管理'})">房产管理</i> 处添加小区</p>
        </div>
        <div v-else class="viewboxMain">

        </div>-->

        <!--<div class="leftTree">
            <Input type="search" placeholder="搜索"></Input>
            <vue-perfect-scrollbar
                    style="height:calc(100% - 48px);margin-top: 10px;margin-right: -15px;padding-right: 15px">
                <Tree
                        class="buildingTree"
                        ref="tree"
                        :data="buildingTree"
                        :render="renderContent"
                        @on-toggle-expand="treeExpand"
                >
                </Tree>
            </vue-perfect-scrollbar>
        </div>
        <div class="borderRight"></div>-->
        <div v-show="curTreeObj.id" class="rightMain" ref="rightMain">
            <div class="searchline" ref="searchline">
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
                    <DatePicker type="daterange" ref="dateForm" placeholder="开始时间 ~ 结束时间" style="width: 200px;margin-left: 8px" @on-change="payableDate"></DatePicker>
                </div>
                <div class="margin" style="display: flex">
                    <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px" @enter="getPage()"></Input>
                    <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                        <i class="iconfont iconsousuo"></i>搜索
                    </div>
                    <div class="pmbtn" @click="reset">
                        <i class="iconfont iconzhongzhi"></i>重置
                    </div>
                </div>
                <div class="margin item">
                    <div class="pmbtn" style="margin-right: 15px">
                        <i class="iconfont icondayin"></i>打印凭证
                    </div>
                    <div class="pmbtn" style="margin-right: 15px">
                        <i class="iconfont icondaochu"></i>导出
                    </div>
                    <div class="pmbtn" style="margin-right: 15px" @click="deleteGroup">
                        <i class="iconfont iconshanchu"></i>批量删除
                    </div>
                </div>
            </div>
            <el-table
                    :data="paymentRecords"
                    stripe
                    v-loading="loading"
                    class="myWisdomTable"
                    :height="formHeight"
                    @selection-change="handleSelectionChange"
            >
                <template slot="empty" >
                    <img src="@manage/images/暂无数据.png">
                    <br>
                    暂无内容
                </template>
                <el-table-column
                        type="selection"
                        width="60">
                </el-table-column>
                <!--<el-table-column
                        prop="proprietorName"
                        label="客户名称"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>-->
                <el-table-column
                        prop="feeConfirm.documentCode"
                        label="单据编号"
                        width="160px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="chargingDate"
                        label="收费年月"
                        width="120px"
                >
                </el-table-column>
                <el-table-column
                        prop="projectName"
                        label="收费项目"
                        min-width="120px"
                        show-overflow-tooltip
                >
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
                        prop="capital"
                        label="本金金额(元)"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="lateFeeRate"
                        label="滞纳金比例"
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
                        prop="totalAp"
                        label="合计金额(元)"
                        min-width="120px"
                        show-overflow-tooltip
                >
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
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="交清日期"
                        width="160px"
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="付款方式"
                        min-width="120px"
                >
                    <template slot-scope="{row}">
                        {{payTypeRename(row.feeConfirm.payTypeCode)}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop=""
                        label="备注"
                        min-width="120px"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row,$index}">
                        <div style="color: #7c8185;">{{row.remark || `无`}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="feeConfirm.createPersonName"
                        label="操作人"
                        min-width="120px"
                >
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="80px"
                >
                    <template slot-scope="{row,$index}">
                        <div class="tableEdit">
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
        <div v-show="curTreeObj.id === ''" class="rightMain empty">
            <img src="@manage/images/暂无1.png" alt="">
            <p>请在左侧选择一个房间</p>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator"
    import { Page, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue'
    import * as api from '@manage/api/propertyCharge/calcCharge'

    @Component({
        components: {
            Tree,
            Page,
            DatePicker,
            RadioGroup,
            Radio,
            CheckboxGroup,
            Checkbox,
            tabNav,
            Input,
            mixSelect,
        }
    })

    export default class mainView extends Vue {

        @Prop({
            default: false,
        }) showFlag!: boolean;

        @Prop({
            default: [],
        }) projectTypeList!: Array<any>;
        @Prop({
            default: [{}],
        }) buildingTree!: Array<any>;
        @Prop({
            default: {},
        }) fTreeObj!: any;

        @Watch(`showFlag`)
        showChargeList() {
            if (this.showFlag) {
                if(this.fTreeObj.id){
                    this.curTreeObj = this.fTreeObj
                }
                if(this.curTreeObj.id){

                    setTimeout(()=>{
                        this.setPagesize();
                        this.reset();
                    },200)
                }
                this.getPayType();
            }
        }
        @Watch(`fTreeObj`)
        showChargeList2() {
            this.showChargeList();
        }
        curTreeObj:any =  {
            id:'',
            rdId:'',
        }
        paymentRecords: any = []

        projectName: string = ''
        projectType: string = ''
        projectId: string = ''
        chargingStartDate: any = null
        chargingEndDate: any = null
        startTime: string = ''
        endTime: string = ''
        keyword: string = ''

        checkList: Array<any> = [];
        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        loading: boolean = false;

        projectList: Array<any> = [];
        //树结构
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
                        treeActive: this.curTreeObj.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 3) {
                                this.curTreeObj = data;
                                setTimeout(()=>{
                                    this.setPagesize();
                                    this.reset();
                                },200)
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
                            fontSize:  data.level === 1 ? '15px' : '14px',
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

        treeExpand(data) {
            this.gethouseData(data, true)
        }
        payTypeList:Array<any>=[];
        //支付方式
        async getPayType() {
            let {data} = await api.getInfoByName('支付方式')
            this.payTypeList = data
        }
        async gethouseData(obj: any, bl?: boolean) {
            let {data} = await api.getTree(obj.level, obj.id);

            if (data) {
                obj.children = data;
            }
            if (obj.level === 1) {
                obj.children.forEach(item => {
                    item.rdId = obj.id;
                })
                data.forEach(item => {
                    if(item.belongNum !== 0){
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

        mounted() {

        }
        setPagesize(){
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let searchline = refs.searchline.clientHeight;
            //Page组件高度为53px
            this.formHeight = maxHeight - searchline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        handleSelectionChange(val) {
            this.checkList = val;
        }
        //查询项目
        async getProjectList(name,priceTypeCode,id){
            let {data} = await api.getProjectList('',priceTypeCode,id)
            this.projectList=data
        }

        feeProjrctType(val){
            this.projectId = '';
            this.getProjectList(this.keyword, val.code, this.curTreeObj.rdId)
        }

        get paysDateOpt(){
            let htu:any = {}

            if(this.chargingEndDate){
                let timer = new Date(this.chargingEndDate).getTime() - 86400000 ;
                htu = {
                    disabledDate(time) {
                        return time.getTime() > timer
                    }
                };
            }

            return htu;
        }
        get payeDateOpt(){
            let htu:any = {}
            if(this.chargingStartDate){
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
        payableDate(daterange){
            this.startTime=daterange[0]
            this.endTime=daterange[1]
        }
        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getPaymentRecords();
        }


        //缴费记录
        async getPaymentRecords() {
            this.loading = true;
            try {
                let obj = {
                    pageNum:this.pages.pageNum,
                    pageSize:this.pages.pageSize,
                    endTime:this.endTime,
                    keyword:this.keyword,
                    chargingStartDate: this.chargingStartDate,
                    chargingEndDate: this.chargingEndDate,

                    projectId:this.projectId,
                    roomId:this.curTreeObj.id,
                    startTime:this.startTime,
                    paid:1,
                    projectTypeCode:this.projectType
                }

                let {data} = await api.getLackOfDetail(obj)
                this.pages.totalElements = data.totalElements
                this.paymentRecords = data.content
                this.loading = false;
            }catch (e) {
                this.loading = false;
            }

        }
        reset() {
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

        deleteGroup(){
            let newArr = [];
            this.checkList.forEach(item =>{
                newArr.push(item.id);
            })
            this.deleteFee(newArr);
        }
        //批量删除
        async deleteFee(ids:Array<any>) {
            if(ids.length >0){
                this.$confirm('此操作将永久删除选中的记录, 是否继续?', '操作提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await api.deleteFee(ids)
                        this.reset()
                        this.$message.success('删除成功')
                    } catch (e) {
                        this.$message.error('删除失败')
                    }
                }).catch(() => {

                });
            }
            else {
                this.$message.warning(`请选择需要删除的标准！`)
            }
        }

       payTypeRename(code:string){
            let obj:any =  this.payTypeList.find(item => item.code === code)
            return obj ? obj.name : `-`
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #chargeList {
        padding-top: 15px;
        /*height: calc(100% - 60px);*/
        height: 100%;
        width: 100%;
        .viewboxMain{
            display: flex;
        }

        .leftTree {

        }

        .borderRight {
            width: 1px;
            height: 100%;
            background-color: #dde4eb;
            box-shadow: 1px 0px 3px 0px #dde4eb;
            flex:none;
        }

        .rightMain {
            width: calc(100% - 221px);
            height: 100%;
            padding: 0 5px 0 20px;
            overflow: hidden;
            &.empty {
                display: flex;
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



</style>


