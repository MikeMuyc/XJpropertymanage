<template>
    <div  id="addSomeHouse">
        <div class="costTitle" ref="costTitle" >
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            批量添加房间
        </div>
       <div class="main">
           <div class="addInfo" >
               <div class="title">{{rdInfo.name}}-{{buildingName}}</div>
               <div style="border-bottom: dashed 1px #dde4eb;">
                   <div class="alineInfo">
                   <div class="h1">
                       <div class="label">
                           <em>*</em>
                           <i class="titleName">单元</i>
                       </div>
                       <div class="info">
                           <el-select @change="handleChange" v-model="value1" multiple placeholder="请选择" style="width: 300px">
                               <el-option
                                       v-for="item in unitInfo"
                                       :key="item.id"
                                       :label="item.name"
                                       :value="item.id">
                               </el-option>
                           </el-select>
                       </div>
                   </div>
                   <div class="h1">
                       <div class="label">
                           <em>*</em>
                           <i class="titleName">楼层号</i>
                       </div>
                       <div class="info">
                           <Input placeholder="请输入" style="width: 130px" type="allNumber" v-model="addSomeHuose.floorCodeStart"></Input>
                           至
                           <Input placeholder="请输入" style="width: 130px"  type="allNumber" v-model="addSomeHuose.floorCodeEnd" @blur="limitFloorNum" ></Input>
                       </div>
                   </div>
                   <div class="h1">
                       <div class="label">
                           <em>*</em>
                           <i class="titleName">房间号</i>
                       </div>
                       <div class="info" >
                           <RadioGroup v-model="roomNumFlag" @on-change="handleChangeInfo">
                               <Radio label="zf" style="margin-right: 70px"><i style="font-size: 14px">字符型</i><Input @blur="limitRoomNum" placeholder="请输入" style="width: 215px;margin-left: 15px" v-model="addSomeHuose.roomNumChar" :disabled="roomFlag" ></Input></Radio>
                               <Radio label="sz"><i style="font-size: 14px">数字型</i><Input  placeholder="请输入" style="width: 130px;margin-left: 15px" type="number" v-model="addSomeHuose.roomNumStart" :disabled="!roomFlag"></Input>
                                   <i style="margin: 0 10px">至</i>
                                   <Input placeholder="请输入" style="width: 130px" type="number" v-model="addSomeHuose.roomNumEnd" :disabled="!roomFlag" ></Input></Radio>
                           </RadioGroup>
                       </div>
                   </div>
               </div>
                   <div class="alineInfo">
                       <div class="h1">
                           <div class="label">
                               <i class="titleName">房型</i>
                           </div>
                           <div class="info">
                               <mixSelect
                                       :selectList="roomType"
                                       labelName="name"
                                       valueName="code"
                                       childrenName="children"
                                       placeholder="请选择"
                                       style="max-width: 100%"
                                       v-model="addSomeHuose.roomTypeCode"
                               >
                               </mixSelect>
                           </div>
                       </div>
                       <div class="h1">
                           <div class="label">
                               <i class="titleName">朝向</i>
                           </div>
                           <div class="info">
                               <mixSelect
                                       :selectList="roomHead"
                                       labelName="name"
                                       valueName="code"
                                       childrenName="children"
                                       placeholder="请选择"
                                       style="max-width: 100%"
                                       v-model="addSomeHuose.roomTowardsCode"
                               >
                               </mixSelect>
                           </div>
                       </div>
                       <div class="h1">
                           <div class="label">
                               <i class="titleName">房间结构</i>
                           </div>
                           <div class="info">
                               <mixSelect
                                       :selectList="roomConstruct"
                                       labelName="name"
                                       valueName="code"
                                       childrenName="children"
                                       placeholder="请选择"
                                       style="max-width: 100%"
                                       v-model="addSomeHuose.roomConstructCode"
                               >
                               </mixSelect>
                           </div>
                       </div>
                       <div class="h1">
                           <div class="label">
                               <i class="titleName"><em>*</em>建筑面积 (㎡)</i>
                           </div>
                           <div class="info">
                               <Input placeholder="请输入" style="width: 300px" type="2fixed" v-model="addSomeHuose.buildArea" ></Input>
                           </div>
                       </div>
                   </div>
                   <div class="alineInfo">
                       <div class="h1">
                           <div class="label">
                               <i class="titleName"><em>*</em>使用面积 (㎡)</i>
                           </div>
                           <div class="info">
                               <Input placeholder="请输入" style="width: 300px" type="2fixed" v-model="addSomeHuose.useArea" ></Input>
                           </div>
                       </div>
                       <div class="h1">
                           <div class="label">
                               <i class="titleName">使用类型</i>
                           </div>
                           <div class="info">
                               <mixSelect
                                       :selectList="roomUsageType"
                                       labelName="name"
                                       valueName="code"
                                       childrenName="children"
                                       placeholder="请选择"
                                       style="max-width: 100%"
                                       v-model="addSomeHuose.roomUsageTypeCode"
                               >
                               </mixSelect>
                           </div>
                       </div>
                   </div>
                   <div class="footer" style="margin-bottom: 30px;text-align: end">
                       <div class="pmbtn " style="margin-right: 10px" @click="templationInfo">预览</div>
                       <div class="pmbtn primary" @click="addSomeHouse">确定生成</div>
                   </div>
               </div>
           </div>
           <div class="preview" ref="previewRef">
               <div class="title" ref="titleRef">预览</div>
               <el-table
                       :data="tempHouseList"
                       stripe
                       class="myWisdomTable"
                       :header-cell-style="{background:'#f4f6f9'}"
                       v-loading="loading"
                       v-show="tableShow"
                       @cell-click='showPTable2'
                     :height="formHeight"
               >
                   <el-table-column slot="empty">
                       <img src="@manage/images/暂无数据.png">
                       <br>
                       暂无内容
                   </el-table-column>
                   <el-table-column
                           prop="name"
                           label="房间代码"
                           min-width="120px"
                           show-overflow-tooltip
                   >
                   </el-table-column>
                   <el-table-column
                           prop="roomTypeCode"
                           label="房型"
                           min-width="100px"
                   >
                       <template slot-scope="scope">
                           <div v-if="scope.row.roomTypeCode===''" style="color: #a0a5a9;cursor: pointer;user-select: none">请选择
                               <div class="btnSelection" :class="{active:calcHover === true}" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column">
                                   <div class="selItem" @click="getHouseInfoById(scope.row.id,item.code,'roomTypeCode')" v-for="item in roomType">{{item.name}}</div>
                               </div>
                           </div>
                           <div v-else style="cursor: pointer;user-select: none">{{roomType.find(x =>x.code===scope.row.roomTypeCode).name}}
                               <div class="btnSelection" :class="{active:calcHover === true}" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column">
                                   <div class="selItem" @click="getHouseInfoById(scope.row.id,item.code,'roomTypeCode')" v-for="item in roomType">{{item.name}}</div>
                               </div>
                           </div>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="roomTowardsCode"
                           label="朝向"
                           min-width="50px"
                   >
                       <template slot-scope="scope">
                           <div v-if="scope.row.roomTowardsCode===''" style="color: #a0a5a9;cursor: pointer;user-select: none">请选择
                               <div class="btnSelection" :class="{active:calcHover === true}" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column">
                                   <div class="selItem" @click="getHouseInfoById(scope.row.id,item.code,'roomTowardsCode')" v-for="item in roomHead">{{item.name}}</div>
                               </div>
                           </div>
                           <div v-else style="cursor: pointer;user-select: none">{{roomHead.find(x =>x.code===scope.row.roomTowardsCode).name}}
                               <div class="btnSelection" :class="{active:calcHover === true}" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column">
                                   <div class="selItem" @click="getHouseInfoById(scope.row.id,item.code,'roomTowardsCode')" v-for="item in roomHead">{{item.name}}</div>
                               </div></div>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="roomConstructCode"
                           label="房间结构"
                           min-width="120px"
                   >
                       <template slot-scope="scope">
                           <div v-if="scope.row.roomConstructCode===''" style="color: #a0a5a9;cursor: pointer;user-select: none">请选择
                               <div class="btnSelection" :class="{active:calcHover === true}" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column">
                                   <div class="selItem" @click="getHouseInfoById(scope.row.id,item.code,'roomConstructCode')" v-for="item in roomConstruct">{{item.name}}</div>
                               </div>
                           </div>
                           <div v-else style="cursor: pointer;user-select: none">{{roomConstruct.find(x =>x.code===scope.row.roomConstructCode).name}}
                               <div class="btnSelection" :class="{active:calcHover === true}" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column">
                                   <div class="selItem" @click="getHouseInfoById(scope.row.id,item.code,'roomConstructCode')" v-for="item in roomConstruct">{{item.name}}</div>
                               </div></div>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="buildArea"
                           label="建筑面积(㎡)"
                           min-width="120px"
                   >
                       <template slot-scope="scope">
                               <Input style="width: 100px" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column" v-model="scope.row.buildArea"
                               @blur="getHouseInfoById(scope.row.id,scope.row.buildArea,'buildArea')" @enter="getHouseInfoById(scope.row.id,scope.row.buildArea,'buildArea')"
                               ></Input>
                           <div v-else style="cursor: pointer;user-select: none">{{scope.row.buildArea}}</div>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="useArea"
                           label="使用面积(㎡)"
                           min-width="120px"
                   >
                       <template slot-scope="scope">
                           <Input style="width: 100px" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column" v-model="scope.row.useArea"
                                  @blur="getHouseInfoById(scope.row.id,scope.row.useArea,'useArea')" @enter="getHouseInfoById(scope.row.id,scope.row.useArea,'useArea')"
                           ></Input>
                           <div v-else style="cursor: pointer;user-select: none">{{scope.row.useArea}}</div>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="roomUsageTypeCode"
                           label="使用类型"
                           min-width="80px"
                   >
                       <template slot-scope="scope">
                           <div v-if="scope.row.roomUsageTypeCode===''" style="color: #a0a5a9;cursor: pointer;user-select: none">请选择
                               <div class="btnSelection" :class="{active:calcHover === true}" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column">
                                   <div class="selItem" @click="getHouseInfoById(scope.row.id,item.code,'roomUsageTypeCode')" v-for="item in roomUsageType">{{item.name}}</div>
                               </div>
                           </div>
                           <div v-else style="cursor: pointer;user-select: none">{{roomUsageType.find(x =>x.code===scope.row.roomUsageTypeCode).name}}
                               <div class="btnSelection" :class="{active:calcHover === true}" v-if="scope.row.id===tableColumn.row&&scope.column.id===tableColumn.column">
                                   <div class="selItem" @click="getHouseInfoById(scope.row.id,item.code,'roomUsageTypeCode')" v-for="item in roomUsageType">{{item.name}}</div>
                               </div></div>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="roomStatusCode"
                           label="房屋状态"
                           min-width="80px"
                   >
                       <template slot-scope="scope">未售
                       </template>
                   </el-table-column>
                   <el-table-column
                           label="操作"
                           width="70px"
                   >
                       <template slot-scope="{row,$index}">
                           <div class="tableEdit">
                               <div class="item delete" @click="deleteRoomInfo(row.id)">删除</div>
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
    import * as api from '@manage/api/house/huoseProperty'


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

    export default class commounity extends Vue {
        @Prop({
            default: false,
        }) addSomeHouseFlag!: boolean;
        @Prop({
            default: false,
        }) roomId!: string;
        @Prop({
            default: false,
        }) buildingName!: string;
        @Prop({
            default: false,
        }) rdInfo!: any;
        @Prop({
            default: false,
        }) buildingDetailInfo!: any;
        @Watch("addSomeHouseFlag", { immediate: true, deep: true })
        getRoomId() {
            if(this.addSomeHouseFlag){
                console.log(this.buildingDetailInfo)
                this.getUnitInfo()
                this.getHeight()
            }
        }
        roomNumFlag:string='zf'
        unitInfo:any=[]
        value1:any=[]
        loading: boolean = false
        formHeight:number=600
        roomType:any=[]
        roomHead:any=[]
        houseInfoById:any=[]
        roomConstruct:any=[]
        roomUsageType:any=[]
        roomStatus:any=[]
        tempHouseList:any=[]
        roomFlag:boolean=false
        tableShow:boolean=false
        subFlag:boolean=true
        calcHover:boolean=false
        tableColumn:any={
            row:'',
            column:''
        }
        addSomeHuose:any={
            buildArea: '',
            buildingId: "",
            floorCodeEnd: '',
            floorCodeStart: '',
            rdId: "",
            roomConstructCode: "",
            roomName: "",
            roomNumChar: "",
            roomNumEnd: '',
            roomNumStart: '',
            roomStatusCode: "2",
            roomTowardsCode: "",
            roomTypeCode: "",
            roomUsageTypeCode: "",
            useArea: '',
            unitIdList:[]
        }
        mounted(): void {
            this.getRoomType()
            this.getRoomHead()
            this.getRoomConstruct()
            this.getRoomStatus()
            this.getRoomUsageType()
        }
        getHeight(){
            let refs: any = this.$refs;
            setTimeout(() => {
                //Page组件高度为53px
                this.formHeight = (refs.previewRef.clientHeight  - refs.titleRef.clientHeight)
            },300)
        }
        backClose(){
            this.tempHouseList=[]
            this.value1=[],
            this.addSomeHuose={
                buildArea: '',
                buildingId: "",
                floorCodeEnd: '',
                floorCodeStart: '',
                rdId: "",
                roomConstructCode: "",
                roomName: "",
                roomNumChar: "",
                roomNumEnd: '',
                roomNumStart: '',
                roomStatusCode: "2",
                roomTowardsCode: "",
                roomTypeCode: "",
                roomUsageTypeCode: "",
                useArea: '',
                unitIdList:[]
            }
            this.$emit('close')

        }
        limitFloorNum(){
            if(this.addSomeHuose.floorCodeEnd!==''&&(this.addSomeHuose.floorCodeEnd>this.buildingDetailInfo.upFloorNum)&&this.buildingDetailInfo.upFloorNum!==0){
                this.$message.warning('楼层范围超出该楼最大楼层数，请重新输入')
                this.addSomeHuose.floorCodeEnd=''
            }
        }
        limitRoomNum(){
             let reg = /^[A-Za-z]+$/
            if (this.addSomeHuose.roomNumChar !== '') {
                if (!reg.test(this.addSomeHuose.roomNumChar)) {
                    this.$message.warning('请输入字母')
                    this.addSomeHuose.roomNumChar = ''
                }
            }
        }
        handleChangeInfo(){
                this.roomFlag=!this.roomFlag
        }
        handleChange(val){
           this.addSomeHuose.unitIdList=val
        }
        templationInfo(){
            this.addSomeHouseTemp()
        }
        closeHover1() {
            this.calcHover = false
        }
        showPTable2(row,column,event,cell) {
            if(column.id===this.tableColumn.column&&row.id===this.tableColumn.row){
                this.calcHover=!this.calcHover
            }
            else {
                this.calcHover=true
            }
            this.tableColumn.column=column.id
            this.tableColumn.row=row.id
        }
        //新增临时房间信息
        async addSomeHouseTemp(){
            this.tempHouseList=[]
            if (this.subFlag) {
                this.subFlag = false;
                this.addSomeHuose.rdId = this.rdInfo.id
                this.addSomeHuose.buildingId = this.roomId
                if(this.roomNumFlag==='zf'){
                    this.addSomeHuose.roomNumStart=''
                    this.addSomeHuose.roomNumEnd=''
                }
                else {
                    this.addSomeHuose.roomNumChar=''
                }
                let limit = {
                    "floorCodeEnd": '楼层号',
                    'buildArea':'建筑面积',
                    'useArea':'使用面积'
                }
                if(this.addSomeHuose.floorCodeStart===''){
                    this.addSomeHuose.floorCodeStart=1
                }
                if (this.$utils.isntNull(this.addSomeHuose, limit)) {
                    if(this.unitInfo.length>0&&(this.addSomeHuose.unitIdList.length<1)){
                        this.$message.warning('单元不能为空')
                    }
                    else {
                        if(this.roomNumFlag==='zf'&&this.addSomeHuose.roomNumChar===''){
                            this.$message.warning('房间号不能为空')
                        }
                        else {
                            if(this.roomNumFlag==='sz'&&(this.addSomeHuose.roomNumEnd===''||this.addSomeHuose.roomNumStart==='')){
                                this.$message.warning('输入完整区间')
                            }
                            else {
                                try {
                                    await api.addSomeHouseTemp(this.addSomeHuose)
                                    this.getTempHouseList()
                                    this.tableShow=true
                                } catch (e) {
                                    this.$message.error('添加失败');
                                }
                            }
                        }
                    }
                }
            }
            this.subFlag = true;
        }
        //查询临时房间列表
        async getTempHouseList(){
            this.loading = true
            let unitIds=this.addSomeHuose.unitIdList.toString()
            if(unitIds===''){
                unitIds=null
            }
            let {data}= await api.getTempHouseList(this.roomId,this.rdInfo.id,unitIds)
            this.tempHouseList=data
            this.loading = false
        }

        //删除信息
        async deleteRoomInfo(id) {
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
                await api.deletePreInfo(ids)
                this.$message.success('删除成功')
                this.getTempHouseList()

            } catch (e) {
                this.$message.error('删除失败')
            }
        }

        //查询房间详细信息
        async getHouseInfoById(id,code,name){
            let {data}=await api.getHouseInfoById(id)
            this.houseInfoById=data
            if(name==='roomTypeCode'){
                this.houseInfoById.roomTypeCode=code
            }
            else if(name==='roomTowardsCode'){
                this.houseInfoById.roomTowardsCode=code
            }
            else if(name==='roomConstructCode'){
                this.houseInfoById.roomConstructCode=code
            }
            else if(name==='roomUsageTypeCode'){
                this.houseInfoById.roomUsageTypeCode=code
            }
            else if(name==='buildArea'){
                console.log(code)
                if(code===''){
                    this.$message.warning('建筑面积不能为空')
                }
                else {
                    this.houseInfoById.buildArea=code
                }
            }
            else if(name==='useArea'){
                if(code===''){
                    this.$message.warning('使用面积不能为空')
                }
                else {
                    this.houseInfoById.useArea=code
                }
            }
            this.updateHouseInfo()
        }

        //修改房间信息
        async updateHouseInfo(){
            try {
                await api.updatehouseInfo(this.houseInfoById)
                this.getTempHouseList()
                this.tableColumn={
                    row:'',
                    column:''
                }
            }catch (e) {

            }
        }

        //确定生成房间
        async addSomeHouse(){
            var ids: any = []
            for(let i in this.tempHouseList){
                ids.push(this.tempHouseList[i].id)
            }
            if(ids.length!==0){
                try {
                    await api.addSomeHouse(ids)
                    this.$message.success('添加成功')
                    this.tempHouseList=[]
                    this.value1=[]
                    this.addSomeHuose={
                        buildArea: '',
                        buildingId: "",
                        floorCodeEnd: '',
                        floorCodeStart: '',
                        rdId: "",
                        roomConstructCode: "",
                        roomName: "",
                        roomNumChar: "",
                        roomNumEnd: '',
                        roomNumStart: '',
                        roomStatusCode: "2",
                        roomTowardsCode: "",
                        roomTypeCode: "",
                        roomUsageTypeCode: "",
                        unitId: "",
                        unitIdList:[]
                    }
                    this.tableShow=false
                    this.$emit('close')
                }catch (e) {
                    this.$message.success('添加失败')
                }
            }
        }

        //查询单元
        async getUnitInfo() {
            let {data} = await api.getUnitInfo(this.roomId)
            this.unitInfo = data
            console.log(this.unitInfo)
        }
        //房屋类型
        async getRoomType() {
            let {data} = await api.getInfoByName('房屋类型')
            this.roomType = data
        }

        //房屋朝向
        async getRoomHead() {
            let {data} = await api.getInfoByName('房屋朝向')
            this.roomHead = data
        }

        //房屋结构
        async getRoomConstruct() {
            let {data} = await api.getInfoByName('房屋结构')
            this.roomConstruct = data
        }

        //房屋使用类型
        async getRoomUsageType() {
            let {data} = await api.getInfoByName('房屋使用类型')
            this.roomUsageType = data
        }

        //房屋状态
        async getRoomStatus() {
            let {data} = await api.getInfoByName('房屋状态')
            this.roomStatus = data
        }


    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #addSomeHouse {
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
           width: 100%;
           height: calc(100% - 60px);
           padding-right:200px;
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
                   display: flex;
                   margin-bottom: 20px;
                   .h1{
                       display: flex;
                       align-items: center;
                       margin-right: 60px;
                   }
                   .label{
                       em{
                           color: #ff4040;
                       }
                       flex: none;
                       width: 70px;
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
    .btnSelection{
        position: absolute;
        left: 0;
        top: 40px;
        width: 100%;
        padding: 0 0;
        background-color: #ffffff;
        box-shadow: 0px 1px 4px 0px
        rgba(183, 183, 183, 0.6);
        border-radius: 4px;
        z-index: 2;
        transition: all .2s;
        transform-origin: center top 0;
        transform: rotateX(-90deg);
        &.active{
            transform: rotateX(0deg);
        }
        .selItem{
            color: $font-color;
            width: 100%;
            height: 36px;
            display: inline-flex;
            align-items: center;
            justify-content: center;

            &:hover{
                background-color: #e5f0ff;
            }
        }
    }
</style>
<style lang="scss">
    #addSomeHouse{
        .myWisdomTable{
            .myInputbox .createdInput[data-v-e622407a]{
                height: 30px;
            }
        }
    }
</style>
