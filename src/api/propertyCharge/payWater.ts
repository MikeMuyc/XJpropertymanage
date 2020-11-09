import qs from 'qs';

import axios from '../app';


//组织树
export function getTree(level: number | string, id?: string) {
    return axios.get(`/api/pm/family-archive/building/organization/detail/${level}`, {id: id});
}

//根据名字查询
export function getInfoByName(name: string) {
    return axios.get(`/api/pm/payment/common/dict/name_item`, {name: name});
}

//查询房间预交水费
export function getPayWater(
    pageNum: number,
    pageSize: number,
    roomId: string,
    startTime: string,
    endTime: string,
    endPaidMoney: string,
    keyword: string,
    payTypeCode: string,
    startPaidMoney: string
) {
    return axios.get(`/api/pm/payment/fee/water`, {
        pageNum: pageNum,
        pageSize: pageSize,
        roomId: roomId,
        endPaidMoney: endPaidMoney,
        endTime: endTime,
        keyword: keyword,
        payTypeCode: payTypeCode,
        startPaidMoney: startPaidMoney,
        startTime: startTime
    });
}

//查询预交账号
export function getPayWaterAccount(roomId) {
    return axios.get(`/api/pm/payment/fee/water/account/room`, {roomId: roomId})
}

//删除记录
export function deleteWayer(ids) {
    return axios.delete(`/api/pm/payment/fee/water`, ids)
}

//修改账号信息
export function updateAccountInfo(object) {
    return axios.put(`/api/pm/payment/fee/water/account`, object)
}

//新增账号
export function addAcount(object) {
    return axios.post(`/api/pm/payment/fee/water/account`, object)
}

//新增预交
export function addPayWater(object) {
    return axios.post(`/api/pm/payment/fee/water`, object)
}

//可用单据编号
export function getCode(rdId) {
    return axios.get(`/api/pm/payment/fee/document/code`, {rdId: rdId})
}



//查询房间预收款记录
export function getPayList(obj: {
   pageNum: number,
   pageSize: number,
   roomId: string,
   startTime?: string,
   endTime?: string,
   keyword?: string,
   payTypeCode?: string,
   startPaidMoney?: string,
   endPaidMoney?: string,
   feeOperationTypeCode?: string,
}) {
    return axios.get(`/api/pm/payment/fee/advance`, obj);
}

//删除记录
export function deletePay(ids) {
    return axios.delete(`/api/pm/payment/fee/advance`, ids)
}

//新增预交记录
export function addPayMoney(object) {
    return axios.post(`/api/pm/payment/fee/advance`, object)
}
//查询预交款账号
export function getPayAccount(roomId) {
    return axios.get(`/api/pm/payment/fee/advance/account/room`, {roomId: roomId})
}
//修改预交款账号信息
export function updatePayAccountInfo(object) {
    return axios.put(`/api/pm/payment/fee/advance/account`, object)
}

//新增预交款账号
export function addPayAcount(object) {
    return axios.post(`/api/pm/payment/fee/advance/account`, object)
}
