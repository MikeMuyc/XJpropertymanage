<template>
    <el-dialog
            :visible.sync="watchShow"
            custom-class="emDialog"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            top="10vh"
            width="560px"
            @close="closeWatch"
    >
        <div class="title" slot="title">
            <div class="iconColumn"></div>
            走表录入
        </div>
        <vue-perfect-scrollbar class="dialogMainbox">
            <div class="aline">
                <div class="label">房间代码</div>
                <div class="info">
                    <Input :disabled="true" v-model="MeterData.roomName"></Input>
                </div>
            </div>

            <div class="aline">
                <div class="label">收费标准</div>
                <div class="info">
                    <mixSelect
                            v-model="MeterData.psId"
                            :selectList="standardList"
                            labelName="name"
                            valueName="psId"
                            placeholder="收费标准"
                            @sentItem="setProjectList"
                    >
                    </mixSelect>
                </div>
            </div>
            <div class="aline">
                <div class="label">收费项目</div>
                <div class="info">
                    <Input type="float" v-model="projectName" :disabled="true"></Input>
                    <!--<mixSelect
                            :disabled="MeterData.projectId === ''"
                            v-model="MeterData.psId"
                            :selectList="standardList"
                            labelName="name"
                            valueName="id"
                            placeholder="收费标准"
                            @sentItem="getStandardObj"
                    >
                    </mixSelect>-->
                </div>
            </div>
            <div class="aline">
                <div class="label">收费年月</div>
                <div class="info">
                    <DatePicker type="month"
                                placeholder="收费年月"
                                style="width: 100%;"
                                v-model="payEndDate"
                                @on-change="payDate">
                    </DatePicker>
                </div>
            </div>
            <div class="aline">
                <div class="label">表编码</div>
                <div class="info">
                    <Input :disabled="codeDis" v-model="MeterData.meterCode"></Input>
                </div>
            </div>
            <div class="aline">
                <div class="label">上次抄表读数</div>
                <div class="info">
                    <Input type="float" v-model="MeterData.lastMeterReading" :disabled="readingDis"></Input>
                </div>
            </div>
            <div class="aline">
                <div class="label">上次抄表日期</div>
                <div class="info">
                    <Input v-if="MeterData.lastReadingDate" v-model="MeterData.lastReadingDate" :disabled="true"></Input>
                    <DatePicker
                            v-else
                            type="date"
                            placeholder="请选择"
                            style="width: 100%;"
                            ref="lastMonth"
                            @on-change="lastMonth">
                    </DatePicker>
                </div>
            </div>
            <div class="aline">
                <div class="label">本次抄表读数</div>
                <div class="info">
                    <Input  v-model="MeterData.currentMeterReading" type="float"></Input>
                </div>
            </div>
            <div class="aline">
                <div class="label">本次抄表日期</div>
                <div class="info">
                    <DatePicker
                            v-model="thisDate"
                            type="date"
                            placeholder="请选择"
                            style="width: 100%;"
                            @on-change="thisMonth">
                    </DatePicker>
                </div>
            </div>

            <div class="aline">
                <div class="label">是否转表</div>
                <div class="info">
                    <RadioGroup v-model="MeterData.meterTurn">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </div>
            </div>
            <div class="aline">
                <div class="label">是否换表</div>
                <div class="info">
                    <RadioGroup @on-change="meterChageEvent" v-model="MeterData.meterChange">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </div>
            </div>

            <div class="aline" v-if="MeterData.meterChange === 1">
                <div class="label">旧表终止数</div>
                <div class="info">
                    <Input v-model="MeterData.oldMeterReading" type="float"></Input>
                </div>
            </div>
            <div class="aline" v-if="MeterData.meterChange === 1">
                <div class="label">新表起始数</div>
                <div class="info">
                    <Input v-model="MeterData.newMeterReading" type="float"></Input>
                </div>
            </div>
            <div class="aline" style="margin-bottom: 0">
                <div class="label">备注信息</div>
                <div class="info">
                    <textarea style="width: 100%" v-model="MeterData.description"></textarea>
                </div>
            </div>
        </vue-perfect-scrollbar>

        <div slot="footer">
            <div class="pmbtn primary" style="margin-right: 10px" @click="setMeterWatch">确定</div>
            <div class="pmbtn" @click="closeWatch">取消</div>
        </div>
    </el-dialog>

</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import { Page, Spin, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox} from 'view-design';
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import * as api from '@manage/api/propertyCharge/calcCharge'


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


        }
    })

    export default class mainView extends Vue {

        @Prop({
            default: {
                id: '',
                rdId: '',
            },
        }) roomObj!: any;


        watchShow: boolean = false
        payEndDate:any = '';
        projectName:any = '';
        MeterData: any = {
            roomId: '',
            roomName:'',
            meterCode: '',
            projectId: '',
            psId: '',
            payEndDate: '',
            lastMeterReading: '',
            lastReadingDate: '',
            currentMeterReading: '',
            currentReadingDate: this.$utils.dateFormat(new Date().getTime(), `date`),
            meterTurn: 0,
            meterChange: 0,
            oldMeterReading: 0,
            newMeterReading: 0,
            description: '',
        };
        projectList: any = []
        standardList: any = []
        thisDate: any = this.$utils.dateFormat(new Date().getTime(), `date`)
        subFlag:boolean = true;
        mounted() {

        }

        codeDis:boolean = false
        readingDis:boolean = false
        //查询上次度数
        async setProjectList(item) {
            this.projectName = item.projectName
            this.MeterData.projectId = item.projectId;
            let {data:{currentMeterReading,currentReadingDate,meterCode}} = await api.getLatestReading(item.psId,this.roomObj.id)
            this.MeterData.meterCode = meterCode || ``
            this.MeterData.lastMeterReading = currentMeterReading || ``
            this.MeterData.lastReadingDate = currentReadingDate|| ``
            this.codeDis = !!meterCode
            this.readingDis = !!currentMeterReading
        }

        //查询标准
        async setStandard() {
            let {data} = await api.getStandardByRoomId(this.roomObj.id,null)
            this.standardList = [];
            data.forEach(item =>{
                if(item.projectTypeCode === '2'){
                    item.name = `${item.projectName}——${item.standardName}`
                    this.standardList.push(item);
                }
            })
            if(this.standardList.length > 0){

                this.MeterData.roomId = this.roomObj.id
                this.MeterData.roomName = this.roomObj.title
                this.watchShow = true;
            }
            else{
                this.$message.warning(`该房间没有绑定走表类型的收费标准，无法新增走表数据！`)
            }
        }

        getStandardObj(item) {


        }


        openMeter() {
            this.setStandard();
            this.thisDate = this.$utils.dateFormat(new Date().getTime(), `date`)
            this.MeterData.currentReadingDate = this.thisDate
            this.MeterData.payEndDate = this.thisDate
        }

        closeWatch() {
            // let refs:any = this.$refs;
            // refs.lastMonth.handleClear();
            this.watchShow = false;
            this.MeterData = {
                roomId: '',
                roomName:'',
                meterCode: '',
                projectId: '',
                psId: '',
                payEndDate: '',
                lastMeterReading: 0,
                lastReadingDate: '',
                currentMeterReading: '',
                currentReadingDate: '',
                meterTurn: 0,
                meterChange: 0,
                oldMeterReading: 0,
                newMeterReading: 0,
                description: '',
            };
            this.payEndDate = ''
            this.projectName = ''
        }


        payDate(month) {
            this.MeterData.chargingDate = `${month}`;
            this.MeterData.payEndDate = `${month}`;
        }

        thisMonth(month) {
            this.MeterData.currentReadingDate = month;
        }
        lastMonth(month){
            this.MeterData.lastReadingDate = month;
        }

        code:any = ''
        async setMeterWatch() {
            if(this.MeterData.lastMeterReading > this.MeterData.currentMeterReading){
                this.$message.warning(`抄表读数有误！`)
            }
            else if(this.MeterData.projectId === ''){
                this.$message.warning(`请选择收费项目！`)
            }
            else if(this.MeterData.psId === ''){
                this.$message.warning(`请选择收费标准！`)
            }
            else if(this.subFlag){
                this.subFlag = false;
                this.code = this.MeterData
                try {
                    await api.addmeter(this.MeterData);
                    this.$emit(`success`)
                    this.closeWatch();
                    this.$message.success(`录入成功！`)
                    this.subFlag = true;
                } catch ({data:{msg}}) {
                    this.$message.error(msg)
                    this.subFlag = true;
                }
            }

        }
        meterChageEvent(){
            if (this.MeterData.meterChange === 0) {
                this.MeterData.oldMeterReading = '';
                this.MeterData.newMeterReading = '';
            }
        }


    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/standard-global";

    .dialogMainbox{
        .aline {
            .label {
                width: 100px;
            }
        }
    }

    .borderLine {
        width: 100%;
        height: 1px;
        background-color: #dde4eb;
        margin-bottom: 15px;
    }

    .iconzhushi {
        color: $warning-color;
        font-size: 14px;
        margin-right: 8px;
    }


</style>
<style lang="scss">
    #chargeSetting {
        .emDialog .el-dialog__body {
            padding: 0;
        }

        .checkbox {
            width: 16px;
            height: 16px;
            background-color: #ffffff;
            border-radius: 2px;
            border: solid 1px #a0a5a9;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-right: 8px;

            &.active {
                border-color: #3dcb42;;
                background-color: #3dcb42;

            }

            .iconfont {
                font-size: 12px;
                color: #ffffff;
            }
        }
    }
</style>


