<template>
    <div id="announcemengManagement" >
        <div class="thTitle" ref="thTitle" style="justify-content: space-between">
            <div style="display: flex;align-items: center"><i class="line"></i>社区公告</div>
            <div class="history" @click="historyFlag=true">
                <i class="iconfont iconxiangqing"></i>
                历史记录
            </div>
        </div>
        <div class="viewbox" ref="viewbox">
            <div class="searchline" ref="searchline">
                <div class="left">
                    <div class="margin">
                        <Input placeholder="请输入关键字"
                               style="width: 200px;margin-right: 15px"></Input>
                        <div class="pmbtn primary">
                            <i class="iconfont iconsousuo"></i>搜索
                        </div>
                    </div>
                </div>

                <div class="item" style="margin-right: 0">
                    <div class="pmbtn primary" @click="addDialogVisible=true">
                        <i class="iconfont icontianjia"></i>
                        新增公告
                    </div>
                </div>
            </div>
            <el-table
                    :data="coastList"
                    stripe
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
                        width="100px"
                        align="center"
                >
                    <template slot-scope="{row,$index}">
                        {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="标题"
                        min-width="150px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="content"
                        label="公告内容"
                        min-width="250px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="showTime"
                        label="展示时间"
                        min-width="150px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="当前状态"
                        min-width="150px"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row}">
                        <div v-if="row.state == 1" style="color: #ff2c2c;">未发布</div>
                        <div v-else-if="row.state == 2" style="color: #3a7ef3;">已发布</div>
                        <div v-else style="color: #7c8185;">已关闭</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="140px"
                >
                    <template slot-scope="{row}">
                        <div class="tableEdit">
                            <div class="item" v-if="row.state== 1" @click="startUsingDialog=true">发布</div>
                            <div class="item" v-else-if="row.state== 2"  @click="closeIssue">下架</div>
                            <div class="item" v-if="row.state !== '0'">编辑</div>
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
        <transition name="rightSlide">
            <history v-show="historyFlag" @close="closeTable" :historyFlag="historyFlag"></history>
        </transition>

        <el-dialog
                :visible.sync="addDialogVisible"
                custom-class="emDialog"
                width="545px"
                top="8vh"
                :close-on-click-modal="false"
                @close="closeAddDidalog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增公告
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">公告标题</div>
                    <div class="info">
                        <Input placeholder="请输入" style="width: 100%"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">公告内容</div>
                    <div class="info">
                        <textarea placeholder="请输入" style="width: 100%;height: 200px"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">展示时间</div>
                    <div class="info">
                        <RadioGroup v-model="selectTime">
                            <Radio label="暂不选择" style="margin-right: 60px"></Radio>
                            <Radio label="选择时间"></Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">选择时间</div>
                    <div class="info">
                        <DatePicker
                                type="daterange"
                                format="yyyy-MM-dd"
                                placeholder="开始时间   ~   结束时间"
                                style="width: 100%;"
                                ref="timelist"
                        ></DatePicker>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="">确定</div>
                <div class="pmbtn" @click="closeAddDidalog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="addDialogVisible"
                custom-class="emDialog"
                width="545px"
                top="8vh"
                :close-on-click-modal="false"
                @close="closeAddDidalog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                编辑公告
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">公告标题</div>
                    <div class="info">
                        <Input placeholder="请输入" style="width: 100%"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">公告内容</div>
                    <div class="info">
                        <textarea placeholder="请输入" style="width: 100%;height: 200px"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">展示时间</div>
                    <div class="info">
                        <RadioGroup v-model="selectTime">
                            <Radio label="暂不选择" style="margin-right: 60px"></Radio>
                            <Radio label="选择时间"></Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">选择时间</div>
                    <div class="info">
                        <DatePicker
                                type="daterange"
                                format="yyyy-MM-dd"
                                placeholder="开始时间   ~   结束时间"
                                style="width: 100%;"
                                ref="timelist"
                        ></DatePicker>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="">确定</div>
                <div class="pmbtn" @click="closeAddDidalog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="startUsingDialog"
                custom-class="emDialog"
                width="545px"
                top="18vh"
                :close-on-click-modal="false"
                @close="closestartUsingDidalog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                启用公告
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div>请选择启用时间</div>
                </div>
                <div class="aline">
                    <DatePicker
                            type="daterange"
                            format="yyyy-MM-dd"
                            placeholder="开始时间   ~   结束时间"
                            style="width: 100%;"
                    ></DatePicker>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="">确定</div>
                <div class="pmbtn" @click="closestartUsingDidalog">取消</div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, DatePicker,RadioGroup,Radio,Tree} from 'view-design'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import history from './announcementManage_history.vue'

    @Component({
        components: {
            Page,
            DatePicker,
            mixSelect,
            Input,
            Radio,
            RadioGroup,
            Tree,
            history
        }
    })
    export default class announcemengManagement extends Vue {
        formHeight: number = 600;
        historyFlag:boolean=false
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        selectTime: string = ''
        coastList: any = [
            {
                roomId: '',
                state: '1',
                showTime:'2019-9-4 ~ 2019-9-10',
                content:'2019-9-4 ~ 2019-9-10 每天11点至13点停电',
                title:'停电公告',
            },
            {
                roomId: '',
                state: '2',
                showTime:'2019-9-13 ~ 2019-9-15',
                content:'2019-9-13 ~ 2019-9-15 每天早上8点至10点停水',
                title:'停水公告',
            },
            {
                roomId: 'RYY-10-02',
                state: '0',
                showTime:'2019-9-14 ~ 2019-9-20',
                content:'2019-9-14 ~ 2019-9-20 每晚7点社区中心播放新闻联播',
                title:'社区活动',
            },
            {
                roomId: 'RYY-10-02',
                state: '0',
                showTime:'2019-10-11 ~ 2019-12-11',
                content:'2019-10-11 ~ 2019-12-11 社区免费测血压',
                title:'免费测血压',
            },
        ]
        addDialogVisible: boolean = false
        startUsingDialog: boolean = false

        mounted() {
            this.$nextTick(() => {
                let refs: any = this.$refs;
                let maxHeight = refs.viewbox.clientHeight - 15;
                let searchline = refs.searchline.clientHeight;
                this.formHeight = maxHeight - searchline - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
            })
        }

        getPage(page) {
            this.pages.pageNum = page;
        }
        closeTable() {
            this.historyFlag = false;
        }
        closeAddDidalog() {
            this.addDialogVisible = false
        }

        closestartUsingDidalog() {
            this.startUsingDialog = false
        }

        closeIssue() {
            this.$confirm('当前公告正在待发布/发布中，关闭将终止发布,是否确认关闭？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '关闭成功!'
                });
            }).catch(() => {

            });
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";
    #announcemengManagement{

        position: relative;
        .history{
            color: #3a7ef3;
            font-size: 14px;
            font-weight: normal;
            cursor: pointer;
            user-select: none;
            .iconxiangqing{
                font-size: 12px;
            }
        }
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
        .aline {
            .label {
                width: 100px;
            }
        }
    }
</style>
