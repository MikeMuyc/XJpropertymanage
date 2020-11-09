<template>
    <el-dialog
            :visible.sync="advanceShow"
            custom-class="emDialog"
            width="800px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            @close="closeAdvance"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            批量提前计算费用
        </div>
        <div class="advanceContent">
            <div class="halfPart shadow">
                <div class="tit">收费项目</div>
                <vue-perfect-scrollbar style="height:calc(100% - 50px);margin-right: -15px;padding-right: 15px">
                    <Tree
                            class="buildingTree"
                            :data="leftTree"
                            :render="renderContent"
                            @on-toggle-expand="treeExpand"
                    >
                    </Tree>
                </vue-perfect-scrollbar>
            </div>
            <div class="halfPart">
                <div class="tit">房间列表</div>
                <vue-perfect-scrollbar style="height:calc(100% - 50px);margin-right: -15px;padding-right: 15px">
                    <Tree
                            class="buildingTree"
                            :data="rightTree"
                            :render="renderContent2"
                    >
                    </Tree>
                </vue-perfect-scrollbar>
            </div>

        </div>
        <div class="aline" style="margin-bottom: -20px">
            <div class="label">提前计算周期：</div>
            <div class="info" >
                <Input type="number" v-model="period" style="width: 120px"></Input>
            </div>
        </div>
        <div slot="footer">
            <div class="pmbtn primary" style="margin-right: 10px" @click="calcInfo">确定</div>
            <div class="pmbtn" @click="closeAdvance">取消</div>
        </div>
    </el-dialog>
</template>
<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator"
    import { Spin} from 'view-design'
    import { Tree } from 'iview'

    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/propertyCharge/calcCharge'

    @Component({
        components: {
            Tree,
            Spin,
            Input,
        }
    })

    export default class mainView extends Vue {


        curLeftObj: any = {
            id: '',
        };
        checkedList: any = [];
        renderContent(h, {root, node, data}) {
            return h('div', {
                    attrs: {
                        title: data.name,
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: 'calc(100% - 35px)',
                        height: '36px',
                        overflow: 'hidden',
                    },
                    class: {
                        treeActive: this.curLeftObj.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 3) {
                               this.curLeftObj = data;
                               this.setRightTree(data);
                            }
                            else if (data.level === 2) {
                                this.getStandard(data)
                            } else if (data.level === 1) {
                                this.getProjectList(data)
                            }
                        }
                    }
                },
                [
                    h('i', {
                        class: {
                            iconfont: true,
                            iconxiaoqu: data.level === 1,
                            iconshoufei: data.level === 2,
                        },
                        style: {
                            lineHeight: `1`,
                            marginRight: '8px',
                            marginLeft: '8px',
                            cursor: `pointer`,

                        },
                    }),
                    /*h('div', {
                        class: {
                            checkbox: true,
                            active:this.curLeftObj.id === data.id,
                        },
                        style: {
                            display: data.level === 3 ? ' inline-flex' : 'none',
                        },

                    },[
                        h('i', {
                            class: {
                                iconfont: true,
                                iconcheck: true
                            },
                            style: {
                                lineHeight: `1`,
                                fontSize:`8px`,
                                color:'#fff',

                            },
                        }),
                    ]),*/
                    h('i', {

                        style: {
                            fontStyle: 'normal',
                            fontSize:  data.level === 1 ? '15px' : '14px',
                            fontWeight: data.level === 1 ? '600' : 'normal',
                            lineHeight: `16px`,
                            cursor: `pointer`,
                            display: 'block',
                            width: '70%',
                            overflow: `hidden`,
                            whiteSpace: `nowrap`,
                            textOverflow: `ellipsis`,

                        },
                    }, data.name)
                ]);
        };
        renderContent2(h, {root, node, data}) {
            return h('div', {
                    attrs: {
                        title: data.title,
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: 'calc(100% - 35px)',
                        height: '36px',
                        overflow: 'hidden',
                    },
                    class: {
                        treeActive: this.curLeftObj.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if(data.level === 3){
                                let isIndex = this.checkedList.findIndex(item => item.id === data.id)
                                if(isIndex > -1){
                                    this.checkedList.splice(isIndex,1)
                                }
                                else{
                                    this.checkedList.push(data)
                                }
                            }
                            else{
                               data.expand = !data.expand;
                            }
                            console.log(this.checkedList)
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
                    h('div', {
                        class: {
                            checkbox: true,
                            active:this.checkedList.findIndex(item => item.id === data.id) > -1,
                        },
                        style: {
                            display: data.level === 3 ? ' inline-flex' : 'none',
                        },

                    },[
                        h('i', {
                            class: {
                                iconfont: true,
                                iconcheck: true
                            },
                            style: {
                                lineHeight: `1`,
                                fontSize:`8px`,
                                color:'#fff',

                            },
                        }),
                    ]),
                    h('i', {

                        style: {
                            fontStyle: 'normal',
                            fontSize:  data.level === 1 ? '15px' : '14px',
                            fontWeight: data.level === 1 ? '600' : 'normal',
                            lineHeight: `16px`,
                            cursor: `pointer`,
                            display: 'block',
                            width: '70%',
                            overflow: `hidden`,
                            whiteSpace: `nowrap`,
                            textOverflow: `ellipsis`,

                        },
                    }, data.title)
                ]);
        };
        leftTree: any = [];

        rightTree: any = [];
        subFlag: boolean = true;
        advanceShow: boolean = false;

        period:number = 1;
        mounted() {


        }

        //结构树
        async gethouseData1() {
            try{
                let {data} = await api.getTree2(0,null)
                this.leftTree = JSON.parse(JSON.stringify(data).replace(/title/g, 'name'));
                this.leftTree.forEach(item => {
                    if(item.belongNum !== 0){
                        item.children = [{}];
                    }
                })
            }catch (e) {
                this.leftTree = [];
                this.$message.error(`获取小区数据失败！`)
            }

        }


        treeExpand(data) {
            if (data.level === 1) {
                this.getProjectList(data, true)
            } else if (data.level === 2) {
                this.getStandard(data, true)
            }
        }

        async getProjectList(obj: any, bl?: boolean) {
            let {data} = await api.getProjectList('', '', obj.id)
            if (data) {
                obj.children = [];
                data.forEach(item =>{
                    if(item.projectTypeCode === '1'){
                        obj.children.push({
                            id:item.id,
                            rdId:obj.id,
                            name:item.name,
                            children:[{}],
                            level:2,
                            expand:false
                        })
                    }
                })
            }

            if (!bl && data.length > 0) {
                obj.expand = !obj.expand
            }
        }

        //查询标准
        async getStandard(obj: any, bl?: boolean) {
            let {data} = await api.getStandard(obj.id)
            if (data) {
                obj.children = [];
                data.forEach(item =>{
                    obj.children.push({
                        id:item.id,
                        rdId:obj.rdId,
                        name:item.name,
                        level:3,
                        projectId:item.projectId,
                        projectTypeCode:item.projectTypeCode,
                    })
                })
            }

            if (!bl && data.length > 0) {
                obj.expand = !obj.expand
            }
        }

        async setRightTree(obj){
            let {data} = await api.getBindSandardToRoom(obj.id,obj.rdId,true);
            data[0].expand = true;
            for(let i=0;i<data[0].children.length;i++){
                if(data[0].children[i].children.length===0){
                    data[0].children.splice(i,1);
                    i--
                }
                else{
                    data[0].children[i].expand = true;
                }
            }
            this.rightTree = data;
        }


        async calcInfo() {
            let checkboxProject = [];
            this.checkedList.forEach(item =>{
                checkboxProject.push({
                    projectId: this.curLeftObj.projectId,
                    projectTypeCode:this.curLeftObj.projectTypeCode,
                    psId: this.curLeftObj.id,
                    roomId: item.id,
                })
            })
            if (this.period > 60) {
                this.period = 1
                this.$message.warning('提前计算周期不能大于60！')
            }
            else if(checkboxProject.length === 0){
                this.$message.warning('请选择房间！')
            }
            else if(this.subFlag){
                this.subFlag = false;
                try {
                    await api.calcFee(this.period, checkboxProject)
                    this.$message.success('计算成功')
                    this.closeAdvance();
                    this.$emit(`success`);
                    this.subFlag = true;
                } catch (e) {
                    this.$message.error('计算失败')
                    this.subFlag = true;
                }
            }
        }

        openAdvance() {
            this.gethouseData1();
            this.advanceShow = true;
        }

        closeAdvance() {
            this.leftTree = [];
            this.rightTree = [];
            this.period = 1;
            this.curLeftObj =  {
                id: '',
            };
            this.checkedList =  [];

            this.advanceShow = false;
        }


    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/standard-global";

    .aline {
        .label {
            width: 120px;
        }
    }

    .borderLine {
        width: 100%;
        height: 1px;
        background-color: #dde4eb;
        margin-bottom: 15px;
    }

    .advanceContent {
        display: flex;
        border-bottom: 1px solid #eaf0f6;
        margin: -20px -20px 15px;
        flex-wrap: wrap;

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
                border-bottom: 1px solid #dde4eb;
                font-size: 16px;
                margin-bottom: 10px;
            }
        }
    }


</style>
<style lang="scss">
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
</style>

