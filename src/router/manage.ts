export default [
    {
        name: '房产信息',
        path: 'houseManage',
        meta: {
            name: '房产信息',
        },
        //component: () => import('../views/houseInformation/houseManage.vue'),
        component:resolve => require (['@manage/views/houseInformation/houseManage.vue'], resolve),
        redirect: 'houseManage/houseProperty',
        children: [
            {
                name: '房产信息',
                path: 'houseProperty',
                meta: {
                    name: '房产信息',
                },
                component: () => import('../views/houseInformation/houseProperty.vue'),
            },
            {
                name: '车位信息',
                path: 'parkingInformation',
                meta: {
                    name: '车位信息',
                },
                component: () => import('../views/houseInformation/parkingInformation.vue'),
            },
            {
                name: '一户一档',
                path: 'householdInformation',
                meta: {
                    name: '一户一档',
                },
                component: () => import('../views/houseInformation/householdInformation.vue'),
            },
            /*{
                name: '小区管理',
                path: 'communityManage',
                meta: {
                    name: '小区管理',
                    pname:'房产管理',
                },
                component: () => import('../views/houseInformation/houseProperty_communtity.vue'),
            },*/
        ]
    },

    {
        name: '物业收费',
        path: 'propertyCharge',
        meta: {
            name: '物业收费',
        },
        component:resolve => require (['@manage/views/propertyCharge/propertyCharge.vue'], resolve),
        redirect: 'propertyCharge/calcCharge',
        children: [
            {
                name: '欠款明细',
                path: 'calcCharge',
                meta: {
                    name: '计费收款',
                },
                component:resolve => require (['@manage/views/propertyCharge/calcCharge.vue'], resolve),
            },
            {
                name: '抄表管理',
                path: 'meterManage',
                meta: {
                    name: '计费收款',
                },
                component:resolve => require (['@manage/views/propertyCharge/meterManage.vue'], resolve),
            },
            {
                name: '预交水费',
                path: 'payWater',
                meta: {
                    name: '预交水费',
                },
                component:resolve => require (['@manage/views/propertyCharge/payWater.vue'], resolve),
            },
            {
                name: '预收款管理',
                path: 'payManage',
                meta: {
                    name: '预收款管理',
                },
                component:resolve => require (['@manage/views/propertyCharge/payManage.vue'], resolve),
            },
            {
                name: '费用统计',
                path: 'costStatistics',
                meta: {
                    name: '费用统计',
                },
                component:resolve => require (['@manage/views/propertyCharge/costStatistics.vue'], resolve),
            },
            {
                name: '收款员交款统计',
                path: 'itemStatistics.vue',
                meta: {
                    name: '收款员交款统计',
                },
                component:resolve => require (['@manage/views/propertyCharge/itemStatistics.vue'], resolve),
            },
            {
                name: '收费参数',
                path: 'chargeParam',
                meta: {
                    name: '收费参数',
                },
                component:resolve => require (['@manage/views/propertyCharge/chargeParam.vue'], resolve),
            },
            {
                name: '公摊计算',
                path: 'apportionComputing',
                meta: {
                    name: '公摊计算',
                },
                component:resolve => require (['@manage/views/propertyCharge/apportionComputing.vue'], resolve),
            },

        ]
    },
    {
        name: '物业服务',
        path: 'serveMain',
        meta: {
            name: '物业服务',
        },
        component:resolve => require (['@manage/views/service/serveMain.vue'], resolve),
        redirect: 'serveMain/repairRecord',
        children:[
            {
                name: '维修记录',
                path: 'repairRecord',
                meta: {
                    name: '维修记录',
                },
                component:resolve => require (['@manage/views/service/repairRecord.vue'], resolve),
            },
            {
                name: '投诉建议',
                path: 'complaintAndAdvice',
                meta: {
                    name: '投诉建议',
                },
                component:resolve => require (['@manage/views/service/complaintAndAdvice.vue'], resolve),
            },
            {
                name: '公告管理',
                path: 'announcementManagement',
                meta: {
                    name: '公告管理',
                },
                component:resolve => require (['@manage/views/service/announcementManagement.vue'], resolve),
            },
            {
                name: '社区活动',
                path: 'communityActivity',
                meta: {
                    name: '社区活动',
                },
                component:resolve => require (['@manage/views/service/communityActivity.vue'], resolve),
            },
            {
                name: '访客登记',
                path: 'visitorRegistration',
                meta: {
                    name: '访客登记',
                },
                component:resolve => require (['@manage/views/service/visitorRegistration.vue'], resolve),
            }
        ],
    },
    {
        name: '广告管理',
        path: 'advertiseMain',
        meta: {
            name: '广告管理',
        },
        redirect: 'advertiseMain/advertise',
        component:resolve => require (['@manage/views/advertiseManage/advertiseMain.vue'], resolve),
        children:[
            {
                name: '广告列表',
                path: 'advertise',
                meta: {
                    name: '广告列表',
                },
                component:resolve => require (['@manage/views/advertiseManage/advertise.vue'], resolve),
            },
            {
                name: '合同管理',
                path: 'contract',
                meta: {
                    name: '合同管理',
                },
                component:resolve => require (['@manage/views/advertiseManage/contract.vue'], resolve),
            }
        ],
    },
    {
        name: '用户管理',
        path: '/userManage',
        meta: {
            name: '用户管理',
        },
        redirect: '/userManage/authoxManage',
        component:resolve => require (['@manage/views/authox/userMain.vue'], resolve),
        children:[
            {
                name: '权限管理',
                path: 'authoxManage',
                meta: {
                    name: '权限管理',
                },
                component:resolve => require (['@manage/views/authox/authoxManage.vue'], resolve)
            },
            {
                name: '手机用户审核',
                path: 'userExamine',
                meta: {
                    name: '手机用户审核',
                },
                component:resolve => require(['@manage/views/authox/userExamine.vue'], resolve)
            }
        ],

    },
    {
        name: '标准页',
        path: '/template',
        meta: {
            name: '标准页',
        },

        component:resolve => require (['@manage/views/template/template.vue'], resolve)
    },
]
