<template>
    <div class="mainbox" ref="mainbox2">
        <div class="searchline" ref="searchline2">
            <div class="froat">
                楼栋列表
            </div>
            <div class="marginItem">
                <div class="pmbtn primary" style="margin-right: 15px" @click="calcHover = !calcHover" v-clickoutside="closeHover1">
                    <i class="iconfont icontianjia"></i>
                    添加楼栋
                    <div class="btnSelection" :class="{active:calcHover === true}">
                        <div class="selItem" @click="openAddBuilding">单个添加</div>
                        <div class="selItem" @click="addSomeBuildingVisible=true">批量添加</div>
                    </div>
                </div>
                <div class="item">
                    <div class="pmbtn" style="margin-right: 15px">
                        <i class="iconfont icondaoru"></i>
                        导入
                    </div>
                    <div class="pmbtn" @click="">
                        <i class="iconfont icondaochu"></i>
                        导出
                    </div>
                </div>
            </div>
        </div>
        <el-table
                :data="buildingInfo"
                class="table"
                ref="multipleTable"
                stripe :header-cell-style="{background:'#f4f6f9'}"
                v-loading="loading"
                :height="heightTable">
            <el-table-column slot="empty">
                <img src="@manage/images/暂无数据.png">
                <br>
                暂无内容
            </el-table-column>
            <el-table-column
                    label="序号"
                    align="center"
                    width="80"
                    v-loading="loading"
            >
                <template slot-scope="{row,$index}">
                    {{pagesTable.pageSize*(pagesTable.pageNum-1) + $index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="楼号"
                    min-width="50"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="代码"
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    prop="unitCount"
                    label="单元数"
                    show-overflow-tooltip
            >
                <template slot-scope="{row,$index}">
                    <div v-if="row.unitCount===0" style="color: #7c8185;">暂无</div>
                    <div v-else>{{row.unitCount}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="upFloorNum"
                    label="楼层数"
                    show-overflow-tooltip
            >
                <template slot-scope="{row,$index}">
                    <div v-if="row.upFloorNum===0" style="color: #7c8185;">暂无</div>
                    <div v-else>{{row.upFloorNum}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="height"
                    label="楼高（m)"
                    show-overflow-tooltip
            >
                <template slot-scope="{row,$index}">
                    <div v-if="row.height===0" style="color: #7c8185;">暂无</div>
                    <div v-else>{{row.height}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    width="150px"
                    align="right"
                    label="操作"
            >
                <template slot-scope="{row}">
                    <div class="tableEdit">
                        <div class="item" @click="openRoomImageInfo(row.id)">平面图</div>
                        <div class="item" @click="openeditBuilding(row.id)">编辑</div>
                        <div class="item delete" @click="deleteBuildingInfo(row.id)">删除</div>
                    </div>
                </template>
            </el-table-column>

        </el-table>
        <Page show-elevator show-total
              :page-size="pagesTable.pageSize"
              :current="pagesTable.pageNum"
              :total="pagesTable.totalElements"
              @on-change="getPageTable"
              ref="pagebox"
        />
        <addBuilding ref="addBuildingRef" :communtityId="communtityId" @close="addBuildingDialog"></addBuilding>
        <el-dialog
                :visible.sync="addSomeBuildingVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                :append-to-body="true"
                top="22vh"
                @close="closeAddSomeBUilding"
                :close-on-click-modal="false"
                v-if="addSomeBuildingVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                添加楼栋
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label" style="width: 100px"><em class="fontSombal">*</em>楼号类型</div>
                    <div class="info">
                        <RadioGroup v-model="addSomeBuildingInfo.buildingType" @on-change="radioChange">
                            <Radio label="continuous">
                                <span>连续</span>
                            </Radio>
                            <Radio label="odd">
                                <span>奇数</span>
                            </Radio>
                            <Radio label="even">
                                <span>偶数</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="width: 100px"> <em class="fontSombal">*</em>起始楼号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addSomeBuildingInfo.nameStartNum" @blur="limitNum" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="width: 100px"> <em class="fontSombal">*</em>楼栋个数</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addSomeBuildingInfo.num" type="number" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="width: 100px"> <em class="fontSombal">*</em>起始楼栋代码</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addSomeBuildingInfo.codeStartNum" @blur="limitcode" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="width: 100px">楼层数</div>
                    <div class="info">
                        <Input placeholder="请输入"  type="number" v-model="addSomeBuildingInfo.upFloorNum"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="width: 100px">楼高(m)</div>
                    <div class="info">
                        <Input placeholder="请输入"  type="2fixed" v-model="addSomeBuildingInfo.height"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div style="margin-left: 25px">
                        <checkbox label="1" v-model="unitFlagSome">同时添加单元管理</checkbox>
                    </div>
                </div>
                <div class="aline" v-show="unitFlagSome">
                    <div class="label" style="width: 100px">单元数量</div>
                    <div class="info">
                        <Input type="number" v-model="addSomeBuildingInfo.unitNum"></Input>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addSomeBuilding" >确定</div>
                <div class="pmbtn" @click="closeAddSomeBUilding">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="editBuildingVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                top="22vh"
                :close-on-click-modal="false"
                :append-to-body="true"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改楼栋信息
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>楼号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="buildingDetailInfo.name" disabled></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><em class="fontSombal">*</em>楼栋代码</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="buildingDetailInfo.code" necessary @blur="limitCode"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">单元数</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="buildingDetailInfo.unitCount" type="number" :disabled="editUnitFlag"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">楼层数</div>
                    <div class="info">
                        <Input placeholder="请输入"  type="number" v-model="buildingDetailInfo.upFloorNum"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">楼高(m)</div>
                    <div class="info">
                        <Input placeholder="请输入"  type="2fixed" v-model="buildingDetailInfo.height"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">平面图</div>
                    <div class="info">
                        <label class="upfile" for="editupload2">
                            <img v-if="BuildingMapEdit" :src="BuildingMapEdit">
                            <i v-else class="icontianjia iconfont"></i>
                        </label>
                        <input type="file" accept="image/*" id="editupload2" @change="upEditBuildingMap">
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="uodateBuildingInfo">确定</div>
                <div class="pmbtn" @click="editBuildingVisible=false">取消</div>
            </div>
        </el-dialog>
        <viewImage ref="viewImage" @uploadSuccess="uploadSuccess" @deleteImg="deleteImg"></viewImage>
        {{code}}
    </div>
</template>

<script lang="ts">
    import {Vue, Component,Prop,Watch} from "vue-property-decorator"
    import {Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design'
    import {Tree} from 'iview'
    import * as api from '@manage/api/house/huoseProperty'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import * as app from '@manage/api/app'
    import addBuilding from './components/addBuilding.vue'
    import viewImage from './components/viewImage.vue'
    import * as organization from '@manage/json/houseData'
    @Component({
        components: {
            Tree,
            Page,
            Spin,
            DatePicker,
            RadioGroup,
            Radio,
            CheckboxGroup,
            Checkbox,
            tabNav,
            Input,
            mixSelect,
            addBuilding,
            viewImage
        }
    })

    export default class mainView extends Vue {
        @Prop({
            default: false,
        }) communtityId!: string;
        @Prop({
            default: false,
        }) rdInfo!: any;
        @Watch("communtityId", { immediate: true, deep: true })
        getCommuntityId() {
            if(this.communtityId){
                this.setPagesize()
                this.getPageTable()
            }
        }
        code :any = null
        buildingDetailInfo:any=[]
        editUnitFlag:boolean=false
        limitCodeDetail:string=''
        unitFlagSome:boolean=false
        addSomeBuildingVisible:boolean=false
        calcHover: boolean = false;
        buildingInfo:any=[]
        heightTable: number = 600;
        editBuildingVisible:boolean=false
        pagesTable: any = {
            pageNum: 1,
            pageSize: 8,
            totalElements: 0,
        };
        subFlag: boolean = true
        loading: boolean = true;
        addSomeBuildingInfo: any = {
            addUnit: '',
            buildingType: 'continuous',
            codeStartNum: '',
            nameStartNum: '',
            num: '',
            unitNum: '',
            rdId: ''
        }
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        async limitCode(){
            if(this.buildingDetailInfo.code!==''){
                let reg=/^[0-9]*$/
                if (!reg.test(this.buildingDetailInfo.code)) {
                    this.$message.warning('请输入数字')
                    this.buildingDetailInfo.code = ''
                }
                else {
                    let {data}= await api.getBuildingNames(this.buildingDetailInfo.code,null,this.communtityId)
                    console.log(data[0].code)
                    if(data.length>0&&this.limitCodeDetail!==data[0].code){
                        this.$message.warning('该代码已存在，请重新输入')
                        this.buildingDetailInfo.code=''
                    }
                }}
        }
        closeHover1() {
            this.calcHover = false
        }
        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.mainbox2.clientHeight;
            let searchline = refs.searchline2.clientHeight;
            this.heightTable = maxHeight - searchline - 53 - 15;
            this.pagesTable.pageSize = Math.floor((this.heightTable - 49) / 48);
        }
        getPageTable(pageNum?: number) {
            if (pageNum) {
                this.pagesTable.pageNum = pageNum;
            } else {
                this.pagesTable.pageNum = 1;
            }
            this.getBuildingInfo(this.communtityId)
        }
        radioChange() {
            if(this.addSomeBuildingInfo.nameStartNum===''){
                this.addSomeBuildingInfo.nameStartNum = 1
            }
            if (this.addSomeBuildingInfo.buildingType === 'odd'&&this.addSomeBuildingInfo.nameStartNum%2===0) {
                    this.addSomeBuildingInfo.nameStartNum =Number(this.addSomeBuildingInfo.nameStartNum)+1
        }
            if (this.addSomeBuildingInfo.buildingType === 'even'&&this.addSomeBuildingInfo.nameStartNum%2!==0) {
                this.addSomeBuildingInfo.nameStartNum =Number(this.addSomeBuildingInfo.nameStartNum)+1
            }
        }
        limitNum() {
            if(this.addSomeBuildingInfo.nameStartNum===''){
                this.addSomeBuildingInfo.nameStartNum = 1
            }
            if (this.addSomeBuildingInfo.buildingType === 'odd'&&this.addSomeBuildingInfo.nameStartNum%2===0) {
                this.addSomeBuildingInfo.nameStartNum =Number(this.addSomeBuildingInfo.nameStartNum)+1
            }
            if (this.addSomeBuildingInfo.buildingType === 'even'&&this.addSomeBuildingInfo.nameStartNum%2!==0) {
                this.addSomeBuildingInfo.nameStartNum =Number(this.addSomeBuildingInfo.nameStartNum)+1
            }
            if(this.addSomeBuildingInfo.nameStartNum!==''){
                let reg=/^[0-9]*$/
                if (!reg.test(this.addSomeBuildingInfo.nameStartNum)) {
                    this.$message.warning('请输入数字')
                    this.addSomeBuildingInfo.nameStartNum = ''
                }
            }
        }
        limitcode(){
            if(this.addSomeBuildingInfo.codeStartNum!==''){
                let reg=/^[0-9]*$/
                if (!reg.test(this.addSomeBuildingInfo.codeStartNum)) {
                    this.$message.warning('请输入数字')
                    this.addSomeBuildingInfo.codeStartNum = ''
                }
            }
        }
        //查询楼栋信息列表
        async getBuildingInfo(id) {
            this.loading = true
            //let {data} = await api.getBuildingInfo(id, this.pagesTable.pageNum, this.pagesTable.pageSize)

            let data = organization.buildingList
            this.buildingInfo = data.content
            this.pagesTable.totalElements = data.totalElements
            this.loading = false
        }
        openAddBuilding(){
            let refs:any = this.$refs;
            refs.addBuildingRef.openAddBUildingInfo()
        }
        addBuildingDialog(){
            this.getBuildingInfo(this.communtityId)
            this.$emit('close')
        }
        closeAddSomeBUilding(){
            this.addSomeBuildingVisible=false
            this.unitFlagSome=false
            this.addSomeBuildingInfo = {
                addUnit: '',
                buildingType: 'continuous',
                codeStartNum: '',
                nameStartNum: '',
                num: '',
                unitNum: '',
                rdId: ''
            }
        }
        //批量添加楼栋
        async addSomeBuilding() {
            if(this.subFlag){
                this.subFlag = false;
                this.addSomeBuildingInfo.rdId = this.communtityId
                if (this.addSomeBuildingInfo.nameStartNum === '' && this.addSomeBuildingInfo.num === ''&&this.addSomeBuildingInfo.codeStartNum===''
                ) {
                    this.$message.warning('请输入起始楼号和楼栋个数以及代码')
                } else {
                    try {
                        if(this.unitFlagSome){
                            this.addSomeBuildingInfo.addUnit='1'
                        }
                        else {
                            this.addSomeBuildingInfo.addUnit='0'
                        }
                        await api.addSomeBuilding(this.addSomeBuildingInfo)
                        this.$message.success('添加成功')
                        this.addSomeBuildingVisible = false
                        this.getBuildingInfo(this.communtityId)
                        this.closeAddSomeBUilding()
                        this.$emit('close')
                    } catch (e) {
                        this.$message.error('添加失败')
                    }
                }
                this.subFlag = true;
            }

        }
        async openRoomImageInfo(id){
            let {data} = await api.getBuildingInfoById(id)
            this.buildingDetailInfo = data
            this.openRoomImage()
        }
        //查看平面图
        openRoomImage() {
            let name=`${this.rdInfo.name}${this.buildingDetailInfo.name}`
                let refs: any = this.$refs;
                refs.viewImage.openRdView(name,this.buildingDetailInfo.buildingPicId);
        }
        //删除楼栋信息
        async deleteBuildingInfo(id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该信息, 是否继续?',
                '操作提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            var ids: any = []
            if (id !== '') {
                ids = id.split('/t')
            } else {
                let refs: any = this.$refs;
                ids = refs.multipleTable.selection.map(item => item.id)
            }
            try {
                await api.deleteBuildingInfo(ids)
                this.$message.success('删除成功')
                if(this.buildingInfo.length===1&&(this.pagesTable.pageNum>1)){
                    this.pagesTable.pageNum--
                }
                this.getBuildingInfo(this.communtityId)
                this.$emit('close')
            } catch (e) {
                this.$message.error('删除失败')
            }
        }
        //查询楼栋详细信息
        async getBuildingInfoById(id) {
            let {data} = await api.getBuildingInfoById(id)
            this.buildingDetailInfo = data
            this.limitCodeDetail=data.code
            if(this.buildingDetailInfo.roomCount>0){
                this.editUnitFlag=true
            }
            else {
                this.editUnitFlag=false
            }
        }
        //修改楼栋信息
        async uodateBuildingInfo() {
            if(this.subFlag){
                this.subFlag = false;
                if(this.buildingDetailInfo.code!==''){
                    try {
                        await api.updateBuildingInfo(this.buildingDetailInfo)
                        this.$message.success('修改成功')
                        this.editBuildingVisible = false
                        this.getBuildingInfo(this.communtityId)
                    } catch (e) {
                        this.$message.error('修改失败')
                    }
                }
            else {
                this.$message.warning('请输入楼栋代码')
                }
            }
            this.subFlag = true;
        }
        openeditBuilding(id) {
            this.editBuildingVisible = true
            this.getBuildingInfoById(id)
        }
        get BuildingMapEdit() {
            return this.buildingDetailInfo.buildingPicId ? this.$imgDownUrl() + `${this.buildingDetailInfo.buildingPicId}` : null
        }
        upEditBuildingMap(e) {
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
                        let {data: {id}} = await app.upImg(fd, this.$upBaseUrl());
                        this.buildingDetailInfo.buildingPicId = id;
                        this.$message.success(`上传成功！`)
                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                }, 200);
            }
        }
        uploadSuccess(pid:string,load:any){
            if(this.subFlag){
                this.subFlag = false
                this.buildingDetailInfo.buildingPicId = pid;
                api.updateBuildingInfo(this.buildingDetailInfo).then(()=>{
                    this.subFlag = true
                    this.$message.success(`上传成功！`)
                    load.close()
                }).catch(e =>{
                    this.subFlag = true
                    this.$message.error(`上传失败,${e}`)
                    load.close()
                })
            }
        }
        deleteImg(){
            this.buildingDetailInfo.buildingPicId = '';
            api.updateBuildingInfo(this.buildingDetailInfo).then(()=>{
                this.$message.success(`删除成功！`)
            }).catch(e =>{
                this.$message.error(`删除失败,${e}`)
            })
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";
    .mainbox{
        width: 100%;
        height: calc(100% - 80px);
        overflow: hidden;
        .middleline {
            width: 100%;
            height: 60px;
            background-color: #f8f9fc;
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            margin-bottom: 20px;

            .iconbox {
                height: 100%;
                width: 60px;
                background-image: linear-gradient(313deg,
                        #4d9aff 0%,
                        #3b66f6 100%);
                display: inline-flex;
                align-items: center;
                justify-content: center;

                .iconfont {
                    color: #fff;
                    font-size: 26px;
                }
            }

            .titleInfo {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;

                .infoShow {
                    display: flex;
                    align-items: center;

                    .infoText {
                        margin-left: 20px;
                        font-size: 18px;
                        color: #30374a;
                        font-weight: bolder;
                    }

                    .info {
                        margin-left: 100px;

                        .iconweizhi {
                            color: #3a7ef3;
                            font-size: 14px;
                        }

                        .iconpingmiantu {
                            color: #33c8b4;
                            font-size: 14px;
                        }

                        .textName {
                            color: #7c8185;
                            padding-left: 8px;
                        }
                    }
                }

                .editInfo {
                    color: #3a7ef3;
                    user-select: none;
                    cursor: pointer;

                    .iconbianji {
                        font-size: 16px;
                    }

                    em {
                        padding: 0 20px 0 6px;
                    }
                }
            }
        }
        .searchline {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            .froat {
                font-size: 18px;
                font-weight: bolder;
                color: #30374a;
            }

            .margin {
                margin-right: 15px;
                flex: none
            }

            .marginItem {

                > .item {
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                }
            }
        }
    }
    .tableEdit {
        display: inline-flex;
        user-select: none;

        > .item {
            margin-right: 15px;
            color: $second-font-color;
            cursor: pointer;

            &:last-child {
                margin-right: 0;
            }

            &:hover {
                color: $theme-color;
            }

            &.delete:hover {
                color: $error-color;
            }
        }
    }
    .fontSombal{
        color: #ff4040;
    }
</style>
