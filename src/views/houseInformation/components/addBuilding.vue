<template>
       <el-dialog
               :visible.sync="addBuildingVisible"
               custom-class="emDialog"
               width="545px"
               :modal-append-to-body="false"
               :append-to-body="true"
               top="22vh"
               @close="closeAddBUilding"
               :close-on-click-modal="false"
               v-if="addBuildingVisible"
       >
           <div class="title" slot="title">
               <div class="iconColumn"></div>
               添加楼栋
           </div>
           <div class="MuModalContent">
               <div class="aline">
                   <div class="label"> <em class="fontSombal">*</em>楼号</div>
                   <div class="info">
                       <Input placeholder="请输入" v-model="addOneBuildingInfo.name" @blur="limitName" necessary></Input>
                   </div>
               </div>
               <div class="aline">
                   <div class="label"> <em class="fontSombal">*</em>楼栋代码</div>
                   <div class="info">
                       <Input placeholder="请输入" v-model="addOneBuildingInfo.code" @blur="limitCode" necessary></Input>
                   </div>
               </div>
               <div class="aline">
                   <div class="label">楼层数</div>
                   <div class="info">
                       <Input placeholder="请输入"  type="number" v-model="addOneBuildingInfo.upFloorNum"></Input>
                   </div>
               </div>
               <div class="aline">
                   <div class="label">楼高(m)</div>
                   <div class="info">
                       <Input placeholder="请输入"  type="2fixed" v-model="addOneBuildingInfo.height"></Input>
                   </div>
               </div>
               <div class="aline">
                   <div class="label">平面图</div>
                   <div class="info">
                       <label class="upfile" for="addupload2">
                           <img v-if="BuildingMapAdd" :src="BuildingMapAdd">
                           <i v-else class="icontianjia iconfont"></i>
                       </label>
                       <input type="file" accept="image/*" id="addupload2" @change="upAddBuildingMap">
                   </div>
               </div>
               <div class="aline">
                   <div style="margin-left: 25px">
                       <checkbox label="1" v-model="unitFalg">同时添加单元管理</checkbox>
                   </div>
               </div>
               <div class="aline" v-show="unitFalg">
                   <div class="label">单元数量</div>
                   <div class="info">
                       <Input type="number" v-model="addOneBuildingInfo.unitNum"></Input>
                   </div>
               </div>
           </div>
           <div slot="footer">
               <div class="pmbtn primary" style="margin-right: 10px" @click="addOneBuilding" >确定</div>
               <div class="pmbtn" @click="closeAddBUilding">取消</div>
           </div>
       </el-dialog>
</template>

<script lang="ts">
    import {Vue, Component, Watch, Prop} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox, RadioGroup, Radio} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import viewMap from './components/viewMap.vue'
    import * as api from '@manage/api/house/huoseProperty'
    import * as app from '@manage/api/app'
    import addCommuntity from './components/addCommunity.vue'

    @Component({
        components: {
            Icon,
            Tree,
            Page,
            Spin,
            DatePicker,
            Checkbox,
            tabNav,
            mixSelect,
            Input,
            RadioGroup,
            Radio,
        }
    })
    export default class mainView extends Vue {
        @Prop({
            default: false,
        }) communtityId!: string;
        addBuildingVisible:boolean=false
        addSomeBuildingVisible:boolean=false
        unitFalg:boolean=false
        subFlag:boolean=true
        addOneBuildingInfo: any = {
            addUnit: '',
            buildingPicId: '',
            code: '',
            name: '',
            rdId: '',
            unitNum: '',
            upFloorNum:'',
            height:''
        }
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        async limitName(){
            if(this.addOneBuildingInfo.name!==''){
                let reg=/^[0-9]*$/
                if (!reg.test(this.addOneBuildingInfo.name)) {
                    this.$message.warning('请输入数字')
                    this.addOneBuildingInfo.name = ''
                }
                else {
                    let {data}= await api.getBuildingNames(null,this.addOneBuildingInfo.name,this.communtityId)
                    if(data.length>0){
                        this.$message.warning('该楼号已存在，请重新输入')
                        this.addOneBuildingInfo.name=''
                    }
                }
            }
        }
        async limitCode(){
            if(this.addOneBuildingInfo.code!==''){
                let reg=/^[0-9]*$/
                if (!reg.test(this.addOneBuildingInfo.code)) {
                    this.$message.warning('请输入数字')
                    this.addOneBuildingInfo.code = ''
                }
                else {
                let {data}= await api.getBuildingNames(this.addOneBuildingInfo.code,null,this.communtityId)
                if(data.length>0){
                    this.$message.warning('该代码已存在，请重新输入')
                    this.addOneBuildingInfo.code=''
                }
            }}
        }
        openAddBUildingInfo(){
            this.addBuildingVisible=true
        }
        closeAddBUilding(){
            this.addBuildingVisible=false
            this.unitFalg=false
            this.addOneBuildingInfo = {
                addUnit: '',
                buildingPicId: '',
                code: '',
                name: '',
                rdId: '',
                unitNum: '',
                upFloorNum:'',
                height:''
            }
        }
        //单个添加楼栋
        async addOneBuilding() {
            if(this.subFlag){
                this.subFlag = false;
                if (this.addOneBuildingInfo.name === ''||this.addOneBuildingInfo.code==='') {
                    this.$message.warning('请输入信息')
                } else {
                    this.addOneBuildingInfo.rdId = this.communtityId
                    try {
                        if(this.unitFalg){
                            this.addOneBuildingInfo.addUnit='1'
                        }
                        else {
                            this.addOneBuildingInfo.addUnit='0'
                        }
                        await api.addOneBuilding(this.addOneBuildingInfo)
                        this.$message.success('添加成功')
                        this.addBuildingVisible = false
                        this.closeAddBUilding()
                        this.$emit(`close`)
                    } catch (e) {
                        this.$message.error('添加失败')
                    }
                }
                this.subFlag = true;
            }

        }
        get BuildingMapAdd() {
            return this.addOneBuildingInfo.buildingPicId ? this.$imgDownUrl() + `${this.addOneBuildingInfo.buildingPicId}` : null
        }
        upAddBuildingMap(e) {
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
                    try {
                        console.log(this.$upBaseUrl())
                        let {data: {id}} = await app.upImg(fd, this.$upBaseUrl());
                        this.addOneBuildingInfo.buildingPicId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                }, 200);
            }
        }
    }
</script>

<style scoped lang="scss">
    .aline{
        .label{
            width: 80px;
        }
    }
    .fontSombal{
        color: #ff4040;
    }
</style>
