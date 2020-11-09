<template>
    <router-view />
</template>
<script>
    import {mapState,mapActions,mapMutations} from 'vuex';

    export default {
        created(){

        },

        computed:{
            ...mapState('routeTabs',[
                'tabList',
                'routeModule',
                'routeModuleList',
            ]),
        },
        watch:{
            $route:function (to,from){
                let moduleName = '';
                this.routeModuleList.forEach(item=>{
                    if(to.path.indexOf(item)>-1){
                        moduleName = item;
                    }
                });


                this.setRouteModule(moduleName);

            }
        },
        methods:{
            ...mapMutations("routeTabs", [
                "addTabs",
                "clearAllTabs",
                "setRouteModule",
            ]),
        },
    }
</script>
<style>
    .dialogMainbox{
        max-height: calc(82vh - 160px);
        margin-right: -15px;
        padding-right: 15px;
        padding-bottom: 5px;
    }

</style>
