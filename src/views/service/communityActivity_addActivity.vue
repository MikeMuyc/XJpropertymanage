<template>
    <div id="addActivity">
        <div class="addActivityTitle">
            <div style="display: flex;align-items: center">
                <div class="back" @click="backClose">
                    <i class="iconfont iconfanhui"></i>返回
                </div>
                新增活动
            </div>
            <div class="item">
                <!--<div class="pmbtn" @click="" style="margin-right: 15px;font-size: 14px">
                    取消
                </div>-->
                <div class="pmbtn" @click="addAacitvity(-1)" style="margin-right: 15px;font-size: 14px">
                    保存
                </div>
                <div class="pmbtn primary" @click="addAacitvity(0)" style="font-size: 14px">
                    发布
                </div>
            </div>
        </div>
        <div class="contentMain">
            <vue-perfect-scrollbar class="content">
                <div class="h">
                    <div class="h1">
                        <div class="label">
                            <em>*</em>
                            活动名称
                        </div>
                        <Input v-model="tempObj.name" style="width: 280px;margin-left: 15px" placeholder="请输入"></Input>
                    </div>
                    <div class="h1">
                        <div class="label">
                            <em>*</em>
                            活动类型
                        </div>
                        <mixSelect
                                v-model="tempObj.typeCode"
                                class="margin"
                                :selectList="typeList"
                                labelName="name"
                                valueName="code"
                                placeholder="请输入"
                                style="width:280px;margin-left: 15px"
                        >
                        </mixSelect>
                    </div>
                    <div class="h1">
                        <div class="label">
                            <em>*</em>
                            活动地点
                        </div>
                        <Input v-model="tempObj.address" style="width: 280px;margin-left: 15px"
                               placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="h">
                    <div class="h1">
                        <div class="label">
                            <em>*</em>
                            活动时间
                        </div>
                        <DatePicker
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="开始时间"
                                style="width: 280px;margin-left: 15px"
                                @on-change="setStartTime"
                        ></DatePicker>
                    </div>
                    <div class="h1">
                        <div class="label">
                            <em>*</em>
                            主办方
                        </div>
                        <Input v-model="tempObj.sponsor" style="width: 280px;margin-left: 15px"
                               placeholder="请输入"></Input>
                    </div>
                    <div class="h1">
                        <div class="label">
                            <em>*</em>
                            咨询电话
                        </div>
                        <Input v-model="tempObj.sponsorTel" style="width: 280px;margin-left: 15px"
                               placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="h">
                    <div class="h1">
                        <div class="label">
                            <em>*</em>
                            报名截止
                        </div>
                        <DatePicker
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="请选择"
                                style="width: 280px;margin-left: 15px"
                                @on-change="setEndTime"
                        ></DatePicker>
                    </div>
                    <div class="h1">
                        <div class="label">
                            人数上限
                        </div>
                        <Input v-model="tempObj.activityPersonNum" style="width: 280px;margin-left: 15px"
                               placeholder="请输入" type="number"></Input>
                    </div>
                    <div class="h1">
                        <div class="label">
                            <em>*</em>
                            面向群体
                        </div>
                        <Input v-model="tempObj.target" style="width: 280px;margin-left: 15px"
                               placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="h">
                    <div class="h1">
                        <div class="label">
                            封面图片
                        </div>
                        <div style="margin-left: 15px">
                            <label class="upfile" for="addupload" style="width: 96px;height: 54px">
                                <img v-if="imgportadd" :src="imgportadd">
                                <i v-else class="icontianjia iconfont"></i>
                            </label>
                            <input type="file" accept="image/*" id="addupload" @change="upAddImg">
                        </div>
                        <div style="margin-left: 20px;color: #a0a5a9;">
                            <em>*</em>
                            <i style="margin: 0 15px 0 4px">图片规格: 960 x 480、1920 x 1080</i>
                            <i>上传格式: jpg、jpeg、png</i>
                        </div>
                    </div>
                </div>
                <div class="h">
                    <div class="h1" style="width: 100%;align-items: flex-start">
                        <div class="label" style="margin-top: 10px;margin-right: 15px;flex: none">
                            <em>*</em>
                            详细内容
                        </div>
                        <editorBar v-model="tempObj.detail" :isClear="isClear"
                                   :content="tempObj.detail"></editorBar>
                    </div>
                </div>
            </vue-perfect-scrollbar>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import {Page, Icon, Spin, DatePicker, Checkbox, RadioGroup, Radio} from 'view-design'
    import {Tree} from 'iview'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import editorBar from '../../components/wangEnduit.vue'
    import * as app from '@manage/api/app'
    import * as api from '@manage/api/serve/activity'

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
            editorBar
        }
    })

    export default class addActivity extends Vue {
        @Prop({
            default: [],
        }) stateList!: any;
        @Prop({
            default: [],
        }) typeList!: any;
        @Prop({
            default: [],
        }) rdId?: string;
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };

        isClear: boolean = false

        tempObj: any = {
            cover: '',
            address: '',
            name: '',
            typeCode: '',
            sponsor: '',
            sponsorTel: '',
            applyEndTime: '',
            target: '',
            activityPersonNum: '',
            detail: '<p>请输入</p>',
            time: '',
            statusCode: -1,
            rdId:''
        }


        get imgportadd() {
            return this.tempObj.cover ? this.$imgDownUrl() + `${this.tempObj.cover}` : null
        }

        upAddImg(e) {
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

        backClose() {
            this.$emit(`close`);
            this.tempObj = {
                cover: '',
                address: '',
                name: '',
                typeCode: '',
                sponsor: '',
                sponsorTel: '',
                applyEndTime: '',
                target: '',
                activityPersonNum: '',
                detail: '<p>请输入</p>',
                time: '',
                statusCode: -1,
            }
        }


        setEndTime(val) {
            this.tempObj.applyEndTime = val;
        }

        setStartTime(val) {
            this.tempObj.time = val;
        }

        async addAacitvity(type:number) {
            if (this.$utils.isntNull(
                this.tempObj,
                {
                    "name": `活动名称`,
                    "typeCode": '活动类型',
                    "address": '活动地点',
                    "time": '活动时间',
                    "sponsor": '主办方',
                    "sponsorTel": '联系方式',
                    "applyEndTime": '截止时间',
                    "target": '面向群体',
                })) {
                try {
                    this.tempObj.statusCode = type;
                    if(this.rdId){
                        this.tempObj.rdId = this.rdId
                    }
                    await api.addActivity(this.tempObj);
                    this.$message.success(`新增成功！`);
                    this.backClose();
                }catch (e) {

                }
            }

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
            align-items: center;

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
            justify-content: center;

            .content {
                height: 100%;
                width: 1200px;
                padding-right: 40px;

                .h {
                    display: flex;
                    margin-bottom: 20px;
                    justify-content: space-between;

                    .h1 {
                        display: flex;
                        align-items: center;

                        &:last-child {
                            margin-right: 0;
                        }

                        em {
                            color: #ff4040;
                        }

                        .label {
                            width: 70px;
                            text-align: right;
                        }
                    }
                }

            }
        }
    }
</style>
