import myaxios from "@manage/axios";
import axios from '../app';
let axios1 = new myaxios('./api');
import realaxios from 'axios'
//字典菜单
export function getSelection(name) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name}).then(resp => resp.data);
}
//投诉列表
export function getComplaintList(obj:{
    pageNum:number,
    pageSize:number,

    keyword?:string,
    rdId?:string | number,
    typeCode?:string | number,
    startTime?:string,
    endTime?:string,
    disposeTypeCode?:string | number,
    complaintTypeCode?:string | number,
    anonymous?:string | number
}) {

    return axios.getWithToken(`/api/pm/services/complaint/web`,obj).then(resp => resp.data);
}
//投诉详情
export function getComplaintDetail(id) {
    return axios.getWithToken(`/api/pm/services/complaint/${id}`).then(resp => resp.data);
}
//新增投诉
export function addComplaint(obj) {
    return axios.postWithToken(`/api/pm/services/complaint`,obj).then(resp => resp.data);
}
//删除投诉
export function deleteComplaintDetail(ids:any) {
    return axios.deleteWithToken(`/api/pm/services/complaint`,ids).then(resp => resp.data);
}
//投诉处理
export function feedbackComplaint(obj) {

    return axios.postWithToken(`/api/pm/services/complaint/feed_back`,obj).then(resp => resp.data);
}

export function getTree(level:number|string,id?:string) {
    return axios.get(`/api/pm/family-archive/building/organization/detail/${level}`,{id:id});
}
