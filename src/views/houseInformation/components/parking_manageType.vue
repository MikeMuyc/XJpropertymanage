<template>
    <el-dialog
            :visible.sync="manageTypeDialog"
            custom-class="emDialog"
            width="545px"
            :modal-append-to-body="false"
            :append-to-body="true"
            top="10vh"
            @close="closeManageTypeDialog"
            :close-on-click-modal="false"
            v-if="manageTypeDialog"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            使用登记
        </div>
        <div>
           <div v-show="!(spaceManagesType.managesType==='4'&&activity===1)">
               <div class="aline">
               <div class="label"> <em class="fontSombal">*</em>车位编号</div>
               <div class="info">
                   <el-select v-model="spaceManagesType.spaceId" filterable placeholder="请选择" clearable style="width: 100%">
                       <el-option
                               v-for="item in parkSpaceNumber"
                               :key="item.id"
                               :label="item.code"
                               :value="item.id">
                       </el-option>
                   </el-select>
               </div>
           </div>
               <div class="aline">
                   <div class="label"> <em class="fontSombal">*</em>管理类型</div>
                   <div class="info">
                       <mixSelect
                               class="margin"
                               :selectList="manageType"
                               labelName="name"
                               valueName="code"
                               placeholder="车位状态"
                               style="width: 100%"
                               v-model="spaceManagesType.managesType"
                               @sentItem="orderStateSearch"
                       >
                       </mixSelect>
                   </div>
               </div>
           </div>
        <div class="dialogMainbox">
           <div style="margin-top: 15px" v-show="spaceManagesType.managesType==='3'">
               <div class="aline">
                   <div class="label"> <em class="fontSombal">*</em>租方姓名</div>
                   <div class="info">
                       <el-select v-model="wyzlName" filterable placeholder="请选择" clearable style="width: 100%" @change="handleSelectZFName" :filter-method="handFifter" >
                           <el-option
                                   v-for="item in nameListByRdId"
                                   :key="item.proprietorId"
                                   :label="`${item.name}(${item.tel})`"
                                   :value="item.proprietorId">
                           </el-option>
                       </el-select>
                   </div>
               </div>
               <div class="aline">
                   <div class="label">身份证号码</div>
                   <div class="info">
                       <Input placeholder="" v-model="spaceManagesType.spaceManagesTypeWYZL.cardNumber"></Input>
                   </div>
               </div>
               <div class="aline">
                   <div class="label"> <em class="fontSombal">*</em>联系电话</div>
                   <div class="info">
                       <Input placeholder="" v-model="spaceManagesType.spaceManagesTypeWYZL.proprietorTel" necessary></Input>
                   </div>
               </div>
               <div class="aline">
                   <div class="label"> <em class="fontSombal">*</em>使用房间号</div>
                   <div class="info">
                       <mixSelect
                               class="margin"
                               :selectList="roomInfoById"
                               labelName="name"
                               valueName="id"
                               placeholder="请选择"
                               :disabled="userRoomNumFlag"
                               v-model="spaceManagesType.spaceManagesTypeWYZL.roomId"
                       >
                       </mixSelect>
                   </div>
               </div>
               <div class="aline">
                   <div class="label">租赁合同号</div>
                   <div class="info">
                       <Input placeholder="请输入（非必填）" v-model="spaceManagesType.spaceManagesTypeWYZL.contractCode"></Input>
                   </div>
               </div>
               <div class="aline">
                   <div class="label"><em class="fontSombal">*</em>租赁时间</div>
                   <div class="info">
                       <DatePicker split-panels ref="dateForm" type="daterange" format="yyyy-MM-dd"
                                   placeholder=" 开始时间   ~   结束时间" style="width: 100%" @on-change="handleTimeChange"></DatePicker>
                   </div>
               </div>
           </div >
            <div style="margin-top: 15px" v-show="spaceManagesType.managesType==='2'">
                <div class="aline">
                    <div class="label"> <em class="fontSombal">*</em>业主姓名</div>
                    <div class="info">
                        <el-select v-model="yzzyName" filterable placeholder="请选择" clearable style="width: 100%" @change="handleSelectYzzyName" :filter-method="handFifterYzzy">
                            <el-option
                                    v-for="item in nameListByRdId"
                                    :key="item.proprietorId"
                                    :label="`${item.name}(${item.tel})`"
                                    :value="item.proprietorId">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">身份证号码</div>
                    <div class="info">
                        <Input placeholder="" v-model="spaceManagesType.spaceManagesTypeYZZY.cardNumber"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"> <em class="fontSombal">*</em>联系电话</div>
                    <div class="info">
                        <Input placeholder="" v-model="spaceManagesType.spaceManagesTypeYZZY.proprietorTel" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"> <em class="fontSombal">*</em>房间号</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="roomInfoById"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                :disabled="userRoomNumFlag"
                                v-model="spaceManagesType.spaceManagesTypeYZZY.roomId"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">购买合同号</div>
                    <div class="info">
                        <Input placeholder="请输入（非必填）" v-model="spaceManagesType.spaceManagesTypeYZZY.contractCode"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">使用时间</div>
                    <div class="info">
                        <DatePicker split-panels ref="dateForm" type="daterange" format="yyyy-MM-dd"
                                    placeholder=" 开始时间   ~   结束时间" style="width: 100%"  @on-change="handleTimeChangeYz"></DatePicker>
                    </div>
                </div>
            </div>
            <div style="margin-top: 15px"  v-show="spaceManagesType.managesType==='4'&&activity===0">
                    <div class="aline">
                        <div class="label car">产权信息:</div>
                    </div>
                    <div class="aline">
                    <div class="label car"> <em class="fontSombal">*</em>业主姓名</div>
                    <div class="info">
                        <div class="info">
                            <el-select v-model="dlzlyzName" filterable placeholder="请选择" clearable style="width: 100%" @change="handleSelectYzzyName" :filter-method="handFifterDlzlyz">
                                <el-option
                                        v-for="item in nameListByRdId"
                                        :key="item.proprietorId"
                                        :label="`${item.name}(${item.tel})`"
                                        :value="item.proprietorId">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                    <div class="aline">
                        <div class="label car">身份证号码</div>
                        <div class="info">
                            <Input placeholder="" v-model="spaceManagesType.spaceManagesTypeYZZY.cardNumber"></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car"> <em class="fontSombal">*</em>联系电话</div>
                        <div class="info">
                            <Input placeholder="" v-model="spaceManagesType.spaceManagesTypeYZZY.proprietorTel" necessary></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car"> <em class="fontSombal">*</em>房间号</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    :selectList="roomInfoById"
                                    labelName="name"
                                    valueName="id"
                                    placeholder="请选择"
                                    :disabled="userRoomNumFlag"
                                    v-model="spaceManagesType.spaceManagesTypeYZZY.roomId"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car">购买合同号</div>
                        <div class="info">
                            <Input placeholder="请输入（非必填）" v-model="spaceManagesType.spaceManagesTypeYZZY.contractCode"></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car">使用时间</div>
                        <div class="info">
                            <DatePicker split-panels ref="dateForm" type="daterange" format="yyyy-MM-dd"
                                        placeholder=" 开始时间   ~   结束时间" style="width: 100%" @on-change="handleTimeChangeYz"></DatePicker>
                        </div>
                    </div>
            </div>
            <div  v-show="spaceManagesType.managesType==='4'&&activity!==0">
                <div>
                    <div class="aline">
                        <div class="label">租客信息:</div>
                    </div>
                    <div class="aline">
                        <div class="label car"> <em class="fontSombal">*</em>租方姓名</div>
                        <div class="info">
                            <el-select v-model="dlzlZfName" filterable placeholder="请选择" clearable style="width: 100%" @change="handleSelectZFName" :filter-method="handFifterdlzlzf" >
                                <el-option
                                        v-for="item in nameListByRdId"
                                        :key="item.proprietorId"
                                        :label="`${item.name}(${item.tel})`"
                                        :value="item.proprietorId">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car">身份证号码</div>
                        <div class="info">
                            <Input placeholder="" v-model="spaceManagesType.spaceManagesTypeWYZL.cardNumber"></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car"> <em class="fontSombal">*</em>联系电话</div>
                        <div class="info">
                            <Input placeholder="" v-model="spaceManagesType.spaceManagesTypeWYZL.proprietorTel" necessary></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car"> <em class="fontSombal">*</em>使用房间号</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    :selectList="roomInfoById"
                                    labelName="name"
                                    valueName="id"
                                    placeholder="请选择"
                                    :disabled="userRoomNumFlag"
                                    v-model="spaceManagesType.spaceManagesTypeWYZL.roomId"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car">租赁合同号</div>
                        <div class="info">
                            <Input placeholder="请输入（非必填）" v-model="spaceManagesType.spaceManagesTypeWYZL.contractCode"></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car"><em class="fontSombal">*</em>租赁时间</div>
                        <div class="info">
                            <DatePicker split-panels ref="dateForm" type="daterange" format="yyyy-MM-dd"
                                        placeholder=" 开始时间   ~   结束时间" style="width: 100%" @on-change="handleTimeChange"></DatePicker>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 15px" v-show="(spaceManagesType.managesType!==''&&spaceManagesType.managesType!=='4')||(spaceManagesType.managesType==='4'&&activity!==0)">
                <div>
                    <div class="aline">
                        <div class="label"><em class="fontSombal">*</em>登记车牌1：</div>
                    </div>
                    <div class="aline">
                        <div class="label car">车牌号</div>
                        <div class="info">
                            <Input placeholder="" v-model="spaceManagesType.carNum1" necessary @blur="limitCarNum1"></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car">车牌颜色</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    :selectList="colorList"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    v-model="spaceManagesType.plateColorCode1"
                            >
                            </mixSelect>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="aline" style="margin-top: 15px">
                        <div class="label">登记车牌2：</div>
                    </div>
                    <div class="aline">
                        <div class="label car">车牌号</div>
                        <div class="info">
                            <Input placeholder="" v-model="spaceManagesType.carNum2" @blur="limitCarNum2"></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label car">车牌颜色</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    :selectList="colorList"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    v-model="spaceManagesType.plateColorCode2"
                            >
                            </mixSelect>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div slot="footer">
            <div class="pmbtn" style="margin-right: 10px" @click="closeManageTypeDialog">取消</div>
            <div class="pmbtn primary"  @click="" v-show="spaceManagesType.managesType!=='4'||(spaceManagesType.managesType==='4'&&activity!==0)" @click="registration">确定</div>
            <div class="pmbtn primary"  @click="next" v-show="spaceManagesType.managesType==='4'&&activity===0">下一步</div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox, RadioGroup, Radio} from 'view-design'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/house/parkingInformation'
    import * as app from '@manage/api/app'
    import * as apii from '@manage/api/house/huoseProperty'

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
        }
    })
    export default class mainView extends Vue {
        subFlag:boolean=true
        userRoomNumFlag:boolean=true
        wyzlName:string=''
        yzzyName:string=''
        dlzlyzName:string=''
        dlzlZfName:string=''
        activity:number=0
        manageType:any=[
            {name:'物业自用',
                code:'1'
            },
            {name:'业主自用',
                code:'2'
            },
            {name:'物业租赁',
                code:'3'
            },
            {name:'代理租赁',
                code:'4'
            },
        ]
        spaceManagesType:any={
            carNum1: '',
            carNum2: '',
            managesType: '',
            plateColorCode1: '',
            plateColorCode2: '',
            spaceId: '',
            spaceManagesTypeWYZL: {
                cardNumber: '',
                contractCode: '',
                proprietorId: '',
                proprietorName: '',
                proprietorTel: '',
                rentedTimeEnd: '',
                rentedTimeStart: '',
                roomId: ''
            },
            spaceManagesTypeYZZY: {
                cardNumber: '',
                contractCode: '',
                proprietorId: '',
                proprietorName: '',
                proprietorTel: '',
                roomId: '',
                roomName: '',
                userTimeEnd: '',
                userTimeStart: ''
            }
        }
        addPackingSpacePropertyInfo:any={
            spaceId: '',
            proprietorId: '',
            cardNumber: '',
            contractCode: '',
            tel: '',
            des: '',
            userTimeStart: '',
            userTimeEnd: '',
            roomId: '',
            proprietorName: ''
        }
        manageTypeDialog:boolean=false
        nameListByRdId:any=[]
        roomInfoById:any=[]
        parkSpaceNumber:any=[]
        colorList:any=[]
        rdId:string=''
        handleTimeChange(val){
            this.spaceManagesType.spaceManagesTypeWYZL.rentedTimeStart=val[0]
            this.spaceManagesType.spaceManagesTypeWYZL.rentedTimeEnd=val[1]
        }
        handleTimeChangeYz(val){
            this.spaceManagesType.spaceManagesTypeYZZY.userTimeStart=val[0]
            this.spaceManagesType.spaceManagesTypeYZZY.userTimeEnd=val[1]
        }
        openManageTypeDialog(parkInfo){
            this.manageTypeDialog=true
            this.getNameListInfo(parkInfo.rdId,'')
            this.getParkSpaceNum(parkInfo.id,null)
            this.getColor()
            this.rdId=parkInfo.rdId
        }
        closeManageTypeDialog(){
            this.manageTypeDialog=false
            this.spaceManagesType={
                carNum1: '',
                carNum2: '',
                managesType: '',
                plateColorCode1: '',
                plateColorCode2: '',
                spaceId: '',
                spaceManagesTypeWYZL: {
                    cardNumber: '',
                    contractCode: '',
                    proprietorId: '',
                    proprietorName: '',
                    proprietorTel: '',
                    rentedTimeEnd: '',
                    rentedTimeStart: '',
                    roomId: ''
                },
                spaceManagesTypeYZZY: {
                    cardNumber: '',
                    contractCode: '',
                    proprietorId: '',
                    proprietorName: '',
                    proprietorTel: '',
                    roomId: '',
                    roomName: '',
                    userTimeEnd: '',
                    userTimeStart: ''
                }
            }
            this.activity=0
            this.userRoomNumFlag=false
        }
        orderStateSearch(){
            this.spaceManagesType={
                carNum1: '',
                carNum2: '',
                managesType: this.spaceManagesType.managesType,
                plateColorCode1: '',
                plateColorCode2: '',
                spaceId: this.spaceManagesType.spaceId,
                spaceManagesTypeWYZL: {
                    cardNumber: '',
                    contractCode: '',
                    proprietorId: '',
                    proprietorName: '',
                    proprietorTel: '',
                    rentedTimeEnd: '',
                    rentedTimeStart: '',
                    roomId: ''
                },
                spaceManagesTypeYZZY: {
                    cardNumber: '',
                    contractCode: '',
                    proprietorId: '',
                    proprietorName: '',
                    proprietorTel: '',
                    roomId: '',
                    roomName: '',
                    userTimeEnd: '',
                    userTimeStart: ''
                }
            }
            this.wyzlName=''
            this.yzzyName=''
            this.dlzlyzName=''
            this.dlzlZfName=''
            this.activity=0
            this.userRoomNumFlag=true
            this.roomInfoById=[]
        }
        next(){
            let limit={
                "spaceId": '车位编号',
                "managesType": '管理类型',
                "spaceManagesTypeYZZY.proprietorId":'业主姓名',
                "spaceManagesTypeYZZY.tel":'联系电话',
                "spaceManagesTypeYZZY.roomId":'房间号',
            }
            if (this.$utils.isntNull(this.spaceManagesType, limit)) {
                this.activity++
            }
            this.getNameListInfo(this.rdId,'')
        }
        async handFifter(val){
            this.dlzlZfName=val
            if(val!==''){
                this.getNameListInfo(this.rdId,val)
            }
            else {
                this.getNameListInfo(this.rdId,'')
            }
        }
        handFifterdlzlzf(val){
            this.wyzlName=val
            if(val!==''){
                this.getNameListInfo(this.rdId,val)
            }
            else {
                this.getNameListInfo(this.rdId,'')
            }
        }
        handleSelectZFName(val){
            if(val===''){
                this.userRoomNumFlag=true
                this.spaceManagesType.spaceManagesTypeWYZL.proprietorId=''
                this.spaceManagesType.spaceManagesTypeWYZL.proprietorName=''
                this.spaceManagesType.spaceManagesTypeWYZL.cardNumber=''
                this.spaceManagesType.spaceManagesTypeWYZL.proprietorTel=''
                this.spaceManagesType.spaceManagesTypeWYZL.roomId=''
            }
            else {
                let obj=this.nameListByRdId.find(x=>x.proprietorId===val)
                this.spaceManagesType.spaceManagesTypeWYZL.proprietorId=obj.proprietorId
                this.spaceManagesType.spaceManagesTypeWYZL.proprietorName=obj.name
                this.spaceManagesType.spaceManagesTypeWYZL.cardNumber=obj.cardNumber
                this.spaceManagesType.spaceManagesTypeWYZL.proprietorTel=obj.tel
                this.spaceManagesType.spaceManagesTypeWYZL.roomId=obj.roomId
                this.getRoomNameById(obj.roomId)
                this.userRoomNumFlag=false
            }
        }
         handFifterYzzy(val){
            this.yzzyName=val
             if(val!==''){
                 this.getNameListInfo(this.rdId,val)
             }
             else {
                 this.getNameListInfo(this.rdId,'')
             }

        }
        handFifterDlzlyz(val){
            this.dlzlyzName=val
            if(val!==''){
                this.getNameListInfo(this.rdId,val)
            }
            else {
                this.getNameListInfo(this.rdId,'')
            }
        }
        handleSelectYzzyName(val){
            if(val===''){
                this.userRoomNumFlag=true
                this.spaceManagesType.spaceManagesTypeYZZY.proprietorId=''
                this.spaceManagesType.spaceManagesTypeYZZY.proprietorName=''
                this.spaceManagesType.spaceManagesTypeYZZY.cardNumber=''
                this.spaceManagesType.spaceManagesTypeYZZY.proprietorTel=''
                this.spaceManagesType.spaceManagesTypeYZZY.roomId=''
            }
            else {
                let obj=this.nameListByRdId.find(x=>x.proprietorId===val)
                this.spaceManagesType.spaceManagesTypeYZZY.proprietorId=obj.proprietorId
                this.spaceManagesType.spaceManagesTypeYZZY.proprietorName=obj.name
                this.spaceManagesType.spaceManagesTypeYZZY.cardNumber=obj.cardNumber
                this.spaceManagesType.spaceManagesTypeYZZY.proprietorTel=obj.tel
                this.spaceManagesType.spaceManagesTypeYZZY.roomId=obj.roomId
                this.getRoomNameById(obj.roomId)
                this.userRoomNumFlag=false
            }
        }

        limitCarNum1(){
            var reg = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/
            if(this.spaceManagesType.carNum1!==''){
                if(!reg.test(this.spaceManagesType.carNum1))
                {
                    this.$message.warning('车牌号有误，请重新输入')
                    this.spaceManagesType.carNum1=''
                }
            }
        }
        limitCarNum2(){
            var reg = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/
            if(this.spaceManagesType.carNum2!==''){
                if(!reg.test(this.spaceManagesType.carNum2))
                {
                    this.$message.warning('车牌号有误，请重新输入')
                    this.spaceManagesType.carNum2=''
                }
            }
        }

        //车位编号查询
        async getParkSpaceNum(id,code){
            try {
                let{data}=await api.getPackSpaceListNoPage(id,code)
                this.parkSpaceNumber=data
                console.log(data)
            }catch (e) {

            }
        }

        //使用登记
        async registration(){
            if(this.subFlag) {
                this.subFlag = false
                let limit1 = {
                    "spaceId": '车位编号',
                    "managesType": '管理类型',
                    "carNum1":'车牌号',
                    "plateColorCode1":'车牌颜色'
                }
                let limit3={
                    "spaceId": '车位编号',
                    "managesType": '管理类型',
                    "spaceManagesTypeWYZL.proprietorId":'租方姓名',
                    "spaceManagesTypeWYZL.tel":'联系电话',
                    "spaceManagesTypeWYZL.roomId":'使用房间号',
                    "spaceManagesTypeWYZL.rentedTimeStart":'租赁时间',
                    "carNum1":'车牌号',
                    "plateColorCode1":'车牌颜色'
                }
                let limit2={
                    "spaceId": '车位编号',
                    "managesType": '管理类型',
                    "spaceManagesTypeYZZY.proprietorId":'业主姓名',
                    "spaceManagesTypeYZZY.tel":'联系电话',
                    "spaceManagesTypeYZZY.roomId":'房间号',
                    "carNum1":'车牌号',
                    "plateColorCode1":'车牌颜色'
                }
                let limit4={
                    "spaceManagesTypeWYZL.proprietorId":'租方姓名',
                    "spaceManagesTypeWYZL.tel":'联系电话',
                    "spaceManagesTypeWYZL.roomId":'使用房间号',
                    "spaceManagesTypeWYZL.rentedTimeStart":'租赁时间',
                    "carNum1":'车牌号',
                    "plateColorCode1":'车牌颜色'
                }
                let limit:any={
                    "spaceId": '车位编号',
                    "managesType": '管理类型',
                }
                if(this.spaceManagesType.managesType==='1'){
                    limit=limit1
                }
                else if(this.spaceManagesType.managesType==='2'){
                    limit=limit2
                }
                else if (this.spaceManagesType.managesType==='3'){
                    limit=limit3
                }
                else if(this.spaceManagesType.managesType==='4'){
                    limit=limit4
                }
                if (this.$utils.isntNull(this.spaceManagesType, limit)) {
                    try {
                        await api.registration(this.spaceManagesType)
                        this.$message.success('登记成功')
                        this.manageTypeDialog = false
                        this.closeManageTypeDialog()
                        this.$emit(`close`)
                    } catch (e) {
                        this.$message.success('登记失败')
                    }
                }
            }
            this.subFlag = true
        }
        //查询姓名列表
        async getNameListInfo(id,name){
            let {data}=await api.getPrName(id,name)
            this.nameListByRdId=data
        }
        //查询房间信息
        async  getRoomNameById(id){
            let {data}=await apii.getRoomInfoById(id)
            this.roomInfoById=Array(data)
        }

        //车牌颜色
        async getColor() {
            let {data} = await api.getInfoByName("车牌颜色")
            this.colorList = data
            console.log(data)
        }
    }
</script>

<style scoped lang="scss">
    .el-input__inner{
        height: 36px;
    }
    .aline{
        .label{
            width: 90px;
        }
        >.car{
            color: #7c8185;
        }
    }
</style>
