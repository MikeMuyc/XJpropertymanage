<template>
    <div class="viewbox" ref="viewbox">
        <div class="searchline" ref="searchline">
            <div class="left">
                <mixSelect
                        class="margin"
                        v-model="rdId"
                        :selectList="communityList"
                        labelName="title"
                        valueName="id"
                        placeholder="全部小区"
                        style="width: 140px"
                >
                </mixSelect>
                <mixSelect
                        class="margin"
                        v-model="projectTypeCode"
                        :selectList="setType"
                        labelName="name"
                        valueName="id"
                        placeholder="收费类型"
                        style="width: 140px"
                >
                </mixSelect>
                <mixSelect
                        class="margin"
                        v-model="sharedTypeCode"
                        :selectList="statusList"
                        labelName="name"
                        valueName="code"
                        placeholder="公摊方法"
                        style="width: 140px"
                >
                </mixSelect>

                <div class="margin" style="display: flex;margin-left: 15px">
                    <Input v-model="keyword" placeholder="请输入关键字" style="width: 200px;margin-right: 15px"
                           @enter="getPage()"></Input>
                    <div class="pmbtn primary" @click="getPage()" style="margin-right: 15px">
                        <i class="iconfont iconsousuo"></i>搜索
                    </div>
                    <div class="pmbtn" @click="reset">
                        <i class="iconfont iconzhongzhi"></i>重置
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="pmbtn primary" @click="openDialog">
                    <i class="iconfont icontianjia"></i>新增公摊
                </div>
            </div>
        </div>
        <el-table
                :data="sharedList"
                stripe
                v-loading="loading"
                class="myWisdomTable"
                :height="formHeight">
            <template slot="empty">
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>
            <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="60"
            >
                <template slot-scope="{row,$index}">
                    {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="公摊名称"
                    min-width="120"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="rdName"
                    label="所属小区"
                    min-width="120"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="projectTypeCode"
                    label="收费类型"
                    min-width="80">
                <template slot-scope="{row}">
                    <div v-if="row.projectTypeCode == 2">走表</div>
                    <div v-else-if="row.projectTypeCode == 3">其他</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="projectName"
                    label="收费项目"
                    min-width="120"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="sharedTypeCode"
                    label="公摊方法"
                    min-width="140">
                <template slot-scope="{row}">
                    {{ statusList.find(item => item.code == row.sharedTypeCode).name}}
                </template>

            </el-table-column>
            <el-table-column
                    prop="sharedRadio"
                    label="公摊比例"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="180px"
            >
                <template slot-scope="{row,$index}">
                    <div class="tableEdit">
                        <div class="item" @click="openSetDialog(row)">公摊设置</div>
                        <div class="item" @click="openEditDialog(row)">修改</div>
                        <div class="item delete" @click="deleteApportion(row)">删除</div>
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
        <el-dialog
                v-if="dialogVisible"
                :visible.sync="dialogVisible"
                custom-class="emDialog"
                width="545px"
                @close="closeDialog"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增公摊
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>公摊名称</div>
                    <div class="info">
                        <Input v-model="tempObj.name" placeholder="请输入公摊名称"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>所属小区</div>
                    <div class="info">
                        <mixSelect
                                v-model="tempObj.rdId"
                                :selectList="communityList"
                                labelName="title"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentTo="getProjectList2"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费类型</div>
                    <div class="info">
                        <mixSelect
                                v-model="tempObj.projectTypeCode"
                                :selectList="setType"
                                labelName="name"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentTo="getProjectList2"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费项目</div>
                    <div class="info">
                        <mixSelect
                                :disabled="tempObj.rdId===''||tempObj.projectTypeCode===''"
                                v-model="tempObj.projectId"
                                :selectList="projectList2"
                                labelName="name"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentTo="getpsList"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费标准</div>
                    <div class="info">
                        <mixSelect
                                :disabled="tempObj.projectId===''"
                                v-model="tempObj.psId"
                                :selectList="psList"
                                labelName="name"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>公摊方法</div>
                    <div class="info">
                        <mixSelect
                                v-model="tempObj.sharedTypeCode"
                                :selectList="sharedTypeList"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>公摊比例</div>
                    <div class="info">
                        <Input type="2fixed" v-model="sharedRadio" style="width:80px;margin-right: 10px"
                               placeholder="百分比" necessary></Input>%
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addShared">确定</div>
                <div class="pmbtn" @click="closeDialog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="dialogVisible2"
                custom-class="emDialog"
                width="545px"
                @close="closeDialog"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改公摊
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>公摊名称</div>
                    <div class="info">
                        <Input v-model="tempObj.name" placeholder="请输入公摊名称"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>所属小区</div>
                    <div class="info">
                        <mixSelect
                                v-model="tempObj.rdId"
                                :selectList="communityList"
                                labelName="title"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentTo="getProjectList2"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费类型</div>
                    <div class="info">
                        <mixSelect
                                v-model="tempObj.projectTypeCode"
                                :selectList="setType"
                                labelName="name"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentTo="getProjectList2"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费项目</div>
                    <div class="info">
                        <mixSelect
                                :disabled="tempObj.rdId===''||tempObj.projectTypeCode===''"
                                v-model="tempObj.projectId"
                                :selectList="projectList2"
                                labelName="name"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                @sentTo="getpsList"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费标准</div>
                    <div class="info">
                        <mixSelect
                                :disabled="tempObj.projectId===''"
                                v-model="tempObj.psId"
                                :selectList="psList"
                                labelName="name"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>公摊方法</div>
                    <div class="info">
                        <mixSelect
                                v-model="tempObj.sharedTypeCode"
                                :selectList="sharedTypeList"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>公摊比例</div>
                    <div class="info">
                        <Input type="2fixed" v-model="sharedRadio" style="width:80px;margin-right: 10px"
                               placeholder="百分比" necessary></Input>%
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editShared">确定</div>
                <div class="pmbtn" @click="closeDialog">取消</div>
            </div>
        </el-dialog>

        <apsDialog ref="apsDialog" :curObj="curObj"></apsDialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator"
    import {Page, Icon, Spin, DatePicker} from 'view-design'
    import {Tree} from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/propertyCharge/apportion'
    import apsDialog from './components/apportionSetDialog.vue';
    import * as appData from '@manage/json/apportionComputing'

    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            tabNav,
            mixSelect,
            Input,
            apsDialog
        }
    })

    export default class costStatistics extends Vue {

        @Prop({
            default: false,
        }) setShow!: boolean;

        @Watch(`setShow`)
        setHeight() {
            if (this.setShow) {
                let refs: any = this.$refs;
                //Page组件高度为53px，middleline向下外边距10px
                this.formHeight = (refs.viewbox.clientHeight - refs.searchline.clientHeight) - 15 - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                // this.getcommunityList();
                // this.getSelection(`statusList`, `公摊方式`);
                // this.getSelection(`sharedTypeList`, `公摊方式`);
                this.reset();
            }
        }

        communityList: any = [
            {
                "id": "GLC0000001",
                "title": "南湖小区",
                "parentId": null,
                "expand": false,
                "belongNum": 5,
                "level": 1,
                "checked": false,
                "property": null,
                "children": []
            },
            {
                "id": "GLC0000002",
                "title": "如意苑",
                "parentId": null,
                "expand": false,
                "belongNum": 8,
                "level": 1,
                "checked": false,
                "property": null,
                "children": []
            },
            {
                "id": "GLC0000003",
                "title": "红山小区",
                "parentId": null,
                "expand": false,
                "belongNum": 7,
                "level": 1,
                "checked": false,
                "property": null,
                "children": []
            },
            {
                "id": "GLC0000004",
                "title": "城建大厦",
                "parentId": null,
                "expand": false,
                "belongNum": 3,
                "level": 1,
                "checked": false,
                "property": null,
                "children": []
            },
            {
                "id": "GLC0000005",
                "title": "朝阳明居",
                "parentId": null,
                "expand": false,
                "belongNum": 33,
                "level": 1,
                "checked": false,
                "property": null,
                "children": []
            },
            {
                "id": "GLC0000006",
                "title": "办公室",
                "parentId": null,
                "expand": false,
                "belongNum": 0,
                "level": 1,
                "checked": false,
                "property": null,
                "children": []
            },
            {
                "id": "GLC0000007",
                "title": "朗天峰景",
                "parentId": null,
                "expand": false,
                "belongNum": 31,
                "level": 1,
                "checked": false,
                "property": null,
                "children": []
            },
        ]
        statusList: any = [];
        projectList: any = [];
        projectList2: any = [];
        psList: any = [];
        sharedList: any = [];
        rdId: string = '';
        projectTypeCode: string = '';
        keyword: string = '';
        sharedTypeCode: string = '';

        sharedTypeList: any = [];

        dialogVisible: boolean = false
        dialogVisible2: boolean = false

        setType: any = [
            {
                name: '走表',
                id: '2'
            },
            {
                name: '其他',
                id: '3'
            },
        ]
        tempObj: any = {
            "name": "",
            "rdId": "",
            "projectTypeCode": "",
            "projectId": "",
            "psId": "",
            "sharedTypeCode": "",
            "sharedRadio": 1,
        };
        sharedRadio: number | string = 100;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        formHeight: number = 600;
        loading: boolean = false
        curObj: any = '';
        subFlag: boolean = true;

        mounted() {

        }

        async getcommunityList() {
            let {data} = await api.getTree1();
            this.communityList = data;
        }

        async getSelection(Array: string, name: string) {
            let {data} = await api.getSelection(name);
            this[`${Array}`] = data;
        }

        async getProjectList() {
            try {
                let {data} = await api.getProjectList('', this.rdId);
                this.projectList = data;
            } catch (e) {

            }
        }

        async getProjectList2(val?: any) {
            try {
                let {data} = await api.getProjectList(this.tempObj.projectTypeCode, this.tempObj.rdId);
                this.projectList2 = data || [];
                if (this.projectList2.length === 0) {
                    this.$message.warning(`该小区暂无此类收费项目！`)
                }
            } catch (e) {
                this.projectList2 = [];
                this.$message.warning(`网络连接失败！`)
            }

            if (val !== undefined) {
                this.tempObj.projectId = ''
                this.tempObj.psId = '';
            }
        }

        async getpsList(val?: any) {
            try {
                let {data} = await api.getStandard(this.tempObj.projectId);

                this.psList = [];
                if (data.length === 0) {
                    this.$message.warning(`该收费项目暂无收费标准！`)
                } else {
                    data.forEach(item => {
                        if (item.apportionCode === `1`) {
                            this.psList.push(item)
                        }
                    })
                    if (this.psList.length === 0) {
                        this.$message.warning(`该收费项目暂无公摊类型的收费标准！`)
                    }
                }

            } catch (e) {

            }
            if (val !== undefined) {
                this.tempObj.psId = ''
            }
        }

        code: any = null

        async getApportionList() {
            this.loading = true;
            let {content, totalElements} = appData.apportinSetList
            this.sharedList = content;
            this.pages.totalElements = totalElements;
            this.loading = false;
            /*try {
                let {data: {content, totalElements}} = await api.getApportionList({
                    keyword: this.keyword,
                    pageNum: this.pages.pageNum,
                    pageSize: this.pages.pageSize,
                    projectTypeCode: this.projectTypeCode,
                    rdId: this.rdId,
                    sharedTypeCode: this.sharedTypeCode,
                });
                this.sharedList = content;
                this.pages.totalElements = totalElements;
                this.loading = false;
            } catch (e) {
                this.loading = false;
            }*/
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getApportionList();
        }

        reset() {
            this.keyword = '';
            this.projectTypeCode = '';
            this.rdId = '';
            this.sharedTypeCode = '';
            this.getPage();
        }

        async addShared() {
            if (this.subFlag) {
                this.subFlag = false;
                this.tempObj.sharedRadio = Number(this.sharedRadio) / 100
                if (this.$utils.isntNull(
                    this.tempObj,
                    {
                        "name": `公摊名称`,
                        "rdId": '所属小区',
                        "projectTypeCode": '收费类型',
                        "projectId": '收费项目',
                        "psId": '收费标准',
                        "sharedTypeCode": '公摊方法',
                        "sharedRadio": '公摊比例'
                    })) {
                    try {
                        await api.addApportion(this.tempObj);
                        this.closeDialog();
                        this.reset();
                        this.$message.success(`新增规则成功！`)
                    } catch (e) {
                        this.$message.success(`新增失败！`)
                    }
                }

                this.subFlag = true;
            }

        }

        async editShared() {
            if (this.subFlag) {
                this.subFlag = false;
                this.tempObj.sharedRadio = Number(this.sharedRadio) / 100
                if (this.$utils.isntNull(
                    this.tempObj,
                    {
                        "name": `公摊名称`,
                        "rdId": '所属小区',
                        "projectTypeCode": '收费类型',
                        "projectId": '收费项目',
                        "psId": '收费标准',
                        "sharedTypeCode": '公摊方法',
                    })) {
                    try {
                        await api.editApportion(this.tempObj);
                        this.closeDialog();
                        this.reset();
                        this.$message.success(`修改规则成功！`)
                    } catch (e) {
                        this.$message.success(`新增失败！`)
                    }
                }
                this.subFlag = true;
            }

        }

        openDialog() {
            this.dialogVisible = true
        }

        closeDialog() {
            this.dialogVisible = false
            this.dialogVisible2 = false
            setTimeout(() => {
                this.tempObj = {
                    "name": "",
                    "rdId": "",
                    "projectTypeCode": "",
                    "projectId": "",
                    "psId": "",
                    "sharedTypeCode": "",
                    "sharedRadio": 1,
                };
                this.sharedRadio = 100;
            }, 500)

        }

        openSetDialog(obj: any) {
            let refs: any = this.$refs;
            refs.apsDialog.groupShow = true;
            this.curObj = obj
        }

        openEditDialog(row) {
            this.sharedRadio = Number(this.tempObj.sharedRadio) * 100 || 100;
            this.getProjectList2();
            this.tempObj = row;
            this.getpsList();
            console.log(this.tempObj)
            this.dialogVisible2 = true
        }

        projectSearch(val) {
            console.log(val)
        }

        deleteApportion(row) {
            this.$confirm('您真的要删除这条公摊规则吗？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await api.deleteApportion([row.id])
                    this.reset();
                    this.$message.success(`删除成功！`)
                } catch (e) {
                    this.$message.error(`删除失败！`)
                }
            }).catch(() => {

            });
        }

    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    .searchline {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .left {
            display: flex;

            .pmbtn {
                flex: none;
            }

            .margin {
                margin-right: 15px;
                margin-bottom: 20px;
                flex: none;
            }

            > .item {
                height: 36px;
                display: inline-flex;
                align-items: center;
            }
        }

        .right {
            .pmbtn {
                margin-right: 5px;
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

    .advanceContent {
        margin: -20px -20px 15px;
        flex-wrap: wrap;

        .tit {
            height: 40px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;
            margin-bottom: 15px;
            font-weight: bolder;
        }

        .halfPart {
            width: 50%;
            height: 460px;
            padding: 0 20px;

            &.shadow {
                border-right: 1px solid #eaf0f6;
            }
        }
    }
</style>
<style lang="scss">

</style>
