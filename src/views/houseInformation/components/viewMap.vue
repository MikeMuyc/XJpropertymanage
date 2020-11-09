<template>
    <el-dialog
            :visible.sync="viewFlag"
            :modal-append-to-body="false"
            :append-to-body="true"
            custom-class="emDialog"
            width="800px"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            平面图
        </div>
        <div class="ImgContent">
            <img :src="viewImgSrc">
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import {Vue, Component,Prop} from "vue-property-decorator"
    import * as api from '@manage/api/app'

    @Component({
        components: {

        }
    })

    export default class mainView extends Vue {

        viewFlag:boolean = false
        viewImgSrc:string = null

        openMap(src:string){
            this.viewImgSrc = src;
            this.viewFlag = true;
        }
    }
</script>

<style lang="scss" scoped>



</style>
