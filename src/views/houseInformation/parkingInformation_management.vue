<template>
    <div class="costTable" ref="tableMain">
        <div class="costTitle" ref="costTitle">
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            停车场管理
        </div>
        <div class="searchline" ref="searchline">
            <div class="left">
                <mixSelect
                        class="margin"
                        :selectList="rdList"
                        labelName="name"
                        valueName="id"
                        placeholder="小区"
                        v-model="rdIdSelect"
                        style="width: 130px;margin-right: 15px"
                >
                </mixSelect>
                <!--<mixSelect-->
                        <!--class="margin"-->
                        <!--:selectList="parkSpaceType"-->
                        <!--labelName="name"-->
                        <!--valueName="id"-->
                        <!--placeholder="类型"-->
                        <!--style="width: 130px"-->
                <!--&gt;-->
                <!--</mixSelect>-->
                <div class="margin" style="display: flex;margin-left: 15px">
                    <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px" v-model="keyword" @enter="getPage()"></Input>
                    <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                        <i class="iconfont iconsousuo" ></i>搜索
                    </div>
                    <div class="pmbtn" @click="resentInfo">
                        <i class="iconfont iconzhongzhi"></i>重置
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="pmbtn primary" @click="addPark">
                    <i class="iconfont icontianjia"></i>添加停车场
                </div>
            </div>
        </div>
        <el-table
                stripe
                :data="parkingList"
                :height="formHeight"
                :header-cell-style="{background:'#f4f6f9'}"
                v-loading="loading"
        >
            <template slot="empty" >
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>
            <el-table-column
                    label="序号"
                    align="center"
                    width="60"
                    :header-cell-style="{background:'#f4f6f9'}"
                    v-loading="loading"
            >
                <template slot-scope="{row,$index}">
                    {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="停车场名称"
                    show-overflow-tooltip
                    min-width="110">
            </el-table-column>
            <el-table-column
                    prop="rdId"
                    label="所属小区"
                    show-overflow-tooltip
                    min-width="110">
                <template slot-scope="{row,$index}">
                    {{buildingTree.find(x=>x.id===row.rdId).name}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="typeCode"
                    label="停车场类型"
                    min-width="110"
            >
                <template slot-scope="{row,$index}">
                    <div v-if="row.typeCode==='1'">地面</div>
                    <div v-else-if="row.typeCode==='2'">地下</div>
                    <div v-else-if="row.typeCode==='3'">人防</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="parkingSpaceNum"
                    label="总车位数"
                    min-width="90"
            >
            </el-table-column>
            <el-table-column
                    prop="area"
                    label="建筑面积(㎡)"
                    min-width="110"
            >
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="所在位置"
                    min-width="150"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    label="描述"
                    min-width="150"
                    show-overflow-tooltip
            >
                <template slot-scope="{row,$index}">
                    <span style="color: #7c8185">{{ row.description }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="165px"
            >
                <template slot-scope="{row,$index}">
                    <div class="tableEdit">
                        <div class="item" @click="openRoomImage(row)">平面图</div>
                        <div class="item" @click="openEditParkingDialog(row.id)">编辑</div>
                        <div class="item delete" @click="deleteParkingLot(row.id)">删除</div>
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
                :visible.sync="addParkVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                top="10vh"
                @close="closeAddParkingDialog"
                v-if="addParkVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                添加停车场
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"> <em class="fontSombal">*</em>所属小区</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="rdList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="addParking.rdId"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" ><em class="fontSombal">*</em>名称</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addParking.name" @blur="limitName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" ><em class="fontSombal">*</em>代码</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addParking.code" @blur="limitCode" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" >停车场类型</div>
                    <div class="info">
                        <mixSelect
                                v-model="addParking.typeCode"
                                :selectList="parkSpaceType"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" >建筑面积(㎡)</div>
                    <div class="info">
                        <Input placeholder="请输入" type="2fixed" v-model="addParking.area"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="width: 100px"><em class="fontSombal">*</em>所在位置</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addParking.address" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" >描述</div>
                    <div class="info">
                        <textarea style="width:100%" placeholder="请输入" v-model="addParking.description"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">平面图</div>
                    <div class="info">
                        <label class="upfile" for="addupload">
                            <img v-if="imgportadd" :src="imgportadd">
                            <i v-else class="icontianjia iconfont"></i>
                        </label>
                        <input type="file" accept="image/*" id="addupload" @change="upAddImg">
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addParkingLot">确定</div>
                <div class="pmbtn" @click="closeAddParkingDialog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="editParkVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                top="10vh"
                @close="closeEditParkingDialog"
                v-if="editParkVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改停车场信息
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label" ><em class="fontSombal">*</em>所属小区</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="rdList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="editParkInfo.rdId"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" ><em class="fontSombal">*</em>名称</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="editParkInfo.name" @blur="limitName1" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" ><em class="fontSombal">*</em>代码</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="editParkInfo.code" @blur="limitCode1" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" >停车场类型</div>
                    <div class="info">
                        <mixSelect
                                v-model="editParkInfo.typeCode"
                                :selectList="parkSpaceType"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" >建筑面积(㎡)</div>
                    <div class="info">
                        <Input placeholder="请输入" type="2fixed" v-model="editParkInfo.area"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="width: 100px"><em class="fontSombal">*</em>所在位置</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="editParkInfo.address" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" >描述</div>
                    <div class="info">
                        <textarea style="width:100%" placeholder="请输入" v-model="editParkInfo.description"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" >平面图</div>
                    <div class="info">
                        <label class="upfile" for="editupload">
                            <img v-if="imgport" :src="imgport">
                            <i v-else class="icontianjia iconfont"></i>
                        </label>
                        <input type="file" accept="image/*" id="editupload" @change="upeditImg">
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editParkingLot">确定</div>
                <div class="pmbtn" @click="closeEditParkingDialog">取消</div>
            </div>
        </el-dialog>
        <viewMap ref="viewMap"></viewMap>
    </div>
</template>
<script lang="ts">
    import {Vue, Component,Prop,Watch} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox,RadioGroup,Radio} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import viewMap from './components/viewMap.vue'
    import * as api from '@manage/api/house/parkingInformation'
    import * as app from '@manage/api/app'
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
            Input,
            RadioGroup,
            Radio,
            viewMap
        }
    })

    export default class costStatistics extends Vue {
        @Prop({
            default: false,
        }) rdId!: string;
        @Prop({
            default:false
        })parkManageFalg:boolean
        @Prop({
            default:false
        })buildingTree:any
        @Watch("parkManageFalg", { immediate: true, deep: true })
        gettableFlag() {
            if(this.parkManageFalg){
                let refs: any = this.$refs;
                //Page组件高度为53px
                this.formHeight = (refs.tableMain.clientHeight - refs.searchline.clientHeight  - refs.costTitle.clientHeight) - 42 - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                this.resentInfo()
                this.getRd()
                this.getPage()
            }
        }
        nameAndCode:any={
            name:'',
            code:''
        }
        loading: boolean = true;
        parkingList:any=[]
        rdList:any=[]
        rdIdSelect:string=''
        viewNameInfo:any={
            name:'',
            title:''
        }
        parkSpaceType:any=[
            {
                name:'地面',
                code:'1'
            },
            {
                name:'地下',
                code:'2'
            },
            {
                name:'人防',
                code:'3'
            }
        ]
        editParkInfo:any={}
        keyword:string=''
        building:string='single'
        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 0,
        };
        addParking:any={
            rdId: "",
            name: "",
            address: "",
            area: '',
            planId: "",
            description: "",
            typeCode: "",
            code:''
        }
        addParkVisible:boolean=false
        editParkVisible:boolean=false

        subFlag: boolean = true

        backClose(){
            this.$emit(`close`)
        }
        addPark(){
            this.addParkVisible=true
        }
        closeAddParkingDialog(){
            this.addParkVisible=false
            this.addParking={
                rdId: "",
                name: "",
                address: "",
                area: '',
                planId: "",
                description: "",
                code:''
            }
        }
        closeEditParkingDialog(){
            this.editParkVisible=false
        }
        openEditParkingDialog(id){
            this.editParkVisible=true
            this.getParkDetialInfo(id)
        }
        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getParkingLIst(this.rdIdSelect)
        }
        imageUrl: string = ''

        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        }
        mounted() {}

        viewImage(row) {
            this.viewNameInfo.name=row.name
            this.viewNameInfo.title='停车场平面图'
            let refs:any = this.$refs;
            refs.viewImage.openRdView();
        }

        resentInfo(){
            this.keyword=''
            this.rdIdSelect=''
            this.getPage()
        }
        async limitName(){
            if(this.addParking.name!==''){
                let {data}= await api.getUnique(null,this.addParking.name,this.rdId)
                if(data.length>0){
                    this.$message.warning('该名称已存在，请重新输入')
                    this.addParking.name=''
                }
            }
        }
        async limitName1(){
            if (this.editParkInfo.name!=='') {
                let {data}= await api.getUnique(null,this.editParkInfo.name,this.rdId)
                console.log(data[0])
                if(data.length>0&&data[0].name!==this.nameAndCode.name){
                    this.$message.warning('该名称已存在，请重新输入')
                    this.editParkInfo.name=''
                }
            }
        }
        async limitCode(){
            if(this.addParking.code!==''){
                let reg = /^[0-9a-zA-Z]+$/
                if (!reg.test(this.addParking.code)) {
                    this.$message.warning('请输入数字或字母')
                    console.log(this.addParking.code)
                    this.addParking.code = ''
                }
                else {
                    let {data}= await api.getUnique(this.addParking.code,null,this.rdId)
                    if(data.length>0){
                        this.$message.warning('该代码已存在，请重新输入')
                        this.addParking.code=''
                    }
                }}
        }
        async limitCode1(){
            if(this.editParkInfo.code!==''){
                let reg = /^[0-9a-zA-Z]+$/
                if (!reg.test(this.editParkInfo.code)) {
                    this.$message.warning('请输入数字或字母')
                    this.editParkInfo.code = ''
                }
                else {
                    let {data}= await api.getUnique(this.editParkInfo.code,null,this.rdId)
                    if(data.length>0&&data[0].code!==this.nameAndCode.code){
                        this.$message.warning('该代码已存在，请重新输入')
                        this.editParkInfo.code=''
                    }
                }
            }
        }
        //查询停车场列表
        async getParkingLIst(id){
            this.loading = true
            if(id===''){
                id=null
            }
            if(this.keyword===''){
                this.keyword=null
            }
           let {data} =await api.getParkListInfo(this.pages.pageNum,this.pages.pageSize,id,this.keyword)
            this.parkingList=data.content
            this.pages.totalElements=data.totalElements
            this.loading = false
        }
        //查询所有小区
        async getRd(){
            try{
                let {data} = await api.getTree()
                this.rdList = data
            }catch (e) {
                this.rdList = [];
                this.$message.error(`获取小区数据失败！`)
            }

        }
        //添加停车场信息
        async addParkingLot(){
            if(this.subFlag){
                this.subFlag = false
                let limit={
                    "rdId":'所属小区',
                    'name':'名称',
                    'code':'代码',
                    'address':'所在位置'
                }
                if(this.$utils.isntNull(this.addParking,limit)){
                    try {
                        await api.addParking(this.addParking)
                        this.$message.success('添加成功')
                        this.resentInfo()
                        this.closeAddParkingDialog()
                    }catch (e) {
                        this.$message.error('添加失败')
                    }
                }
            }
            this.subFlag = true
        }
        //删除停车场信息
        async deleteParkingLot(id){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该信息, 是否继续?',
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
                await api.deleteParkingInfo(ids)
                this.$message.success('删除成功')
                this.keyword=''
                this.rdIdSelect=''
                if(this.parkingList.length===1&&(this.pages.pageNum>1)){
                    this.pages.pageNum--
                }
                this.getParkingLIst(this.rdIdSelect)
            }catch (e) {
                this.$message.error('删除失败')
            }
        }
        //修改停车场信息
        async editParkingLot(){
            if(this.subFlag){
                this.subFlag = false
                let limit={
                    "rdId":'所属小区',
                    'name':'名称',
                    'code':'代码',
                    'address':'所在位置'
                }
                if(this.$utils.isntNull(this.editParkInfo,limit)){
                    try {
                        await api.updateParkingInfo(this.editParkInfo)
                        this.$message.success('修改成功')
                        this.editParkVisible=false
                        this.keyword=''
                        this.rdIdSelect=''
                        this.getParkingLIst(this.rdIdSelect)
                    }catch (e) {
                        this.$message.error('修改失败')
                    }
                }
            }
            this.subFlag = true;
        }
        //查询停车场详细信息
        async getParkDetialInfo(id){
            let{data}=await api.getParkingDetialInfo(id)
            this.editParkInfo=data
            this.nameAndCode.name=this.editParkInfo.name
            this.nameAndCode.code=this.editParkInfo.code
        }



        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        get imgportadd() {
            return this.addParking.planId ? this.$imgDownUrl() + `${this.addParking.planId}` : null
        }
        get imgport() {
            return this.editParkInfo.planId ? this.$imgDownUrl() + `${this.editParkInfo.planId}` : null
        }

        upAddImg(e) {
            let fd = new FormData();
            let type = `bmp,jpg,jpeg,png`;
            let bool2 = type.indexOf(e.target.files[0].type.replace(`image/`, ``)) > -1;
            if (!bool2) {
                this.$message({
                    showClose: true,
                    message: `图片格式错误！支持格式：bmp,jpg,jpeg,png。`,
                    type: 'error'
                });
            } else {
                fd.append("file", e.target.files[0]);
                fd.append("relativePath", '');
                let load:any = this.$loading(this.loaderOption);
                setTimeout(async () => {
                    try {
                        let {data: {id}} = await app.upImg(fd, this.$upBaseUrl());
                        this.addParking.planId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                    (<HTMLInputElement>document.getElementById('addupload')).value='';
                }, 200);
            }
        }

        upeditImg(e) {
            let fd = new FormData();
            let type = `bmp,jpg,jpeg,png`;
            let bool2 = type.indexOf(e.target.files[0].type.replace(`image/`, ``)) > -1;
            if (!bool2) {
                this.$message({
                    showClose: true,
                    message: `图片格式错误！支持格式：bmp,jpg,jpeg,png。`,
                    type: 'error'
                });
            } else {
                fd.append("file", e.target.files[0]);
                fd.append("relativePath", '');
                let load:any = this.$loading(this.loaderOption);
                setTimeout(async () => {
                    try {
                        let {data: {id}} = await app.upImg(fd, this.$upBaseUrl());
                        this.editParkInfo.planId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                    (<HTMLInputElement>document.getElementById('editupload')).value='';
                }, 200);
            }
        }

        openRoomImage(row) {
            let src:string  = row.planId ? this.$imgDownUrl() + `${row.planId}` : null;
            if (src) {
                let refs:any = this.$refs;
                refs.viewMap.openMap(src)
            } else {
                this.$message.warning(`该房间暂无平面图！`)
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
        .costTitle{
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;
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
            margin: 21px 0 ;
            .left{
                display: flex;
                .pmbtn{
                    flex: none;
                }
            }
            .right{
                .pmbtn{
                   margin-right: 5px;
                }
            }
        }
        .tableEdit{
            display: inline-flex;
            user-select: none;
            >.item{
                margin-right: 15px;
                color: $second-font-color;
                cursor: pointer;
                &:hover{
                    color: $theme-color;
                }
                &.delete:hover{
                    color: $error-color;
                }
            }
        }
    }
    .aline {
        .label {
            width: 100px;
        }
    }
    .avatar-uploader {
        width: 80px;
        height: 50px;
        border-radius: 4px;
        border: dashed 1px #dde4eb;
        cursor: pointer;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .avatar-uploader-icon {
        width: 20px;
        height: 20px;
        color: #c6c9ce;
        font-size: 20px;
    }
    .ivu-radio-wrapper{
        margin-right: 30px;
    }
    .fontSombal{
        color: #ff4040;
    }
</style>
<style lang="scss">
</style>
