<template>
    <div id="communityActivity" >
        <div class="thTitle" ref="thTitle">
            <i class="line"></i>社区活动
        </div>
        <div class="viewbox" ref="viewbox">
            <div class="searchline" ref="searchline">
                <div class="left">
                    <mixSelect
                            v-model="pages.rdId"
                            class="margin"
                            :selectList="communityList"
                            labelName="title"
                            valueName="id"
                            placeholder=""
                            style="width: 158px"
                    >
                    </mixSelect>
                    <mixSelect
                            v-model="pages.statusCode"
                            class="margin"
                            :selectList="stateList"
                            labelName="name"
                            valueName="code"
                            placeholder="全部状态"
                            style="width: 140px"
                    >
                    </mixSelect>
                    <mixSelect
                            v-model="pages.typeCode"
                            class="margin"
                            :selectList="typeList"
                            labelName="name"
                            valueName="code"
                            placeholder="全部类型"
                            style="width: 140px"
                    >
                    </mixSelect>

                    <div class="margin">
                        <i class="item">活动时间段</i>
                        <DatePicker
                                type="daterange"
                                format="yyyy-MM-dd"
                                placeholder="开始时间   ~   结束时间"
                                style="width: 200px;"
                                @on-change="timesChange"
                                ref="timelist"
                        ></DatePicker>
                    </div>

                    <div class="margin">
                        <Input v-model="keyword" placeholder="请输入关键字" style="width: 200px;margin-right: 15px"></Input>
                        <div class="pmbtn primary" @click="getPage()" style="margin-right: 15px" >
                            <i class="iconfont iconsousuo"></i>搜索
                        </div>
                        <div class="pmbtn" @click="reset">
                            <i class="iconfont iconzhongzhi"></i>重置
                        </div>
                    </div>
                </div>

                <div class="item" style="margin-bottom: 20px">
                    <div class="pmbtn primary" style="margin-right: 15px" @click="addActivityShow=true">
                        <i class="iconfont icontianjia"></i>
                        新增活动
                    </div>
                    <div class="pmbtn" @click="openTypeManagement">
                        <i class="iconfont iconxitongshezhi"></i>
                        类型管理
                    </div>
                </div>
            </div>
            <el-table
                    :data="activityList"
                    stripe
                    v-loading="loading"
                    class="myWisdomTable"
                    :height="formHeight"
            >
                <template slot="empty" >
                    <img src="@manage/images/暂无数据.png">
                    <br>
                    暂无内容
                </template>
                <el-table-column
                        label="序号"
                        type="index"
                        align="center"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="活动标题"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="typeCode"
                        label="活动类型"
                        min-width="120px"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        {{typeCodeChange(row.typeCode)}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="time"
                        label="活动时间"
                        min-width="170px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="活动地点"
                        min-width="150px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="sponsor"
                        label="主办方"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="sponsorTel"
                        label="咨询电话"
                        min-width="150px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="target"
                        label="面向群体"
                        min-width="100px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="applyEndTime"
                        label="报名截止"
                        min-width="170px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="activityPersonNum"
                        label="人数上限"
                        min-width="100px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="applyCount"
                        label="当前报名数"
                        min-width="100px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="statusCode"
                        label="状态"
                        min-width="100px"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        {{statusCodeChange(row.statusCode)}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="170px"
                >
                    <template slot-scope="{row}">
                        <div class="tableEdit">
                            <div class="item" style="width: 60px" v-if="row.statusCode == -1" @click="publishActivity(row.id)">发布</div>
                            <div class="item" style="width: 60px" v-else-if="row.statusCode == 0" @click="unpublishActivity(row.id)">终止发布</div>
                            <div class="item" @click="openDetail(row.id)">查看</div>
                            <div class="item delete" @click="deleteActivity(row)">删除</div>
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
        <transition name="rightSlide">
            <addActivity v-show="addActivityShow" @close="closeAddTable" :stateList="stateList" :typeList="typeList" :rdId="pages.rdId"></addActivity>
        </transition>
        <transition name="rightSlide">
            <checkInfo v-show="checkActivityShow" @close="closeCheckInfoTable" :checkActivityShow="checkActivityShow" :detailId="detailId" :stateList="stateList" :typeList="typeList"></checkInfo>
        </transition>
        <typeManage ref="typeManage"></typeManage>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, DatePicker,RadioGroup,Radio,Tree} from 'view-design'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import typeManage from './components/typeManagement.vue'
    import addActivity from './communityActivity_addActivity.vue'
    import checkInfo from  './communityActivity_checkInfo.vue'
    import * as api from '@manage/api/serve/activity'

    @Component({
        components: {
            Page,
            DatePicker,
            mixSelect,
            Input,
            Radio,
            RadioGroup,
            Tree,
            addActivity,
            checkInfo,
            typeManage
        }
    })

    export default class communityActivity extends Vue {
        stateList:Array<any>=[];
        typeList:Array<any>=[];
        activityList:Array<any>=[];

        keyword: string = '';
        startTime: string = '';
        endTime: string = '';
        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
            typeCode:'',
            statusCode:'',
            rdId:'',
        };
        loading: boolean = false;
        addActivityShow:boolean=false
        checkActivityShow:boolean=false
        detailId:string = '';
        communityList:any = [];
        async getSelection(Array: string, name: string) {
            let data = await api.getSelection(name);
            this[`${Array}`] = data;
        }
        //结构树
        async getCommunity() {
            try{
                let data = await api.getTree(0, null)
                this.communityList = [{
                    title:'全部小区',
                    id:''
                }].concat(data);
            }catch (e) {
                this.communityList = [];
                this.$message.error(`获取小区数据失败！`)
            }
        }
        mounted() {
            this.getSelection(`stateList`, `活动状态`);
            this.getSelection(`typeList`, `活动类型`);
            this.getCommunity();
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

        async getActivityList() {
            this.loading = true
            let obj: any = {
                pageNum: this.pages.pageNum,
                pageSize: this.pages.pageSize,
                keyword: this.keyword,
            }
            if (this.pages.typeCode) {
                obj.typeCode = this.pages.typeCode
            }
            if (this.pages.statusCode) {
                obj.statusCode = this.pages.statusCode
            }
            if (this.startTime) {
                obj.startTime = this.startTime
            }
            if (this.endTime) {
                obj.endTime = this.endTime
            }
            try {
                let {totalElements, content} = await api.getActivityList(obj)
                this.pages.totalElements = totalElements
                this.activityList = content
                this.loading = false

            } catch (e) {

            }
            this.loading = false
        }

        getPage(page?: number) {
            this.pages.pageNum = page || 1;
            this.getActivityList()
        }

        reset() {
            this.pages.statusCode = ''
            this.pages.typeCode = ''
            this.startTime = '';
            this.endTime = '';
            this.keyword = '';
            let timelist: any = this.$refs.timelist;
            timelist.handleClear();
            this.getPage();
        }

        closeAddTable() {
            this.addActivityShow = false;
            this.reset()
        }

        openTypeManagement(){
            let refs: any = this.$refs;
            refs.typeManage.openTypeManage()
        }


        timesChange(val) {
            this.startTime = val[0];
            this.endTime = val[1];
        }
        statusCodeChange(code){
            let obj:any = this.stateList.find(item => item.code === code);
            return obj ? obj.name : '-';
        }
        typeCodeChange(code){
            let obj:any = this.typeList.find(item => item.code === code);
            return obj ? obj.name : '-';
        }
        async publishActivity(id:string){
            try {
                await api.publishActivity(id)
                this.$message.success(`发布成功！`);
                this.reset();
            }catch (e) {
                this.$message.error(`操作失败！`)
            }
        }
        async unpublishActivity(id:string){
            try {
                await api.unpublishActivity(id)
                this.$message.success(`取消发布成功！`);
                this.reset();
            }catch (e) {
                this.$message.error(`操作失败！`)
            }
        }

        deleteActivity(row){
            this.$confirm('确定要删除这个活动吗?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try{
                    await api.deleteActivity([row.id]);
                    this.reset()
                    this.$message.success(`删除成功！`)
                }
                catch (e) {
                    this.$message.error(`删除失败！`)
                }
            }).catch(() => {

            });
        }
        openDetail(id){
            this.detailId = id;
            this.checkActivityShow = true;
        }
        closeCheckInfoTable(){
            this.checkActivityShow = false;
            this.reset()
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #communityActivity {
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
                display: flex;

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
    .aline {
        .label {
            //width: 100px;
        }
    }
</style>
<style lang="scss">
    #communityActivity{

    }

</style>
