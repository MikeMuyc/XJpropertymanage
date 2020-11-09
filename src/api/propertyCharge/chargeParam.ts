import qs from 'qs';

import axios from '../app';
import myaxios from "../../axios";
let axios1 = new myaxios();

export function getTree2(level?:string|number,rdId?:string) {
    return axios.get(`/api/pm/payment/project/rd`,{level,rdId});
}
//组织树
export function getTree(level:number|string,id?:string) {
    return axios.get(`/api/pm/family-archive/building/organization/detail/${level}`,{id:id});
}

//获取小区详情
export function getProjectDetail(id:string) {
    return axios.get(`/api/pm/family-archive/rd/Info`,{id});
}


//根据名字查询
export function getInfoByName(name:string) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name:name});
}

//查询所有缴费项目
export function getProjectList(name:string,priceTypeCode:string,rdId:string,apportionCode?:string) {
    return axios.get(`/api/pm/payment/project`,{name,priceTypeCode,rdId,apportionCode});
}
//查询所有缴费项目
export function getAllProjectList(rdId:string) {
    return axios.get(`/api/pm/payment/standard/tree`,{rdId});
}


//新增项目
export function addProject(object) {
    return axios.post(`/api/pm/payment/project`,object)
}
//修改项目
export function editProject(object) {
    return axios.put(`/api/pm/payment/project`,object)
}

//根据id查询项目
export function getProjectById(id:string) {
    return axios.get(`/api/pm/payment/project/${id}`);
}

//删除项目
export function deleteProject(ids:any) {
    return axios.delete(`/api/pm/payment/project`,ids)
}
//复制项目
export function copyProject(projectId:string,ids:Array<any>) {
    return axios1.post(`/api/pm/payment/project/copy?projectId=${projectId}`,ids)
}

//查询缴费标准
export function getStandard(projectId) {
    return axios.get(`/api/pm/payment/standard/detail`,{projectId});
}
//新增标准
export function addStandard(object) {
    return axios.post(`/api/pm/payment/standard`,object)
}

//根据id查询标准
export function getStandardById(id:string) {
    return axios.get(`/api/pm/payment/standard/${id}`);
}

//修改标准
export function updateStandard(object) {
    return axios.put(`/api/pm/payment/standard`,object)
}

//批量删除标准
export function deleteStandard(ids:any) {
    return axios.delete(`/api/pm/payment/standard`,ids)
}

//查询某个房间绑定的标准
export function getStandardByRoomId(roomId,projectTypeCode) {
    return axios.get(`/api/pm/payment/standard/room/${roomId}`,{projectTypeCode});
}
//查询默认参数
export function getParameter(id) {
    return axios.get(`/api/pm/payment/standard/parameter`,{rdId:id});
}
//修改标准绑定
export function updateStandardByRoom(object) {
    return axios.put(`/api/pm/payment/standard/room`,object)
}


//当前房间-绑定多个收费标准
export function roomBindSandard(roomId,data) {
    return axios.post(`/api/pm/payment/standard/room/batch/room?roomId=${roomId}`,data)
}
//解除房间绑定的多个收费标准
export function reliveroomBindSandard(ids) {
    return axios.delete(`/api/pm/payment/standard/room`,ids)
}

//通过收费标准，查询已绑定此标准的房间
export function getBindSandardToRoom(psId:string,rdId:string) {
    return axios.get(`/api/pm/payment/standard/room/tree`,{psId,rdId})
}

//一个收费标准绑定多个房间
export function standarBindRooms(projectId:string,psId:string,rooms:any,payDate:string,payEndDate?:string) {
    let str:string = `?projectId=${projectId}&psId=${psId}&payDate=${payDate}`;
    if(payEndDate){
        str += `&payEndDate=${payEndDate}`
    }
    return axios.post(`/api/pm/payment/standard/room/batch/psId/${str}`,rooms)
}
