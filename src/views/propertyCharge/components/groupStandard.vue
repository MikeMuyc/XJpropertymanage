<template>
    <el-dialog
            :visible.sync="groupShow"
            custom-class="emDialog"
            width="800px"
            :modal-append-to-body="false"
            @close="closeDialog"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            批量设定收费标准
        </div>
        <div class="advanceContent2">
            <div class="head">
                <i style="margin-right: 15px">收费标准：</i>
                <mixSelect
                        class="margin"
                        :selectList="projectList"
                        labelName="title"
                        valueName="id"
                        childrenName="children"
                        placeholder="请选择"
                        style="width: 140px;margin-right: 50px"
                        @sentItem="gethouseTree"
                >
                </mixSelect>
                <i style="margin-right: 15px">收费时间：</i>
                <DatePicker type="date" format="yyyy-MM-dd" placeholder="开始时间" style="width: 150px" v-model="startDate"   :options="startOptions" ref="startDate" @on-change="setTime1"></DatePicker>
                <i style="margin: 0 15px">-</i>
                <DatePicker type="date" format="yyyy-MM-dd" placeholder="终止时间(非必填)" style="width: 150px" v-model="endDate"   :options="endOptions" ref="startDate" @on-change="setTime2"></DatePicker>
                <!--<div class="tipsText">请先选择收费标准，再勾选房间进行标准绑定</div>-->
            </div>
            <div class="main">
                <div class="halfPart shadow">
                    <div class="tit">{{rdName}}</div>
                    <vue-perfect-scrollbar style="height:calc(100% - 50px);padding-right: 15px">
                        <Tree
                                class="buildingTree"
                                ref="roomTree"
                                :data="buildingTree1"
                                :render="roomContent"
                                show-checkbox
                                multiple
                                @on-check-change="setRightTree"
                        >
                        </Tree>
                    </vue-perfect-scrollbar>
                </div>
                <div class="halfPart">
                   <!-- <div style="font-size: 13px;margin-bottom: 20px">
                        <i class="iconfont iconzhushi"></i>
                        <i style="color: #a0a5a9">已有12个房间设置了物业费下的其他标准，设定后旧标准将被替换。</i>
                        <em style="color: #3a7ef3;padding-left: 5px">查看</em>
                    </div>-->
                    <div class="tit" >
                        <div>已选房间</div>
                        <div style="color: #3a7ef3;font-weight:normal;font-size: 14px;cursor: pointer"
                             @click="deleteChecked">删除
                        </div>
                    </div>
                    <vue-perfect-scrollbar
                            style="height:calc(100% - 50px);margin-right: -15px;padding-right: 15px">
                        <Tree
                                class="buildingTree"
                                ref="rightTree"
                                show-checkbox
                                multiple
                                :data="buildingTree2"
                                :render="roomContent2"
                                @on-check-change="rightChange"
                        >
                        </Tree>
                    </vue-perfect-scrollbar>
                </div>
            </div>
        </div>
        <div slot="footer">
            <div class="pmbtn primary" style="margin-right: 10px" @click="setStandarBindRooms">确定</div>
            <div class="pmbtn" @click="closeDialog">取消</div>
        </div>
    </el-dialog>


</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import { Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design';
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';

    import * as api from '@manage/api/propertyCharge/chargeParam'


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


        }
    })

    export default class mainView extends Vue {

        @Prop({
            default: {
                id: '',
                rdId: '',
            },
        }) roomObj!: any;

        @Watch(`groupShow`)
        setDialogShow() {
            if (this.groupShow) {
                this.getProjectList();
                this.gethouseData1({id: this.roomObj.rdId, level: 0});

            }
        }

        groupShow: boolean = false
        buildingTree1: any = []
        buildingTree2: any = []
        projectList: any = []

        checkedList: any = []
        deletedList: any = []
        StandardList: any = []
        projectId:string = ''
        psId:string = ''

        startDate:string = ''
        endDate:string = ''
        payDate:string = ''
        payEndDate:string = ''
        roomContent(h, {root, node, data}) {
            return h('div', {
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '36px',
                        overflow: 'hidden',
                        width: 'calc(100% - 40px)'
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 3) {
                                data.checked = !data.checked;
                                this.setRightTree();
                            } else {
                                data.expand = !data.expand;
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
                            display: data.level === 3 ? `none` : `inline-block`,
                        },
                    }),

                    h('i', {
                        attrs: {
                            title: data.title,
                        },
                        style: {
                            fontStyle: 'normal',
                            fontSize: '14px',
                            lineHeight: `16px`,
                            cursor: `pointer`,
                            overflow: `hidden`,
                            whiteSpace: `nowrap`,
                            textOverflow: `ellipsis`
                        },
                    }, data.title),


                ]);
        };

        roomContent2(h, {root, node, data}) {
            return h('div', {
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '36px',
                        overflow: 'hidden',
                        width: 'calc(100% - 40px)'
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 3) {
                                data.checked = !data.checked;
                                let refs:any = this.$refs;
                                let deletelist = refs.rightTree.getCheckedNodes();
                                this.deletedList = [];
                                deletelist.forEach(item => {
                                    this.deletedList.push(item.id)
                                })
                            } else {
                                data.expand = !data.expand;
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
                            display: data.level === 3 ? `none` : `inline-block`,
                        },
                    }),

                    h('i', {
                        attrs: {
                            title: data.title,
                        },
                        style: {
                            fontStyle: 'normal',
                            fontSize: '14px',
                            lineHeight: `16px`,
                            cursor: `pointer`,
                            overflow: `hidden`,
                            whiteSpace: `nowrap`,
                            textOverflow: `ellipsis`
                        },
                    }, data.title),


                ]);
        };

        rdName:string = '';
        //结构树
        async gethouseData1(obj: any) {
            let {data} = await api.getTree(obj.level, obj.id);
            this.rdName = data[0].title
        }

        async gethouseTree(obj) {
            this.psId = obj.id;
            this.projectId = obj.parentId;
            let {data} = await api.getBindSandardToRoom(obj.id, this.roomObj.rdId)
            this.buildingTree1 = data[0].children;
            for(let i=0;i<this.buildingTree1.length;i++){
                if(this.buildingTree1[i].belongNum === 0){
                    this.buildingTree1.splice(i,1)
                    i--
                }
            }
            this.setRightTree();
        }

        setRightTree() {
            this.buildingTree2 = [];
            this.checkedList = [];
            this.buildingTree1.forEach(item1 => {
                let child = [];
                item1.children.forEach(item2 => {
                    if (item2.checked) {
                        let newItem = JSON.parse(JSON.stringify(item2));
                        newItem.checked = false;
                        child.push(newItem);
                        this.checkedList.push(item2.id);
                    }
                })
                if (child.length > 0) {
                    let newObj = JSON.parse(JSON.stringify(item1));
                    newObj.children = child;
                    newObj.expand = true;
                    newObj.indeterminate = false;
                    newObj.checked = false;
                    this.buildingTree2.push(newObj);
                }
            })
        }

        rightChange(val) {
            this.deletedList = [];
            val.forEach(item => {
                this.deletedList.push(item.id)
            })

        }

        deleteChecked() {

            this.deletedList.forEach(item => {
                this.buildingTree1.forEach(item1 => {
                    item1.indeterminate = false;
                    item1.checked = false;
                    item1.children.forEach(item2 => {
                        if (item2.id === item) {
                            item2.checked = false;

                        }
                    })
                })
            })
            this.setRightTree();
        }

        //查询所有的项目
        async getProjectList() {
            let {data} = await api.getAllProjectList(this.roomObj.rdId)
            for(let i=0;i<data.length;i++){
                if(data[i].children.length===0){
                    data.splice(i,1);
                    i--
                }
            }
            this.projectList = data
        }

        mounted() {

        }
        subFlag:boolean = true;
        async setStandarBindRooms(){
            if(this.psId === ''){
                this.$message.warning(`请选择收费标准！`)
            }
            else if(this.payDate === ''){
                this.$message.warning(`请选择收费开始时间！`)
            }
            else if(this.checkedList.length === 0){
                this.$message.warning(`请至少选择一个房间！`)
            }
            else if(this.subFlag){
                this.subFlag = false;
                try{
                    await api.standarBindRooms(this.projectId,this.psId,this.checkedList,this.payDate,this.payEndDate);
                    this.closeDialog();
                    this.$emit(`success`);
                    this.subFlag = true;
                }
                catch (e) {
                    this.$message.error(`提交失败！`)
                    this.subFlag = true;
                }

            }

        }
        closeDialog() {
            this.checkedList = [];
            this.deletedList = [];
            this.StandardList = [];
            this.buildingTree1 = []
            this.buildingTree2 = []
            this.groupShow = false;
        }
        get startOptions() {
            let htu:any = {};
            let endDate:any = this.endDate
            if(endDate){
                htu = {
                    disabledDate(time) {
                        return time.getTime() > endDate.getTime();
                    }
                };
            }
            return htu;
        }
        get endOptions() {
            let htu = {};
            let startDate:any = this.startDate
            if(startDate){
                htu = {
                    disabledDate(time) {
                        return time.getTime() < startDate.getTime();
                    }
                };
            }

            return htu;
        }
        setTime1(val){
            this.payDate = val
        }
        setTime2(val){
            this.payEndDate = val
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/standard-global";



    .iconzhushi {
        color: $warning-color;
        font-size: 14px;
        margin-right: 8px;
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
                    font-weight: bolder;
                    font-size: 15px;
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


