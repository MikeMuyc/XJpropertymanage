<template>
    <el-dialog
            :visible.sync="viewImageVisible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :append-to-body="true"
            custom-class="emDialog"
            width="800px"
            top="17vh"
            @close="closeviewImage"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            平面图
        </div>
        <div class="MuModalContent">
            <div class="alineImage">
                <div class="imageText">{{viewInfo.name}}</div>
                <div>
                    <label for="upload" class="pmbtn primary" style="margin-right: 15px" >
                        <i class="iconfont iconshangchuan"></i>上传
                    </label>
                    <div class="pmbtn" @click="deleteImg">
                        <i class="iconfont iconshanchu"></i>删除
                    </div>
                    <input type="file" accept="image/*" id="upload" @change="upImg" >
                </div>
            </div>
            <div class="alineImage" style="margin-top:20px;">
                <div class="imageShow">
                    <img v-if="imgport" :src="imgport" class="avatar">
                    <div class="infoImage" v-else>
                        <div><i class="iconfont iconzanwutupian2"></i></div>
                        <em>未上传图片</em>
                    </div>
                </div>
            </div>
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

        viewImageVisible:boolean=false
        viewInfo:any = {
            name:'',
            src:'',
        };

        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        get imgport(){
            return this.viewInfo.src ? this.$imgDownUrl() + `${this.viewInfo.src}` : null
        }
        openRdView(name:any,src:string){
            this.viewInfo.name = name;
            this.viewInfo.src = src;
            this.viewImageVisible = true
        }
        handleAvatarSuccess(res, file) {

        }
        getObjectURL(file) {
            let url = null;
            let win: any = window;
            if (win.createObjcectURL != undefined) {
                url = win.createOjcectURL(file);
            } else if (win.URL != undefined) {
                url = win.URL.createObjectURL(file);
            } else if (win.webkitURL != undefined) {
                url = win.webkitURL.createObjectURL(file);
            }
            return url;
        }
        upImg(e) {
            let fd = new FormData();

            let type = `bmp,jpg,jpeg,png`;
            let bool2 = type.indexOf(e.target.files[0].type.replace(`image/`, ``)) > -1;
            if (!bool2) {
                this.$message({
                    showClose: true,
                    message: `图片格式错误！支持格式：bmp,jpg,jpeg,png。`,
                    type: 'error'
                });
            } else {
                fd.append("file", e.target.files[0]);
                fd.append("relativePath", '');
                let load:any = this.$loading(this.loaderOption);
                setTimeout(async () => {
                    try{
                        let {data:{id}} = await api.upImg(fd,this.$upBaseUrl());
                        this.viewInfo.src = id;
                        this.$emit(`uploadSuccess`,id,load)
                    }catch (e) {
                        this.$message.error(`上传失败`)
                    }
                    load.close()
                    (<HTMLInputElement>document.getElementById('upload')).value='';
                }, 200);
            }
        }
        closeviewImage(){
            this.viewInfo = {
                name:'',
                src:'',
            };
            this.viewImageVisible = false;
        }
        deleteImg(){
            if(this.viewInfo.src!==''){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '操作提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.viewInfo.src = '';
                    this.$emit(`deleteImg`)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
            else {
                this.$message.warning('未上传图片')
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../styles/standard-global";

    .alineImage {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .imageText {
            font-size: 16px;
            display: inline-flex;
            align-items: center;
            color: #30374a;
        }

        .imageShow {
            width: 100%;
            height: 450px;
            background-color: #f8f9fc;
            display: flex;
            align-items: center;
            justify-content: center;

            .avatar {
                max-height: 100%;
                max-width: 100%;
                display: inline-block;
            }

            .infoImage {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .iconzanwutupian2 {
                    font-size: 100px;
                    color: #dde4eb;
                }

                em {
                    color: #a0a5a9;
                }
            }
        }
    }


</style>
