<template>
    <div  id="addActivity">
        <div class="addActivityTitle">
            <div style="display: flex;align-items: center">
                <div class="back" @click="backClose">
                    <i class="iconfont iconfanhui"></i>返回
                </div>
                活动名称
                <Tag v-if="tempObj.statusCode == -1 || tempObj.statusCode == 0" color="primary" style="margin-left: 15px">{{statusCodeChange(tempObj.statusCode)}}</Tag>
                <Tag v-else-if="tempObj.statusCode == 1" color="success" style="margin-left: 15px">{{statusCodeChange(tempObj.statusCode)}}</Tag>
                <Tag v-else-if="tempObj.statusCode == 2" color="default" style="margin-left: 15px">{{statusCodeChange(tempObj.statusCode)}}</Tag>
            </div>
            <div class="item">
                <div class="pmbtn" v-show="!editActivityShow" @click="editActivityShow = true" style="margin-right: 15px;font-size: 14px">
                    编辑
                </div>
                <div v-show="editActivityShow" class="pmbtn primary" style="margin-right: 15px;font-size: 14px" @click="editActivity">
                    确认修改
                </div>
                <div v-show="editActivityShow" class="pmbtn" style="font-size: 14px" @click="editActivityShow = false">
                    取消
                </div>

                <div v-show="!editActivityShow && tempObj.statusCode == 0" class="pmbtn primary" style="font-size: 14px" @click="unpublishActivity">
                    终止发布
                </div>
                <div v-show="!editActivityShow && tempObj.statusCode == -1" class="pmbtn primary" style="font-size: 14px" @click="publishActivity">
                    发布
                </div>
            </div>
        </div>
        <div class="contentMain">

            <vue-perfect-scrollbar class="contentLeft">
                <div class="h">
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            活动名称
                        </div>
                        <Input v-model="tempObj.name" placeholder="请输入" :disabled="!editActivityShow" class="info"></Input>
                    </div>
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            活动类型
                        </div>
                        <mixSelect
                                v-model="tempObj.typeCode"
                                class="info"
                                :selectList="typeList"
                                labelName="name"
                                valueName="code"
                                placeholder="请输入"
                                :disabled="!editActivityShow"
                        >
                        </mixSelect>
                    </div>
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            活动地点
                        </div>
                        <Input v-model="tempObj.address"  placeholder="请输入" :disabled="!editActivityShow"  class="info"></Input>
                    </div>
                </div>
                <div class="h">
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            活动时间
                        </div>
                        <DatePicker
                                v-model="actTime"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="开始时间"
                                style="width: 280px;margin-left: 15px"
                                :disabled="!editActivityShow"
                                @on-change="setStartTime"
                        ></DatePicker>
                    </div>
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            主办方
                        </div>
                        <Input v-model="tempObj.sponsor"   class="info" placeholder="请输入" :disabled="!editActivityShow"></Input>
                    </div>
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            咨询电话
                        </div>
                        <Input v-model="tempObj.sponsorTel"   class="info" placeholder="请输入" :disabled="!editActivityShow"></Input>
                    </div>
                </div>
                <div class="h">
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            报名截止
                        </div>
                        <DatePicker
                                v-model="applyEndTime"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="请选择"
                                style="width: 280px;margin-left: 15px"
                                @on-change="setEndTime"
                                :disabled="!editActivityShow"
                        ></DatePicker>
                    </div>
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            人数上限
                        </div>
                        <Input v-model="tempObj.activityPersonNum"   class="info" placeholder="请输入" type="number" :disabled="!editActivityShow"></Input>
                    </div>
                    <div class="h1" style="width: 33.33%;">
                        <div class="label">
                            面向群体
                        </div>
                        <Input v-model="tempObj.target"   class="info" placeholder="请输入" :disabled="!editActivityShow"></Input>
                    </div>
                </div>
                <div class="h">
                    <div class="h1">
                        <div class="label">
                            封面图片
                        </div>
                        <div v-if="editActivityShow" class="info">
                            <label class="upfile" style="width: 96px;height: 54px;background-color: #f8f9fc;" for="editupload">
                                <img v-if="imgportedit" :src="imgportedit">
                                <i v-else style="color: #a0a5a9;">未上传</i>
                            </label>
                            <input type="file" accept="image/*" id="editupload" @change="upEditImg">
                        </div>
                        <div v-else class="info">
                            <label class="upfile" style="width: 96px;height: 54px;background-color: #f8f9fc;" >
                                <img v-if="imgportedit" :src="imgportedit">
                                <i v-else style="color: #a0a5a9;">未上传</i>
                            </label>

                        </div>
                    </div>
                </div>
                <div class="h">
                    <div class="h1" style="width: 100%;align-items: flex-start">
                        <div class="label" style="margin-top: 10px">
                            详细内容
                        </div>
                        <editorBar class="info" v-if="editActivityShow" v-model="tempObj.detail" :isClear="isClear" @change="change"
                                   :content="tempObj.detail"></editorBar>
                        <div v-else class="info displayarea" v-html="tempObj.detail"></div>
                    </div>
                </div>
            </vue-perfect-scrollbar>
            <div class="contentRight">
                <div class="border"></div>
                <div style="width: calc(100% - 40px);" ref="rightContent">
                    <div class="rightPersonList">
                        <div class="topTitle" ref="topTitle">
                            <div class="left">
                                报名人员
                                <i style="color: #7c8185;">（{{personList.length}}）</i>
                            </div>
                            <div class="right">
                                <i class="iconfont icondaochu"></i>
                                导出
                            </div>
                        </div >
                        <el-table
                                :data="tempObj.activityApplies"
                                :height="formHeight"
                                :header-cell-style="{background:'#f4f6f9'}"
                        >
                            <template slot="empty" >
                                <img src="@manage/images/暂无数据.png">
                                <br>
                                暂无内容
                            </template>
                            <el-table-column
                                    label="序号"
                                    width="80px"
                                    align="center"
                                    type="index"
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="姓名"
                                    min-width="100px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="roomName"
                                    label="房间代码"
                                    min-width="100px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop="tel"
                                    label="联系方式"
                                    min-width="140px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                        </el-table>
                    </div>
                   <!-- <div class="splendidMoment" ref="splendidMoment" v-show="true">
                        <div class="topTitle">
                            <div class="left" style="margin-top: 20px">
                                活动精彩瞬间
                            </div>
                        </div>
                        <div >
                            <i style="color: #3a7ef3">活动照片</i>
                            <div style="display: flex;margin: 15px 0">
                                <div class="uplist">
                                    <div class="upItem"  v-for="item in imgList">
                                        <img :src="item" alt="">
                                        <div class="close">删除</div>
                                    </div>
                                    <label class="upItem add" for="changeUpload">
                                        <i class="icontianjia iconfont"></i>
                                    </label>
                                    <input type="file" accept="image/*" id="changeUpload1" @change="upAddImg">
                                </div>
                            </div>
                            <i style="color: #3a7ef3">活动视频</i>
                            <div style="display: flex;margin: 15px 0">
                                <div class="uplist">
                                    <div class="upItem"  v-for="item in imgList">
                                        <img :src="item" alt="">
                                        <div class="close">删除</div>
                                    </div>
                                    <label class="upItem add" for="changeUpload">
                                        <i class="icontianjia iconfont"></i>
                                    </label>
                                    <input type="file" accept="image/*" id="changeUpload" @change="upAddImg">
                                </div>
                            </div>
                        </div>
                    </div>-->
                </div>

            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox, RadioGroup, Radio,Tag} from 'view-design'
    import { Tree } from 'iview'
    import editorBar from '../../components/wangEnduit.vue'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/serve/activity'
    import * as app from '@manage/api/app'
    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            Checkbox,
            mixSelect,
            Input,
            RadioGroup,
            Radio,
            Tag,
            editorBar
        }
    })

    export default class addActivity extends Vue {
        @Prop({
            default: false,
        }) checkActivityShow!: boolean;
        @Prop({
            default: [],
        }) stateList!: any;
        @Prop({
            default: [],
        }) typeList!: any;
        @Prop({
            default: '',
        }) detailId!: string;

        @Watch(`checkActivityShow`)
        setHeight() {
            if (this.checkActivityShow) {
                this.getActivity(this.detailId);
            }
        }
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        imgList:any = [`s`];
        areaList: Array<any> = [];
        formHeight:number=600
        personList:any=[
            {name:'郑琪琪'},
        ]
        editActivityShow:boolean = false
        tempObj:any = {
            cover:'',
            address:'',
            name:'',
            typeCode:'',
            sponsor:'',
            sponsorTel:'',
            applyEndTime:'',
            target:'',
            activityPersonNum:'',
            detail:'',
            time:'',
            statusCode:'',
            activityApplies:[],
        }
        actTime:string = ''
        applyEndTime:string = ''
        async getActivity(id:string){
            try {
                this.tempObj = await api.getActivity(id)
                this.actTime = this.tempObj.time
                this.applyEndTime = this.tempObj.applyEndTime
            }catch (e) {
                this.$message.error(`获取详情失败！`)
            }
        }


        get imgportedit() {
            return this.tempObj.cover ? this.$imgDownUrl() + `${this.tempObj.cover}` : null
        }

        upEditImg(e) {
            let fd = new FormData();
            let type = `jpg,jpeg,png`;
            let bool2 = type.indexOf(e.target.files[0].type.replace(`image/`, ``)) > -1;
            if (!bool2) {
                this.$message({
                    showClose: true,
                    message: `图片格式错误！支持格式：jpg,jpeg,png。`,
                    type: 'error'
                });
            } else {
                fd.append("file", e.target.files[0]);
                fd.append("relativePath", '');
                let load:any = this.$loading(this.loaderOption);
                setTimeout(async () => {
                    try {
                        let {data: {id}} = await app.upImg(fd, this.$upBaseUrl());
                        this.tempObj.cover = id;

                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                }, 200);
            }
        }

        async publishActivity(){
            try {
                await api.publishActivity(this.detailId)
                this.$message.success(`发布成功！`);
                this.getActivity(this.detailId);
            }catch (e) {
                this.$message.error(`操作失败！`)
            }
        }
        async unpublishActivity(){
            try {
                await api.unpublishActivity(this.detailId)
                this.$message.success(`取消发布成功！`);
                this.getActivity(this.detailId);
            }catch (e) {
                this.$message.error(`操作失败！`)
            }
        }
        async editActivity() {
            try {
                await api.editActivity(this.tempObj);
                this.$message.success(`修改成功！`)
                this.editActivityShow = false;
            }catch (e) {

            }
        }
        statusCodeChange(code){
            let obj:any = this.stateList.find(item => item.code === code);
            return obj ? obj.name : '-';
        }
        backClose() {
            this.editActivityShow = false
            this.$emit(`close`);
            this.tempObj = {
                cover:'',
                address:'',
                name:'',
                typeCode:'',
                sponsor:'',
                sponsorTel:'',
                applyEndTime:'',
                target:'',
                activityPersonNum:'',
                detail:'',
                time:'',
                statusCode:'',
                activityApplies:[],
            }
            this.actTime = '';
            this.applyEndTime = '';
        }
        setStartTime(val) {
            this.tempObj.time = val;
        }
        setEndTime(val) {
            this.tempObj.applyEndTime = val;
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #addActivity {
        padding: 0 20px;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;

        .addActivityTitle {
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;
            justify-content: space-between;
            flex-wrap: wrap;

            .back {
                display: inline-flex;
                align-items: center;
                color: $theme-color;
                font-size: 14px;
                padding-right: 10px;
                margin-right: 10px;
                height: 16px;
                border-right: 1px solid #dde4eb;
                cursor: pointer;
                user-select: none;

                .iconfont {
                    color: $theme-color;
                    font-size: 12px;
                    line-height: 1;
                    margin-right: 4px;
                    margin-bottom: 2px;
                }
            }
        }

        .contentMain {
            margin: 20px 0;
            height: calc(100% - 100px);
            display: flex;
            justify-content: space-between;
            .contentLeft {
                height: 100%;
                margin-right: 20px;
                .h {
                    display: flex;
                    margin-bottom: 20px;

                    .h1 {
                        display: flex;
                        align-items: center;

                        &:last-child {
                            margin-right: 0;
                        }

                        .label {
                            width: 70px;
                            text-align: right;
                            margin-right: 15px;
                        }
                        .info{
                            width: calc(100% - 95px);
                        }
                    }
                }

            }
            .contentRight{
                height: 100%;
                width: 35%;
                display: flex;
                .border{
                    height: 100%;
                    width: 1px;
                    background-color: #dde4eb;
                    box-shadow: 1px 0px 3px 0px
                    #dde4eb;
                    margin-right: 30px;
                }
                .rightPersonList{
                    width: 100%;
                }
                .topTitle{
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 15px;
                    .left{
                        font-size: 15px;
                        color: #333;
                        font-weight: bolder;
                    }
                    .right{
                        color: #3a7ef3;
                        .icondaochu{
                            padding-right: 3px;
                            font-size: 16px;
                        }
                    }
                }
                .splendidMoment{
                    height: 45%;
                }
            }
        }
        .uplist{
            display: flex;
            flex-wrap: wrap;
            .upItem{
                flex:none;
                width: 90px;
                height: 90px;
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
    }
    .displayarea{
        width: calc(100% - 85px);
        height: 400px;
        border-radius: 4px;
        border:solid 1px #dde4eb;
        padding: 10px;
        background-color:#f8f9fc;
    }
</style>
<style lang="scss">
    #addActivity{
        .el-table::before{

        }
    }
</style>
