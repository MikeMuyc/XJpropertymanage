<template>
    <div class="leftSide" :class="{hide:hideFlag}">
        <div class="fold-bar" @click="closeMenu">
            <i class="iconfont iconcaidan"></i>
        </div>
        <vue-perfect-scrollbar ref="leftSideScroll" style="width:170px;height: calc(100% - 40px)">
            <div class="leftSideItem margin" v-for="item in routeMenuOpen">
                <div class="itemLabel" :title="item.label" :class="{active:itemClass(item),closeActive:itemCloseClass(item)}" @click="itemClick(item)" >
                    <div class="iconbox">
                        <div class="blue"></div>
                        <img v-if="item.iconSrc" :src="item.iconSrc" >
                        <i v-else-if="item.iconfont" class="iconfont" :class="item.iconfont"></i>
                    </div>
                    <em class="itemName">{{item.label}}</em>
                    <i class="iconfont iconzhankai1 toggle" :class="{close:!item.showFlag}" v-show="item.children"></i>
                </div>
                <div v-if="item.children" class="itemChildren" :style="reHeight(item.showFlag,item.children.length)">
                    <div class="leftSideItem" v-for="item1 in item.children">
                        <div class="itemLabel" :title="item1.label" :class="{active:itemClass(item1)}"  @click="itemClick(item1)" >
                            <div class="iconbox">
                                <div class="blue"></div>
                            </div>
                            <em class="itemName">{{item1.label}}</em>
                        </div>

                    </div>
                </div>
            </div>
        </vue-perfect-scrollbar>
    </div>
</template>
<script>

    export default {
        name: "leftSide",

        props: {
            routeMenu: {
                type: Array,
                default: function () {
                    return [
                        {
                            name:'',
                            routeName:'',
                            iconSrc:'',
                            showFlag:false,
                            routeFather:false,
                            //children:[],
                        }
                    ]
                }
            },
        },
        watch:{
            routeMenu:function () {
                this.setOpen();
            },
            $route:function () {
                this.setOpen();
            }
        },
        data() {
            return {
                routeMenuOpen:[],
                hideFlag:false,
                itemHeight:54,
            }
        },
        mounted() {
            this.setOpen();
        },
        methods: {
            setOpen(){
                this.routeMenuOpen = this.routeMenu;
                let routeName = this.$route.name;
                let pName = this.$route.meta.pname;
                this.routeMenuOpen.forEach((item) => {
                    if (item.children) {
                        if(this.hideFlag){
                            item.showFlag = false;
                        }
                        else{
                            item.showFlag = this.getRouteParent(item.children,routeName,pName);
                        }
                        item.routeFather = this.getRouteParent(item.children,routeName,pName);
                    } else {
                        item.showFlag = false;
                        item.routeFather = false;
                    }
                });
                let refs = this.$refs.leftSideScroll;
                refs.$el.scrollTop = 0;
            },
            getRouteParent(arr,routeName,pName) {
                let bool = false;
                arr.forEach((item) => {
                    if (item.children && !bool) {
                        bool = this.getRouteParent(item.children,routeName,pName);
                    }
                    else if(!bool){
                        if(pName){
                            bool = item.routeName === routeName || item.routeName === pName
                        }
                        else{
                            bool = item.routeName === routeName
                        }
                    }

                })
                return bool
            },
            closeMenu(){
                this.hideFlag = !this.hideFlag;
                this.$emit(`hideFlag`,this.hideFlag);
                if(this.hideFlag){
                    this.routeMenuOpen.forEach((item) => {
                        item.showFlag = false
                    })
                }
                else{
                    this.setOpen()
                }
            },
            itemClass(item){
                let bool = false;
                if(this.$route.meta.pname){
                    bool =  this.$route.meta.pname.indexOf(item.routeName) > -1 || item.routeName === this.$route.name
                }
                else if(this.hideFlag){
                    bool = false;
                }
                else{
                    bool = item.routeName === this.$route.name
                }
                return bool
            },
            itemCloseClass(item){
                let bool = false;
                if(this.hideFlag && item.routeFather){
                    bool = true;
                }
                else if(this.hideFlag && item.routeName === this.$route.name){
                    bool = true;
                }
                return bool
            },
            itemClick(item){
                if(item.children){
                    item.showFlag = !item.showFlag;
                    this.hideFlag = false;
                    this.$emit(`hideFlag`,this.hideFlag);
                    this.$forceUpdate();
                }
                else if(item.routeName){
                    this.$router.push({name:item.routeName});

                }
            },
            reHeight (bool,length) {
                let childrenHeight = '';
                if(bool){
                    childrenHeight = length * this.itemHeight +`px`
                }
                else{
                    childrenHeight = 0 +`px`
                }
                return `height:${childrenHeight}`
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../styles/standard-global";
    .leftSide {
        width: 170px;
        overflow: hidden;
        height: 100%;
        font-size: 16px;
        background-color: #101c30;
        transition: all .3s;

        .fold-bar {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .iconfont{
                color: #ffffff;
                font-size: 16px;
                transition: all .3s;
            }
        }

        &.hide{
            width: 60px;
            .leftSideItem .iconbox{
                width: 60px;
            }
            .fold-bar{
                .iconfont{
                    transform: rotate(-90deg);
                }
            }
        }


    }
    .leftSideItem {
        width: 170px;
        &.margin{
            margin-bottom: 0px;
        }
        .itemLabel{
            height: 54px;
            display: flex;
            align-items: center;
            width: 170px;
            color: #fff;
            cursor: pointer;
            user-select: none;
            .itemName{
                font-size: 15px;
                width: calc(100% - 76px);
                overflow: hidden;
                white-space: nowrap;
            }

            .point{
                font-style: normal;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #fff;
                margin-left: 15px;
            }
            &.active{
                background-color: #113d8a;
                >.iconbox{

                    >.blue{
                        display: inline-block;
                    }
                }
            }
            &:hover:not(.active){
                color: #5ba2ff;
            }
            &.closeActive{
                &:hover{
                    background-image:none;
                }
                >.iconbox{
                    background-color: #113d8a;
                    >.blue{
                        display: inline-block;
                    }
                }
            }
            .toggle{
                transform: rotate(0deg);

                transition: .3s;
                font-size: 14px;
                line-height: 1;
                &.close{
                    transform: rotate(-90deg);
                }
            }
            .iconbox{
                width: 46px;
                height: 100%;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                transition: all .3s;
                position: relative;
                img{
                    max-width: 24px;
                }
                .iconfont{
                    font-size: 16px;
                    line-height: 1;
                }
                .blue{
                    display: none;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 4px;
                    height: 100%;
                    background-color: $theme-color;
                }
            }
        }
        .itemChildren{
            background-color: #0A111D;
            transition: all .3s;
            overflow: hidden;

            .itemName{
                font-size: 14px;
                width: calc(100% - 50px);
            }
        }
    }
</style>
