<template>
    <div id="rolePermission">
        <transition name="leftSlide">
            <div class="authoxview" v-show="roleManageFlag===false">
                <div class="searchLine">
                    <div class="front">
                        <Input placeholder="请输入关键字" style="width: 200px;margin-right: 15px"></Input>
                        <div class="pmbtn primary" style="margin-right: 15px">
                            <i class="iconfont iconsousuo"></i>搜索
                        </div>
                        <div class="pmbtn">
                            <i class="iconfont iconzhongzhi"></i>重置
                        </div>
                    </div>
                    <div class="pmbtn primary" @click="addrole">
                        <i class="iconfont icontianjia"></i>新建角色
                    </div>
                </div>
                <el-table
                        stripe
                        class="myTable"
                        :data="rolesList"
                >
                    <template slot="empty">
                        <img src="@manage/images/暂无数据.png">
                        <br>
                        暂无内容
                    </template>
                    <el-table-column
                            prop="roleIndex"
                            label="角色标识"
                            min-width="82"
                    ></el-table-column>
                    <el-table-column
                            prop="roleName"
                            label="角色名称"
                            min-width="70"
                    ></el-table-column>
                    <el-table-column
                            prop="date"
                            label="创建时间"
                            min-width="78"
                    ></el-table-column>
                    <el-table-column
                            prop="remark"
                            label="备注"
                            min-width="135"
                    ></el-table-column>
                    <el-table-column
                            label="操作"
                            width="110px"
                    >
                        <template slot-scope="{row,$index}">
                            <div class="tableEdit">
                                <div class="item" @click="roleManageFlag = true">管理</div>
                                <div class="item delete">删除</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </transition>
        <transition name="rightSlide">
            <roleManage class="authoxview" v-show="roleManageFlag" @close="closeTable "></roleManage>
        </transition>
        <el-dialog
                :visible.sync="addRoleVisible"
                custom-class="emDialog"
                width="545px"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新建角色
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">角色标识</div>
                    <div class="info">
                        <Input placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">角色名称</div>
                    <div class="info">
                        <Input placeholder="请输入"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">备注</div>
                    <div class="info">
                        <textarea placeholder="请输入" style="width: 100%"></textarea>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px">确定</div>
                <div class="pmbtn" @click="addRoleVisible = false">取消</div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {Spin, Select, Option, Icon, Page, CheckboxGroup, RadioGroup, Radio, Checkbox} from 'view-design'
    import mixSelect from '@manage/components/mixSelect.vue'
    import Input from '@manage/components/normalInput.vue';
    import roleManage from './roleManage.vue';

    @Component({
        components: {
            Input,
            Icon,
            mixSelect,
            Spin,
            Page,
            Select,
            Option,
            CheckboxGroup,
            RadioGroup,
            Radio,
            Checkbox,
            roleManage
        }
    })

    export default class rolePermission extends Vue {
        rolesList: any = [
            {
                roleIndex: 'admin1',
            },
            {
                roleIndex: 'admin2',
            },
            {
                roleIndex: 'admin3',
            },
            {
                roleIndex: 'admin4',
            },
            {
                roleIndex: 'admin5',
            },
            {
                roleIndex: 'admin6',
            },
        ];
        addRoleVisible: boolean = false
        roleManageFlag: boolean = false

        addrole() {
            this.addRoleVisible = true
        }

        closeTable() {
            this.roleManageFlag = false;
        }

        handleSelectionChange() {
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";

    .authoxview{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .searchLine {
        padding-bottom: 14px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .front {
            display: flex;
        }
    }

    .tableEdit {
        display: inline-flex;

        > .item {
            margin-right: 15px;
            color: $second-font-color;
            cursor: pointer;

            &:hover {
                color: $theme-color;
            }

            &.delete:hover {
                color: $error-color;
            }
        }
    }

    .aline {
        width: 100%;
        display: flex;
        margin-bottom: 15px;

        &:last-child {
            margin-bottom: 0;
        }

        .label {
            padding-right: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: flex-end;
            height: 36px;
            width: 120px;
            color: $second-font-color;
        }

        .info {
            width: calc(100% - 120px);
            display: inline-flex;
            align-items: center;

            &.receive {
                align-items: baseline;
                color: $second-font-color;

                em, i {
                    color: $error-color;
                }

                em {
                    font-size: 24px;
                    line-height: 30px;
                }
            }

            .disabledbox {
                width: 100%;
                height: 36px;
                background-color: #f8f9fc;
                border-radius: 4px;
                border: solid 1px #dde4eb;
                color: $second-font-color;
                padding: 0 10px;
                display: inline-flex;
                align-items: center;

                &.red {
                    color: $error-color;
                }
            }
        }
    }
</style>
