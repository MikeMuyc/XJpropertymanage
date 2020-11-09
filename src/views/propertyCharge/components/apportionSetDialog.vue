<template>
    <el-dialog
            :visible.sync="groupShow"
            custom-class="emDialog"
            width="800px"
            @close="closeDialog"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            公摊设置
        </div>
        <div class="advanceContent2">
            <div class="head">
                {{curObj.name}}
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
                                @on-check-change="leftChange"
                                @on-toggle-expand="treeExpand"
                        >
                        </Tree>
                    </vue-perfect-scrollbar>
                </div>
                <div class="halfPart">
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
            <div class="pmbtn primary" style="margin-right: 10px" @click="setBindRooms">确定</div>
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

    import * as api from '@manage/api/propertyCharge/apportion'


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
                name:'',
                rdId:'',
                id:'',
            },
        }) curObj!: {
            name:string,
            rdId:string,
            id:string,
        };

        @Watch(`groupShow`)
        setDialogShow() {
            if (this.groupShow) {

                this.getBindedRooms({rdId: this.curObj.rdId, ruleId: this.curObj.id,hidden:false});

            }
        }

        groupShow: boolean = false
        buildingTree1: any = []
        buildingTree2: any = []
        projectList: any = []

        checkedList: any = []
        deletedList: any = []
        StandardList: any = []

        subFlag: boolean = true;

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
                                if(data.level === 2 && data.children.length < 2 && !data.expand){
                                    this.gethouseData2('2',data.id)
                                }
                                else{
                                    data.expand = !data.expand;
                                }
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
                            marginLeft: '8px',
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
        async getBindedRooms(obnj:{
            rdId:string,
            ruleId:string,
            hidden:boolean,
        }){
            let {data} = await api.getBindedRooms(obnj);
            let main = data[0].children;
            this.rdName = data[0].title;
            for(let i=0;i<main.length;i++){
                if(main[i].belongNum === 0){
                    main.splice(i,1)
                    i--
                }
            }
            this.buildingTree1 = main
            setTimeout(()=>{
                this.setRightTree();
            },200)
        }
        //结构树
        async gethouseData2(level:string, id:string) {
            try{
                let {data} = await api.getTree(level,id);
                let curObj = this.buildingTree1.find(item => item.id === id);
                if(curObj){
                    curObj.children = data;
                    curObj.expand = true;
                }
            }catch (e) {
                this.buildingTree1 = [];
                this.$message.error(`获取小区数据失败！`)
            }


        }
        treeExpand(data) {
            if(data.children.length < 2 && data.expand){
                this.gethouseData2('2', data.id)
            }
        }
        leftChange(val){
            val.forEach(item =>{
                if(item.id && item.level===2 && item.children.length<2){
                    this.gethouseData2('2',item.id);
                }
            });
            setTimeout(()=>{
                this.setRightTree();
            },200)
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



        mounted() {

        }
        async setBindRooms(){
            if (this.subFlag) {
                this.subFlag = false;
                if(this.checkedList.length === 0){
                    this.$message.warning(`请至少选择一个房间！`)
                }
                else{
                    try{
                        await api.bindSharedRooms({rdId: this.curObj.rdId, ruleId: this.curObj.id},this.checkedList);
                        this.$message.success(`绑定成功！`);
                        this.closeDialog();
                        this.$emit(`success`)
                    }
                    catch (e) {
                        this.$message.error(`提交失败！`)
                    }
                }
                this.subFlag = true;
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
            height: 35px;
            border-bottom: 1px solid #eaf0f6;

            padding-bottom: 15px;
            display: flex;
            align-items: center;
            font-weight: bolder;
            font-size: 16px;
        }

        .main {
            display: flex;
            flex-wrap: wrap;
            margin: 20px 0 0 0;

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


