<template>
    <div id="contract" >
        <div class="thTitle" ref="thTitle">
            <i class="line"></i>合同列表
        </div>
        <div class="viewbox" ref="viewbox">
            <div class="searchline" ref="searchline">
                <div class="left">
                    <mixSelect
                            class="margin"
                            :selectList="stateList"
                            labelName="name"
                            valueName="name"
                            placeholder="全部状态"
                            style="width: 140px"
                    >
                    </mixSelect>

                    <div class="margin">
                        <i class="item">签约时间</i>
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

                <div class="item" >
                    <div class="pmbtn primary" @click="openAddDialog">
                        <i class="iconfont icontianjia"></i>
                        新增合同
                    </div>
                </div>
            </div>
            <el-table
                    :data="contractList"
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
                        prop="num"
                        label="合同编号"
                        min-width="150px"
                        show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                        prop="state"
                        label="状态"
                        min-width="100px"
                        show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                        prop=""
                        label="签约时间"
                        min-width="160px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="合约有效期"
                        min-width="180px"
                >
                    <template slot-scope="{row}">
                    </template>
                </el-table-column>
                <el-table-column
                        prop=""
                        label="签约甲方"
                        min-width="180px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="签约人"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="甲方联系方式"
                        min-width="160px"
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="签约乙方"
                        min-width="180px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="auth"
                        label="负责人"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="cash"
                        label="广告费用(元) "
                        min-width="140px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="备注"
                        min-width="150px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="110px"
                >
                    <template slot-scope="{row}">
                        <div class="tableEdit">
                            <div class="item" @click="openEditDialog">详情</div>
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
                :visible.sync="dialogVisible"
                custom-class="emDialog"
                width="545px"
                top="6vh"
                :close-on-click-modal="false"
                @close="closeDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增合同
            </div>
            <div class="MuModalContent">

                <div class="aline">
                    <div class="label">合同编号</div>
                    <div class="info">
                        <Input placeholder="请输入" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">签约时间</div>
                    <div class="info">
                        <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" @on-change="setSignDate" ref="setMonthpick"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">合约有效期</div>
                    <div class="info">
                        <DatePicker type="daterange"
                                    format="yyyy-MM-dd"
                                    placeholder="开始时间   ~   结束时间"
                                    style="width: 100%"
                                    v-model="limitTime"
                                    @on-change="limitTimeChange">
                        </DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">签约甲方</div>
                    <div class="info">
                        <Input placeholder="请输入" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">甲方负责人</div>
                    <div class="info">
                        <Input placeholder="请输入" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">联系方式</div>
                    <div class="info">
                        <Input placeholder="请输入" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">签约乙方</div>
                    <div class="info">
                        <Input placeholder="请输入" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">乙方负责人</div>
                    <div class="info">
                        <Input placeholder="请输入" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">广告费用</div>
                    <div class="info">
                        <Input placeholder="请输入" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">备注信息</div>
                    <div class="info">
                        <textarea style="height: 74px;width: 100%" placeholder="请输入"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">上传附件</div>
                    <div class="info">
                        <div class="upfileButton">
                            <i class="iconfont iconshangchuan"></i>点击上传
                        </div>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">上传图片</div>
                    <div class="info">
                        <div class="uplist">
                            <div class="upItem"  v-for="item in imgList">
                                <img :src="item" alt="">
                                <div class="close">删除</div>
                            </div>
                            <label class="upItem add" for="addUpload">
                                <i class="icontianjia iconfont"></i>
                            </label>
                            <input type="file" accept="image/*" id="addUpload" @change="uploadImg">
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div  class="pmbtn primary" style="margin-right: 10px" >确定</div>

                <div class="pmbtn" @click="closeDialog">取消</div>
            </div>
        </el-dialog>

        <el-dialog
                :visible.sync="dialogVisible2"
                custom-class="emDialog"
                width="545px"
                top="6vh"
                :close-on-click-modal="false"

        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                合同详情
            </div>
            <div class="MuModalContent">

                <div class="aline">
                    <div class="label">合同编号</div>
                    <div class="info">
                        <Input placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">签约时间</div>
                    <div class="info">
                        <DatePicker :disabled="!editFlag" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" @on-change="setSignDate" ref="setMonthpick"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">合约有效期</div>
                    <div class="info">
                        <DatePicker type="daterange"
                                    format="yyyy-MM-dd"
                                    placeholder="开始时间   ~   结束时间"
                                    style="width: 100%"
                                    v-model="limitTime"
                                    @on-change="limitTimeChange"
                                    :disabled="!editFlag">
                        </DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">签约甲方</div>
                    <div class="info">
                        <Input placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">甲方负责人</div>
                    <div class="info">
                        <Input placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">联系方式</div>
                    <div class="info">
                        <Input placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">签约乙方</div>
                    <div class="info">
                        <Input placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">乙方负责人</div>
                    <div class="info">
                        <Input placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">广告费用</div>
                    <div class="info">
                        <Input placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">备注信息</div>
                    <div class="info">
                        <textarea style="height: 74px;width: 100%" placeholder="请输入" :disabled="!editFlag"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">上传附件</div>
                    <div class="info">
                        <div class="upfileButton">
                            <i class="iconfont iconshangchuan"></i>点击上传
                        </div>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">上传图片</div>
                    <div class="info">
                        <div class="uplist">
                            <div class="upItem"  v-for="item in imgList">
                                <img :src="item" alt="">
                                <div class="close">删除</div>
                            </div>
                            <label class="upItem add" for="changeUpload">
                                <i class="icontianjia iconfont"></i>
                            </label>
                            <input type="file" accept="image/*" id="changeUpload" @change="upChangeImg">
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div v-show="!editFlag" class="pmbtn primary" style="margin-right: 10px" @click="editFlag = true">编辑</div>
                <div v-show="editFlag" class="pmbtn primary" style="margin-right: 10px" >确定</div>
                <div v-show="editFlag" class="pmbtn" @click="editFlag = false">取消</div>
            </div>
        </el-dialog>

    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, DatePicker,} from 'view-design'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/propertyCharge/apportion'

    @Component({
        components: {
            Page,
            DatePicker,
            tabNav,
            mixSelect,
            Input,
        }
    })

    export default class contract extends Vue {
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        stateList:Array<any>=[
            {name:'未过期'},
            {name:'已过期'},
        ];
        contractList:Array<any>=[
            {
                num:"c50-7HTMD0884L",
                state:'未发布',
                cash:'20201',
                auth:'李磊'
            }
        ];
        keyword: string = '';
        formHeight: number = 600;

        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        imgList:any = [`s`];
        loading: boolean = false;
        dialogVisible: boolean = false;
        dialogVisible2: boolean = false;
        editFlag:boolean = false;
        dialogType:string = '';
        teamObj:any = {

        }
        limitTime:any = [];

        mounted() {
            this.$nextTick(() => {
                let refs: any = this.$refs;
                let maxHeight = refs.viewbox.clientHeight - 15;
                let searchline = refs.searchline.clientHeight;
                this.formHeight = maxHeight - searchline - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
            })
        }

        reset() {

        }

        getPage(page) {
            this.pages.pageNum = page;

        }
        openAddDialog(){
            this.dialogVisible = true;
        }
        closeDialog(){
            this.dialogVisible = false;
        }

        setTimelist(){}

        setSignDate(){

        }
        limitTimeChange(){

        }


        openEditDialog(){
            this.dialogVisible2 = true;
        }
        closeEditDialog(){
            this.dialogVisible2 = false;
            this.editFlag = false
        }
        get imgport() {
            return null
            //return this.editRoom.roomPicId ? this.$imgDownUrl() + `${this.editRoom.roomPicId}` : null
        }
        uploadImg(e) {
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
                        //let {data: {id}} = await app.upImg(fd, this.$upBaseUrl());
                        //this.editRoom.roomPicId = id;
                        this.$message.success(`上传成功！`)

                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                }, 200);
            }
        }

        upChangeImg(e) {
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
                        //let {data: {id}} = await app.upImg(fd, this.$upBaseUrl());
                        //this.editRoom.roomPicId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                }, 200);
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #contract {

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
