<template>
    <el-dialog
            v-if="addCommuntityVisible"
            :visible.sync="addCommuntityVisible"
            custom-class="emDialog"
            width="545px"
            :modal-append-to-body="false"
            top="22vh"
            :close-on-click-modal="false"
            @close="closeAddCommuntity"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            添加小区
        </div>
        <div class="MuModalContent">
            <div class="aline">
                <div class="label"><em class="fontSombal">*</em>小区名称</div>
                <div class="info">
                    <Input placeholder="请输入" v-model="addCommuntityInfo.name" @blur="limitName" necessary></Input>
                </div>
            </div>
            <div class="aline">
                <div class="label"><em class="fontSombal">*</em>小区代码</div>
                <div class="info">
                    <Input placeholder="请输入" v-model="addCommuntityInfo.code" @blur="limitCode" necessary></Input>
                </div>
            </div>
            <div class="aline">
                <div class="label">小区位置</div>
                <div class="info">
                    <Input placeholder="请输入" v-model="addCommuntityInfo.address"></Input>
                </div>
            </div>
            <div class="aline">
                <div class="label">平面图</div>
                <div class="info">
                    <label class="upfile" for="addupload">
                        <img v-if="mapAdd" :src="mapAdd">
                        <i v-else class="icontianjia iconfont"></i>
                    </label>
                    <input type="file" accept="image/*" id="addupload" @change="upAddCommuntityMap">
                </div>
            </div>
        </div>

        <div slot="footer">
            <div class="pmbtn primary" style="margin-right: 10px" @click="addRd">确定</div>
            <div class="pmbtn" @click="closeAddCommuntity">取消</div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox, RadioGroup, Radio} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/house/huoseProperty'
    import * as app from '@manage/api/app'

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
            RadioGroup,
            Radio,
        }
    })
    export default class mainView extends Vue {
        addCommuntityVisible:boolean=false
        subFlag:boolean=true
        rdNameLimit:any=[]
        rdCodeLimit:any=[]
        addCommuntityInfo: any = {
            name: '',
            address: '',
            code: '',
            rdPicId: ''
        }
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        async limitName() {
            if (this.addCommuntityInfo.name !== '') {
                let {data} = await api.getRdBycolumn('name', this.addCommuntityInfo.name)
                if (data.length !== 0) {
                    this.$message.warning('该小区名称已存在，请重新输入')
                    this.addCommuntityInfo.name = ''
                }
            }
        }
        async limitCode(){
            let reg = /^[0-9a-zA-Z]+$/
            if (this.addCommuntityInfo.code !== '') {
                if (!reg.test(this.addCommuntityInfo.code)) {
                    this.$message.warning('请输入数字或字母')
                    this.addCommuntityInfo.code = ''
                }
                else {
                    let {data} = await api.getRdBycolumn('code', this.addCommuntityInfo.code)
                    if (data.length !== 0) {
                        this.$message.warning('该小区代码已存在，请重新输入')
                        this.addCommuntityInfo.code = ''
                    }
                }
            }
        }
        openAddCommuntity(){
            this.addCommuntityVisible=true
        }
        closeAddCommuntity(){
            this.addCommuntityInfo = {
                name: '',
                address: '',
                code: '',
                rdPicId: ''
            }
            this.addCommuntityVisible=false
        }
        get mapAdd() {
            return this.addCommuntityInfo.rdPicId ? this.$imgDownUrl() + `${this.addCommuntityInfo.rdPicId}` : null
        }
        upAddCommuntityMap(e) {
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
                        this.addCommuntityInfo.rdPicId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                }, 200);
            }
        }
        //添加小区
        async addRd() {
            if(this.subFlag){
                this.subFlag = false;
                if (this.$utils.isntNull(this.addCommuntityInfo, {
                    "name": '小区名称',
                    "code": '小区代码',
                })) {
                    try {
                        await api.addrd(this.addCommuntityInfo)
                        this.$message.success(`添加成功`)
                        this.addCommuntityVisible = false
                        this.closeAddCommuntity()
                        this.$emit(`close`)
                    } catch (e) {
                        this.$message.error(`添加失败`)
                    }
                }
            }
            this.subFlag = true;
        }
    }
</script>

<style scoped lang="scss">
    .aline{
        .label{
            width: 70px;
        }
    }
    .fontSombal{
        color: #ff4040;
    }
    input{
        width: 100%;
        height: 36px;
        border-radius: 4px;
        border: solid 1px #dde4eb;
        padding: 0 10px;
    }
</style>
