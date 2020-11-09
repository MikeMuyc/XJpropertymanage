<template>
    <div id="repairRecord">
        <div class="thTitle" ref="thTitle">
            <i class="line"></i>维修记录
        </div>
        <div class="viewbox" ref="viewbox">
            <div class="searchline" ref="searchline">
                <div class="left">
                    <mixSelect
                            v-model="pages.placeType"
                            class="margin"
                            :selectList="areaList"
                            labelName="name"
                            valueName="id"
                            placeholder="全部区域"
                            style="width: 140px"
                    >
                    </mixSelect>
                    <mixSelect
                            v-model="pages.orderState"
                            class="margin"
                            :selectList="orderStateList"
                            labelName="name"
                            valueName="id"
                            placeholder="全部状态"
                            style="width: 140px"
                    >
                    </mixSelect>

                    <div class="margin">
                        <i class="item">报修时间</i>
                        <DatePicker
                                type="daterange"
                                format="yyyy-MM-dd"
                                placeholder="开始时间   ~   结束时间"
                                style="width: 200px;"
                                @on-change="setTimelist"
                                v-model="timeArr"
                                ref="timelist"
                        ></DatePicker>
                    </div>

                    <div class="margin">
                        <Input v-model="pages.key" placeholder="请输入关键字" style="width: 200px;margin-right: 15px"
                               @enter="getPage()"></Input>
                        <div class="pmbtn primary" style="margin-right: 15px" @click="getPage()">
                            <i class="iconfont iconsousuo"></i>搜索
                        </div>
                        <div class="pmbtn" @click="reset">
                            <i class="iconfont iconzhongzhi"></i>重置
                        </div>
                    </div>
                </div>

                <div class="item" style="margin-bottom: 20px">
                    <div class="pmbtn primary" style="margin-right: 15px" @click="addDialogVisible = true">
                        <i class="iconfont icontianjia"></i>
                        新增维修
                    </div>
                    <div class="pmbtn" @click="setDialogVisible=true">
                        <i class="iconfont iconxitongshezhi"></i>
                        维修设置
                    </div>
                </div>
            </div>
            <el-table
                    :data="recordList"
                    stripe
                    v-loading="loading"
                    class="myWisdomTable"
                    :height="formHeight"
            >
                <template slot="empty">
                    <img src="@manage/images/暂无数据.png">
                    <br>
                    暂无内容
                </template>
                <el-table-column
                        label="序号"
                        type="index"
                        align="center"
                        width="60">
                </el-table-column>

                <el-table-column
                        prop="createTime"
                        label="报修时间"
                        width="170px"
                >
                </el-table-column>

                <el-table-column
                        prop="placeTypeName"
                        label="报修区域"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                        prop="orderDetail"
                        label="问题描述"
                        min-width="160px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="报修地址"
                        min-width="160px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="initiatorName"
                        label="报修人"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="initiatorPhone"
                        label="联系方式"
                        min-width="120px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="orderStartTime"
                        label="期望维修时间"
                        width="170px"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="acceptanceFee"
                        label="上门费用(元)"
                        min-width="120px"
                        align="center"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="repairFee"
                        label="维修费用(元)"
                        min-width="120px"
                        align="center"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="amount"
                        label="费用总计(元)"
                        min-width="120px"
                        align="center"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="orderStateName"
                        label="维修状态"
                        min-width="120px"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row,$index}">
                        <div :class="`orderStateColor${row.orderStateCode}`">{{row.orderStateName}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="110px"
                >
                    <template slot-scope="{row}">
                        <div class="tableEdit">
                            <!--<div class="item" @click="openDispatchDialog(row)">派遣</div>
                            <div class="item" @click="openDispatchDialog(row)">处理</div>
                            <div class="item" @click="openDispatchDialog(row)">回访</div>-->
                            <div class="item" @click="openDispatchDialog(row)">详情</div>
                            <div class="item delete" @click="deleteOrder(row.id)">删除</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <Page show-elevator show-total
                  :page-size="pages.pageSize"
                  :current="pages.pageNum"
                  :total="pages.totalElements"
                  @on-change="getPage"
                  ref="pagebox"
            />
        </div>

        <el-dialog
                :visible.sync="addDialogVisible"
                custom-class="emDialog"
                width="545px"
                top="12vh"
                :close-on-click-modal="false"
                @close="closeAddDidalog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                新增维修
            </div>
            <div class="MuModalContent">
                <div class="aline">
                    <div class="label">报修区域</div>
                    <div class="info">
                        <mixSelect
                                v-model="addObject.placeTypeCode"
                                class="margin"
                                :selectList="areaList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">问题描述</div>
                    <div class="info">
                        <textarea v-model="addObject.orderDetail" placeholder="请输入" style="width: 100%"></textarea>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">上传图片</div>
                    <div class="info upfilelist">
                        <div class="upfilebox" v-for="(item,index) in addObject.fileStorages">
                            <img :src="imgportadd(item)">
                            <div class="delete" @click="deleteUplist(index)">删除</div>
                        </div>
                        <label class="upfile" for="addupload" style="width: 70px;height: 70px">
                            <i class="icontianjia iconfont"></i>
                        </label>
                        <input type="file" accept="image/*" id="addupload" @change="upAddImg">
                    </div>
                </div>
                <div class="aline">
                    <div class="label">报修地址</div>
                    <div class="info">
                        <Input v-model="addObject.address" placeholder="请输入" style="width: 100%"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">报修人</div>
                    <div class="info">
                        <Input v-model="addObject.initiatorName" placeholder="请输入" style="width: 100%"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">联系方式</div>
                    <div class="info">
                        <Input v-model="addObject.initiatorPhone" placeholder="请输入" style="width: 100%"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">期望时间</div>
                    <div class="info">
                        <DatePicker
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="上门日期"
                                style="width: 100%;"
                                @on-change="setOrderStartTime"
                                ref="orderStartTime"
                                :options="sDateOpt"></DatePicker>
                    </div>
                </div>
                <!--<div class="aline">
                    <div class="label"></div>
                    <div class="info">
                        <DatePicker
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="结束日期"
                                style="width: 100%;"
                                @on-change="setOrderEndTime"
                                ref="orderStartTime"
                                :options="eDateOpt"></DatePicker>
                    </div>
                </div>-->
                <div class="aline">
                    <div class="label">上门费用</div>
                    <div class="info">
                        <Input v-model="addObject.acceptanceFee" placeholder="请输入" style="width: 100%" disabled></Input>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addOrder">确定</div>
                <div class="pmbtn" @click="closeAddDidalog">取消</div>
            </div>
        </el-dialog>


        <el-dialog
                :visible.sync="setDialogVisible"
                custom-class="emDialog"
                width="545px"
                top="8vh"
                class="setDialog"
                :close-on-click-modal="false"
                @close="closeSetDidalog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                维修设置
            </div>
            <div class="MuModalContent" style="padding: 35px 40px">
                <div class="aline">
                    <div class="label" style="font-size: 15px;font-weight: bolder">标准设定</div>
                </div>
                <div class="aline">
                    <div class="label">选择项目</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="areaList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">选择标准</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="areaList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline" style="align-items: center;justify-content: space-between">
                    <div class="label" style="font-size: 15px;font-weight: bolder">自动派单</div>
                    <el-switch
                            v-model="sendFlag"
                            active-color="#3dcb42"
                            inactive-color="#e5f0ff">
                    </el-switch>
                </div>
                <div class="aline">
                    <div class="label">派单方式</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="areaList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="width: 100%"
                                :disabled="!sendFlag"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">指定对象</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="areaList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="width: 100%"
                                :disabled="!sendFlag"
                        >
                        </mixSelect>
                    </div>
                </div>
            </div>
            <!--<div style="display: flex">
                <div class="left">
                    <div>选择小区</div>
                    <vue-perfect-scrollbar style="height:calc(100% - 50px);padding-right: 15px">
                        <Tree
                                class="buildingTree"
                                ref="roomTree"
                                :data="buildingTree"
                                :render="roomContent"
                        >
                        </Tree>
                    </vue-perfect-scrollbar>
                </div>
                <div class="right">
                    <div class="aline">
                        <div class="label" style="font-size: 15px;font-weight: bolder">标准设定</div>
                    </div>
                    <div class="aline">
                        <div class="label">选择项目</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    :selectList="areaList"
                                    labelName="name"
                                    valueName="id"
                                    placeholder="请选择"
                                    style="width: 100%"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">选择标准</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    :selectList="areaList"
                                    labelName="name"
                                    valueName="id"
                                    placeholder="请选择"
                                    style="width: 100%"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="aline" style="align-items: center;justify-content: space-between">
                        <div class="label" style="font-size: 15px;font-weight: bolder">自动派单</div>
                        <el-switch
                                v-model="sendFlag"
                                active-color="#3dcb42"
                                inactive-color="#e5f0ff">
                        </el-switch>
                    </div>
                    <div class="aline">
                        <div class="label">派单方式</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    :selectList="areaList"
                                    labelName="name"
                                    valueName="id"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    :disabled="!sendFlag"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">指定对象</div>
                        <div class="info">
                            <mixSelect
                                    class="margin"
                                    :selectList="areaList"
                                    labelName="name"
                                    valueName="id"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    :disabled="!sendFlag"
                            >
                            </mixSelect>
                        </div>
                    </div>
                    <div class="pmbtn primary" style="position: absolute;bottom: 20px;right: 50px" @click="">编辑</div>
                </div>
            </div>-->
            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="">确定</div>
                <div class="pmbtn" @click="closeSetDidalog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="dispatchDialogVisible"
                custom-class="emDialog"
                width="800px"
                top="8vh"
                :close-on-click-modal="false"
                @close="closeDispatchDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                维修详情
            </div>
            <div class="ModalContent">
                <div>
                    <div class="aline">
                        <div style="font-size: 15px;font-weight: bolder">报修内容</div>
                    </div>
                    <div class="aline" style="justify-content: space-between">
                        <div style="width: 30%">
                            <em style="width: 56px;display: inline-block">报修人</em>
                            <i>{{orderDetail.initiatorName}}</i>
                        </div>
                        <div style="width: 33%">
                            <em>联系方式</em>
                            <i>{{orderDetail.initiatorPhone}}</i>
                        </div>
                        <div style="width: 36%">
                            <em style="width: 84px;display: inline-block">报修地址</em>
                            <i>{{orderDetail.address}}</i>
                        </div>
                    </div>
                    <div class="aline" style="justify-content: space-between">
                        <div style="width: 30%">
                            <em>报修区域</em>
                            <i>{{orderDetail.placeTypeName}}</i>
                        </div>
                        <div style="width: 33%">
                            <em>报修时间</em>
                            <i>{{orderDetail.createTime}}</i>
                        </div>
                        <div style="width: 36%">
                            <em>期望上门时间</em>
                            <i>{{orderDetail.orderStartTime}}</i>
                        </div>
                    </div>
                    <div class="aline" style="justify-content: space-between">
                        <div style="display: flex">
                            <div style="width: 72px;margin-right: 15px;color: #7c8185;">问题描述</div>
                            <div>
                                <i style="margin-left: 0">{{orderDetail.orderDetail}}</i>
                                <div style="display: flex;padding-top: 10px">
                                    <img class="img" style="margin-right: 10px" :src="imgportadd(item)"
                                         v-for="item in orderDetail.fileStorages"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="border"></div>
                    <div class="aline" style="font-size: 15px;font-weight: bolder">维修派遣</div>
                    <div class="aline">
                        <em style="line-height: 40px">派遣对象</em>
                        <el-autocomplete
                                class="inline-input"
                                v-model="state1"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入姓名搜索"
                                @select="handleSelect"
                                clearable
                                style="width: 300px"
                        ></el-autocomplete>
                    </div>
                </div>
                <div>
                    <div class="border"></div>
                    <div class="aline" style="font-size: 15px;font-weight: bolder">维修派遣</div>
                    <div class="aline">
                        <div style="width: 20%">
                            <em>操作人员</em>
                            <i>李丽丽</i>
                        </div>
                        <div style="margin-left: 50px">
                            <em>操作时间</em>
                            <i>2020-07-07 16:00</i>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="border"></div>
                    <div class="aline">
                        <div style="font-size: 15px;font-weight: bolder">维修情况</div>
                    </div>
                    <div class="aline" style="justify-content: space-between">
                        <div style="display: flex;align-items: center">
                            <em style="flex: none">维修人员</em>
                            <Input style="width: 150px"></Input>
                        </div>
                        <div style="display: flex;align-items: center">
                            <em style="flex: none">维修时间</em>
                            <Input style="width: 150px"></Input>
                        </div>
                        <div style="display: flex;align-items: center">
                            <em style="flex: none">维修费用</em>
                            <Input style="width: 150px" placeholder="请输入"></Input>
                        </div>
                    </div>
                    <div class="aline">
                        <div style="display: flex;align-items: center;width: 100%">
                            <em style="flex: none">维修结果</em>
                            <textarea style="width: 100%"></textarea>
                        </div>
                    </div>
                    <div class="aline">
                        <div style="display: flex;align-items: center;width: 100%">
                            <em style="flex: none">上传图片</em>
                            <div class="info">
                                <div class="uplist">
                                    <div class="upItem" v-for="item in imgList">
                                        <img :src="item" alt="">
                                        <div class="close">删除</div>
                                    </div>
                                    <label class="upItem add" for="changeUpload">
                                        <i class="icontianjia iconfont"></i>
                                    </label>
                                    <input type="file" accept="image/*" id="changeUpload" @change="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="border"></div>
                    <div class="aline">
                        <div style="font-size: 15px;font-weight: bolder">维修结果</div>
                    </div>
                    <div class="aline">
                        <div style="width: 20%">
                            <em>维修人员</em>
                            <i>李丽丽</i>
                        </div>
                        <div style="margin-left: 50px">
                            <em>维修时间</em>
                            <i>2020-07-07 16:00</i>
                        </div>
                    </div>
                    <div class="aline" style="justify-content: space-between">
                        <div style="display: flex">
                            <div style="width: 72px;margin-right: 15px;color: #7c8185;">维修结果</div>
                            <div>
                                <i style="margin-left: 0">这里是问题描述，这里是问题描述，这里是问题描述，这里是问题描述，这里是问题描述，这里是问题描述，这里是问题描述。</i>
                                <div style="display: flex;padding-top: 10px">
                                    <img class="img" style="margin-right: 10px"/>
                                    <img class="img"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="aline" style="align-items: center">
                        <em>费用合计</em>
                        <i style="color: #ff2c2c;font-size: 16px">¥</i>
                        <i style="color: #ff2c2c;font-size: 22px;margin-right: 30px">60.00</i>
                        <em style="margin-right: 0">（上门费用：</em><i style="margin-right: 30px">10</i>
                        <em style="margin-right: 0">维修费用：</em>
                        <i>50</i>
                        <em>)</em>
                    </div>
                </div>
                <div>
                    <div class="border"></div>
                    <div class="aline">
                        <div style="font-size: 15px;font-weight: bolder">服务评价</div>
                    </div>
                    <div class="aline" style="align-items: center">
                        <div class="label">本次评分</div>
                        <div class="info" style="flex-wrap: wrap;">
                            <div style="display: flex;width: 100%">
                                <div style="width: 100px;text-align: center;margin-right: 8px">
                                    <img src="@/images/非常差.png" alt="">
                                </div>
                                <div style="width: 100px;text-align: center;margin-right: 8px">
                                    <img src="@/images/比较差.png" alt="">
                                </div>
                                <div style="width: 100px;text-align: center;margin-right: 8px">
                                    <img src="@/images/一般.png" alt="">
                                </div>
                                <div style="width: 100px;text-align: center;margin-right: 8px">
                                    <img src="@/images/满意.png" alt="">
                                </div>
                                <div style="width: 100px;text-align: center;margin-right: 8px">
                                    <img src="@/images/非常满意.png" alt="">
                                </div>
                            </div>
                            <RadioGroup v-model="serverStar">
                                <Radio :label="1" style="width: 100px;text-align: center">
                                    <span>非常差</span>
                                </Radio>
                                <Radio :label="2" style="width: 100px;text-align: center">
                                    <span>比较差</span>
                                </Radio>
                                <Radio :label="3" style="width: 100px;text-align: center">
                                    <span>一般</span>
                                </Radio>
                                <Radio :label="4" style="width: 100px;text-align: center">
                                    <span>满意</span>
                                </Radio>
                                <Radio :label="5" style="width: 100px;text-align: center">
                                    <span>非常满意</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="aline">
                        <div class="label">评价内容</div>
                        <div class="info">
                            <textarea v-model="serverRemark" style="width: 100%"></textarea>
                        </div>

                    </div>
                </div>
                <div>
                    <div class="border"></div>
                    <div class="aline">
                        <div style="font-size: 15px;font-weight: bolder">回访记录</div>
                    </div>
                    <div class="aline">
                        <div style="width: 20%">
                            <em>回访人员</em>
                            <i>李丽丽</i>
                        </div>
                        <div style="margin-left: 50px">
                            <em>回访时间</em>
                            <i>2020-07-07 16:00</i>
                        </div>
                    </div>
                    <div class="aline">
                        <div style="display: flex">
                            <div style="width: 72px;color: #7c8185;">服务评价</div>
                            <div>
                                <div>
                                    <i style="color: #3a7ef3;">非常满意</i>
                                </div>
                                <div>
                                    这里是回访结果，这里是回访结果，这里是回访结果，这里是回访结果，这里是回访结果，这里是回访结果。
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div slot="footer" v-if="state==='详情'">
                <div class="pmbtn primary" style="margin-right: 10px" @click="">编辑</div>
            </div>
            <div slot="footer" v-if="state!=='详情'">
                <div class="pmbtn primary" style="margin-right: 10px" @click="">确定</div>
                <div class="pmbtn" @click="closeDispatchDialog">取消</div>
            </div>
        </el-dialog>


    </div>
</template>
<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import {Page, DatePicker, RadioGroup, Radio, Tree} from 'view-design'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/serve/order'
    import * as app from '@manage/api/app'

    @Component({
        filters: {
            rounding(value) {
                return value.toFixed(2)
            }
        },
        components: {
            Page,
            DatePicker,
            tabNav,
            mixSelect,
            Input,
            Radio,
            RadioGroup,
            Tree
        }
    })

    export default class repairRecord extends Vue {
        areaList: Array<any> = [];
        orderStateList: any = [];
        imgList: any = [`s`];
        recordList: Array<any> = [];
        restaurants: any = [
            {"name": "王1", "value": "长宁区新渔路144号"},
            {"value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号"},
        ]
        state1: string = ''

        formHeight: number = 600;
        sendFlag: boolean = false
        rdId: string = ''
        pages: any = {
            pageNum: 1,
            pageSize: 10,
            totalElements: 20,
            placeType: '',
            orderState: '',
            key: '',
            startTime: '',
            endTime: '',
        };
        timeArr: any = [];
        buildingTree: any = [
            {
                title: 'parent 1',
                level: 1,
                id: '1'
            },
            {
                title: 'parent 1',
                level: 1,
                id: '2'
            },
            {
                title: 'parent 1',
                level: 1,
                id: '3'
            }
        ]
        loading: boolean = false;
        subFlag: boolean = true;
        addDialogVisible: boolean = false
        loaderOption: any = {
            lock: true,
            target: '#viewbox',
            text: '加载中',
            spinner: 'el-icon-loading',
        };

        addObject: any = {
            placeTypeCode: '',
            address: '',
            orderDetail: '',
            initiatorName: '',
            initiatorPhone: '',
            orderStartTime: '',
            orderEndTime: '',
            acceptanceFee: '20',
            "fileStorages": [],
        }


        orderDetail: any = {
            initiatorName: '',
            initiatorPhone: '',
            address: '',
            placeTypeCode: '',
            placeTypeName: '',
            orderStartTime: '',
            orderDetail: '',
        }
        serverStar: number = 0;
        serverRemark: string = '';
        setDialogVisible: boolean = false
        dispatchDialogVisible: boolean = false

        roomContent(h, {root, node, data}) {
            return h('div', {
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '36px',
                        overflow: 'hidden',
                        width: 'calc(100% - 20px)'
                    },
                    class: {
                        treeActive: this.rdId === data.id,
                    },
                    on: {
                        click: (event) => {
                            if (data.level === 1) {
                                data.checked = !data.checked;
                                this.rdId = data.id
                            } else {
                                data.expand = !data.expand;
                            }
                        }
                    }
                },
                [
                    h('i', {
                        class: {
                            iconfont: true,
                            iconxiaoqu: data.level === 1,
                        },
                        style: {
                            lineHeight: `1`,
                            marginRight: '8px',
                            marginLeft: '8px',
                            cursor: `pointer`,
                        },
                    }),

                    h('i', {
                        attrs: {
                            title: data.title,
                        },
                        style: {
                            fontStyle: 'normal',
                            fontSize: '14px',
                            lineHeight: `16px`,
                            cursor: `pointer`,
                            overflow: `hidden`,
                            whiteSpace: `nowrap`,
                            textOverflow: `ellipsis`
                        },
                    }, data.title),


                ]);
        };

        async getSelection(name: string, code: string) {
            let data = await api.getSelection(code);
            this[`${name}`] = [];
            for (let k in data) {
                this[`${name}`].push({
                    id: k,
                    name: data[k]
                })
            }
        }

        mounted() {
            this.getSelection(`areaList`, `placeType`)
            this.getSelection(`orderStateList`, `orderState`)
            this.$nextTick(() => {
                this.setPagesize();
                this.getOrderList();
            })
        }

        setPagesize() {
            let refs: any = this.$refs;
            let maxHeight = refs.viewbox.clientHeight - 15;
            let searchline = refs.searchline.clientHeight;

            //Page组件高度为53px
            this.formHeight = maxHeight - searchline - 53;
            this.pages.pageSize = Math.floor((this.formHeight - 49) / 48);
        }

        async getOrderList() {
            this.loading = true;
            try {
                let {totalElements, content} = await api.getOrderList({
                    pageNum: this.pages.pageNum,
                    pageSize: this.pages.pageSize,
                    placeType: this.pages.placeType,
                    orderState: this.pages.orderState,
                    key: this.pages.key,
                    startTime: this.pages.startTime,
                    endTime: this.pages.endTime,
                });
                this.pages.totalElements = totalElements
                this.recordList = content
            } catch (e) {

            }
            this.loading = false
        }

        reset() {
            this.pages.placeType = '';
            this.pages.orderState = '';
            this.pages.key = '';
            this.pages.startTime = ''
            this.pages.endTime = ''
            this.timeArr = []
            this.getPage();
        }

        getPage(page?: number) {
            this.pages.pageNum = page || 1;
            this.getOrderList();
        }

        setTimelist(arr: any) {
            //+ ` 00:00:00`
            this.pages.startTime = arr[0]
            this.pages.endTime = arr[1]
        }


        imgportadd(src) {
            return src ? this.$imgDownUrl() + `${src}` : null
        }

        upAddImg(e) {
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
                        this.addObject.fileStorages.push(id);
                        this.$message.success(`上传成功！`)

                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                    (<HTMLInputElement>document.getElementById('addupload')).value = '';
                }, 200);
            }
        }

        deleteUplist(index) {
            this.addObject.fileStorages.splice(index, 1);
        }

        addOrder() {
            if (this.subFlag) {
                this.subFlag = false;
                let load:any = this.$loading(this.loaderOption);

                api.addOrder(this.addObject).then(() => {
                    this.$message({
                        showClose: true,
                        message: `新增成功！`,
                        type: 'success'
                    });
                    this.reset();
                    this.closeAddDidalog();
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: `操作失败！请检查网络连接。`,
                        type: 'error'
                    });
                })
                load.close();
                this.subFlag = true;
            }
        }

        setOrderStartTime(val) {
            this.addObject.orderStartTime = val;
        }

        setOrderEndTime(val) {
            this.addObject.orderEndTime = val;
        }

        get sDateOpt() {
            let htu: any = {}
            if (this.addObject.orderEndTime) {
                let timer = new Date(this.addObject.orderEndTime).getTime() - 86400000;
                htu = {
                    disabledDate(time) {
                        return time.getTime() > timer
                    }
                };
            }
            return htu;
        }

        get eDateOpt() {
            let htu: any = {}
            if (this.addObject.orderStartTime) {
                let timer = new Date(this.addObject.orderStartTime).getTime();
                htu = {
                    disabledDate(time) {
                        return time.getTime() < timer
                    }
                };
            }
            return htu;
        }

        closeAddDidalog() {
            this.addObject = {
                placeTypeCode: '',
                address: '',
                orderDetail: '',
                initiatorName: '',
                initiatorPhone: '',
                orderStartTime: '',
                orderEndTime: '',
                acceptanceFee: '20',
                "fileStorages": [],
            }
            let orderStartTime: any = this.$refs.orderStartTime;
            orderStartTime.handleClear();

            this.addDialogVisible = false
        }

        deleteOrder(id: string) {
            this.$confirm('您确认要删除这条记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteOrder([id]).then(() => {
                    this.$message({
                        showClose: true,
                        message: `删除成功！`,
                        type: 'success'
                    });
                    this.reset();
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: `删除失败！`,
                        type: 'error'
                    });
                })
            }).catch(() => {

            });
        }

        closeSetDidalog() {
            this.setDialogVisible = false
        }

        state: string = ''


        async openDispatchDialog(row) {
            try {
                let {iparkRmOrderInfo} = await api.getOrderDetail(row.id);
                this.orderDetail = iparkRmOrderInfo;
                this.orderDetail.placeTypeName = row.placeTypeName;
                this.dispatchDialogVisible = true
            } catch (e) {
                this.$message.error(`获取工单详情失败！`)
            }
        }

        closeDispatchDialog() {

            this.dispatchDialogVisible = false;
            this.orderDetail = {
                initiatorName: '',
                initiatorPhone: '',
                address: '',
                placeTypeCode: '',
                placeTypeName: '',
                orderStartTime: '',
                orderDetail: '',
            }

        }


        addOrderServe() {
            if (this.subFlag) {
                this.subFlag = false;
                let load:any = this.$loading(this.loaderOption);

                api.addOrderServer({
                    serverStar: this.serverStar,
                    remark: this.serverRemark,
                    orderId: this.orderDetail.id,
                }).then(() => {
                    this.$message({
                        showClose: true,
                        message: `评价成功！`,
                        type: 'success'
                    });
                    this.reset();
                    this.closeDispatchDialog();
                    load.close();
                    this.subFlag = true;
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: `操作失败！请检查网络连接。`,
                        type: 'error'
                    });
                    load.close();
                    this.subFlag = true;
                })
            }
        }


        querySearch(queryString, cb) {
            let restaurants = this.restaurants;
            console.log(restaurants);
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        }

        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        }

        handleSelect(item) {
            console.log(item);
            console.log(this.state1);
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";

    #repairRecord {

        position: relative;

        .viewbox {
            padding-top: 15px;
            height: calc(100% - 60px);
            width: 100%;

            .searchline {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .left {
                    display: flex;
                }

                .margin {
                    margin-right: 15px;
                    margin-bottom: 20px;
                    display: flex;
                    flex: none;
                }

                .item {
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    flex: none;
                    margin-right: 15px;
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
        }
    }

    .setDialog {
        .left {
            width: 180px;
            padding: 20px;
        }

        .right {
            width: 535px;
            padding: 35px 40px 10px 30px;
        }
    }

    .ModalContent {
        em {
            color: #7c8185;
            margin-right: 15px;
        }

        .img {
            width: 60px;
            height: 60px;
            background-color: #e1e1e1;
            border-radius: 4px;
        }

        .border {
            height: 0;
            border: dashed 1px #dde4eb;
            margin: 20px 0;
        }
    }

    .aline {
        .label {
            //width: 100px;
        }
    }

    .uplist {
        display: flex;
        flex-wrap: wrap;

        .upItem {
            flex: none;
            width: 70px;
            height: 70px;
            margin: 0 10px 10px 0;
            position: relative;
            border-radius: 4px;
            border: solid 1px #dde4eb;
            display: inline-flex;
            align-items: center;
            justify-content: center;

            img {
                width: 100%;
                height: 100%;
            }

            .close {
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 2;
                background-color: rgba(0, 0, 0, .8);
                color: #fff;
                font-size: 12px;
                width: 100%;
                height: 26px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }

            &.add {
                border: dashed 1px #dde4eb;
                cursor: pointer;

                .iconfont {
                    color: #dde4eb;
                    font-size: 24px;
                    line-height: 1;
                }
            }
        }
    }

    .orderStateColor0 {
        color: #fb4b46;
    }

    .orderStateColor1 {
        color: #5458e0;
    }

    .orderStateColor3 {
        color: #ff7221;
    }

    .orderStateColor4 {
        color: #248ef1;
    }

    .orderStateColor6 {
        color: #d22814;
    }

    .orderStateColor7 {
        color: #b2b2b2;
    }

    .orderStateColor13 {
        color: #ff9f10;
    }

    .orderStateColor14 {
        color: #07d1c3;
    }

    .orderStateColor5 {
        color: #32bb53;
    }

    .upfilelist {
        display: flex;
        width: 100%;

        .upfilebox {
            width: 70px;
            height: 70px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-right: 15px;
            margin-bottom: 10px;
            position: relative;

            &:hover {
                .delete {
                    display: inline-flex;
                }
            }

            .delete {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                display: none;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }
        .upfile{
            margin-right: 15px;
            margin-bottom: 10px;
        }
    }
</style>
<style lang="scss">
    #repairRecord {

    }

</style>
