import qs from 'qs';

import axios from '../app';


export function getTree2(level?:string|number,rdId?:string) {
    return axios.get(`/api/pm/payment/project/rd`,{level,rdId});
}
//组织树
export function getTree(level:number|string,id?:string) {
    return axios.get(`/api/pm/family-archive/building/organization/detail/${level}`,{id:id});
}


//根据名字查询
export function getInfoByName(name:string) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name:name});
}

//查询所有缴费项目
export function getProjectList(name:string,projectTypeCode:string,rdId:string) {
    return axios.get(`/api/pm/payment/project`,{name,projectTypeCode,rdId});
}
//查询缴费标准
export function getStandard(projectId:string,apportion?:string|number) {
    let apportionCode:string|number = 0;
    if(apportion){
        apportionCode = apportion
    }
    return axios.get(`/api/pm/payment/standard/detail`,{projectId,apportionCode});
}

//根据id查询项目
export function getProjectById(id:string) {
    return axios.get(`/api/pm/payment/project/${id}`);
}

//欠款明细
export function getLackOfDetail(data:any) {
    return axios.get(`/api/pm/payment/fee`,data);
}

//查询明细详情根据id
export function getLackOfDetailById(id:string) {
    return axios.get(`/api/pm/payment/fee/${id}`);
}

//重置金额
export function updateMoney(id:string,totalAp:string | number) {
    return axios.put(`/api/pm/payment/fee/reset_fee?id=${id}&totalAp=${totalAp}`)
}

//批量删除
export function deleteFee(ids:any) {
    return axios.delete(`/api/pm/payment/fee`,ids)
}

//收费
export function collectFee(object) {
    return axios.post(`/api/pm/payment/fee/confirm`,object)
}

//可用单据编号
export function getCode(rdId) {
    return axios.get(`/api/pm/payment/fee/document/code`,{rdId:rdId})
}

//欠费欠缴总额
export function getTotal(data) {
    /*paid:string,roomId:string,keyword:string,payEndDate:string,projectId:string,psId:string,startTime:string,endTime:string,projectTypeCode:string*/
    return axios.get(`/api/pm/payment/fee/total_ap`,data)
}

//查询房间走表数据
export function getMeterreading(data:any) {
    return axios.get(`/api/pm/payment/meter_reading/page`,data)
}

//提前计算
export function calcFee(period,object) {
    return axios.post(`/api/pm/payment/fee/calculate?period=${period}`,object)
}

//增加临时收费
export function temporaryCharge(object) {
    return axios.post(`/api/pm/payment/fee/temporary`,object)
}


//查询某个房间绑定的标准
export function getStandardByRoomId(roomId,projectTypeCode) {
    return axios.get(`/api/pm/payment/standard/room/${roomId}`,{projectTypeCode});
}

//通过收费标准，查询已绑定此标准的房间
export function getBindSandardToRoom(psId:string,rdId:string,hidden?:boolean) {
    return axios.get(`/api/pm/payment/standard/room/tree`,{psId,rdId,hidden})
}

//新增走表录入
export function addmeter(data:any) {
    return axios.post(`/api/pm/payment/meter_reading`,data)
}
//删除走表录入
export function deletemeter(ids:any) {
    return axios.delete(`/api/pm/payment/meter_reading`,ids)
}
//更新走表录入
export function updateemeter(data:any) {
    return axios.put(`/api/pm/payment/meter_reading`,data)
}
//走表详情
export function meterDetail(id:string) {
    return axios.post(`/api/pm/payment/meter_reading/${id}`)
}


//查询上次走表度数
export function getLatestReading(psId:string,roomId:string) {
    return axios.get(`/api/pm/payment/meter_reading/latest`,{psId,roomId});
}

//查询预交款账号
export function getPayAccount(roomId) {
    return axios.get(`/api/pm/payment/fee/advance/account/room`, {roomId: roomId})
}
