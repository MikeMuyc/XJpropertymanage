<template>
    <div  id="addSomeParkSpace" >
        <div class="costTitle" ref="costTitle" >
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            批量添加车位
        </div>
        <div class="main">
            <div class="addInfo">
                <div class="title">{{rdName}}-{{parking.name}}</div>
                <div style="border-bottom: dashed 1px #dde4eb;">
                    <div class="alineInfo">
                        <div class="h1">
                            <div class="label">
                                <em>*</em>
                                <i class="titleName">所属小区</i>
                            </div>
                            <div class="info">
                                <mixSelect
                                        class="margin"
                                        :selectList="buildingTree"
                                        labelName="name"
                                        valueName="id"
                                        childrenName="X"
                                        placeholder="请选择"
                                        v-model="addParkSpace.rdId"
                                        @sentItem="handleSearch"
                                >
                                </mixSelect>
                            </div>
                        </div>
                        <div class="h1">
                            <div class="label">
                                <em>*</em>
                                <i class="titleName">停车场</i>
                            </div>
                            <div class="info">
                                <mixSelect
                                        class="margin"
                                        :selectList="parkingList"
                                        labelName="name"
                                        valueName="id"
                                        placeholder="请选择"
                                        v-model="addParkSpace.parkingId"
                                >
                                </mixSelect>
                            </div>
                        </div>
                        <div class="h1">
                            <div class="label">
                                <em>*</em>
                                <i class="titleName">车位总数</i>
                            </div>
                            <div class="info">
                                <Input placeholder="请输入" v-model="addParkSpace.spaceTotal"></Input>
                            </div>
                        </div>
                        <div class="h1">
                            <div class="label">
                                <em>*</em>
                                <i class="titleName">起始编码</i>
                            </div>
                            <div class="info">
                                <Input placeholder="请输入" v-model="addParkSpace.spaceCodeStart"></Input>
                            </div>
                        </div>
                    </div>
                    <div class="alineInfo">
                        <div class="h1">
                            <div class="label">
                                <i class="titleName">车位面积 (㎡)</i>
                            </div>
                            <div class="info">
                                <Input placeholder="请输入" type="2fixed" v-model="addParkSpace.spaceArea"></Input>
                            </div>
                        </div>
                        <!--<div class="h1">-->
                            <!--<div class="label">-->
                                <!--<i class="titleName">租用期限</i>-->
                            <!--</div>-->
                            <!--<div class="info">-->
                                <!--<DatePicker type="daterange" placeholder=" 开始时间   ~   结束时间" style="width: 100%" split-panels ref="statusCodeRef"></DatePicker>-->
                            <!--</div>-->
                        <!--</div>-->
                    </div>
                    <div class="footer" style="margin-bottom: 30px;text-align: end">
                        <div class="pmbtn " style="margin-right: 10px" @click="templationInfo">预览</div>
                        <div class="pmbtn primary" @click="addSomeParkSpace">确定生成</div>
                    </div>
                </div>
            </div>
            <div class="preview" ref="previewRef">
                <div class="title" ref="titleRef">预览</div>
                <el-table
                        :data="tempParkSpaceList"
                        stripe
                        class="myWisdomTable"
                        :height="formHeight"
                        :header-cell-style="{background:'#f4f6f9'}"
                        v-loading="loading"
                        v-show="tableShow"
                        @cell-click='editTableInfo'
                >
                    <el-table-column slot="empty">
                        <img src="@manage/images/暂无数据.png">
                        <br>
                        暂无内容
                    </el-table-column>
                    <el-table-column
                            prop="spaceCode"
                            label="车位编号"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="spaceArea"
                            label="面积(㎡)"
                            min-width="100px"
                    >
                        <template slot-scope="{row,$index}">
                            <div v-if="row.spaceArea===null" style="color: #7c8185">
                            <Input style="width: 100px;" v-if="row.id===tableInfo.tableRowId&&scope.column.id===tableInfo.tableColumnId" @blur="getParkSpaceTempById(row.id,'')" @enter="getParkSpaceTempById(row.id,'')" v-model="parkSpacwTempById.spaceArea"></Input>
                                <div v-else style="cursor: pointer;">请输入</div>
                            </div>
                            <div v-else>
                                <Input style="width: 100px;" v-if="row.id===tableInfo.tableRowId&&scope.column.id===tableInfo.tableColumnId" @blur="getParkSpaceTempById(row.id,row.spaceArea)" @enter="getParkSpaceTempById(row.id,row.spaceArea)" v-model="row.spaceArea"></Input>
                                <div style="cursor: pointer;" v-else>{{row.spaceArea}}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <!--<el-table-column-->
                            <!--prop="roomConstructCode"-->
                            <!--label="使用期限"-->
                            <!--min-width="120px"-->
                            <!--show-overflow-tooltip-->
                    <!--&gt;-->
                    <!--</el-table-column>-->
                    <el-table-column
                            label="操作"
                            width="70px"
                    >
                        <template slot-scope="{row,$index}">
                            <div class="tableEdit">
                                <div class="item delete" @click="deleteParkSpaceInfo(row.id)">删除</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div align="center" style="margin-top: 10%" v-show="!tableShow">
                    <img src="@manage/images/暂无数据.png">
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox, RadioGroup, Radio,Select} from 'view-design'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/house/parkingInformation'
    import * as app from '@manage/api/app'

    @Component({
        components: {
            Icon,
            Page,
            Spin,
            DatePicker,
            Checkbox,
            mixSelect,
            Input,
            RadioGroup,
            Radio,
            Select
        }
    })

    export default class addSomeParkSpace extends Vue {
        @Prop({
            default: false,
        }) addSomeParkFlag!: boolean;
        @Prop({
            default: false,
        }) parking!: any;
        @Prop({
            default: false,
        }) pardId!: string;
        @Prop({
            default: false,
        }) rdName!: string;
        @Prop({
            default: false,
        }) rdInfo!: any;
        @Prop({
            default: false,
        }) buildingTree!: any;
        @Watch("addSomeParkFlag", { immediate: true, deep: true })
        getRoomId() {
            if(this.addSomeParkFlag){
                this.addParkSpace={
                    parkingId: '',
                    rdId: '',
                    rentedTimeEnd: null,
                    rentedTimeStart: null,
                    spaceArea: '',
                    spaceCodeStart: '',
                    spaceTotal: '',
                    statusCode: '1'
                }
                this.tempParkSpaceList=[]
                this.tableShow=false
                this.getHeight()
                this.addParkSpace.rdId=this.parking.rdId
                this.addParkSpace.parkingId=this.pardId
                this.getParkingLIst(this.parking.rdId)
            }
        }
        tableShow:boolean=false
        unitInfo:any=[]
        value1:string=''
        tempParkSpaceList:any=[]
        loading:boolean=false
        formHeight:number=600
        roomType:any=[]
        roomHead:any=[]
        roomConstruct:any=[]
        roomUsageType:any=[]
        parkingList:any=[]
        tableInfo:any={
            tableRowId:'',
            tableColumnId:''
        }
        parkSpacwTempById:any={
            spaceArea:null
        }
        subFlag:boolean=true
        addParkSpace:any={
            parkingId: '',
            rdId: '',
            rentedTimeEnd: null,
            rentedTimeStart: null,
            spaceArea: '',
            spaceCodeStart: '',
            spaceTotal: '',
            statusCode: '1'
        }
        mounted(): void {

        }
        getHeight(){
            let refs: any = this.$refs;
            setTimeout(() => {
                //Page组件高度为53px
                this.formHeight = (refs.previewRef.clientHeight  - refs.titleRef.clientHeight)
            },300)
        }
        backClose(){
            this.tempParkSpaceList=[]
            this.addParkSpace={
                parkingId: '',
                rdId: '',
                rentedTimeEnd: null,
                rentedTimeStart: null,
                spaceArea: '',
                spaceCodeStart: '',
                spaceTotal: '',
                statusCode: '1'
            }
            this.$emit('close')
        }
        handleSearch(){
            this.addParkSpace.parkingId=''
            this.getParkingLIst(this.addParkSpace.rdId)
        }
        editTableInfo(row,column,event,cell){
            this.tableInfo.tableRowId=row.id
            this.tableInfo.tableColumnId=column.id
        }
        templationInfo(){
            this.addSomeParkSpaceTemp()
        }
        //批量新增临时车位信息
        async addSomeParkSpaceTemp() {
            let limit = {
                "rdId": '所属小区',
                'parkingId': '停车场',
                'spaceTotal': '车位总数',
                'spaceCodeStart':'起始编码'
            }
            if (this.$utils.isntNull(this.addParkSpace, limit)) {
                try {
                    await api.addSomeParkSpaceTemp(this.addParkSpace)
                    this.getParkSpaceListTemp()
                    this.tableShow=true
                } catch (e) {
                    this.$message('预览失败')
                }
            }
        }
        //查询临时车位列表信息
        async getParkSpaceListTemp(){
            let {data}=await api.getSomeParkSpaceListTemp(this.addParkSpace.parkingId)
            this.tempParkSpaceList=data
        }
        //删除信息
        async deleteParkSpaceInfo(id) {
            const confirmResult = await this.$confirm(
                '此操作将删除该信息, 是否继续?',
                '操作提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            var ids: any = []
            ids = id.split('/t')
            try {
                await api.deleteParkSpaceTemp(ids)
                this.$message.success('删除成功')
                this.getParkSpaceListTemp()
            } catch (e) {
                this.$message.error('删除失败')
            }
        }

        //查询详细信息
        async getParkSpaceTempById(id,area){
            if(area!==''){
                this.parkSpacwTempById.spaceArea=area
            }
            else {
                area=this.parkSpacwTempById.spaceArea
            }
            if(area!==null){
                let {data}=await api.getParkSpaceTempById(id)
                this.parkSpacwTempById=data
                this.parkSpacwTempById.spaceArea=area
                this.updatePAckSpaceTepm()
            }
            else {
                this.tableInfo={
                    tableRowId:'',
                    tableColumnId:''
                }
            }
        }

        //修改车位信息
        async updatePAckSpaceTepm(){
            try {
                await api.updateParkSpaceTemp(this.parkSpacwTempById)
                this.getParkSpaceListTemp()
                this.parkSpacwTempById.spaceArea=null
                this.tableInfo={
                    tableRowId:'',
                    tableColumnId:''
                }
            }catch (e) {

            }
        }

        //确认生成车位
        async addSomeParkSpace(){
                 var ids: any = []
                 for(let i in this.tempParkSpaceList){
                     ids.push(this.tempParkSpaceList[i].id)
                 }
            if(ids.length!==0){
                 try {
                     await api.addSomeParkSapce(ids)
                     this.$message.success('生成成功')
                     this.tempParkSpaceList=[]
                     this.addParkSpace={
                         parkingId: '',
                         rdId: '',
                         rentedTimeEnd: null,
                         rentedTimeStart: null,
                         spaceArea: '',
                         spaceCodeStart: '',
                         spaceTotal: '',
                         statusCode: '1'
                     }
                     this.$emit('close')
                 }catch (e) {
                     this.$message.warning('生成失败')
                 }
        }
            else {
                this.$message.warning('请先预览信息')
            }
        }
        //查询停车场列表
        async getParkingLIst(id){
            let {data} =await api.getParkInfo(id)
            this.parkingList=data
        }


    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #addSomeParkSpace {
        padding:0 20px ;
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
        .main{
            padding-left: 15px;
            padding-right:200px;
            height: calc(100% - 60px);
            .title{
                font-size: 16px;
                font-weight: bolder;
                color: #30374a;
                padding: 20px 0;
            }
            .addInfo{
                width: 100%;
                height: 295px;
                .alineInfo{
                    width: 100%;
                    display: flex;
                    margin-bottom: 20px;
                    .h1{
                        display: flex;
                        align-items: center;
                        margin-right: 40px;
                    }
                    .label{
                        em{
                            color: #ff4040;
                        }
                        flex: none;
                        width: 85px;
                        text-align: right;
                        margin-right: 15px;
                    }
                    .info{
                        display: flex;
                        align-items: center;
                        width: 300px;
                        justify-content: space-between;
                    }
                }
            }
            .preview{
                height: calc(100% - 295px);
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
    .ivu-radio-group{
        display: flex;
    }
    .ivu-radio-wrapper{
        display: flex;
        align-items: center;
    }
    .preview{
        img{

        }
    }

</style>
<style lang="scss">
    #addSomeParkSpace{
        .myWisdomTable{
            .myInputbox .createdInput[data-v-e622407a]{
                height: 30px;
            }
        }
    }
</style>
