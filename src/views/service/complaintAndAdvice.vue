<template>
    <div id="complaintAndAdvice">
        <tabNav :tabList="tabList" @tabChange="tabChange"></tabNav>
        <transition name="leftSlide">
            <div class="viewbox" ref="viewbox" v-show="tabName === '居民投诉'">
                <div class="searchline" ref="searchline">
                    <div class="left">
                        <mixSelect
                                v-model="pages.complaintTypeCode"
                                class="margin"
                                :selectList="typeList"
                                labelName="name"
                                valueName="code"
                                placeholder="全部类型"
                                style="width: 120px"
                        >
                        </mixSelect>
                        <mixSelect
                                v-model="pages.disposeTypeCode"
                                class="margin"
                                :selectList="stateList"
                                labelName="name"
                                valueName="code"
                                placeholder="全部状态"
                                style="width: 120px"
                        >
                        </mixSelect>

                        <div class="margin">
                            <i class="item">投诉时间</i>
                            <DatePicker
                                    type="daterange"
                                    format="yyyy-MM-dd"
                                    placeholder="开始时间   ~   结束时间"
                                    style="width: 200px;"
                                    ref="timelist"
                                    @on-change="timesChange"
                            ></DatePicker>
                        </div>

                        <div class="margin">
                            <Input placeholder="请输入投诉人/房间" v-model="pages.keyword"
                                   style="width: 200px;margin-right: 15px"></Input>
                            <div class="pmbtn primary" @click="getPage()" style="margin-right: 15px">
                                <i class="iconfont iconsousuo"></i>搜索
                            </div>
                            <div class="pmbtn" @click="reset">
                                <i class="iconfont iconzhongzhi"></i>重置
                            </div>
                        </div>
                    </div>

                    <div class="item" style="margin-bottom: 20px">
                        <div class="pmbtn primary" style="margin-right: 15px" @click="addComplaintDialog=true">
                            <i class="iconfont icontianjia"></i>
                            新增投诉
                        </div>
                        <div class="pmbtn" @click="openTypeManagement">
                            <i class="iconfont iconbianji"></i>
                            类型管理
                        </div>
                    </div>
                </div>
                <el-table
                        :data="complaintList"
                        stripe
                        v-loading="loading"
                        class="myWisdomTable"
                        :height="formHeight"

                >
                    <template slot="empty">
                        <img src="@manage/images/暂无数据.png">
                        <br>
                        暂无内容
                    </template>
                    <el-table-column
                            label="序号"
                            width="60px"
                            align="center"
                    >
                        <template slot-scope="{row,$index}">
                            {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="complaintTime"
                            label="投诉时间"
                            min-width="170px"
                            show-overflow-tooltip
                    >
                    </el-table-column>

                    <el-table-column
                            prop="complaintTypeCode"
                            label="投诉类型"
                            min-width="100px"
                            align="center"
                            show-overflow-tooltip
                    >
                        <template slot-scope="{row}">
                            {{complaintTypeChange(row.complaintTypeCode)}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="complaintContext"
                            label="描述"
                            min-width="200"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="anonymous"
                            label="投诉方式"
                            min-width="120px"
                            align="center"
                            show-overflow-tooltip
                    >
                        <template slot-scope="{row}">
                            {{row.anonymous == 0 ? `公开` : `匿名`}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="roomName"
                            label="房间代码"
                            min-width="150px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="投诉人"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="contactTel"
                            label="联系方式"
                            min-width="170px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="disposeTypeCode"
                            label="状态"
                            align="center"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                        <template slot-scope="{row}">
                            <i v-if="row.disposeTypeCode == 0" style="color: #ff2c2c;">{{disposeTypeChange(row.disposeTypeCode)}}</i>
                            <i v-else-if="row.disposeTypeCode == 1" style="color: #7c8185;">{{disposeTypeChange(row.disposeTypeCode)}}</i>
                            <i v-else-if="row.disposeTypeCode == 2" style="color: #e6a23c;">{{disposeTypeChange(row.disposeTypeCode)}}</i>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="100px"
                    >
                        <template slot-scope="{row}">
                            <div class="tableEdit">
                                <div class="item" v-if="row.disposeTypeCode == 0" @click="openDisposeDetails(row)">处理
                                </div>
                                <div class="item" v-if="row.disposeTypeCode == 1" @click="openDisposeDetails(row)">详情
                                </div>
                                <!--<div class="item delete" @click="deleteComplaintDetail(row)">删除</div>-->
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
        </transition>
        <transition name="rightSlide">
            <advice v-show="tabName === '意见反馈'" :tabName="tabName" :typeList="typeList" :stateList="stateList"></advice>
        </transition>

        <el-dialog
                :visible.sync="addComplaintDialog"
                custom-class="emDialog"
                width="600px"
                top="8vh"
                :close-on-click-modal="false"
                @close="closeAddComplaint"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增投诉
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">投诉方式</div>
                    <div class="info">
                        <RadioGroup v-model="addObject.anonymous">
                            <Radio :label="0" style="margin-right: 40px">公开</Radio>
                            <Radio :label="1">匿名</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">投诉类型</div>
                    <div class="info">
                        <mixSelect
                                v-model="addObject.complaintTypeCode"
                                class="margin"
                                :selectList="typeList"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">房间代码</div>
                    <div class="info" style="justify-content: space-between">
                        <mixSelect
                                :selectList="communityList"
                                labelName="title"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择小区"
                                style="width: 130px"
                                @sentItem="gethouseData">
                        </mixSelect>
                        <mixSelect
                                :selectList="buildingList"
                                labelName="title"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择楼栋"
                                style="width: 130px"
                                @sentItem="gethouseData">
                        </mixSelect>
                        <mixSelect
                                v-model="addObject.roomId"
                                :selectList="houseList"
                                labelName="title"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择房间"
                                style="width: 130px">
                        </mixSelect>
                    </div>
                </div>
                <div v-if="addObject.anonymous === 0" style="margin-bottom: 15px;">
                    <div class="aline">
                        <div class="label">客户姓名</div>
                        <div class="info">
                            <Input placeholder="请输入" style="width: 100%" v-model="addObject.name"></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">联系方式</div>
                        <div class="info">
                            <Input placeholder="请输入" style="width: 100%" v-model="addObject.contactTel"></Input>
                        </div>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">详情描述</div>
                    <div class="info">
                        <textarea placeholder="请输入" style="width: 100%" v-model="addObject.complaintContext"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">上传图片</div>
                    <div class="info upfilelist">

                        <div class="upfilebox" v-for="(item,index) in addObject.complaintAttachments">
                            <img :src="imgportadd(item)">
                            <div class="delete" @click="deleteUplist(index)">删除</div>
                        </div>
                        <label class="upfile" for="addupload" style="width: 70px;height: 70px">
                            <i class="icontianjia iconfont"></i>
                        </label>
                        <input type="file" accept="image/*" id="addupload" @change="upAddImg">
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="AddComplaint">确定</div>
                <div class="pmbtn" @click="closeAddComplaint">取消</div>
            </div>
        </el-dialog>
        <typeManage ref="typeManage"></typeManage>
        <el-dialog
                :visible.sync="disposeDetailsDialog"
                custom-class="emDialog"
                width="700px"
                top="8vh"
                :close-on-click-modal="false"
                @close="closeDisposeDetails"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                {{detailObj.disposeTypeCode == 0 ? `处理` : `详情`}}
            </div>
            <div class="disposeContent">
                <div class="aline">
                    <div style="font-weight: bolder; font-size: 15px;">投诉内容</div>
                </div>
                <div class="aline">
                    <div style="display: flex;width: 50%">
                        <div class="leftTitle">投诉类型</div>
                        <div>{{complaintTypeChange(detailObj.complaintTypeCode)}}</div>
                    </div>
                    <div style="display: flex">
                        <div class="leftTitle">投诉时间</div>
                        <div>{{detailObj.complaintTime}}</div>
                    </div>
                </div>
                <div class="aline">
                    <div style="display: flex;width: 50%">
                        <div class="leftTitle">客户姓名</div>
                        <div>{{detailObj.name}}</div>
                    </div>
                    <div style="display: flex">
                        <div class="leftTitle">房间代码</div>
                        <div>{{detailObj.roomName}}</div>
                    </div>
                </div>
                <div class="aline">
                    <div style="display: flex;width: 50%">
                        <div class="leftTitle">联系方式</div>
                        <div>{{detailObj.contactTel}}</div>
                    </div>
                </div>
                <div class="aline">
                    <div class="leftTitle" style="flex: none">内容描述</div>
                    <div class="info">{{detailObj.complaintContext}}</div>
                </div>
                <div class="aline">
                    <div class="leftTitle" style="flex: none;width: 56px"></div>
                    <div class="info upfilelist">
                        <div class="upfilebox" v-for="(item,index) in detailObj.complaintAttachments">
                            <img :src="imgportadd(item)">
                        </div>
                    </div>
                </div>
                <div class="border"></div>
                <div class="aline">
                    <div style="font-weight: bolder; font-size: 15px;">处理结果</div>
                </div>
                <div class="aline" v-if="detailObj.disposeTypeCode == 0">
                    <div class="leftTitle" style="flex: none">填写结果</div>
                    <textarea v-model="disposeResult" style="width: 100%"></textarea>
                </div>
                <div v-else-if="detailObj.disposeTypeCode == 1 && detailObj.complaintFeedback">
                    <div class="aline">
                        <div style="display: flex;width: 50%">
                            <div class="leftTitle">处理人</div>
                            <div>{{detailObj.complaintFeedback.disposePersonName}}</div>
                        </div>
                        <div style="display: flex">
                            <div class="leftTitle">处理时间</div>
                            <div>{{detailObj.complaintFeedback.feedbackTime}}</div>
                        </div>
                    </div>
                    <div class="aline">
                        <div style="display: flex">
                            <div class="leftTitle" style="flex: none">处理结果</div>
                            <div>
                                <div>
                                    {{detailObj.complaintFeedback.disposeResult || '无'}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="feedback">确定</div>
                <div class="pmbtn" @click="closeDisposeDetails">取消</div>
            </div>
            <!-- <div slot="footer" >
                 <div class="pmbtn primary" @click="closeDisposeDetails">确定</div>
             </div>-->
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {Page, Icon, Spin, DatePicker, RadioGroup, Radio} from 'view-design'
    import {Tree} from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import advice from './complaintAndAdvice_advice.vue';
    import typeManage from './components/typeManagement.vue'
    import * as api from '@manage/api/serve/complaintAndAdvice'
    import * as app from '@manage/api/app'

    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            tabNav,
            mixSelect,
            Input,
            advice,
            RadioGroup,
            Radio,
            typeManage
        }
    })

    export default class complaintAndAdvice extends Vue {
        tabName: string = '居民投诉';
        tabList: Array<{ name: string }> = [
            {
                name: '居民投诉',
            },
            {
                name: '意见反馈',
            },
        ];
        typeList: Array<any> = [];
        stateList: Array<any> = [];

        communityList: Array<any> = [];
        buildingList: Array<any> = [];
        houseList: Array<any> = [];

        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
            complaintTypeCode: '',
            disposeTypeCode: '',
            keyword: '',
        };
        startTime: string = ''
        endTime: string = ''
        loading: boolean = false

        complaintList: Array<any> = []
        addObject: any = {
            typeCode: 1,
            complaintTypeCode: '',
            name: '',
            complaintContext: '',
            anonymous: 0,

            contactTel: '',
            roomId: '',
            complaintAttachments: [],
            complaintFeedback: {},
        }

        addComplaintDialog: boolean = false
        disposeDetailsDialog: boolean = false
        detailObj: any = {
            id: '',
            typeCode: 1,
            complaintTypeCode: '',
            name: '',
            complaintContext: '',
            anonymous: 0,
            complaintTime: '',
            contactTel: '',
            roomId: '',
            complaintAttachments: [],
            complaintFeedback: {},
        }
        disposeResult: string = '';
        subFlag: boolean = true;

        async getSelection(Array: string, name: string) {
            let data = await api.getSelection(name);
            this[`${Array}`] = data;
        }
        //结构树
        async gethouseData1() {
            try {
                let {data} = await api.getTree(0)
                this.communityList = data
            } catch (e) {
                this.communityList = [];
                this.buildingList = [];
                this.houseList = []
                this.$message.error(`获取小区数据失败！`)
            }
        }
        async gethouseData(obj: any) {
            try{
                let {data} = await api.getTree(obj.level, obj.id)
                if(obj.level === 1){
                    this.buildingList = data;
                    this.houseList = []
                }
                else if(obj.level === 2){
                    this.houseList = data;
                }
            }catch (e) {
                this.$message.error(`获取房间数据失败！`);
                this.buildingList = [];
                this.houseList = []
            }



        }
        mounted() {
            this.getSelection(`stateList`, `投诉处理状态`);
            this.getSelection(`typeList`, `投诉类型`);
            this.gethouseData1();
            this.$nextTick(() => {
                this.setPagesize();
                this.reset();
            })
        }

        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.viewbox.clientHeight - 15;
            let searchline = refs.searchline.clientHeight;

            //Page组件高度为53px
            this.formHeight = maxHeight - searchline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        tabChange(item: any) {
            this.tabName = item.name;
        }

        async getComplaintList() {
            this.loading = true
            let obj: any = {
                pageNum: this.pages.pageNum,
                pageSize: this.pages.pageSize,
                keyword: this.pages.keyword,
                typeCode: 1,
            }
            if (this.pages.complaintTypeCode) {
                obj.complaintTypeCode = this.pages.complaintTypeCode
            }
            if (this.pages.disposeTypeCode) {
                obj.disposeTypeCode = this.pages.disposeTypeCode
            }
            if (this.startTime) {
                obj.startTime = this.startTime
            }
            if (this.startTime) {
                obj.startTime = this.startTime
            }
            if (this.endTime) {
                obj.endTime = this.endTime
            }
            try {
                let {totalElements, content} = await api.getComplaintList(obj)
                this.pages.totalElements = totalElements
                this.complaintList = content
                this.loading = false

            } catch (e) {

            }
            this.loading = false
        }

        getPage(page?: number) {
            this.pages.pageNum = page || 1;
            this.getComplaintList()
        }

        reset() {
            this.pages.complaintTypeCode = ''
            this.pages.disposeTypeCode = ''
            this.startTime = '';
            this.endTime = '';
            this.pages.keyword = '';
            let timelist: any = this.$refs.timelist;
            timelist.handleClear();
            this.getPage();
        }

        async AddComplaint() {
            if (this.subFlag) {
                this.subFlag = false;
                try {
                    await api.addComplaint(this.addObject);
                    this.closeAddComplaint();
                    this.reset();
                    this.$message.success(`提交成功！`);
                } catch (e) {
                    this.$message.error(`操作失败！`);
                }
                this.subFlag = true
            }
        }

        closeAddComplaint() {
            this.addComplaintDialog = false;
            this.addObject = {
                typeCode: 1,
                complaintTypeCode: '',
                name: '',
                complaintContext: '',
                anonymous: 0,

                contactTel: '',
                roomId: '',
            }
        }

        openTypeManagement() {
            let refs: any = this.$refs;
            refs.typeManage.openTypeManage()
        }

        closeDisposeDetails() {
            this.disposeDetailsDialog = false;
            this.disposeResult = '';
        }


        async openDisposeDetails(row) {
            this.detailObj = await api.getComplaintDetail(row.id);
            this.disposeDetailsDialog = true
        }

        async feedback() {
            try{
                await api.feedbackComplaint({
                    "complaintId": this.detailObj.id,
                    "disposeResult": this.disposeResult,
                });
                this.closeDisposeDetails();
                this.reset();
                this.$message.success(`回复成功！`);
            }catch (e) {
                this.$message.error(`回复失败！`);
            }
        }

        deleteComplaintDetail(row){
            this.$confirm('确定要删除这条反馈吗?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try{
                    await api.deleteComplaintDetail([row.id]);
                    this.reset()
                    this.$message.success(`删除成功！`)
                }
                catch (e) {
                    this.$message.error(`删除失败！`)
                }
            }).catch(() => {

            });
        }

        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };

        imgportadd(src) {
            return src ? this.$imgDownUrl() + `${src}` : null
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
                        this.addObject.complaintAttachments.push(id);
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                    (<HTMLInputElement>document.getElementById('addupload')).value = '';
                }, 200);
            }
        }

        deleteUplist(index) {
            this.addObject.complaintAttachments.splice(index, 1);
        }

        complaintTypeChange(code) {
            let obj: any = this.typeList.find(item => item.code === code);
            return obj ? obj.name : `-`
        }

        disposeTypeChange(code) {
            let obj: any = this.stateList.find(item => item.code === code);
            return obj ? obj.name : `-`
        }

        timesChange(val) {
            this.startTime = val[0];
            this.endTime = val[1];
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #complaintAndAdvice {

        position: relative;

        .viewbox {
            padding-top: 15px;
            height: calc(100% - 60px);
            width: 100%;

            .searchline {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .left {
                    display: flex;
                }

                .margin {
                    margin-right: 15px;
                    margin-bottom: 20px;
                    display: flex;
                    flex: none;
                }

                .item {
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    flex: none;
                    margin-right: 15px;
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

        .disposeContent {
            .leftTitle {
                margin-right: 15px;
                color: #7c8185;
            }

            .img {
                width: 60px;
                height: 60px;
                background-color: #e1e1e1;
                border-radius: 4px;
                margin-right: 10px;
                margin-top: 10px;
            }

            .border {
                height: 0px;
                border: dashed 1px #dde4eb;
                margin: 20px 0;
            }
        }
    }

    .upfilelist {
        display: flex;
        width: 100%;

        .upfilebox {
            width: 70px;
            height: 70px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-right: 15px;
            margin-bottom: 10px;
            position: relative;

            &:hover {
                .delete {
                    display: inline-flex;
                }
            }

            .delete {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                display: none;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }
        .upfile{
            margin-right: 15px;
            margin-bottom: 10px;
        }
    }
</style>
