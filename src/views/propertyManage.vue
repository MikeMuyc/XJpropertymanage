<template>
    <div id="propertyManage" >
        <topBar ></topBar>
        <div class="main">
            <leftSide @hideFlag="getClose" :routeMenu="menus"></leftSide>
            <div class="right-content" :class="{hide:hideFlag}">
                <router-view ></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";

    import {Icon} from 'view-design'
    import leftSide from '@manage/components/leftMenu.vue'



    @Component({
        components: {
            Icon,
            leftSide,
        }
    })

    export default class wisdomDefend extends Vue {
        menus: Array<any> = [
            {
                label: "房产管理",
                routeName: "房产管理",
                iconfont: `iconfangchanxinxi`,
                children: [
                    {
                        label: "房产信息",
                        routeName: "房产信息",
                    },
                    {
                        label: "车位信息",
                        routeName: "车位信息",
                    },
                    {
                        label: "一户一档",
                        routeName: "一户一档",
                    },
                ],
            },
            {
                label: "收费管理",
                routeName: "物业收费",
                iconfont: `iconwuyeshoukuan`,
                children: [
                    {
                        label: "计费收款",
                        routeName: "欠款明细",
                    },
                    {
                        label: "抄表管理",
                        routeName: "抄表管理",
                    },
                    // {
                    //     label: "预交水费",
                    //     routeName: "预交水费",
                    // },
                    {
                        label: "预收款管理",
                        routeName: "预收款管理",
                    },
                    {
                        label: "费用统计",
                        routeName: "费用统计",
                    },
                    {
                        label: "收费参数",
                        routeName: "收费参数",
                    },
                    {
                        label: "收款员交款统计",
                        routeName: "收款员交款统计",
                    },
                    {
                        label: "公摊计算",
                        routeName: "公摊计算",
                    },
                ]
            },
            {
                label: "物业服务",
                routeName: "物业服务",
                iconfont: `iconwuyefuwu`,
                children: [
                    {
                        label: "维修维保",
                        routeName: "维修记录",
                    },
                    {
                        label: "投诉建议",
                        routeName: "投诉建议",
                    },

                    {
                        label: "公告管理",
                        routeName: "公告管理",
                    },
                    {
                        label: "社区活动",
                        routeName: "社区活动",
                    },
                    {
                        label: "访客登记",
                        routeName: "访客登记",
                    },
                ]
            },
            {
                label: "社区安防",
                routeName: "",
                iconfont: `iconshequanfang`,
            },
            {
                label: "广告管理",
                routeName: "",
                iconfont: `iconguanggaoguanli`,
                children:[
                    {
                        label: "广告管理",
                        routeName: "广告列表",
                    },
                   /* {
                        label: "合同管理",
                        routeName: "合同管理",
                    },*/
                ],
            },
            {
                label: "用户管理",
                routeName: "用户管理",
                iconfont: `iconxitongshezhi`,
                children:[
                    {
                        label: "部门管理",
                        routeName: "权限管理",
                    },
                    {
                        label: "手机用户审核",
                        routeName: "手机用户审核",
                    },
                ],
            },
           /* {
                label: "标准页",
                routeName: "标准页",
                iconSrc: iconImg.src2,
            },*/

        ];
        hideFlag:boolean = false;

        created() {

        }
        getClose(val){
            this.hideFlag = val;
        }
    };
</script>

<style lang="scss" scoped>
    @import "../styles/standard-global";
    #propertyManage {
        height: 100%;
        width: 100%;
        .main {
            background-color: white;
            height: calc(100% - 60px);
            display: flex;

            .right-content {
                transition: all .3s;
                width: calc(100% - 170px);
                height: 100%;
                background: #e8e9ea;
                &.hide{
                    width: calc(100% - 60px);
                }

            }
        }

    }

</style>
<style lang="scss" >

</style>
