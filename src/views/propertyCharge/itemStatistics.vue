<template>
    <div id="itemStatistics" ref="viewbox">
        <div class="thTitle" ref="thTitle">
            <i class="line"></i>收款员交款统计
        </div>
        <div class="searchline" ref="searchline">
            <mixSelect
                    class="margin"
                    v-model="payTypeCode"
                    :selectList="paywayList"
                    labelName="name"
                    valueName="code"
                    placeholder="收款方式"
                    style="width: 140px"
            >
            </mixSelect>
            <div class="margin item">
                收款时间
                <DatePicker type="datetimerange"
                            format="yyyy-MM-dd"
                            placeholder="开始时间   ~   结束时间"
                            style="width: 200px;margin-left: 8px"
                            @on-change="dateChange"
                            ref="timerange">
                </DatePicker>
            </div>

            <div class="margin item">
                <Input v-model="roomName" placeholder="房间代码" style="width: 200px;margin-right: 15px" @enter="getPage()"></Input>
                <Input v-model="createPerson" placeholder="请输入收款人姓名" style="width: 200px;margin-right: 15px" @enter="getPage()"></Input>
                <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                    <i class="iconfont iconsousuo"></i>搜索
                </div>
                <div class="pmbtn" @click="resetSearch">
                    <i class="iconfont iconzhongzhi"></i>重置
                </div>

            </div>
            <div class="pmbtn margin" >
                <i class="iconfont icondaoru"></i>导出
            </div>
        </div>
        <el-table
                stripe
                v-loading="loading"
                class="myTable"
                :data="tableData"
                :height="formHeight"
        >
            <template slot="empty" >
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>
            <el-table-column
                    prop="documentCode"
                    label="单据编号"
                    min-width="150"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    prop="personName"
                    label="收款人"
                    min-width="80"
            ></el-table-column>
            <el-table-column
                    prop="roomName"
                    label="房间代码"
                    min-width="140"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    prop="projectName"
                    label="收费项目"
                    min-width="120"
            ></el-table-column>
            <el-table-column
                    prop="paidTime"
                    label="收款日期"
                    min-width="170"
            ></el-table-column>
            <el-table-column
                    prop="payType"
                    label="收款方式"
                    min-width="100"
            ></el-table-column>
            <el-table-column
                    prop="totalAp"
                    label="实收金额(元)"
                    min-width="120"
            ></el-table-column>
        </el-table>
        <div class="bottomLine">
            <div class="moneySum" ref="moneySum" v-show="show">
                <div class="aggregate" v-for="item in totalDate">
                    <img v-if="item.id === `total`" src="../../images/总计.png">
                    <img v-else-if="item.id === `2`"  src="../../images/现金.png">
                    <img v-else-if="item.id === `3`" src="../../images/手机.png">
                    <img v-else-if="item.id === `1`" src="../../images/POS.png">
                    <i class="a">{{item.name}}</i>
                    <i>￥</i>
                    <i class="b">{{item.count}}</i>
                </div>
            </div>
            <Page show-elevator show-total
                  :page-size="pages.pageSize"
                  :current="pages.pageNum"
                  :total="pages.totalElements"
                  @on-change="getPage"
                  ref="pagebox"
                  style="width: 504px"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {Select,  Page, Button, Option, Icon, Spin, DatePicker, RadioGroup, Radio} from 'view-design'
    import { Tree } from 'iview'
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue'
    import * as api from '@manage/api/propertyCharge/itemStatistics'

    @Component({
        components: {
            Icon,
            Input,
            Select,
            Option,
            Tree,
            Page,
            Button,
            Spin,
            DatePicker,
            mixSelect,
            RadioGroup,
            Radio
        }
    })

    export default class itemStatistics extends Vue {

        roomName:string = '';
        createPerson:string = '';
        payTypeCode:string = '';
        startTime:string = '';
        endTime:string = '';


        tableData: any = [];
        totalDate:Array<{
            "id": string,
            "name": string,
            "count": number,
            "keyName": string
        }> = [];
        paywayList: any = [];
        show: boolean = true

        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        formHeight: number = 600
        loading: boolean = false

        mounted() {
            //this.getPayType();
            this.$nextTick(() => {
                let refs: any = this.$refs;
                let maxHeight = refs.viewbox.clientHeight - 10;
                let thTitle = refs.thTitle.clientHeight;
                let searchline = refs.searchline.clientHeight;
                this.formHeight = maxHeight - thTitle - searchline - 53;
                this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                this.resetSearch();
            })
        }

        thisData:any = {
            "content": [{
                "documentCode": "112020-110000000002",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "2",
                "payType": "现金",
                "paidTime": "2020-11-04 16:47:21",
                "totalAp": 98.33,
                "roomId": "wbqzcmfhizvmshiqddmlzvpr",
                "roomName": "1",
                "projectId": "axrprvieerkjqjswurxeajyb",
                "projectName": "物业管理附加费用",
                "personName": "超级管理员"
            }, {
                "documentCode": "TEST062020-100000000002",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "3",
                "payType": "扫码支付",
                "paidTime": "2020-10-12 12:08:51",
                "totalAp": 200.00,
                "roomId": "ucfazqulghwjqkvsmzawldby",
                "roomName": "TEST06-02-1-1001",
                "projectId": "wcgpestvsqkpmfjcloiedbxa",
                "projectName": "导入收费项目3",
                "personName": "超级管理员"
            }, {
                "documentCode": "TEST062020-100000000002",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "3",
                "payType": "扫码支付",
                "paidTime": "2020-10-12 12:08:51",
                "totalAp": 200.00,
                "roomId": "ucfazqulghwjqkvsmzawldby",
                "roomName": "TEST06-02-1-1001",
                "projectId": "wcgpestvsqkpmfjcloiedbxa",
                "projectName": "导入收费项目3",
                "personName": "超级管理员"
            }, {
                "documentCode": "CHY2020-090000000010",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "4",
                "payType": "预交抵扣",
                "paidTime": "2020-09-28 13:52:04",
                "totalAp": 10.56,
                "roomId": "HS-4-1-303",
                "roomName": "HS-4-1-303",
                "projectId": "ewunrkpkuhmmsggtormjsgps",
                "projectName": "绿化公摊",
                "personName": "超级管理员"
            }, {
                "documentCode": "zzzz002020-090000000002",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "2",
                "payType": "现金",
                "paidTime": "2020-09-23 11:02:03",
                "totalAp": 146.67,
                "roomId": "ugxkfoytzkhtgysmwgtgjqnt",
                "roomName": "zz3301101",
                "projectId": "qlimozkwvkftiyzihfyrjoob",
                "projectName": "物业管理1",
                "personName": "超级管理员"
            }, {
                "documentCode": "NH2020-090000000015",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "4",
                "payType": "预交抵扣",
                "paidTime": "2020-09-22 15:49:44",
                "totalAp": 6.33,
                "roomId": "SHY-幼儿园楼",
                "roomName": "SHY-幼儿园楼",
                "projectId": "a191a3da684e4e22a641f3248f1898ac",
                "projectName": "垃圾费",
                "personName": "超级管理员"
            }, {
                "documentCode": "NH2020-090000000013",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "1",
                "payType": "pos",
                "paidTime": "2020-09-22 15:47:58",
                "totalAp": 6.00,
                "roomId": "SHY-幼儿园楼",
                "roomName": "SHY-幼儿园楼",
                "projectId": "651b54c47a994e07af24390e28ff7b1d",
                "projectName": "物业费",
                "personName": "超级管理员"
            }, {
                "documentCode": "NH2020-090000000012",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "2",
                "payType": "现金",
                "paidTime": "2020-09-22 15:47:32",
                "totalAp": 10.00,
                "roomId": "SHY-幼儿园楼",
                "roomName": "SHY-幼儿园楼",
                "projectId": "a191a3da684e4e22a641f3248f1898ac",
                "projectName": "垃圾费",
                "personName": "超级管理员"
            }, {
                "documentCode": "CHY2020-090000000002",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "4",
                "payType": "预交抵扣",
                "paidTime": "2020-09-22 15:30:57",
                "totalAp": 20.00,
                "roomId": "HS-4-1-201",
                "roomName": "HS-4-1-201",
                "projectId": "f88172a1a69e4cf8b38967f866089617",
                "projectName": "物业费",
                "personName": "超级管理员"
            }, {
                "documentCode": "1002020-090000000002",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "2",
                "payType": "现金",
                "paidTime": "2020-09-21 15:07:30",
                "totalAp": 70.00,
                "roomId": "dtqgigokmuneedtymnpgrbfd",
                "roomName": "3",
                "projectId": "zlvsglelhcpbrfblhzxnnppm",
                "projectName": "物业服务费",
                "personName": "超级管理员"
            }, {
                "documentCode": "test052020-090000000002",
                "createPerson": "qdsljfxnlwcrsiyyexapfkxm",
                "payTypeCode": "1",
                "payType": "pos",
                "paidTime": "2020-09-16 18:31:46",
                "totalAp": 2000.00,
                "roomId": "tpgoaihwlamosupbkbaavpro",
                "roomName": "test05-07-1-1-1102",
                "projectId": "zajmxrixuepdyoqmclwjfcxc",
                "projectName": "0916收费项目3",
                "personName": "张艺兴"
            }, {
                "documentCode": "zzzz002020-090000000002",
                "createPerson": "566045cbdd621dff8c0f6bc1",
                "payTypeCode": "3",
                "payType": "扫码支付",
                "paidTime": "2020-09-09 11:24:29",
                "totalAp": 200.00,
                "roomId": "ugxkfoytzkhtgysmwgtgjqnt",
                "roomName": "zz3301101",
                "projectId": "qlimozkwvkftiyzihfyrjoob",
                "projectName": "物业管理1",
                "personName": "超级管理员"
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
            "totalElements": 52,
            "totalPages": 5,
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
        }
        async getCashlist(){
            this.loading = true;
            try {
                /*let {data: {content, totalElements}} = await api.getCashlist({
                    pageNum:this.pages.pageNum,
                    pageSize:this.pages.pageSize,
                    startTime:this.startTime,
                    endTime:this.endTime,
                    createPerson:this.createPerson,
                    payTypeCode:this.payTypeCode,
                    roomName:this.roomName,
                });*/
                let  {content, totalElements} = this.thisData;
                this.tableData = content;
                this.pages.totalElements = totalElements;
                this.loading = false;
            }catch (e) {
                this.loading = false;
                this.$message.error(`获取统计列表失败！`)
            }
        }
        async getCashTotal(){

            try {
                // let {data} = await api.getCashTotal({
                //     pageNum:this.pages.pageNum,
                //     pageSize:this.pages.pageSize,
                //     startTime:this.startTime,
                //     endTime:this.endTime,
                //     createPerson:this.createPerson,
                //     payTypeCode:this.payTypeCode,
                //     roomName:this.roomName,
                // });

                this.totalDate = [{
                    "id": "total",
                    "name": "总计",
                    "count": 0,
                    "keyName": ""
                }, {
                    "id": "1",
                    "name": "pos",
                    "count": 2178.00,
                    "keyName": null
                }, {
                    "id": "2",
                    "name": "现金",
                    "count": 1565.27,
                    "keyName": null
                }, {
                    "id": "3",
                    "name": "扫码支付",
                    "count": 872.34,
                    "keyName": null
                }, {
                    "id": "4",
                    "name": "预交抵扣",
                    "count": 317.69,
                    "keyName": null
                }];
            }catch (e) {
                this.$message.error(`获取统计数据失败！`)
            }
        }

        getPage(pageNum?: number) {
            if (pageNum) {
                this.pages.pageNum = pageNum;
            } else {
                this.pages.pageNum = 1;
            }
            this.getCashlist();
            this.getCashTotal();
        }

        resetSearch(){
            this.roomName = '';
            this.createPerson = '';
            this.payTypeCode = '';
            this.startTime = '';
            this.endTime = '';

            let refs:any = this.$refs;
            refs.timerange.handleClear();
            this.getPage();
        }

        //支付方式
        async getPayType() {
            let {data} = await api.getInfoByName('支付方式')
            this.paywayList = data
            this.paywayList.unshift({
                name:'所有方式',
                code:''
            })
        }

        dateChange(val) {
            this.startTime = val[0];
            this.endTime = val[1];
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #itemStatistics {
        font-size: 14px;
        .searchline {
            padding: 20px 0px;
            display: flex;
            flex-wrap: wrap;

            .margin {
                margin-right: 15px;
                display: flex;
                align-items: center;
            }
        }

        .bottomLine{
            display: flex;
            align-content: center;
            justify-content: space-between;
            .moneySum {
                height: 54px;
                display: flex;
                align-items: center;
                flex:1;
                max-width: 1000px;
                justify-content: space-between;

                .aggregate {
                    height: 24px;
                    display: flex;
                    align-items: center;
                    margin-right: 10px;

                    .a {
                        white-space: nowrap;
                        padding: 0 10px;
                        color: $second-font-color;
                    }

                    .b {
                        font-size: 18px;
                        white-space: nowrap;
                    }
                }
            }
        }

    }
</style>
<style lang="scss">

    #itemStatistics {
        .el-table::before {
            height: 0;
        }

    }
</style>
