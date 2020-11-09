<template>
    <div id="payWater" >
        <div class="thTitle">
            <i class="line"></i>预交水费
        </div>
        <div class="mainboxa">
            <div v-if="buildingTree.length === 0" class="viewboxMain empty">
                <img src="@manage/images/暂无2.png" >
                <br>
                <p>暂无数据，请先至 <i @click="$router.push({name:'房产管理'})">房产管理</i> 处添加小区</p>
            </div>
            <div v-else class="viewboxMain">
                <!--<div class="left">
                    <Input type="search" placeholder="搜索"></Input>
                    <vue-perfect-scrollbar style="height:calc(100% - 46px);margin-top: 10px;padding-right: 15px">
                        <Tree class="buildingTree"
                              ref="tree"
                              :data="buildingTree"
                              :render="renderContent"
                              @on-toggle-expand="treeExpand">
                        </Tree>
                    </vue-perfect-scrollbar>
                </div>-->

                <buildingTree @inited="inited"></buildingTree>
                <div class="borderRight"></div>
                <div v-show="curObject.id" class="right" ref="rightMain">
                    <div class="information" ref="information">
                        <div class="show">
                            <div class="showInfo">
                                <div class="usertext"><i class="iconfont iconzhanghao"></i><i style="font-size:18px">账号信息</i></div>
                                <div class="editText" @click="editShow"><i class="iconfont iconbianji"></i><i>编辑</i></div>
                            </div>
                        </div>
                        <div class="infoShow">
                            <div class="info">
                                <div class="headline">房间代码：</div>
                                <div class="contentInfo" :title="curObject.title">{{curObject.title || '无'}}</div>
                            </div>
                            <div class="info">
                                <div class="headline">客户名称：</div>
                                <div class="contentInfo" v-if="edit===false">{{accountInfo.clientName || '无'}}</div>
                                <el-input v-model="accountInfo.clientName" v-else></el-input>
                            </div>
                            <div class="info">
                                <div class="headline">账户余额：</div>
                                <div class="contentInfo" v-if="edit===false" style="color: #3a7ef3;">
                                    <i>¥</i>
                                    <i style="font-size: 20px;padding-left: 6px">xxx</i>
                                </div>
                                <el-input v-else></el-input>
                            </div>
                            <div class="info">
                                <div class="headline">最近预交时间：</div>
                                <div class="contentInfo">{{accountInfo.lastPaidTime || '无'}}</div>
                            </div>
                            <div class="info">
                                <div class="headline">最近预交金额：</div>
                                <div class="contentInfo">{{accountInfo.latePaidMoney || '无'}}</div>
                            </div>
                        </div>
                        <div class="control" v-if="edit">
                            <div class="save" @click="saveInfo">保存</div>
                            <div class="cancel" @click="cancelInfo">取消</div>
                        </div>
                    </div>
                    <div class="iconText" ref="iconText"><i class="iconfont iconjilu"></i><em>预交记录</em></div>
                    <div class="searchline" ref="searchline">
                        <div class="froat">
                            <div class="margin item" style="display: flex">
                                <i style="margin-right: 10px;margin-top: 8px">预交金额</i>
                                <Input placeholder="区间下限" style="width: 100px;" type="2fixed" v-model="startPaidMoney"></Input>
                                <Input placeholder="区间上限 "  style="width: 100px;margin: 0 10px"  type="2fixed" v-model="endPaidMoney"></Input>
                            </div>
                            <mixSelect
                                    class="margin"
                                    v-model="payTypeCode"
                                    :selectList="payType"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="付款方式"
                                    style="width: 140px;height: 36px"

                            >
                            </mixSelect>
                            <div class="margin item">
                                预交时间
                                <DatePicker ref="dateForm" type="daterange" format="yyyy-MM-dd" placeholder=" 开始时间   ~   结束时间" style="width: 200px;margin-left: 8px" @on-change="payableDate"></DatePicker>
                            </div>
                            <div class="margin" style="display: flex;">
                                <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px" v-model="keyword" @enter="getPage()"></Input>
                                <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                                    <i class="iconfont iconsousuo"></i>搜索
                                </div>
                                <div class="pmbtn" @click="resetInfo">
                                    <i class="iconfont iconzhongzhi"></i>重置
                                </div>
                            </div>
                        </div>
                        <div class="marginItem">
                            <div class="pmbtn primary" style="margin-right: 15px" @click="openDialog">
                                <i class="iconfont iconwuyeshoukuan"></i>
                                预交
                            </div>
                            <div class="item">
                                <div class="pmbtn" style="margin-right: 15px">
                                    <i class="iconfont icondayin"></i>
                                    打印凭证</div>
                                <div class="pmbtn" @click="deleteSomeInfo">
                                    <i class="iconfont iconshanchu"></i>
                                    删除</div>
                            </div>
                        </div>
                    </div>
                    <el-table
                            stripe
                            class="myTable"
                            :data="payWaterInfo"
                            :height="formHeight"
                            v-loading="loading"
                            ref="payWaterTable">
                        <template slot="empty" >
                            <img src="@manage/images/暂无数据.png">
                            <br>
                            暂无内容
                        </template>
                        <el-table-column
                                type="selection"
                                width="72"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="操作时间"
                                width="170"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="documentCode"
                                label="单据编号"
                                min-width="150"
                                show-overflow-tooltip
                        ></el-table-column>
                        <!--<el-table-column
                                prop=""
                                label="操作类型"
                                min-width="120"
                        ></el-table-column>-->
                        <el-table-column
                                prop="paidMoney"
                                label="金额(元)"
                                min-width="100"
                        >
                            <template slot-scope="{row,$index}">
                                <div v-if="row.paidMoney<0 " style="color: #ff2c2c">{{row.paidMoney | rounding}}</div>
                                <div v-else style="color: #333">{{row.paidMoney | rounding}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="personName"
                                label="操作员"
                                min-width="120"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="payTypeCode"
                                label="付款方式"
                                min-width="80"
                        >
                            <template slot-scope="{row,$index}">
                                {{payTypeRename(row.payTypeCode)}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="remark"
                                label="备注"
                                min-width="160"
                                show-overflow-tooltip
                        >
                            <template slot-scope="{row,$index}">
                                <div v-if="(row.remark || '暂无备注')=== '暂无备注'" style="color: #a0a5a9">暂无备注</div>
                                <div v-else >{{row.remark}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="59px"
                        >
                            <template slot-scope="{row,$index}">
                                <div class="delete" @click="deleteInfo(row.id)">删除</div>
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
                <div v-show="curObject.id === ''" class="right empty" >
                    <img src="@manage/images/暂无1.png" alt="">
                    <p >请在左侧选择一个房间</p>
                </div>
            </div>

        </div>

        <el-dialog
                v-if="dialogVisible"
                :visible.sync="dialogVisible"
                custom-class="emDialog"
                width="545px"
                @close="closeDialog"
                :close-on-click-modal="false"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                预交
            </div>
            <div class="MuModalContent" >
                <div class="aline">
                    <div class="label">房间代码</div>
                    <div class="info">
                        <Input placeholder="房间代码" disabled v-model="curObject.title"></Input>
                    </div>
                </div>
                <!--<div class="aline">
                    <div class="label">客户名称</div>
                    <div class="info">
                        <Input placeholder="客户名称" disabled v-model="accountInfo.clientName"></Input>
                    </div>
                </div>-->
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>预交金额</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addPayWater.paidMoney" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>付款方式</div>
                    <div class="info">
                        <RadioGroup v-model="addPayWater.payTypeCode">
                            <Radio v-for="item in payType" :label="item.code" :key="item.code" style="margin-right: 40px">
                                <span>{{item.name}}</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">备注信息</div>
                    <div class="info">
                        <textarea style="width: 100%" v-model="addPayWater.remark"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <Checkbox v-model="single">充值后打印凭条</Checkbox>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addWater">确定</div>
                <div class="pmbtn" @click="closeDialog">取消</div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Select,  Page, Button, Option, Icon, Spin,DatePicker,RadioGroup,Radio,Checkbox} from 'view-design'
    import { Tree } from 'iview'
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue'
    import * as api from '@manage/api/propertyCharge/payWater'
    import buildingTree from './components/buildingTreeLevel3.vue'
    @Component({
        filters: {
            rounding (value) {
                return value.toFixed(2)
            }
        },
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
            Radio,
            Checkbox,
            buildingTree
        }
    })
    export default class payWater extends Vue {
        payType:any=[]
        code:any=[]
        dialogVisible:boolean=false

        payEndDate:string=''
        startTime:string=''
        endTime:string=''
        keyword:string=''
        endPaidMoney:string=''
        payTypeCode:string=''
        startPaidMoney:string=''
        single:boolean=false
        accountInfo:any={
            clientName:'',

            lastPaidTime:'',
            latePaidMoney:'',
        }
        addPayWater:any={
            roomId:'',
            accountId:'',
            paidMoney:'',
            payTypeCode:'',
            documentCode:'',
            remark:'',
            documentId:''
        }
        flag:boolean=true
        payWaterInfo:any=[]
        edit:boolean=false
        formHeight: number = 600

        curObject: any = {
            id:'',
            rdId:'',
        };

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
                    class:{
                        treeActive:this.curObject.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if(data.level === 3){
                                this.curObject = data;
                                this.edit=false
                                this.getPayWaterAccount(data.title)

                                setTimeout(()=>{
                                    this.setPagesize();
                                    this.resetInfo();
                                },200)
                            }
                            else{
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
        buildingTree: any = [{}]
        formHeight: number = 200;
        pages: any = {
            pageNum: 1,
            pageSize:10,
            totalElements: 0,
        };
        resetDialog:boolean = false;
        rePay:number = 0;
        loading:boolean = false;
        subFlag: boolean = true;
        mounted(): void {
            this.getPayType()
        }
        inited(curObj:any){
            this.curObject = curObj;
            setTimeout(()=>{
                this.getPayWaterAccount(curObj.title)
                this.setPagesize();
                this.resetInfo();
            },200)
        }
        setPagesize(){
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let searchline = refs.searchline.clientHeight + 20;
            let information = refs.information.clientHeight;
            let iconText = refs.iconText.clientHeight;
            //Page组件高度为53px，rightTitle:46,middleline:152
            this.formHeight = maxHeight - searchline - iconText - information - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }
        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getPayWater()
        }

        editShow(){
            this.edit=true
        }
        async saveInfo(){
            if (this.subFlag) {
                this.subFlag = false;
                const confirmResult = await this.$confirm(
                    '此操作将修改选中信息, 是否继续?',
                    '操作提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消修改')
                }
                this.accountInfo.roomId = this.curObject.id
                try{
                    await api.updateAccountInfo(this.accountInfo)
                    this.getPayWaterAccount()
                    this.$message.success('修改成功')
                }catch (e) {
                    this.$message.error('修改失败')
                    this.getPayWaterAccount()
                }
                this.edit=false
                this.subFlag = true;
            }

        }
        cancelInfo(){
            this.edit=false
        }
        async deleteSomeInfo() {
            let refs:any = this.$refs;
            if(refs.payWaterTable.selection.length===0){
                this.$message.info('请选择要删除的记录')
            }
            else {
                const confirmResult = await this.$confirm(
                    '此操作将永久删除选中记录, 是否继续?',
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
                let ids:any = refs.payWaterTable.selection.map(item => item.id)
                try {
                    await api.deleteWayer(ids)
                    this.resetInfo()
                    this.$message.success('删除成功')
                }catch (e) {
                    this.$message.error('删除失败')
                }
            }
        }


        payDate(month){
            this.payEndDate=month

        }
        payableDate(daterange){
            this.startTime=daterange[0]
            this.endTime=daterange[1]

        }

        resetInfo(){
            let refs:any = this.$refs;
            this.payTypeCode=''
            this.payEndDate=''
            this.startTime=''
            this.endTime=''
            this.keyword=''
            this.startPaidMoney=''
            this.endPaidMoney=''
            refs.dateForm.handleClear()
            this.getPage()
        }
        async deleteInfo(id){
            const confirmResult = await this.$confirm(
                '此操作将永久删除选中的记录, 是否继续?',
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
            var ids:any=[]
            ids=id.split('/t')
            try {
                await api.deleteWayer(ids)
                this.resetInfo()
                this.$message.success('删除成功')
            }catch (e) {
                this.$message.error('删除失败')
            }
        }
        openDialog() {
            this.flag=true
            this.dialogVisible=true
            this.getCode()
        }
        closeDialog(){
            this.dialogVisible=false
            this.addPayWater={
                roomId:'',
                accountId:'',
                paidMoney:'',
                payTypeCode:'',
                documentCode:'',
                remark:'',
                documentId:''
            }
        }
        //结构树
        async gethouseData1(){
            try{
                let { data } = await api.getTree(0)
                data.forEach(item =>{
                    if(item.belongNum !== 0){
                        item.children = [{}];
                    }
                })
                this.buildingTree = data
            }catch (e) {
                this.buildingTree = [];
                this.$message.error(`获取小区数据失败！`)
            }

        }
        treeExpand(data){
            this.gethouseData(data,true)
        }
        async gethouseData(obj: any,bl?:boolean) {
            let {data} = await api.getTree(obj.level, obj.id);

            if (data) {
                obj.children = data;
            }
            if(obj.level === 1){
                obj.children.forEach(item =>{
                    item.rdId =  obj.id;
                })
                data.forEach(item =>{
                    if(item.belongNum !== 0){
                        item.children = [{}];
                    }
                })
            }
            else if(obj.level === 2){
                obj.children.forEach(item =>{
                    item.rdId =  obj.rdId;
                })
            }
            if(!bl){
                obj.expand = !obj.expand;
            }
        }

        //新增账号
        async addAcount(){
            await api.addAcount({
                roomId:this.curObject.id
            })
            this.getPayWaterAccount()
        }

        //查询房间预交水费
        async getPayWater(){
            this.loading = true;
            try {
                let {data} = await api.getPayWater(this.pages.pageNum,this.pages.pageSize,this.curObject.id,this.startTime,this.endTime,this.endPaidMoney,this.keyword,this.payTypeCode,this.startPaidMoney)
                this.payWaterInfo=data.content
                this.pages.totalElements=data.totalElements
                this.loading = false;
            }catch (e) {
                this.loading = false;
            }

        }

        async getPayWaterAccount(name?:string){
            try {
                let {data} = await api.getPayWaterAccount(this.curObject.id)
                this.accountInfo = data
                if(!data){
                    this.addAcount()
                }
                if(name){
                    this.accountInfo.roomName = name;
                }
            }catch (e) {

            }
        }

        //新增预交
        async addWater(){
            this.addPayWater.roomId=this.curObject.id
            this.addPayWater.documentCode=this.code.code
            this.addPayWater.documentId=this.code.id
            this.addPayWater.accountId=this.accountInfo.id
            if(this.addPayWater.paidMoney===''){
                this.$message.error('请输入预交金额')
            }
            else if(this.addPayWater.payTypeCode===''){
                this.$message.error('请选择支付方式')
            }
            else {
                if(this.flag){
                    try {
                        await api.addPayWater(this.addPayWater)
                        this.$message.success('添加成功')
                        this.dialogVisible=false
                        this.resetInfo()
                        this.flag=false
                    }catch (e) {
                        this.$message.error('添加失败')
                        this.flag=false
                    }
                }
            }
        }

        //可用单据
        async getCode(){

            let{data}= await api.getCode(this.curObject.rdId)
            this.code= data
        }

        //付款方式
        async getPayType(){
            let {data} = await api.getInfoByName('支付方式')
            this.payType=data
        }

        payTypeRename(code:string){
            let obj:any =  this.payType.find(item => item.code === code)
            return obj ? obj.name : `-`
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";
    #payWater {
        background: #fff;
        font-size: 14px;
        overflow-y: auto;
        .mainboxa{
            padding-top: 15px;
            height: calc(100% - 60px);
            width: 100%;

            .viewboxMain{
                display: flex;
            }
        }

        .left{
            width: 220px;
            padding-right: 15px;
            height:100%;
            flex:none;
        }
        .borderRight{
            width: 1px;
            height: 100%;
            background-color: #dde4eb;
            box-shadow: 1px 0px 3px 0px #dde4eb;
            flex:none;
        }
        .right{
            width: calc(100% - 221px);
            padding: 0 15px 0px 30px;
            .information{
                width: 100%;
                height: 116px;
                background-color: #f8f9fc;
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                .show{
                    width: 140px;
                    height: 100%;
                    background-image: linear-gradient(313deg, #4d9aff 0%, #3b66f6 100%);
                    color: #fff;
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                    flex: none;
                    position: relative;
                    .showInfo{
                        width: 100%;
                        height: 54px;
                        margin: -27px auto 0;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: space-around;
                        text-align: center;
                        position: absolute;
                        top: 50%;
                        .usertext{
                            height: 23px;
                            margin-bottom: 10px;
                            width: 100%;
                            .iconzhanghao{
                                padding-right: 9px;
                            }
                        }
                        .editText{
                            height: 18px;
                            user-select: none;
                            cursor: pointer;
                            .iconbianji{
                                font-size: 14px;
                                padding-right: 10px;
                            }
                        }
                    }
                }
                .infoShow{
                    width: calc(100% - 240px);
                    display: flex;
                    flex-wrap: wrap;
                    align-content: space-around;
                    align-items: center;
                    padding: 10px 0;
                    .info{
                        width: 33.33%;
                        height: 36px;
                        padding-left: 30px;
                        display: flex;
                        align-items: center;
                        .headline{
                            color: #7c8185;
                        }
                        .contentInfo {
                            padding-left: 15px;
                            color: #30374a;
                            max-width: calc(100% - 102px);
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .el-input {
                            margin-left: 10px;
                            width: 150px;
                            color: #30374a;
                        }
                    }
                }
                .control{
                    display: flex;
                    padding-top: 15px;
                    position: absolute;
                    right: 60px;
                    color: #3a7ef3;
                    .save{
                        padding-right: 15px;
                        cursor: pointer;
                    }
                    .cancel{
                        cursor: pointer;
                    }
                }
            }
            .iconText{
                font-size: 16px;
                padding-top:33px ;
                .iconjilu{
                    color: #3a7ef3;
                    width: 16px;
                    height: 14px;
                    padding-right: 8px;
                }
                em{
                    width: 69px;
                    height: 20px;
                    font-family: Microsoft YaHei UI;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 22px;
                    letter-spacing: 2px;
                    color: #333333;
                }
            }
            .searchline{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                margin-top: 20px;
                .froat{
                    display: flex;
                    flex-wrap: wrap;
                }
                .margin{
                    margin-right: 15px;
                    flex:none;
                    margin-bottom:10px;
                }
                .marginItem{
                    margin-bottom:20px;
                    .item{
                        height: 36px;
                        display: inline-flex;
                        align-items: center;
                    }
                }
            }
            .delete{
                color: $second-font-color;
                cursor: pointer;
                &.delete:hover{
                    color: $error-color;;
                }
            }
            &.empty{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                >p{
                    color: $third-font-color;
                    margin-top: 10px;
                }
            }
        }
    }
    .modalHeader{
        background-image: linear-gradient(313deg, #4d9aff 0%, #3b66f6 100%);
        color: #fff;
    }
    .aline {
        .label {
            //width: 120px;

        }
    }
</style>
<style lang="scss">
    #payWater {
        .buildingTree {
            width: calc(100% - 5px);
            overflow: hidden;
            margin-left: 5px;

            .ivu-tree-arrow {

            }

            .ivu-tree ul {
                font-size: 14px;
            }

            .treeActive{
                background-color: #e5f0ff;
                border: solid 1px #3a7ef3;
                color: #3a7ef3;
            }
            .iconxiaoqu {
                color: #3a7ef3;
            }

            .iconlouyu {
                color: #ffc848;
            }

            .treeText {
                cursor: pointer;
                user-select: none;
                padding: 0 6px;
                height: 24px;
                line-height: 24px;
                border-radius: 2px;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        textarea{height: 108px;
            width: 200px;
        }
        .el-input__inner {
            height: 36px;
            line-height: 36px;
        }
        .ivu-radio-wrapper{
            margin-right: 45px;
        }
    }
    .ivu-tree li ul{
        padding: 0 0 0 7px
    }
</style>
