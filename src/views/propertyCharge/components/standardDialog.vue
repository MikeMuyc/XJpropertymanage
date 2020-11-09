<template>
    <div id="standardDialog">
        <el-dialog
                :visible.sync="standardDialog"
                :close-on-click-modal="false"
                custom-class="emDialog"
                width="800px"
                @close="closeStandardDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                收费标准
            </div>
            <div class="advanceContent">
                <div class="halfPart shadow" style="width: 45%">
                    <div class="tit" style="font-weight: bolder;font-size: 16px;color: #000;">收费标准</div>
                    <vue-perfect-scrollbar style="height:calc(100% - 56px);margin-right: -15px;padding-right: 15px;">
                        <Tree
                                ref="treeChange"
                                class="buildingTree"
                                :data="projectList"
                                :render="leftContent"
                                @on-toggle-expand="treeExpand"
                        >
                        </Tree>
                    </vue-perfect-scrollbar>
                </div>
                <div class="halfPart" style="width: 55%">
                    <div class="tit">
                        <Checkbox v-model="deleteAllChecked" style="font-size: 14px;color: #7c8185">
                            全选，已选({{deleteList.length}})
                        </Checkbox>
                        <div style="color: #3a7ef3;cursor: pointer" @click="deleteAll">删除</div>
                    </div>
                    <vue-perfect-scrollbar style="height:calc(100% - 56px);margin-right: -15px;padding-right: 15px;">
                        <Tree
                                class="buildingTree"
                                :data="checkedTree"
                                :render="rightContent"
                        >
                        </Tree>
                    </vue-perfect-scrollbar>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="roomBindSandarding">确定</div>
                <div class="pmbtn" @click="closeStandardDialog">取消</div>
            </div>
        </el-dialog>

        <el-dialog
                :visible.sync="timeDialog"
                custom-class="emDialog"
                :append-to-body="true"
                top="18vh"
                width="600px"
                @close="closeTimeDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                收费标准
            </div>
            <div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>开始收费</div>
                    <div class="info">
                        <DatePicker type="date" format="yyyy-MM-dd" placeholder="开始时间" style="width: 100%" v-model="startDate1" :options="startOptions" @on-change="settime1"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">终止收费</div>
                    <div class="info">
                        <DatePicker type="date" format="yyyy-MM-dd" placeholder="结束时间" style="width: 100%" v-model="endDate1" :options="endOptions" @on-change="settime2"></DatePicker>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="resetSETime">确定</div>
                <div class="pmbtn" @click="closeTimeDialog">取消</div>
            </div>
        </el-dialog>
    </div>

</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import {Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design';
    import {Tree} from 'iview'

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
            Input,
            mixSelect,
        }
    })

    export default class standardDialog extends Vue {

        @Prop({
            default: {
                id: '',
                rdid: '',
            },
        }) roomObj!: any;
        @Prop({
            default: [],
        }) pcheckedTree?: any;

        @Watch(`standardDialog`)
        setDialogShow() {
            if (this.standardDialog) {
                this.getProjectList();
                this.checkedList = [];
                this.checkedTree = [];
                this.pcheckedTree.forEach(item => {
                    this.checkedList.push({
                        psId:item.psId,
                        payDate:item.payDate,
                        payEndDate:item.payEndDate,
                        projectId:item.projectId,
                    });
                    this.checkedTree.push({
                        id: item.projectId,
                        name: item.projectName,
                        level: 1,
                        expand: true,
                        children: [
                            {
                                id: item.psId,
                                name: item.standardName,
                                payDate:item.payDate,
                                payEndDate:item.payEndDate,
                                level: 2,
                            }
                        ],
                    })
                })
                this.deleteAllChecked = false;
            }
        }

        standardDialog: boolean = false;
        projectList: any = [];
        checkedTree: any = [];
        checkedList: any = [];
        deleteList: any = [];
        deleteAllChecked: boolean = false;

        @Watch(`deleteAllChecked`)
        allCheck() {
            if (this.deleteAllChecked) {
                this.deleteList = [];
                this.checkedTree.forEach(item => {
                    this.deleteList.push(item.children[0].id);
                })
            } else {
                this.deleteList = []
            }
        }

        @Watch(`deleteList`)
        setAllCheck() {
            this.deleteAllChecked = this.deleteList.length === this.checkedTree.length;
        }

        projectName: string = '';

        setcheckedList() {
            this.checkedTree.forEach(item => {
                let obj = this.checkedList.find(item1 => item1.projectId === item.id);
                if(obj){
                    if(obj.psId === item.children[0].id){

                    }
                    else{
                        obj.psId = item.children[0].id
                    }
                }
                else{
                    this.checkedList.push({
                        psId:item.children[0].id,
                        projectId:item.id,
                        "payDate": "",
                        "payEndDate": "",
                    })
                }
            })

            this.$forceUpdate();

            console.log(this.checkedList)
        }

        leftContent(h, {root, node, data}) {
            return h('div', {
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: 'calc(100% - 40px)',
                        height: '36px',
                        overflow: 'hidden',
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 2) {
                                let isIndex = this.checkedTree.findIndex(item => item.id === data.projectId)
                                if (isIndex > -1) {
                                    this.checkedTree[isIndex].children = [];
                                    this.checkedTree[isIndex].children.push(JSON.parse(JSON.stringify(data)));
                                } else {
                                    let obj = JSON.parse(JSON.stringify(this.projectList.find(item => item.id === data.projectId)));
                                    obj.children = [];
                                    obj.children.push(JSON.parse(JSON.stringify(data)));
                                    this.checkedTree.push(obj)
                                }
                                this.setcheckedList();
                            } else {
                                this.getStandard(data)
                            }

                        }
                    }
                },
                [
                    h('i', {
                        class: {
                            iconfont: true,
                            iconshoufei: true
                        },
                        style: {
                            lineHeight: `1`,
                            marginRight: '8px',
                            cursor: `pointer`,
                            display: data.level == 1 ? 'inline-block' : 'none',
                        },
                    }),
                    h('div', {
                        class: {
                            checkbox: true,
                            active: this.checkedList.findIndex(item => item.psId === data.id) > -1,
                        },
                        style: {
                            display: data.level !== 1 ? ' inline-flex' : 'none',
                        },

                    }, [
                        h('i', {
                            class: {
                                iconfont: true,
                                iconcheck: true
                            },
                            style: {
                                lineHeight: `1`,
                                fontSize: `8px`,
                                color: '#fff',

                            },
                        }),
                    ]),
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
                    }, data.name),


                ]);
        };

        rightContent(h, {root, node, data}) {
            return h('div', {
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: 'calc(100% - 40px)',
                        height: '36px',
                        overflow: 'hidden',
                    },

                },
                [
                    h('div', {
                            style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                width: 'calc(100% - 120px)',
                                height: '36px',
                            },
                        },
                        [
                            h('i', {
                                class: {
                                    iconfont: true,
                                    iconshoufei: true
                                },
                                style: {
                                    lineHeight: `1`,
                                    marginRight: '8px',
                                    cursor: `pointer`,
                                    display: data.level == 1 ? 'inline-block' : 'none',
                                },
                            }),
                            h('div', {
                                class: {
                                    checkbox: true,
                                    active: this.deleteList.findIndex(item => item === data.id) > -1,
                                },
                                style: {
                                    display: data.level !== 1 ? ' inline-flex' : 'none',
                                },
                                on: {
                                    click: (event) => {
                                        if (data.level === 2) {
                                            let isIndex = this.deleteList.findIndex(item => item === data.id)
                                            if (isIndex > -1) {
                                                this.deleteList.splice(isIndex, 1)
                                            } else {
                                                this.deleteList.push(data.id)
                                            }
                                            this.setcheckedList();
                                        } else {
                                            data.expand = !data.expand
                                        }
                                    }
                                }
                            }, [
                                h('i', {
                                    class: {
                                        iconfont: true,
                                        iconcheck: true
                                    },
                                    style: {
                                        lineHeight: `1`,
                                        fontSize: `8px`,
                                        color: '#fff',

                                    },
                                }),
                            ]),
                            h('i', {
                                attrs: {
                                    title: data.name,
                                },
                                style: {
                                    fontStyle: 'normal',
                                    fontSize: '14px',
                                    lineHeight: `16px`,
                                    cursor: `pointer`,
                                    overflow: `hidden`,
                                    whiteSpace: `nowrap`,
                                    textOverflow: `ellipsis`,
                                },
                                on: {
                                    click: (event) => {
                                        if (data.level === 2) {
                                            let isIndex = this.deleteList.findIndex(item => item === data.id)
                                            if (isIndex > -1) {
                                                this.deleteList.splice(isIndex, 1)
                                            } else {
                                                this.deleteList.push(data.id)
                                            }
                                            this.setcheckedList();
                                        } else {
                                            data.expand = !data.expand
                                        }
                                    }
                                }
                            }, data.name),
                        ]
                    ),
                    h('div', {
                            style: {
                                cursor: `pointer`,
                                width: '120px',
                                height: '36px',
                                display: data.level == 1 ? 'none' : 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            },
                            on: {
                                click: (event) => {
                                    this.opneTimeDialog(data);
                                },

                            },
                        },
                        this.rightFont(data)
                    ),
                ]);
        };

        treeExpand(data) {
            this.getStandard(data, true)
        }

        //查询所有的项目
        async getProjectList() {
            let {data} = await api.getProjectList(null, null, this.roomObj.rdId)
            for (let i = 0; i < data.length; i++) {
                if (data[i].standardCount !== 0) {
                    data[i].children = [{}]
                    data[i].level = 1;
                    data[i].expand = false
                } else {
                    data.splice(i, 1);
                    i--
                }
            }
            this.projectList = data;
            /*this.projectList.map(x => (x.level = 1, x.expand = true,x.children=[]))
            let roomTree = [
                {children: []},
            ]
            this.projectList = this.projectList.map((item, index) => {
                return {...item, ...roomTree[index]}
            });*/
        }

        //查询标准
        async getStandard(item: any, bl?: boolean) {
            let {data} = await api.getStandard(item.id);
            data.forEach(item => item.level = 2);
            let obj: any = this.projectList.find(x => x.id === item.id)
            if (obj) {
                obj.children = data
            }
            if (!bl) {
                obj.expand = !obj.expand;
            }
        }

        deleteAll() {
            this.deleteList.forEach(item => {
                this.checkedTree.forEach((item1, index) => {
                    if (item1.children[0].id === item) {
                        this.checkedTree.splice(index, 1)
                    }
                })

            });
            this.checkedList = [];
            this.setcheckedList();
        }

        subFlag: boolean = true

        async roomBindSandarding() {
            if (this.subFlag) {
                this.subFlag = false;
                let noPayDate = false;
                this.checkedList.forEach(item =>{
                    if(item.payDate === ''){
                        noPayDate = true;
                    }
                })
                if(noPayDate){
                    this.$message.warning(`请为收费添加收费开始时间！`)
                }
                else{
                    try {
                        await api.roomBindSandard(this.roomObj.id, this.checkedList);
                        this.closeStandardDialog();
                        this.$emit(`success`);
                    } catch (e) {
                        this.$message.error(`绑定失败！`)
                    }
                }
                this.subFlag = true;
            }
        }

        closeStandardDialog() {
            this.checkedTree = [];
            this.checkedList = [];
            this.deleteList = [];
            this.standardDialog = false;
            this.deleteAllChecked = false;
            this.projectName = '';
        }

        //时间弹窗
        timeDialog:boolean = false;
        startDate:string = '';
        startDate1:string = '';
        endDate:string = '';
        endDate1:string = '';
        tiemId:string = '';
        opneTimeDialog(obj:any){
            this.tiemId = obj.id;
            this.startDate1 = obj.payDate;
            this.endDate1 = obj.payEndDate;
            this.startDate = obj.payDate;
            this.endDate = obj.payEndDate;
            this.timeDialog = true;
        }
        resetSETime(){
            let obj:any = this.checkedList.find(item => item.psId === this.tiemId)
            if(obj){
                obj.payDate = this.startDate;
                obj.payEndDate = this.endDate;
            }
            let treeObj:any = this.checkedTree.find(item => item.children[0].id === this.tiemId)

            if(treeObj){
                let temp = JSON.parse(JSON.stringify(treeObj.children[0]))
                treeObj.children = [];
                temp.payDate = this.startDate;
                temp.payEndDate = this.endDate;
                treeObj.children.push(temp)
            }
            this.closeTimeDialog()
        }
        closeTimeDialog(){
            this.startDate1 = '';
            this.endDate1 = '';

            this.startDate = '';
            this.endDate = '';
            this.tiemId = '';
            this.timeDialog = false;
        }
        rightFont(data:any){
            if(data.payDate && data.payEndDate){
                return `${data.payDate} ~ ${data.payEndDate}`
            }
            else if(data.payDate){
                return `${data.payDate} ~ 至今`
            }
            else{
                return `收费时间 >`
            }
        }
        get startOptions() {
            let htu:any = {};
            let endDate:any = new Date(this.endDate)
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
            let startDate:any = new Date(this.startDate)
            if(startDate){
                htu = {
                    disabledDate(time) {
                        return time.getTime() < startDate.getTime();
                    }
                };
            }

            return htu;
        }
        settime1(val){
            this.startDate = val
        }
        settime2(val){
            this.endDate = val
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/standard-global";


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
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
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


