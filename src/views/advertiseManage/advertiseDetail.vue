<template>
    <div id="addAdvertise">
        <div class="costTitle">
            <div class="left">
                <div class="back" @click="backClose">
                    <i class="iconfont iconfanhui"></i>返回
                </div>
                广告详情
            </div>
            <div class="right">
                <div v-show="!editFlag" class="pmbtn primary" @click="editFlag = true">
                    编辑
                </div>
                <div v-show="editFlag" class="pmbtn" style="margin-right: 15px" @click="editFlag = false">
                    取消
                </div>
                <div v-show="editFlag" class="pmbtn primary" @click="editAdv">
                    确定
                </div>

            </div>
        </div>
        <div class="content">
            <div class="contentbox">
                <div class="contItem">
                    <div class="label">
                        <i>*</i>广告标题
                    </div>
                    <div class="right">
                        <Input v-model="tempObj.adTitle" placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <!--<div class="contItem">
                    <div class="label">
                        <i>*</i>绑定合同
                    </div>
                    <div class="right">
                        <Input placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>-->
                <div class="contItem">
                    <div class="label">
                        <i>*</i>签约甲方
                    </div>
                    <div class="right">
                        <Input v-model="tempObj.adOwner" placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>

                <div class="contItem" style="z-index: 3">
                    <div class="label">
                        <i>*</i>起始时间
                    </div>
                    <div class="right">
                        <DatePicker
                                v-model="adStartTime"
                                type="date"
                                format="yyyy-MM-dd"
                                placeholder="起始时间"
                                style="width: 100%"
                                ref="StartTime"
                                @on-change="setStartTime"
                                :disabled="!editFlag"
                        ></DatePicker>
                    </div>
                </div>
                <!--<div class="contItem">
                    <div class="label">
                        <i>*</i>结束时间
                    </div>
                    <div class="right">
                        <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" :disabled="!editFlag"></DatePicker>
                    </div>
                </div>-->
                <div class="contItem">
                    <div class="label">
                        展示期限
                    </div>
                    <div class="right">
                        <Input type="number" v-model="tempObj.adDuration" placeholder="请输入" :disabled="!editFlag"></Input>
                    </div>
                </div>
                <div class="contItem" style="width: 100%">
                    <div class="label">
                        <i>*</i>宣传图片
                    </div>
                    <div v-if="editFlag" class="right upfilelist">
                        <div class="upfilebox" v-for="(item,index) in tempObj.fileStorages">
                            <img :src="imgportadd(item)">
                            <div class="delete" @click="deleteUplist(index)">删除</div>
                        </div>
                        <label class="upfile" for="editUpload" style="width: 70px;height: 70px">
                            <i class="icontianjia iconfont"></i>
                        </label>
                        <input type="file" accept="image/*" id="editUpload" @change="upeditImg">
                    </div>
                    <div v-else class="right upfilelist">
                        <div class="upfilebox" v-for="(item,index) in tempObj.fileStorages">
                            <img :src="imgportadd(item)">
                        </div>
                        <label class="upfile" style="width: 70px;height: 70px">
                            <i class="icontianjia iconfont"></i>
                        </label>
                    </div>
                </div>
                <div class="contItem" style="width: 100%;align-items: flex-start;z-index: 1">
                    <div class="label">
                        <i>*</i>广告内容
                    </div>
                    <div class="right">
                        <editorBar v-if="editFlag" v-model="detail"></editorBar>
                        <div v-else class="info displayarea" v-html="tempObj.adContent"></div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import editorBar from '@manage/components/wangEnduit.vue'

    import * as app from '@manage/api/app'
    import * as api from '@manage/api/advertise'
    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            Checkbox,
            tabNav,
            mixSelect,
            Input,
            editorBar
        }
    })

    export default class addAdvertise extends Vue {
        @Prop({
            default: false,
        }) detailFlag!: boolean;
        @Prop({
            default: '',
        }) detailId!: string;
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        editFlag:boolean = false;
        tempObj:any = {
            "adContent": "<p>请输入</p>",
            "adDuration": 10,

            "adOwner": "",
            "adStartTime": "",
            "adTitle": "",

            "expired": 0,
            "fileStorages": [],
            "publishState": 0,
            "topState": 0,
        }
        adStartTime:string = '';
        detail:string = '';
        @Watch(`detailFlag`)
        setHeight() {
            if (this.detailFlag) {
                this.getAdvertisementDetail(this.detailId);
            }
        }
        mounted() {

        }
        async getAdvertisementDetail(id){
            try {
                this.tempObj = await api.getAdvertisementDetail(id)
                this.adStartTime = this.tempObj.adStartTime;
                this.detail = this.tempObj.adContent;
            }catch (e) {
                this.$message.error(`获取详情失败！`)
            }

        }

        backClose(){
            this.$emit(`close`);
            this.editFlag = false;
            this.tempObj = {
                "adContent": "<p>请输入</p>",
                "adDuration": 10,

                "adOwner": "",
                "adStartTime": "",
                "adTitle": "",

                "expired": 0,
                "fileStorages": [],
                "publishState": 0,
                "topState": 0,
            }
            this.adStartTime = ''
        }

        imgportadd(src) {
            return src ? this.$imgDownUrl() + `${src}` : null
        }
        deleteUplist(index) {
            this.tempObj.fileStorages.splice(index, 1);
        }
        upeditImg(e) {
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
                        this.tempObj.fileStorages.push(id);
                        this.$message.success(`上传成功！`)
                        console.log(this.tempObj.fileStorages)
                    } catch (e) {
                        this.$message.error(`上传失败!`)

                    }
                    load.close()
                }, 200);
            }
        }
        setStartTime(val) {
            this.tempObj.adStartTime = val;
        }

        async editAdv(){
            if (this.$utils.isntNull(
                this.tempObj,
                {
                    "adTitle": `广告名称`,
                    "adOwner": '广告主',
                    "adStartTime": '起始时间',
                })) {
                if(this.tempObj.adDuration == 0 ){
                    this.$message.warning(`展示期限不能为0！`);
                    this.tempObj.adDuration = 1
                }
                else{
                    try {
                        await api.editAdvertisement(this.tempObj);
                        this.editAdv2();

                    }catch (e) {
                        this.$message.error(`修改失败！`)
                    }
                }
            }
        }
        async editAdv2(){
            try {
                await api.editadvertisement2({
                    "adId": this.detailId,
                    "content": this.detail,
                });
                this.tempObj.adContent = this.detail
                this.$message.success(`修改成功！`)
                this.editFlag = false;
            }catch (e) {
                this.$message.error(`修改失败！`)
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";
    #addAdvertise {
        padding: 0 15px;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        .costTitle{
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;
            .left{
                display: inline-flex;
                align-items: center;
                .back{
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
                    .iconfont{
                        color: $theme-color;
                        font-size: 12px;
                        line-height: 1;
                        margin-right: 4px;
                        margin-bottom: 2px;
                    }
                }
            }

        }
        .content{
            height: calc(100% - 60px);
            display: flex;
            padding: 20px 0;
            justify-content: center;
            .contentbox{
                display: inline-flex;
                width: 1180px;
                height: 100%;
                margin-right: 54px;
                flex-wrap: wrap;
                align-items: flex-start;
                align-content: flex-start;
                .contItem{
                    display: inline-flex;
                    align-items: center;
                    width: 33.33%;
                    min-height: 36px;
                    margin-bottom: 20px;
                    .label{
                        width: 120px;
                        text-align: right;
                        margin-right: 15px;
                        i{
                            color: red;
                        }
                    }
                    .right {
                        flex:1;

                    }
                }
            }
        }
    }


    .detailarea{
        width: 100%;
        height: 50vh;
        &:disabled{
            background-color: #f8f9fc;
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
    .displayarea{
        width: calc(100% - 85px);
        height: 400px;
        border-radius: 4px;
        border:solid 1px #dde4eb;
        padding: 10px;
        background-color:#f8f9fc;
    }
</style>
