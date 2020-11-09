<template>
    <div id="routeTabsBar">
        <div class="tabsItem" :class="{active:activeTabName === item.routeName}" v-for="item in tabList">
            <router-link :to="{name:item.routeName,query:item.query}" >
                <div class="border"><em>{{item.showName}}</em></div>
            </router-link>
            <i class="iconfont iconshanchu1 close" @click.stop="closeTabEvent(item.routeName)"></i>

        </div>
        <div class="more" :style="moreStyle" v-show="partB.length > 0" v-clickoutside="closeMore" >
            <i class="iconfont icongengduo" @click="moreFlag = !moreFlag"></i>
            <div class="moreList" v-show="moreFlag" >
                <vue-perfect-scrollbar style="max-height:150px">
                    <div class="moreItem" v-for="(item,index) in partB" @click="moreClick(item,index)">
                        <em :title="item.showName">{{item.showName}}</em>
                    </div>
                </vue-perfect-scrollbar>

            </div>
        </div>
        <i class="iconfont iconguanbi closeAll" v-if="tabList.length>1" title="全部关闭" @click="closeAllGroup"></i>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex';

    const tabWidth = 180;
    const leftSideWidth = 170;
    export default {
        props:{
            zIndex:{
                type:Number,
                default:9,
            }
        },
        data() {
            return {
                moreFlag:false,
            }
        },
        computed: {
            ...mapState('routeTabs', [
                'partB',
                'tabList',
                'routeModule',
                'routeModuleList',
                'activeTabName',
                'toRouteName',
            ]),
            tabSize: function () {
                return parseInt((document.body.offsetWidth - leftSideWidth) / tabWidth) - 1;
            },
            moreStyle:function () {
                return `z-index:${this.zIndex}`;
            }
        },
        watch: {
            $route: function (to, from) {
                this.openTabs({
                    routeName: to.name,
                    showName:to.meta.name,
                    query:to.query,
                });
            }
        },
        mounted() {
            this.setTabSize(this.tabSize);
            this.openTabs({
                routeName: this.$route.name,
                showName:this.$route.meta.name,
            });
        },
        methods: {
            ...mapMutations("routeTabs", [
                "openTabs",
                "clearAllTabs",
                "setRouteModule",
                "setTabSize",
                "closeTab",
                "BToA"
            ]),
            closeMore(){
                this.moreFlag = false
            },
            moreClick(item,index){
                this.BToA(item.routeName,index);
                this.$router.push({name:item.routeName});
                this.moreFlag = false;
            },
            closeTabEvent(routeName){
                this.closeTab(routeName);
                if(routeName === this.$route.name){
                    this.$router.push({name:this.toRouteName})
                }
            },
            tabClick(item){
                this.$router.push({name:item.routeName,query:item.query})
            },

            closeAllGroup(){
                this.clearAllTabs();
            },
        },
    }
</script>

<style lang="scss" scoped>
    #routeTabsBar {
        height: 34px;
        box-shadow: 0px 1px 4px 0px
        rgba(0, 38, 77, 0.08);
        display: flex;
        background-color: #e7e9ed;
        padding-left: 5px;
        padding-right: 68px;
        position: relative;
        z-index: 2;
        align-items: flex-end;

        .tabsItem {
            display: inline-flex;
            width: 180px;
            height: 30px;
            background-color: #e7e9ed;
            position: relative;
            z-index: 1;
            >a{
                width: 100%;
                color: #333;
                height: 100%;
                display: inline-flex;
                align-items: center;
                user-select: none;
                border-top-right-radius: 8px;
                border-top-left-radius: 8px;
                transition: all .3s;
                .border{
                    padding: 0 20px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    border-right: 1px solid #c6c9ce;
                    transition: all .3s;
                    em{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
            &:hover {
                a{
                    background-color: #f7f8f9;
                    color: #333;
                    >.border{
                        border-right: 0 none;
                    }
                }

            }

            &.active {
                width: 181px;
                margin-left: -1px;
                a{
                    background-color: #fff;

                }
                .border{
                    border-right:  0 none;
                }
                &:hover {
                    a{
                        background-color: #fff;
                    }

                }
            }


            >.close {
                position: absolute;
                right: 6px;
                top: 6px;
                width: 16px;
                height: 16px;
                line-height: 16px;
                font-size: 14px;
                cursor: pointer;
                border-radius: 50%;
                text-align: center;
                color: #666666;
                z-index: 44;
                &:hover {
                    background-color: #dfdfdf;
                }
            }

        }

        .more {
            position: absolute;
            right: 34px;
            top: 0;
            width: 34px;
            height: 34px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            user-select: none;
            text-align: center;
            .iconfont{

                width: 16px;
                height: 16px;
                line-height: 1;
                font-size: 16px;
                color: #000;
            }
        }
        >.closeAll {
            position: absolute;
            right: 0;
            top: 0;
            width: 34px;
            height: 34px;
            line-height: 34px;
            display: inline-block;
            text-align: center;
            font-size: 16px;
            color: #666;
            user-select: none;
            cursor: pointer;
            &:hover{
                color: #3a7ef3;
            }
        }

        .moreList {
            position: absolute;
            right: 0;
            top: 100%;
            z-index: 99;
            border: 1px solid #eee;
            background-color: #fff;
            border-radius: 2px;
            .moreItem {
                width: 120px;
                height: 30px;
                display: flex;
                align-items: center;
                padding: 0 10px;
                user-select: none;
                &:hover {
                    background-color: #EBECEF;
                }
                em {
                    text-align: center;
                    display: inline-block;
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }
</style>
