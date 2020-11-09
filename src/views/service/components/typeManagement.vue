<template>
    <el-dialog
            :visible.sync="typeManageDialog"
            custom-class="emDialog"
            width="545px"
            top="15vh"
            :close-on-click-modal="false"
            @close="closetypeManage"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            投诉建议类型管理
        </div>
        <div class="MuModalContent">
            <div class="aline">
                <div class="label">投诉建议类型</div>
            </div>
            <div class="aline" style="flex-wrap: wrap;margin-top: 10px">
                <el-tag
                        :key="tag"
                        v-for="tag in dynamicTags"
                        closable
                        type="info"
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">添加类型</el-button>

            </div>
        </div>
        <div slot="footer">
            <div class="pmbtn primary" style="margin-right: 10px" @click="">确定</div>
            <div class="pmbtn" @click="closetypeManage">取消</div>
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
        dynamicTags:any= ['居民投诉', '意见反馈']
        inputVisible:boolean= false
        inputValue:string= ''
        typeManageDialog:boolean=false

        openTypeManage(){
            this.typeManageDialog=true
        }

        closetypeManage(){
            this.typeManageDialog=false
        }
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        }

        showInput() {
            let refs:any = this.$refs;
            this.inputVisible = true;
            this.$nextTick(()=> {
                refs.saveTagInput.$refs.input.focus();
            });
        }

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    }
</script>

<style scoped lang="scss">
    .el-tag + .el-tag {
        margin-left: 10px;
        margin-bottom: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
        color: #3a7ef3;
        width: 120px;
        border: dashed 1px #dde4eb;
    }
    .input-new-tag {
        width: 120px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
