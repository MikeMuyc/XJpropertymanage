<template>
    <el-dialog
            :visible.sync="hintDialog"
            :modal-append-to-body="false"
            width="460px"
            class="hintDialog"
    >
        <div slot="title" style="display: flex;align-items: center">
            <i class="el-icon-warning" style="font-size: 19px;color: #ff6161"></i>
            <i style="font-weight: bolder;margin-left: 10px;font-size: 16px;">提示操作</i>
        </div>
        <div v-html="htmlRender">
            <!---->
        </div>
        <div slot="footer">
            <div class="pmbtn primary" @click="hintDialog = false">确定</div>
        </div>
    </el-dialog>

</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";

    import * as api from '@manage/api/propertyCharge/apportion'


    @Component({
        components: {

        }
    })

    export default class mainView extends Vue {

        htmlRender: string = '';
        hintDialog:boolean = false;

        openWarningbox(htmlRender){
            this.htmlRender = htmlRender
            this.hintDialog = true;
        }

    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/standard-global";




</style>



