<template>
    <div id="costStatistics" >
        <tabNav :tabList="tabList" @tabChange="tabChange"></tabNav>
        <transition name="leftSlide">
            <div class="viewbox" ref="viewbox" v-show="tabName === '收费信息'">
                <div class="searchline" ref="searchline">
                    <div class="left">
                        <mixSelect
                                class="margin"
                                v-model="rdId"
                                :selectList="communityList"
                                labelName="title"
                                valueName="id"
                                placeholder="全部小区"
                                style="width: 140px"
                        >
                        </mixSelect>
                        <div class="margin">
                            <i class="item">收费年月</i>
                            <DatePicker
                                    type="daterange"
                                    format="yyyy-MM-dd"
                                    placeholder="开始时间   ~   结束时间"
                                    style="width: 200px;"
                                    @on-change="setTimelist"
                                    ref="timelist"
                            ></DatePicker>
                        </div>
                        <div class="pmbtn primary margin" @click="getPage()">
                            <i class="iconfont iconsousuo"></i>搜索
                        </div>
                        <div class="pmbtn margin" @click="reset">
                            <i class="iconfont iconzhongzhi"></i>重置
                        </div>
                    </div>

                    <div class="item" style="margin-bottom: 20px">
                        <div class="pmbtn" style="margin-right: 15px" @click="tableCostFlag = true">
                            <i class="iconfont iconbiaoge"></i>小区收费汇总表
                        </div>
                        <div class="pmbtn" @click="tableOwnFlag = true">
                            <i class="iconfont iconbiaoge"></i>居民欠收统计表
                        </div>
                    </div>
                </div>
                <el-table
                        :data="coastList"
                        stripe
                        v-loading="loading"
                        class="myWisdomTable"
                        :height="formHeight"
                >
                    <template slot="empty" >
                        <img src="@manage/images/暂无数据.png">
                        <br>
                        暂无内容
                    </template>
                    <el-table-column
                            label="序号"
                            width="80px"
                            align="center"
                    >
                        <template slot-scope="{row,$index}">
                            {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="rdName"
                            label="管理区"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>

                    <el-table-column
                            prop="buildingName"
                            label="大楼名称"
                            min-width="150px"
                            show-overflow-tooltip
                    >
                    </el-table-column>

                    <el-table-column
                            prop="projectName"
                            label="收费项目"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>

                    <el-table-column
                            prop="totalAp"
                            label="应交本金(元)"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="paidAp"
                            label="已交本金(元)"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="unPaidAp"
                            label="欠交本金(元)"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>

                    <el-table-column
                            prop="lateFee"
                            label="应交滞纳金(元)"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="paidLateFee"
                            label="已交滞纳金(元)"
                            min-width="120px"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="unPaidLateFee"
                            label="欠交滞纳金(元)"
                            min-width="120px"
                            show-overflow-tooltip
                    >
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
            <csEchart v-show="tabName === '统计图表'"></csEchart>
        </transition>


        <transition name="rightSlide">
            <costTable v-show="tableCostFlag" @close="closeTable"></costTable>
        </transition>
        <transition name="rightSlide">
            <ownTable v-show="tableOwnFlag" @close="closeTable"></ownTable>
        </transition>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import csEchart from './costStatistics_echart.vue';
    import costTable from './costTable_cost.vue';
    import ownTable from './costTable_own.vue';
    import * as api from '@manage/api/propertyCharge/costStatistics'
    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            tabNav,
            mixSelect,
            csEchart,
            costTable,
            ownTable
        }
    })

    export default class costStatistics extends Vue {
        tabName: string = '收费信息';
        tabList: Array<{ name: string }> = [
            {
                name: '收费信息',
            },
            {
                name: '统计图表',
            },
        ];
        tableCostFlag: boolean = false;
        tableOwnFlag: boolean = false;
        communityList: any = [];

        coastList: any = [];
        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        loading: boolean = true;
        rdId:string = '';
        timeList:any = [];
        mounted() {
            this.getcommunityList();
            this.$nextTick(() => {
                let refs: any = this.$refs;
                //Page组件高度为53px
                let maxHeight = refs.viewbox.clientHeight - 15;
                let searchline = refs.searchline.clientHeight;
                this.formHeight = maxHeight - searchline - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                this.reset();
            })
        }

        async getcommunityList() {
            let {data} = await api.getTree1();
            this.communityList = data;
        }

        setTimelist(val){
            this.timeList = val
        }

        tabChange(item: any) {
            this.tabName = item.name;
        }

        thisData:any = {
            "content": [{
                "rdId": "8bd557d8904344fcb7876c25b431b1c1",
                "rdName": "kk",
                "buildingId": "8a1d93c65d104427b07e0ead17cecf89",
                "buildingName": "3号楼",
                "projectId": "ddhkpspsbaocyiulcgjtndyn",
                "projectName": "垃圾费",
                "totalAp": 190.00,
                "paidAp": 190.00,
                "unPaidAp": 0.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "8bd557d8904344fcb7876c25b431b1c1",
                "rdName": "kk",
                "buildingId": "8a1d93c65d104427b07e0ead17cecf89",
                "buildingName": "3号楼",
                "projectId": "jrtxmywzwdbwrasscztosaii",
                "projectName": "水费",
                "totalAp": 250.00,
                "paidAp": 250.00,
                "unPaidAp": 0.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "8bd557d8904344fcb7876c25b431b1c1",
                "rdName": "kk",
                "buildingId": "8a1d93c65d104427b07e0ead17cecf89",
                "buildingName": "3号楼",
                "projectId": "pjpnbsugypvoqsholsugokvd",
                "projectName": "临时停车费",
                "totalAp": 39.00,
                "paidAp": 39.00,
                "unPaidAp": 0.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "8bd557d8904344fcb7876c25b431b1c1",
                "rdName": "kk",
                "buildingId": "8a1d93c65d104427b07e0ead17cecf89",
                "buildingName": "3号楼",
                "projectId": "zlvsglelhcpbrfblhzxnnppm",
                "projectName": "物业服务费",
                "totalAp": 430.00,
                "paidAp": 90.00,
                "unPaidAp": 340.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "8bd557d8904344fcb7876c25b431b1c1",
                "rdName": "kk",
                "buildingId": "b784ef01890041caa45a6db921db82fe",
                "buildingName": null,
                "projectId": "ddhkpspsbaocyiulcgjtndyn",
                "projectName": "垃圾费",
                "totalAp": 0.00,
                "paidAp": 0.00,
                "unPaidAp": 0.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "8bd557d8904344fcb7876c25b431b1c1",
                "rdName": "kk",
                "buildingId": "b784ef01890041caa45a6db921db82fe",
                "buildingName": null,
                "projectId": "zlvsglelhcpbrfblhzxnnppm",
                "projectName": "物业服务费",
                "totalAp": 360.00,
                "paidAp": 0.00,
                "unPaidAp": 360.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "dtfopcvveoqdianfgqleaxdq",
                "rdName": "TEST06",
                "buildingId": "cvwwmnkokeepxjkzqjlkuher",
                "buildingName": "00号楼",
                "projectId": "wcgpestvsqkpmfjcloiedbxa",
                "projectName": "导入收费项目3",
                "totalAp": 787.03,
                "paidAp": 400.00,
                "unPaidAp": 387.03,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "erpeisaziwhfxtzjazcakqyr",
                "rdName": "ZZ",
                "buildingId": "hyafbcyyqlpebvvngpnyxhrd",
                "buildingName": "3301号楼",
                "projectId": "cbbhlzwpyzfsjqwigchmubnf",
                "projectName": "电费",
                "totalAp": 26.67,
                "paidAp": 0.00,
                "unPaidAp": 26.67,
                "lateFee": 18.88,
                "paidLateFee": 0.00,
                "unPaidLateFee": 18.88
            }, {
                "rdId": "erpeisaziwhfxtzjazcakqyr",
                "rdName": "ZZ",
                "buildingId": "hyafbcyyqlpebvvngpnyxhrd",
                "buildingName": "3301号楼",
                "projectId": "qlimozkwvkftiyzihfyrjoob",
                "projectName": "物业管理1",
                "totalAp": 1363.34,
                "paidAp": 346.67,
                "unPaidAp": 1016.67,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "erpeisaziwhfxtzjazcakqyr",
                "rdName": "ZZ",
                "buildingId": "syrtpkdsbncopgmzbzlxmtob",
                "buildingName": "3302号楼",
                "projectId": "qlimozkwvkftiyzihfyrjoob",
                "projectName": "物业管理1",
                "totalAp": 256.00,
                "paidAp": 0.00,
                "unPaidAp": 256.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "GLC0000001",
                "rdName": "南湖小区",
                "buildingId": "DLDM000013",
                "buildingName": "01号楼",
                "projectId": "49cb581c6ae04509aa132fa9c4daae9a",
                "projectName": "屋顶费",
                "totalAp": 42.00,
                "paidAp": 0.00,
                "unPaidAp": 42.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }, {
                "rdId": "GLC0000003",
                "rdName": "红山小区",
                "buildingId": "DLDM000023",
                "buildingName": "04号楼",
                "projectId": "03898e301fc64e2491f85204df274fae",
                "projectName": "门禁电梯费",
                "totalAp": 377.00,
                "paidAp": 377.00,
                "unPaidAp": 0.00,
                "lateFee": 0.00,
                "paidLateFee": 0.00,
                "unPaidLateFee": 0.00
            }],
            "pageable": {
                "sort": {
                    "sorted": false,
                    "unsorted": true,
                    "empty": true
                },
                "pageNumber": 0,
                "pageSize": 12,
                "offset": 0,
                "paged": true,
                "unpaged": false
            },
            "totalElements": 40,
            "totalPages": 4,
            "last": false,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "numberOfElements": 12,
            "first": true,
            "size": 12,
            "number": 0,
            "empty": false
        };
        async getCostList(){
            this.loading = true;
            try {
                /*let {data:{content,totalElements}} = await api.getCostList({
                    rdId:this.rdId,
                    startTime: this.timeList[0],
                    endTime: this.timeList[1],
                    pageNum:this.pages.pageNum,
                    pageSize:this.pages.pageSize,
                });*/
                let {content,totalElements} = this.thisData;
                this.coastList = content;
                this.pages.totalElements = totalElements;
            }catch (e) {
                this.$message.error(`获取收费信息列表失败！`)
            }
            this.loading = false;
        }

        reset() {
            this.rdId = '';
            let refs:any = this.$refs;
            refs.timelist.handleClear();
            this.timeList = []
            this.getPage();
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getCostList();
        }

        closeTable() {
            this.tableCostFlag = false;
            this.tableOwnFlag = false;
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #costStatistics {

        position: relative;

        .viewbox {
            padding-top: 15px;
            height: calc(100% - 60px);
            width: 100%;

            .searchline {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .left {
                    display: flex;
                    width: 540px;
                }

                .margin {
                    margin-right: 15px;
                    margin-bottom: 20px;
                    display: flex;
                    flex: none;
                }

                .item {
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    flex: none;
                    margin-right: 15px;
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
        }
    }

    .aline {
        .label {
            width: 100px;
        }

    }


</style>
<style lang="scss">

</style>
