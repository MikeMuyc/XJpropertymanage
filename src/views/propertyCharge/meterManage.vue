<template>
    <div id="calcCharge" >
        <div class="thTitle" ref="thTitle">
            <i class="line"></i>抄表管理
        </div>
        <div class="viewbox" ref="viewbox">
            <div v-if="buildingTree.length === 0" class="viewboxMain empty">
                <img src="@manage/images/暂无2.png" >
                <br>
                <p>暂无数据，请先至 <i @click="$router.push({name:'房产信息'})">房产信息</i> 处添加小区</p>
            </div>
            <div v-else class="viewboxMain">
                <!--<div class="leftTree">
                    <Input type="search" placeholder="搜索"></Input>
                    <vue-perfect-scrollbar
                            style="height:calc(100% - 48px);margin-top: 10px;padding-right: 15px">
                        <Tree
                                class="buildingTree"
                                ref="tree"
                                :data="buildingTree"
                                :render="renderContent"
                                @on-toggle-expand="treeExpand"
                        >
                        </Tree>
                    </vue-perfect-scrollbar>
                </div>-->
                <buildingTree @inited="inited"></buildingTree>
                <div class="borderRight"></div>
                <div v-show="curObject.id" class="rightMain" ref="rightMain">
                    <div class="searchline" ref="searchline">
                        <mixSelect
                                class="margin"
                                v-model="feeFinished"
                                :selectList="feeFinishedList"
                                labelName="name"
                                valueName="id"
                                placeholder="收费状态"
                                style="width: 140px"
                                @sentItem="feeProjrctType"
                        >
                        </mixSelect>
                        <div class="margin">
                            录入时间：
                            <DatePicker
                                    v-model="dateArea"
                                    type="daterange"
                                    format="yyyy-MM-dd"
                                    placeholder="开始时间  ~  结束时间"
                                    style="width: 200px"
                                    @on-change="setDate"
                            >
                            </DatePicker>
                        </div>
                        <div class="margin" style="display: flex">
                            <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px" @enter="getPage()" v-model="keyword"></Input>
                            <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                                <i class="iconfont iconsousuo"></i>搜索
                            </div>
                            <div class="pmbtn" @click="resetInfo">
                                <i class="iconfont iconzhongzhi"></i>重置
                            </div>
                        </div>

                        <div class="pmbtn" @click="calcHover2 = !calcHover2" v-clickoutside="closeHover2">
                            走表录入
                            <div class="btnSelection" :class="{active:calcHover2 === true}">
                                <div class="selItem" @click="openMeter">当前房间</div>
                                <div class="selItem">批量导入</div>
                            </div>
                        </div>
                    </div>
                    <el-table
                            :data="meterTable"
                            stripe
                            class="myWisdomTable"
                            :height="formHeight"
                            v-loading="loading"
                    >
                        <template slot="empty" >
                            <img src="@manage/images/暂无数据.png">
                            <br>
                            暂无内容
                        </template>
                        <el-table-column
                                prop="meterCode"
                                label="表编码"
                                width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="projectName"
                                label="收费项目"
                                min-width="100px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="chargingDate"
                                label="收费年月"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="lastMeterReading"
                                label="上月抄表读数"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="lastReadingDate"
                                label="上月抄表日期"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="currentMeterReading"
                                label="本月抄表读数"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="currentReadingDate"
                                label="本月抄表日期"
                                min-width="120px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                label="是否转表"
                                min-width="90px"
                                show-overflow-tooltip
                        >
                            <template slot-scope="{row,$index}">
                                <div v-if="row.meterTurn===0" style="color:#7c8185">否</div>
                                <div v-else-if="row.meterTurn===1" style="color:#ff9900">是</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="是否换表"
                                min-width="90px"
                                show-overflow-tooltip
                        >
                            <template slot-scope="{row,$index}">
                                <div v-if="row.meterChange===0" style="color:#7c8185">否</div>
                                <div v-else-if="row.meterChange===1" style="color:#ff9900">是</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="totalMeterReading"
                                label="用量"
                                min-width="70px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                prop="meterFee"
                                label="收费金额(元)"
                                min-width="100px"
                        >
                        </el-table-column>
                        <el-table-column
                                prop=""
                                label="抄表状态"
                                min-width="100px"
                                show-overflow-tooltip
                        >
                            <template slot-scope="{row,$index}">
                                <div v-if="row.feeFinished===0" style="color:#7c8185">未收费</div>
                                <div v-else-if="row.feeFinished===1" style="color:#ff2c2c">已收费</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="createTime"
                                label="录入时间"
                                min-width="170px"
                                show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="100px"
                        >
                            <template slot-scope="{row}">
                                <div class="tableEdit">
                                    <div class="item" v-if="row.feeFinished===0" @click="showEdit(row)">编辑</div>
                                    <div class="item" v-if="row.feeFinished===1" @click="showDetail(row)">查看</div>
                                    <div v-if="row.feeFinished===0" class="item delete" @click="deleteFee([row.id])">
                                        删除
                                    </div>
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
                <div v-show="curObject.id === ''" class="rightMain empty">
                    <img src="@manage/images/暂无1.png" alt="">
                    <p>请在左侧选择一个房间</p>
                </div>
            </div>

        </div>

        <meterWatch ref="meterWatch" @success="resetInfo" :roomObj="curObject"></meterWatch>

        <el-dialog
                :visible.sync="detailShow"
                custom-class="emDialog"
                top="6vh"
                width="560px"
                @close="closeDetail"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                抄表记录
            </div>
            <div class="meterModalContent">
                <div class="aline">
                    <div class="label">房间代码</div>
                    <div class="info">
                        <Input :disabled="true" v-model="curObject.title"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">表编码</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.meterCode"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">收费项目</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.projectName"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">收费标准</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.standardName"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">收费年月</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.chargingDate"></Input>
                    </div>
                </div>

                <div class="aline">
                    <div class="label">上次抄表读数</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.lastMeterReading" type="float"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">上次抄表日期</div>
                    <div class="info">
                        <Input v-model="MeterData.lastReadingDate" :disabled="true"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">本次抄表读数</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.currentMeterReading" type="float"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">本次抄表日期</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.currentReadingDate" type="float"></Input>
                    </div>
                </div>

                <div class="aline">
                    <div class="label">是否转表</div>
                    <div class="info">
                        <RadioGroup  v-model="MeterData.meterTurn">
                            <Radio :label="1" :disabled="true">是</Radio>
                            <Radio :label="0" :disabled="true">否</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">是否换表</div>
                    <div class="info">
                        <RadioGroup v-model="MeterData.meterChange">
                            <Radio :label="1" :disabled="true">是</Radio>
                            <Radio :label="0" :disabled="true">否</Radio>
                        </RadioGroup>
                    </div>
                </div>

                <div class="aline" v-if="MeterData.meterChange === 1">
                    <div class="label">旧表终止数</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.oldMeterReading" type="float"></Input>
                    </div>
                </div>
                <div class="aline" v-if="MeterData.meterChange === 1">
                    <div class="label">新表起始数</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.newMeterReading" type="float"></Input>
                    </div>
                </div>
                <div class="aline" style="margin-bottom: 0">
                    <div class="label">备注信息</div>
                    <div class="info">
                        <textarea :disabled="true" style="width: 100%" v-model="MeterData.description"></textarea>
                    </div>
                </div>
            </div>
            <div slot="footer"></div>
        </el-dialog>
        <el-dialog
                :visible.sync="editShow"
                custom-class="emDialog"
                top="6vh"
                width="560px"
                @close="closeDetail"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改录入
            </div>
            <div class="meterModalContent">
                <div class="aline">
                    <div class="label">房间代码</div>
                    <div class="info">
                        <Input :disabled="true" v-model="curObject.title"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">表编码</div>
                    <div class="info">
                        <Input :disabled="true" v-model="MeterData.meterCode"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">收费项目</div>
                    <div class="info">
                        <mixSelect
                                v-model="MeterData.projectId"
                                :selectList="projectList"
                                labelName="name"
                                valueName="id"
                                placeholder="收费项目"
                                @sentItem="getStandard"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">收费标准</div>
                    <div class="info">
                        <mixSelect
                                :disabled="MeterData.projectId === ''"
                                v-model="MeterData.psId"
                                :selectList="standardList"
                                labelName="name"
                                valueName="id"
                                placeholder="收费标准"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">收费年月</div>
                    <div class="info">
                        <DatePicker type="month"
                                    placeholder="收费年月"
                                    style="width: 100%;"
                                    v-model="payEndDate"
                                    @on-change="payDate">
                        </DatePicker>
                    </div>
                </div>

                <div class="aline">
                    <div class="label">上次抄表读数</div>
                    <div class="info">
                        <Input type="float" v-model="MeterData.lastMeterReading" :disabled="true"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">上次抄表日期</div>
                    <div class="info">
                        <Input v-model="MeterData.lastReadingDate" :disabled="true"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">本次抄表读数</div>
                    <div class="info">
                        <Input  v-model="MeterData.currentMeterReading" type="float"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">本次抄表日期</div>
                    <div class="info">
                        <DatePicker
                                v-model="thisDate"
                                type="date"
                                placeholder="请选择"
                                style="width: 100%;"
                                @on-change="thisMonth">
                        </DatePicker>
                    </div>
                </div>

                <div class="aline">
                    <div class="label">是否转表</div>
                    <div class="info">
                        <RadioGroup v-model="MeterData.meterTurn">
                            <Radio :label="1" :disabled="true">是</Radio>
                            <Radio :label="0" :disabled="true">否</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">是否换表</div>
                    <div class="info">
                        <RadioGroup @on-change="meterChageEvent" v-model="MeterData.meterChange">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </div>
                </div>

                <div class="aline" v-if="MeterData.meterChange === 1">
                    <div class="label">旧表终止数</div>
                    <div class="info">
                        <Input v-model="MeterData.oldMeterReading" type="float"></Input>
                    </div>
                </div>
                <div class="aline" v-if="MeterData.meterChange === 1">
                    <div class="label">新表起始数</div>
                    <div class="info">
                        <Input v-model="MeterData.newMeterReading" type="float"></Input>
                    </div>
                </div>
                <div class="aline" style="margin-bottom: 0">
                    <div class="label">备注信息</div>
                    <div class="info">
                        <textarea style="width: 100%" v-model="MeterData.description"></textarea>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="setMeterWatch">确定</div>
                <div class="pmbtn" @click="closeDetail">取消</div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator"
    import { Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import chargeList from './chargeList.vue';
    import calcChargeGroup from './components/calcChargeGroup.vue';
    import meterWatch from './components/meterWatch.vue';
    import * as api from '@manage/api/propertyCharge/calcCharge'
    import buildingTree from './components/buildingTreeLevel3.vue'
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
            chargeList,
            calcChargeGroup,
            meterWatch,
            buildingTree
        }
    })

    export default class mainView extends Vue {

        meterTable: any = []
        feeFinishedList: any = [
            {
                name: '全部',
                id: ''
            },
            {
                name: '已收费',
                id: '1'
            },
            {
                name: '未收费',
                id: '0'
            }
        ];

        feeFinished: string = ''
        startTime: string = ''
        endTime: string = ''
        keyword: string = ''

        curObject: any = {
            id: '',
        }
        dateArea: any = [];
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
                        treeActive: this.curObject.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 3) {
                                this.curObject = data;
                                setTimeout(()=>{
                                    this.setPagesize();
                                    this.resetInfo();
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

        buildingTree: any = [{}]

        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 10,
        };
        loading: boolean = false;


        calcHover2: boolean = false;

        detailShow: boolean = false;
        editShow: boolean = false;
        MeterData: any = {
            roomId: '',
            roomName:'',
            meterCode: '',
            projectId: '',
            psId: '',

            chargingDate:'',
            lastMeterReading: 0,
            lastReadingDate: '2020-1-15',
            currentMeterReading: 0,
            currentReadingDate: '',
            meterTurn: 0,
            meterChange: 0,
            oldMeterReading: 0,
            newMeterReading: 0,
            description: '',
        };

        projectList:any =[];
        standardList:any =[];
        payEndDate:any = '';
        thisDate:any = '';
        setDate(val) {
            this.startTime = val[0];
            this.endTime = val[1]
        }


        mounted() {
            //this.gethouseData1();
        }
        inited(curObj:any){
            this.curObject = curObj;
            setTimeout(()=>{
                this.setPagesize();
                this.resetInfo();
            },200)
        }
        setPagesize(){
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let searchline = refs.searchline.clientHeight;

            //Page组件高度为53px，rightTitle:46,middleline:152
            this.formHeight = maxHeight - searchline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        //查询房间走表数据
        async getData() {
            this.loading = true;
            try {
                let {data: {content, totalElements}} = await api.getMeterreading({
                    pageNum: this.pages.pageNum,
                    pageSize: this.pages.pageSize,
                    endTime: this.endTime,
                    startTime: this.startTime,
                    roomId: this.curObject.id,
                    feeFinished: this.feeFinished
                })
                this.meterTable = content
                this.pages.totalElements = totalElements
                this.loading = false
            } catch (e) {
                this.loading = false
            }

        }


        resetInfo() {
            this.startTime = ''
            this.endTime = ''
            this.keyword = ''
            this.feeFinished = ''
            this.dateArea = [];

            this.getPage();
        }


        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getData();
        }

        feeProjrctType() {

        }


        closeHover2() {
            this.calcHover2 = false
        }


        openMeter() {
            let refs: any = this.$refs;
            refs.meterWatch.openMeter();
        }


        //结构树
        async gethouseData1() {
            try{
                let {data} = await api.getTree(0)
                data.forEach(item => {
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

        treeExpand(data) {
            this.gethouseData(data, true)
        }

        async gethouseData(obj: any, bl?: boolean) {
            let {data} = await api.getTree(obj.level, obj.id);

            if (data) {
                obj.children = data;
            }
            if (obj.level === 1) {
                obj.children.forEach(item => {
                    item.rdId = obj.id;
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


        //删除
        async deleteFee(ids) {
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

            try {
                await api.deletemeter(ids)
                this.resetInfo()
                this.$message.success('删除成功')
            } catch (e) {
                this.$message.error('删除失败')
            }
        }

        //查询项目
        async getProjectList(id) {
            let {data} = await api.getProjectList('', '2', id)
            this.projectList = data
        }

        //查询标准
        async getStandard(item) {
            let {data} = await api.getStandard(item.id)
            this.standardList = data;
        }
        async showDetail(row) {
            let {data} = await api.meterDetail(row.id);
            this.MeterData = data;
            this.detailShow = true;
        }
        async showEdit(row) {
            let {data} = await api.meterDetail(row.id);
            this.MeterData = data;
            this.payEndDate = data.chargingDate;
            this.thisDate = data.currentReadingDate
            this.getProjectList(row.rdId);
            this.getStandard({id:data.projectId})
            this.editShow = true;
        }

        async setMeterWatch(){
            await api.updateemeter(this.MeterData);
            this.closeDetail();
            this.getData();
            this.$message.success(`修改成功！`)
        }
        meterChageEvent(){
            if (this.MeterData.meterChange === 0) {
                this.MeterData.oldMeterReading = '';
                this.MeterData.newMeterReading = '';
            }
        }
        payDate(month) {
            this.MeterData.chargingDate = `${month}`;
            console.log(this.MeterData)
        }
        thisMonth(month) {
            this.MeterData.currentReadingDate = month;
        }

        closeDetail() {
            this.detailShow = false;
            this.editShow = false;
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #calcCharge {


        .viewbox {
            padding-top: 15px;
            height: calc(100% - 60px);
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
            }

            .rightMain {
                width: calc(100% - 196px);
                height: 100%;
                padding: 0 5px 0 20px;
                overflow: hidden;

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


    }



    .meterModalContent{
        .aline {
            .label {
                width: 100px;
            }
        }
        textarea:disabled{
            background-color: #f8f9fc;
        }
    }
    .iconzhushi {
        color: $warning-color;
        font-size: 14px;
        margin-right: 8px;
    }
</style>

