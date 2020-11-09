<template>
    <div class="propertyFile">
        <routeTabs></routeTabs>
        <router-view class="main_router"/>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {Icon,Divider} from 'view-design'
    import routeTabs from '@manage/components/routeTabsBar.vue'

    @Component({
        components: {
            Icon,
            Divider,
            routeTabs
        }
    })

    export default class mainView extends Vue {

    }
</script>
<style lang="scss" scoped>

    .propertyFile{
        height: 100%;

    }
    //主视图框

    .mainbox{
        background: #fff;
        padding: 0 15px;
        margin: 10px;
        width: calc(100% - 20px);
        height: calc(100% - 54px);
        overflow: hidden;
    }
</style>
