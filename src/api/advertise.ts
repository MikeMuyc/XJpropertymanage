import myaxios from "@manage/axios";
// import axios from './app';
let axios = new myaxios();

//字典菜单
export function getSelection(code:string) {
    return axios.getWithToken(`/rest/realty/common/dictionary/${code}`).then(resp => resp.data);
}



//获取广告列表
export function getAdvertisementList(obj:{
    pageNum:number,
    pageSize:number,

    key?:string,
    adPublishState?:string,
    expired?:string,
}) {
    return axios.get(`/rest/realty/ad/info/page`,obj).then(resp => resp.data);
}

//新增广告 /rest/realty/ad/info
export function addAdvertisement(obj:any) {
    return axios.post(`/rest/realty/ad/info`,obj).then(resp => resp.data);
}
//删除广告
export function deleteAdvertisement(ids:any) {
    return axios.delete(`/rest/realty/ad/info`,ids).then(resp => resp.data);
}
// 发布/取消发布  /rest/realty/ad/info/top/{id}
export function advertisementpublish(id:string) {
    return axios.get(`/rest/realty/ad/info/publish/${id}`).then(resp => resp.data);
}
//广告详情
export function getAdvertisementDetail(id:string) {
    return axios.get(`/rest/realty/ad/info/${id}`).then(resp => resp.data);
}
//修改广告信息
export function editAdvertisement(obj:any) {
    return axios.put(`/rest/realty/ad/info`,obj).then(resp => resp.data);
}

//新增广告内容
export function addadvertisement2(obj:any) {
    return axios.post(`/rest/realty/ad/content`,obj).then(resp => resp.data);
}
//修改广告内容
export function editadvertisement2(obj:any) {
    return axios.put(`/rest/realty/ad/content`,obj).then(resp => resp.data);
}
