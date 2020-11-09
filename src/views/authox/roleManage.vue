<template>
    <div class="costTable">
        <div class="costTitle">
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            角色管理
        </div>
        <vue-perfect-scrollbar class="main">
            <div class="header">
                <div class="front">
                    <div class="a">
                        <div class="roleDet">
                            <i class="line"></i>
                            <i class="font">角色详情</i>
                        </div>
                        <div class="aa">
                            <i class="iconfont iconbianji"></i>
                            <i>编辑</i>
                        </div>
                    </div>
                    <div class="icon">
                        <Icon type="ios-arrow-down"/>
                    </div>
                </div>
                <div class="last">
                    <div style="border-right: solid 1px #dde4eb;width: 18%;height: 100%;display: flex;align-items: center">
                        <i style="padding-left: 20px;color: #7c8185;padding-right: 15px">角色标识：</i>
                        <i>admin</i>
                    </div>
                    <div style="border-right: solid 1px #dde4eb;width: 18%;height: 100%;display: flex;align-items: center">
                        <i style="padding-left: 20px;color: #7c8185;padding-right: 15px">角色名称：</i>
                        <i>超级管理员</i>
                    </div>
                    <div style="border-right: solid 1px #dde4eb;width: 24%;height: 100%;display: flex;align-items: center">
                        <i style="padding-left: 20px;color: #7c8185;padding-right: 15px">备注：</i>
                        <i>超级管理员角色</i>
                    </div>
                    <div style="width: 40%;height: 100%;display: flex;align-items: center">
                        <i style="padding-left: 20px;color: #7c8185;padding-right: 15px">创建时间：</i>
                        <i>2020-06-01</i>
                    </div>
                </div>
            </div>
            <div class="role">
                <div class="front">
                    <div class="a">
                        <div class="roleDet">
                            <i class="line"></i>
                            <i class="font">角色权限</i>
                        </div>
                        <div class="aa" @click="edit">
                            <i class="iconfont iconbianji"></i>
                            <i>编辑</i>
                        </div>
                    </div>
                    <div class="icon">
                        <Icon type="ios-arrow-down"/>
                    </div>
                </div>
                <el-table border :data="rolesList" :header-cell-style="{backgroundColor:'#f4f6f9'}">
                    <el-table-column label="客体" prop="management" width="340"></el-table-column>
                    <el-table-column label="操作项">
                        <template slot-scope="{row,$index}">
                            <Tag checkable :checked="false" v-for="item in 5" :key="item" :name="item"
                                 @on-change="handleChange" ref="editTag">操作项{{ item }}
                                <Icon type="md-checkmark"></Icon>
                            </Tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </vue-perfect-scrollbar>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {Page, Icon, Spin, DatePicker, Checkbox, Tag} from 'view-design'
    import {Tree} from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';


    @Component({
        components: {
            Tag,
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            Checkbox,
            tabNav,
            mixSelect,
        }
    })

    export default class costStatistics extends Vue {
        rolesList: any = [
            {management: '房产管理'},
            {management: '收费管理'},
            {management: '房产管理'},
            {management: '收费管理'},
            {management: '房产管理'},
            {management: '收费管理'},
        ]
        checkTag: boolean = false

        mounted() {
        }

        handleChange(checked, name) {
            console.log(name)
            this.checkTag = checked
        }

        backClose() {
            this.$emit('close')
        }

        edit() {
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    .costTable {
        padding: 0 15px;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;

        .costTitle {
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;
            margin-bottom: 15px;
            .back {
                display: inline-flex;
                align-items: center;
                color: $theme-color;
                font-size: 14px;
                padding-right: 10px;
                margin-right: 10px;
                height: 16px;
                border-right: 1px solid #dde4eb;
                cursor: pointer;
                user-select: none;

                .iconfont {
                    color: $theme-color;
                    font-size: 12px;
                    line-height: 1;
                    margin-right: 4px;
                    margin-bottom: 2px;
                }
            }
        }

        .main {
            width: 100%;
            height: calc(100% - 90px);
            overflow: hidden;
            padding: 15px;

            .header {
                width: 100%;
                height: 96px;
                border: solid 1px #dde4eb;

                .front {
                    border-bottom: solid 1px #dde4eb;
                    height: 48px;
                    background-color: #f4f6f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .last {
                    width: 100%;
                    height: 48px;
                    display: flex;
                }
            }

            .role {
                margin-top: 30px;
                width: 100%;
                height: 400px;

                .front {
                    border: solid 1px #dde4eb;
                    border-bottom: none;
                    height: 48px;
                    background-color: #f4f6f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            }

            .front {
                .a {
                    width: calc(100% - 40px);
                    display: flex;
                    justify-content: space-between;
                    padding-left: 10px;
                    padding-right: 20px;

                    .roleDet {
                        .line {
                            display: inline-block;
                            width: 4px;
                            height: 12px;
                            background-color: #3a7ef3;
                            border-radius: 2px;
                        }

                        .font {
                            font-size: 16px;
                            color: #30374a;
                            padding-left: 6px;
                            font-weight: bolder;
                        }
                    }

                    .aa {
                        user-select: none;
                        cursor: pointer;
                        color: #3a7ef3;

                        .iconbianji {
                            padding-right: 6px;
                        }
                    }
                }

                .icon {
                    height: 100%;
                    width: 40px;
                    border-left: solid 1px #dde4eb;
                    line-height: 48px;
                    text-align: center;
                    align-items: center;
                }
            }
        }
    }

    .el-table {
        .tableEdit {

        }

        .el-table tr {
            height: 48px;
        }
    }
</style>
<style lang="scss">
    .ivu-tag {
        width: 100px;
        height: 30px;
        background-color: #e8f2ff;
        border: solid 1px #8ab5ff;
        border-radius: 0;
        font-size: 14px;
        margin-left: 20px;
        margin-right: 50px;
        text-align: center;
        position: relative;
        user-select: none;
        line-height: 30px;

        .ivu-tag-text {
            color: #a0a5a9;

            .ivu-icon {
                font-size: 12px;
                width: 13px;
                height: 10px;
                color: #8ab5ff;
                font-weight: bolder;
                position: absolute;
                right: 6px;
                top: 50%;
                margin-top: -5px;
            }
        }
    }

    .ivu-tag.ivu-tag-default {
        .ivu-icon {
            display: none;
        }
    }

    .ivu-tag.ivu-tag-default.ivu-tag-checked {
        .ivu-icon {
            display: inline-block;
        }
    }

    .ivu-tag:not(.ivu-tag-border):not(.ivu-tag-dot):not(.ivu-tag-checked) {
        background: rgba(255, 255, 255, 0);
        border: 1px solid rgba(255, 255, 255, 0);
    }

    .el-table th.is-leaf {
        border-color: #dde4eb;
    }
</style>
