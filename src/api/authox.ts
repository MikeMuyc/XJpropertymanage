import myaxios from "@manage/axios";
import axios from './app';
let axios1 = new myaxios('./api');
let axios2 = new myaxios('./apbb');

//字典菜单
export function getSelection(name) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name});
}

//用户审核列表
export function getAuditList(object:{
    pageNum:number,
    pageSize:number,
    authentication?:string,
    relationCode?:string,
    tel?:string,
}) {
    return axios1.get(`/api/pm/user/info/audit`,object).then(resp => resp.data)
}
//用户审核统计信息
export function getAuditStatistic(object:{

    authentication?:string,
    relationCode?:string,
    tel?:string,
}) {
    return axios1.get(`/api/pm/user/info/audit/statistic`,object).then(resp => resp.data)
}
//提交审核结果
export function sendAudit(
    fd:any
) {
    return axios1.post(`/api/pm/user/info/room/approved`,fd).then(resp => resp.data)
}
//历史审核记录列表
export function getAuditHisList(object:{
    pageNum:number,
    pageSize:number,
    authentication?:string,
    relationCode?:string,
    tel?:string,
}) {
    return axios1.get(`/api/pm/user/info/room/auth`,object).then(resp => resp.data)
}


//部门树
export function getDepartmentTree() {
    return axios.get(`/api/pm/user/department/tree`).then(resp => resp.data)
}
//小区下拉
export function getRdTree(level?:string|number,rdId?:string) {
    return axios.get(`/api/pm/payment/project/rd`,{level,rdId}).then(resp => resp.data);
}

//查询部门下的人员
export function getUserList(departmentId:string|number,keyword?:string) {
    return axios.get(`/api/pm/user/info/byDepartmentId`,{departmentId,keyword}).then(resp => resp.data);
}
//新增用户
export function addUser(obj:any) {
    return axios.post(`/api/pm/user/info/web`,obj).then(resp => resp.data);
}
//修改用户
export function editUser(obj:any) {
    return axios.put(`/api/pm/user/info/web`,obj).then(resp => resp.data);
}
//查询用户
export function getUserDetail(id:any) {
    return axios.get(`/api/pm/user/info/${id}`).then(resp => resp.data);
}

//删除用户
export function deleteUser(ids:any) {
    return axios.delete(`/api/pm/user/info`,ids).then(resp => resp.data);
}

//新增部门
export function addPartments(pid:string,obj:any) {
    return axios.post(`/api/pm/user/department?pid=${pid}`,obj).then(resp => resp.data);
}
//修改部门信息
export function editPartments(obj:any) {
    return axios.put(`/api/pm/user/department`,obj).then(resp => resp.data);
}
//删除部门
export function deletePartments(ids:Array<string>) {
    return axios.delete(`/api/pm/user/department`,ids).then(resp => resp.data);
}

//获取角色列表
export function getRolelist() {
    return axios.get(`/rest/authox/roles`).then(resp => resp.data);
}

//给指定用户重置密码
export function resetPassword(id:string) {
    return axios.get(`/api/pm/user/info/web/resetPwd`,{id}).then(resp => resp.data);
}
