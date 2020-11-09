
import axios from '../app';


//组织数
export function getTree2(data:{
    level:string,
    rdId:string
}) {
    return axios.get(`/api/pm/family-archive/building/organization`,data);
}
export function getTree(level:string,id:string) {
    return axios.get(`/api/pm/family-archive/building/organization/detail/${level}`,{id:id});
}


//公摊规则列表
export function getApportionList(data:any) {
    return axios.get('/api/pm/payment/public-shared/rule',data);
}
//新增公摊规则
export function addApportion(data:any) {
    return axios.post('/api/pm/payment/public-shared/rule',data);
}
//修改公摊规则
export function editApportion(data:any) {
    return axios.put('/api/pm/payment/public-shared/rule',data);
}
//删除公摊规则
export function deleteApportion(data:any) {
    return axios.delete('/api/pm/payment/public-shared/rule',data);
}



//小区列表
export function getTree1() {
    return axios.get(`/api/pm/family-archive/building/organization/detail/${0}`);
}
//查询所有缴费项目
export function getProjectList(projectTypeCode:string,rdId:string) {
    return axios.get(`/api/pm/payment/project`,{name:'',projectTypeCode:projectTypeCode,rdId,apportionCode:1});
}
//查询缴费标准
export function getStandard(projectId) {
    return axios.get(`/api/pm/payment/standard/detail`,{projectId});
}

//字典菜单
export function getSelection(name) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name});
}


//查询公摊规则-已绑定的房间
export function getBindedRooms(data:{
    rdId:string,
    ruleId:string,
    hidden:boolean,
}) {
    return axios.get(`/api/pm/payment/public-shared/rule/room`,data);
}
//公摊规则绑定多个房间
export function bindSharedRooms(data:{
    rdId:string,
    ruleId:string,
},ids:Array<string>) {
    return axios.post(`/api/pm/payment/public-shared/rule/room/batch?rdId=${data.rdId}&ruleId=${data.ruleId}`,ids);
}

//公摊费用记录
export function getApportionrecord(data:{
    pageNum:number,
    pageSize:number,
    keyword?:string,
    rdId?:string,
    projectId?:string,
    sharedBillingStatusCode?:string,
    startTime?:string,
    endTime?:string,
}) {
    return axios.get(`/api/pm/payment/public-shared/fee`,data);
}


//新增公摊记录
export function addApportionrecord(data:any) {
    return axios.post(`/api/pm/payment/public-shared/fee`,data);
}

//删除公摊记录
export function deleteApportionrecord(ids:any) {
    return axios.delete(`/api/pm/payment/public-shared/fee`,ids);
}
//修改公摊记录
export function updateApportionrecord(data:any) {
    return axios.put(`/api/pm/payment/public-shared/fee`,data);
}
//修改公摊记录
export function getApportionrecordDetail(id:string) {
    return axios.get(`/api/pm/payment/public-shared/fee/${id}`);
}

//判断是否有人已经交费
export function judgeShared(id:string) {
    return axios.get(`/api/pm/payment/public-shared/fee/judge/${id}`);
}
//公摊结果列表
export function getResultList(data:{
    pageNum:number,
    pageSize:number,
    sharedFeeId:string,
    roomName?:string,
    sharedFeeStatus?:string
}) {
    return axios.get(`/api/pm/payment/public-shared/fee/detail/page`,data);
}
//公摊结果列表
export function resetResult(id:string, sharedMoney:number,) {
    return axios.put(`/api/pm/payment/public-shared/fee/detail/reset-fee?id=${id}&sharedMoney=${sharedMoney}`);
}
//公摊计算
export function sharedCalc(id:string,bool:boolean) {
    return axios.post(`/api/pm/payment/public-shared/fee/${id}/cal?reCal=${bool}`);
}

//实际出账
export function sharedFact(data:{
    sharedFeeId:string,
    roomName?:string,
    sharedFeeStatus?:string
}) {
    return axios.get(`/api/pm/payment/public-shared/fee/detail`,data);
}
//生成账单
export function createAccount(id, payableDate:string,) {
    return axios.post(`/api/pm/payment/public-shared/fee/${id}/bill?payableDate=${payableDate}`);
}
