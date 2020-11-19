<template>
    <div id="topBar">
        <div class="globalLogo" >
            <i class="iconfont iconlogo"></i>
        </div>
        <div class="rightSide">
            <div class="systemName">物业管理系统</div>
            <div class="right">
                <div class="routeBtn btnDrop" @click="logoutFlag = !logoutFlag" v-clickoutside="logoutClose" >
                    <i class="iconfont iconuser"></i>
                    <em :class="{active:logoutFlag}">{{userData.name}}</em>
                    <Icon type="ios-arrow-down"/>
                    <transition name="slfade">
                        <div class="dropMenu" v-if="logoutFlag">
                            <div class="menuItem" @click="logout">
                                退出登录
                            </div>
                        </div>
                    </transition>

                </div>
                <!--<i @click="logout" class="iconfont icontuichu" title="退出"></i>-->
            </div>

        </div>
    </div>
</template>

<script>
    import {Icon, Button, Input} from 'view-design';
    import * as appApi from '@/api/app.ts'

    export default {
        name: "topBar",

        components: {
            Icon,
            Button,
            Input
        },
        data() {
            return {
                eidtable: false,
                visiable: false,
                logoutFlag: false,
                userData: {
                    name: '用户管理',
                    account: ''
                },
                params: {
                    account: '',
                    oldPwd: '',
                    newPwd: '',
                },
                confirmPassword: '',
                oldShow: false,
                newShow: false,
                confirmShow: false,
            }
        },
        mounted() {
            //this.getCurUser();
        },
        methods: {

            async getCurUser() {
                try{
                    let {data} = await appApi.getUserInfo();
                    this.userData = data;
                }catch (e) {
                    this.$message.error(`您尚未登录或者网络连接失败！`)
                    //this.$router.push({name:'登录页'})
                }

                //this.params.account = this.userData.account;
            },

            logout(){
                appApi.logout();
                this.$router.push({name:'登录页'})
            },
            logoutClose(){
                this.logoutFlag = false;
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../styles/standard-global";
    #topBar {
        display: flex;
        height: 60px;
        background-color: #fff;
        position: relative;
        z-index: 3;
        .globalLogo {
            width: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            @include background-image;

            .iconfont {
                font-size: 28px;
                line-height: 1;
                color: #fff;
            }
        }

        .rightSide {
            width: calc(100% - 60px);
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            .icontuichu{
                margin-left: 20px;
                cursor: pointer;

            }
            .routeBtn {
                height: 100%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                user-select: none;
                padding: 0 20px;
                .iconfont{
                    font-size: 14px;
                    line-height: 1;
                }
                em{
                    padding: 0 6px;
                    &.active{
                        color: $theme-color;
                    }
                }
            }
            .btnDrop{
                position: relative;
                .dropMenu{
                    position: absolute;
                    width: 80%;
                    left: 10%;
                    top: 100%;
                    z-index: 10;
                    background-color: #fff;
                    box-shadow: 0px 1px 4px 0px
                    rgba(183, 183, 183, 0.6);
                    border-radius: 2px;
                    transform-origin: center top 0;
                    .menuItem{
                        width: 100%;
                        height: 36px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        color: #7c8185;
                        cursor: pointer;
                        user-select: none;
                    }
                }
            }

            .systemName{
                font-size: 24px;
                font-weight: bold;
                line-height: 60px;
                letter-spacing: 1px;
                color: #30374a;
            }
        }
    }
    /*过渡动画*/
    .slfade-enter-active,.slfade-leave-active {
        transition: all .3s;
        transform-origin: center top 0;
        transform: rotateX(0deg);
    }

    .slfade-enter,.slfade-leave-to{
        opacity: 0;
        transform: rotateX(90deg);
        transform-origin: center top 0;
    }

</style>

<style lang="scss">
    #topBar {
        .ivu-input {
            height: 32px;
        }
    }
</style>
