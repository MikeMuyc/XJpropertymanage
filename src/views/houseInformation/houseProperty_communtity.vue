<template>
    <div  id="community" ref="community">
        <div class="costTitle" ref="costTitle" >
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            小区管理
        </div>
        <div class="searchline" ref="searchline">
            <div class="left">
                <i class="iconfont iconxiaoqu"></i>
                <em>小区管理</em>
            </div>
            <div class="right">
                <div class="pmbtn primary" @click="openAddcommuntity">
                    <i class="iconfont icontianjia"></i>添加小区
                </div>
            </div>
        </div>
        <el-table
                :data="rdList"
                stripe
                :height="formHeight"
                :header-cell-style="{background:'#f4f6f9'}"
                v-loading="loading"
        >
            <template slot="empty" >
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>
            <el-table-column
                    label="序号"
                    align="center"
                    width="80"
                    v-loading="loading"
                    >
                <template slot-scope="{row,$index}">
                    {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    min-width="120"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="代码"
                    min-width="120"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="所在位置"
                    min-width="150"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="160px"
            >
                <template slot-scope="{row}">
                    <div class="tableEdit">
                        <div class="item" @click="openRoomImage(row.rdPicId)">平面图</div>
                        <div class="item" @click="openEditCommuntity(row.id)">编辑</div>
                        <div class="item delete" @click="deleteRd(row.id)">删除</div>
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
        <addCommuntity ref="addCommuntity" @close="getRdList"></addCommuntity>
        <el-dialog
                :visible.sync="editCommuntityVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                top="22vh"
                :close-on-click-modal="false"
                v-if="editCommuntityVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改小区信息
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>小区名称</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="rdInfoById.name" @blur="limitName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>小区代码</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="rdInfoById.code" @blur="limitCode" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">小区位置</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="rdInfoById.address"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">平面图</div>
                    <div class="info">
                        <label class="upfile" for="editupload">
                            <img v-if="mapEdit" :src="mapEdit">
                            <i v-else class="icontianjia iconfont"></i>
                        </label>
                        <input type="file" accept="image/*" id="editupload" @change="upEditCommuntityMap">
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="updateRdInfo">确定</div>
                <div class="pmbtn" @click="editCommuntityVisible = false">取消</div>
            </div>
        </el-dialog>
        <viewMap ref="viewMap"></viewMap>
        {{code}}
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox, RadioGroup, Radio} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import viewMap from './components/viewMap.vue'
    import * as api from '@manage/api/house/huoseProperty'
    import * as app from '@manage/api/app'
    import addCommuntity from './components/addCommunity.vue'
    import * as organization from '@manage/json/houseData'
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
            viewMap,
            addCommuntity
        }
    })

    export default class commounity extends Vue {
        @Prop({
            default: false,
        }) communityMnagementFalg!: boolean;

        @Watch(`communityMnagementFalg`)
        setHeight() {
            if (this.communityMnagementFalg) {
                let refs: any = this.$refs;
                setTimeout(() => {
                    //Page组件高度为53px
                    this.formHeight = (refs.community.clientHeight - refs.searchline.clientHeight - refs.costTitle.clientHeight) - 40 - 53;
                    this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                    console.log(refs.community.clientHeight)
                    this.getRdList();
                    this.getPage()
                },300)
            }
        }
        unitFalg:boolean=false
        unitFlagSome:boolean=false
        heightTable: number = 8*48 + 49;
        formHeight: number = 600;
        keywords: string = ''
        nameAndCode:any={
            name:'',
            code:''
        }
        pages: any = {
            pageNum: 1,
            pageSize: 15,
            totalElements: 0,
        };
        imageUrl: string = ''
        rdList: any = []
        rdInfoById: any = []
        editCommuntityVisible: boolean = false
        loading: boolean = true;
        subFlag: boolean = true


        mounted(): void {

        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getRdList()
        }

        backClose() {
            this.$emit(`close`)
        }
        async limitName() {
            if (this.rdInfoById.name !== '') {
                let {data} = await api.getRdBycolumn('name', this.rdInfoById.name)
                if (data.length !== 0&&data[0].name!==this.nameAndCode.name) {
                    this.$message.warning('该小区名称已存在，请重新输入')
                    this.rdInfoById.name = ''
                }
            }
        }
        async limitCode() {
            if (this.rdInfoById.code !== '') {
                let reg = /^[0-9a-zA-Z]+$/
                    if (!reg.test(this.rdInfoById.code)) {
                        this.$message.warning('请输入数字或字母')
                        this.rdInfoById.code = ''
                    }
                else {
                    let {data} = await api.getRdBycolumn('code', this.rdInfoById.code)
                    if (data.length !== 0&&data[0].code!==this.nameAndCode.code) {
                        this.$message.warning('该小区代码已存在，请重新输入')
                        this.rdInfoById.code = ''
                    }
                }
            }
        }

        //查询小区详细信息
        async openEditCommuntity(id) {
            try {
                let {data} = await api.getRdInfoById(id);
                this.rdInfoById = data
                this.editCommuntityVisible = true
            } catch (e) {
                this.$message.error('获取小区信息失败！')
            }
            this.nameAndCode.name=this.rdInfoById.name
            this.nameAndCode.code=this.rdInfoById.code
        }
        openAddcommuntity(){
            let refs:any = this.$refs;
            refs.addCommuntity.openAddCommuntity()
        }

        code:any =null;
        //查询小区列表
        async getRdList() {
            this.loading = true
           // let {data} = await api.getRd(this.pages.pageNum, this.pages.pageSize)
            let data = organization.organizationPage;
            this.rdList = data.content
            this.pages.totalElements = data.totalElements
            this.loading = false
        }

        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };


        //修改小区信息
        async updateRdInfo() {
            if(this.subFlag){
                this.subFlag = false;
                if (this.$utils.isntNull(this.rdInfoById, {
                    "name": '小区名称',
                    "code": '小区代码',
                })) {
                    try {
                        await api.updateRdInfo(this.rdInfoById)
                        this.$message.success('修改成功')
                        this.editCommuntityVisible = false
                        this.getRdList()
                    } catch (e) {
                        this.$message.error('修改失败')
                    }
                }
            }
            this.subFlag = true;
        }

        //删除小区
        async deleteRd(id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该信息, 是否继续?',
                '操作提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            var ids: any = []
            ids = id.split('/t')
            try {
                await api.deleteRd(ids)
                this.$message.success('删除成功')
                if(this.rdList.length===1&&(this.pages.pageNum>1)){
                    this.pages.pageNum--
                }
                this.getRdList()
            } catch (e) {
                this.$message.error('删除失败')
            }
        }

        get mapEdit() {
            return this.rdInfoById.rdPicId ? this.$imgDownUrl() + `${this.rdInfoById.rdPicId}` : null
        }

        upEditCommuntityMap(e) {
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
                        this.rdInfoById.rdPicId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                }, 200);
            }
        }

        //查看平面图
        openRoomImage(imgsrc) {
            let src:string = imgsrc ? this.$imgDownUrl() + `${imgsrc}` : null;
            if (src) {
                let refs:any = this.$refs;
                refs.viewMap.openMap(src)
            } else {
                this.$message.warning(`该小区暂无平面图！`)
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #community {

        padding:0 20px ;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;

        .costTitle {
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;

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

        .searchline {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            align-items: center;

            .left {
                .iconxiaoqu {
                    color: #3a7ef3;
                    padding-right: 10px;
                }

                em {
                    font-size: 16px;
                    color: #30374a;
                    font-weight: bolder;
                }
            }

            .right {
            }
        }
    }

    .tableEdit {
        display: inline-flex;
        user-select: none;

        > .item {
            margin-right: 15px;
            color: $second-font-color;
            cursor: pointer;

            &:last-child {
                margin-right: 0;
            }

            &:hover {
                color: $theme-color;
            }

            &.delete:hover {
                color: $error-color;
            }
        }
    }

    .aline {
        .label {
            //width: 100px;
        }
    }

    .alineImage {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .imageText {
            font-size: 16px;
            color: #30374a;
        }

        .imageShow {
            width: 100%;
            height: 450px;
            background-color: #f8f9fc;
            margin-top: 12px;

            .avatar {
                height: 100%;
                width: 100%;
                display: block;
            }

            .infoImage {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .iconzanwutupian2 {
                    font-size: 100px;
                    color: #dde4eb;
                }

                em {
                    color: #a0a5a9;
                }
            }
        }
    }

    .avatar-uploader {
        width: 80px;
        height: 50px;
        border-radius: 4px;
        border: dashed 1px #dde4eb;
        cursor: pointer;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .avatar-uploader-icon {
        width: 20px;
        height: 20px;
        color: #c6c9ce;
        font-size: 20px;
    }

    .avatar-uploader1 {
        display: inline-block;
    }

    .ivu-radio-wrapper {
        margin-right: 30px;
    }
    .fontSombal{
        color: #ff4040;
    }
</style>
<style lang="scss">
    .el-table__expanded-cell[class*=cell] {
        padding: 0;
    }

    .el-table__expand-icon {
        .el-icon-arrow-right:before {
            background: url("../../images/新建层级.png") no-repeat;
            content: '';
            display: block;
            width: 16px;
            height: 16px;
            font-size: 16px;
            background-size: 14px;
        }
    }

    .el-table__expand-icon.el-table__expand-icon--expanded {
        transform: rotate(0deg);

        .el-icon-arrow-right:before {
            background: url("../../images/删除层级.png") no-repeat;
            content: '';
            display: block;
            width: 16px;
            height: 16px;
            font-size: 16px;
            background-size: 14px;
        }
    }
</style>
