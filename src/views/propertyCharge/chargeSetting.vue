<template>
    <div id="chargeSetting" class="viewbox" >
        <div v-if="buildingTree.length === 0" class="viewboxMain empty">
            <img src="@manage/images/暂无2.png" >
            <br>
            <p>暂无数据，请先至 <i @click="$router.push({name:'房产管理'})">房产管理</i> 处添加小区</p>
        </div>
        <div v-else class="viewboxMain">
            <div class="leftTree">
                <div class="leftTitle">
                    <div class="left">
                        <i class="iconfont iconxiangmumingcheng"></i>房间列表
                    </div>
                </div>
                <vue-perfect-scrollbar style="height:calc(100% - 46px);margin-top: 10px;padding-right: 15px">
                    <Tree
                            class="buildingTree"
                            :data="buildingTree"
                            :render="renderContent"
                            @on-toggle-expand="treeExpand"
                    >
                    </Tree>
                </vue-perfect-scrollbar>
            </div>
            <div class="borderRight"></div>
            <div v-show="curTreeObj.id" class="rightMain" ref="rightMain">
                <div class="rightTitle" ref="rightTitle">
                    <div class="left">
                        <i class="iconfont iconjilu"
                           style="margin-left: 0;margin-right: 6px;font-size: 14px"></i>
                        房间收费标准
                    </div>
                </div>
                <div class="rightTitle" ref="searchline">
                    <mixSelect
                            class="margin"
                            :selectList="chargeType"
                            labelName="name"
                            valueName="code"
                            placeholder="收费类型"
                            v-model="projectTypeCode"
                            style="width: 140px"
                            @sentTo="getStandardByRoomId"
                    >
                    </mixSelect>
                    <div class="right">
                        <div class="pmbtn primary" style="margin-right: 15px" @click="standardFlag = !standardFlag"
                             v-clickoutside="closeHover">
                            <i class="iconfont iconbianji"></i>收费标准
                            <div class="btnSelection" :class="{active:standardFlag === true}">
                                <div class="selItem" @click="standardDialogRoom">当前房间</div>
                                <div class="selItem" @click="standardDialogRoom2">批量设定</div>
                            </div>
                        </div>
                        <div class="pmbtn" @click="relieveBind(checkList)">
                            <i class="iconfont iconshanchu" ></i>删除
                        </div>
                    </div>
                </div>
                <el-table
                        :data="standarByRoomList"
                        stripe
                        class="myWisdomTable"
                        v-loading="loading"
                        :height="formHeight"
                        @selection-change="handleSelectionChange"
                >
                    <template slot="empty" >
                        <img src="@manage/images/暂无数据.png">
                        <br>
                        暂无内容
                    </template>
                    <el-table-column
                            type="selection"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            prop="projectName"
                            label="收费项目"
                            min-width="140px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop=""
                            label="收费类型"
                            min-width="120px"
                    >
                        <template slot-scope="{row,$index}">
                            {{resetProjectType(row.projectTypeCode)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="standardName"
                            label="收费标准"
                            min-width="120px"
                    >
                    </el-table-column>
                    <el-table-column
                            prop=""
                            label="收费周期"
                            width="200px"
                    >
                        <template slot-scope="{row,$index}">
                            {{row.payDate}} ~ {{row.payEndDate || `至今`}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="操作"
                            width="70px"
                    >
                        <template slot-scope="{row,$index}">
                            <div class="tableEdit">
                                <div class="item delete" @click="relieveBind([row.id])">删除</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
               <!-- <Page show-elevator show-total
                      :page-size="pages.pageSize"
                      :current="pages.pageNum"
                      :total="pages.totalElements"
                      @on-change="getPage"
                      ref="pagebox"
                />-->
            </div>
            <div v-show="curTreeObj.id === ''" class="rightMain empty" >
                <img src="@manage/images/暂无1.png" alt="">
                <p >请在左侧选择一个房间</p>
            </div>

        </div>


        <standardDialog
                ref="standardDialog"
                :roomObj="curTreeObj"
                :pcheckedTree="standarByRoomList"
                @success="dialogSuccess">
        </standardDialog>

        <groupStandard
                ref="groupStandard"
                :roomObj="curTreeObj"
                @success="dialogSuccess"
        >
        </groupStandard>

    </div>


</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import { Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design';
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import chargeList from './chargeList.vue';
    import * as api from '@manage/api/propertyCharge/chargeParam'
    import standardDialog from './components/standardDialog.vue';
    import groupStandard from './components/groupStandard.vue';

    @Component({
        components: {
            Tree,
            Page,
            Spin,
            DatePicker,
            RadioGroup,
            Radio,
            CheckboxGroup,
            Checkbox,
            tabNav,
            Input,
            mixSelect,
            chargeList,
            standardDialog,
            groupStandard
        }
    })

    export default class mainView extends Vue {

        @Prop({
            default: false,
        }) showFlag!: boolean;

        @Watch(`showFlag`)
        showChargeList() {
            if (this.showFlag) {

            }
        }

        chargeType: any = []
        projectId: string = ''
        standard: any = []
        standarByRoomList:any=[]

        buildingTree: any = [{}]

        curTreeObj:any = {
            id:'',
            rdId:''
        };

        renderContent(h, {root, node, data}) {
            return h('div', {
                    attrs: {
                        title: data.title,
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '36px',
                        overflow: 'hidden',
                        width:'calc(100% - 20px)'
                    },
                    class: {
                        treeActive: this.curTreeObj.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 3) {
                                this.curTreeObj = data;
                                this.projectTypeCode = '';
                                setTimeout(()=>{
                                    this.setPagesize();
                                    this.getStandardByRoomId();
                                },200)
                            } else {
                                this.gethouseData(data)

                            }
                        }
                    }
                },
                [
                    h('i', {
                        class: {
                            iconfont: true,
                            iconxiaoqu: data.level === 1,
                            iconlouyu: data.level === 2,
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
                            overflow: `hidden`,
                            whiteSpace: `nowrap`,
                            textOverflow: `ellipsis`
                        },
                    }, data.title),


                ]);
        };


        created(): void {
            this.gethouseData1()
            this.getchargeType()
        }

        setPagesize(){
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let rightTitle = refs.rightTitle.clientHeight+15;
            let middleline = refs.searchline.clientHeight+15;

            //Page组件高度为53px，rightTitle:46,middleline:152

            this.formHeight = maxHeight - rightTitle - middleline ;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        standardDialogRoom() {
            let refs:any = this.$refs;
            refs.standardDialog.standardDialog = true
        }
        standardDialogRoom2() {
            let refs:any = this.$refs;
            refs.groupStandard.groupShow = true
        }



        //结构树
        async gethouseData1() {
            try{
                let {data} = await api.getTree(0)
                data.forEach(item =>{
                    if(item.belongNum !== 0){
                        item.children = [{}];
                    }
                })
                this.buildingTree = data;
            }catch (e) {
                this.buildingTree = [];
                this.$message.error(`获取小区数据失败！`)
            }

        }
        treeExpand(data){
            this.gethouseData(data,true)
        }
        async gethouseData(obj: any,bl?:boolean) {
            let {data} = await api.getTree(obj.level, obj.id);

            if (data) {
                obj.children = data;
                data.forEach(item =>{
                    if(item.belongNum !== 0){
                        item.children = [{}];
                    }
                })
            }
            if(obj.level === 1){
                obj.children.forEach(item =>{
                    item.rdId = obj.id;
                })
            }
            else if(obj.level === 2){
                obj.children.forEach(item =>{
                    item.rdId =  obj.rdId;
                })
            }
            if(!bl){
                obj.expand = !obj.expand;
            }
        }



        //查询所有的项目
        async getProjectList() {
            let {data} = await api.getProjectList('', '', this.curTreeObj.rdId)
            this.projectList = data
            this.projectList.map(x => (x.level = 1, x.expand = true,x.children=[]))
            let roomTree:any = [
                {children: []},
            ]
            this.projectList = this.projectList.map((item, index) => {
                return {...item, ...roomTree[index]}
            });
        }
        //查询标准
        // async getStandard(item){
        //     let {data} = await api.getStandard(item.id);
        //     data.forEach(item => item.level = 2)
        //     this.projectList.find(x => x.id === item.id).children = data
        // }
        loading:boolean = false
        //查询房间绑定的标准
        async getStandardByRoomId() {
            this.loading = true
            try {
                let {data} = await api.getStandardByRoomId(this.curTreeObj.id, this.projectTypeCode)
                this.standarByRoomList = data;
                this.pages.pageSize = data.length;
                this.pages.totalElements = data.length;
                this.loading = false
            }catch (e) {
                this.loading = false
            }

        }



        //收费类型
        async getchargeType() {
            let {data} = await api.getInfoByName('支付项目类型');
            this.chargeType = [
                {
                    name:'全部',
                    code:'',
                }
            ]
            this.chargeType = this.chargeType.concat(data);
        }

        checkList: Array<any> = [];
        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };

        addProjectDialog: boolean = false;


        standardFlag: boolean = false;
        projectList: any = []
        projectTypeCode: string = ''

        mounted() {

        }

        handleSelectionChange(val) {
            this.checkList = [];
            val.forEach(item => {
                this.checkList.push(item.id)
            })
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
        }

        resetProjectType(code){
            let obj = this.chargeType.find(item => item.code == code);
            if(obj){
                return obj.name
            }
            else{
                return '-'
            }
        }

         relieveBind(ids){
            this.$confirm('此操作将解除所有勾选内容的绑定关系, 是否继续?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try{
                    await api.reliveroomBindSandard(ids);
                    this.getStandardByRoomId();
                    this.$message.success(`删除成功！`)
                }
                catch (e) {
                    this.$message.error(`删除失败！`)
                }
            }).catch(() => {

            });


        }
        closeHover() {
            this.standardFlag = false;
        }
        dialogSuccess(){
            this.getStandardByRoomId();
            this.$message.success(`绑定成功！`)
        }


    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    .viewbox {
        padding-top: 15px;
        height: calc(100% - 60px);
        width: 100%;


        .viewboxMain{
            display: flex;
        }
        .leftTree {


            .leftTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;

                .left {
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;

                    .iconfont {
                        color: $theme-color;
                        margin-right: 8px;
                        line-height: 1;
                        font-size: 14px;
                    }
                }

                .right {
                    height: 24px;
                    display: inline-flex;
                    align-items: center;
                    color: $theme-color;
                    cursor: pointer;
                    user-select: none;

                    .iconfont {
                        color: $theme-color;
                        margin-right: 6px;
                        font-size: 14px;
                    }
                }
            }

            .menuLine {
                height: 36px;
                display: flex;
                align-items: center;
                border: 1px solid #fff;
                background-color: #fff;
                padding: 0 10px 0 20px;
                cursor: pointer;

                .iconfont {
                    color: $warning-color;
                    line-height: 1;
                    font-size: 14px;
                    margin-right: 8px;
                }

                &.active {
                    background-color: #e5f0ff;
                    border: 1px solid $theme-color;
                }
            }
        }

        .borderRight {
            width: 1px;
            height: 100%;
            background-color: #dde4eb;
            box-shadow: 1px 0px 3px 0px #dde4eb;
            flex: none;
        }

        .rightMain {
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
                        margin-left: 10px;
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
                background-color: #f8f9fc;
                border-radius: 4px;
                overflow: hidden;
                padding: 25px 20px;
                margin-bottom: 15px;

            }

            &.empty{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                >p{
                    color: $third-font-color;
                    margin-top: 10px;
                }
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


    .borderLine {
        width: 100%;
        height: 1px;
        background-color: #dde4eb;
        margin-bottom: 15px;
    }

    .iconzhushi {
        color: $warning-color;
        font-size: 14px;
        margin-right: 8px;
    }

    .advanceContent {
        display: flex;
        flex-wrap: wrap;
        margin: 20px 20px 0 20px;

        .halfPart {
            width: 50%;
            height: 460px;
            padding: 0 20px;

            &.shadow {
                border-right: 1px solid #eaf0f6;
            }

            .tit {
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
            }
        }
    }

    .advanceContent2 {
        .head {
            height: 76px;
            border-bottom: 1px solid #eaf0f6;
            padding-left: 40px;
            display: flex;
            align-items: center;
        }

        .main {
            display: flex;
            flex-wrap: wrap;
            margin: 20px 20px 0 20px;

            .halfPart {
                width: 50%;
                height: 460px;
                padding: 0 20px;

                &.shadow {
                    border-right: 1px solid #eaf0f6;
                }

                .tit {
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
            }
        }
    }


</style>
<style lang="scss">
    #chargeSetting {
        .emDialog .el-dialog__body {
            padding: 0;
        }

        .checkbox {
            width: 16px;
            height: 16px;
            background-color: #ffffff;
            border-radius: 2px;
            border: solid 1px #a0a5a9;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-right: 8px;
            &.active {
                border-color: #3dcb42;;
                background-color: #3dcb42;

            }

            .iconfont {
                font-size: 12px;
                color: #ffffff;
            }
        }
    }
</style>


