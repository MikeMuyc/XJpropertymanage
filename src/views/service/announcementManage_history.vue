<template>
    <div  id="historyMain" ref="historyMain">
        <div class="historyTitle" ref="historyTitle" >
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            历史记录
        </div>
        <div class="searchline" ref="searchline">
            <div class="margin">
                <Input placeholder="请输入关键字"
                       style="width: 200px;margin-right: 15px"></Input>
                <div class="pmbtn primary">
                    <i class="iconfont iconsousuo"></i>搜索
                </div>
            </div>
        </div>
        <el-table
                :data="historyList"
                stripe
                :height="formHeight"
                :header-cell-style="{background:'#f4f6f9'}"
                v-loading="loading"
        >
            <template slot="empty" >
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </template>
            <el-table-column
                    label="序号"
                    width="100px"
                    align="center"
            >
                <template slot-scope="{row,$index}">
                    {{pages.pageSize*(pages.pageNum-1) + $index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                    prop=""
                    label="标题"
                    min-width="200px"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop=""
                    label="公告内容"
                    min-width="450px"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop=""
                    label="展示时间"
                    min-width="150px"
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
</template>

<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox, RadioGroup, Radio} from 'view-design'
    import { Tree } from 'iview'
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';

    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            Checkbox,
            mixSelect,
            Input,
            RadioGroup,
            Radio,
        }
    })

    export default class historyMain extends Vue {
        @Prop({
            default: false,
        }) historyFlag!: boolean;
        @Watch(`historyFlag`)
        setHeight() {
            if (this.historyFlag) {
                let refs: any = this.$refs;
                setTimeout(() => {
                    //Page组件高度为53px
                    this.formHeight = (refs.historyMain.clientHeight - refs.searchline.clientHeight - refs.historyTitle.clientHeight) -15- 53;
                    this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
                },300)
            }
        }

        loading: boolean = false;
        formHeight:number=600
        historyList:any=[]
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };

        getPage(page) {
            this.pages.pageNum = page;
        }
        backClose() {
            this.$emit(`close`)
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/standard-global";
    #historyMain {
        padding:0 20px ;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;

    .historyTitle {
        height: 60px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #dde4eb;
        font-size: 16px;

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
        .searchline {
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
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

    }
</style>
