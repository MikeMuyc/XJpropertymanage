<template>
    <div class="parkSpaceDetail" id="parkSpaceDetail">
        <div class="costTitle">
            <div>
                <div class="back" @click="backClose">
                    <i class="iconfont iconfanhui"></i>返回
                </div>
                车位详情
            </div>
            <div class="pmbtn primary" v-show="!editInfoFlag" @click="editInfo">
                编辑
            </div>
            <div style="display: flex" v-show="editInfoFlag">
                <div class="pmbtn" style="margin-right: 15px" @click="editInfoFlag=false">
                    取消
                </div>
                <div class="pmbtn primary">
                    保存
                </div>
            </div>
        </div>
        <div class="mainView" v-show="!editInfoFlag">
            <div class="spaceInfo">
                <div class="spaceInfoTitle">
                    <div class="iconbox">
                        <i class="iconfont iconche"></i>
                    </div>
                    <div class="titleSign">车位信息</div>
                </div>
                <div class="spaceInfoMain">
                    <div class="mainInfo1">
                        <div class="label1">
                            车位编号:
                        </div>
                        <div class="info">
                           {{parkSpaceDeatilInfo.code}}
                        </div>
                        <el-tag type="info" effect="dark" size="small" v-if="parkSpaceDeatilInfo.managesType==='1'||parkSpaceDeatilInfo.managesType==='4'">已售</el-tag>
                        <el-tag type="warning" effect="dark" size="small" v-else>使用</el-tag>
                    </div>
                    <div class="mainInfo1">
                        <div class="label2">
                            所在小区:
                        </div>
                        <div class="info">
                            {{parkSpaceDeatilInfo.rdName}}
                        </div>
                    </div>
                    <div class="mainInfo1">
                        <div class="label1">
                            所属停车场:
                        </div>
                        <div class="info">
                            {{parkSpaceDeatilInfo.parkingName}}
                        </div>
                    </div>
                    <div class="mainInfo1">
                        <div class="label3">
                            车位面积(㎡):
                        </div>
                        <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.area===''">暂无</div>
                        <div class="info" v-else>{{parkSpaceDeatilInfo.area}}</div>
                    </div>
                </div>
            </div>
            <div class="propertyInfo" v-if="parkSpaceDeatilInfo.managesType==='2'||parkSpaceDeatilInfo.managesType==='4'">
                <div class="spaceInfoTitle">
                    <div style="  font-size: 16px;">产权信息</div>
                    <div class="propertRecord" @click="historyVisible=true">产权记录</div>
                </div>
                <div class="spaceInfoMain">
                    <div class="mainInfo1">
                        <div class="label1">
                            业主姓名:
                        </div>
                        <div class="info">
                           {{parkSpaceDeatilInfo.spacePropertyInfo.proprietorName}}
                        </div>
                    </div>
                    <div class="mainInfo1">
                        <div class="label2">
                            身份证号:
                        </div>
                            <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.spacePropertyInfo.cardNumber===''">暂无</div>
                            <div class="info" v-else>{{parkSpaceDeatilInfo.spacePropertyInfo.cardNumber}}</div>
                    </div>
                    <div class="mainInfo1">
                        <div class="label1">
                            联系电话:
                        </div>
                        <div class="info">
                            {{parkSpaceDeatilInfo.spacePropertyInfo.tel}}
                        </div>
                    </div>
                    <div class="mainInfo1">
                        <div class="label3">
                            购买合同号:
                        </div>
                        <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.spacePropertyInfo.contractCode===''">暂无</div>
                        <div class="info" v-else>{{parkSpaceDeatilInfo.spacePropertyInfo.contractCode}}</div>
                    </div>
                </div>
            </div>
            <div class="useRegistrationZL" v-show="parkSpaceDeatilInfo.managesType==='3'||parkSpaceDeatilInfo.managesType==='4'">
                <div class="spaceInfoTitle">
                    <div style="  font-size: 16px;">使用登记</div>
                </div>
                <div style="height:75%">
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                管理类别:
                            </div>
                            <div class="info" v-if="parkSpaceDeatilInfo.managesType!==''">
                                {{manageType.find(item =>item.code===parkSpaceDeatilInfo.managesType).name}}
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label2">
                                租方姓名:
                            </div>
                            <div class="info">{{parkSpaceDeatilInfo.proprietorName}}</div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label1">
                                身份证号:
                            </div>
                                <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.cardNumber===''">暂无</div>
                                <div class="info" v-else>{{parkSpaceDeatilInfo.cardNumber}}</div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label3">
                                联系方式:
                            </div>
                            <div class="info">
                                {{parkSpaceDeatilInfo.tel}}
                            </div>
                        </div>
                    </div>
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                租赁合同号:
                            </div>
                            <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.contractCode===''">暂无</div>
                            <div class="info" v-else>{{parkSpaceDeatilInfo.contractCode}}</div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label2">
                                租赁时间:
                            </div>
                            <div class="info">
                                {{rentedTime}}
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label1">
                                使用房间号:
                            </div>
                            <div class="info">
                                {{parkSpaceDeatilInfo.roomName}}
                            </div>
                        </div>
                    </div>
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                登记车牌1:
                            </div>
                            <div class="info">
                                {{parkSpaceDeatilInfo.cars[0].carNum}}
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label2">
                                颜色:
                            </div>
                            <div class="info" v-if="parkSpaceDeatilInfo.cars[0].plateColorCode!==''">
                                {{colorList.find(item =>item.code===parkSpaceDeatilInfo.cars[0].plateColorCode).name}}
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label1">
                                登记车牌2:
                            </div>
                            <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.cars.length<2||(parkSpaceDeatilInfo.cars.length>=2&&parkSpaceDeatilInfo.cars[1].carNum==='')">暂无</div>
                            <div class="info" v-else>{{parkSpaceDeatilInfo.cars[1].carNum}}</div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label3">
                                颜色:
                            </div>
                            <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.cars.length<2||(parkSpaceDeatilInfo.cars.length>=2&&parkSpaceDeatilInfo.cars[1].plateColorCode==='')">暂无</div>
                            <div class="info" v-else>{{colorList.find(item =>item.code===parkSpaceDeatilInfo.cars[1].plateColorCode).name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="useRegistrationZY" v-show="parkSpaceDeatilInfo.managesType==='1'||parkSpaceDeatilInfo.managesType==='2'">
                <div class="spaceInfoTitle">
                    <div style="  font-size: 16px;">使用登记</div>
                </div>
                <div style="height:67%">
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                管理类别:
                            </div>
                            <div class="info" v-if="parkSpaceDeatilInfo.managesType!==''">
                                {{manageType.find(item =>item.code===parkSpaceDeatilInfo.managesType).name}}
                            </div>
                        </div>
                        <div class="mainInfo1" v-if="parkSpaceDeatilInfo.managesType==='2'">
                            <div class="label2">
                                使用时间:
                            </div>
                            <div class="info" v-show="userTime!==''">{{userTime}}</div>

                        </div>
                        <div class="mainInfo1" v-if="parkSpaceDeatilInfo.managesType==='2'">
                            <div class="label1">
                                使用房间号:
                            </div>
                            <div class="info">
                                {{parkSpaceDeatilInfo.spacePropertyInfo.roomId}}
                            </div>
                        </div>
                    </div>
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                登记车牌1:
                            </div>
                            <div class="info">
                                {{parkSpaceDeatilInfo.cars[0].carNum}}
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label2">
                                颜色:
                            </div>
                            <div class="info" v-if="parkSpaceDeatilInfo.cars[0].plateColorCode!==''">
                                {{colorList.find(item =>item.code===parkSpaceDeatilInfo.cars[0].plateColorCode).name}}
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label1">
                                登记车牌2:
                            </div>
                            <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.cars.length<2||(parkSpaceDeatilInfo.cars.length>=2&&parkSpaceDeatilInfo.cars[1].carNum==='')">暂无</div>
                            <div class="info" v-else>{{parkSpaceDeatilInfo.cars[1].carNum}}</div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label3">
                                颜色:
                            </div>
                            <div class="info" style="color: #a0a5a9;" v-if="parkSpaceDeatilInfo.cars.length<2||(parkSpaceDeatilInfo.cars.length>=2&&parkSpaceDeatilInfo.cars[1].plateColorCode==='')">暂无</div>
                            <div class="info" v-else>{{colorList.find(item =>item.code===parkSpaceDeatilInfo.cars[1].plateColorCode).name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
        <div class="mainView" v-show="editInfoFlag">
            <div class="spaceInfo">
                <div class="spaceInfoTitle">
                    <div class="iconbox">
                        <i class="iconfont iconche"></i>
                    </div>
                    <div class="titleSign">车位信息</div>
                </div>
                <div class="spaceInfoMain">
                    <div class="mainInfo1">
                        <div class="label1">
                            车位编号:
                        </div>
                        <div style="display: flex;align-items: center">
                            <div style="color: #a0a5a9;flex: none">{{parkcode.rdIdcode}}</div>
                            <Input placeholder="请输入" v-model="parkcode.spacecode"></Input>
                        </div>
                    </div>
                    <div class="mainInfo1">
                        <div class="label2">
                            所在小区:
                        </div>
                        <div class="info" style="width: calc(100% - 100px);">
                            <mixSelect
                                    class="margin"
                                    :selectList="buildingTree"
                                    labelName="name"
                                    valueName="id"
                                    childrenName="x"
                                    placeholder="请选择"
                                    style="width: 100%"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="mainInfo1">
                        <div class="label1">
                            所属停车场:
                        </div>
                        <div class="info" style="width: calc(100% - 115px);">
                            <mixSelect
                                    class="margin"
                                    :selectList="parkingList"
                                    labelName="name"
                                    valueName="id"
                                    childrenName="x"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    v-model="parkSpaceDeatilInfoEdit.parkingId"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="mainInfo1">
                        <div class="label3">
                            车位面积(㎡):
                        </div>
                            <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.area"></Input>
                    </div>
                </div>
            </div>
            <div class="propertyInfo" v-if="parkSpaceDeatilInfoEdit.managesType==='2'||parkSpaceDeatilInfoEdit.managesType==='4'">
                <div class="spaceInfoTitle">
                    <div style="  font-size: 16px;">产权信息</div>
                </div>
                <div class="spaceInfoMain">
                    <div class="mainInfo1">
                        <div class="label1">
                            业主姓名:
                        </div>
                        <div class="info" style="width: calc(100% - 100px);">
                            <el-select v-model="parkSpaceDeatilInfoEdit.spacePropertyInfo.proprietorName" filterable placeholder="请选择" clearable style="width: 100%" @change="handleSelectYZName" :filter-method="handFifter" >
                                <el-option
                                        v-for="item in nameListByRdId"
                                        :key="item.proprietorId"
                                        :label="`${item.name}(${item.tel})`"
                                        :value="item.proprietorId">
                                </el-option>
                            </el-select>
                        </div>
                        <!--<Input v-model="parkSpaceDeatilInfoEdit.spacePropertyInfo.proprietorName"></Input>-->
                    </div>
                    <div class="mainInfo1">
                        <div class="label2">
                            身份证号:
                        </div>
                        <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.spacePropertyInfo.cardNumber"></Input>
                    </div>
                    <div class="mainInfo1">
                        <div class="label1">
                            联系电话:
                        </div>
                            <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.spacePropertyInfo.tel"></Input>
                    </div>
                    <div class="mainInfo1">
                        <div class="label3">
                            购买合同号:
                        </div>
                        <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.spacePropertyInfo.contractCode"></Input>
                    </div>
                </div>
            </div>
            <div class="useRegistrationZL" v-show="parkSpaceDeatilInfoEdit.managesType==='3'||parkSpaceDeatilInfoEdit.managesType==='4'">
                <div class="spaceInfoTitle">
                    <div style="  font-size: 16px;">使用登记</div>
                </div>
                <div style="height:75%">
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                管理类别:
                            </div>
                            <div class="info" style="width: calc(100% - 100px);">
                                <mixSelect
                                        class="margin"
                                        :selectList="manageType"
                                        labelName="name"
                                        valueName="code"
                                        childrenName="x"
                                        placeholder="请选择"
                                        style="width: 100%"
                                        v-model="parkSpaceDeatilInfoEdit.managesType"
                                >
                                </mixSelect>
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label2">
                                租方姓名:
                            </div>
                            <div class="info" style="width: calc(100% - 100px);">
                                <el-select v-model="parkSpaceDeatilInfoEdit.proprietorName" filterable placeholder="请选择" clearable style="width: 100%" @change="handleSelectZFName" :filter-method="handFifterZF" >
                                    <el-option
                                            v-for="item in nameListByRdId"
                                            :key="item.proprietorId"
                                            :label="`${item.name}(${item.tel})`"
                                            :value="item.proprietorId">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label1">
                                身份证号:
                            </div>
                            <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.cardNumber"></Input>
                        </div>
                        <div class="mainInfo1">
                            <div class="label3">
                                联系方式:
                            </div>
                                <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.tel"></Input>
                        </div>
                    </div>
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                租赁合同号:
                            </div>
                            <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.contractCode"></Input>
                        </div>
                        <div class="mainInfo1">
                            <div class="label2">
                                租赁时间:
                            </div>
                            <div class="info" style="width: calc(100% - 100px);">
                                <DatePicker type="daterange" placeholder="必填" style="width: 100%"
                                            :value="[this.parkSpaceDeatilInfoEdit.rentedTimeStart,this.parkSpaceDeatilInfoEdit.rentedTimeEnd]"></DatePicker>
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label1">
                                使用房间号:
                            </div>
                            <div class="info" style="width: calc(100% - 115px)">
                                <mixSelect
                                        class="margin"
                                        :selectList="roomInfoById"
                                        labelName="name"
                                        valueName="id"
                                        placeholder="请选择"
                                        v-model="parkSpaceDeatilInfoEdit.roomId"
                                        style="width: 100%"
                                >
                                </mixSelect>
                            </div>
                        </div>
                    </div>
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                登记车牌1:
                            </div>
                            <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.cars[0].carNum"></Input>
                        </div>
                        <div class="mainInfo1">
                            <div class="label2">
                                颜色:
                            </div>
                            <div class="info" style="width: calc(100% - 100px)">
                                <mixSelect
                                        class="margin"
                                        :selectList="colorList"
                                        labelName="name"
                                        valueName="code"
                                        childrenName="x"
                                        placeholder="请选择"
                                        style="width: 100%"
                                        v-model="parkSpaceDeatilInfoEdit.cars[0].plateColorCode"
                                >
                                </mixSelect>
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label1">
                                登记车牌2:
                            </div>
                            <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.cars[1].carNum"></Input>
                        </div>
                        <div class="mainInfo1">
                            <div class="label3">
                                颜色:
                            </div>
                            <div class="info" style="width: calc(100% - 124px)">
                                <mixSelect
                                        class="margin"
                                        :selectList="colorList"
                                        labelName="name"
                                        valueName="code"
                                        childrenName="x"
                                        placeholder="请选择"
                                        style="width: 100%"
                                        v-model="parkSpaceDeatilInfoEdit.cars[1].plateColorCode"
                                >
                                </mixSelect>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="useRegistrationZY" v-show="parkSpaceDeatilInfoEdit.managesType==='1'||parkSpaceDeatilInfoEdit.managesType==='2'">
                <div class="spaceInfoTitle">
                    <div style="  font-size: 16px;">使用登记</div>
                </div>
                <div style="height:67%">
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                管理类别:
                            </div>
                            <div class="info" style="width: calc(100% - 100px);">
                                <mixSelect
                                        class="margin"
                                        :selectList="manageType"
                                        labelName="name"
                                        valueName="code"
                                        childrenName="x"
                                        placeholder="请选择"
                                        style="width: 100%"
                                        v-model="parkSpaceDeatilInfoEdit.managesType"
                                >
                                </mixSelect>
                            </div>
                        </div>
                        <div class="mainInfo1" v-if="parkSpaceDeatilInfo.managesType==='2'">
                            <div class="label2">
                                使用时间:
                            </div>
                            <div class="info" v-show="userTime!==''" style="width: calc(100% - 100px)">
                                <DatePicker type="daterange" placeholder="必填" style="width: 100%"
                                            :value="[this.parkSpaceDeatilInfoEdit.spacePropertyInfo.userTimeStart,this.parkSpaceDeatilInfoEdit.spacePropertyInfo.userTimeEnd]"></DatePicker>
                            </div>

                        </div>
                        <div class="mainInfo1" v-if="parkSpaceDeatilInfo.managesType==='2'">
                            <div class="label1">
                                房间号:
                            </div>
                            <div class="info" style="width: calc(100% - 115px)">
                                <mixSelect
                                        class="margin"
                                        :selectList="roomInfoById"
                                        labelName="name"
                                        valueName="id"
                                        placeholder="请选择"
                                        v-model="parkSpaceDeatilInfoEdit.spacePropertyInfo.roomId"
                                        style="width: 100%"
                                >
                                </mixSelect>
                            </div>
                        </div>
                    </div>
                    <div class="spaceInfoMain">
                        <div class="mainInfo1">
                            <div class="label1">
                                登记车牌1:
                            </div>
                            <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.cars[0].carNum"></Input>
                        </div>
                        <div class="mainInfo1">
                            <div class="label2">
                                颜色:
                            </div>
                            <div class="info" style="width: calc(100% - 100px)">
                                <mixSelect
                                        class="margin"
                                        :selectList="colorList"
                                        labelName="name"
                                        valueName="code"
                                        childrenName="x"
                                        placeholder="请选择"
                                        style="width: 100%"
                                        v-model="parkSpaceDeatilInfoEdit.cars[0].plateColorCode"
                                >
                                </mixSelect>
                            </div>
                        </div>
                        <div class="mainInfo1">
                            <div class="label1">
                                登记车牌2:
                            </div>
                            <Input placeholder="请输入" v-model="parkSpaceDeatilInfoEdit.cars[1].carNum"></Input>
                        </div>
                        <div class="mainInfo1">
                            <div class="label3">
                                颜色:
                            </div>
                            <div class="info" style="width: calc(100% - 124px)">
                                <mixSelect
                                        class="margin"
                                        :selectList="colorList"
                                        labelName="name"
                                        valueName="code"
                                        childrenName="x"
                                        placeholder="请选择"
                                        style="width: 100%"
                                        v-model="parkSpaceDeatilInfoEdit.cars[1].plateColorCode"
                                >
                                </mixSelect>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
        <el-dialog
                :visible.sync="historyVisible"
                custom-class="emDialog"
                width="1000px"
                top="16vh"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                历史记录
            </div>
            <div class="MuModalContent">
                <el-table
                        height="600px"
                        :data="historyInfo"
                        stripe
                >
                    <template slot="empty" >
                        <img src="@manage/images/暂无数据.png">
                        <br>
                        暂无内容
                    </template>
                    <el-table-column
                            type="index"
                            width="80"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop=""
                            min-width="100"
                            label="业主名称"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop=""
                            min-width="180"
                            label="身份证号"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="tel"
                            min-width="110"
                            label="联系电话"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop=""
                            min-width="140"
                            label="购买合同号"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="time"
                            min-width="100"
                            label="时间">
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component,Prop,Watch} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox,RadioGroup,Radio} from 'view-design'
    import { Tree } from 'iview'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import viewMap from './components/viewMap.vue'
    import * as api from '@manage/api/house/parkingInformation'
    import * as app from '@manage/api/app'
    import * as apii from '@manage/api/house/huoseProperty'
    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            Checkbox,
            mixSelect,
            Input,
            RadioGroup,
            Radio,
            viewMap
        }
    })

    export default class mainView extends Vue {
        @Prop({
            default: false,
        }) packSpaceId!: string;
        @Prop({
            default: false,
        })parkSpaceDetailFlag!:boolean
        @Prop()parkingList!:any
        @Prop()buildingTree!:any
        @Watch("parkSpaceDetailFlag", { immediate: true, deep: true })
        getparkSpaceInfo() {
            if(this.parkSpaceDetailFlag){
                this.getParkSpaceCar(this.packSpaceId)
                this.getNameListInfo(this.parkingList[0].rdId,'')
            }
        }
        cars:any=[]
        roomInfoById:any=[]
        nameListByRdId:any=[]
        editInfoFlag:boolean=false
        parkSpaceDeatilInfo:any= {
            parkingId: '',
            parkingName: '',
            rdName: '',
            spaceId: '',
            code: '',
            statusCode: '',
            managesType: '',
            proprietorId: '',
            proprietorName: '',
            area: '',
            cardNumber: '',
            tel: null,
            contractCode: '',
            roomId: '',
            roomName: '',
            rentedTimeStart: null,
            rentedTimeEnd: null,
            cars: [
                {
                    carNum: '',
                    plateColorCode: '',
                    carColorCode:'',
                    brandCode: ''
                },
                {
                    carNum: '',
                    plateColorCode: '',
                    carColorCode:'',
                    brandCode: ''
                }
            ],
            spacePropertyInfo: {
                spaceId: '',
                des: '',
                proprietorId: '',
                proprietorName: '',
                cardNumber: '',
                tel: null,
                contractCode: '',
                roomId: '',
                userTimeStart: null,
                userTimeEnd: null,
            }
        }
        historyVisible:boolean=false
        historyInfo:any=[]
        rentedTime:string=''
        userTime:string=''
        rentedTimeEdit:any=[]
        userTimeEdit:any=[]
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
        colorList:any=[]
        parkcode:any={
            rdIdcode:'',
            spacecode:''
        }
        parkSpaceDeatilInfoEdit:any= {
            parkingId: '',
            parkingName: '',
            rdName: '',
            spaceId: '',
            code: '',
            statusCode: '',
            managesType: '',
            proprietorId: '',
            proprietorName: '',
            area: '',
            cardNumber: '',
            tel: null,
            contractCode: '',
            roomId: '',
            roomName: '',
            rentedTimeStart: null,
            rentedTimeEnd: null,
            cars: [
                {
                    carNum: '',
                    plateColorCode: '',
                    carColorCode:'',
                    brandCode: ''
                },
                {
                    carNum: '',
                    plateColorCode: '',
                    carColorCode:'',
                    brandCode: ''
                }
            ],
            spacePropertyInfo: {
                spaceId: '',
                des: '',
                proprietorId: '',
                proprietorName: '',
                cardNumber: '',
                tel: null,
                contractCode: '',
                roomId: '',
                userTimeStart: null,
                userTimeEnd: null,
            }
        }
        created(): void {
            this.getColor()
        }

        backClose(){
            this.editInfoFlag=false
            this.$emit(`close`)
        }
        handFifter(val){
            this.parkSpaceDeatilInfoEdit.spacePropertyInfo.proprietorName=val
            this.getNameListInfo(this.parkingList[0].rdId,val)
        }
        handFifterZF(val){
            this.parkSpaceDeatilInfoEdit.proprietorName=val
            this.getNameListInfo(this.parkingList[0].rdId,val)
        }
        handleSelectYZName(val){
            if(val===''){
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.proprietorId=''
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.proprietorName=''
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.cardNumber=''
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.tel=''
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.roomId=''
            }
            else {
                let obj=this.nameListByRdId.find(x=>x.proprietorId===val)
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.proprietorId=obj.proprietorId
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.proprietorName=obj.name
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.cardNumber=obj.cardNumber
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.tel=obj.tel
                this.parkSpaceDeatilInfoEdit.spacePropertyInfo.roomId=obj.roomId
                this.getRoomNameById(this.parkSpaceDeatilInfoEdit.spacePropertyInfo.roomId)
            }
        }
        handleSelectZFName(val){
            if(val===''){
                this.parkSpaceDeatilInfoEdit.proprietorId=''
                this.parkSpaceDeatilInfoEdit.proprietorName=''
                this.parkSpaceDeatilInfoEdit.cardNumber=''
                this.parkSpaceDeatilInfoEdit.tel=''
                this.parkSpaceDeatilInfoEdit.roomId=''
            }
            else {
                let obj=this.nameListByRdId.find(x=>x.proprietorId===val)
                this.parkSpaceDeatilInfoEdit.proprietorId=obj.proprietorId
                this.parkSpaceDeatilInfoEdit.proprietorName=obj.name
                this.parkSpaceDeatilInfoEdit.cardNumber=obj.cardNumber
                this.parkSpaceDeatilInfoEdit.tel=obj.tel
                this.parkSpaceDeatilInfoEdit.roomId=obj.roomId
                this.getRoomNameById(this.parkSpaceDeatilInfoEdit.roomId)
            }
        }
        editInfo(){
            this.editInfoFlag=true
            this.parkSpaceDeatilInfoEdit=this.$utils.deepCopy(this.parkSpaceDeatilInfo)
            if(this.parkSpaceDeatilInfoEdit.roomId){
                this.getRoomNameById(this.parkSpaceDeatilInfoEdit.roomId)
            }
            if(this.parkSpaceDeatilInfoEdit.spacePropertyInfo!==null&&this.parkSpaceDeatilInfoEdit.spacePropertyInfo.roomId){
                this.getRoomNameById(this.parkSpaceDeatilInfoEdit.spacePropertyInfo.roomId)
            }
            if(this.parkSpaceDeatilInfoEdit.cars.length===1){
                let car= {
                    carNum: '',
                    plateColorCode: '',
                    carColorCode:'',
                    brandCode: ''}
                this.parkSpaceDeatilInfoEdit.cars.push(car)
            }
            console.log(this.parkSpaceDeatilInfoEdit.cars)
        }
        //查询车位详细信息
        async getParkSpaceCar(id) {
            let {data} = await api.getParkSpaceCar(id)
            this.parkSpaceDeatilInfo = data
            this.rentedTime=`${this.parkSpaceDeatilInfo.rentedTimeStart} ~ ${this.parkSpaceDeatilInfo.rentedTimeEnd}`
            if(this.parkSpaceDeatilInfo.spacePropertyInfo!==null){
                this.userTime=`${this.parkSpaceDeatilInfo.spacePropertyInfo.userTimeStart} ~ ${this.parkSpaceDeatilInfo.spacePropertyInfo.userTimeEnd}`
            }
            let arr=data.code.split("-")
            this.parkcode.rdIdcode=`${arr[0]}-${arr[1]}-`
            this.parkcode.spacecode=arr[2]
        }
        //查询姓名列表
        async getNameListInfo(id,name){
            let {data}=await api.getPrName(id,name)
            this.nameListByRdId=data
            console.log(data)
        }
        //车牌颜色
        async getColor() {
            let {data} = await api.getInfoByName("车牌颜色")
            this.colorList = data
        }
        //查询房间信息
        async  getRoomNameById(id){
            let {data}=await apii.getRoomInfoById(id)
            this.roomInfoById=Array(data)
        }
    }
    </script>
<style scoped lang="scss">
    @import "../../styles/standard-global";
    .parkSpaceDetail {
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        padding-left: 20px;
        .costTitle{
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;
            margin-right: 20px;
            justify-content: space-between;
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
        .mainView{
            height: 100%;
            width: 100%;
            padding-right: 20px;
            .spaceInfo{
                width: 100%;
                height: 102px;
                margin: 20px 0 15px 0;
                border: solid 1px #dde4eb;
            }
            .spaceInfoTitle{
                background-color: #f8f9fc;
                height: 50%;
                display: flex;
                .iconbox {
                    height: 100%;
                    width: 50px;
                    background-image: linear-gradient(313deg,
                            #4d9aff 0%,
                            #3b66f6 100%);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    .iconfont {
                        color: #fff;
                        font-size: 20px;
                    }
                }
                .titleSign{
                    font-size: 16px;
                    line-height: 51px;
                    font-weight: bolder;
                    margin-left: 15px;
                }
            }
            .spaceInfoMain{
                height: 50%;
                display: flex;
                .mainInfo1{
                    width: 25%;
                    border-right: solid 1px #dde4eb;
                    display: flex;
                    align-items: center;
                    &:last-child{
                        border-right: none;
                    }
                    .label1{
                        margin: 0 15px 0 20px;
                        color: #a0a5a9;
                        width: 75px;
                        flex: none
                    }
                    .label2{
                        margin: 0 15px 0 20px;
                        color: #a0a5a9;
                        width: 60px;
                        flex: none
                    }
                    .label3{
                        margin: 0 15px 0 20px;
                        color: #a0a5a9;
                        width: 84px;
                        flex: none
                    }
                    .el-tag{
                        margin-left: 20px;
                    }
                }
            }
            .propertyInfo{
                width: 100%;
                height: 102px;
                margin: 15px 0 0px 0;
                border: solid 1px #dde4eb;
                .spaceInfoTitle{
                    padding-left: 20px;
                    align-items: center;
                    justify-content: space-between;
                    .propertRecord{
                        margin-right: 15px;
                        color: #3a7ef3;
                        cursor: pointer;
                    }
                }
            }
            .useRegistrationZL{
                width: 100%;
                height: 204px;
                border: solid 1px #dde4eb;
                border-top: none;
                .spaceInfoTitle{
                    height: 25%;
                    padding-left: 20px;
                    align-items: center;
                }
                .spaceInfoMain{
                    height: 51px;
                    border-bottom: solid 1px #dde4eb;
                    &:last-child{
                        border-bottom:none;
                    }
                }
            }
            .useRegistrationZY{
                width: 100%;
                height: 154px;
                border: solid 1px #dde4eb;
                border-top: none;
                .spaceInfoTitle{
                    height: 34%;
                    padding-left: 20px;
                    align-items: center;
                }
                .spaceInfoMain{
                    height: 51px;
                    border-bottom: solid 1px #dde4eb;
                    &:last-child{
                        border-bottom:none;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    #parkSpaceDetail{
        .singleBOX[data-v-39945e98]{
            border: unset;
        }
        .myInputbox .createdInput[data-v-e622407a]{
            border: unset;
        }
        .myInputbox[data-v-e622407a]{
            margin-right: 15px;
        }
        input[type=text], input[type="number"]{
            border: unset;
        }
    }
</style>
