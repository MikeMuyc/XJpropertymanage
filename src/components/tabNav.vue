<template>
    <div class="tabNav">
        <div class="tabItem" ref="tabItem" v-for="(item,index) in tabList" :class="{active:tabIndex === index}" @click="tabClick(item,index)">
            {{item.name}}
        </div>
        <div class="bottomline" :style="lineStyle"></div>
    </div>



</template>
<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import {  Page, Spin} from 'view-design'

    @Component({
        components: {
            Page,
            Spin,
        }
    })

    export default class mainView extends Vue {

        tabIndex:number = 0;
        lineStyle:string = ``;
        @Prop() tabList!:Array<{
            name:string,
        }>;
        @Watch(`tabIndex`)
        tabChange(){
            let tabItem:any = this.$refs.tabItem;
            this.lineStyle = `width:${tabItem[this.tabIndex].clientWidth}px;left:${tabItem[this.tabIndex].offsetLeft}px`
        }
        mounted() {
            this.$nextTick(()=>{
                let tabItem:any = this.$refs.tabItem;
                this.lineStyle = `width:${tabItem[this.tabIndex].clientWidth}px;left:${tabItem[this.tabIndex].offsetLeft}px`
            })
        }
        tabClick(item:any,index:number){
            this.tabIndex = index;
            this.$emit(`tabChange`,item);
        }


    }
</script>
<style lang="scss" scoped>
    @import "../styles/standard-global";
    .tabNav{
        height: 60px;
        border-bottom: 1px solid #dde4eb;
        display: flex;
        position: relative;
        .tabItem{
            margin-right: 60px;
            height: 100%;
            display: inline-flex;
            align-items: center;
            @extend .firstTitle;
            cursor: pointer;
            user-select: none;
            color: $font-color;
            transition: all .3s;
            &.active{
                color: $theme-color;
            }
            &:hover{
                color: $theme-color;
            }
        }
        .bottomline{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 4px;
            background-color: $theme-color;
            transition: all .3s;
        }
    }

</style>

