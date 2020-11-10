<template>
    <div id="houseProperty" >
        <div class="emptyInfo" v-show="buildingTree.length===0">
            <img src="../../images/暂无2.png" alt="">
            <p>暂无数据，点击<i @click="openAddcommuntity" style="color:#3a7ef3;cursor: pointer;padding-left: 5px">添加小区</i></p>
        </div>
        <div style="height: 100%" v-show="buildingTree.length!==0">
            <div class="thTitle" style="padding-left: 5px">
                <i class="line"></i>房产信息
            </div>
            <div class="viewbox">
                <div class="leftTree">
                    <Input type="search" placeholder="搜索" style="z-index: 0"></Input>
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
                        <div class="titleInfo">
                            <div class="infoShow">
                                <div class="infoText">
                                    {{rdInfo.name}}
                                </div>
                                <div class="info">
                                    <i class="iconfont iconweizhi"></i>
                                    <i class="textName">位置：</i>
                                    <em>{{rdInfo.address}}</em>
                                </div>
                                <div class="info">
                                    <i class="iconfont iconpingmiantu"></i>
                                    <i class="textName">平面图：</i>
                                    <em style="color: #3a7ef3; user-select: none;
                                cursor: pointer;" @click="lookRdView">查看</em>
                                </div>
                            </div>
                            <div class="editInfo" @click="communityMnagementFalg = true">
                                <i class="iconfont iconguanli"></i>
                                <em>小区管理</em>
                            </div>
                        </div>
                    </div>
                    <div v-show="roomId">
                        <div class="searchline" ref="searchline">
                            <div class="froat">
                                <mixSelect
                                        class="margin"
                                        :selectList="unitInfo"
                                        labelName="name"
                                        valueName="id"
                                        placeholder="全部单元"
                                        style="width: 130px"
                                        v-if="unitInfo.length!==0"
                                        v-model="unitSelect"
                                >
                                </mixSelect>
                                <div class="margin item" style="display: flex">
                                    <i style="margin-right: 10px;margin-top: 8px">面积区间</i>
                                    <Input placeholder="区间下限" style="width: 100px;" type="2fixed" v-model="buildAreaStart"></Input>
                                    <Input placeholder="区间上限" style="width: 100px;margin: 0 10px" type="2fixed" v-model="buildAreaEnd"></Input>
                                </div>
                                <mixSelect
                                        class="margin"
                                        :selectList="roomHead"
                                        labelName="name"
                                        valueName="code"
                                        placeholder="朝向"
                                        style="width: 130px"
                                        v-model="roomTowards"

                                >
                                </mixSelect>
                                <mixSelect
                                        class="margin"
                                        :selectList="roomStatus"
                                        labelName="name"
                                        valueName="code"
                                        placeholder="房屋状态"
                                        style="width: 130px"
                                        v-model="roomStatusSelect"
                                >
                                </mixSelect>
                                <div class="margin" style="display: flex;">
                                    <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px" @enter="getPage()" v-model="keyWords"></Input>
                                    <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                                        <i class="iconfont iconsousuo"></i>搜索
                                    </div>
                                    <div class="pmbtn" @click="resetInfo">
                                        <i class="iconfont iconzhongzhi"></i>重置
                                    </div>
                                </div>
                            </div>
                            <div class="marginItem">
                                <div class="pmbtn primary" style="margin-right: 15px" @click="calcHover = !calcHover" v-clickoutside="closeHover1">
                                    <i class="iconfont icontianjia"></i>
                                    添加房间
                                    <div class="btnSelection" :class="{active:calcHover === true}">
                                        <div class="selItem" @click="openAddDialog">单个添加</div>
                                        <div class="selItem" @click="addSomeHouseFlag=true">批量添加</div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="pmbtn" style="margin-right: 15px">
                                        <i class="iconfont icondaoru"></i>
                                        导入
                                    </div>
                                    <div class="pmbtn" @click="exportRoomInfo">
                                        <i class="iconfont icondaochu"></i>
                                        导出
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-table
                                :data="roomInfoTable"
                                stripe
                                class="myWisdomTable"
                                :height="formHeight"
                                :header-cell-style="{background:'#f4f6f9'}"
                                v-loading="loading"
                        >
                            <el-table-column slot="empty">
                                <img src="@manage/images/暂无数据.png">
                                <br>
                                暂无内容
                            </el-table-column>
                            <el-table-column
                                    prop="buildingName"
                                    label="楼号"
                                    min-width="120px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="unitId"
                                    label="单元"
                                    min-width="60px"
                                    show-overflow-tooltip
                                    v-if="unitInfo.length!==0"
                            >
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
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="roomTowardsCode"
                                    label="朝向"
                                    min-width="50px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="roomConstructCode"
                                    label="房间结构"
                                    min-width="120px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="buildArea"
                                    label="建筑面积(㎡)"
                                    min-width="110px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="useArea"
                                    label="使用面积(㎡)"
                                    min-width="100px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="roomUsageTypeCode"
                                    label="使用类型"
                                    min-width="80px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="roomStatusCode"
                                    label="房屋状态"
                                    min-width="80px"
                            >
                                <template slot-scope="{row,$index}">
                                    <div style="color: #ff9900" v-if="row.roomStatusCode==='未售'">
                                        {{row.roomStatusCode}}
                                    </div>
                                    <div style="color: #7c8185" v-else>{{row.roomStatusCode}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    width="100px"
                            >
                                <template slot-scope="{row,$index}">
                                    <div class="tableEdit">
                                        <div class="item" @click="openeditDialog(row.id)">编辑</div>
                                        <div class="item delete" @click="deleteRoomInfo(row.id)">删除</div>
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
                    <buildingInfo v-show="communtityId" :communtityId="communtityId" @close="closeBuildingTable" :rdInfo="rdInfo"></buildingInfo>
                </div>
            </div>
        </div >
        <transition name="rightSlide">
            <communtityManage v-show="communityMnagementFalg" @close="closeTable" :communityMnagementFalg="communityMnagementFalg"></communtityManage>
        </transition>
        <transition name="rightSlide">
            <addSomeHouse v-show="addSomeHouseFlag" @close="closeaddSomeHouse" :addSomeHouseFlag="addSomeHouseFlag" :rdInfo="rdInfo" :buildingName="buildingName" :roomId="roomId" :buildingDetailInfo="buildingDetailInfo"></addSomeHouse>
        </transition>
        <el-dialog
                :visible.sync="addRoomVisible"
                custom-class="emDialog"
                width="545px"
                top="6vh"
                @close="closeAddDialog"
                :close-on-click-modal="false"
                v-if="addRoomVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                添加房间
            </div>
            <vue-perfect-scrollbar class="dialogMainbox">
                <div class="aline">
                    <div class="label">小区</div>
                    <div class="info">
                        <mixSelect
                                disabled
                                v-model="rdId"
                                :selectList="buildingTree"
                                labelName="title"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentItem="rdSearch"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">楼号</div>
                    <div class="info">
                        <!--<Input placeholder="请输入"  v-model="buildingName" disabled></Input>-->
                        <mixSelect
                                disabled
                                v-model="roomId"
                                :selectList="buildingList"
                                labelName="name"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentItem="buildingSearch"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline" v-if="unitInfo.length!==0">
                    <div class="label">
                        <em class="fontSombal">*</em>
                        单元</div>
                    <div class="info">
                        <mixSelect
                                v-model="addRoomInfo.unitId"
                                :selectList="unitInfo"
                                labelName="name"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentItem="limitInput"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">
                        <em class="fontSombal">*</em>楼层号</div>
                    <div class="info">
                        <Input placeholder="请输入"  v-model="addRoomInfo.floorNum" type="allNumber" @blur="limitInput" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">
                        <em class="fontSombal">*</em>房间号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addRoomInfo.roomNum" @blur="limitInput" type="number" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">
                        <em class="fontSombal">*</em>房间代码</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addRoomInfo.name" disabled></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">房型</div>
                    <div class="info">
                        <mixSelect
                                v-model="addRoomInfo.roomDetail.roomTypeCode"
                                :selectList="roomType"
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
                    <div class="label">朝向</div>
                    <div class="info">
                        <mixSelect
                                v-model="addRoomInfo.roomDetail.roomTowardsCode"
                                :selectList="roomHead"
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
                    <div class="label">房间结构</div>
                    <div class="info">
                        <mixSelect
                                v-model="addRoomInfo.roomDetail.roomConstructCode"
                                :selectList="roomConstruct"
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
                    <div class="label"> <em class="fontSombal">*</em>建筑面积(㎡)</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addRoomInfo.buildArea" type='2fixed' necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"> <em class="fontSombal">*</em>使用面积(㎡)</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addRoomInfo.useArea" type='2fixed' necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">使用类型</div>
                    <div class="info">
                        <mixSelect
                                v-model="addRoomInfo.roomDetail.roomUsageTypeCode"
                                :selectList="roomUsageType"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
            </vue-perfect-scrollbar>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="insertRoomInfo">确定</div>
                <div class="pmbtn" @click="closeAddDialog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="editRoomVisible"
                custom-class="emDialog"
                width="545px"
                top="6vh"
                @close="closeEditDialog"
                :close-on-click-modal="false"
                v-if="editRoomVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改房间信息
            </div>
            <vue-perfect-scrollbar class="dialogMainbox">
                <div class="aline">
                    <div class="label">小区</div>
                    <div class="info">
                        <mixSelect
                                v-model="rdId"
                                :selectList="buildingTree"
                                labelName="title"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                disabled
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">楼号</div>
                    <div class="info">
                        <Input v-model="buildingName" disabled></Input>
                    </div>
                </div>
                <div class="aline" v-if="unitInfo.length!==0">
                    <div class="label">单元</div>
                    <div class="info">
                        <mixSelect
                                v-model="editRoom.unitId"
                                :selectList="unitInfo"
                                labelName="name"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                disabled
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>房间代码</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="editRoom.name" disabled ></Input>
                    </div>
                </div>
                <div class="aline" v-if="unitInfo.length!==0">
                    <div class="label"><em class="fontSombal">*</em>楼层号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="editRoom.floorNum" type="allNumber" @blur="limitInput2" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>房间号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="editRoom.roomNum" @blur="limitInput2" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">房型</div>
                    <div class="info">
                        <mixSelect
                                v-model="editRoom.roomDetail.roomTypeCode"
                                :selectList="roomType"
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
                    <div class="label">朝向</div>
                    <div class="info">
                        <mixSelect
                                v-model="editRoom.roomDetail.roomTowardsCode"
                                :selectList="roomHead"
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
                    <div class="label">房间结构</div>
                    <div class="info">
                        <mixSelect
                                v-model="editRoom.roomDetail.roomConstructCode"
                                :selectList="roomConstruct"
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
                    <div class="label"><em class="fontSombal">*</em>建筑面积(㎡)</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="editRoom.buildArea" type='2fixed' necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>使用面积(㎡)</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="editRoom.useArea" type='2fixed' necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">使用类型</div>
                    <div class="info">
                        <mixSelect
                                v-model="editRoom.roomDetail.roomUsageTypeCode"
                                :selectList="roomUsageType"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
            </vue-perfect-scrollbar>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editRoomInfo">确定</div>
                <div class="pmbtn" @click="closeEditDialog">取消</div>
            </div>
        </el-dialog>
        <addCommuntity ref="addCommuntity" @close="getTree"></addCommuntity>
        <viewImage ref="viewImage" @uploadSuccess="uploadSuccess" @deleteImg="deleteImg"></viewImage>
        {{code}}
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import communtityManage from './houseProperty_communtity.vue'
    import viewImage from './components/viewImage.vue'
    import * as api from '@manage/api/house/huoseProperty'
    import * as app from '@manage/api/app'
    import addCommuntity from './components/addCommunity.vue'
    import buildingInfo from './houseProperty_buildingInfo.vue'
    import addSomeHouse from './houseProperty_addSomeHouse.vue'

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
            communtityManage,
            viewImage,
            addCommuntity,
            buildingInfo,
            addSomeHouse
        }
    })

    export default class mainView extends Vue {
        code:any = null;
        addSomeHouseFlag:boolean=false
        rdId: string = ''
        roomName: any = ''
        unitInfo: any = []
        roomType: any = []
        roomHead: any = []
        editRoom: any = {
            buildArea: 0,
            buildingId: "",
            floorId: "",
            name: "",
            rdId: "",
            roomDetail: {
                roomTypeCode: "",
                roomTowardsCode: "",
                roomStatusCode: "",
                roomConstructCode: "",
                roomUsageTypeCode: ""
            },
            roomNum: "",
            useArea: ''
        }
        roomConstruct: any = []
        roomUsageType: any = []
        roomStatus: any = []
        editRoomVisible: boolean = false
        buildAreaStart: string = null
        buildAreaEnd: string = null
        keyWords: string = null
        unitSelect: string = null
        roomTowards: string = null
        roomStatusSelect: string = null
        buildingName: string = ''
        floorList:any=[]
        editFloorNum:string=''
        addRoomInfo: any = {
            buildArea: '',
            buildingId: "",
            floorNum: "",
            name: "",
            rdId: "",
            roomDetail: {
                roomTypeCode: "",
                roomTowardsCode: "",
                roomStatusCode: "",
                roomConstructCode: "",
                roomUsageTypeCode: ""
            },
            roomNum: "",
            roomPicId: "",
            unitId: '',
            useArea: ''
        }
        roomId: string = '';
        rdInfo: any = []
        roomInfo: any = []
        roomInfoTable: any = []
        calcHover:boolean=false
        viewNameInfo: any = {
            name: '',
            title: ''
        }
        subFlag: boolean = true
        buildingList:any=[]


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
                        width: 'calc(100% - 40px)',
                    },
                    class: {
                        treeActive: this.communtityId === data.id,
                        treeActive2: this.roomId === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 2) {
                                this.roomId = data.id;
                                this.rdId = data.parentId;
                                this.communtityId='';
                                this.buildingName = data.title
                                this.pages.pageNum = 1;
                                setTimeout(() => {
                                    this.setPagesize();
                                    this.resetInfo()
                                }, 200)
                                this.getUnitInfo(this.roomId)
                                this.getBuildingInfoById(this.roomId)
                                this.getRdInfoById(this.rdId)
                            } else {
                                this.communtityId=data.id;
                                this.roomId ='';
                                this.getRdInfoById(this.communtityId)
                                if(data.expand===false){
                                    data.expand = !data.expand;
                                }
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

        loading: boolean = false;
        buildingTree: any = []
        formHeight: number = 1000;
        buildingName:string=''
        buildingDetailInfo:any=[]
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 0,
        };
        addRoomVisible: boolean = false
        imageUrl: string = ''
        communityMnagementFalg: boolean = false
        communtityId:string=''


        created(): void {
            this.$nextTick(()=>{
                this.getTree()
                this.getRoomType()
                this.getRoomHead()
                this.getRoomConstruct()
                this.getRoomStatus()
                this.getRoomUsageType()
            })

        }
        mounted(): void {

        }

        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let searchline = refs.searchline.clientHeight;
            let middleline = refs.middleline.clientHeight + 15;
            this.formHeight = maxHeight - searchline - middleline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        closeHover1() {
            this.calcHover = false
        }
        openAddDialog() {
            this.getBuildList(this.rdId)
            this.addRoomVisible = true
        }

        closeAddDialog() {
            this.addRoomInfo = {
                buildArea: '',
                buildingId: "",
                floorNum: "",
                name: "",
                rdId: "",
                roomDetail: {
                    roomTypeCode: "",
                    roomTowardsCode: "",
                    roomStatusCode: "",
                    roomConstructCode: "",
                    roomUsageTypeCode: ""
                },
                roomNum: "",
                roomPicId: "",
                useArea: '',
                unitId: '',
            }
            this.addRoomVisible = false
        }

        openeditDialog(id) {
            this.editRoomVisible = true
            this.getRoomInfoById(id)
        }

        closeEditDialog() {
            this.editRoomVisible = false
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getRoomInfo()
        }
        rdSearch(){
            this.getBuildList(this.rdId)
        }
        buildingSearch(){
            this.getUnitInfo(this.buildingName)
        }
        lookRdView() {
            let refs: any = this.$refs;
            refs.viewImage.openRdView(this.rdInfo.name,this.rdInfo.rdPicId);
        }
        openAddcommuntity(){
            let refs:any = this.$refs;
            refs.addCommuntity.openAddCommuntity()
        }

        /*viewImage(row) {
            this.viewNameInfo.name = row.name
            this.viewNameInfo.title = '房间平面图'
            let refs: any = this.$refs;
            refs.viewImage.openRdView();
        }*/


        closeTable() {
            this.communityMnagementFalg = false;
            this.getTree();
        }
        closeBuildingTable(){
            this.getTree();
        }
        resetInfo() {
            this.buildAreaStart = null
            this.buildAreaEnd = null
            this.roomStatusSelect = null
            this.keyWords = null
            this.unitSelect = null
            this.roomTowards = null
            this.getPage()
        }

         async limitInput() {
                    if(this.addRoomInfo.floorNum!==''&&this.buildingDetailInfo.upFloorNum!==0&&this.addRoomInfo.floorNum>this.buildingDetailInfo.upFloorNum){
                        this.$message.warning('楼层超出该楼最大楼层数，请重新输入')
                        this.addRoomInfo.floorNum=''
                    }
                    else {
                        let rdCode =this.rdInfo.code;
                        let buildingCode=Number(this.buildingDetailInfo.code)<10 ? ('0' +  this.buildingDetailInfo.code) :  this.buildingDetailInfo.code
                        let roomNum=this.addRoomInfo.roomNum<10 ? ('0' + this.addRoomInfo.roomNum) :  this.addRoomInfo.roomNum
                        if(this.unitInfo.length!==0&&this.addRoomInfo.unitId!=''){
                            let unitCode=this.unitInfo.find(x =>x.id===this.addRoomInfo.unitId).code
                            let roomName=`${rdCode}-${buildingCode}-${unitCode}-${this.addRoomInfo.floorNum}-${roomNum}`
                            let {data}=await  api.getRoomName(roomName,this.rdId)
                            if(data.length>0){
                                this.$message.warning('该房间代码已存在，请重新房间号和楼号')
                                this.addRoomInfo.floorNum=''
                                this.addRoomInfo.roomNum=''
                            } else {
                                this.addRoomInfo.name=roomName
                            }
                            roomName=''
                        }
                        else {
                            let roomName=`${rdCode}-${buildingCode}-${this.addRoomInfo.floorNum}-${this.addRoomInfo.roomNum}`
                            let {data}=await  api.getRoomName(roomName,this.rdId)
                            if(data.length>0){
                                this.$message.warning('该房间代码已存在，请重新房间号和楼号')
                                this.addRoomInfo.floorNum=''
                                this.addRoomInfo.roomNum=''
                            } else {
                                this.addRoomInfo.name=roomName
                            }
                            roomName=''
                        }
                    }
        }
        async limitInput2() {
            if(this.editRoom.floorNum!==''&&this.buildingDetailInfo.upFloorNum!==0&&this.editRoom.floorNum>this.buildingDetailInfo.upFloorNum){
                this.$message.warning('楼层超出改该楼最大楼层数，请重新输入')
                this.editRoom.floorNum=''
            }
                else {
                    let rdCode =this.rdInfo.code;
                    let buildingCode=Number(this.buildingDetailInfo.code)<10 ? ('0' +  this.buildingDetailInfo.code) :  this.buildingDetailInfo.code
                    let roomNum=this.editRoom.roomNum<10 ? ('0' + this.editRoom.roomNum) :  this.editRoom.roomNum
                    if(this.unitInfo.length!==0){
                        let unitCode=this.unitInfo.find(x =>x.id===this.editRoom.unitId).code
                        let roomName=`${rdCode}-${buildingCode}-${unitCode}-${this.editRoom.floorNum}-${roomNum}`
                        let {data}=await  api.getRoomName(roomName,this.rdId)
                        if(data.length>0&&roomName!==this.editFloorNum){
                            this.$message.warning('该房间代码已存在，请重新房间号和楼号')
                            this.editRoom.floorNum=''
                            this.editRoom.roomNum=''
                        } else {
                            this.editRoom.name=roomName
                        }
                        roomName=''
                    }
                    else {
                        let roomName=`${rdCode}-${buildingCode}-${this.editRoom.floorNum}-${this.editRoom.roomNum}`
                        let {data}=await  api.getRoomName(roomName,this.rdId)
                        if(data.length>0&&roomName!==this.editFloorNum){
                            this.$message.warning('该房间代码已存在，请重新房间号和楼号')
                            this.editRoom.floorNum=''
                            this.editRoom.roomNum=''
                        } else {
                            this.editRoom.name=roomName
                        }
                        roomName=''
                    }
                }
        }

        //组织树
        async getTree() {
            try{
                // let {data} = await api.getTree();
                let data:any = organization.organizationList;
                this.buildingTree = data;
                if(data.length>0){
                    if(this.communtityId === '' && this.roomId === ''){
                        this.communtityId = data[0].id
                        data[0].expand = true
                        this.getRdInfoById(this.communtityId)
                    }
                    else if(this.roomId!==''){
                        this.buildingTree.find(x => x.id === this.rdId).expand=true
                    }
                    else {
                        this.buildingTree.find(x => x.id === this.communtityId).expand=true
                    }
                }
            }catch (e) {
                this.buildingTree = [];
                this.$message.error(`获取小区数据失败！`)
            }
        }

        //查询房间信息
        async getRoomInfo() {
            this.loading = true
            if (this.roomStatusSelect === '') {
                this.roomStatusSelect = null
            }
            if (this.roomTowards === '') {
                this.roomTowards = null
            }
            if (this.unitSelect === '') {
                this.unitSelect = null
            }
            if (this.buildAreaStart === '') {
                this.buildAreaStart = null
            }
            if (this.buildAreaEnd === '') {
                this.buildAreaEnd = null
            }
            /*let {data} = await api.getRoomInfo(
                this.pages.pageNum ,
                this.pages.pageSize,
                this.rdId, this.roomId, '0',
                this.buildAreaStart,
                this.buildAreaEnd,
                this.keyWords,
                this.roomStatusSelect,
                this.roomTowards,
                this.unitSelect,
            )*/
            let data = organization.roomList
            this.roomInfo = data.content
            this.pages.totalElements = data.totalElements
            this.roomInfoTable = JSON.parse(JSON.stringify(this.roomInfo))
            for (let i in this.roomInfoTable) {
                if (this.roomInfoTable[i].roomTypeCode ) {
                    this.roomInfoTable[i].roomTypeCode = this.roomType.find(x => x.code === this.roomInfoTable[i].roomTypeCode).name
                }
                if (this.roomInfoTable[i].roomTowardsCode ) {
                    this.roomInfoTable[i].roomTowardsCode = this.roomHead.find(x => x.code === this.roomInfoTable[i].roomTowardsCode).name
                }
                if (this.roomInfoTable[i].roomConstructCode ) {
                    this.roomInfoTable[i].roomConstructCode = this.roomConstruct.find(x => x.code === this.roomInfoTable[i].roomConstructCode).name
                }
                if (this.roomInfoTable[i].roomUsageTypeCode ) {
                    this.roomInfoTable[i].roomUsageTypeCode = this.roomUsageType.find(x => x.code === this.roomInfoTable[i].roomUsageTypeCode).name
                }
                if (this.roomInfoTable[i].roomStatusCode ) {
                    this.roomInfoTable[i].roomStatusCode = this.roomStatus.find(x => x.code === this.roomInfoTable[i].roomStatusCode).name
                }

                if (this.unitInfo.find(x => x.id === this.roomInfoTable[i].unitId)) {
                    this.roomInfoTable[i].unitId = this.unitInfo.find(x => x.id === this.roomInfoTable[i].unitId).name
                }
            }
            this.loading = false
        }


        //新增房间信息
        async insertRoomInfo() {
            if (this.subFlag) {
                this.subFlag = false;
                let limit = {
                    'floorNum':'楼层号',
                    "roomNum": '房间号',
                    "name": '房间代码',
                    'buildArea':'建筑面积',
                    'userArea':'使用面积'
                }
                if (this.unitInfo.length !== 0 && this.addRoomInfo.unitId === '') {
                    this.$message.warning('请输入单元')
                }
                else {
                    if (this.$utils.isntNull(this.addRoomInfo, limit)) {
                        try {
                            this.addRoomInfo.roomDetail.roomStatusCode='2'
                            this.addRoomInfo.rdId = this.rdId
                            this.addRoomInfo.buildingId = this.roomId
                            await api.addRoomInfo(this.addRoomInfo)
                            this.$message.success('添加成功')
                            this.closeAddDialog()
                            this.resetInfo()
                        } catch (e) {
                            this.$message.error('添加失败');
                        }
                    }
                }
            }
            this.subFlag = true;
        }

        //查询房间详细信息
        async getRoomInfoById(id) {
            let {data} = await api.getRoomInfoById(id)
            if (data.roomDetail === null) {
                this.editRoom.buildArea = data.buildArea
                this.editRoom.buildingId = data.buildingId
                this.editRoom.floorId = data.floorId
                this.editRoom.floorNum = data.floorNum
                this.editRoom.name = data.name
                this.editRoom.roomNum = data.roomNum
                this.editRoom.rdId = data.rdId
                this.editRoom.useArea = data.useArea
            } else {
                this.editRoom = data
            }
            this.editFloorNum=this.editRoom.name
        }

        //修改房间信息
        async editRoomInfo() {
            if (this.subFlag) {
                this.subFlag = false;
                let limit = {
                    "roomNum": '房间号',
                    "name": '房间代码',
                    'floorNum':'楼层号',
                    'buildArea':'建筑面积',
                    'userArea':'使用面积'
                }
                if (this.$utils.isntNull(this.editRoom, limit)) {
                        try {
                            await api.updateRoomInfo(this.editRoom)
                            this.editRoomVisible = false
                            this.$message.success('修改成功')
                            this.buildAreaStart = null
                            this.buildAreaEnd = null
                            this.roomStatusSelect = null
                            this.keyWords = null
                            this.unitSelect = null
                            this.roomTowards = null
                            this.getRoomInfo()
                        } catch (e) {
                            this.$message.error('修改失败');
                        }
                    }
                this.subFlag = true;
            }

        }

        //删除信息
        async deleteRoomInfo(id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该房间, 是否继续?',
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
                await api.deleteRoomInfo(ids)
                this.$message.success('删除成功')
                this.buildAreaStart = null
                this.buildAreaEnd = null
                this.roomStatusSelect = null
                this.keyWords = null
                this.unitSelect = null
                this.roomTowards = null
                if(this.roomInfo.length===1&&(this.pages.pageNum>1)){
                    this.pages.pageNum--
                }
                this.getRoomInfo()
            } catch (e) {
                this.$message.error('删除失败')
            }
        }

        //查询小区详细信息
        async getRdInfoById(id) {
            let {data} = await api.getRdInfoById(id)
            this.rdInfo = data
        }

        async getBuildList(rdId){
            let {data} =await api.getBuildingList(rdId)
            this.buildingList=data
        }
        //查询单元
        async getUnitInfo(id) {
            let {data} = await api.getUnitInfo(id)
            this.unitInfo = data
        }
        //查询楼层
        async getFloor(buildingId,unitId){
            let {data} = await api.getFloor(buildingId,unitId)
            this.floorList = data
        }

        //查询楼栋详细信息
        async getBuildingInfoById(id) {
            let {data} = await api.getBuildingInfoById(id)
            this.buildingDetailInfo = data
        }
        //导出房间信息
        async exportRoomInfo() {
            try {
                let {request:{responseURL}} = await api.exportRoomInfo(this.rdId);
                window.location.href = responseURL;
                this.$message.success('导出成功')
            } catch (e) {
                this.$message.error('导出失败')
            }
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


        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };

        uploadSuccess(pid:string,load:any){
            if (this.subFlag) {
                this.subFlag = false;
                this.rdInfo.rdPicId = pid;
                api.updateRdInfo(this.rdInfo).then(()=>{
                    this.$message.success(`上传成功！`)
                    load.close()
                    this.subFlag = true;
                }).catch(e =>{
                    this.$message.error(`上传失败,${e}`)
                    load.close()
                    this.subFlag = true;
                })
            }
        }
        deleteImg(){
                this.rdInfo.rdPicId = '';
                    api.updateRdInfo(this.rdInfo).then(()=>{
                        this.$message.success(`删除成功！`)
                    }).catch(e =>{
                        this.$message.error(`删除失败,${e}`)
                })
        }
        closeaddSomeHouse(){
            this.addSomeHouseFlag=false
            this.getRoomInfo()
        }
    }

</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #houseProperty {
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
                box-shadow: 1px 0px 3px 0px #dde4eb;
                flex: none;
            }

            .rightMain {
                width: calc(100% - 196px);
                height: 100%;
                padding: 0 5px 0 20px;
                overflow: hidden;

                .middleline {
                    height: 60px;
                    background-color: #f8f9fc;
                    border-radius: 4px;
                    overflow: hidden;
                    display: flex;
                    margin-bottom: 20px;

                    .iconbox {
                        height: 100%;
                        width: 60px;
                        background-image: linear-gradient(313deg,
                                #4d9aff 0%,
                                #3b66f6 100%);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;

                        .iconfont {
                            color: #fff;
                            font-size: 26px;
                        }
                    }

                    .titleInfo {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;

                        .infoShow {
                            display: flex;
                            align-items: center;

                            .infoText {
                                margin-left: 20px;
                                font-size: 18px;
                                color: #30374a;
                                font-weight: bolder;
                            }

                            .info {
                                margin-left: 100px;

                                .iconweizhi {
                                    color: #3a7ef3;
                                    font-size: 14px;
                                }

                                .iconpingmiantu {
                                    color: #33c8b4;
                                    font-size: 14px;
                                }

                                .textName {
                                    color: #7c8185;
                                    padding-left: 8px;
                                }
                            }
                        }

                        .editInfo {
                            color: #3a7ef3;
                            user-select: none;
                            cursor: pointer;

                            .iconbianji {
                                font-size: 16px;
                            }

                            em {
                                padding: 0 20px 0 6px;
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
                        width: 80%;
                    }

                    .margin {
                        margin-right: 15px;
                        margin-bottom: 20px;
                        flex: none
                    }

                    .marginItem {
                        margin-bottom: 15px;

                        > .item {
                            height: 36px;
                            display: inline-flex;
                            align-items: center;
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

            }
        }

    }
    .emptyInfo {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
        top: 20%;
        > p {
            color: $third-font-color;
            margin-top: 10px;
        }
    }
    .borderLine {
        width: 100%;
        height: 1px;
        background-color: #dde4eb;
        margin-bottom: 15px;
    }

    .aline {
        .label {
            width: 100px;
            //width: 100px;
        }
    }

    .alineImage {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .imageText {
            font-size: 16px;
            color: #30374a;
        }

        .imageShow {
            width: 100%;
            height: 450px;
            background-color: #f8f9fc;
            margin-top: 12px;

            .avatar {
                height: 100%;
                width: 100%;
                display: block;
            }

            .infoImage {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .iconzanwutupian2 {
                    font-size: 100px;
                    color: #dde4eb;
                }

                em {
                    color: #a0a5a9;
                }
            }
        }
    }
    .fontSombal{
        color: #ff4040;
    }

</style>
<style lang="scss">
    #houseProperty {
        .iconlouyu {
            padding-left: 18px;
        }

        .ivu-tree li ul {
            padding: 0;

            .ivu-tree-arrow {
                width: 0;
            }
        }
    }
</style>


