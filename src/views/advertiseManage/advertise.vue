<template>
    <div id="advertise" >
        <div class="thTitle" ref="thTitle">
            <i class="line"></i>广告列表
        </div>
        <div class="viewbox" ref="viewbox">
            <div class="searchline" ref="searchline">
                <div class="left">
                    <mixSelect
                            v-model="pages.expired"
                            class="margin"
                            :selectList="stateList"
                            labelName="name"
                            valueName="code"
                            placeholder="全部状态"
                            style="width: 140px"
                    >
                    </mixSelect>
                    <mixSelect
                            v-model="pages.adPublishState"
                            class="margin"
                            :selectList="publishState"
                            labelName="name"
                            valueName="code"
                            placeholder="发布状态"
                            style="width: 140px"
                    >
                    </mixSelect>
                    <!--<div class="margin">
                        <i class="item">展示时间</i>
                        <DatePicker
                                type="daterange"
                                format="yyyy-MM-dd"
                                placeholder="开始时间   ~   结束时间"
                                style="width: 200px;"
                                @on-change="setTimelist"
                                ref="timelist"
                        ></DatePicker>
                    </div>-->

                    <div class="margin">
                        <Input v-model="keyword" placeholder="请输入合同编号/签约甲方"
                               style="width: 200px;margin-right: 15px"></Input>
                        <div class="pmbtn primary" style="margin-right: 15px" >
                            <i class="iconfont iconsousuo"></i>搜索
                        </div>
                        <div class="pmbtn" @click="reset">
                            <i class="iconfont iconzhongzhi"></i>重置
                        </div>
                    </div>
                </div>

                <div class="item" style="margin-bottom: 20px">
                    <div class="pmbtn primary" @click="addFlag = true">
                        <i class="iconfont icontianjia"></i>
                        新增广告
                    </div>
                </div>
            </div>
            <el-table
                    :data="advertiseList"
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
                        prop="adTitle"
                        label="广告标题"
                        min-width="160px"
                        show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                        prop="publishState"
                        label="状态"
                        min-width="100px"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <div v-if="row.publishState == 0">未发布</div>
                        <div v-else-if="row.publishState == 1">已发布</div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>


                <el-table-column
                        prop="adOwner"
                        label="签约甲方"
                        min-width="180px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="adStartTime"
                        label="展示开始时间"
                        min-width="170px"
                        show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                        prop="adDuration"
                        label="展示持续时间(天)"
                        min-width="170px"
                >
                </el-table-column>

                <el-table-column
                        label="操作"
                        width="180px"
                >
                    <template slot-scope="{row}">
                        <div class="tableEdit">
                            <div class="item" v-if="row.publishState == 0" @click="advertisementpublish(row.id)">发布</div>
                            <div class="item" v-if="row.publishState == 1" @click="advertisementpublish(row.id)">取消发布</div>
                            <div class="item" @click="openEditDialog(row.id)">详情</div>
                            <div class="item delete" @click="deleteAdvertisement(row.id)">删除</div>
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
            <addAdvertise v-show="addFlag" @close="closeAdd"></addAdvertise>
        </transition>
        <transition name="rightSlide">
            <advertiseDetail v-show="detailFlag" :detailFlag="detailFlag" :detailId="detailId" @close="closeDetail"></advertiseDetail>
        </transition>

    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, DatePicker,} from 'view-design'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import addAdvertise from './addAdvertise.vue';
    import advertiseDetail from './advertiseDetail.vue';
    import * as api from '@manage/api/advertise'

    @Component({
        components: {
            Page,
            DatePicker,
            tabNav,
            mixSelect,
            Input,
            addAdvertise,
            advertiseDetail
        }
    })

    export default class advertise extends Vue {
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        stateList:Array<any>=[
            {
                name:'未过期',
                code:'0'
            },
            {
                name:'已过期',
                code:'1'
            },
        ];
        publishState:Array<any>=[
            {
                name:'未发布',
                code:'0'
            },
            {
                name:'已发布',
                code:'1'
            },
        ];
        addFlag: boolean = false;
        detailFlag: boolean = false;
        advertiseList:Array<any>=[];

        keyword: string = '';
        formHeight: number = 600;

        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
            expired:'',
            adPublishState:'',
        };
        loading: boolean = false;
        detailId: string = '';

        mounted() {

            this.$nextTick(() => {
                this.setPagesize();
                this.reset()
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

        async getAdvertiseList() {
            this.loading = true
            let obj: any = {
                pageNum: this.pages.pageNum,
                pageSize: this.pages.pageSize,
                key: this.keyword,
                adPublishState: this.pages.adPublishState,
                expired: this.pages.expired,
            }

            try {
                let {totalElements, content} = await api.getAdvertisementList(obj)
                this.pages.totalElements = totalElements
                this.advertiseList = content
                this.loading = false

            } catch (e) {

            }
            this.loading = false
        }
        reset() {
            this.keyword = '';
            this.pages.expired = '';
            this.pages.adPublishState = '';
            this.getPage();
        }

        getPage(page?: number) {
            this.pages.pageNum = page || 1;
            this.getAdvertiseList();
        }
        closeAdd(){
            this.addFlag = false;
            this.reset()
        }
        closeDetail(){
            this.detailFlag = false;
        }
        setTimelist(){

        }
        openEditDialog(id:string){
            this.detailFlag = true;
            this.detailId = id
        }

        async advertisementpublish(id:string){
            try {
                await api.advertisementpublish(id);
                this.$message.success(`操作成功！`)
            } catch (e) {
                this.$message.error(`操作失败！`)
            }
        }
        deleteAdvertisement(id){
            this.$confirm('确定要删除这个广告吗?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try{
                    await api.deleteAdvertisement([id]);
                    this.keyword = ''
                    this.reset();
                    this.$message.success(`删除成功！`)
                }
                catch (e) {
                    this.$message.error(`删除失败！`)
                }
            }).catch(() => {

            });
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #advertise {

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
    }

    .aline {
        .label {
            width: 100px;
        }
    }
    .uplist{
        display: flex;
        flex-wrap: wrap;
        .upItem{
            flex:none;
            width: 70px;
            height: 70px;
            margin: 0 10px 10px 0;
            position: relative;
            border-radius: 4px;
            border: solid 1px #dde4eb;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            img{
                width: 100%;
                height: 100%;
            }
            .close{
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 2;
                background-color: rgba(0,0,0,.8);
                color: #fff;
                font-size: 12px;
                width: 100%;
                height: 26px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            &.add{
                border: dashed 1px #dde4eb;
                cursor: pointer;
                .iconfont {
                    color: #dde4eb;
                    font-size: 24px;
                    line-height: 1;
                }
            }
        }
    }

</style>
<style lang="scss">
    .ivu-input[disabled], fieldset[disabled] .ivu-input{
        background-color: #f8f9fc;
    }
</style>
