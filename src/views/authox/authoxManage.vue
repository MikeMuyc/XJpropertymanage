<template>
    <div >
        <div class="view">
            <tabNav :tabList="tabList" @tabChange="tabChange"></tabNav>
            <transition name="leftSlide">
                <div class="viewbox" v-show="tabName === '用户管理'">
                    <div class="leftTree">
                        <vue-perfect-scrollbar style="height:calc(100% - 10px);margin-top: 10px;padding-right: 15px">
                            <Tree
                                    class="buildingTree"
                                    ref="tree"
                                    :data="departmentTree"
                                    :render="renderContent"
                                    empty-text=""
                            >
                            </Tree>
                        </vue-perfect-scrollbar>
                    </div>
                    <div class="borderRight"></div>
                    <div class="right">
                        <div class="header">
                            <i style="font-size: 16px;color:#30374a">{{curObj.title|| ''}}</i>
                            <i class="iconfont iconbianji" style="cursor: pointer" @click="openeditManage(curObj)"></i>
                        </div>
                        <div class="mainInfo" ref="viewbox">
                            <div class="userSearch" ref="searchline">
                                <div class="froat">
                                    <i class="iconfont iconzhanghao"></i>
                                    <i class="text">直属用户</i>
                                </div>
                                <div class="last">
                                    <Input v-model="keyword" placeholder="搜索人员" style="width: 280px;margin-right: 15px"></Input>
                                    <div class="pmbtn primary" style="margin-right: 15px" @click="getUserList(curObj.id)">
                                        <i class="iconfont iconsousuo" ></i>搜索
                                    </div>
                                    <div class="pmbtn primary" @click="openaddUser">
                                        <i class="iconfont icontianjia"></i>新增用户
                                    </div>
                                </div>
                            </div>
                            <el-table
                                    stripe
                                    class="myTable"
                                    :height="formHeight"
                                    :data="usersList"
                            >
                                <template slot="empty" >
                                    <img src="@manage/images/暂无数据.png">
                                    <br>
                                    暂无内容
                                </template>
                                <el-table-column
                                        type="index"
                                        width="80px"
                                        align="center"
                                        label="序号">
                                </el-table-column>
                                <el-table-column
                                        prop="account"
                                        label="账号"
                                        min-width="120"
                                        show-overflow-tooltip
                                ></el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="用户名称"
                                        min-width="120"
                                        show-overflow-tooltip
                                ></el-table-column>
                                <el-table-column
                                        prop="role"
                                        label="角色"
                                        min-width="80"
                                >
                                    <template slot-scope="{row,$index}">用户</template>
                                </el-table-column>
                                <el-table-column
                                        prop="departments"
                                        label="部门名称"
                                        min-width="100"
                                        show-overflow-tooltip
                                >
                                    <template slot-scope="{row,$index}">
                                        <div v-for="(item,index) in row.departments"><font v-if="index !== 0"> ,</font>{{item.name}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop=""
                                        label="部门编号"
                                        min-width="100"
                                        show-overflow-tooltip
                                >
                                    <template slot-scope="{row,$index}">
                                        <div v-for="(item,index) in row.departments"><font v-if="index !== 0"> ,</font>{{item.code}}</div>
                                    </template>
                                </el-table-column>
                                <!--<el-table-column
                                        prop=""
                                        label="职务"
                                        min-width="80"
                                ></el-table-column>-->
                                <el-table-column
                                        prop="rds"
                                        label="责任管理区"
                                        min-width="100"
                                >
                                    <template slot-scope="{row,$index}">
                                        <div v-if="row.rds[0]">{{row.rds[0].rdName || ''}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="createTime"
                                        label="创建日期"
                                        min-width="170"
                                ></el-table-column>
                                <el-table-column
                                        label="操作"
                                        width="180px"
                                >
                                    <template slot-scope="{row,$index}">
                                        <div class="tableEdit">
                                            <div class="item" @click="openedituser(row)">编辑</div>
                                            <div class="item" @click="resetPassword(row)">重置密码</div>
                                            <div class="item delete" @click="deleteUser(row)">删除</div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="userSearch" style="margin-top: 20px">
                                <div class="froat">
                                    <i class="iconfont iconbumen"></i>
                                    <i class="text">下级部门</i>
                                </div>
                                <div class="last">
                                    <div class="pmbtn" @click="openAddManage">
                                        <i class="iconfont iconbumen"></i>添加下级
                                    </div>
                                </div>
                            </div>
                            <el-table
                                    stripe
                                    class="myTable"
                                    :height="formHeight"
                                    :data="manageList"
                            >
                                <template slot="empty" >
                                    <img src="@manage/images/暂无数据.png">
                                    <br>
                                    暂无内容
                                </template>
                                <el-table-column
                                        type="index"
                                        width="100px"
                                        align="center"
                                        label="序号">
                                </el-table-column>
                                <el-table-column
                                        prop="title"
                                        label="部门名称"
                                        min-width="140"
                                ></el-table-column>
                                <el-table-column
                                        prop="property"
                                        label="部门编号"
                                        min-width="140"
                                ></el-table-column>
                                <el-table-column
                                        label="操作"
                                        width="110px"
                                >
                                    <template slot-scope="{row,$index}">
                                        <div class="tableEdit">
                                            <div class="item" @click="openeditManage(row)">编辑</div>
                                            <div class="item delete" @click="deleteManage(row)">删除</div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="rightSlide">
                <rolePermission class="viewbox" v-show="tabName === '角色权限'" :showFlag="tabName === '角色权限'"></rolePermission>
            </transition>
        </div>

        <el-dialog
                :visible.sync="addUserVisible"
                custom-class="emDialog"
                width="545px"
                :close-on-click-modal="false"
                @close="closeaddUser"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增用户
            </div>
            <div class="MuModalContent" >
                <div class="aline">
                    <div class="label">账号</div>
                    <div class="info">
                        <Input v-model="userAddObj.account" placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">登录密码</div>
                    <div class="info">
                        <Input v-model="userAddObj.password" placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">确认密码</div>
                    <div class="info">
                        <Input v-model="passwordCheck" placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">用户名称</div>
                    <div class="info">
                        <Input v-model="userAddObj.name" placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">部门</div>
                    <div class="info">
                        <mixSelect
                                v-model="userAddDepartmentIds"
                                :selectList="departmentTree"
                                labelName="title"
                                valueName="property"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">角色</div>
                    <div class="info">
                        <mixSelect
                                v-model="userAddroleIds"
                                :selectList="roleList"
                                labelName="name"
                                valueName="role"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <!--<div class="aline">
                    <div class="label">职务</div>
                    <div class="info">
                        <Input style="width:100%" placeholder="请输入"></Input>
                    </div>
                </div>-->
                <div class="aline">
                    <div class="label">责任管理区</div>
                    <div class="info">
                        <mixSelect
                                v-model="userAddrdIds"
                                :selectList="buildingTree"
                                labelName="title"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addUser">确定</div>
                <div class="pmbtn" @click="closeaddUser">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="editUserVisible"
                custom-class="emDialog"
                width="545px"
                :close-on-click-modal="false"
                @close="closeaddUser"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改用户信息
            </div>
            <div class="MuModalContent" >
                <div class="aline">
                    <div class="label">账号</div>
                    <div class="info">
                        <Input v-model="userAddObj.account" placeholder="请输入" disabled></Input>
                    </div>
                </div>

                <div class="aline">
                    <div class="label">用户名称</div>
                    <div class="info">
                        <Input v-model="userAddObj.name" placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">部门</div>
                    <div class="info">
                        <mixSelect
                                v-model="userAddDepartmentIds"
                                :selectList="departmentTree"
                                labelName="title"
                                valueName="id"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">角色</div>
                    <div class="info">
                        <mixSelect
                                v-model="userAddroleIds"
                                :selectList="roleList"
                                labelName="name"
                                valueName="role"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <!--<div class="aline">
                    <div class="label">职务</div>
                    <div class="info">
                        <Input style="width:100%" placeholder="请输入"></Input>
                    </div>
                </div>-->
                <div class="aline">
                    <div class="label">责任管理区</div>
                    <div class="info">
                        <mixSelect
                                v-model="userAddrdIds"
                                :selectList="buildingTree"
                                labelName="title"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editUser">确定</div>
                <div class="pmbtn" @click="closeaddUser">取消</div>
            </div>
        </el-dialog>


        <el-dialog
                :visible.sync="addManageVisible"
                custom-class="emDialog"
                width="545px"
                @close="closeAddManage"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                添加下级部门
            </div>
            <div class="MuModalContent" >
                <div class="aline">
                    <div class="label">部门编号</div>
                    <div class="info">
                        <Input v-model="manageAddObj.code" placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">部门名称</div>
                    <div class="info">
                        <Input v-model="manageAddObj.name" placeholder="请输入"></Input>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addPartments">确定</div>
                <div class="pmbtn" @click="closeAddManage">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="editManageVisible"
                custom-class="emDialog"
                width="545px"
                @close="closeAddManage"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                编辑部门
            </div>
            <div class="MuModalContent" >

                <div class="aline">
                    <div class="label">部门名称</div>
                    <div class="info">
                        <Input v-model="manageAddObj.name" placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">部门编号</div>
                    <div class="info">
                        <Input v-model="manageAddObj.code" placeholder="请输入"></Input>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editPartments">确定</div>
                <div class="pmbtn" @click="closeAddManage">取消</div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator"
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue'
    import * as api from '@manage/api/authox'
    import {
        Icon,
        Select,
        Page,
        Button,
        Option,
        Spin,
        Modal,
        Form,
        DatePicker,
        FormItem,
        RadioGroup,
        Radio
    } from 'view-design'
    import { Tree } from 'iview'
    import routeTabs from '@manage/components/routeTabsBar.vue'
    import Input from '@manage/components/normalInput.vue';
    import rolePermission from './rolePermission.vue';
    @Component({
        components: {
            Icon,
            Select,
            Option,
            Tree,
            Page,
            Button,
            Modal,
            FormItem,
            Form,
            DatePicker,
            Spin,
            routeTabs,
            RadioGroup,
            Radio,
            tabNav,
            Input,
            rolePermission,
            mixSelect
        }
    })

    export default class projectManage extends Vue {

        tabName:string = '用户管理';
        tabList: Array<{ name: string }> = [
            {
                name: '用户管理',
            },
            {
                name: '角色权限',
            },
        ];
        curObj:any = {
            id:'',
        };
        keyword:string = '';
        renderContent(h, {root, node, data}) {
            return h('div', {
                    attrs: {
                        title: data.title,
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: 'calc(100% - 20px)',
                        height: '36px',
                        overflow: 'hidden',
                    },
                    class:{
                        treeActive:this.curObj.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if(data.level == 3){
                                this.manageList = [];
                            }
                            else{
                                this.manageList = data.children
                            }
                            this.curObj = data;
                            this.keyword = '';
                            this.getUserList(data.id);
                        }
                    }
                },
                [
                    h('i', {
                        class: {
                            iconfont: true,
                            iconxiaoqu: data.level === 1,
                            iconbumen: data.level === 2,
                        },
                        style: {
                            lineHeight: `1`,
                            marginRight: '8px',
                            marginLeft: '8px',
                            cursor: `pointer`,
                        },
                    }),

                    h('i', {
                        style: {
                            fontStyle: 'normal',
                            fontSize:  data.level === 1 ? '15px' : '14px',
                            fontWeight: data.level === 1 ? '600' : 'normal',
                            lineHeight: `16px`,
                            cursor: `pointer`,
                        },
                    }, data.title),


                ]);
        };

        departmentTree: any = []
        roleList: any = [
            {
                "role": "user",
                "name": "普通用户",
            }
        ]
        buildingTree: any = []

        usersList:any = [];
        manageList:any=[]
        addUserVisible:boolean=false
        editUserVisible:boolean=false
        addManageVisible:boolean=false
        editManageVisible:boolean=false

        userAddObj:any = {
            "name": "",
            "sex": "",
            "birthday": "",
            "tel": "",
            "photoId": "",
            "account": "",
            "password": "",
            "email": "",
            "description": "",
            "rdIds": [],
            "departmentIds": [],
            "roles": [
                {"role":"user"}
            ]
        }
        passwordCheck:string = '';
        userAddDepartmentIds:string = ''
        userAddroleIds:string = 'user'
        userAddrdIds:string = ''
        formHeight:number = 400;
        manageAddObj:any = {
            "code": "",
            "level": 0,
            "name": ""
        }
        mounted() {
            this.getDepartmentTree();
            this.gethouseData();
            this.getRolelist();
            this.$nextTick(()=>{
                this.setPagesize()
            })
        }
        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.viewbox.clientHeight ;
            let searchline = refs.searchline.clientHeight + 10;

            //Page组件高度为53px
            this.formHeight = maxHeight/2 - searchline - 20;
            //this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }
        async getDepartmentTree(){
            this.departmentTree = await api.getDepartmentTree();
            this.curObj = this.departmentTree[0];
            this.keyword = ''
            this.getUserList(this.curObj.id);
            this.manageList = this.departmentTree[0].children
        }

        //结构树
        async gethouseData() {
            try{
                this.buildingTree = await api.getRdTree(0, null)
            }catch (e) {
                this.$message.error(`获取小区数据失败！`)
            }
        }
        //角色列表
        async getRolelist() {
            try{
                this.roleList = await api.getRolelist()
            }catch (e) {
                this.$message.error(`获取角色列表失败！`)
            }
        }

        tabChange(item:any) {
            this.tabName = item.name;
        }
        openaddUser(){
            this.addUserVisible = true
        }
        closeaddUser(){
            this.addUserVisible = false;
            this.editUserVisible = false;
            this.userAddObj = {
                "name": "",
                "sex": "",
                "birthday": "",
                "tel": "",
                "photoId": "",
                "account": "",
                "password": "",
                "email": "",
                "description": "",
                "rdIds": [],
                "departmentIds": [],
                "roles": [
                    {"role":"user"}
                ]
            }
        }
        openAddManage(){
            if(this.curObj.level!==3){
                this.addManageVisible = true
                this.manageAddObj.level = Number(this.curObj.level) + 1
            }
            else{
                this.$message.warning(`该部门为第三级部门，无法再添加下级！`)
            }
        }
        closeAddManage(){
            this.addManageVisible = false;
            this.editManageVisible = false;
            this.manageAddObj = {
                "code": "",
                "level": 0,
                "name": ""
            }
        }
        async getUserList(id){
            this.usersList = await api.getUserList(id,this.keyword)
        }
        async addUser(){
            this.userAddObj.departmentIds = [this.userAddDepartmentIds]
            this.userAddObj.rdIds = [this.userAddrdIds]
            try{
                await api.addUser(this.userAddObj);
                this.closeaddUser();
                this.keyword = ''
                this.getUserList(this.curObj.id);
                this.$message.error(`新增用户失败！`)
            }catch (e) {
                this.$message.error(`操作失败！`)
            }

        }
        openedituser(row){
            this.userAddObj = row;
            this.userAddDepartmentIds = row.departments[0].rdId;
            this.userAddrdIds = row.rds[0].rdId;
            this.userAddroleIds = row.roles[0].role;
            this.editUserVisible = true
        }
        async editUser(){
            this.userAddObj.departmentIds = [this.userAddDepartmentIds]
            this.userAddObj.rdIds = [this.userAddrdIds]
            this.userAddObj.roles = [this.userAddroleIds]
            try{
                await api.editUser(this.userAddObj);
                this.closeaddUser();
                this.keyword = ''
                this.getUserList(this.curObj.id);
                this.$message.success(`修改成功！`)
            }catch (e) {
                this.$message.error(`操作失败！`)
            }
        }
        deleteUser(row){
            this.$confirm('确定要删除这个用户吗?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try{
                    await api.deleteUser([row.id]);
                    this.keyword = ''
                    this.getUserList(this.curObj.id);
                    this.$message.success(`删除成功！`)
                }
                catch (e) {
                    this.$message.error(`删除失败！`)
                }
            }).catch(() => {

            });
        }
        async addPartments(){
            if(this.manageAddObj.name === ''){
                this.$message.warning(`部门名称不能为空！`)
            }
            else{
                try{
                    await api.addPartments(this.curObj.id,this.manageAddObj);
                    this.closeAddManage();
                    this.getDepartmentTree();
                    this.$message.success(`新增部门成功！`)
                }catch (e) {
                    this.$message.error(`操作失败！`)
                }
            }

        }

        openeditManage(row){
            this.manageAddObj.id = row.id;
            this.manageAddObj.name = row.title;
            this.manageAddObj.code = row.property;
            this.manageAddObj.level = row.level;
            this.editManageVisible = true
        }
        async editPartments(){
            if(this.manageAddObj.name === ''){
                this.$message.warning(`部门名称不能为空！`)
            }
            else{
                try{
                    await api.editPartments(this.manageAddObj);
                    this.closeAddManage();
                    this.getDepartmentTree();
                    this.$message.success(`修改部门成功！`)
                }catch (e) {
                    this.$message.error(`操作失败！`)
                }
            }

        }
        deleteManage(row){
            this.$confirm('确定要删除这个部门吗?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try{
                    await api.deletePartments([row.id]);
                    this.getDepartmentTree();
                    this.$message.success(`删除成功！`)
                }
                catch (e) {
                    this.$message.error(`删除失败！`)
                }
            }).catch(() => {

            });
        }
        async resetPassword(row){
            try{
                await api.resetPassword(row.id);
                this.$message.success(`重置成功！`)
            }
            catch (e) {
                this.$message.error(`重置失败！`)
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    .view{
        height: 100%;
        overflow: hidden;
        position: relative;
        .viewbox {
            padding-top: 14px;
            height: calc(100% - 60px);
            width: 100%;
            display: flex;

            .borderRight{
                width: 1px;
                flex:none;
                height: 100%;
                background-color: #dde4eb;
                box-shadow: 1px 0px 3px 0px #dde4eb;
            }
            .right{
                padding-left: 20px;
                width: calc(100% - 221px);
                .header{
                    height: 30px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    font-weight: bolder;
                    .iconbianji{
                        color: #3b66f6;
                        padding-left: 19px;
                        font-size: 14px;
                    }
                }
                .mainInfo{
                    padding-left:10px;
                    height: calc(100% - 40px);
                    .userSearch{
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;
                        .froat{
                            .text{
                                font-weight: bolder;
                                font-size: 15px;
                            }
                            .iconzhanghao{
                                color:#3a7ef3;
                                padding-right: 9px;
                            }
                            .iconbumen{
                                color:#3a7ef3;
                                padding-right: 6px;
                            }
                        }
                        .last{
                            display: flex;
                        }
                    }
                    .tableEdit{
                        display: inline-flex;
                        user-select: none;
                        >.item{
                            margin-right: 15px;
                            color: $second-font-color;
                            cursor: pointer;
                            &:hover{
                                color: $theme-color;
                            }
                            &.delete:hover{
                                color: $error-color;
                            }
                        }
                    }
                    .text{
                        font-size: 15px;
                        color: #30374a;
                    }
                }
            }
        }
    }


    .aline {
        .label {
            width: 80px;
        }

    }
</style>
<style lang="scss">
    #projectManage {
        .buildingTree{
            margin-left: 0;
        }
    }
</style>
