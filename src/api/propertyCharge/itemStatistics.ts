import myaxios from "../../axios";
import {AxiosBasicCredentials} from "axios";
let axios = new myaxios();

//收营列表查询
export function getCashlist(data:{
    pageNum:number|string,
    pageSize:number|string,
    startTime?:string,
    endTime?:string,
    createPerson?:string,
    payTypeCode?:string,
    roomId?:string,
    roomName?:string,
}) {
    return axios.get('/api/pm/payment/fee/cashier',data);
}

//收营总额
export function getCashTotal(data:{
    pageNum:number|string,
    pageSize:number|string,
    startTime?:string,
    endTime?:string,
    createPerson?:string,
    payTypeCode?:string,
    roomId?:string,
    roomName?:string,
}) {
    return axios.get('/api/pm/payment/fee/cashier/total-ap',data);
}
//根据名字查询
export function getInfoByName(name:string) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name:name});
}
