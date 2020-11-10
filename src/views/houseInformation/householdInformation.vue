<template>
    <div id="householdInformation" class="mainbox">
        <transition name="leftSlide">
            <div v-show="!tableFlag" style="height: 100%">
                <div class="thTitle" ref="thTitle">
                    <i class="line"></i>一户一档
                </div>
                <div class="viewbox" ref="viewbox" v-show="buildingTree.length!==0">
                    <div class="leftTree">
                        <Input type="search" placeholder="搜索"></Input>
                        <vue-perfect-scrollbar style="height:calc(100% - 48px);margin-top: 10px;padding-right: 15px">
                            <Tree
                                    class="buildingTree"
                                    ref="tree"
                                    :data="buildingTree"
                                    :render="renderContent"
                            >
                            </Tree>
                        </vue-perfect-scrollbar>
                    </div>
                    <div class="borderRight"></div>
                    <div class="rightMain" ref="rightMain">
                        <div class="middleline" ref="middleline">
                            <div class="iconbox">
                                <i class="iconfont iconxiaoqu"></i>
                            </div>
                            <div class="infoShow">
                                <div class="leftInfo">
                                    <i style="font-size: 18px;font-weight: bolder;" v-if="roomId">
                                        {{buildingTree.find(x =>x.id===rdId).title}} / {{buildingName}}
                                    </i>
                                    <i style="font-size: 18px;font-weight: bolder;" v-if="communtityId">
                                        {{buildingTree.find(x =>x.id===rdId).title}}
                                    </i>
                                    <div class="parkInfo">
                                        <div class="detial">
                                            <i class="iconfont iconfangzi" style="font-size: 13px"></i>
                                            <i class="item">登记户数：</i>
                                            <em>{{proprietorInfo.length}}户</em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="searchline" ref="searchline">
                            <div class="froat">
                                <mixSelect
                                        class="margin"
                                        v-model="nprCode"
                                        :selectList="native"
                                        labelName="name"
                                        valueName="code"
                                        placeholder="籍贯"
                                        style="width: 140px"
                                >
                                </mixSelect>
                                <div class="margin item" style="flex: none">
                                    入伙时间
                                    <DatePicker split-panels ref="dateForm" type="daterange" format="yyyy-MM-dd"
                                                placeholder=" 开始时间   ~   结束时间" style="width: 200px;margin-left: 8px"
                                                @on-change="handleTime"></DatePicker>
                                </div>
                                <div class="margin" style="display: flex;">
                                    <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px"
                                           v-model="keyWords" @enter="getPage()"></Input>
                                    <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                                        <i class="iconfont iconsousuo"></i>搜索
                                    </div>
                                    <div class="pmbtn" @click="resentInfo">
                                        <i class="iconfont iconzhongzhi"></i>重置
                                    </div>
                                </div>
                            </div>
                            <div class="marginItem">
                                <div class="pmbtn primary" style="margin-right: 15px" @click="openRegistDialog">
                                    <i class="iconfont icontianjia"></i>
                                    入伙登记
                                </div>
                                <div class="item">
                                    <div class="pmbtn" style="margin-right: 15px">
                                        <i class="iconfont icondaoru"></i>
                                        导入
                                    </div>
                                    <div class="pmbtn" @click="exportProprietorInfo">
                                        <i class="iconfont icondaochu"></i>
                                        导出
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-table
                                :data="proprietorInfoTable"
                                stripe
                                class="myWisdomTable"
                                :height="formHeight"
                                :header-cell-style="{background:'#f4f6f9'}"
                                v-loading="loading"
                        >
                            <template slot="empty">
                                <img src="@manage/images/暂无数据.png">
                                <br>
                                暂无内容
                            </template>
                            <el-table-column
                                    type="index"
                                    width="70"
                                    label="序号"
                                    v-loading="loading"
                            >
                                <template slot-scope="{row,$index}">
                                    {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="buildingName"
                                    label="楼号"
                                    min-width="120px"
                                    show-overflow-tooltip
                                    v-if="communtityId"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="roomName"
                                    label="房间代码"
                                    min-width="120px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="personName"
                                    label="业主名称"
                                    min-width="100px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="sexCode"
                                    label="性别"
                                    min-width="60px"
                            >
                                <template slot-scope="{row,$index}">
                                    <div v-if="row.sexCode!==''">{{sex.find(x => x.code === row.sexCode).name}}</div>
                                    <div style="color: #a0a5a9;" v-else>暂无</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="birthday"
                                    label="出生日期"
                                    min-width="100px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="nationCode"
                                    label="民族"
                                    min-width="50px"
                                    show-overflow-tooltip
                            >
                                <template slot-scope="{row,$index}">
                                    <div v-if="row.nationCode!==''">{{nation.find(x => x.code ===
                                        row.nationCode).name}}
                                    </div>
                                    <div style="color: #a0a5a9;" v-else>暂无</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="nativePlaceRegionCode"
                                    label="籍贯"
                                    min-width="80px"
                                    show-overflow-tooltip
                            >
                                <template slot-scope="{row,$index}">
                                    <div v-if="row.nativePlaceRegionCode!==''">{{native.find(x => x.code ===
                                        row.nativePlaceRegionCode).name}}
                                    </div>
                                    <div style="color: #a0a5a9;" v-else>暂无</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="time"
                                    label="入伙时间"
                                    width="170px"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    width="170px"
                            >
                                <template slot-scope="{row,$index}">
                                    <div class="tableEdit">
                                        <div class="item" @click="detailHouse(row)">详情</div>
                                        <div class="item" @click="householdChange(row)">户主变更</div>
                                        <div class="item delete" @click="deleteInfo(row.id)">删除</div>
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
                <div class="empty" v-show="buildingTree.length===0">
                    <img src="@manage/images/暂无2.png" alt="">
                    <p>暂无数据，请先至<i @click="goToHouse">房产信息</i>处添加小区</p>
                </div>
            </div>
        </transition>
        <transition name="rightSlide">
            <householdDetail v-show="tableFlag" @close="closeTable" :personId="personId" :tableFlag="tableFlag"
                             :rdId="rdId" :roomName="roomName"></householdDetail>
        </transition>
        <el-dialog
                :visible.sync="registVisible"
                custom-class="emDialog"
                width="545px"
                top="10vh"
                @close="closeRegistDialog"
                :close-on-click-modal="false"
                v-if="registVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                入伙登记
            </div>
            <vue-perfect-scrollbar class="dialogMainbox" v-show="active===0">
                <div style="font-size: 16px;font-weight: bolder;margin:0 0 20px 15px">业主信息</div>
                <div class="aline">
                    <div class="label">业主名称</div>
                    <div class="info">
                        <Input placeholder="必填" v-model="addProprietor.personInfo.name" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">联系方式</div>
                    <div class="info">
                        <Input placeholder="必填" v-model="addProprietor.personInfo.tel" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">身份证号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addProprietor.personInfo.cardNumber"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">出生日期</div>
                    <div class="info">
                        <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择" style="width:100%"
                                    v-model="addProprietor.personInfo.birthday"
                                    @on-change="handleBirthdayDialog" ref="startTimeRef"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">性别</div>
                    <div class="info">
                        <mixSelect
                                :selectList="sex"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="addProprietor.personInfo.sexCode"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">民族</div>
                    <div class="info">
                        <mixSelect
                                :selectList="nation"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="addProprietor.personInfo.nationCode"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">籍贯</div>
                    <div class="info">
                        <mixSelect
                                :selectList="native"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="addProprietor.personInfo.nativePlaceRegionCode"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline" v-if="communtityId">
                    <div class="label">楼栋</div>
                    <div class="info">
                        <el-select style="width: 100%"
                                   placeholder="必选" filterable clearable v-model="buildingIdSelect"
                                   @change="handleSelectChange">
                            <el-option
                                    v-for="item in buildingList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">房间代码</div>
                    <div class="info">
                        <el-select style="width: 100%" v-model="addProprietor.proprietorAndRoom.roomId" filterable
                                   placeholder="必填" @focus="handleSelectRoom">
                            <el-option
                                    v-for="item in roomIdList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">购房合同号</div>
                    <div class="info">
                        <Input style="width:100%" placeholder="请输入"
                               v-model="addProprietor.proprietorAndRoom.contractCode"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">房产证号</div>
                    <div class="info">
                        <Input style="width:100%" placeholder="选填"
                               v-model="addProprietor.proprietorAndRoom.pocCode"></Input>
                    </div>
                </div>
                <div class="aline" style="margin-bottom: 5px">
                    <div class="label">管理协议书号</div>
                    <div class="info">
                        <Input style="width:100%" placeholder="选填"
                               v-model="addProprietor.proprietorAndRoom.agreementNumber"
                        ></Input>
                    </div>
                </div>
            </vue-perfect-scrollbar>
            <vue-perfect-scrollbar class="dialogMainbox" v-show="active===1">
                <div style="font-size: 16px;font-weight: bolder;margin:0 0 20px 15px">入伙登记</div>
                <div class="aline">
                    <div class="label">入伙时间</div>
                    <div class="info">
                        <DatePicker type="datetime" placeholder="必填" style="width: 100%"
                                    :value="addProprietor.proprietorAndRoom.time"
                                    @on-change="handleTimeDialog"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">电表读数</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="proprietorAndRoomOccupation.electricMeterReading"
                               type="number"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">水表读数</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="proprietorAndRoomOccupation.waterMeterReading"
                               type="number"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">气表读数</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="proprietorAndRoomOccupation.gasMeterReading"
                               type="number"></Input>
                    </div>
                </div>
                <div class="aline" style="margin-bottom: 5px">
                    <div class="label">附加信息</div>
                    <div class="info">
                        <textarea v-model="addProprietor.personInfo.remark" style="width: 100%"></textarea>
                    </div>
                </div>
            </vue-perfect-scrollbar>

            <div slot="footer" v-if="active===0">
                <div class="pmbtn" @click="closeRegistDialog" style="margin-right: 10px">取消</div>
                <div class="pmbtn primary" @click="next">下一步</div>
            </div>
            <div slot="footer" v-else-if="active===1">
                <div class="pmbtn" @click="last" style="margin-right: 10px">上一步</div>
                <div class="pmbtn primary" @click="addProprietorInfo">完成</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="householdChangeVisible"
                custom-class="emDialog"
                width="820px"
                top="16vh"
                :close-on-click-modal="false"
                v-if="householdChangeVisible"
                @close="closeHouseholdChange"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                户主变更
            </div>
            <div class="MuModalContent">
                <div class="title">
                    <div class="left">
                        <i class="iconfont iconfangzi"></i>
                        <em>{{roomIdHoldChange}}</em>
                    </div>
                    <div class="right" @click="getHistory">
                        <i class="iconfont iconxiangqing"></i>
                        历史记录
                    </div>
                </div>
                <div class="main">
                    <div class="left">
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">新业主名</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="必填"
                                           v-model="holdChangeInfo.personInfo.name" necessary></Input>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">身份证号</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="请输入"
                                           v-model="holdChangeInfo.personInfo.cardNumber"></Input>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">出生日期</div>
                                <div class="item">
                                    <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 200px"
                                                v-model="holdChangeInfo.personInfo.birthday"
                                                @on-change="handBrithday"></DatePicker>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">性别</div>
                                <div class="item">
                                    <mixSelect
                                            :selectList="sex"
                                            labelName="name"
                                            valueName="code"
                                            childrenName="children"
                                            placeholder="请选择"
                                            v-model="holdChangeInfo.personInfo.sexCode"
                                            style="width: 200px;min-width: 200px"
                                    >
                                    </mixSelect>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">民族</div>
                                <div class="item">
                                    <mixSelect
                                            :selectList="nation"
                                            labelName="name"
                                            valueName="code"
                                            childrenName="children"
                                            placeholder="请选择"
                                            v-model="holdChangeInfo.personInfo.nationCode"
                                            style="width: 200px;min-width: 200px"
                                    >
                                    </mixSelect>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">籍贯</div>
                                <div class="item">
                                    <mixSelect
                                            :selectList="native"
                                            labelName="name"
                                            valueName="code"
                                            placeholder="请选择"
                                            v-model="holdChangeInfo.personInfo.nativePlaceRegionCode"
                                            style="width: 200px;min-width: 200px"
                                    >
                                    </mixSelect>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">联系方式</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="必填"
                                           v-model="holdChangeInfo.personInfo.tel" necessary></Input>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">入伙时间</div>
                                <div class="item">
                                    <DatePicker type="datetime" placeholder="请选择" style="width: 200px"
                                                :value="holdChangeInfo.proprietorAndRoom.time"
                                                @on-change="handTime"></DatePicker>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1" style="width: 100%">
                                <div style="margin-right: 20px;min-width: 56px">附加信息</div>
                                <div style="width: 100%">
                                    <textarea style="width: 100%" v-model="holdChangeInfo.personInfo.remark"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <label class="upfileInfo" for="addupload">
                            <img v-if="imgportadd" :src="imgportadd">
                            <i v-else class="iconzhengjianzhao iconfont"></i>
                            <div class="item">上传</div>
                        </label>
                        <input type="file" accept="image/*" id="addupload" @change="upAddImg">
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="updateHold">确定</div>
                <div class="pmbtn" @click="closeHouseholdChange">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="historyVisible"
                custom-class="emDialog"
                width="1000px"
                top="16vh"
                :close-on-click-modal="false"
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
                    <template slot="empty">
                        <img src="@manage/images/暂无数据.png">
                        <br>
                        暂无内容
                    </template>
                    <el-table-column
                            type="index"
                            width="70"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="personName"
                            min-width="100"
                            label="业主名称"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop=""
                            min-width="50"
                            label="性别"
                    >
                        <template slot-scope="{row,$index}">
                            <div v-if="row.sexCode!==''">{{sex.find(x => x.code === row.sexCode).name}}</div>
                            <div style="color: #a0a5a9;" v-else>暂无</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="tel"
                            min-width="110"
                            label="联系电话"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="birthday"
                            label="出生日期"
                            min-width="100"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="nationCode"
                            label="民族"
                            min-width="80"
                            show-overflow-tooltip
                    >
                        <template slot-scope="{row,$index}">
                            <div v-if="row.nationCode!==''">{{nation.find(x => x.code === row.nationCode).name}}</div>
                            <div style="color: #a0a5a9;" v-else>暂无</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="nativePlaceRegionCode"
                            label="籍贯"
                            min-width="80"
                            show-overflow-tooltip
                    >
                        <template slot-scope="{row,$index}">
                            <div v-if="row.nativePlaceRegionCode!==''">{{native.find(x => x.code ===
                                row.nativePlaceRegionCode).name}}
                            </div>
                            <div style="color: #a0a5a9;" v-else>暂无</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="time"
                            min-width="170"
                            label="入伙时间">
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="updateTime"-->
                    <!--min-width="170"-->
                    <!--label="变更时间"-->
                    <!--&gt;-->
                    <!--</el-table-column>-->
                </el-table>
            </div>
        </el-dialog>

    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design'
    import {Tree} from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import householdDetail from './household_detail.vue';
    import * as api from '@manage/api/house/householdInformation'
    import * as app from '@manage/api/app'
    import * as organization from '@manage/json/houseData'
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
            householdDetail,
        }
    })

    export default class mainView extends Vue {
        rdId: string = ''
        native: any = []
        proprietorDetial: any = {}
        roomId: string = '';
        proprietorInfo: any = []
        roomName: string = ''
        buildingIdSelect: string = ''

        renderContent(h, {root, node, data}) {
            return h('div', {
                    attrs: {
                        title: data.title,
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '36px',
                        overflow: 'hidden',
                        width: 'calc(100% - 20px)',
                    },
                    class: {
                        treeActive: this.roomId === data.id,
                        treeActive2: this.communtityId === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 2) {
                                this.roomId = data.id;
                                this.rdId = data.parentId
                                this.buildingName = data.title
                                this.communtityId = ''
                                setTimeout(() => {
                                    this.setPagesize();
                                }, 200)
                                this.resentInfo()
                                this.getGangInfoInBuilding(this.roomId)
                            } else {
                                if (data.expand === false) {
                                    data.expand = !data.expand;
                                }
                                this.rdInfo = data
                                this.communtityId = data.id;
                                this.roomId = ''
                                this.rdId = this.communtityId
                                setTimeout(() => {
                                    this.setPagesize();
                                }, 200)
                                this.resentInfo()
                                this.getBuildingList()
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

        buildingName: string = ''
        startTime: string = null
        endTime: string = null
        keyWords: string = null
        nprCode: string = null
        rdInfo: any = []
        formHeight: number = 600;
        active: number = 0
        communtityId: string = ''
        loading: boolean = false;
        proprietorAndRoomOccupation: any = {
            occupationTime: '',
            waterMeterReading: '',
            electricMeterReading: '',
            gasMeterReading: '',
            chargingDate: '',
            ourOperators: '',
            customerAttn: '',
            description: ''
        }
        addProprietor: any = {
            name: '',
            personInfo: {
                name: '',
                tel: '',
                cardNumber: '',
                birthday: '',
                sexCode: '',
                nationCode: '',
                nativePlaceRegionCode: '',
                remark: '',
            },
            proprietorAndRoom: {
                proprietorAndRoomOccupation: {},
                roomId: '',
                pocCode: '',
                agreementNumber: '',
                contractCode: '',
                time: '',
            }
        }
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 0,
        };
        personId: string = ''
        buildingList: any = []
        nation: any = []
        sex: any = []
        proprietorInfoTable: any = []
        roomIdList: any = []
        buildingTree: any = [{}]
        historyInfo: any = []
        registVisible: boolean = false
        householdChangeVisible: boolean = false
        roomIdHoldChange: string = ''
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        holdChangeInfo: any = {
            name: '',
            personInfo: {
                name: '',
                tel: '',
                cardNumber: '',
                birthday: '',
                sexCode: '',
                nationCode: '',
                nativePlaceRegionCode: '',
                remark: '',
                photoId: ''
            },
            proprietorAndRoom: {
                proprietorAndRoomOccupation: {
                    chargingDate: '',
                },
                time: '',
                roomId: '',
                proprietorId: ''
            }
        }
        countGang: any = []
        numberGang: number = 0
        imageUrl: string = ''
        subFlag: boolean = true

        created() {
            this.$nextTick(() => {
                this.getTree()
                this.getNation()
                this.getSex()
                this.getRegionTree()
            })
        }

        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let searchline = refs.searchline.clientHeight;
            let middleline = refs.middleline.clientHeight + 26;
            this.formHeight = maxHeight - searchline - middleline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        mounted(): void {
        }

        goToHouse() {
            this.$router.push('houseProperty')
        }

        handleTime(daterange) {
            this.startTime = daterange[0]
            this.endTime = daterange[1]

        }

        handleSelectChange(val) {
            if (val === '') {
                this.roomIdList = []
            } else {
                this.getTreeById(this.communtityId, val)
            }
            this.addProprietor.proprietorAndRoom.roomId = ''
        }

        handleSelectRoom(val) {
            if (this.communtityId !== '' && this.buildingIdSelect === '') {
                this.$message.warning('请选择楼栋')
            }
        }

        resentInfo() {
            let refs: any = this.$refs;
            this.nprCode = null
            this.startTime = null
            this.endTime = null
            this.keyWords = null
            refs.dateForm.handleClear()
            this.getProprietorInfo()
        }

        handleTimeDialog(date) {
            this.addProprietor.proprietorAndRoom.time = date
        }

        handleStartTime(date) {
            this.proprietorAndRoomOccupation.chargingDate = date
        }

        handleBirthdayDialog(date) {
            this.addProprietor.personInfo.birthday = date
        }

        handBrithday(date) {
            this.holdChangeInfo.personInfo.birthday = date
        }

        handTime(date) {
            this.holdChangeInfo.proprietorAndRoom.time = date
        }

        get imgportadd() {
            return this.holdChangeInfo.personInfo.photoId ? this.$imgDownUrl() + `${this.holdChangeInfo.personInfo.photoId}` : null
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
                let load: any = this.$loading(this.loaderOption);
                setTimeout(async () => {
                    try {
                        let {data: {id}} = await app.upImg(fd, this.$upBaseUrl());
                        this.holdChangeInfo.personInfo.photoId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                    (<HTMLInputElement>document.getElementById('addupload')).value = '';
                }, 200);
            }
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getProprietorInfo()
        }

        openRegistDialog() {
            var myDate = new Date();
            this.addProprietor.proprietorAndRoom.time = this.$utils.dateFormat(myDate, 'time')
            this.registVisible = true
            console.log('11')
            if (this.communtityId === '') {
                this.getTreeById(this.rdId, this.roomId)
            } else {
                this.roomIdList = []
            }
        }

        closeRegistDialog() {
            this.registVisible = false
            this.active = 0
            let refs: any = this.$refs;
            refs.startTimeRef.handleClear()
            this.proprietorAndRoomOccupation = {
                occupationTime: '',
                waterMeterReading: '',
                electricMeterReading: '',
                gasMeterReading: '',
                chargingDate: '',
                ourOperators: '',
                customerAttn: '',
                description: ''
            }
            this.addProprietor = {
                name: '',
                personInfo: {
                    name: '',
                    tel: '',
                    cardNumber: '',
                    birthday: '',
                    sexCode: '',
                    nationCode: '',
                    nativePlaceRegionCode: '',
                },
                proprietorAndRoom: {
                    roomId: '',
                    pocCode: '',
                    contractCode: '',
                    agreementNumber: '',
                    time: '',
                }
            }
            this.buildingIdSelect = ''
        }

        closeHouseholdChange() {
            this.householdChangeVisible = false
            this.imageUrl = ''
            this.holdChangeInfo = {
                name: '',
                personInfo: {
                    name: '',
                    tel: '',
                    cardNumber: '',
                    birthday: '',
                    sexCode: '',
                    nationCode: '',
                    nativePlaceRegionCode: '',
                    remark: '',
                    photoId: ''
                },
                proprietorAndRoom: {
                    proprietorAndRoomOccupation: {
                        chargingDate: '',
                    },
                    id: '',
                    time: '',
                    roomId: '',
                    proprietorId: ''
                }
            }
        }

        next() {
            let limit = {
                "personInfo.name": "名称",
                "personInfo.tel": "联系方式",
                "proprietorAndRoom.roomId": "房间代码"
            }
            if (this.$utils.isntNull(this.addProprietor, limit)) {
                if ((!this.$utils.phoneLimit(this.addProprietor.personInfo.tel))) {
                    this.$message.warning('请输入正确的联系方式')
                } else {
                    if ((!this.$utils.idCardLimit(this.addProprietor.personInfo.cardNumber)) && this.addProprietor.personInfo.cardNumber !== '') {
                        this.$message.warning('请输入正确的身份证号')
                    } else {
                        this.active++
                    }
                }
            }
        }

        last() {
            this.active--
        }

        householdChange(row) {
            var myDate = new Date();
            this.roomIdHoldChange = row.roomName
            this.holdChangeInfo.proprietorAndRoom.time = this.$utils.dateFormat(myDate, 'time')
            this.getProprietorInfoDetial(row.id)
            this.householdChangeVisible = true
        }

        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        }

        historyVisible: boolean = false
        tableFlag: boolean = false

        detailHouse(row) {
            this.personId = row.id
            this.roomName = row.roomName
            this.tableFlag = true;
        }

        closeTable() {
            this.tableFlag = false;
            this.getProprietorInfo()
        }

        code: any = null;

        //组织树
        async getTree() {
            // let {data} = await api.getTree()
            let data: any = organization.organizationList;
            this.buildingTree = data
            if (data.length > 0) {
                if (this.communtityId === '' && this.roomId === '') {
                    this.communtityId = data[0].id
                    data[0].expand = true
                    this.rdInfo.title = data[0].title
                    this.rdId = this.communtityId
                    this.getBuildingList()
                    this.setPagesize()
                    this.getProprietorInfo()
                } else if (this.roomId !== '') {
                    this.buildingTree.find(x => x.id === this.rdId).expand = true
                } else {
                    this.buildingTree.find(x => x.id === this.communtityId).expand = true
                }
            } else {
                this.buildingTree = []
            }
        }

        //查询房间列表名称
        async getTreeById(rdId, roomId) {
            let {data} = await api.getRoomNameList(rdId, roomId)
            this.roomIdList = data
        }

        //查询业主信息
        async getProprietorInfo() {
            this.loading = true
            if (this.startTime === '' && this.endTime === '') {
                this.startTime = null
                this.endTime = null
            }
            if (this.roomId === '') {
                this.roomId = null
            }
            if (this.nprCode === '') {
                this.nprCode = null
            }
            /*let {data} = await api.getProprietorInfo(
                this.pages.pageNum + '',
                this.pages.pageSize + '',
                this.rdId,
                this.roomId, this.startTime, this.endTime, this.keyWords, this.nprCode
            )*/
            let data:any = organization.citizenList;
            this.proprietorInfo = data.content
            this.proprietorInfoTable = JSON.parse(JSON.stringify(this.proprietorInfo))
            this.pages.totalElements = data.totalElements
            for (let i in this.proprietorInfoTable) {
                this.proprietorInfoTable[i].birthday = this.$utils.dateFormat(Number(this.proprietorInfoTable[i].birthday), 'date')
            }
            this.loading = false
        }

        //入伙登记
        async addProprietorInfo() {
            if (this.subFlag) {
                this.subFlag = false
                this.addProprietor.name = this.addProprietor.personInfo.name
                this.proprietorAndRoomOccupation.description = this.addProprietor.personInfo.remark
                this.proprietorAndRoomOccupation.occupationTime = this.addProprietor.proprietorAndRoom.time
                this.proprietorAndRoomOccupation.gasMeterReading = Number(this.proprietorAndRoomOccupation.gasMeterReading)
                this.proprietorAndRoomOccupation.waterMeterReading = Number(this.proprietorAndRoomOccupation.waterMeterReading)
                this.proprietorAndRoomOccupation.electricMeterReading = Number(this.proprietorAndRoomOccupation.electricMeterReading)
                this.addProprietor.proprietorAndRoom.proprietorAndRoomOccupation = this.proprietorAndRoomOccupation
                if (this.addProprietor.proprietorAndRoom.proprietorAndRoomOccupation.chargingDate === '') {
                    this.addProprietor.proprietorAndRoom.proprietorAndRoomOccupation.chargingDate = null
                }
                if (this.addProprietor.personInfo.birthday === '') {
                    this.addProprietor.personInfo.birthday = null
                }
                if (this.addProprietor.proprietorAndRoom.time === '') {
                    this.$message.warning('请输入入伙时间')
                } else {
                    try {
                        await api.addProprietorInfo(this.addProprietor)
                        this.$message.success('登记成功')
                        this.registVisible = false
                        this.resentInfo()
                        this.closeRegistDialog()
                    } catch (e) {
                        this.$message.error('登记失败,请重新登记')
                    }
                }
            }
            this.subFlag = true
        }

        //户主变更
        async updateHold() {
            if (this.subFlag) {
                this.subFlag = false
                let limit = {
                    "personInfo.name": "新业主名",
                    "personInfo.tel": "联系方式",
                }
                if (this.$utils.isntNull(this.holdChangeInfo, limit)) {
                    if ((!this.$utils.phoneLimit(this.holdChangeInfo.personInfo.tel))) {
                        this.$message.warning('请输入正确的联系方式')
                    } else {
                        if ((!this.$utils.idCardLimit(this.holdChangeInfo.personInfo.cardNumber)) && this.holdChangeInfo.personInfo.cardNumber !== '') {
                            this.$message.warning('请输入正确的身份证号')
                        } else {
                            const confirmResult = await this.$confirm(
                                `确定要将房间${this.roomIdHoldChange}的业主改为${this.holdChangeInfo.personInfo.name}？`,
                                '操作提示',
                                {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }
                            ).catch(err => err)
                            if (confirmResult !== 'confirm') {
                                this.subFlag = true;
                                return this.$message.info('已取消更改')
                            }
                            this.holdChangeInfo.proprietorAndRoom.proprietorId = this.proprietorDetial.proprietor.id
                            this.holdChangeInfo.name = this.holdChangeInfo.personInfo.name
                            this.holdChangeInfo.proprietorAndRoom.roomId = this.proprietorDetial.proprietor.proprietorAndRoom.roomId
                            this.holdChangeInfo.proprietorAndRoom.id = this.proprietorDetial.proprietor.proprietorAndRoom.id
                            this.holdChangeInfo.proprietorAndRoom.proprietorAndRoomOccupation.chargingDate = null
                            if (this.holdChangeInfo.personInfo.birthday === '') {
                                this.holdChangeInfo.personInfo.birthday = null
                            }
                            try {
                                await api.holdChange(this.holdChangeInfo)
                                this.$message.success('操作成功')
                                this.closeHouseholdChange()
                                let refs: any = this.$refs;
                                this.nprCode = null
                                this.startTime = null
                                this.endTime = null
                                this.keyWords = null
                                refs.dateForm.handleClear()
                                this.getProprietorInfo()
                            } catch (e) {
                                this.$message.success('操作失败')
                            }
                        }
                    }
                }
            }
            this.subFlag = true;
        }

        //查询楼栋
        async getBuildingList() {
            let {data} = await api.getBuildingList(this.communtityId)
            this.buildingList = data
        }

        //删除业主信息
        async deleteInfo(id) {
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
            var ids: any = []
            ids = id.split('/t')
            try {
                await api.deleteProprietorInfo(ids)
                this.$message.success('删除成功')
                let refs: any = this.$refs;
                this.nprCode = null
                this.startTime = null
                this.endTime = null
                this.keyWords = null
                refs.dateForm.handleClear()
                if (this.proprietorInfo.length === 1 && (this.pages.pageNum > 1)) {
                    this.pages.pageNum--
                }
                this.getProprietorInfo()
            } catch (e) {
                this.$message.error('删除失败')
            }
        }

        //导出业主信息
        async exportProprietorInfo() {
            try {
                await api.exportProprietorInfo()
                this.$message.success('导出成功')
            } catch (e) {
                this.$message.error('导出失败')
            }
        }

        //历史记录
        async getHistory() {
            this.historyVisible = true
            let {data} = await api.getHistory(this.proprietorDetial.proprietor.proprietorAndRoom.roomId)
            this.historyInfo = data
            for (let i in this.historyInfo) {
                this.historyInfo[i].birthday = this.$utils.dateFormat(Number(this.historyInfo[i].birthday), 'date')
            }
        }

        //查询业主详情
        async getProprietorInfoDetial(id) {
            try {
                let {data} = await api.getProprietorInfoDetial(id)
                this.proprietorDetial = data
            } catch (e) {
            }

        }


        //籍贯
        async getRegionTree() {
            let {data} = await api.getRegionTree()
            this.native = data
        }

        //民族
        async getNation() {
            let {data} = await api.getInfoByName("民族")
            this.nation = data
        }

        //性别
        async getSex() {
            let {data} = await api.getInfoByName("性别")
            this.sex = data
        }

        //建筑物下的户主数
        async getGangInfoInBuilding(id) {
            let {data} = await api.getGangInfoInBuilding(id)
            this.countGang = data
            if (this.countGang.length > 0) {
                this.numberGang = this.countGang[0].count
            } else {
                this.numberGang = 0
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #householdInformation {
        position: relative;

        .thTitle {
            margin: 0;
        }

        .viewbox {
            padding-top: 15px;
            height: calc(100% - 60px);
            width: 100%;
            display: flex;


            .borderRight {
                width: 1px;
                height: 100%;
                background-color: #dde4eb;
                box-shadow: 1px 0 3px 0 #dde4eb;
                flex: none;
            }

            .rightMain {
                width: calc(100% - 221px);
                height: 100%;
                margin: 0 5px 0 20px;
                overflow: hidden;

                .middleline {
                    height: 80px;
                    background-color: #f8f9fc;
                    border-radius: 4px;
                    overflow: hidden;
                    display: flex;
                    margin: 6px 0 20px 0;

                    .iconbox {
                        height: 100%;
                        width: 70px;
                        background-image: linear-gradient(313deg,
                                #44d7fe 0%,
                                #4a86ff 100%);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;

                        .iconfont {
                            color: #fff;
                            font-size: 24px;
                        }
                    }

                    .infoShow {
                        width: 100%;
                        padding: 0 20px;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        align-items: center;

                        .leftInfo {
                            .parkInfo {
                                display: flex;
                                flex-wrap: wrap;
                                padding-top: 10px;

                                .detial {
                                    margin-right: 45px;
                                    display: inline-flex;
                                    align-items: center;

                                    &:last-child {
                                        margin-right: 0;
                                    }

                                    .iconfangzi {
                                        font-size: 11px;
                                        color: #3a7ef3;
                                        padding-right: 10px;
                                    }

                                    .item {
                                        color: #7c8185;
                                    }
                                }
                            }
                        }

                        .rightInfo {
                            color: #3a7ef3;
                            display: flex;
                            align-items: center;
                            cursor: pointer;

                            .iconfont {
                                margin-right: 6px;
                                font-size: 16px;
                            }
                        }
                    }
                }

                .searchline {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;

                    .froat {
                        display: flex;
                    }

                    .marginItem {
                        display: flex;
                        margin-bottom: 20px;
                    }

                    .margin {
                        margin-right: 15px;
                        margin-bottom: 20px;

                        .pmbtn {
                            flex: none;
                        }
                    }

                    > .item {
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
        }

    }

    .empty {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 15%;

        > p {
            color: $third-font-color;
            margin-top: 10px;
            font-size: 16px;

            i {
                color: #3a7ef3;
                cursor: pointer;
            }
        }
    }

    .borderLine {
        width: 100%;
        height: 1px;
        background-color: #dde4eb;
        margin-bottom: 15px;
    }

    .MuModalContent {
        .title {
            display: flex;
            justify-content: space-between;
            padding-bottom: 30px;

            .left {
                font-size: 16px;

                .iconfangzi {
                    color: #3a7ef3;
                    padding-right: 8px;
                }

                em {
                    font-weight: bold;
                }
            }

            .right {
                .iconxiangqing {
                    font-size: 14px;
                    padding-right: 6px;
                }

                font-size: 14px;
                color: #3a7ef3;
                cursor: pointer;
                user-select: none;
            }
        }

        .main {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .content {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 15px;

                &:last-child {
                    margin-bottom: 0px;
                }

                .aline1 {
                    display: flex;
                    margin-right: 40px;

                    .item {
                        min-width: 56px;

                        &.btn {
                            margin-right: 20px;
                            line-height: 36px;
                            text-align: right;
                        }
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

    .ivu-radio-wrapper {
        padding-right: 15px;
    }

    .upfileInfo {
        width: 100px;
        height: 140px;
        border: solid 1px #dde4eb;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;

        .iconfont {
            color: #dde4eb;
            font-size: 48px;
            line-height: 1;
        }

        .item {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            color: #fff;
            height: 28px;
            background-color: #000;
            position: absolute;
            bottom: 0;
            user-select: none;
            opacity: 0.6;
            text-align: center;
            line-height: 28px;
        }

        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
</style>
<style lang="scss">
    #householdInformation {
        .iconlouyu {
            padding-left: 18px;
        }

        .ivu-tree li ul {
            padding: 0;

            .ivu-tree-arrow {
                width: 0;
            }
        }

        .ivu-radio-group {
            line-height: 36px;
        }

        .uploader {
            .el-upload {
                border: solid 1px #dde4eb;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                width: 100px;
                height: 140px;

                .iconzhengjianzhao {
                    font-size: 44px;
                    color: #dde4eb;
                    width: 44px;
                    height: 48px;
                    text-align: center;
                    line-height: 128px;
                }

                .item {
                    width: 100px;
                    color: #fff;
                    height: 28px;
                    background-color: #000;
                    position: absolute;
                    bottom: 0;
                    user-select: none;
                    opacity: 0.6;
                }

                .avatar1 {
                    width: 100px;
                    height: 140px;
                    display: block;
                }
            }
        }
    }
</style>
