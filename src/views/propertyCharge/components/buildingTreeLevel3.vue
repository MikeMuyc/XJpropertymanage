<template>
    <div class="leftTree">
        <Input type="search" placeholder="搜索"></Input>
        <vue-perfect-scrollbar
                style="height:calc(100% - 48px);margin-top: 10px;padding-right: 15px"
                ref="buildingScroll"
                @ps-scroll-y="resetScollTop"
        >
            <Tree
                    class="buildingTree"
                    ref="buildingTree"
                    :data="buildingTree"
                    :render="renderContent"
                    @on-toggle-expand="treeExpand"
            >
            </Tree>
        </vue-perfect-scrollbar>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import { Tree } from 'iview'
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/propertyCharge/calcCharge'


    @Component({
        components: {
            Tree,
            Input
        }
    })

    export default class mainView extends Vue {
        curTreeObj: any = {
            id: '',
            bdId:'',
            rdId:'',
        }
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
                    class: {
                        treeActive: this.curTreeObj.id === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 3) {
                                this.curTreeObj = data;
                                let buildingScroll:any = this.$refs.buildingScroll;
                                let level3Obj = {
                                    rdId:data.rdId,
                                    bdId:data.bdId,
                                    id:data.id,
                                    scrollTop:buildingScroll.$el.scrollTop
                                }
                                localStorage.setItem(`level3Obj`,JSON.stringify(level3Obj));
                                this.$emit(`inited`,this.curTreeObj)

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
                            fontSize: data.level === 1 ? '15px' : '14px',
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

        buildingTree: any = [{}]

        async mounted() {
            let level3Obj:any = {};
            if(localStorage.getItem(`level3Obj`)){
                level3Obj = JSON.parse(localStorage.getItem(`level3Obj`))
                let rdObj:any = {}
                let bdObj:any = {}
                let obj1 = await api.getTree(0)
                obj1.data.forEach(item => {
                    if (item.belongNum !== 0) {
                        item.children = [{}];
                    }
                })

                rdObj = obj1.data.find(item => item.id === level3Obj.rdId)
                let obj2 = await api.getTree(1, rdObj.id);
                if (obj2.data) {
                    rdObj.children = obj2.data;
                    rdObj.expand = true
                    rdObj.children.forEach(item => {
                        item.rdId = rdObj.id;
                        if (item.belongNum !== 0) {
                            item.children = [{}];
                        }
                    })
                    bdObj = obj2.data.find(item => item.id === level3Obj.bdId)
                    let obj3 = await api.getTree(2, level3Obj.bdId);
                    if (obj3.data) {
                        bdObj.children = obj3.data;
                        bdObj.expand = true
                        bdObj.children.forEach(item => {
                            item.rdId = bdObj.rdId;
                            item.bdId = bdObj.id;
                        })
                        this.curTreeObj = obj3.data.find(item => item.id === level3Obj.id)
                    }
                }
                this.buildingTree = obj1.data;
                setTimeout(()=>{
                    let buildingScroll:any = this.$refs.buildingScroll;
                    buildingScroll.$el.scrollTop = level3Obj.scrollTop || 0;
                },200)

                this.$emit(`inited`,this.curTreeObj)
            }
            else{
                this.gethouseData1()
            }
        }




        //结构树
        async gethouseData1() {
            try {
                let {data} = await api.getTree(0)
                data.forEach(item => {
                    if (item.belongNum !== 0) {
                        item.children = [{}];
                    }
                })
                this.buildingTree = data
            } catch (e) {
                this.buildingTree = [];
                this.$message.error(`获取小区数据失败！`)
            }
        }


        treeExpand(data) {
            this.gethouseData(data, true)
        }

        async gethouseData(obj: any, bl?: boolean) {
            let {data} = await api.getTree(obj.level, obj.id);

            if (data) {
                obj.children = data;
            }
            if (obj.level === 1) {
                obj.children.forEach(item => {
                    item.rdId = obj.id;
                    if (item.belongNum !== 0) {
                        item.children = [{}];
                    }
                })

            } else if (obj.level === 2) {
                obj.children.forEach(item => {
                    item.rdId = obj.rdId;
                    item.bdId = obj.id;
                })
            }
            if (!bl) {
                obj.expand = !obj.expand;
            }
        }
        resetScollTop(){
            let level3Obj:any = JSON.parse(localStorage.getItem(`level3Obj`))
            let buildingScroll:any = this.$refs.buildingScroll;
            level3Obj.scrollTop = buildingScroll.$el.scrollTop;
            localStorage.setItem(`level3Obj`,JSON.stringify(level3Obj));
        }


    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/standard-global";



</style>
<style lang="scss">

</style>


