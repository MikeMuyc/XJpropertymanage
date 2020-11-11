<template>
    <div id="visitorRegistration" >
        <div class="thTitle" ref="thTitle">
            <i class="line"></i>访客申请记录
        </div>
        <div class="viewbox" ref="viewbox">
            <div class="searchline" ref="searchline">
                <div class="left">
                    <mixSelect
                            class="margin"
                            :selectList="areaList"
                            labelName="name"
                            valueName="id"
                            placeholder="全部状态"
                            style="width: 140px"
                    >
                    </mixSelect>

                    <div class="margin">
                        <i class="item">到访时间</i>
                        <DatePicker
                                type="daterange"
                                format="yyyy-MM-dd"
                                placeholder="开始时间   ~   结束时间"
                                style="width: 200px;"
                                @on-change="setTimelist"
                                ref="timelist"
                        ></DatePicker>
                    </div>

                    <div class="margin">
                        <Input v-model="keyword" placeholder="申请房间号/申请人"
                               style="width: 200px;margin-right: 15px"></Input>
                        <div class="pmbtn primary" style="margin-right: 15px" >
                            <i class="iconfont iconsousuo"></i>搜索
                        </div>
                        <div class="pmbtn" @click="reset">
                            <i class="iconfont iconzhongzhi"></i>重置
                        </div>
                    </div>
                </div>

                <div class="item" style="margin-bottom: 20px;margin-right: 0">
                    <div class="pmbtn primary" @click="addDialogVisible=true">
                        <i class="iconfont icontianjia"></i>
                        登记申请
                    </div>
                </div>
            </div>
            <el-table
                    :data="recordList"
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
                        label="访客姓名"
                        min-width="100px"
                        show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                        prop="sendTime"
                        label="到访时间"
                        min-width="170px"
                        show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                        prop="gender"
                        label="性别"
                        min-width="80px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="isCar"
                        label="是否驾车"
                        min-width="80px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="carNum"
                        label="车牌号"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="roomId"
                        label="访问楼房号"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="leaveTime"
                        label="离开时间"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                        label="操作"
                        width="80px"
                        align="center"
                >
                    <template slot-scope="{row}">
                        <div class="tableEdit">
                            <!--<div class="item"  v-if="row.name==='待使用'" @click="usingRoom">使用</div>-->
                            <div class="item delete" >删除</div>
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

        <el-dialog
                :visible.sync="addDialogVisible"
                custom-class="emDialog"
                width="545px"
                top="13vh"
                :close-on-click-modal="false"
                @close="closeAddDidalog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                登记访客
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">申请房间</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="areaList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">访客姓名</div>
                    <div class="info">
                        <Input placeholder="请输入" style="width: 100%"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">性别</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="areaList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">是否驾车</div>
                    <div class="info">
                        <RadioGroup v-model="isDriver">
                            <Radio label="1" style="margin-right: 60px">是</Radio>
                            <Radio label="0">否</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline" v-if="isDriver==='1'">
                    <div class="label">车牌号码</div>
                    <div class="info">
                        <Input placeholder="请输入" style="width: 100%"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">到访时间</div>
                    <div class="info">
                        <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" ></DatePicker>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="">确定</div>
                <div class="pmbtn" @click="closeAddDidalog">取消</div>
            </div>
        </el-dialog>


    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, DatePicker,RadioGroup,Radio,Tree} from 'view-design'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';

    @Component({
        components: {
            Page,
            DatePicker,
            mixSelect,
            Input,
            Radio,
            RadioGroup,
            Tree
        }
    })

    export default class visitorRegistration extends Vue {
        areaList:Array<any>=[];
        recordList:Array<any>=[
            {
                name:'李雷',
                sendTime:'2020-8-5 09:11:33',
                gender:'男',
                isCar:'否',
                carNum:'-',
                leaveTime:'2020-8-5 13:24:25',
                roomId:'NH-EN-003',
            },
            {
                name:'李晶',
                sendTime:'2020-8-5 09:11:33',
                gender:'女',
                isCar:'是',
                carNum:'浙AH96582',
                leaveTime:'2020-8-5 13:24:25',
                roomId:'NH-EN-003',
            },
        ];
        isDriver:string='1'
        keyword: string = '';
        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        loading: boolean = false;
        addDialogVisible:boolean=false


        mounted() {
            this.$nextTick(() => {
                let refs: any = this.$refs;
                let maxHeight = refs.viewbox.clientHeight - 15;
                let searchline = refs.searchline.clientHeight;
                this.formHeight = maxHeight - searchline - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
            })
        }
        closeAddDidalog(){
            this.addDialogVisible=false
        }
        reset() {
        }

        getPage(page) {
            this.pages.pageNum = page;

        }
        setTimelist(){}
        usingRoom(){
            this.$confirm('使用后门禁二维码将失效，确认使用？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '已使用!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #visitorRegistration {

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
                justify-content: flex-end;
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
                        margin-right: 15px;
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
</style>
<style lang="scss">
    #repairRecord{
        .create-isLoading {
            .el-loading-spinner {
                top: 20%;
                left: 50%;
                margin-left: -55px;
                background: #fff;
                padding: 20px;
                border-radius: 4px;
                width: auto;
                text-align: center;
                position: absolute;

                i {
                    color: #30374a;
                }

                .el-loading-text {
                    color: #30374a;
                }
            }
        }
        .el-dialog__wrapper.setDialog{
            .el-dialog__body{
                padding: 0;
            }
        }
        .buildingTree{
            margin-left: 0;
            .iconxiaoqu{
                margin-left: 5px;
            }
        }
        .ivu-tree-arrow{
            width: 0;
        }
    }

</style>
