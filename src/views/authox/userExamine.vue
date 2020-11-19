<template>
    <div id="userExamine" ref="viewbox">
        <transition name="leftSlide">
            <div v-show="recordFlag === 0" style="width: 100%;height: 100%">
                <div class="thTitle" ref="thTitle">
                    <i class="line"></i>手机用户审核

                    <div class="right" @click="recordFlag=1">
                        <div class="iconfont iconlishijilu"></div>
                        审核记录
                    </div>
                </div>
                <div class="middleLine" ref="middleLine">
                    <div class="moneyInfo">
                        <div class="items">
                            <div class="graph"
                                 style=" background-image: linear-gradient(269deg, #ff762e 0%, #ffbd24 100%);">
                                <i class="iconfont icondaishenhe"></i>
                            </div>
                            <div class="character">
                                <div class="des">待审核：</div>
                                <div class="money"><i>2</i>个</div>
                            </div>
                        </div>
                        <div class="items">
                            <div class="graph"
                                 style="background-image: linear-gradient(271deg,#3fe8b5 0%, #00c2e1 100%);;">
                                <i class="iconfont iconshenhetongguo"></i>
                            </div>
                            <div class="character">
                                <div class="des">已通过：</div>
                                <div class="money"><i>3</i>个</div>
                            </div>
                        </div>
                        <div class="items">
                            <div class="graph"
                                 style="background-image: linear-gradient(269deg, #ff3636 0%, #ffa15a 100%);">
                                <i class="iconfont iconshenheshibai"></i>
                            </div>
                            <div class="character">
                                <div class="des">已拒绝：</div>
                                <div class="money"><i>2</i>个</div>
                            </div>
                        </div>
                    </div>
                    <div class="search">
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
                        <Input placeholder="请输入手机号" style="width: 200px;margin-right: 15px"
                               v-model="pages.tel" @enter="getPage()"></Input>
                        <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                            <i class="iconfont iconsousuo"></i>搜索
                        </div>
                        <div class="pmbtn" @click="resetSearch">
                            <i class="iconfont iconzhongzhi"></i>重置
                        </div>
                    </div>
                </div>
                <el-table
                        stripe
                        v-loading="loading"
                        class="myTable"
                        :data="auditList"
                        :height="formHeight"
                >
                    <template slot="empty">
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
                            prop="relationCode"
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
                            prop="authentication"
                            label="状态"
                            width="120"
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
                    <el-table-column
                            label="操作"
                            width="130px"
                    >
                        <template slot-scope="{row}">
                            <div class="tableEdit">
                                <div v-if="row.authentication === 0" class="item" @click="sendAudit(row.authenticationId,`1`)">通过</div>
                                <div v-if="row.authentication === 0" class="item delete" @click="sendAudit(row.authenticationId,`2`)">拒绝</div>
                                <div v-else-if="row.authentication === 1" class="item delete"
                                     @click="cancellation(row)">注销
                                </div>
                                <div v-else>-</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <Page show-elevator show-total
                      :page-size="pages.pageSize"
                      :current="pages.pageNum"
                      :total="pages.totalElements"
                      @on-change="getPage"
                      ref="pagebox"
                />
            </div>
        </transition>
        <transition name="rightSlide">
            <auditRecord :personList="personList"
                         :recordFlag="recordFlag"
                         v-show="recordFlag === 1"
                         @close="recordFlag = 0"></auditRecord>
        </transition>

    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {Page} from 'view-design'
    import {Tree} from 'iview'
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue'
    import auditRecord from './auditRecord.vue'
    import * as api from '@manage/api/authox'

    @Component({
        components: {
            Input,
            Tree,
            Page,
            mixSelect,
            auditRecord
        }
    })

    export default class userExamine extends Vue {

        recordFlag: any = 0;
        stateList: any = [
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
        personList: any = [];

        thisData:any = {
            "content": [{
                "id": "123",
                "name": "admin",
                "sex": null,
                "birthday": null,
                "tel": "15267002015",
                "photoId": null,
                "account": "admin",
                "idNumber": null,
                "email": null,
                "description": null,
                "accountId": "566045cbdd621dff8c0f6bc1",
                "createTime": "2020-08-09 12:50:33",
                "authentication": 1,
                "authenticationTime": "2020-08-09 12:51:01",
                "authenticationId": "muohplehllgajsotapphxdlw",
                "address": null,
                "relationCode": "2"
            }, {
                "id": "egvmnlwnfktjxatqoexhygcc",
                "name": "赵子龙444",
                "sex": "1",
                "birthday": "2012-09-01",
                "tel": "17376561063",
                "photoId": "",
                "account": "zhaozl444",
                "idNumber": null,
                "email": "1547362955@qq.com",
                "description": null,
                "accountId": "gicdkzttzrlprmbkrngjqozo",
                "createTime": "2020-09-21 15:42:55",
                "authentication": 1,
                "authenticationTime": "2020-09-21 15:54:31",
                "authenticationId": "yfudefmdatbbuprcxgdjtoao",
                "address": null,
                "relationCode": "1"
            }, {
                "id": "ewyvfvzprzbezbhhdmeqigkb",
                "name": "赵子龙555",
                "sex": "1",
                "birthday": "2012-09-01",
                "tel": "17376561065",
                "photoId": "",
                "account": "zhaozl555",
                "idNumber": null,
                "email": "1547362956@qq.com",
                "description": null,
                "accountId": "cvmyvdapqjmrzcpaujstpbzl",
                "createTime": "2020-09-21 15:43:14",
                "authentication": 2,
                "authenticationTime": "2020-09-21 16:22:23",
                "authenticationId": "oxhrxrebwccliwbmzyltiwyi",
                "address": null,
                "relationCode": "1"
            }, {
                "id": "tcdhnywydxjvendmmvplieow",
                "name": "赵子龙333",
                "sex": "1",
                "birthday": "2012-09-01",
                "tel": "17376561062",
                "photoId": "",
                "account": "zhaozl333",
                "idNumber": null,
                "email": "1547362953@qq.com",
                "description": null,
                "accountId": "zpcjraenumnsizmwvwfegacn",
                "createTime": "2020-09-21 00:07:45",
                "authentication": 2,
                "authenticationTime": "2020-09-21 16:23:11",
                "authenticationId": "zpksghajmxxovjphzyjxrhto",
                "address": null,
                "relationCode": "1"
            }, {
                "id": "vpeiqczihkytehxknxstqyrt",
                "name": "张艺兴",
                "sex": "1",
                "birthday": "2012-09-01",
                "tel": "17376561010",
                "photoId": "http://124.160.109.243:31400/easyud/basic/download/file?id=9f2c3be2832b49b594c948bdf1ee1aa6",
                "account": "zhangyx",
                "idNumber": null,
                "email": "1547362950@qq.com",
                "description": null,
                "accountId": "qdsljfxnlwcrsiyyexapfkxm",
                "createTime": "2020-09-02 13:26:56",
                "authentication": 1,
                "authenticationTime": "2020-08-09 12:51:01",
                "authenticationId": "ezfhzabrqakpazgsjtoxpnta",
                "address": null,
                "relationCode": "1"
            }, {
                "id": "vpeutwrdwxnpuqdegfdlogca",
                "name": "赵子龙",
                "sex": "1",
                "birthday": "2012-09-01",
                "tel": "17376561022",
                "photoId": "",
                "account": "zhaozl",
                "idNumber": null,
                "email": "1547362952@qq.com",
                "description": null,
                "accountId": "kxeaqonjnnsbezilfhqlxeie",
                "createTime": "2020-09-13 14:00:05",
                "authentication": 0,
                "authenticationTime": null,
                "authenticationId": "kbtsperfwshrsyacvzpuxymq",
                "address": null,
                "relationCode": "1"
            }, {
                "id": "xbcumhlsmuhaksjoltbmyxcc",
                "name": "刘瑶",
                "sex": "2",
                "birthday": "1993-03-11",
                "tel": "18290828087",
                "photoId": "",
                "account": "liuy",
                "idNumber": "",
                "email": "596935999@qq.com",
                "description": null,
                "accountId": "bwbujvfzgpdsqotknahztrhp",
                "createTime": "2020-10-14 14:08:09",
                "authentication": 0,
                "authenticationTime": null,
                "authenticationId": "blkozeocywmbtaazaaledtzm",
                "address": null,
                "relationCode": ""
            }],
            "pageable": {
                "sort": {
                    "sorted": false,
                    "unsorted": true,
                    "empty": true
                },
                "pageNumber": 0,
                "pageSize": 11,
                "offset": 0,
                "unpaged": false,
                "paged": true
            },
            "last": true,
            "totalPages": 1,
            "totalElements": 7,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "numberOfElements": 7,
            "first": true,
            "size": 11,
            "number": 0,
            "empty": false
        };
        auditList: Array<any> = [];
        auditStatistic: any = {
            '0': '',
            '1': '',
            '2': '',
        }

        formHeight: number = 600
        pages: any = {
            authentication: '',
            relationCode: '',
            tel: '',
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };

        loading: boolean = false

        mounted() {
            //this.getSelection(`personList`, `家庭与房屋关系`)
            this.$nextTick(() => {
                let refs: any = this.$refs;
                let maxHeight = refs.viewbox.clientHeight - 10;
                let thTitle = refs.thTitle.clientHeight;
                let middleLine = refs.middleLine.clientHeight;
                this.formHeight = maxHeight - thTitle - middleLine - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                this.resetSearch();
            })
        }

        async getSelection(Array: string, name: string) {
            let {data} = await api.getSelection(name);
            this[`${Array}`] = [{
                name: '全部类型',
                code: ''
            }].concat(data);
        }

        async getAuditList() {
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
                // let {content, totalElements} = await api.getAuditList(obj);
                let {content, totalElements} = this.thisData;
                this.auditList = content;
                this.pages.totalElements = totalElements;
                this.loading = false;
            } catch (e) {
                this.loading = false;
                this.$message.error(`获取用户审核列表失败！`)
            }
            //this.getAuditStatistic();
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getAuditList();
        }

        resetSearch() {
            this.pages.authentication = '';
            this.pages.relationCode = '';
            this.pages.tel = '';
            this.pages.pageNum = 1;
            this.getPage();
        }

        async getAuditStatistic() {
            try {
                let obj: any = {}
                if (this.pages.authentication) {
                    obj.authentication = this.pages.authentication
                }
                if (this.pages.relationCode) {
                    obj.relationCode = this.pages.relationCode
                }
                if (this.pages.tel) {
                    obj.tel = this.pages.tel
                }
                this.auditStatistic = await api.getAuditStatistic(obj);
            } catch (e) {
                this.$message.error(`获取审核信息统计失败！`)
            }
        }

        async cancellation(row) {
            this.$confirm('确定要注销此账户？?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                /*try {
                    //await api.deleteFee(ids)
                    this.resetSearch()
                    this.$message.success('注销成功')
                } catch (e) {
                    this.$message.error('注销失败')
                }*/
            }).catch(() => {

            });
        }

        async sendAudit(id:string,authentication:string) {
            try {
                let fd = new FormData();
                fd.append(`id`,id);
                fd.append(`authentication`,authentication)
                await api.sendAudit(fd)
                this.resetSearch()
                this.$message.success('审核成功')
            } catch (e) {
                this.$message.error('审核失败')
            }
        }

        changePersonType(code: string) {
            let obj: any = this.personList.find(item => item.code === code);
            if (obj) {
                return obj.name
            } else {
                return '-'
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #userExamine {
        font-size: 14px;

        .thTitle {
            position: relative;

            .right {
                position: absolute;
                height: 20px;
                right: 0;
                top: calc(50% - 10px);
                display: flex;
                align-items: center;
                color: $theme-color;
                font-size: 14px;
                font-weight: normal;
                cursor: pointer;
                user-select: none;

                .iconfont {
                    color: $theme-color;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 1;
                    margin-right: 4px;
                }
            }
        }
    }

    .middleLine {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        padding-top: 15px;

        .moneyInfo {
            display: flex;
            margin-bottom: 15px;
            height: 66px;

            .items {
                max-width: 220px;
                height: 66px;
                background-color: #ffffff;
                box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
                border-radius: 4px;
                padding: 0 15px;
                margin-right: 20px;
                display: flex;
                align-items: center;

                .graph {
                    width: 50px;
                    height: 50px;
                    margin-right: 12px;
                    border-radius: 100%;
                    display: flex;

                    i {
                        color: #fff;
                        font-size: 22px;
                        margin: auto;
                    }
                }

                .character {
                    display: flex;
                    align-items: center;
                    width: calc(100% - 62px);
                    justify-content: space-between;

                    .des {
                        color: $second-font-color;
                    }

                    .money {
                        i {
                            font-size: 18px;
                            margin-right: 4px;
                        }
                    }
                }
            }
        }

        .search {
            display: flex;
            margin-bottom: 15px;
            height: 36px;

            .selectLeft {
                margin-right: 15px;
                height: 36px;
            }
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

            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>
