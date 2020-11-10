<template>
    <div id="chargeParamProjectList" ref="rightMain">
        <div class="middleline" ref="middleline">
            <div class="leftIcon">
                <div class="iconfont iconxiaoqu"></div>
            </div>
            <div class="center">
                <div class="title">{{communityData.name}}</div>
                <div class="info">
                    <div class="iconfont iconxiangmu"></div>
                    收费项目：{{projectList.length || 0}}个
                </div>
            </div>
            <div class="pmbtn primary" @click="addProjectShow" style="margin-right: 15px">
                <i class="iconfont icontianjia"></i>新增项目
            </div>
        </div>
        <el-table
                :data="projectList"
                stripe
                class="myWisdomTable"
                :height="formHeight"
                v-loading="loading"
        >
            <template slot="empty" >
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>

            <el-table-column
                    prop="name"
                    label="项目名称"
                    min-width="120px"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="projectCode"
                    label="项目编码"
                    min-width="120px"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop=""
                    label="项目类型"
                    width="100px"
            >
                <template slot-scope="{row}">
                    <div v-if="row.projectTypeCode === '1'">常规</div>
                    <div v-else-if="row.projectTypeCode === '2'">走表</div>
                    <div v-else-if="row.projectTypeCode === '3'">其他</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="lateFeeNeed"
                    label="是否收取滞纳金"
                    min-width="150px"
            >
                <template slot-scope="{row}">
                    {{row.lateFeeNeed==1 ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="lateFeeRate"
                    label="滞纳金比例"
                    min-width="150px"
            >
                <template slot-scope="{row}">
                    {{(Number(row.lateFeeRate) * 100).toFixed(2)}}%
                </template>
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="项目说明"
                    min-width="150px"
                    show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="160px"
            >
                <template slot-scope="{row}">
                    <div class="tableEdit">
                        <div class="item" @click="copyProjectDialog = true;copyProjectId=row.id">复制</div>
                        <div class="item" @click="openEditPriject(row.id)">编辑</div>
                        <div class="item delete" @click="deleteProject(row.id)">删除</div>
                    </div>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog
                v-if="addProjectDialog"
                :visible.sync="addProjectDialog"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                custom-class="emDialog"
                width="550px"
                @close="closeAddProject"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增项目
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>所属小区</div>
                    <div class="info">
                        <mixSelect
                                disabled
                                class="margin"
                                :selectList="buildingTree"
                                labelName="name"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="tempProjectObject.rdId"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目名称</div>
                    <div class="info">
                        <Input v-model="tempProjectObject.name" placeholder="请输入项目名称" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目类型</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="projectTypeList"
                                labelName="name"
                                valueName="code"
                                placeholder="收费项目"
                                style="max-width: 100%"
                                v-model="tempProjectObject.projectTypeCode"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目编码</div>
                    <div class="info">
                        <Input v-model="tempProjectObject.projectCode" placeholder="请输入项目编码" @blur="checkCode" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">项目说明</div>
                    <div class="info">
                        <textarea v-model="tempProjectObject.description" style="width: 100%;"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>是否收取滞纳金</div>
                    <div class="info">
                        <RadioGroup v-model="tempProjectObject.lateFeeNeed">
                            <Radio :label='1' style="margin-right: 10px">是</Radio>
                            <Input type="2fixed" v-model="tempLateFeeRate"
                                   style="width: 80px;display: inline-block;margin-right: 10px;"
                                   :disabled="tempProjectObject.lateFeeNeed == 0"></Input>%
                            <Radio :label='0' style="margin-left: 20px;">否</Radio>
                        </RadioGroup>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addProject">确定</div>
                <div class="pmbtn" @click="closeAddProject">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                v-if="editProjectDialog"
                :visible.sync="editProjectDialog"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                custom-class="emDialog"
                width="550px"
                @close="closeAddProject"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改项目
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>所属小区</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="buildingTree"
                                labelName="name"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="tempProjectObject.rdId"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目名称</div>
                    <div class="info">
                        <Input v-model="tempProjectObject.name" placeholder="请输入项目名称" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目类型</div>
                    <div class="info">
                        <mixSelect
                                :disabled="true"
                                class="margin"
                                :selectList="projectTypeList"
                                labelName="name"
                                valueName="code"
                                placeholder="收费项目"
                                style="max-width: 100%"
                                v-model="tempProjectObject.projectTypeCode"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目编码</div>
                    <div class="info">
                        <Input v-model="tempProjectObject.projectCode" placeholder="请输入项目编码" @blur="checkCode" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">项目说明</div>
                    <div class="info">
                        <textarea v-model="tempProjectObject.description" style="width: 100%;"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>是否收取滞纳金</div>
                    <div class="info">
                        <RadioGroup v-model="tempProjectObject.lateFeeNeed">
                            <Radio :label='1' style="margin-right: 10px">是</Radio>
                            <Input type="2fixed" v-model="tempLateFeeRate"
                                   style="width: 80px;margin-right: 10px;display: inline-block"
                                   :disabled="tempProjectObject.lateFeeNeed == 0"></Input>%
                            <Radio :label='0' style="margin-left: 20px">否</Radio>
                        </RadioGroup>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editProject">确定</div>
                <div class="pmbtn" @click="closeAddProject">取消</div>
            </div>
        </el-dialog>

        <el-dialog
                :visible.sync="copyProjectDialog"
                :modal-append-to-body="false"
                custom-class="emDialog"
                width="550px"
                @close="closeCopyProject"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                复制项目
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">选择小区</div>
                    <div class="info">
                        <Select v-model="selectBuilding" multiple style="width:100%;min-height: 36px;border-radius: 4px;">
                            <Option v-for="item in buildingTree" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="copyProject">确定</div>
                <div class="pmbtn" @click="closeCopyProject">取消</div>
            </div>
        </el-dialog>
    </div>

</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import { Page, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox, Select, Option} from 'view-design';

    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import * as api from '@manage/api/propertyCharge/chargeParam'
    import * as paramData from '@manage/json/chargeParam'

    @Component({
        components: {
            Page,
            DatePicker,
            RadioGroup,
            Radio,
            CheckboxGroup,
            Checkbox,
            Select,
            Option,
            Input,
            mixSelect,
        }
    })

    export default class chargeParamProjectList extends Vue {
        @Prop({
            default:  '',
        }) rdId!: string;
        @Prop({
            default: [],
        }) buildingTree!: any;
        @Prop({
            default: [],
        }) projectTypeList!: any;
        @Watch('rdId')
        setPagesize(){
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;

            let middleline = refs.middleline.clientHeight + 20;

            //Page组件高度为53px，rightTitle:46,middleline:152

            this.formHeight = maxHeight - middleline - 10;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);

            this.getProjectList();
            this.getProjectDetail();
        }
        projectList:Array<any>  = [];
        loading:boolean = false;
        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };

        addProjectDialog: boolean = false;
        editProjectDialog: boolean = false;
        tempLateFeeRate:number = 0;
        tempProjectObject: any = {
            description: "",
            lateFeeNeed: 0,
            lateFeeRate: 0,
            name: "",
            projectCode: "",
            projectTypeCode: "",
            rdId: ""
        };
        tempProjectObject1: any = {
            description: "",
            lateFeeNeed: 0,
            lateFeeRate: 0,
            name: "",
            projectCode: "",
            projectTypeCode: "",
            rdId: ""
        };
        communityData:any = {
            name:'',
        }

        subFlag: boolean = true;
        copyProjectDialog: boolean = false;
        copyProjectId: string = ''
        selectBuilding: Array<any> = []

        mounted() {
            this.$nextTick(()=>{
                if(this.rdId){
                    this.setPagesize()
                }
            })

        }
        //查询小区详情
        async getProjectDetail(){
            let {data} = await api.getProjectDetail(this.rdId);
            this.communityData = data;
            this.tempProjectObject.rdId = this.communityData.id;
        }
        //查询收费项目
        async getProjectList() {
            this.loading = true;
            // let {data} = await api.getProjectList('', '', this.rdId)
            this.projectList = paramData.staList;
            this.loading = false
        }
        addProjectShow(){
            this.addProjectDialog = true;
        }

        async openEditPriject(id:string) {
            //根据id查询项目
            try{
                let {data} = await api.getProjectById(id)
                this.tempProjectObject = data;
                this.tempLateFeeRate = Number(this.tempProjectObject.lateFeeRate) * 100;
                this.tempProjectObject1 = JSON.parse(JSON.stringify(data));
                this.editProjectDialog = true;
            }catch (e) {
                this.$message.warning(`获取数据失败！`)
            }
        }
        closeAddProject() {
            this.editProjectDialog = false;
            this.addProjectDialog = false;
            this.tempLateFeeRate = 0;
            this.tempProjectObject = {
                description: "",
                lateFeeNeed: 0,
                lateFeeRate: 0,
                name: "",
                projectCode: "",
                projectTypeCode: "",
                rdId: this.communityData.id
            };
            this.tempProjectObject1 = {
                description: "",
                lateFeeNeed: 0,
                lateFeeRate: 0,
                name: "",
                projectCode: "",
                projectTypeCode: "",
                rdId: this.communityData.id
            };
        }

        //添加项目
        async addProject() {
            let reName = false;
            let {data} = await api.getProjectList('', '', this.tempProjectObject.rdId)
            for (let i in data) {
                if (data[i].name === this.tempProjectObject.name) {
                    reName = true
                }
            }
            if (this.tempProjectObject.rdId === '') {
                this.$message.warning('请选择小区')
            } else if (this.tempProjectObject.name === '') {
                this.$message.warning('请输入项目名称')
            } else if (reName) {
                this.$message.warning('该小区下已存在该项目')
            } else if (this.tempProjectObject.projectTypeCode === '') {
                this.$message.warning('请选择项目类型')
            } else if (this.tempProjectObject.projectCode === '') {
                this.$message.warning('请输入项目编码')
            } else if (this.subFlag) {
                this.subFlag = false
                if(this.tempProjectObject.lateFeeNeed === 0){
                    this.tempProjectObject.lateFeeRate = 0
                }
                else{
                    this.tempProjectObject.lateFeeRate = Number(this.tempLateFeeRate) / 100
                }

                try {
                    await api.addProject(this.tempProjectObject)
                    this.getProjectList();
                    this.closeAddProject();
                    this.$emit(`refresh`)
                    this.$message.success('新增成功！')
                } catch (e) {
                    this.$message.error('操作失败！')
                }
                this.subFlag = true
            }
        }
        //修改项目
        async editProject() {
            if (this.tempProjectObject.rdId === '') {
                this.$message.warning('请选择小区')
            } else if (this.tempProjectObject.name === '') {
                this.$message.warning('请输入项目名称')
            } else if (this.tempProjectObject.projectTypeCode === '') {
                this.$message.warning('请选择项目类型')
            } else if (this.tempProjectObject.projectCode === '') {
                this.$message.warning('请输入项目编码')
            } else if (this.subFlag) {
                this.subFlag = false
                if(this.tempProjectObject.lateFeeNeed === 0){
                    this.tempProjectObject.lateFeeRate = 0
                }
                else{
                    this.tempProjectObject.lateFeeRate = Number(this.tempLateFeeRate) / 100
                }

                try {
                    await api.editProject(this.tempProjectObject)
                    this.getProjectList();
                    this.closeAddProject();
                    this.$emit(`refresh`)
                    this.$message.success('修改成功！')
                } catch (e) {
                    this.$message.error('操作失败！')
                }
                this.subFlag = true
            }
        }

        //复制项目
        async copyProject() {
            if (this.subFlag) {
                this.subFlag = false;
                try {
                    await api.copyProject(this.copyProjectId,this.selectBuilding)
                    this.copyProjectDialog = false;
                    this.getProjectList();
                    this.$message.success('复制成功！')
                    this.$emit(`refresh`)
                } catch (e) {
                    this.$message.error('操作失败！')
                }
                this.subFlag = true;
            }
        }

        closeCopyProject() {
            this.selectBuilding = []
            this.copyProjectDialog = false
        }

        //删除一个项目
        async deleteProject(id) {
            this.$confirm('删除该项目后该项目下的所有标准也会删除，是否继续?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
               try{
                   await api.deleteProject([id])
                   this.getProjectList();
                   this.$message.success(`删除成功！`)
               }catch (e) {
                   this.$message.error(`删除失败！`)
               }
            }).catch(() => {

            });
        }



        checkName(name){
            let flag:boolean = false;
            this.projectList.forEach(item =>{
                if(item.name === name && item.name !== this.tempProjectObject1.name) {
                    flag = true
                }
            })
            if(flag){
                this.tempProjectObject.name = this.tempProjectObject1.name;
                this.$message.warning(`项目名称重复！`)
            }
        }
        checkCode(code){
            let flag:boolean = false;
            this.projectList.forEach(item =>{
                if(item.projectCode == code && item.projectCode !== this.tempProjectObject1.projectCode) {
                    flag = true
                }
            })

            if(flag){
                this.tempProjectObject.projectCode = this.tempProjectObject1.projectCode;
                this.$message.warning(`项目代码重复！`)
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/standard-global";
    #chargeParamProjectList {
        width: calc(100% - 221px);
        height: 100%;
        padding: 0 5px 0 20px;
        overflow: hidden;

        .rightTitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 36px;
            margin-bottom: 10px;

            .left {
                display: inline-flex;
                align-items: center;
                height: 36px;
                @extend .firstTitle;

                .iconfont {
                    cursor: pointer;
                    color: $theme-color;
                    line-height: 1;
                    margin-left: 20px;
                }
            }

            .right {
                display: inline-flex;
                align-items: center;
                height: 36px;
            }

            .clIcon {
                height: 12px;
                width: 4px;
                border-radius: 2px;
                background-color: $theme-color;
                margin-right: 4px;
                margin-bottom: 2px;
            }

        }

        .middleline {
            height:80px;
            background-color: #f8f9fc;
            border-radius:4px;
            overflow: hidden;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            .leftIcon{
                width: 80px;
                height: 100%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                @include background-image;
                .iconfont{
                    color: #fff;
                    font-size: 28px;
                    line-height: 1;
                }
            }
            .center{
                flex:1;
                padding: 0 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .title{
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                .info{
                    display: inline-flex;
                    align-items: center;
                    .iconfont{
                        color: $theme-color;
                        font-size: 14px;
                        line-height: 1;
                        margin-right: 10px;
                    }
                }
            }
        }

        &.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            > p {
                color: $third-font-color;
                margin-top: 10px;
            }
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
</style>
<style lang="scss">

</style>


