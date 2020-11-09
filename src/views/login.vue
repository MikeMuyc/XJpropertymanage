<template>
    <div class="login_body">
        <div class="login_main">
            <img class="leftpic" src="@manage/images/loginpic.png"/>
            <Form
                    class="leftpic right"
                    ref="loginForm"
                    :model="loginForm"
                    :label-width="0"
            >
                <div class="titleLogo">
                    <img src="@manage/images/logo.png">
                    新疆城建物业
                </div>
                <FormItem prop="userName">
                    <Input
                            type="text"
                            v-model="loginForm.username"
                            placeholder="用户名"
                            size="large"
                            @on-blur="checkPassword"
                    >
                        <i class="iconfont icondenglu" slot="prefix"></i>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input
                            type="password"
                            v-model="loginForm.password"
                            placeholder="密码"
                            size="large"
                            @on-keydown.enter="login"
                    >
                        <i class="iconfont iconmima" slot="prefix"></i>
                    </Input>
                </FormItem>
                <FormItem prop="password" style="text-align: left">
                    <Checkbox v-model="remember" style="text-align: left;user-select: none"> 记住密码</Checkbox>
                </FormItem>
                <FormItem>
                    <Button
                            class="loginButton"
                            type="primary"
                            @click="login"
                            size="large"
                            long
                    >登 录
                    </Button>
                </FormItem>
            </Form>
        </div>


    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {FormItem, Icon, Form, Input, Button, Checkbox} from 'view-design';
    import * as api from '@manage/api/app'
    import {Message} from 'element-ui';

    import axios from 'axios';
    interface userInterface {
        list: Array<any>
        remember: boolean
        version:number
    }

    @Component({
        components: {
            FormItem,
            Icon,
            Form,
            Input,
            Button,
            Checkbox
        }
    })

    export default class login extends Vue {
        remember:boolean = true;
        loginForm:any = {
            username: "admin",
            password: "123456"
        };

        userAccountList: userInterface = {
            list: [],
            remember: false,
            version:1.1
        };

        created() {
            if (localStorage.getItem("userAccountList")) {
                this.userAccountList = JSON.parse(localStorage.getItem("userAccountList"));
                if(this.userAccountList.version >= 1.1){
                    this.remember = this.userAccountList.remember;
                    if(this.userAccountList.list.length>0){
                        this.loginForm = JSON.parse(JSON.stringify(this.userAccountList.list[0]))
                    }
                }
            }
        }

        checkPassword() {
            this.loginForm.password = ''
            this.userAccountList.list.forEach((item: any) => {
                if (item.username === this.loginForm.username) {
                    this.loginForm.password = item.password;
                }
            })
        }

        login() {
            if (this.loginForm.username === '') {
                Message({
                    showClose: true,
                    message: `请输入账号！`,
                    type: 'warning'
                })
            } else if (this.loginForm.password === '') {
                Message({
                    showClose: true,
                    message: `请输入密码！`,
                    type: 'warning'
                })
            } else {
                this.$router.push({name:'manage'})
                /*api.login(this.loginForm)
                    .then(res => {

                    if (res.status === 200 || res.status === 201) {
                        let num: number = -1;

                        this.userAccountList.remember = this.remember;
                        this.userAccountList.list.forEach((item: any, index: number) => {
                            if (item.username === this.loginForm.username) {
                                num = index
                                if (this.userAccountList.remember) {
                                    this.userAccountList.list[index] = this.loginForm;
                                }
                            }
                        })

                        if (num > -1) {
                            this.userAccountList.list.splice(num, 1);
                            if (this.remember) {
                                this.userAccountList.list.unshift(this.loginForm);
                            }
                        } else {
                            if (this.remember) {
                                this.userAccountList.list.push(this.loginForm);
                            }
                        }

                        localStorage.setItem("userAccountList", JSON.stringify(this.userAccountList));

                    }
                    else {
                        Message({
                            showClose: true,
                            message: `${res.data.msg}`,
                            type: 'error'
                        })
                    }
                })
                    .catch(({data:{message}}) => {
                        Message({
                            showClose: true,
                            message: `${message}`,
                            type: 'error'
                        })
                    })*/
            }
        }
    }
</script>
<style lang="scss" scoped>

    .login_body {
        width: 100%;
        height: 100%;
        position: relative;
        background-image: url("../images/bg.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .login_main{
            position: absolute;
            left: calc(50% - 500px);
            top: calc(50% - 270px);
            text-align: center;
            width: 1000px;
            height: 540px;
            background-color: #ffffff;
            box-shadow: 0px 0px 40px 0px
            rgba(0, 75, 203, 0.3);
            border-radius: 12px;
            display: flex;
            .leftpic{
                width: 50%;
                height: 100%;
                &.right{
                    padding: 80px 50px;
                }
            }
            .titleLogo{
                height: 40px;
                margin-bottom: 40px;
                display: flex;
                justify-content: center;
                font-size: 28px;
                font-weight: bold;
                img{
                    margin-right: 20px;
                }
            }
        }
    }
    .iconmima,.icondenglu{
        font-size: 16px;
        color: #3a7ef3;
    }
    .loginButton {
        background-image: linear-gradient(313deg,
                #4d9aff 0%,
                #3b66f6 100%);
        box-shadow: 0px 3px 6px 0px
        rgba(58, 126, 243, 0.4);
        border-radius: 6px;
        height: 46px;
        font-size: 16px;
    }
</style>
<style lang="scss">
    .login_body {
        .ivu-input-wrapper {
            width: auto;
        }

        input:not([type]),
        input[type="text"],
        input[type="password"],
        .ivu-input-default {
            width: 400px;
            height: 50px;
            padding-left: 42px;
            line-height: 50px;
        }

        .ivu-input-prefix {
            line-height: 48px;
        }
        .ivu-input-prefix, .ivu-input-suffix{
            width: 42px;
        }
        .ivu-input-wrapper-large .ivu-input-prefix i, .ivu-input-wrapper-large .ivu-input-suffix i{
            line-height: 48px;
        }
    }
</style>
