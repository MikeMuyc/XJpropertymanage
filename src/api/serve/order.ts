import myaxios from "@manage/axios";
import axios from '../app';
let axios1 = new myaxios('./api');
import realaxios from 'axios'

//字典菜单
export function getSelection(code:string) {
    return axios.getWithToken(`/rest/realty/common/dictionary/${code}`).then(resp => resp.data);
}



//维修工单列表
export function getOrderList(obj:{
    pageNum:number,
    pageSize:number,

    placeType?: string,
    orderState?: string,
    key?: string,
    startTime?: string,
    endTime?: string,
}) {
    return axios.getWithToken(`/rest/realty/order/info`,obj).then(resp => resp.data);
}
//新增工单
export function addOrder(obj:any) {
    return axios.postWithToken(`/rest/realty/order/info`,obj).then(resp => resp.data);
}
//删除工单
export function deleteOrder(ids:Array<any>) {
    return axios.deleteWithToken(`/rest/realty/order/info`,ids).then(resp => resp.data);
}
//工单详情
export function getOrderDetail(id:string) {
    return axios.getWithToken(`/rest/realty/order/info/${id}`).then(resp => resp.data);
}

//添加工单服务评价
export function addOrderServer(obj:{
    serverStar:string|number,
    remark:string,
    orderId:string,
}) {
    return axios.postWithToken(`/rest/realty/order/evaluation`,obj).then(resp => resp.data);
}
