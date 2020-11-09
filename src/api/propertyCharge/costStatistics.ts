import myaxios from "../../axios";
import {AxiosBasicCredentials} from "axios";
let axios1 = new myaxios();
import axios from '../app'

//小区列表
export function getTree1() {
    return axios.get(`/api/pm/family-archive/building/organization/detail/${0}`);
}

//根据名字查询
export function getInfoByName(name:string) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name:name});
}


//
export function getCostList(data:{
    rdId?:string,
    startTime?:string,
    endTime?:string
    pageNum:number|string,
    pageSize:number|string,
}) {
    return axios1.get(`/api/pm/payment/fee/statistic/building`,data);
}
