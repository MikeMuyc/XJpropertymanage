<template>
    <div id="auditRecord" ref="viewbox">
        <div class="costTitle" ref="title">
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            审核记录
        </div>
        <div class="search" ref="search">
            <mixSelect
                    class="selectLeft"
                    v-model="pages.authentication"
                    :selectList="stateList"
                    labelName="name"
                    valueName="val"
                    childrenName="children"
                    style="width: 140px"
                    placeholder="审核状态"
            >
            </mixSelect>
            <mixSelect
                    class="selectLeft"
                    v-model="pages.relationCode"
                    :selectList="personList"
                    labelName="name"
                    valueName="code"
                    childrenName="children"
                    style="width: 140px"
                    placeholder="身份类型"
            >
            </mixSelect>
            <Input placeholder="请输入姓名手机号" style="width: 200px;margin-right: 15px"
                   v-model="pages.tel" @enter="getPage()"></Input>
            <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                <i class="iconfont iconsousuo"></i>搜索
            </div>
            <div class="pmbtn" @click="resetSearch">
                <i class="iconfont iconzhongzhi"></i>重置
            </div>
        </div>
        <el-table
                stripe
                v-loading="loading"
                class="myTable"
                :data="recordList"
                :height="formHeight"
        >
            <template slot="empty" >
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>
            <el-table-column
                    prop="account"
                    label="用户名"
                    min-width="120"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    prop="personType"
                    label="身份类型"
                    min-width="110"
            >
                <template slot-scope="{row}">
                    {{changePersonType(row.relationCode)}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="tel"
                    label="手机号"
                    min-width="140"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    min-width="120"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别"
                    width="80"
            ></el-table-column>
            <el-table-column
                    prop="birthday"
                    label="出生日期"
                    width="120"
            ></el-table-column>
            <el-table-column
                    prop="idNumber"
                    label="身份证号"
                    min-width="150"
            ></el-table-column>
            <el-table-column
                    prop="address"
                    label="地址"
                    min-width="180"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    prop="state"
                    label="状态"
                    min-width="110"
            >
                <template slot-scope="{row}">
                    <i v-if="row.authentication === 0" style="color: #ff9900;">待审核</i>
                    <i v-else-if="row.authentication === 1" style="color: #a0a5a9;">已通过</i>
                    <i v-else-if="row.authentication === 2" style="color: #ff2c2c;">已拒绝</i>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="注册时间"
                    width="170"
            ></el-table-column>
            <el-table-column
                    prop="authenticationTime"
                    label="审核时间"
                    width="170"
            ></el-table-column>

        </el-table>
        <Page show-elevator show-total
              :page-size="pages.pageSize"
              :current="pages.pageNum"
              :total="pages.totalElements"
              @on-change="getPage"
              ref="pagebox"
        />

    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator"
    import { Page } from 'view-design'
    import { Tree } from 'iview'
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue'
    import * as api from '@manage/api/authox'

    @Component({
        components: {
            Input,
            Tree,
            Page,
            mixSelect,
        }
    })

    export default class auditRecord extends Vue {
        @Prop({
            default: false,
        }) recordFlag!: boolean;
        @Prop({
            default: [],
        }) personList!: Array<any>;

        @Watch('recordFlag')
        flagChange(){
            if(this.recordFlag){
                setTimeout(()=>{
                    let refs: any = this.$refs;
                    let maxHeight = refs.viewbox.clientHeight;
                    let title = refs.title.clientHeight;
                    let search = refs.search.clientHeight;
                    this.formHeight = maxHeight - title - search - 53;
                    this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                    this.resetSearch()
                },500)
            }
        }
        stateList:any = [
            {
                name: '全部状态',
                val: '',
            },
            {
                name: '待审核',
                val: '0',
            },
            {
                name: '已通过',
                val: '1',
            },
            {
                name: '已拒绝',
                val: '2',
            },
        ];

        recordList: any = [
            {
                username:'admin123',
                name:'李磊',
                gender:'男',
                state:1,

            },
            {
                username:'zx1995',
                name:'张新',
                gender:'男',
                state:0,
                address:'鑫海路68号'
            },
        ];
        totalDate:Array<{
            "id": string,
            "name": string,
            "count": number,
            "keyName": string
        }> = [];



        pages: any = {
            authentication: '',
            relationCode: '',
            tel: '',
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        formHeight: number = 600
        loading: boolean = false

        mounted() {

        }

        async getAuditHisList(){
            this.loading = true;
            try {
                let obj: any = {
                    pageNum: this.pages.pageNum,
                    pageSize: this.pages.pageSize,
                }
                if (this.pages.authentication) {
                    obj.authentication = this.pages.authentication
                }
                if (this.pages.relationCode) {
                    obj.relationCode = this.pages.relationCode
                }
                if (this.pages.tel) {
                    obj.tel = this.pages.tel
                }
                let {content, totalElements} = await api.getAuditHisList(obj);
                this.recordList = content;
                this.pages.totalElements = totalElements;
                this.loading = false;
            } catch (e) {
                this.loading = false;
                this.$message.error(`获取审核记录列表失败！`)
            }
        }


        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getAuditHisList();

        }

        resetSearch(){
            this.pages.authentication = '';
            this.pages.relationCode = '';
            this.pages.tel = '';
            this.pages.pageNum = 1;
            this.getPage();
        }
        changePersonType(code: string) {
            let obj: any = this.personList.find(item => item.code === code);
            if (obj) {
                return obj.name
            } else {
                return '-'
            }
        }
        backClose(){
            this.$emit(`close`)
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #auditRecord {
        font-size: 14px;
        height: 100%;
    }
    .search {
        display: flex;
        padding: 15px 0;
        .selectLeft {
            margin-right: 15px;
            height: 36px;
        }
    }
    .costTitle{
        height: 60px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #dde4eb;
        font-size: 16px;
        font-weight: bold;
        .back{
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
            font-weight: normal;
            .iconfont{
                color: $theme-color;
                font-size: 12px;
                line-height: 1;
                margin-right: 4px;
                margin-bottom: 2px;
            }
        }
    }
</style>

