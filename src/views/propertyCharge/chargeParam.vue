<template>
    <div id="chargeParam">
        <tabNav :tabList="tabList" @tabChange="tabChange"></tabNav>
        <transition name="leftSlide">
            <div class="viewbox1" v-show="tabName === '收费项目'" ref="viewbox">
                <div v-if="buildingTree.length === 0" class="viewboxMain empty">
                    <img src="@manage/images/暂无2.png">
                    <br>
                    <p>暂无数据，请先至 <i @click="$router.push({name:'房产信息'})">房产信息</i> 处添加小区</p>
                </div>
                <div v-else class="viewboxMain">
                    <div class="leftTree">
                        <div class="leftTitle">
                            <div class="left">
                                <i class="iconfont iconxiangmumingcheng"></i>项目列表
                            </div>
                            <!--<div class="right" @click="openAddPriject">
                                <i class="iconfont icontianjia"></i>新增
                            </div>-->
                        </div>
                        <vue-perfect-scrollbar style="height:calc(100% - 46px);padding-right: 15px">
                            <Tree
                                    class="buildingTree"
                                    :data="buildingTree"
                                    :render="renderContent"
                                    empty-text=""
                                    @on-toggle-expand="treeExpand"
                            >
                            </Tree>
                        </vue-perfect-scrollbar>

                    </div>
                    <div class="borderRight"></div>
                    <projectList v-if="communityShow" :rdId="rdId" :buildingTree="buildingTree"
                                 :projectTypeList="projectTypeList" @refresh="refresh"></projectList>
                    <div v-else-if="curProObj.id" class="rightMain" ref="rightMain">
                        <div class="rightTitle" ref="rightTitle">
                            <div class="left">
                                <div class="clIcon"></div>
                                {{projectDetail.name}}
                                <i class="iconfont iconbianji" title="编辑项目" @click="openEditPriject"></i>
                                <i class="iconfont iconshanchu" title="删除项目" @click="deleteProject"></i>
                            </div>
                        </div>
                        <div class="middleline" ref="middleline">
                            <div class="aline">
                                <div class="label">项目编码：</div>
                                <div class="info" style="width: 110px">{{projectDetail.projectCode}}</div>
                                <div class="label">项目类型：</div>
                                <div class="info" style="width: 110px">{{changeCodeName(projectDetail.projectTypeCode)}}</div>
                                <div class="label" style="width: 140px">是否收取滞纳金：</div>
                                <div class="info" style="width: 110px">{{projectDetail.lateFeeNeed === 1 ? `是` : `否`}}</div>
                                <div class="label" v-show="projectDetail.lateFeeNeed === 1" style="width: 120px">滞纳金比例：</div>
                                <div class="info" v-show="projectDetail.lateFeeNeed === 1" style="width: 110px">
                                    {{(projectDetail.lateFeeRate * 100).toFixed(2) }}%
                                </div>
                            </div>
                            <div class="aline" style="margin-bottom: 0">
                                <div class="label">项目说明：</div>
                                <div class="info">{{projectDetail.description || '无'}}</div>

                            </div>
                        </div>
                        <div class="rightTitle">
                            <div class="left">
                                <i class="iconfont iconjilu"
                                   style="margin-left: 0;margin-right: 6px;font-size: 14px"></i>
                                收费标准
                            </div>
                            <div class="right">
                                <div class="pmbtn primary" style="margin-right: 15px" @click="openAddStandard">
                                    <i class="iconfont icontianjia"></i>新增标准
                                </div>
                                <div class="pmbtn" @click="deleteSomeStandard">
                                    <i class="iconfont iconshanchu"></i>删除
                                </div>
                            </div>
                        </div>
                        <el-table
                                :data="standard"
                                stripe
                                class="myWisdomTable"
                                :height="formHeight"
                                v-loading="loading"
                                @selection-change="handleSelectionChange"
                                ref="standardTableRef"
                        >
                            <template slot="empty">
                                <img src="@manage/images/暂无数据.png">
                                <br>
                                暂无内容
                            </template>
                            <el-table-column
                                    type="selection"
                                    width="60">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="标准名称"
                                    min-width="120px"
                                    show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                    prop=""
                                    label="定价方式"
                                    min-width="120px"
                                    v-if="projectDetail.projectTypeCode==1"
                            >
                                <template slot-scope="{row,$index}">
                                    <div v-if="row.paymentStandardRoutine.priceTypeCode==='1'">临时手工设置</div>
                                    <div v-else-if="row.paymentStandardRoutine.priceTypeCode==='2'">直接设定金额</div>
                                    <div v-else-if="row.paymentStandardRoutine.priceTypeCode==='3'">设定计算公式</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop=""
                                    label="标准单价"
                                    min-width="120px"
                                    v-if="projectDetail.projectTypeCode==2"
                            >
                                <template slot-scope="{row,$index}">
                                    {{row.paymentStandardMeter.unitPrice}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop=""
                                    label="表倍率"
                                    min-width="120px"
                                    v-if="projectDetail.projectTypeCode==2"
                            >
                                <template slot-scope="{row,$index}">
                                    {{row.paymentStandardMeter.meterRatio}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop=""
                                    label="标准单价"
                                    min-width="120px"
                                    v-if="projectDetail.projectTypeCode==3"
                            >
                                <template slot-scope="{row,$index}">
                                    {{row.paymentStandardOther.unitPrice}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop=""
                                    label="单位"
                                    min-width="120px"
                                    v-if="projectDetail.projectTypeCode==3"
                            >
                                <template slot-scope="{row,$index}">
                                    <div v-if="row.paymentStandardOther.quantityUnitCode==='1'">个</div>
                                    <div v-else-if="row.paymentStandardOther.quantityUnitCode==='2'">次</div>
                                    <div v-else-if="row.paymentStandardOther.quantityUnitCode==='3'">每小时</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    width="110px"
                            >
                                <template slot-scope="{row,$index}">
                                    <div class="tableEdit">
                                        <div class="item" @click="edit(row.id)">编辑</div>
                                        <div class="item delete" @click="deleteStandard(row.id)">删除</div>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-else class="rightMain empty">
                        <img src="@manage/images/暂无1.png" alt="">
                        <p>请添加一个小区</p>
                    </div>
                </div>

            </div>
        </transition>
        <transition name="rightSlide">
            <chargeSetting v-if="tabName === '收款设置'" v-show="tabName === '收款设置'"></chargeSetting>
        </transition>




        <!--<el-dialog
                v-if="addProjectDialog"
                :visible.sync="addProjectDialog"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                custom-class="emDialog"
                width="550px"
                @close="closeAddProject"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增项目
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">所属小区</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="buildingTree"
                                labelName="name"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="addProjectObject.rdId"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">项目名称</div>
                    <div class="info">
                        <Input v-model="addProjectObject.name" placeholder="请输入项目名称" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">项目类型</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="projectTypeList"
                                labelName="name"
                                valueName="code"
                                placeholder="收费项目"
                                style="max-width: 100%"
                                v-model="addProjectObject.projectTypeCode"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">项目编码</div>
                    <div class="info">
                        <Input v-model="addProjectObject.projectCode" placeholder="请输入项目编码" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">项目说明</div>
                    <div class="info">
                        <textarea v-model="addProjectObject.description" style="width: 100%;"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">是否收取滞纳金</div>
                    <div class="info">
                        <RadioGroup v-model="addProjectObject.lateFeeNeed">
                            <Radio :label='1' style="margin-right: 10px">是</Radio>
                            <Input type="2fixed" v-model="tempLateFeeRate"
                                   style="width: 80px;display: inline-block;margin-right: 10px;"
                                   :disabled="addProjectObject.lateFeeNeed == 0"></Input>%
                            <Radio :label='0' style="margin-left: 20px;">否</Radio>
                        </RadioGroup>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addProject">确定</div>
                <div class="pmbtn" @click="closeAddProject">取消</div>
            </div>
        </el-dialog>-->
        <el-dialog
                v-if="editProjectDialog"
                :visible.sync="editProjectDialog"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                custom-class="emDialog"
                width="550px"
                @close="closeAddProject"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改项目
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>所属小区</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="buildingTree"
                                labelName="name"
                                valueName="id"
                                childrenName="x"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="addProjectObject.rdId"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目名称</div>
                    <div class="info">
                        <Input v-model="addProjectObject.name" placeholder="请输入项目名称" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目类型</div>
                    <div class="info">
                        <mixSelect
                                :disabled="standard.length!==0"
                                class="margin"
                                :selectList="projectTypeList"
                                labelName="name"
                                valueName="code"
                                placeholder="收费项目"
                                style="max-width: 100%"
                                v-model="addProjectObject.projectTypeCode"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>项目编码</div>
                    <div class="info">
                        <Input v-model="addProjectObject.projectCode" placeholder="请输入项目编码" @blur="checkCode" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">项目说明</div>
                    <div class="info">
                        <textarea v-model="addProjectObject.description" style="width: 100%;"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">是否收取滞纳金</div>
                    <div class="info">
                        <RadioGroup v-model="addProjectObject.lateFeeNeed">
                            <Radio :label='1' style="margin-right: 10px">是</Radio>
                            <Input type="2fixed" v-model="tempLateFeeRate"
                                   style="width: 80px;display: inline-block;margin-right: 10px;"
                                   :disabled="addProjectObject.lateFeeNeed == 0"></Input>%
                            <Radio :label='0' style="margin-right: 20px">否</Radio>
                        </RadioGroup>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editProject">确定</div>
                <div class="pmbtn" @click="closeAddProject">取消</div>
            </div>
        </el-dialog>

        <el-dialog
                v-if="addStandardDialog"
                :visible.sync="addStandardDialog"
                custom-class="emDialog"
                width="550px"
                top="10vh"
                :close-on-click-modal="false"
                @close="closeAddStandard"

        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增标准
            </div>

            <div v-if="projectDetail.projectTypeCode == 1">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>标准名称</div>
                    <div class="info">
                        <Input placeholder="请输入标准名称" v-model="addStandardObject.name" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>定价方式</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                v-model="addStandardObject.paymentStandardRoutine.priceTypeCode"
                                :selectList="pricingMode"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline" v-if="addStandardObject.paymentStandardRoutine.priceTypeCode==='2'">
                    <div class="label"><i class="fontSombal">*</i>设定金额</div>
                    <div class="info">
                        <Input type="2fixed" placeholder="请输入设定金额"
                               v-model="addStandardObject.paymentStandardRoutine.fixedPrice" necessary></Input>
                    </div>
                </div>
                <div v-if="addStandardObject.paymentStandardRoutine.priceTypeCode==='3'">
                    <div class="aline" style="margin-bottom: 5px">
                        <div class="label"><i class="fontSombal">*</i>单价设定</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    v-model="addStandardObject.paymentStandardRoutine.formulaPriceCode"
                                    :selectList="unitPriceSet"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="请选择"
                                    style="max-width: 100%"
                                    @sentTo="danjiaSet"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="aline" style="margin-bottom: 5px">
                        <div class="label"></div>
                        <div class="info tips">
                            <i class="iconfont iconzhushi"></i>
                            {{dialogTips}}
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label"><i class="fontSombal">*</i>计算参数</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    v-model="addStandardObject.paymentStandardRoutine.formulaParamCode"
                                    :selectList="unitSet2"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="计算参数"
                                    style="max-width: 100%"
                            >
                            </mixSelect>
                            <!--<Input type="float" placeholder="请输入计算参数"
                                   v-model="addStandardObject.paymentStandardRoutine.formulaParamCode"></Input>-->
                        </div>
                    </div>
                    <div class="aline" style="margin-bottom: 15px">
                        <div class="label"><i class="fontSombal">*</i>价格系数</div>
                        <div class="info">
                            <Input type="2fixed" placeholder="请输入价格系数"
                                   v-model="addStandardObject.paymentStandardRoutine.formulaRatio" @blur="checkRatio" necessary></Input>
                        </div>
                    </div>
                    <div class="aline"
                         v-if="addStandardObject.paymentStandardRoutine.formulaPriceCode !== '2' && addStandardObject.paymentStandardRoutine.formulaPriceCode !== '4'"
                         style="margin-bottom: 15px">
                        <div class="label" v-if="addStandardObject.paymentStandardRoutine.formulaPriceCode === '3'">
                            <i class="fontSombal">*</i>指定天数
                        </div>
                        <div class="label" v-else><i class="fontSombal">*</i>月数</div>
                        <div class="info">
                            <Input type="number" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardRoutine.formulaDays" @blur="checkTimes" necessary></Input>
                        </div>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费周期</div>
                    <div class="info">
                        <mulSelect
                                class="margin"
                                :selectList="chargeCycle"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="addStandardObject.paymentStandardRoutine.payPeriodTypeCode"
                                @sentCode="setpayPeriodTypeCode1"
                        >
                        </mulSelect>
                    </div>
                </div>


                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费参数设定</div>
                    <div class="info">
                        <RadioGroup v-model="addStandardObject.parameterDefaultSetting">
                            <Radio :label='1' style="padding-right: 40px">默认</Radio>
                            <Radio :label='0'>自定义</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div style="margin: 0 0 80px 20px" v-if="addStandardObject.parameterDefaultSetting===1">
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>系统出账时间
                        </div>
                    </div>
                    <div class="aline">
                        <Input placeholder="下月月结" disabled style="width: 47%;margin-right: 20px"
                               v-if="parameter.accountingTypeCode===2" ></Input>
                        <Input placeholder="当月月结" disabled style="width: 47%;margin-right: 20px" v-else></Input>
                        <Input v-if="parameter.accountingDay===1" disabled style="width: 47%" placeholder="月初"></Input>
                        <Input v-else-if="parameter.accountingDay===-1" disabled style="width: 47%"
                               placeholder="月底"></Input>
                        <Input v-else disabled style="width: 47%" :placeholder="`${parameter.accountingDay}号`"></Input>
                    </div>
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>用户应交日期</div>
                    </div>
                    <div class="aline">
                        <Input placeholder="下月缴纳" disabled style="width: 47%;margin-right: 20px"
                               v-if="parameter.chargingTypeCode===2"></Input>
                        <Input placeholder="当月缴纳" disabled style="width: 47%;margin-right: 20px" v-else></Input>
                        <Input v-if="parameter.chargingDay===1" disabled style="width: 47%" placeholder="月初"></Input>
                        <Input v-else-if="parameter.chargingDay===-1" disabled style="width: 47%"
                               placeholder="月底"></Input>
                        <Input v-else disabled style="width: 47%" :placeholder="`${parameter.chargingDay}号`"></Input>
                    </div>

                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <div class="label1"><i class="fontSombal">*</i>允许延期时间</div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <Input :placeholder="`超期${parameter.lateFeeNum}天`" disabled style="width: 100%"
                               v-if="parameter.lateFeeTypeCode == 2"></Input>
                        <Input :placeholder="`超期${parameter.lateFeeNum}月`" disabled style="width: 100%" v-else></Input>
                    </div>
                </div>
                <div v-else style="margin: 0 0 80px 20px">

                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>系统出账时间
                        </div>
                    </div>
                    <div class="aline">
                        <mixSelect
                                class="margin"
                                :selectList="expectedTime"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.accountingTypeCode"
                        >
                        </mixSelect>
                        <mixSelect
                                class="margin"
                                :selectList="monthMethon"
                                labelName="name"
                                valueName="name"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%"
                                v-model="monthly"
                                v-if="monthly!=='指定日期'"
                        >
                        </mixSelect>
                        <div v-else style="display: flex">
                            <mixSelect
                                    class="margin"
                                    :selectList="monthMethon"
                                    labelName="name"
                                    valueName="name"
                                    childrenName="children"
                                    placeholder="请选择"
                                    style="max-width: 140px;margin-right: 15px"
                                    v-model="monthly"
                            >
                            </mixSelect>
                            <Input type="number" style="width: 106px" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardParameter.accountingDay" @blur="checkDate" necessary></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>用户应交日期
                        </div>
                    </div>
                    <div class="aline">
                        <mixSelect
                                class="margin"
                                :selectList="payableData"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.chargingTypeCode"
                        >
                        </mixSelect>
                        <div v-if="addStandardObject.paymentStandardParameter.chargingTypeCode == 2"></div>
                        <mixSelect
                                class="margin"
                                :selectList="monthMethon"
                                labelName="name"
                                valueName="name"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%"
                                v-model="payWay"
                                v-else-if="payWay!=='指定日期'"
                        >
                        </mixSelect>
                        <div v-else style="display: flex">
                            <mixSelect
                                    class="margin"
                                    :selectList="monthMethon"
                                    labelName="name"
                                    valueName="name"
                                    childrenName="children"
                                    placeholder="请选择"
                                    style="max-width: 140px;margin-right: 15px"
                                    v-model="payWay"
                            >
                            </mixSelect>
                            <Input type="number" style="width: 106px" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardParameter.chargingDay" @blur="checkDate1" necessary></Input>
                        </div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <div class="label1"><i class="fontSombal">*</i>允许延期时间</div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <mixSelect
                                class="margin"
                                :selectList="overdueTime"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.lateFeeTypeCode"
                        >
                        </mixSelect>
                        <div style="color: #7c8185;display: flex;align-items: center">
                            <i>超期</i>
                            <Input type="number" v-model="addStandardObject.paymentStandardParameter.lateFeeNum"
                                   style="width: 120px;margin: 0 10px" necessary></Input>
                            <i>{{addStandardObject.paymentStandardParameter.lateFeeTypeCode == 1 ? '月':'天'}}</i>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="projectDetail.projectTypeCode == 2">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>标准名称</div>
                    <div class="info">
                        <Input placeholder="请输入标准名称" v-model="addStandardObject.name" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"></div>
                    <div class="info">
                        <Checkbox v-model="apportionCode">该标准允许公摊使用</Checkbox>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>标准单价</div>
                    <div class="info">
                        <Input placeholder="请输入标准单价" v-model="addStandardObject.paymentStandardMeter.unitPrice"
                               type="2fixed" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>表倍率</div>
                    <div class="info">
                        <Input placeholder="请输入表倍率" v-model="addStandardObject.paymentStandardMeter.meterRatio"
                               type="2fixed" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="info">
                        <Checkbox @on-change="plannedUsage" style="font-size: 14px" v-model="planFlag">使用计划用量</Checkbox>
                    </div>
                </div>
                <div class="aline" v-show="planFlag">
                    <div class="label">计划用量</div>
                    <div class="info" style="width: 160px;padding-right: 10px">
                        <Input type="2fixed" placeholder="请输入"
                               v-model="addStandardObject.paymentStandardMeter.planDosage"></Input>
                    </div>
                    <div class="label">计划外单价</div>
                    <div class="info" style="width: 150px">
                        <Input type="2fixed" placeholder="请输入"
                               v-model="addStandardObject.paymentStandardMeter.unitPriceOutPlan"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="info">
                        <Checkbox @on-change="lowestUsage" style="font-size: 14px" v-model="lowestFlag">使用最低用量
                        </Checkbox>
                    </div>
                </div>
                <div class="aline" v-show="lowestFlag">
                    <div class="label">最低用量</div>
                    <div class="info">
                        <Input type="number" placeholder="请输入最低用量"
                               v-model="addStandardObject.paymentStandardMeter.minimumDosage"></Input>
                    </div>
                </div>

                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费参数设定</div>
                    <div class="info">
                        <RadioGroup v-model="addStandardObject.parameterDefaultSetting">
                            <Radio :label='1' style="padding-right: 40px">默认</Radio>
                            <Radio :label='0'>自定义</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div style="margin: 0 0 80px 20px" v-if="addStandardObject.parameterDefaultSetting===1">

                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>系统出账时间
                        </div>
                    </div>
                    <div class="aline">
                        <Input placeholder="下月月结" disabled style="width: 47%;margin-right: 20px"
                               v-if="parameter.accountingTypeCode===2"></Input>
                        <Input placeholder="当月月结" disabled style="width: 47%;margin-right: 20px" v-else></Input>
                        <Input v-if="parameter.chargingDay===1" disabled style="width: 47%" placeholder="月初"></Input>
                        <Input v-else-if="parameter.chargingDay===-1" disabled style="width: 47%"
                               placeholder="月底"></Input>
                        <Input v-else disabled style="width: 47%" v-model="parameter.chargingDay"></Input>
                    </div>
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>用户应交日期</div>
                    </div>
                    <div class="aline">
                        <Input placeholder="下月缴纳" disabled style="width: 47%;margin-right: 20px"
                               v-if="parameter.chargingTypeCode===2"></Input>
                        <Input placeholder="当月缴纳" disabled style="width: 47%;margin-right: 20px" v-else></Input>
                        <Input v-if="parameter.chargingDay===1" disabled style="width: 47%" placeholder="月初"></Input>
                        <Input v-else-if="parameter.chargingDay===-1" disabled style="width: 47%"
                               placeholder="月底"></Input>
                        <Input v-else disabled style="width: 47%" v-model="parameter.chargingDay"></Input>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <div class="label1"><i class="fontSombal">*</i>允许延期时间</div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <Input :placeholder="`超期${parameter.lateFeeNum}天`" disabled style="width: 100%"
                               v-if="parameter.lateFeeTypeCode == 2"></Input>
                        <Input :placeholder="`超期${parameter.lateFeeNum}月`" disabled style="width: 100%"
                               v-else></Input>
                    </div>
                </div>
                <div v-else style="margin: 0 0 80px 20px">
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>系统出账时间
                        </div>
                    </div>
                    <div class="aline">
                        <mixSelect
                                class="margin"
                                :selectList="expectedTime"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.accountingTypeCode"
                        >
                        </mixSelect>
                        <mixSelect
                                class="margin"
                                :selectList="monthMethon"
                                labelName="name"
                                valueName="name"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%"
                                v-model="monthly"
                                v-if="monthly!=='指定日期'"
                        >
                        </mixSelect>
                        <div v-else style="display: flex">
                            <mixSelect
                                    class="margin"
                                    :selectList="monthMethon"
                                    labelName="name"
                                    valueName="name"
                                    childrenName="children"
                                    placeholder="请选择"
                                    style="max-width: 140px;margin-right: 15px"
                                    v-model="monthly"
                            >
                            </mixSelect>
                            <Input type="number" style="width: 106px" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardParameter.accountingDay" @blur="checkDate" necessary></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>用户应交日期
                        </div>
                    </div>
                    <div class="aline">
                        <mixSelect
                                class="margin"
                                :selectList="payableData"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.chargingTypeCode"
                        >
                        </mixSelect>
                        <div v-if="addStandardObject.paymentStandardParameter.chargingTypeCode == 2"></div>
                        <mixSelect
                                class="margin"
                                :selectList="monthMethon"
                                labelName="name"
                                valueName="name"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%"
                                v-model="payWay"
                                v-else-if="payWay!=='指定日期'"
                        >
                        </mixSelect>
                        <div v-else style="display: flex">
                            <mixSelect
                                    class="margin"
                                    :selectList="monthMethon"
                                    labelName="name"
                                    valueName="name"
                                    childrenName="children"
                                    placeholder="请选择"
                                    style="max-width: 140px;margin-right: 15px"
                                    v-model="payWay"
                            >
                            </mixSelect>
                            <Input type="number" style="width: 106px" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardParameter.chargingDay" @blur="checkDate1" necessary></Input>
                        </div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <div class="label1"><i class="fontSombal">*</i>允许延期时间</div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <mixSelect
                                class="margin"
                                :selectList="overdueTime"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.lateFeeTypeCode"
                        >
                        </mixSelect>
                        <div style="color: #7c8185;display: flex;align-items: center">
                            <i>超期</i>
                            <Input type="number" v-model="addStandardObject.paymentStandardParameter.lateFeeNum"
                                   style="width: 120px;margin: 0 10px" necessary></Input>
                            <i>{{addStandardObject.paymentStandardParameter.lateFeeTypeCode==1 ? '月':'天'}}</i>
                        </div>
                    </div>

                </div>
            </div>

            <div v-else-if="projectDetail.projectTypeCode == 3">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>标准名称</div>
                    <div class="info">
                        <Input placeholder="请输入标准名称" v-model="addStandardObject.name" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"></div>
                    <div class="info">
                        <Checkbox v-model="apportionCode">该标准允许公摊使用</Checkbox>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>单位</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                v-model="addStandardObject.paymentStandardOther.quantityUnitCode"
                                :selectList="unit"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费单价</div>
                    <div class="info">
                        <Input type="2fixed" placeholder="请输入收费单价"
                               v-model="addStandardObject.paymentStandardOther.unitPrice" necessary></Input>
                    </div>
                </div>
                <!--<div class="aline">
                    <div class="label">分摊与损耗</div>
                    <div class="info">
                        <RadioGroup v-model="addStandardObject.apportionCode">
                            <Radio v-for="item in apportion" :label="item.code" :key="item.code"
                                   style="margin-right: 10px">{{item.name}}
                            </Radio>
                        </RadioGroup>
                    </div>
                </div>-->
                <div class="aline" style="margin-bottom: 0">
                    <div class="label">说明</div>
                    <div class="info">
                        <textarea style="width: 100%"
                                  v-model="addStandardObject.paymentStandardOther.description"></textarea>
                    </div>
                </div>
            </div>


            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addStandard">确定</div>
                <div class="pmbtn" @click="closeAddStandard">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                v-if="editStandardDialog"
                :visible.sync="editStandardDialog"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                custom-class="emDialog"
                width="550px"
                @close="closeAddStandard"
                top="10vh"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改标准
            </div>
            <div v-if="projectDetail.projectTypeCode == 1">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>标准名称</div>
                    <div class="info">
                        <Input placeholder="请输入标准名称" v-model="addStandardObject.name" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>定价方式</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                v-model="addStandardObject.paymentStandardRoutine.priceTypeCode"
                                :selectList="pricingMode"
                                labelName="name"
                                valueName="code"
                                placeholder="定价方式"
                                style="max-width: 100%"

                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline" v-if="addStandardObject.paymentStandardRoutine.priceTypeCode==='2'">
                    <div class="label"><i class="fontSombal">*</i>设定金额</div>
                    <div class="info">
                        <Input type="2fixed" placeholder="请输入设定金额" v-model="addStandardObject.paymentStandardRoutine.fixedPrice" necessary ></Input>
                    </div>
                </div>
                <div v-if="addStandardObject.paymentStandardRoutine.priceTypeCode==='3'">
                    <div class="aline" style="margin-bottom: 5px">
                        <div class="label"><i class="fontSombal">*</i>单价设定</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    v-model="addStandardObject.paymentStandardRoutine.formulaPriceCode"
                                    :selectList="unitPriceSet"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="单价设定"
                                    style="max-width: 100%"
                                    @sentTo="danjiaSet2"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="aline" style="margin-bottom: 5px">
                        <div class="label"></div>
                        <div class="info tips">
                            <i class="iconfont iconzhushi"></i>
                            {{dialogTips}}
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label"><i class="fontSombal">*</i>计算参数</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    v-model="addStandardObject.paymentStandardRoutine.formulaParamCode"
                                    :selectList="unitSet2"
                                    labelName="name"
                                    valueName="code"
                                    placeholder="计算参数"
                                    style="max-width: 100%"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label"><i class="fontSombal">*</i>价格系数</div>
                        <div class="info">
                            <Input type="2fixed" placeholder="请输入价格系数"
                                   v-model="addStandardObject.paymentStandardRoutine.formulaRatio" @blur="checkRatio" necessary></Input>
                        </div>
                    </div>
                    <div class="aline" style="margin-bottom: 15px">
                        <div class="label" v-if="addStandardObject.paymentStandardRoutine.formulaPriceCode === '3'">
                            <i class="fontSombal">*</i>指定天数
                        </div>
                        <div class="label" v-else><i class="fontSombal">*</i>月数</div>
                        <div class="info">
                            <Input type="number" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardRoutine.formulaDays" @blur="checkTimes" necessary></Input>
                        </div>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费周期</div>
                    <div class="info">
                        <mulSelect
                                class="margin"
                                :selectList="chargeCycle"
                                :checkedItems="setchecked(addStandardObject.paymentStandardRoutine.fixedMonth)"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                                v-model="addStandardObject.paymentStandardRoutine.payPeriodTypeCode"
                                @sentCode="setpayPeriodTypeCode3"
                        >
                        </mulSelect>
                    </div>
                </div>

                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费参数设定</div>
                    <div class="info">
                        <RadioGroup v-model="addStandardObject.parameterDefaultSetting">
                            <Radio :label='1' style="padding-right: 40px">默认</Radio>
                            <Radio :label='0'>自定义</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div style="margin: 0 0 80px 20px" v-if="addStandardObject.parameterDefaultSetting === 1">
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>系统出账时间</div>
                    </div>
                    <div class="aline">
                        <Input placeholder="当月月结" disabled style="width: 47%;margin-right: 20px"></Input>
                        <Input disabled style="width: 47%" placeholder="月底"></Input>
                    </div>
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>用户应交日期</div>
                    </div>
                    <div class="aline">
                        <Input placeholder="当月缴纳" disabled style="width: 47%;margin-right: 20px"></Input>
                        <Input disabled style="width: 47%" placeholder="月底"></Input>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <div class="label1"><i class="fontSombal">*</i>允许延期时间</div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <Input placeholder="超期1天" disabled style="width: 100%"></Input>
                    </div>
                </div>
                <div v-else style="margin: 0 0 80px 20px">

                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>系统出账时间
                        </div>
                    </div>
                    <div class="aline">
                        <mixSelect
                                class="margin"
                                :selectList="expectedTime"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.accountingTypeCode"
                        >
                        </mixSelect>
                        <mixSelect
                                class="margin"
                                :selectList="monthMethon"
                                labelName="name"
                                valueName="name"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%"
                                v-model="monthly"
                                v-if="addStandardObject.paymentStandardParameter.accountingDay == -1"
                        >
                        </mixSelect>
                        <div v-else style="display: flex">
                            <mixSelect
                                    class="margin"
                                    :selectList="monthMethon"
                                    labelName="name"
                                    valueName="name"
                                    childrenName="children"
                                    placeholder="请选择"
                                    style="max-width: 140px;margin-right: 15px"
                                    v-model="monthly"
                            >
                            </mixSelect>
                            <Input type="number" style="width: 106px" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardParameter.accountingDay" necessary></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>用户应交日期
                        </div>
                    </div>
                    <div class="aline">
                        <mixSelect
                                class="margin"
                                :selectList="payableData"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.chargingTypeCode"
                        >
                        </mixSelect>
                        <div v-if="addStandardObject.paymentStandardParameter.chargingTypeCode !== `2`"></div>
                        <mixSelect
                                class="margin"
                                :selectList="monthMethon"
                                labelName="name"
                                valueName="name"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%"
                                v-model="payWay"
                                v-else-if="addStandardObject.paymentStandardParameter.chargingDay == -1"
                        >
                        </mixSelect>
                        <div v-else style="display: flex">
                            <mixSelect
                                    class="margin"
                                    :selectList="monthMethon"
                                    labelName="name"
                                    valueName="name"
                                    childrenName="children"
                                    placeholder="请选择"
                                    style="max-width: 140px;margin-right: 15px"
                                    v-model="payWay"
                            >
                            </mixSelect>
                            <Input type="number" style="width: 106px" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardParameter.chargingDay" necessary></Input>
                        </div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <div class="label1"><i class="fontSombal">*</i>允许延期时间
                        </div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <mixSelect
                                class="margin"
                                :selectList="overdueTime"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.lateFeeTypeCode"
                        >
                        </mixSelect>
                        <div style="color: #7c8185;display: flex;align-items: center">
                            <i>超期</i>
                            <Input type="number" v-model="addStandardObject.paymentStandardParameter.lateFeeNum"
                                   style="width: 120px;margin: 0 10px" necessary></Input>
                            <i>{{addStandardObject.paymentStandardParameter.lateFeeTypeCode==1 ? '月':'天'}}</i>
                        </div>
                    </div>
                </div>
            </div>


            <div v-else-if="projectDetail.projectTypeCode ==2">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>标准名称</div>
                    <div class="info">
                        <Input placeholder="请输入标准名称" v-model="addStandardObject.name" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"></div>
                    <div class="info">
                        <Checkbox v-model="apportionCode">该标准允许公摊使用</Checkbox>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>标准单价</div>
                    <div class="info">
                        <Input placeholder="请输入标准单价" v-model="addStandardObject.paymentStandardMeter.unitPrice"
                               type="2fixed" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>表倍率</div>
                    <div class="info">
                        <Input placeholder="请输入表倍率" v-model="addStandardObject.paymentStandardMeter.meterRatio"
                               type="2fixed" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="info">
                        <Checkbox @on-change="plannedUsage" style="font-size: 14px" v-model="editplanFlag">使用计划用量
                        </Checkbox>
                    </div>
                </div>
                <div class="aline" v-show="editplanFlag">
                    <div class="label">计划用量</div>
                    <div class="info" style="width: 160px;padding-right: 10px">
                        <Input type="2fixed" placeholder="请输入"
                               v-model="addStandardObject.paymentStandardMeter.planDosage"></Input>
                    </div>
                    <div class="label">计划外单价</div>
                    <div class="info" style="width: 150px">
                        <Input placeholder="请输入"
                               v-model="addStandardObject.paymentStandardMeter.unitPriceOutPlan" type="2fixed"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="info">
                        <Checkbox @on-change="lowestUsage" style="font-size: 14px" v-model="editlowestFlag">使用最低用量
                        </Checkbox>
                    </div>
                </div>
                <div class="aline" v-show="editlowestFlag">
                    <div class="label">最低用量</div>
                    <div class="info">
                        <Input type="2fixed" placeholder="请输入最低用量"
                               v-model="addStandardObject.paymentStandardMeter.minimumDosage"></Input>
                    </div>
                </div>

                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费参数设定</div>
                    <div class="info">
                        <RadioGroup v-model="addStandardObject.parameterDefaultSetting">
                            <Radio :label='1' style="padding-right: 40px">默认</Radio>
                            <Radio :label='0'>自定义</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div style="margin: 0 0 80px 20px" v-if="addStandardObject.parameterDefaultSetting === 1">

                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>系统出账时间</div>
                    </div>
                    <div class="aline">
                        <Input placeholder="当月月结" disabled style="width: 47%;margin-right: 20px"></Input>

                        <Input disabled style="width: 47%" placeholder="月底"></Input>
                    </div>
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>用户应交日期</div>
                    </div>
                    <div class="aline">
                        <Input placeholder="当月缴纳" disabled style="width: 47%;margin-right: 20px"></Input>

                        <Input disabled style="width: 47%" placeholder="月底"></Input>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <div class="label1"><i class="fontSombal">*</i>允许延期时间</div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <Input placeholder="超期1天" disabled style="width: 100%"></Input>
                    </div>
                </div>
                <div v-else style="margin: 0 0 80px 20px">

                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>系统出账时间
                        </div>
                    </div>
                    <div class="aline">
                        <mixSelect
                                class="margin"
                                :selectList="expectedTime"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.accountingTypeCode"
                        >
                        </mixSelect>
                        <mixSelect
                                class="margin"
                                :selectList="monthMethon"
                                labelName="name"
                                valueName="name"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%"
                                v-model="monthly"
                                v-if="addStandardObject.paymentStandardParameter.accountingDay == -1"
                        >
                        </mixSelect>
                        <div v-else style="display: flex">
                            <mixSelect
                                    class="margin"
                                    :selectList="monthMethon"
                                    labelName="name"
                                    valueName="name"
                                    childrenName="children"
                                    placeholder="请选择"
                                    style="max-width: 140px;margin-right: 15px"
                                    v-model="monthly"
                            >
                            </mixSelect>
                            <Input type="number" style="width: 106px" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardParameter.accountingDay" necessary></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label1"><i class="fontSombal">*</i>用户应交日期
                        </div>
                    </div>
                    <div class="aline">
                        <mixSelect
                                class="margin"
                                :selectList="payableData"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.chargingTypeCode"
                        >
                        </mixSelect>
                        <div v-if="addStandardObject.paymentStandardParameter.chargingTypeCode !== `2`"></div>
                        <mixSelect
                                class="margin"
                                :selectList="monthMethon"
                                labelName="name"
                                valueName="name"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%"
                                v-model="payWay"
                                v-if="addStandardObject.paymentStandardParameter.chargingDay == -1"
                        >
                        </mixSelect>
                        <div v-else style="display: flex">
                            <mixSelect
                                    class="margin"
                                    :selectList="monthMethon"
                                    labelName="name"
                                    valueName="name"
                                    childrenName="children"
                                    placeholder="请选择"
                                    style="max-width: 140px;margin-right: 15px"
                                    v-model="payWay"
                            >
                            </mixSelect>
                            <Input type="number" style="width: 106px" placeholder="请输入"
                                   v-model="addStandardObject.paymentStandardParameter.chargingDay" necessary></Input>
                        </div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <div class="label1"><i class="fontSombal">*</i>允许延期时间
                        </div>
                    </div>
                    <div class="aline" v-show="projectDetail.lateFeeNeed===1">
                        <mixSelect
                                class="margin"
                                :selectList="overdueTime"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 47%;margin-right: 15px"
                                v-model="addStandardObject.paymentStandardParameter.lateFeeTypeCode"
                        >
                        </mixSelect>
                        <div style="color: #7c8185;display: flex;align-items: center">
                            <i>超期</i>
                            <Input type="number" v-model="addStandardObject.paymentStandardParameter.lateFeeNum"
                                   style="width: 120px;margin: 0 10px" necessary></Input>
                            <i>{{addStandardObject.paymentStandardParameter.lateFeeTypeCode==1 ? '月':'天'}}</i>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="projectDetail.projectTypeCode ==3">
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>标准名称</div>
                    <div class="info">
                        <Input placeholder="请输入标准名称" v-model="addStandardObject.name" @blur="checkName" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"></div>
                    <div class="info">
                        <Checkbox v-model="apportionCode">该标准允许公摊使用</Checkbox>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>单位</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                v-model="addStandardObject.paymentStandardOther.quantityUnitCode"
                                :selectList="unit"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label"><i class="fontSombal">*</i>收费单价</div>
                    <div class="info">
                        <Input type="2fixed" placeholder="请输入收费单价"
                               v-model="addStandardObject.paymentStandardOther.unitPrice" necessary></Input>
                    </div>
                </div>

                <div class="aline" style="margin-bottom: 0">
                    <div class="label">说明</div>
                    <div class="info">
                        <textarea style="width: 100%" v-model="addStandardObject.paymentStandardOther.description"></textarea>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editStandard">确定</div>
                <div class="pmbtn" @click="closeAddStandard">取消</div>
            </div>
        </el-dialog>
        {{code}}

    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {
        Page,
        Spin,
        DatePicker,
        RadioGroup,
        Radio,
        Cascader,
        CheckboxGroup,
        Checkbox,
        Select,
        Option,
        InputNumber,
        Tooltip
    } from 'view-design'
    import {Tree} from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import Input from '@manage/components/normalInput.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import chargeSetting from './chargeSetting.vue';
    import * as api from '@manage/api/propertyCharge/chargeParam'

    import mulSelect from './components/mixSelect.vue';
    import projectList from './components/chargeParamProjectList.vue';

    import * as paramData from '@manage/json/chargeParam'
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
            chargeSetting,
            Select,
            Option,
            InputNumber,
            Tooltip,
            Cascader,
            mulSelect,
            projectList,
        }
    })

    export default class mainView extends Vue {
        apportionCode: boolean = false;

        tabName: string = '收费项目';
        tabList: Array<{ name: string }> = [
            {
                name: '收费项目',
            },
            {
                name: '收款设置',
            },
        ];

        checkList: Array<any> = [];
        formHeight: number = 600;
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
        };
        projectTypeList: any = []
        projectList: any = []
        addProjectDialog: boolean = false;
        editProjectDialog: boolean = false;

        tempLateFeeRate: number = 0;
        addProjectObject: any = {
            description: "",
            lateFeeNeed: 0,
            lateFeeRate: 0,
            name: "",
            projectCode: "",
            projectTypeCode: "",
            rdId: ""
        };

        addStandardObject: any = {
            name: "",
            projectId: "",
            projectTypeCode: "",
            parameterId: "",
            parameterDefaultSetting: 1,
            lateFeeTypeCode: "",
            lateFeeDay: 0,
            apportionCode: 0,
            paymentStandardParameter: {
                accountingTypeCode: "",
                accountingDay: 0,
                chargingTypeCode: "",
                chargingDay: 0,
                rdId: "",
                lateFeeTypeCode: '1',
                lateFeeNum: 1
            },
            paymentStandardRoutine: {
                priceTypeCode: "",
                payPeriodTypeCode: "",
                fixedRate: 0,
                fixedMonth: "",
                fixedPrice: 0,
                formulaPriceCode: "",
                formulaParamCode: "",
                formulaRatio: 1,
                formulaDays: 1
            },
            paymentStandardMeter: {
                unitPrice: 0,
                meterRatio: 1,
                planDosage: 0,
                planedUsed: 0,
                unitPriceOutPlan: 0,
                minimumUsed: 0,
                minimumDosage: 0,
                apportionCode: ""
            },
            paymentStandardOther: {
                unitPrice: 0,
                quantityUnitCode: "",
                description: ""
            }
        }
        addStandardObject1: any = {
            name: "",
            projectId: "",
            projectTypeCode: "",
            parameterId: "",
            parameterDefaultSetting: 1,
            lateFeeTypeCode: "",
            lateFeeDay: 0,
            apportionCode: 0,
            paymentStandardParameter: {
                accountingTypeCode: "",
                accountingDay: 0,
                chargingTypeCode: "",
                chargingDay: 0,
                rdId: "",
                lateFeeTypeCode: '1',
                lateFeeNum: 1
            },
            paymentStandardRoutine: {
                priceTypeCode: "",
                payPeriodTypeCode: "",
                fixedRate: 0,
                fixedMonth: "",
                fixedPrice: 0,
                formulaPriceCode: "",
                formulaParamCode: "",
                formulaRatio: 1,
                formulaDays: 1
            },
            paymentStandardMeter: {
                unitPrice: 0,
                meterRatio: 1,
                planDosage: 0,
                planedUsed: 0,
                unitPriceOutPlan: 0,
                minimumUsed: 0,
                minimumDosage: 0,
                apportionCode: ""
            },
            paymentStandardOther: {
                unitPrice: 0,
                quantityUnitCode: "",
                description: ""
            }
        }
        projectDetail: any = {
            id: '',
        };
        roomId: string = ''

        monthSelection: any = [
            {
                name: '1月',
                xcode: '0',
            },
            {
                name: '2月',
                xcode: '1'
            },
            {
                name: '3月',
                xcode: '2'
            },
            {
                name: '4月',
                xcode: '3'
            },
            {
                name: '5月',
                xcode: '4'
            },
            {
                name: '6月',
                xcode: '5'
            },
            {
                name: '7月',
                xcode: '6'
            },
            {
                name: '8月',
                xcode: '7'
            },
            {
                name: '9月',
                xcode: '8'
            },
            {
                name: '10月',
                xcode: '9'
            },
            {
                name: '11月',
                xcode: '10'
            },
            {
                name: '12月',
                xcode: '11'
            },
        ]

        renderContent(h, {root, node, data}) {
            return h('div', {
                    attrs: {
                        title: data.name,
                    },
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: 'calc(100% - 20px)',
                        height: '36px',
                        overflow: 'hidden',
                    },
                    class: {
                        a: data.id,
                        treeActive: this.curProObj.id === data.id || this.rdId === data.id && this.curProObj.id === '',
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 2) {
                                this.curProObj = data;
                                this.communityShow = false;
                                this.rdId = data.rdId;

                                this.getProjectById()
                                setTimeout(() => {
                                    this.setPagesize();
                                    this.getStandard()
                                }, 200)

                            } else if (data.level === 1) {
                                this.rdId = data.id;
                                this.curProObj = {
                                    id: '',
                                }
                                this.communityShow = true;
                                //this.getProjectList(data.id, data)
                                // data.expand = !data.expand;
                            }
                        }
                    }
                },
                [
                    h('i', {
                        class: {
                            iconfont: true,
                            iconxiaoqu: data.level === 1,
                            iconshoufei: data.level === 2,
                        },
                        style: {
                            lineHeight: `1`,
                            marginRight: '8px',
                            marginLeft: '8px',
                            cursor: `pointer`,
                        },
                    }),

                    h('i', {
                        style: {
                            fontStyle: 'normal',
                            fontSize: data.level === 1 ? '15px' : '14px',
                            fontWeight: data.level === 1 ? '600' : 'normal',
                            lineHeight: `16px`,
                            cursor: `pointer`,
                            display: 'block',
                            width: '70%',
                            overflow: `hidden`,
                            whiteSpace: `nowrap`,
                            textOverflow: `ellipsis`,

                        },
                    }, data.name),
                    /*h('i', {
                            class: {
                                iconfont: true,
                                iconfuzhi: data.level === 2,
                            },
                            on: {
                                click: (event) => {
                                    this.copyProjectDialog = true
                                    this.copyProjectId = data.id
                                }
                            },
                            style: {
                                lineHeight: `1`,
                                marginRight: '8px',
                                cursor: `pointer`,
                                display: 'block',
                            },
                        },
                    ),*/
                ]);
        };

        addStandardDialog: boolean = false;

        pricingMode: any = []
        unitPriceSet: any = []
        unitSet2: any = []
        unit: any = []
        chargeCycle: any = []
        payableData: any = []
        apportion: any = {}
        planFlag: boolean = false
        lowestFlag: boolean = false
        standard: any = []

        curProObj: any = {
            id: '',
        };
        projectId: string = ''
        buildingTree: any = [{}]
        rdId: string = '';

        communityShow: boolean = true;


        editStandardDialog: boolean = false
        editplanFlag: boolean = false
        editlowestFlag: boolean = false
        expectedTime: any = []
        parameter: any = {
            chargingDay: "",
            lateFeeNum:1,
        }
        monthly: string = ''
        payWay: string = ''
        monthMethon: any = [
            {name: '月底'},
            {name: '指定日期'}
        ]
        overdueTime: any = []

        subFlag: boolean = true;

        created(): void {
            this.gethouseData1();
            this.getProjectType();


            this.getChargeCycle()
            this.getPricingMode()
            this.getUnitPriceSet()
            this.getUnitSet2();
            this.getPayableData()
            this.getApportion()
            this.getExpectedTime()
            this.getoverdueTime()
            this.getUnit()
        }


        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.rightMain.clientHeight;
            let rightTitle = refs.rightTitle.clientHeight + 15;
            let middleline = refs.middleline.clientHeight + 15;

            //Page组件高度为53px，rightTitle:46,middleline:152
            this.formHeight = maxHeight - rightTitle * 2 - middleline - 10;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        tabChange(item: any) {
            this.tabName = item.name;

        }

        handleSelectionChange(val) {
            this.checkList = val;
        }


        openAddPriject() {
            this.addProjectDialog = true;
        }

        openEditPriject() {
            this.editProjectDialog = true;
            this.addProjectObject = JSON.parse(JSON.stringify(this.projectDetail));
            this.tempLateFeeRate = Number(this.addProjectObject.lateFeeRate) * 100;
        }

        changeCodeName(code) {
            if (this.projectTypeList.find(item => item.code === code)) {
                return this.projectTypeList.find(item => item.code === code).name
            }
        }

        closeAddProject() {
            this.addProjectDialog = false;
            this.editProjectDialog = false;
            this.tempLateFeeRate = 0;
            this.addProjectObject = {
                description: "",
                lateFeeNeed: '0',
                lateFeeRate: 0,
                name: "",
                projectCode: "",
                projectTypeCode: "",
                rdId: ""
            };
        }

        plannedUsage() {
            if (this.planFlag) {
                this.addStandardObject.paymentStandardMeter.planedUsed = 1
            } else {
                this.addStandardObject.paymentStandardMeter.planedUsed = 0
            }
        }

        lowestUsage() {
            if (this.lowestFlag) {
                this.addStandardObject.paymentStandardMeter.minimumUsed = 1
            } else {
                this.addStandardObject.paymentStandardMeter.minimumUsed = 0
            }
        }
        code:any  = null

        //结构树
        async gethouseData1() {
            /*try{
                let {data} = await api.getTree2(0, null)

                this.buildingTree = JSON.parse(JSON.stringify(data).replace(/title/g, 'name'));
                this.buildingTree.forEach(item => {
                    if (item.belongNum !== 0) {
                        item.children = [{}];
                    }
                })
                if(this.rdId && this.curProObj.id){
                    this.getProjectList(this.rdId);
                    this.buildingTree.find(item => item.id === this.rdId).expand = true
                    this.communityShow = false;
                }
                else if (this.rdId) {
                    this.getProjectList(this.rdId);
                    this.buildingTree.find(item => item.id === this.rdId).expand = true
                    this.communityShow = true;

                } else if (this.buildingTree.length > 0) {
                    this.rdId = this.buildingTree[0].id;
                    this.getProjectList(this.rdId);
                    this.communityShow = true;
                    this.buildingTree[0].expand = true;
                }
            }catch (e) {
                this.buildingTree = [];
                this.$message.error(`获取小区数据失败！`)
            }*/
            this.buildingTree = JSON.parse(JSON.stringify(paramData.orgList).replace(/title/g, 'name'));
            this.buildingTree.forEach(item => {
                if (item.belongNum !== 0) {
                    item.children = [{}];
                }
            })
        }

        refresh() {
            this.gethouseData1();
        }

        //查询所有的项目
        async getProjectList(id: string) {
            // let {data} = await api.getProjectList('', '', id)
            // data.map(item => item.level = 2)
            this.buildingTree.find(x => x.id === id).children = paramData.staList
            this.projectList = paramData.staList;

        }

        treeExpand(data) {
            this.getProjectList(data.id)
        }

        //根据id查询项目
        async getProjectById() {
            let {data} = await api.getProjectById(this.curProObj.id)
            this.projectDetail = data
        }

        loading: boolean = false

        //查询标准
        async getStandard() {
            this.loading = true
            try {
                let {data} = await api.getStandard(this.curProObj.id)

                this.standard = data
                this.pages.pageSize = data.length
                this.pages.totalElements = data.length
                this.loading = false
            } catch (e) {
                this.loading = false
            }
        }

        //添加项目
        async addProject() {
            let reName = false;
            let {data} = await api.getProjectList('', '', this.addProjectObject.rdId)
            for (let i in data) {
                if (data[i].name === this.addProjectObject.name) {
                    reName = true
                }
            }
            if (this.addProjectObject.rdId === '') {
                this.$message.warning('请选择小区')
            } else if (this.addProjectObject.name === '') {
                this.$message.warning('请输入项目名称')
            } else if (reName) {
                this.$message.warning('该小区下已存在该项目')
            } else if (this.addProjectObject.projectTypeCode === '') {
                this.$message.warning('请选择项目类型')
            } else if (this.subFlag) {
                this.subFlag = false
                if(this.addProjectObject.lateFeeNeed === 0){
                    this.addProjectObject.lateFeeRate = 0
                }
                else{
                    this.addProjectObject.lateFeeRate = Number(this.tempLateFeeRate) / 100;
                }
                try {
                    await api.addProject(this.addProjectObject)
                    this.gethouseData1()
                    this.closeAddProject();
                    this.$message.success('新增成功！')
                } catch (e) {
                    this.$message.error('操作失败！')
                }
                this.subFlag = true
            }
        }

        //修改项目
        async editProject() {

            if (this.addProjectObject.rdId === '') {
                this.$message.warning('请选择小区')
            } else if (this.addProjectObject.name === '') {
                this.$message.warning('请输入项目名称')
            } else if (this.addProjectObject.projectTypeCode === '') {
                this.$message.warning('请选择项目类型')
            } else if (this.addProjectObject.projectCode === '') {
                this.$message.warning('请输入项目编码')
            } else if (this.subFlag) {
                this.subFlag = false
                if(this.addProjectObject.lateFeeNeed === 0){
                    this.addProjectObject.lateFeeRate = 0
                }
                else{
                    this.addProjectObject.lateFeeRate = Number(this.tempLateFeeRate) / 100
                }

                try {
                    await api.editProject(this.addProjectObject)
                    this.gethouseData1();
                    this.getProjectById();
                    this.closeAddProject();
                    this.$message.success('修改成功！')
                } catch (e) {
                    this.$message.error('操作失败！')
                }
                this.subFlag = true
            }
        }

        //删除一个项目
        async deleteProject() {
            this.$confirm('删除该项目后该项目下的所有标准也会删除，是否继续?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await api.deleteProject([this.projectDetail.id])
                this.gethouseData1()

                if (this.curProObj.id === this.projectDetail.id) {
                    this.curProObj = {
                        id: '',
                    }
                }
                this.projectDetail = {}
                this.standard = []
                this.refresh()
                this.$message.success(`删除成功！`)
            }).catch(() => {

            });
        }


        dialogTips: string = '应收金额 =计算参数 x 价格系数 x 月数';

        danjiaSet(val) {
            if (val == '1') {
                this.dialogTips = '应收金额 = 计算参数 x 价格系数 x 月数'
            } else if (val == '2') {
                this.dialogTips = '应收金额 = 计算参数 x 价格系数 x 本月实际天数'
                this.addStandardObject.paymentStandardRoutine.formulaDays = '';
            } else if (val == '3') {
                this.dialogTips = '应收金额 = 计算参数 x 价格系数 x 指定天数'
            } else if (val == '4') {
                this.dialogTips = '应收金额 = 计算参数 x 价格系数 x 1'
                this.addStandardObject.paymentStandardRoutine.formulaDays = '';
            }
        }

        danjiaSet2(val) {

        }

        //添加标准
        async addStandard() {
            this.addStandardObject.projectId = this.curProObj.id
            let {data} = await api.getProjectById(this.curProObj.id)
            this.addStandardObject.projectTypeCode = data.projectTypeCode
            this.addStandardObject.paymentStandardParameter.rdId = this.rdId
            if (!this.planFlag) {
                this.addStandardObject.paymentStandardMeter.planedUsed = 0
                this.addStandardObject.paymentStandardMeter.planDosage = 0
                this.addStandardObject.paymentStandardMeter.unitPriceOutPlan = 0
            } else {
                this.addStandardObject.paymentStandardMeter.planedUsed = 1
            }
            if (!this.lowestFlag) {
                this.addStandardObject.paymentStandardMeter.minimumUsed = 0
                this.addStandardObject.paymentStandardMeter.minimumDosage = 0
            } else {
                this.addStandardObject.paymentStandardMeter.minimumUsed = 1
            }
            if (this.monthly === '月底') {
                this.addStandardObject.paymentStandardParameter.accountingDay = -1
            }
            if (this.payWay === '月底') {
                this.addStandardObject.paymentStandardParameter.chargingDay = -1
            }
            if (this.addStandardObject.name === '') {
                this.$message.warning('请输入标准名称')
            } else {
                let {data} = await api.getStandard(this.curProObj.id)
                let a: number = -1
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === this.addStandardObject.name) {
                        a = i
                    }
                }
                if (a >= 0) {
                    this.$message.warning('该标准已存在')
                } else if (this.projectDetail.projectTypeCode == 1) {
                    if (this.addStandardObject.paymentStandardRoutine.priceTypeCode === '') {
                        this.$message.warning('请选择定价方式')
                    } else if (this.addStandardObject.paymentStandardRoutine.priceTypeCode === '3' && this.addStandardObject.paymentStandardRoutine.formulaPriceCode === '') {
                        this.$message.warning('请选择单价设定')
                    } else if (this.addStandardObject.paymentStandardRoutine.priceTypeCode === '3' && this.addStandardObject.paymentStandardRoutine.payPeriodTypeCode === '') {
                        this.$message.warning('请选择收费周期')
                    } else if (this.addStandardObject.paymentStandardRoutine.payPeriodTypeCode === '') {
                        this.$message.warning('请选择收费周期')
                    } else if (this.subFlag) {
                        this.subFlag = false;
                        try {
                            await api.addStandard(this.addStandardObject)
                            this.getStandard()
                            this.closeAddStandard();
                            this.$message.success('新增成功！')
                            this.subFlag = true;
                        } catch (e) {
                            this.$message.error('操作失败！')
                            this.subFlag = true;
                        }

                    }
                } else if (this.projectDetail.projectTypeCode == 2) {
                    if (this.addStandardObject.apportionCode === '') {
                        this.$message.warning('请选择分摊与损耗')
                    }
                    /*else if(this.addStandardObject.paymentStandardMeter.payPeriodTypeCode===''){
                        this.$message.warning('请选择收费周期')
                    }*/
                    else if (this.subFlag) {
                        this.subFlag = false;

                        this.addStandardObject.apportionCode = this.apportionCode ? 1 : 0;
                        this.addStandardObject.paymentStandardMeter.apportionCode = this.addStandardObject.apportionCode
                        try {
                            await api.addStandard(this.addStandardObject)
                            this.getStandard()
                            this.closeAddStandard();
                            this.$message.success('新增成功！')
                            this.subFlag = true;
                        } catch (e) {
                            this.$message.error('操作失败！')
                            this.subFlag = true;
                        }
                    }
                } else if (this.projectDetail.projectTypeCode == 3) {
                    if (this.addStandardObject.paymentStandardOther.quantityUnitCode === '') {
                        this.$message.warning('请选择单位')
                    } else if (this.subFlag) {
                        this.subFlag = false;

                        this.addStandardObject.apportionCode = this.apportionCode ? 1 : 0;

                        try {
                            await api.addStandard(this.addStandardObject)
                            this.getStandard()
                            this.closeAddStandard();
                            this.$message.success('新增成功！')
                            this.subFlag = true;
                        } catch (e) {
                            this.$message.error('操作失败！')
                            this.subFlag = true;
                        }

                    }
                } else {
                    this.$message.warning('项目类型错误')

                }
            }
        }

        openAddStandard() {
            if (this.curProObj.id === '') {
                this.$message.info('请选择项目')
            } else {
                this.getParameter();
                this.addStandardDialog = true
            }
        }

        closeAddStandard() {
            this.monthly = ''
            this.payWay = ''
            this.apportionCode = false;
            this.addStandardDialog = false;
            this.editStandardDialog = false
            this.addStandardObject = {
                name: "",
                projectId: "",
                projectTypeCode: "",
                parameterId: "",
                parameterDefaultSetting: 1,
                lateFeeTypeCode: "",
                lateFeeDay: 0,
                paymentStandardParameter: {
                    accountingTypeCode: "",
                    accountingDay: 0,
                    chargingTypeCode: "",
                    chargingDay: 0,
                    rdId: "",
                    lateFeeTypeCode: '1',
                    lateFeeNum: 1
                },
                paymentStandardRoutine: {
                    priceTypeCode: "",
                    payPeriodTypeCode: "",
                    fixedRate: 0,
                    fixedMonth: "",
                    fixedPrice: 0,
                    formulaPriceCode: "",
                    formulaParamCode: "",
                    formulaRatio: 1,
                    formulaDays: 1
                },
                paymentStandardMeter: {
                    unitPrice: 0,
                    meterRatio: 1,
                    planDosage: 0,
                    planedUsed: 0,
                    unitPriceOutPlan: 0,
                    minimumUsed: 0,
                    minimumDosage: 0,
                    apportionCode: ""
                },
                paymentStandardOther: {
                    unitPrice: 0,
                    quantityUnitCode: "",
                    description: ""
                }
            }
            this.addStandardObject1 = {
                name: "",
                projectId: "",
                projectTypeCode: "",
                parameterId: "",
                parameterDefaultSetting: 1,
                lateFeeTypeCode: "",
                lateFeeDay: 0,
                paymentStandardParameter: {
                    accountingTypeCode: "",
                    accountingDay: 0,
                    chargingTypeCode: "",
                    chargingDay: 0,
                    rdId: "",
                    lateFeeTypeCode: '1',
                    lateFeeNum: 1
                },
                paymentStandardRoutine: {
                    priceTypeCode: "",
                    payPeriodTypeCode: "",
                    fixedRate: 0,
                    fixedMonth: "",
                    fixedPrice: 0,
                    formulaPriceCode: "",
                    formulaParamCode: "",
                    formulaRatio: 1,
                    formulaDays: 1
                },
                paymentStandardMeter: {
                    unitPrice: 0,
                    meterRatio: 1,
                    planDosage: 0,
                    planedUsed: 0,
                    unitPriceOutPlan: 0,
                    minimumUsed: 0,
                    minimumDosage: 0,
                    apportionCode: ""
                },
                paymentStandardOther: {
                    unitPrice: 0,
                    quantityUnitCode: "",
                    description: ""
                }
            }
        }

        async edit(id) {
            try {
                let {data} = await api.getStandardById(id)
                this.addStandardObject = data;
                this.addStandardObject1 = JSON.parse(JSON.stringify(data))
                if (this.addStandardObject.paymentStandardMeter.planedUsed === 1) {
                    this.editplanFlag = true
                }
                if (this.addStandardObject.paymentStandardMeter.minimumUsed === 1) {
                    this.editlowestFlag = true
                }
                if (this.addStandardObject.paymentStandardParameter.accountingDay == -1) {
                    this.monthly = `月底`
                } else {
                    this.monthly = `指定日期`
                }
                if (this.addStandardObject.paymentStandardParameter.chargingDay == -1) {
                    this.payWay = `月底`
                } else {
                    this.payWay = `指定日期`
                }
                this.apportionCode = Number(this.addStandardObject.apportionCode) !== 0;
                this.editStandardDialog = true

            } catch (e) {
                this.$message.warning(`获取标准信息失败！`)
            }
        }

        async editStandard() {
            if (this.subFlag) {
                this.subFlag = false;
                if (this.editplanFlag) {
                    this.addStandardObject.paymentStandardMeter.planedUsed = 1
                } else {
                    this.addStandardObject.paymentStandardMeter.planedUsed = 0
                    this.addStandardObject.paymentStandardMeter.planDosage = 0
                    this.addStandardObject.paymentStandardMeter.unitPriceOutPlan = 0
                }
                if (this.editlowestFlag) {
                    this.addStandardObject.paymentStandardMeter.minimumUsed = 1
                } else {
                    this.addStandardObject.paymentStandardMeter.minimumUsed = 0
                    this.addStandardObject.paymentStandardMeter.minimumDosage = 0
                }
                if (this.monthly === '月底') {
                    this.addStandardObject.paymentStandardParameter.accountingDay = -1
                }
                if (this.payWay === '月底') {
                    this.addStandardObject.paymentStandardParameter.chargingDay = -1
                }
                try {
                    this.addStandardObject.apportionCode = this.apportionCode ? 1 : 0;

                    await api.updateStandard(this.addStandardObject)
                    this.editStandardDialog = false;
                    this.getStandard()
                    this.subFlag = true;
                    this.$message.success(`修改成功！`)
                } catch (e) {
                    this.subFlag = true;
                    this.$message.success(`修改失败！`)
                }
            }
        }



        setpayPeriodTypeCode1(str) {
            this.addStandardObject.paymentStandardRoutine.fixedMonth = str;
        }

        setpayPeriodTypeCode2(str) {
            this.addStandardObject.paymentStandardMeter.fixedMonth = str;
        }

        setpayPeriodTypeCode3(str) {
            this.addStandardObject.paymentStandardRoutine.fixedMonth = str;
        }

        setpayPeriodTypeCode4(str) {
            this.addStandardObject.paymentStandardMeter.fixedMonth = str;
        }

        setchecked(str: string) {
            if (str) {
                let newArr = str.split('');
                let res = [];
                newArr.forEach((item: any, index) => {
                    if (item == 1) {
                        res.push(this.monthSelection[index])
                    }
                })
                return res
            } else {
                return null
            }
        }

        //删除一个标准
        async deleteStandard(id) {
            this.$confirm('此操作将永久删除标准, 是否继续?', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await api.deleteStandard([id])
                this.getStandard();
                this.$message.success(`删除成功！`)
            }).catch(() => {

            });
        }

        //删除多条标准
        async deleteSomeStandard() {
            let refs: any = this.$refs;
            let ids: any = [];
            ids = refs.standardTableRef.selection.map(item => item.id)
            if (ids.length === 0) {
                this.$message.warning(`请勾选要删除的标准！`)
            } else {
                this.$confirm('此操作将永久删除选中标准, 是否继续?', '操作提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await api.deleteStandard(ids)
                    this.getStandard();
                    this.$message.success(`删除成功！`)
                }).catch(() => {

                });
            }

        }

        //查询默认参数
        async getParameter() {
            let {data} = await api.getParameter(this.rdId)
            this.parameter = data
        }

        //项目类型
        async getProjectType() {
            let {data} = await api.getInfoByName('支付项目类型')
            this.projectTypeList = data
        }

        //定价方式
        async getPricingMode() {
            let {data} = await api.getInfoByName('定价方式')
            this.pricingMode = data
        }

        //单价设定
        async getUnitPriceSet() {
            let {data} = await api.getInfoByName('收费标准单价设定类型')
            this.unitPriceSet = data
        }

        // 单价系数
        async getUnitSet2() {
            let {data} = await api.getInfoByName('收费标准单价系数类型')
            this.unitSet2 = data
        }

        //单位
        async getUnit() {
            let {data} = await api.getInfoByName('单位')
            this.unit = data
        }

        //收费周期
        async getChargeCycle() {
            let {data} = await api.getInfoByName('计费周期')
            this.chargeCycle = data;
            this.chargeCycle[this.chargeCycle.length - 1].children = this.monthSelection;
        }

        //计算时间类型（用户应交日期）
        async getPayableData() {
            let {data} = await api.getInfoByName('计算时间类型')
            this.payableData = data
        }

        //分摊与损耗
        async getApportion() {
            let {data} = await api.getInfoByName('分摊类型')
            this.apportion = data
        }

        //出账日期类型
        async getExpectedTime() {
            let {data} = await api.getInfoByName('出账日期类型')
            this.expectedTime = data
        }

        //逾期时间类型
        async getoverdueTime() {
            let {data} = await api.getInfoByName('逾期时间类型')
            this.overdueTime = data
        }

        //重复名称查询
        checkName(name){
            let flag:boolean = false;
            console.log(name,this.addStandardObject1.name)
            this.standard.forEach(item =>{
                if(item.name === name && item.name !== this.addStandardObject1.name) {
                    flag = true
                }
            })
            if(flag){
                this.addStandardObject.name = this.addStandardObject1.name;
                this.$message.warning(`项目名称重复！`)
            }
        }
        checkCode(code){
            let flag:boolean = false;
            this.projectList.forEach(item =>{
                if(item.projectCode == code && item.projectCode !== this.addStandardObject1.projectCode) {
                    flag = true
                }
            })

            if(flag){
                this.addStandardObject.projectCode = this.addStandardObject1.projectCode;
                this.$message.warning(`项目代码重复！`)
            }
        }
        //价格系数检查
        checkRatio(ratio){
            if(ratio<=0){
                this.addStandardObject.paymentStandardRoutine.formulaRatio = 1;
                this.$message.warning(`价格系数不能小于0！`)
            }
        }
        checkTimes(times){
            if(times<=0){
                this.addStandardObject.paymentStandardRoutine.formulaDays = 1;
                this.$message.warning(`指定时间不能小于1！`)
            }
        }
        checkDate(date){
            if(date<=0){
                this.addStandardObject.paymentStandardParameter.accountingDay = 1;
                this.$message.warning(`指定日期不能小于1！`)
            }
            else if(date>31){
                this.addStandardObject.paymentStandardParameter.accountingDay = 31;
                this.$message.warning(`指定日期不能大于31！`)
            }
        }
        checkDate1(date){
            if(date<=0){
                this.addStandardObject.paymentStandardParameter.chargingDay = 1;
                this.$message.warning(`指定日期不能小于1！`)
            }
            else if(date>31){
                this.addStandardObject.paymentStandardParameter.chargingDay = 31;
                this.$message.warning(`指定日期不能大于31！`)
            }
        }
    }

</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #chargeParam {

        position: relative;
        .viewbox1 {
            padding-top: 15px;
            height: calc(100% - 60px);
            width: 100%;

            .viewboxMain {
                display: flex;
            }

            .leftTree {


                .leftTitle {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;

                    .left {
                        height: 36px;
                        display: inline-flex;
                        align-items: center;
                        font-size: 15px;
                        font-weight: bold;

                        .iconfont {
                            color: $theme-color;
                            margin-right: 8px;
                            line-height: 1;
                            font-size: 14px;
                        }
                    }

                    .right {
                        height: 24px;
                        display: inline-flex;
                        align-items: center;
                        color: $theme-color;
                        cursor: pointer;
                        user-select: none;

                        .iconfont {
                            color: $theme-color;
                            margin-right: 6px;
                            font-size: 14px;
                        }
                    }
                }

                .menuLine {
                    height: 36px;
                    display: flex;
                    align-items: center;
                    border: 1px solid #fff;
                    background-color: #fff;
                    padding: 0 10px 0 20px;
                    cursor: pointer;

                    .iconfont {
                        color: $warning-color;
                        line-height: 1;
                        font-size: 14px;
                        margin-right: 8px;
                    }

                    &.active {
                        background-color: #e5f0ff;
                        border: 1px solid $theme-color;
                    }
                }
            }

            .borderRight {
                width: 1px;
                height: 100%;
                background-color: #dde4eb;
                box-shadow: 1px 0px 3px 0px #dde4eb;
                flex: none;
            }

            .rightMain {
                width: calc(100% - 221px);
                height: 100%;
                padding: 0 5px 0 20px;
                overflow: hidden;

                .rightTitle {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 36px;
                    margin-bottom: 10px;

                    .left {
                        display: inline-flex;
                        align-items: center;
                        height: 36px;
                        @extend .firstTitle;

                        .iconfont {
                            cursor: pointer;
                            color: $theme-color;
                            line-height: 1;
                            margin-left: 20px;
                        }
                    }

                    .right {
                        display: inline-flex;
                        align-items: center;
                        height: 36px;
                    }

                    .clIcon {
                        height: 12px;
                        width: 4px;
                        border-radius: 2px;
                        background-color: $theme-color;
                        margin-right: 4px;
                        margin-bottom: 2px;
                    }

                }

                .middleline {
                    background-color: #f8f9fc;
                    border-radius: 4px;
                    overflow: hidden;
                    padding: 25px 20px;
                    margin-bottom: 15px;

                }

                &.empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;

                    > p {
                        color: $third-font-color;
                        margin-top: 10px;
                    }
                }
            }
        }
    }

    .tableEdit {
        display: inline-flex;

        > .item {
            margin-right: 15px;
            color: $second-font-color;
            cursor: pointer;

            &:hover {
                color: $theme-color;
            }

            &.delete:hover {
                color: $error-color;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .aline {
        .label {
            //min-width: 100px;

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

    #chargeParam {
        .el-table::before {
            height: 0;
        }

        .viewbox1 {
            .ivu-tree li ul {
                padding: 0;

                .ivu-tree-arrow {
                    width: 0;
                }

                .iconshoufei {
                    padding-left: 30px;
                }

                .a:hover {
                    background-color: #e5f0ff;
                }
            }
        }

    }
</style>


