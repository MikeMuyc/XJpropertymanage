<template>
    <div id="parking" >
        <div style="height: 100%">
            <div class="thTitle" style="padding-left: 5px">
                <i class="line"></i>车位管理
            </div>
            <div class="viewbox" ref="viewbox" v-show="buildingTree.length!==0">
                <div class="leftTree">
                    <Input type="search" placeholder="搜索" style="z-index: 0"></Input>
                    <vue-perfect-scrollbar
                            style="height:calc(100% - 48px);margin-top: 10px;padding-right: 15px">
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
                <div class="rightMain" ref="rightMain" v-show="pardId">
                    <div class="middleline" ref="middleline">
                        <div class="iconbox">
                            <i class="iconfont iconche1"></i>
                        </div>
                        <div class="infoShow">
                            <div class="leftInfo">
                                <i style="font-size: 18px;font-weight: bolder;">{{rdName}} /
                                    {{parkingDeteal.name}}</i>
                                <div class="parkInfo">
                                    <div class="detial">
                                        <i class="iconfont iconche1"></i>
                                        <i class="item">车位：</i>
                                        <em v-if="parkingDeteal.parkingSpaceNum!==null">{{parkingDeteal.parkingSpaceNum}}个</em>
                                        <em style="color: #7c8185" v-else>暂无</em>
                                    </div>
                                    <div class="detial">
                                        <i class="iconfont iconmianji"></i>
                                        <i class="item" >面积：</i>
                                        <em v-if="parkingDeteal.area!==null">{{parkingDeteal.area}}㎡</em>
                                        <em style="color: #7c8185" v-else>暂无</em>
                                    </div>
                                    <div class="detial">
                                        <i class="iconfont iconweizhi"></i>
                                        <i class="item">位置：</i>
                                        <em>{{parkingDeteal.address}}</em>
                                    </div>
                                    <div class="detial">
                                        <i class="iconfont iconpingmiantu"></i>
                                        <i class="item">平面图：</i>
                                        <em style="color: #3a7ef3;cursor: pointer" @click="openRdView">查看</em>
                                    </div>
                                    <div class="detial">
                                        <i class="iconfont iconmiaoshu"></i>
                                        <i class="item">描述：</i>
                                        <em style="color: #7c8185">{{parkingDeteal.description || '无'}}</em>
                                    </div>
                                </div>
                            </div>
                            <div class="rightInfo" @click="parkManage">
                                <i class="iconfont iconguanli"></i>
                                <em>停车场管理</em>
                            </div>
                        </div>
                    </div>
                    <div class="searchline" ref="searchline">
                        <div class="froat">
                            <div class="margin item" style="display: flex">
                                <i style="margin-right: 10px;margin-top: 8px">面积区间</i>
                                <Input placeholder="开始面积 " style="width: 80px;"
                                       v-model="parkSpaceInfoSelect.areaStart"></Input>
                                <Input placeholder="结束面积 " style="width: 80px;margin: 0 10px"
                                       v-model="parkSpaceInfoSelect.areaEnd"></Input>
                            </div>
                            <mixSelect
                                    class="margin"
                                    :selectList="parkSpaceStatus"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="车位状态"
                                    style="width: 130px"
                                    v-model="parkSpaceInfoSelect.statusCode"
                            >
                            </mixSelect>
                            <div class="margin" style="display: flex;">
                                <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px"
                                       v-model="parkSpaceInfoSelect.keyWords" @enter="getPage()"></Input>
                                <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                                    <i class="iconfont iconsousuo"></i>搜索
                                </div>
                                <div class="pmbtn" @click="resentInfo">
                                    <i class="iconfont iconzhongzhi"></i>重置
                                </div>
                            </div>
                        </div>
                        <div class="marginItem">
                            <div class="pmbtn primary" style="margin-right: 15px" @click="openAddPArkSpaceInfo" v-clickoutside="closeHover1">
                                <i class="iconfont icontianjia"></i>
                                添加车位
                                <div class="btnSelection" :class="{active:calcHover === true}">
                                    <div class="selItem" @click="openAddParkDialog">单个添加</div>
                                    <div class="selItem" @click="addSomeParkFlag=true">批量添加</div>
                                </div>
                            </div>
                            <div class="pmbtn" style="margin-right: 15px" @click="openManagemengType">
                                <i class="iconfont iconshiyongdengji"></i>
                                使用登记
                            </div>
                            <div class="item">
                                <div class="pmbtn" style="margin-right: 15px">
                                    <i class="iconfont icondaoru"></i>
                                    导入
                                </div>
                                <div class="pmbtn">
                                    <i class="iconfont icondaochu"></i>
                                    导出
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-table
                            :data="parkSpace"
                            stripe
                            class="myWisdomTable"
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
                                prop="code"
                                label="车位编号"
                                min-width="100px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="area"
                                label="车位面积(㎡)"
                                min-width="100px"
                                show-overflow-tooltip
                        >
                            <!--<template slot-scope="{row,$index}">-->
                                <!--<div v-if="row.area===null">暂无</div>-->
                                <!--<div v-else>{{row.area}}</div>-->
                            <!--</template>-->
                        </el-table-column>
                        <el-table-column
                                prop="statusCode"
                                label="车位状态"
                                min-width="80px"
                        >
                            <template slot-scope="{row,$index}">
                                <div style="color: #3dcb42" v-if="row.statusCode==='1'">{{parkSpaceStatus.find(item =>item.code===row.statusCode).name}}</div>
                                <div v-else>{{parkSpaceStatus.find(item =>item.code===row.statusCode).name}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="managesType"
                                label="管理类别"
                                min-width="100px"
                                show-overflow-tooltip
                        >
                            <template slot-scope="{row,$index}">
                                <div v-if="row.managesType!==''">{{manageType.find(item =>item.code===row.managesType).name}}</div>
                                <div v-else style="color: #7c8185" >—</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="100px"
                        >
                            <template slot-scope="{row,$index}">
                                <div class="tableEdit">
                                    <div class="item" @click="openParkSpaceDetail(row.id)" v-if="row.statusCode!=='1'">详情</div>
                                    <div class="item" style="color:#c6c9ce;cursor: default " v-else>详情</div>
                                    <div class="item delete" @click="deleteParkSpaceInfo(row.id)">删除</div>
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
                <parkInfo v-show="!pardId" :communtityPark="communtityPark" @close="parkInfoClose" :buildingTree="buildingTree" :communtityId="communtityId"></parkInfo>
            </div>
            <div class="empty" v-show="buildingTree.length===0">
                <img src="../../images/暂无3.png" alt="">
                <p >暂无数据，请先至<i @click="goToHouse">房产信息</i>处添加小区</p>
            </div>
        </div>
        <transition name="rightSlide">
            <parkManage v-show="parkManageFalg" @close="closeTable" :rdId="parking.rdId"
                        :parkManageFalg="parkManageFalg" :buildingTree="buildingTree"></parkManage>
        </transition>
        <transition name="rightSlide">
            <addSomeParkSpace v-show="addSomeParkFlag" @close="closeAddSomeParkSpace" :parking="parking" :pardId="pardId" :rdName="rdName" :addSomeParkFlag="addSomeParkFlag" :buildingTree="buildingTree"></addSomeParkSpace>
        </transition>
        <transition name="rightSlide">
            <parkSpaceDetail v-show="parkSpaceDetailFlag" @close="closeParkSpaceDetailTable" :packSpaceId="packSpaceId" :parkSpaceDetailFlag="parkSpaceDetailFlag" :buildingTree="buildingTree" :parkingList="parkingList"></parkSpaceDetail>
        </transition>
        <el-dialog
                :visible.sync="addParkVisible"
                custom-class="emDialog"
                width="545px"
                top="15vh"
                :close-on-click-modal="false"
                @close="closeAddParkDialog"
                v-if="addParkVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                添加车位
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>所属小区</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="buildingTree"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="parking.rdId"
                                disabled
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>停车场</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="parkingList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="pardId"
                                disabled
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>车位编号</div>
                    <div class="info">
                        <Input placeholder="请输入" style="width: 40%;"  disabled v-model="parkSpaceCodeFor"></Input>
                        <Input placeholder="请输入" v-model="addParkSpace.code" @blur="codeLimit" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">车位面积(㎡)</div>
                    <div class="info">
                        <Input placeholder="请输入" type='2fixed' v-model="addParkSpace.area" ></Input>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addparkSpaceInfo">确定</div>
                <div class="pmbtn" @click="closeAddParkDialog">取消</div>
            </div>
        </el-dialog>
        <viewImage ref="viewImage" @uploadSuccess="uploadSuccess" @deleteImg="deleteImg"></viewImage>
        <viewMap  ref="viewMap"></viewMap>
        <manageType ref="manageType" @close="closeManageTypeBox"></manageType>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import parkManage from './parkingInformation_management.vue';
    import viewImage from './components/viewImage.vue'
    import viewMap from './components/viewMap.vue'
    import * as api from '@manage/api/house/parkingInformation'
    import * as app from '@manage/api/app'
    import parkInfo from './parkInfomation_parkInfo.vue'
    import addSomeParkSpace from './parkInfomation_addSomeParkspace.vue'
    import manageType from './components/parking_manageType.vue'
    import parkSpaceDetail from './parkSpace_detail.vue'
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
            parkManage,
            viewImage,
            viewMap,
            parkInfo,
            addSomeParkSpace,
            manageType,
            parkSpaceDetail
        }
    })

    export default class mainView extends Vue {
        addSomeParkFlag:boolean=false
        parkSpaceDetailFlag:boolean=false
        calcHover:boolean=false
        pardId: string = '';
        parking: any = []
        communtityPark:any=[]
        parkSpaceDeatilInfo: any = []
        viewNameInfo: any = {
            name: '',
            title: ''
        }
        leaseTrem: any = []
        loading: boolean = true;
        parkSpaceCode: any = []
        parkSpaceCodeFor:string=''
        renderContent(h, {root, node, data}) {
            return h('div', {
                    attrs: {
                        title: data.name,
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '36px',
                        overflow: 'hidden',
                        width: 'calc(100% - 20px)'
                    },
                    class: {
                        treeActive: this.pardId === data.id,
                        treeActive2: this.communtityId === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level !== 1) {
                                this.parking = data
                                this.pardId = data.id;
                                this.communtityId=''
                                setTimeout(() => {
                                    this.getParkingDetialInfo()
                                    this.setPagesize();
                                    this.resentInfo()
                                    this.getParkingLIst()
                                }, 200)
                            } else {
                                this.communtityPark = data
                                this.communtityId=data.id
                                this.pardId ='' ;
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
                            iconche1: data.rdId,
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
                    }, data.name),


                ]);
        };
        buildingTree: any = []
        parkingList:any=[]
        parkSpace: any = []
        communtityId:string=''
        personNameLIst: any = []
        parkSpaceStatus: any = [
            {
                name: '闲置',
                code: '1'
            },
            {
                name: '已售',
                code: '2'
            },
            {
                name: '使用',
                code: '4'
            }
        ]
        parkSpaceType: any = [
            {
                name: '地面',
                code: '1'
            },
            {
                name: '地下',
                code: '2'
            },
            {
                name: '人防',
                code: '3'
            }
        ]
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
            {
                name:'其他',
                code:'5'
            }
        ]
        parkSpaceInfoSelect: any = {
            areaStart: null,
            areaEnd: null,
            typeCode: null,
            statusCode: null,
            keyWords: null

        }
        packSpaceId:string=''
        addParkSpace: any = {
            area: '',
            code: '',
            parkingId: '',
            planId: '',
            rentedTimeEnd: '',
            rentedTimeStart: '',
            statusCode: '1',
            typeCode: ''
        }
        formHeight: number = 1040;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 0,
        };
        addParkVisible: boolean = false
        imageUrl: string = ''
        viewImageVisible: boolean = false
        parkManageFalg: boolean = false
        editParkVisible: boolean = false
        parkingDeteal: any = []
        rdName: string = ''

        subFlag: boolean = true

        created(): void {
            this.getTree()
        }

        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let searchline = refs.searchline.clientHeight;
            let middleline = refs.middleline.clientHeight + 26;
            this.formHeight = maxHeight - searchline - middleline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }
        goToHouse(){
            this.$router.push( 'houseProperty')
        }
        closeHover1() {
            this.calcHover = false
        }
        openAddParkDialog() {
            let rdCode=this.buildingTree.find(x=>x.id===this.parking.rdId).code
            let parkSpace=this.parking.code
            this.parkSpaceCodeFor=`${rdCode}-${parkSpace}`
            this.getPersonNameList()
            this.addParkVisible = true
        }
        openParkSpaceDetail(id){
            this.packSpaceId=id
            this.parkSpaceDetailFlag=true
        }
        closeAddParkDialog() {
            this.addParkVisible = false
            this.addParkSpace = {
                area: '',
                code: '',
                parkingId: '',
                planId: '',
                rentedTimeEnd: '',
                rentedTimeStart: '',
                statusCode: '1',
                typeCode: ''
            }
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getParkingSpaceList()
        }
        parkInfoClose(){
            this.getTree()
        }
        parkManage() {
            this.parkManageFalg = true
        }

        closeTable() {
            this.parkManageFalg = false;
            this.getTree()
        }
        closeParkSpaceDetailTable(){
            this.parkSpaceDetailFlag=false
        }
        closeManageTypeBox(){
            this.resentInfo()
        }

        resentInfo() {
            this.parkSpaceInfoSelect = {
                areaStart: null,
                areaEnd: null,
                typeCode: null,
                statusCode: null,
                keyWords: null
            }
            this.getPage()
        }
        openAddPArkSpaceInfo(){
                this.calcHover = !this.calcHover
        }
        handleChange(date) {
            this.addParkSpace.rentedTimeStart = date[0]
            this.addParkSpace.rentedTimeEnd = date[1]
        }

        handleChangeEdit(date) {
            this.parkSpaceDeatilInfo.rentedTimeStart = date[0]
            this.parkSpaceDeatilInfo.rentedTimeEnd = date[1]
        }

        openManagemengType(){
            let refs:any = this.$refs;
            refs.manageType.openManageTypeDialog(this.parking)
        }
        openRoomImage(row) {
            let src:string = row.planId ? this.$imgDownUrl() + `${row.planId}` : null;
            if (src) {
                let refs:any = this.$refs;
                refs.viewMap.openMap(src)
            } else {
                this.$message.warning(`该车位暂无平面图！`)
            }
        }

        async codeLimit() {
            if (this.addParkSpace.code !== '') {
                let reg = /^[0-9]+$/
                let code=`${this.parkSpaceCodeFor}-${this.addParkSpace.code}`
                let {data} = await api.getPackingSpaceByCode(code,this.pardId,this.parking.rdId)
                this.parkSpaceCode = data
                if (!reg.test(this.addParkSpace.code)) {
                    this.$message.warning('请输入数字')
                    this.addParkSpace.code = ''
                } else {
                    if (this.parkSpaceCode.length !== 0) {
                        this.$message.warning('该车位编号已存在，请重新输入')
                        this.addParkSpace.code = ''
                    }
                }
            }
        }

        //组织树
        async getTree() {
            try{
                let {data} = await api.getTree()
                data.forEach(item => {
                    item.level = 1
                    item.expand = false
                })
                this.buildingTree = JSON.parse(JSON.stringify(data).replace(/packingLots/g, 'children'));

                if(data.length!==0)
                {
                    if(this.communtityId===''&&this.pardId===''){
                        this.communtityId=data[0].id
                        this.buildingTree[0].expand = true
                    }
                    else if(this.pardId!==''){
                        this.buildingTree.find(x => x.id === this.parking.rdId).expand=true
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

        //查询停车场详细信息
        async getParkingDetialInfo() {
            let {data} = await api.getParkingDetialInfo(this.pardId)
            this.parkingDeteal = data
            this.rdName = this.buildingTree.find(x => x.id === this.parkingDeteal.rdId).name
        }
        //查询停车场列表
        async getParkingLIst(){
            let {data} =await api.getParkInfo(this.parking.rdId)
            this.parkingList=data
        }
        //查询车位列表信息
        async getParkingSpaceList() {
            this.loading = true
            if (this.parkSpaceInfoSelect.areaStart === '') {
                this.parkSpaceInfoSelect.areaStart = null
            }
            if (this.parkSpaceInfoSelect.areaEnd === '') {
                this.parkSpaceInfoSelect.areaEnd = null
            }
            if (this.parkSpaceInfoSelect.statusCode === '') {
                this.parkSpaceInfoSelect.statusCode = null
            }
            let {data} = await api.getParkingSpaceList(
                this.pages.pageNum + '',
                this.pages.pageSize + '',
                this.pardId,
                this.parkSpaceInfoSelect.areaStart,
                this.parkSpaceInfoSelect.areaEnd,
                this.parkSpaceInfoSelect.typeCode,
                this.parkSpaceInfoSelect.statusCode,
                this.parkSpaceInfoSelect.keyWords)
            this.pages.totalElements = data.totalElements
            this.parkSpace = data.content
            this.loading = false
        }

        //添加车位
        async addparkSpaceInfo() {
            if(this.subFlag){
                this.subFlag = false
                this.addParkSpace.parkingId = this.pardId
                this.addParkSpace.typeCode=this.parkingDeteal.typeCode
                if (this.addParkSpace.statusCode !== '3'||this.addParkSpace.rentedTimeStart==='') {
                    this.addParkSpace.rentedTimeStart = null
                    this.addParkSpace.rentedTimeEnd = null
                }
                let limit = {
                    "code": '车位编号',
                    "statusCode": '车位状态',
                }
                if (this.$utils.isntNull(this.addParkSpace, limit)) {
                    this.addParkSpace.code=`${this.parkSpaceCodeFor}-${this.addParkSpace.code}`
                        try {
                            await api.addIdleParkSpaceInfo(this.addParkSpace)
                            this.$message.success('添加成功')
                            this.addParkVisible = false
                            this.resentInfo()
                            this.closeAddParkDialog()
                        } catch (e) {
                            this.$message.error('添加失败')}
                }
                this.subFlag = true
            }
        }

        //查询车位详细信息
        async getParkSpaceById(id) {
            let {data} = await api.getParkSpaceById(id)
            this.parkSpaceDeatilInfo = data
            this.leaseTrem = [this.parkSpaceDeatilInfo.rentedTimeStart, this.parkSpaceDeatilInfo.rentedTimeEnd]
        }

        //编辑车位信息
        async updateParkSpaceInfo() {
            if(this.subFlag){
                this.subFlag = false
                if (this.parkSpaceDeatilInfo.statusCode !== '3'||this.parkSpaceDeatilInfo.rentedTimeStart==='') {
                    this.parkSpaceDeatilInfo.rentedTimeStart = null
                    this.parkSpaceDeatilInfo.rentedTimeEnd = null
                }
                let limit = {
                    "code": '车位编号',
                    "statusCode": '车位状态',
                }
                if (this.$utils.isntNull(this.parkSpaceDeatilInfo, limit)) {
                        try {
                            await api.updateParkSpaceInfo(this.parkSpaceDeatilInfo)
                            this.$message.success('修改成功')
                            this.editParkVisible = false
                            this.resentInfo()
                        } catch (e) {
                            this.$message.success('修改失败')
                        }
                }
                this.subFlag = true
            }
        }



        //查询业主姓名列表
        async getPersonNameList() {
            let {data} = await api.getPersonNameList(this.parking.rdId)
            this.personNameLIst = data
        }

        //删除车位
        async deleteParkSpaceInfo(id) {
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
                await api.deleteParkSpaceInfo(ids)
                this.$message.success('删除成功')
                this.parkSpaceInfoSelect = {
                    areaStart: null,
                    areaEnd: null,
                    typeCode: null,
                    statusCode: null,
                    keyWords: null
                }
                if(this.parkSpace.length===1&&(this.pages.pageNum>1)){
                    this.pages.pageNum--
                }
                this.getParkingSpaceList()
            } catch (e) {
                this.$message.error('删除失败')
            }
        }


        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        get imgportadd() {
            return this.addParkSpace.planId ? this.$imgDownUrl() + `${this.addParkSpace.planId}` : null
        }
        get imgport() {
            return this.parkSpaceDeatilInfo.planId ? this.$imgDownUrl() + `${this.parkSpaceDeatilInfo.planId}` : null
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
                        this.addParkSpace.planId = id;
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
                        this.parkSpaceDeatilInfo.planId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                    (<HTMLInputElement>document.getElementById('editupload')).value='';
                }, 200);
            }
        }

        openRdView() {
            let refs: any = this.$refs;
            refs.viewImage.openRdView(this.parkingDeteal.name,this.parkingDeteal.planId);
        }
        uploadSuccess(pid:string,load:any){
            if(this.subFlag){
                this.subFlag = false
                this.parkingDeteal.planId = pid;
                api.updateParkingInfo(this.parkingDeteal).then(()=>{
                    this.subFlag = true
                    this.$message.success(`上传成功！`)
                    load.close()
                }).catch(e =>{
                    this.subFlag = true
                    this.$message.error(`上传失败,${e}`)
                    load.close()
                })
            }
        }

         deleteImg(){
            this.parkingDeteal.planId = '';
            api.updateParkingInfo(this.parkingDeteal).then(()=>{
                this.$message.success(`删除成功！`)
            }).catch(e =>{
                this.$message.error(`删除失败,${e}`)
            })
        }
        closeAddSomeParkSpace(){
            this.addSomeParkFlag=false
            this.getParkingSpaceList()
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #parking {
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
                    height: 96px;
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
                                padding-top: 20px;

                                .detial {
                                    margin-right: 45px;
                                    display: inline-flex;
                                    align-items: center;
                                    &:last-child {
                                        margin-right: 0;
                                    }

                                    .iconche1 {
                                        font-size: 12px;
                                        color: #289ef9;
                                    }

                                    .iconmianji {
                                        color: #ffc848;
                                    }

                                    .iconweizhi {
                                        color: #3a7ef3;
                                        font-size: 11px;
                                    }

                                    .iconpingmiantu {
                                        color: #33c8b4
                                    }

                                    .iconmiaoshu {
                                        font-size: 12px;
                                        color: #abbfd3;
                                    }

                                    .item {
                                        color: #7c8185;
                                        padding-left: 8px;
                                    }
                                }
                            }
                        }

                        .rightInfo {
                            color: #3a7ef3;
                            display: flex;
                            align-items: center;
                            cursor: pointer;

                            .iconfont{
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
                        width: 950px;
                    }

                    .margin {
                        margin-right: 15px;
                        margin-bottom: 20px;
                        flex: none
                    }

                    .marginItem {
                        margin-bottom: 15px;

                        .item {
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
                i{
                    color: #3a7ef3;
                    cursor: pointer;
                }
            }
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
            width: 80px;
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

    .avatar-uploader1 {
        display: inline-block;
    }
    .fontSombal{
        color: #ff4040;
    }
</style>
<style lang="scss">
    #parking {
        .ivu-tree li ul {
            padding: 0;

            .iconche1 {
                padding-left: 18px;
            }

            .ivu-tree-arrow {
                width: 0;
            }
        }
    }
</style>

