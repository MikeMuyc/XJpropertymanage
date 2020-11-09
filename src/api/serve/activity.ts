import myaxios from "@manage/axios";
import axios from '../app';
let axios1 = new myaxios('./api');
import realaxios from 'axios'
//字典菜单
export function getSelection(name) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name}).then(resp => resp.data);
}
export function getTree(level?:string|number,rdId?:string) {
    return axios.get(`/api/pm/payment/project/rd`,{level,rdId}).then(resp => resp.data);
}

//活动列表
export function getActivityList(obj:{
    pageNum:number,
    pageSize:number,

    keyword?:string,
    statusCode?:string | number,
    typeCode?:string | number,
    startTime?:string,
    endTime?:string,
}) {

    return axios.getWithToken(`/api/pm/services/activity/web`,obj).then(resp => resp.data);
}

//新增活动
export function addActivity(obj:any) {
    return axios.postWithToken(`/api/pm/services/activity`,obj).then(resp => resp.data);
}

//修改活动
export function editActivity(obj:any) {
    return axios.putWithToken(`/api/pm/services/activity`,obj).then(resp => resp.data);
}
//修改活动
export function deleteActivity(ids:any) {
    return axios.deleteWithToken(`/api/pm/services/activity`,ids).then(resp => resp.data);
}

//活动详情
export function getActivity(id:string) {
    return axios.getWithToken(`/api/pm/services/activity/${id}`,).then(resp => resp.data);
}

//发布
export function publishActivity(id:string) {
    return axios.putWithToken(`/api/pm/services/activity/publish/${id}`).then(resp => resp.data);
}
//取消发布
export function unpublishActivity(id:string) {
    return axios.putWithToken(`/api/pm/services/activity/un-publish/${id}`).then(resp => resp.data);
}
