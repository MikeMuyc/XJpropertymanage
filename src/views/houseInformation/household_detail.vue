<template>
    <div class="costTable">
        <div class="costTitle">
            <div class="back" @click="backClose">
                <i class="iconfont iconfanhui"></i>返回
            </div>
            户主详情
        </div>
        <vue-perfect-scrollbar style="height:calc(100% - 60px);padding-right: 20px">
        <div class="middleline">
            <div class="front">
            <div class="iconbox">
                <i class="iconfont iconfangzi"></i>
            </div>
            <em>{{roomName}}</em>
            </div>
            <div class="last">
                <img :src="viewImgSrc">
                <div class="main">
                    <div class="content1">
                        <div class="item1">
                            <i class="title">业主名称：</i>
                            <em class="btn">{{proprietorDetial.proprietor.personInfo.name}}</em>
                        </div>
                        <div class="item2">
                            <i class="title">身份证号：</i>
                            <em class="btn">{{proprietorDetial.proprietor.personInfo.cardNumber}}</em>
                        </div>
                        <div class="item3">
                            <i class="title">出生日期：</i>
                            <em class="btn">{{proprietorDetial.proprietor.personInfo.birthday}}</em>
                        </div>
                        <div class="item4">
                            <i class="title">性别：</i>
                            <em>{{proprietorDetial.proprietor.personInfo.sexCode}}</em>
                        </div>
                    </div>
                    <div class="content2">
                        <div class="item1">
                            <i class="title">民族：</i>
                            <em class="btn">{{proprietorDetial.proprietor.personInfo.nationCode}}</em>
                        </div>
                        <div class="item2">
                            <i class="title">籍贯：</i>
                            <em class="btn">{{proprietorDetial.proprietor.personInfo.nativePlaceRegionCode}}</em>
                        </div>
                        <div class="item3">
                            <i class="title">联系方式:</i>
                            <em class="btn">{{proprietorDetial.proprietor.personInfo.tel}}</em>
                        </div>
                        <div class="item4">
                            <i class="title">附加信息：</i>
                            <em style="color: #7c8185">{{proprietorDetial.proprietor.personInfo.remark}}</em>
                        </div>
                    </div>
                    <div class="content3">
                        <div class="item1">
                            <i class="title">入伙时间：</i>
                            <em class="btn">{{proprietorDetial.proprietor.proprietorAndRoom.time}}</em>
                        </div>
                        <div class="item2">
                            <i class="title">房产证号：</i>
                            <em class="btn">{{proprietorDetial.proprietor.proprietorAndRoom.pocCode}}</em>
                        </div>
                        <div class="item3">
                            <i class="title">购房合同号：</i>
                            <em class="btn">{{proprietorDetial.proprietor.proprietorAndRoom.contractCode}}</em>
                        </div >
                        <div class="item4"><i style="width: 105px;display: inline-block; color: #7c8185;">管理协议书号：</i>
                            <em class="btn">{{proprietorDetial.proprietor.proprietorAndRoom.agreementNumber}}</em></div>
                    </div>
                </div>
                <div class="editInfo" @click="openEditInfoDialog">
                    <i class="iconfont iconbianji"></i>
                    <em>修改</em>
                </div>
            </div>
        </div>
        <div class="mainInfo">
            <div class="userSearch">
                <div class="froat">
                    <i class="iconfont iconzhanghao"></i>
                    <i class="textTitle">家庭成员</i>
                </div>
                <div class="last">
                    <div class="pmbtn primary" style="margin-right: 15px" @click="openMemberDialog">
                        <i class="iconfont icontianjia"></i>添加成员
                    </div>
                    <div class="item">
                        <div class="pmbtn" style="margin-right: 15px">
                            <i class="iconfont icondaoru"></i>
                            导入
                        </div>
                        <div class="pmbtn">
                            <i class="iconfont icondaochu"></i>
                            导出
                        </div>
                    </div>
                </div>
            </div>
            <el-table
                    stripe
                    class="myTable"
                    :data="familyMemberList"
                    :header-cell-style="{background:'#f4f6f9'}"
            >
                <template slot="empty" >
                    <img src="@manage/images/暂无数据.png">
                    <br>
                    暂无内容
                </template>
                <el-table-column
                        type="index"
                        width="80px"
                        align="center"
                        label="序号">
                </el-table-column>
                <el-table-column
                        prop="personName"
                        label="姓名"
                        min-width="100"
                        show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                        prop="domesticRelationCode"
                        label="与户主关系"
                        min-width="80"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row,$index}">
                        {{relation.find(x=>x.code===row.domesticRelationCode).name}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        label="出生日期"
                        width="120"
                        show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                        prop="nationCode"
                        label="民族"
                        min-width="50"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row,$index}">
                        <div v-if="row.nationCode!==''">{{nation.find(x=>x.code===row.nationCode).name}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="nativePlaceRegionCode"
                        label="籍贯"
                        min-width="50"
                >
                    <template slot-scope="{row,$index}">
                        <div v-if="row.nativePlaceRegionCode!==''">{{native.find(x=>x.code===row.nativePlaceRegionCode).name}}</div>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="tel"
                        label="联系电话"
                        min-width="100"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row,$index}">
                        <div v-if="(row.tel || '暂无')=== '暂无'" style="color: #a0a5a9">暂无</div>
                        <div v-else>{{row.tel}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="附加信息"
                        min-width="100"
                        show-overflow-tooltip
                >
                    <template slot-scope="{row,$index}">
                        <div v-if="(row.remark || '暂无')=== '暂无'" style="color: #a0a5a9">暂无</div>
                        <div v-else>{{row.remark}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="120px"
                >
                    <template slot-scope="{row,$index}">
                        <div class="tableEdit">
                            <div class="item" @click="openEditMemberDialog(row.id)">编辑</div>
                            <div class="item delete" @click="deleteFamilyInfo(row.id)">删除</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="userSearch" style="padding-top: 40px;">
                <div class="froat">
                    <i class="iconfont iconche"></i>
                    <i class="textTitle">车位信息</i>
                </div>
                <div class="last">
                    <div class="pmbtn primary" @click="addCarport">
                        <i class="iconfont icontianjia"></i>添加车位
                    </div>
                </div>
            </div>
            <div class="header" v-for="(item) in proprietorDetialInfo.spaceRoomCars" >
                <div class="front">
                        <div style="margin-left: 15px">
                            <i class="line"></i>
                            <i class="font" >{{parkingList.find(x=>x.id===item.packingSpace.parkingId).name}}——{{item.packingSpace.code}}</i>
                            <i style="margin-left: 15px" v-show="item.packingSpace.statusCode==='3'">使用期限:{{item.packingSpace.rentedTimeStart}}—{{item.packingSpace.rentedTimeEnd}}</i>
                        </div>
                        <div class="aa" >
                            <div style="margin-right: 20px;user-select: none;cursor: pointer" @click="editParkSpace(item.packingSpace.id)">
                                <i class="iconfont iconbianji" style="padding-right: 5px"></i>
                                <i>编辑</i>
                            </div>
                            <div>
                                <div style="user-select: none;cursor: pointer"  @click="deleteParkSpaceInfo(item.packingSpace.id)">
                                    <i class="iconfont iconshanchu" style="padding-right: 5px"></i>
                                    <i>删除</i>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="last">
                    <div style="width: 100%; display: flex;" v-for="(k,index) in item.cars" :key="index">
                    <div class="bor">
                        <i class="textCar">登记车牌{{index+1}}：</i>
                        <i v-if="k.carNum!==''">{{k.carNum}}</i>
                        <i v-else style="color: #a0a5a9;">暂未登记</i>
                    </div>
                    <div class="bor">
                        <i class="textCar">车牌颜色：</i>
                        <i v-if="k.plateColorCode!==''">{{colorList.find(item => item.code===k.plateColorCode).name}}</i>
                        <i v-else style="color: #a0a5a9;">暂未登记</i>
                    </div>
                    </div>
                </div>
            </div>

        </div>
        </vue-perfect-scrollbar>
        <el-dialog
                :visible.sync="editInfoVisible"
                custom-class="emDialog"
                width="844px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                top="15vh"
                @close="closeEditInfoDialog"
                v-if="closeEditInfoDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改
            </div>
            <div class="MuModalContent" >
                <div class="title">
                        <i class="iconfont iconfangzi"></i>
                        <em>{{roomName}}</em>
                </div>
                <div class="main">
                    <div class="left">
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">业主名称</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="必填" v-model="proprietorDetialEdit.personInfo.name" necessary></Input>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">身份证号</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="必填" :disabled="true" v-model="proprietorDetialEdit.personInfo.cardNumber"></Input>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">出生日期</div>
                                <div class="item">
                                    <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 200px" :value="proprietorDetialEdit.personInfo.birthday" @on-change="handleBirthday"></DatePicker>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">性别</div>
                                <div class="item">
                                    <mixSelect
                                            v-model="proprietorDetialEdit.personInfo.sexCode"
                                            :selectList="sex"
                                            labelName="name"
                                            valueName="code"
                                            childrenName="children"
                                            placeholder="请选择"
                                            style="width: 200px;min-width: 200px"
                                    >
                                    </mixSelect>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">民族</div>
                                <div class="item">
                                    <mixSelect
                                            v-model="proprietorDetialEdit.personInfo.nationCode"
                                            :selectList="nation"
                                            labelName="name"
                                            valueName="code"
                                            childrenName="children"
                                            placeholder="请选择"
                                            style="width: 200px;min-width: 200px"
                                    >
                                    </mixSelect>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">籍贯</div>
                                <div class="item">
                                    <mixSelect
                                            v-model="proprietorDetialEdit.personInfo.nativePlaceRegionCode"
                                            :selectList="native"
                                            labelName="name"
                                            valueName="code"
                                            placeholder="请选择"
                                            style="width: 200px;min-width: 200px"
                                    >
                                    </mixSelect>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">联系方式</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="必填" v-model="proprietorDetialEdit.personInfo.tel" necessary></Input>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">入伙时间</div>
                                <div class="item">
                                    <DatePicker type="datetime"  placeholder="请选择" style="width: 200px" :value="proprietorDetialEdit.proprietorAndRoom.time" @on-change="handleTime"></DatePicker>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">购房合同号</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="请输入" v-model="proprietorDetialEdit.proprietorAndRoom.contractCode"></Input>
                                </div>
                            </div>
                            <div class="aline1">
                                <div class="item btn">管理协议书号</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="请输入" v-model="proprietorDetialEdit.proprietorAndRoom.agreementNumber"></Input>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1">
                                <div class="item btn">房产证号</div>
                                <div class="item">
                                    <Input style="width: 200px" placeholder="请输入" v-model="proprietorDetialEdit.proprietorAndRoom.pocCode"></Input>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="aline1" style="width: 100%">
                                <div style="min-width: 80px;text-align: right;margin-right: 20px">附加信息</div>
                                <div style="width: 100%">
                                    <textarea style="width: 100%" v-model="proprietorDetialEdit.personInfo.remark"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <label class="upfileInfo" for="addupload">
                            <img v-if="imgportadd" :src="imgportadd">
                            <i v-else class="iconzhengjianzhao iconfont"></i>
                            <div class="item">重新上传</div>
                        </label>
                        <input type="file" accept="image/*" id="addupload" @change="upAddImg">
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="updateProprietorInfo">确定</div>
                <div class="pmbtn" @click="closeEditInfoDialog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="addMemberVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                top="17vh"
                @close="closeMemberDialog"
                v-if="closeMemberDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                添加成员
            </div>
            <div class="MuModalContent" >
                <div class="aline">
                    <div class="label">姓名</div>
                    <div class="info">
                        <Input placeholder="必填" v-model="addMemberInfo.personInfo.name" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">与户主关系</div>
                    <div class="info">
                        <mixSelect
                                :selectList="relation"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="必填"
                                v-model="addMemberInfo.domesticRelationCode"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">身份证号</div>
                    <div class="info">
                        <Input placeholder="必填" v-model="addMemberInfo.personInfo.cardNumber"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">性别</div>
                    <div class="info">
                        <mixSelect
                                :selectList="sex"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                v-model="addMemberInfo.personInfo.sexCode"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">出生日期</div>
                    <div class="info">
                        <DatePicker ref="dateForm" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" @on-change="handChange" v-model="addMemberInfo.personInfo.birthday"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">民族</div>
                    <div class="info">
                        <mixSelect
                                v-model="addMemberInfo.personInfo.nationCode"
                                :selectList="nation"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">籍贯</div>
                    <div class="info">
                        <mixSelect
                                v-model="addMemberInfo.personInfo.nativePlaceRegionCode"
                                :selectList="native"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">联系电话</div>
                    <div class="info">
                        <Input placeholder="必填" v-model="addMemberInfo.personInfo.tel" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">附加信息</div>
                    <div class="info">
                        <textarea style="width: 100%" placeholder="请输入" v-model="addMemberInfo.personInfo.remark"></textarea>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addMember">确定</div>
                <div class="pmbtn" @click="closeMemberDialog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="editMemberVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                top="17vh"
                @close="closeEditMemberDialog"
                v-if="closeEditMemberDialog"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                编辑成员信息
            </div>
            <div class="MuModalContent" >
                <div class="aline">
                    <div class="label">姓名</div>
                    <div class="info">
                        <Input placeholder="必填" v-model="familyMemberInfo.personInfo.name" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">与户主关系</div>
                    <div class="info">
                        <mixSelect
                                :selectList="relation"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="必填"
                                v-model="familyMemberInfo.domesticRelationCode"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">身份证号</div>
                    <div class="info">
                        <Input disabled placeholder="请输入" v-model="familyMemberInfo.personInfo.cardNumber" ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">性别</div>
                    <div class="info">
                        <mixSelect
                                :selectList="sex"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                v-model="familyMemberInfo.personInfo.sexCode"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">出生日期</div>
                    <div class="info">
                        <DatePicker ref="dateForm" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%" @on-change="handChangeEdit" :value="familyMemberInfo.personInfo.birthday"></DatePicker>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">民族</div>
                    <div class="info">
                        <mixSelect
                                v-model="familyMemberInfo.personInfo.nationCode"
                                :selectList="nation"
                                labelName="name"
                                valueName="code"
                                childrenName="children"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">籍贯</div>
                    <div class="info">
                        <mixSelect
                                v-model="familyMemberInfo.personInfo.nativePlaceRegionCode"
                                :selectList="native"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="max-width: 100%"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">联系电话</div>
                    <div class="info">
                        <Input placeholder="必填" v-model="familyMemberInfo.personInfo.tel" necessary></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">附加信息</div>
                    <div class="info">
                        <textarea style="width: 100%" placeholder="请输入" v-model="familyMemberInfo.personInfo.remark"></textarea>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="editFamilyInfo">确定</div>
                <div class="pmbtn" @click="closeEditMemberDialog">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="addCarportVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                top="20vh"
                @close="closeAddCarport"
                v-if="addCarportVisible"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                添加车位
            </div>
            <div class="MuModalContent" >
                <div class="aline">
                    <div class="label">停车场</div>
                    <div class="info">
                        <mixSelect
                                v-model="parkingId"
                                :selectList="parkingList"
                                labelName="name"
                                valueName="id"
                                placeholder="必选"
                                style="max-width: 100%"
                                @sentTo="parkingSearch"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">车位编号</div>
                    <div class="info">
                        <el-select v-model="addCarportInfo.spaceId" filterable placeholder="必选" style="width: 100%;" @change="handleSelect" >
                            <el-option
                                    v-for="(item,index) in parkSpaceList"
                                    :key="index"
                                    :label="item.code"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="aline" v-show="addCarportInfo.spaceId!==''&&parkSpaceDeitailList.statusCode==='3'">
                    <div class="label">租用期限</div>
                    <div class="info">
                        <Input placeholder="请输入" disabled v-model="time"></Input>
                    </div>
                </div>
                <div class="aline" v-show="addCarportInfo.spaceId!==''&&parkSpaceDeitailList.statusCode==='2'">
                    <div class="label">租用期限</div>
                    <div class="info">
                        <Input placeholder="永久" disabled ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">登记车牌1</div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #7c8185;">车牌号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addCarportInfo.carNum1" @blur="limitCarNum1"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #7c8185;">车牌颜色</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="colorList"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="width: 100%"
                                v-model="addCarportInfo.plateColorCode1"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">登记车牌2</div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #7c8185;">车牌号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="addCarportInfo.carNum2" @blur="limitCarNum2"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #7c8185;">车牌颜色</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="colorList"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="width: 100%"
                                v-model="addCarportInfo.plateColorCode2"
                        >
                        </mixSelect>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="addParkSapceInfo">确定</div>
                <div class="pmbtn" @click="closeAddCarport">取消</div>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="editCarportVisible"
                custom-class="emDialog"
                width="545px"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                top="20vh"
        >
            <div class="title" slot="title">
                <div class="iconColumn"></div>
                修改车位信息
            </div>
            <div class="MuModalContent" >
                <div class="aline">
                    <div class="label">停车场</div>
                    <div class="info">
                        <mixSelect
                                v-model="editCarportInfo.parkingId"
                                :selectList="parkingList"
                                labelName="name"
                                valueName="id"
                                placeholder="请选择"
                                style="max-width: 100%"
                                disabled
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">车位编号</div>
                    <div class="info">
                     <Input v-model="editCarportInfo.code" disabled></Input>
                    </div>
                </div>
                <div class="aline" v-show="editCarportInfo.statusCode==='3'">
                    <div class="label">租用期限</div>
                    <div class="info">
                        <Input placeholder="请输入" disabled v-model="time2"></Input>
                    </div>
                </div>
                <div class="aline" v-show="editCarportInfo==='2'">
                    <div class="label">租用期限</div>
                    <div class="info">
                        <Input placeholder="永久" disabled ></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">登记车牌1</div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #7c8185;">车牌号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="cars1.carNum"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #7c8185;">车牌颜色</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="colorList"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="width: 100%"
                                v-model="cars1.plateColorCode"
                        >
                        </mixSelect>
                    </div>
                </div>
                <div class="aline">
                    <div class="label">登记车牌2</div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #7c8185;">车牌号</div>
                    <div class="info">
                        <Input placeholder="请输入" v-model="cars2.carNum"></Input>
                    </div>
                </div>
                <div class="aline">
                    <div class="label" style="color: #7c8185;">车牌颜色</div>
                    <div class="info">
                        <mixSelect
                                class="margin"
                                :selectList="colorList"
                                labelName="name"
                                valueName="code"
                                placeholder="请选择"
                                style="width: 100%"
                                v-model="cars2.plateColorCode"
                        >
                        </mixSelect>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <div class="pmbtn primary" style="margin-right: 10px" @click="updateParkSpaceInfo">确定</div>
                <div class="pmbtn" @click="editCarportVisible=false">取消</div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component,Prop, Watch} from "vue-property-decorator"
    import { Page, Icon, Spin, DatePicker, Checkbox,RadioGroup,Radio,Select,Option} from 'view-design'
    import { Tree } from 'iview'
    import tabNav from '@manage/components/tabNav.vue';
    import mixSelect from '@manage/components/mixSelect.vue';
    import Input from '@manage/components/normalInput.vue';
    import * as api from '@manage/api/house/householdInformation'
    import * as app from '@manage/api/app'
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
            Select,
            Option
        }
    })
    export default class costStatistics extends Vue {
        @Prop({
            default: false,
        }) personId!: string;
        @Prop({
            default: false,
        }) rdId!: string;
        @Prop({
            default: false,
        }) roomName!: string;
        @Prop({
            default:false
        })tableFlag:boolean
        @Watch("tableFlag", { immediate: true, deep: true })
        gettableFlag() {
            if(this.tableFlag){
                this.getParkingLIst(this.rdId)
                this.getFamilyMember(this.personId)
                this.getProprietorInfoDetial(this.personId)
            }
        }
        viewImgSrc:string = null
        relation:any=[]
        parkingId:string=''
        imageUrl:string=''
        nation:any=[]
        parkSpaceList:any=[]
        sex:any=[]
        native:any=[]
        parkingList:any=[]
        proprietorId:string=''
        familyMemberList:any=[]
        proprietorDetial:any={
            proprietor: {
                personInfo: {
                    name: "",
                    birthday: null,
                    idDocumentTypeCode: "",
                    cardNumber: null,
                    company: "",
                    locationDetailed: "",
                    locationRegionCode: "",
                    maritalStatusCode: "",
                    nationCode: "",
                    nationalityCode: "",
                    nativePlaceRegionCode: "",
                    nickname: "",
                    occupationCode: "",
                    politicsStatusCode: "",
                    sexCode: "",
                    eduDegreeCode: "",
                    tel: "",
                    presentAddressRegionCode: "",
                    presentAddressDetailed: "",
                    photoId: "",
                    remark: "",
                },
                proprietorAndRoom: {
                    proprietorAndRoomOccupation:{
                        chargingDate:''
                    },
                    roomId: "",
                    pocCode: "",
                    agreementNumber:'',
                    contractCode: "",
                    time: "",
                    endTime: null,
                }
            },
            familyMemberList: []
        }
        proprietorDetialInfo:any=[]
        subFlag: boolean = true
        addMemberInfo:any={
            proprietorId: "",
            domesticRelationCode:'',
            personInfo:{
                    name: "",
                    birthday: "",
                    idDocumentTypeCode: "",
                    cardNumber: "",
                    nationCode: "",
                    nativePlaceRegionCode: "",
                    sexCode: "",
                    tel: "",
                    remark: "",
                }
        }
        familyMemberInfo:any={
            proprietorId: "",
            domesticRelationCode:'',
            personInfo:{
                name: "",
                birthday: "",
                idDocumentTypeCode: "",
                cardNumber: "",
                nationCode: "",
                nativePlaceRegionCode: "",
                sexCode: "",
                tel: "",
                remark: "",
            }
        }
        proprietorDetialEdit:any={
            name:'',
                personInfo: {
                    name: "",
                    birthday: null,
                    idDocumentTypeCode: "",
                    cardNumber: null,
                    company: "",
                    locationDetailed: "",
                    locationRegionCode: "",
                    maritalStatusCode: "",
                    nationCode: "",
                    nationalityCode: "",
                    nativePlaceRegionCode: "",
                    nickname: "",
                    occupationCode: "",
                    politicsStatusCode: "",
                    sexCode: "",
                    eduDegreeCode: "",
                    tel: "",
                    presentAddressRegionCode: "",
                    presentAddressDetailed: "",
                    photoId: "",
                    remark: "",
                },
                proprietorAndRoom: {
                    proprietorAndRoomOccupation:{
                        chargingDate:''
                    },
                    contractCode: "",
                    roomId: "",
                    pocCode: "",
                    agreementNumber: "",
                    time: "",
                    endTime: null,
                }
        }
        editInfoVisible:boolean=false
        addMemberVisible:boolean=false
        editMemberVisible:boolean=false
        addCarportVisible:boolean=false
        editCarportVisible:boolean=false
        parkSpaceDeitailList:any=[]
        colorList:any=[]
        cars1:any=[]
        cars2:any={
            carNum:'',
            plateColorCode:''
        }
        time:string=''
        time2:string=''
        editCarportInfo:any=[]
        addCarportInfo:any={
            carNum1: "",
            carNum2: "",
            plateColorCode1: "",
            plateColorCode2: "",
            roomId: "",
            spaceId: "",
            statusCode: ""
        }
        loaderOption: any = {
            lock: true,
            body: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        };
        created(): void {
            this.getNation()
            this.getNation()
            this.getSex()
            this.getRegionTree()
            this.getRelation()
            this.getColor()
        }
        backClose(){
            this.$emit(`close`)
        }
        openMemberDialog(){
            this.addMemberVisible=true
            this.getRegionTree()
        }
        handleStartTime(date){
            this.proprietorDetialEdit.proprietorAndRoom.proprietorAndRoomOccupation.chargingDate=date
        }
        closeMemberDialog(){
            this.addMemberVisible=false
            this.addMemberInfo={
                proprietorId: "",
                domesticRelationCode:'',
                personInfo:{
                    name: "",
                    birthday: "",
                    idDocumentTypeCode: "",
                    cardNumber: "",
                    nationCode: "",
                    nativePlaceRegionCode: "",
                    sexCode: "",
                    tel: "",
                    remark: "",
                }
            }
        }
        openEditMemberDialog(id){
            this.editMemberVisible=true
            this.getFamilyInfoById(id)
        }
        closeEditMemberDialog(){
            this.editMemberVisible=false
        }
        openEditInfoDialog(){
            this.editInfoVisible=true
            this.proprietorDetialEdit=JSON.parse(JSON.stringify(this.proprietorDetialInfo.proprietor))
        }
        closeEditInfoDialog(){
            this.editInfoVisible=false
        }
        handChange(data){
            this.addMemberInfo.personInfo.birthday=data
        }
        addCarport(){
            this.addCarportVisible=true
        }
        closeAddCarport(){
            this.addCarportVisible=false
            this.parkingId=''
            this.parkSpaceDeitailList=[]
            this.parkSpaceList=[]
            this.addCarportInfo={
                carNum1: "",
                carNum2: "",
                plateColorCode1: "",
                plateColorCode2: "",
                roomId: "",
                spaceId: "",
                statusCode: ""
            }
        }
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        }
        handChangeEdit(date){
            this.familyMemberInfo.personInfo.birthday=date
        }
        handleBirthday(date){
            this.proprietorDetialEdit.personInfo.birthday=date
        }
        handleTime(date){
          this.proprietorDetialEdit.proprietorAndRoom.time=date
        }
        parkingSearch(){
            this.getParkSpacelist(this.parkingId)
            this.addCarportInfo.spaceId=''
        }
        async  handleSelect(id){
            this.getParkSpaceById(id)
        }
        editParkSpace(id){
            this.editCarportVisible=true
            this.getCarInfoById(id)
        }
        limitCarNum1(){
            var reg = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/
            if(this.addCarportInfo.carNum1!==''){
                if(!reg.test(this.addCarportInfo.carNum1))
                {
                    this.$message.warning('车牌号有误，请重新输入')
                    this.addCarportInfo.carNum1=''
                }
            }
        }
        limitCarNum2(){
            var reg = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/
            if(this.addCarportInfo.carNum2!==''){
                if(!reg.test(this.addCarportInfo.carNum2))
                {
                    this.$message.warning('车牌号有误，请重新输入')
                    this.addCarportInfo.carNum2=''
                }
            }
        }
        get imgportadd() {
            return this.proprietorDetialEdit.personInfo.photoId ? this.$imgDownUrl() + `${this.proprietorDetialEdit.personInfo.photoId}` : null
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
                        this.proprietorDetialEdit.personInfo.photoId = id;
                        this.$message.success(`上传成功！`)

                    } catch (e) {
                        this.$message.error(`上传失败!`)
                    }
                    load.close()
                    (<HTMLInputElement>document.getElementById('addupload')).value='';
                }, 200);
            }
        }
        //得到家庭成员列表
        async getFamilyMember(id){
                let {data}=await api.getFamilyMember(id)
                this.familyMemberList=data
        }
        //得到住户信息
        async getProprietorInfoDetial(id){
            try {
                let {data}=await api.getProprietorInfoDetial(id)
                this.proprietorDetialInfo=data
                this.proprietorDetial=JSON.parse(JSON.stringify(this.proprietorDetialInfo))
                if(this.nation.find(x=>x.code===this.proprietorDetial.proprietor.personInfo.nationCode)!==undefined){
                    this.proprietorDetial.proprietor.personInfo.nationCode=this.nation.find(x=>x.code===this.proprietorDetial.proprietor.personInfo.nationCode).name
                }
                if(this.sex.find(x=>x.code===this.proprietorDetial.proprietor.personInfo.sexCode)!==undefined){
                    this.proprietorDetial.proprietor.personInfo.sexCode=this.sex.find(x=>x.code===this.proprietorDetial.proprietor.personInfo.sexCode).name
                }
                if(this.native.find(x=>x.code===this.proprietorDetial.proprietor.personInfo.nativePlaceRegionCode)!==undefined){
                    this.proprietorDetial.proprietor.personInfo.nativePlaceRegionCode=this.native.find(x=>x.code===this.proprietorDetial.proprietor.personInfo.nativePlaceRegionCode).name
                }
                this.viewImgSrc = this.proprietorDetialInfo.proprietor.personInfo.photoId ? this.$imgDownUrl() + `${this.proprietorDetial.proprietor.personInfo.photoId}` : null;
            }catch (e) {
            }

        }
        //修改业主信息
        async  updateProprietorInfo(){
            if(this.subFlag) {
                this.subFlag = false
                this.proprietorDetialEdit.name = this.proprietorDetialEdit.personInfo.name
                let limit = {
                    "name": "业主名称",
                    "personInfo.tel": "联系方式",
                    "proprietorAndRoom.time": "入伙时间",
                }
                if (this.$utils.isntNull(this.proprietorDetialEdit, limit)) {
                    if ((!this.$utils.phoneLimit(this.proprietorDetialEdit.personInfo.tel))) {
                        this.$message.warning('请输入正确的号码')
                    } else {
                        try {
                            await api.updateProprietorInfo(this.proprietorDetialEdit)
                            this.$message.success('修改成功')
                            this.editInfoVisible = false
                            this.getProprietorInfoDetial(this.personId)
                        } catch (e) {
                            this.$message.error('修改失败')
                            this.editInfoVisible = false
                        }
                    }
                }
            }
            this.subFlag = true
        }
        //查询家庭成员详细信息
        async getFamilyInfoById(id){
            let{data}=await api.getFamilyInfoById(id)
            this.familyMemberInfo=data
        }
        //新增家庭成员
        async addMember(){
            if(this.subFlag) {
                this.subFlag = false
                this.addMemberInfo.proprietorId = this.personId
                let limit = {
                    "personInfo.name": "姓名",
                    "personInfo.domesticRelationCode": "与户主关系",
                    "personInfo.tel": "联系方式",
                }
                if(this.addMemberInfo.personInfo.birthday===''){
                    this.addMemberInfo.personInfo.birthday=null
                }
                if (this.$utils.isntNull(this.addMemberInfo, limit)) {
                    if ((!this.$utils.phoneLimit(this.addMemberInfo.personInfo.tel))) {
                        this.$message.warning('请输入正确的号码')
                    } else {
                        if ((!this.$utils.idCardLimit(this.addMemberInfo.personInfo.cardNumber))&&this.addMemberInfo.personInfo.cardNumber!=='') {
                            this.$message.warning('请输入正确的身份证号')
                        } else {
                            try {
                                await api.addMember(this.addMemberInfo)
                                this.$message.success('新增成功')
                                this.addMemberVisible = false
                                this.getFamilyMember(this.personId)
                                this.closeMemberDialog()
                            } catch (e) {
                                this.$message.success('新增失败')
                            }
                        }
                    }
                }
            }
            this.subFlag = true
        }
        //修改家庭成员信息
        async editFamilyInfo(){
            if(this.subFlag) {
                this.subFlag = false
                if(this.addMemberInfo.personInfo.birthday===''){
                    this.addMemberInfo.personInfo.birthday=null
                }
            if((!this.$utils.idCardLimit(this.familyMemberInfo.personInfo.cardNumber))){
                this.$message.warning('请输入正确的身份证号')
            }
            else {
                if ((!this.$utils.phoneLimit(this.familyMemberInfo.personInfo.tel))&&this.familyMemberInfo.personInfo.tel!=='') {
                    this.$message.warning('请输入正确的号码')
                } else {
                    try {
                        await api.updateFamilyInfo(this.familyMemberInfo)
                        this.editMemberVisible = false
                        this.$message.success('修改成功')
                        this.getFamilyMember(this.personId)
                    } catch (e) {
                        this.$message.error('修改失败')
                    }
                }
            }
            }
            this.subFlag = true
        }
        //删除家庭成员
        async deleteFamilyInfo(id){
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
            var ids:any=[]
            ids=id.split('/t')
            try {
                await api.deleteFamillyInfo(ids)
                this.getFamilyMember(this.personId)
                this.$message.success('删除成功')
            }catch (e) {
                this.$message.error('删除失败')
            }
        }

        //查询停车场列表
        async getParkingLIst(id){
            let {data} =await api.getParkListInfo(id)
            this.parkingList=data
        }
        //查询车位信息
        async getParkSpacelist(id){
            let {data}=await api.getParkSpaceList(id,'')
            this.parkSpaceList=data
            console.log(id)
        }

        //查询详细车位信息
        async getParkSpaceById(id) {
            let {data} = await api.getParkSpaceInfoById(id)
            this.parkSpaceDeitailList = data
            this.time = `${this.parkSpaceDeitailList.rentedTimeStart}  ~  ${this.parkSpaceDeitailList.rentedTimeEnd}`

        }
        //添加车位
        async addParkSapceInfo() {
            if (this.subFlag) {
                this.subFlag = false
                this.addCarportInfo.roomId = this.proprietorDetialInfo.proprietor.proprietorAndRoom.roomId
                this.addCarportInfo.statusCode = this.parkSpaceDeitailList.statusCode
                let limit = {
                    "spaceId": '车位编号',
                    "carNum1": "车牌号1",
                    "plateColorCode1": "车牌颜色1",
                }
                if (this.$utils.isntNull(this.addCarportInfo, limit)) {
                    if(this.addCarportInfo.carNum2!==''&&this.addCarportInfo.plateColorCode2===''){
                        this.$message.warning('请输入车牌颜色2')
                    }
                    else {
                        try {
                            await api.addParkSpace(this.addCarportInfo)
                            this.$message.success('添加成功')
                            this.addCarportVisible = false
                            this.getProprietorInfoDetial(this.personId)
                            this.closeAddCarport()
                        } catch (e) {
                            this.$message.error('添加失败')
                        }
                    }
                    }
            }
            this.subFlag = true
        }
        //删除车位
        async deleteParkSpaceInfo(id){
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
            var ids:any=[]
            ids=id.split('/t')
            try {
                await api.deleteParkSpaceInfo(this.personId,ids)
                this.getProprietorInfoDetial(this.personId)
                this.$message.success('删除成功')
            }catch (e) {
                this.$message.error('删除失败')
            }
        }
        async  getCarInfoById(id){
           let {data}= await api.getParkSpaceInfoById(id)
            this.editCarportInfo=data
            console.log(data)
            if(data.cars.length===1){
                this.cars1=this.editCarportInfo.cars[0]
            }
            else {
                this.cars1=this.editCarportInfo.cars[0]
                this.cars2=this.editCarportInfo.cars[1]
            }
            this.time2=`${this.editCarportInfo.rentedTimeStart}  ~  ${this.editCarportInfo.rentedTimeEnd}`
        }
        //修改车位信息
        async updateParkSpaceInfo() {
            if (this.subFlag) {
                this.subFlag = false
                var editParkInfo: any = {
                    carNum1: this.cars1.carNum,
                    carNum2: this.cars2.carNum,
                    plateColorCode1: this.cars1.plateColorCode,
                    plateColorCode2: this.cars2.plateColorCode,
                    roomId: this.editCarportInfo.roomId,
                    spaceId: this.editCarportInfo.spaceId,
                    statusCode: this.editCarportInfo.statusCode
                }
                    if ((editParkInfo.carNum1 !== '' && editParkInfo.plateColorCode1 === '')||(editParkInfo.carNum2 !== '' && editParkInfo.plateColorCode2 === '')) {
                        this.$message.warning('请输入车牌颜色')
                    } else {
                        try {
                            //await api.updateParkSpaceInfo(editParkInfo)
                            this.$message.success('修改成功')
                            this.editCarportVisible=false
                            this.getProprietorInfoDetial(this.personId)
                        }catch (e) {
                            this.$message.error('修改失败')
                        }
                    }
            }
            this.subFlag = true
        }
        //籍贯
        async getRegionTree(){
            let { data } = await api.getRegionTree()
            this.native=data
        }
        //民族
        async getNation(){
            let { data } = await api.getInfoByName("民族")
            this.nation=data
        }
        //性别
        async getSex(){
            let { data } = await api.getInfoByName("性别")
            this.sex=data
        }
        //家庭成员与业主关系
        async getRelation(){
            let { data } = await api.getInfoByName("家庭成员与业主关系")
            this.relation=data
        }
        async getColor() {
            let {data} = await api.getInfoByName("车牌颜色")
            this.colorList = data
            console.log(data)
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/standard-global";
    .costTable {
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        padding-left: 20px;
        .costTitle{
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dde4eb;
            font-size: 16px;
           margin-right: 20px;
            .back{
                display: inline-flex;
                align-items: center;
                color: $theme-color;
                font-size: 14px;
                padding-right: 10px;
                margin-right: 10px;
                height: 16px;
                border-right: 1px solid #dde4eb;
                cursor: pointer;
                user-select: none;
                .iconfont{
                    color: $theme-color;
                    font-size: 12px;
                    line-height: 1;
                    margin-right: 4px;
                    margin-bottom: 2px;
                }
            }
        }
        .middleline{
            height: 232px;
            border-radius: 5px;
            border: solid 1px #dde4eb;
            margin-top: 21px;
        .front{
            height: 51px;
            background-color: #f8f9fc;
            display: flex;
            overflow: hidden;
            .iconbox {
                height: 100%;
                width: 50px;
                background-image: linear-gradient(313deg,
                        #4d9aff 0%,
                        #3b66f6 100%);
                border-radius: 4px 0px 0px 0px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                .iconfont {
                    color: #fff;
                    font-size: 28px;
                }
            }
            em{
                font-size: 16px;
                font-weight: bold;
                line-height: 51px;
            }
        }
            .last{
                display: flex;
                height: calc(100% - 51px);
                position: relative;
                align-items: center;
                margin: 0 15px;
                img{
                    width: 100px;
                    height: 140px;
                    margin-right: 40px;
                }
                .main{
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    .content1{
                        height: 33%;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: flex-end;
                    }
                    .content2{
                        height: 34%;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                    }
                    .content3{
                        height:33%;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: flex-start;
                    }
                    .item1{
                        width: 270px;
                        .title{
                            display: inline-block;
                            width: 75px;
                            color: #7c8185;
                        }
                    }
                    .item2{
                        width: 25%;
                        .title{
                            display: inline-block;
                            width: 75px;
                            color: #7c8185;
                        }
                    }
                    .item3{
                        width: 18%;
                        .title{
                            display: inline-block;
                            width: 102px;
                            color: #7c8185;
                        }
                    }
                    .item4{
                        .title{
                            display: inline-block;
                            width: 88px;
                            color: #7c8185;
                        }
                    }
                }


            }
            .editInfo{
                padding-top: 22px;
                color: #3a7ef3;
                cursor: pointer;
                user-select: none;
                flex: none;
               position: absolute;
                top: 0;
                right: 0;
                .iconbianji{
                    padding-right: 6px;
                }
            }

        }
        .mainInfo{
            padding-left:10px;
            .userSearch{
                margin-top: 31px;
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 12px;
                justify-content: space-between;
                display: flex;
                align-items: center;
                .froat{
                    .textTitle{
                        font-weight: bolder;
                        font-size: 15px;
                    }
                    .iconzhanghao{
                        color:#3a7ef3;
                        padding-right: 9px;
                    }
                    .iconche{
                        color:#289ef9;
                        padding-right: 6px;
                    }
                }
                .last{
                    display: flex;
                }
            }
            .tableEdit{
                display: inline-flex;
                user-select: none;
                >.item{
                    margin-right: 15px;
                    color: $second-font-color;
                    cursor: pointer;
                    &:hover{
                        color: $theme-color;
                    }
                    &.delete:hover{
                        color: $error-color;
                    }
                }
            }
            .text{
                font-size: 15px;
                color: #30374a;
            }
        }
        .tableEdit{
            display: inline-flex;
            user-select: none;
            >.item{
                margin-right: 15px;
                color: $second-font-color;
                cursor: pointer;
                &:hover{
                    color: $theme-color;
                }
                &.delete:hover{
                    color: $error-color;
                }
            }
        }
    }
    .MuModalContent{
        .title{
            padding-bottom: 30px;
                font-size: 16px;
                .iconfangzi{
                    color: #3a7ef3;
                    padding-right:8px;
                }
                em{
                    font-weight: bold;
                }
        }
        .main{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .content{
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 15px;
                &:last-child {
                    margin-bottom: 0px;
                }
                .aline1 {
                    display: flex;
                    align-items: center;
                    margin-right: 30px;
                    .item {
                        min-width: 80px;
                        &.btn {
                            margin-right: 20px;
                            line-height: 36px;
                            text-align: right;
                        }
                    }
                }
            }
            .border{
                width: 100%;
                border: dashed 1px #dde4eb;
                margin: 20px 0;
            }
        }
    }
    .aline {
        .label {
            width: 100px;
        }
    }
    .header{
        width: 100%;
        margin-top: 15px;
        height: 96px;
        border: solid 1px #dde4eb;
        .front{
            border-bottom: solid 1px #dde4eb;
            height: 48px;
            background-color: #f4f6f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .line{
                display: inline-block;
                width: 4px;
                height: 12px;
                background-color: #3a7ef3;
                border-radius: 2px;
                margin-right: 5px;
            }
            .font{
                font-weight: bolder;
            }
            .aa{
                color: #3a7ef3;
                display: flex;
                margin-right: 15px;
            }
        }
        .last{
            width: 100%;
            height:48px;
            display: flex;
            .bor{
                border-right: solid 1px #dde4eb;
                width: 50%;
                height: 100%;
                display: flex;
                align-items: center;
                .textCar{
                    padding-left: 20px;
                    color: #7c8185;
                    padding-right: 10px;
                    font-size: 14px;
                }
            }
        }
    }
    .avatar-uploader {
        width: 80px;
        height: 50px;
        border-radius: 4px;
        border: dashed 1px #dde4eb;
        cursor: pointer;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .avatar-uploader-icon {
        width: 20px;
        height: 20px;
        color: #c6c9ce;
        font-size: 20px;
    }
    .ivu-radio-wrapper{
        margin-right: 30px;
    }
    .upfileInfo {
        width: 100px;
        height: 140px;
        border: solid 1px #dde4eb;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        .iconfont {
            color: #dde4eb;
            font-size: 48px;
            line-height: 1;
        }
        .item {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            color: #fff;
            height: 28px;
            background-color: #000;
            position: absolute;
            bottom: 0;
            user-select: none;
            opacity: 0.6;
            text-align: center;
            line-height: 28px;
        }
        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
</style>
<style lang="scss">
    input.el-input__inner{
        height: 36px;
    }
</style>
