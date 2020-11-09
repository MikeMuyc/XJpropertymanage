import qs from 'qs';

import axios from '../app';


//组织数
export function getTree() {
    return axios.get(`api/pm/family-archive/building/organization`,{level:0});
}

//查询房间列表名称
export function getRoomNameList(rdId,buildingId) {
    return axios.get(`/api/pm/family-archive/room/roomList`,{rdId,buildingId})
}

//根据名字查询
export function getInfoByName(name) {
    return axios.get(`/api/pm/family-archive/common/dict/name_item`,{name:name});
}

//籍贯
export function getRegionTree() {
    return axios.get(`/api/pm/family-archive/personInfo/regionTree`)
}

//查询业主信息
export function getProprietorInfo(
    pageNum:string,
    pageSize:string,
    rdId:string,
    buildingId:string,
    startTime:string,
    endTime:string,
    keyWords:string,
    nprCode:string
) {
    return axios.get(`/api/pm/family-archive/proprietor/`,{
        pageNum:pageNum,
        pageSize:pageSize,
        rdId:rdId,
        buildingId:buildingId,
        startTime:startTime,
        endTime:endTime,
        keyWords:keyWords,
        nprCode:nprCode
    })
}

//导出业主信息
export function exportProprietorInfo() {
    return axios.get(`/api/pm/family-archive/proprietor/exportProprietor`)
}
//入伙登记
export function addProprietorInfo(object) {
    return axios.post(`/api/pm/family-archive/proprietor/`,object)
}

//户主变更
export function holdChange(object) {
    return axios.put(`/api/pm/family-archive/proprietor/changeProprietor`,object)
}

//删除业主信息
export function deleteProprietorInfo(ids) {
    return axios.delete(`/api/pm/family-archive/proprietor/`,ids)
}

//历史记录
export function getHistory(roomId) {
    return axios.get(`/api/pm/family-archive/proprietor/history`,{roomId})
}

//查询业主信息详情
export function getProprietorInfoDetial(id) {
    return axios.get(`/api/pm/family-archive/proprietor/Info`,{id})
}

//查询家庭成员
export function getFamilyMember(id) {
    return axios.get(`/api/pm/family-archive/familyMember/`,{proprietorId:id})

}
//修改业主信息
export function updateProprietorInfo(object) {
    return axios.put(`/api/pm/family-archive/proprietor/`,object)
}


//新增家庭成员
export function addMember(object) {
    return axios.post(`/api/pm/family-archive/familyMember/`,object)
}

//删除家庭成员
export function deleteFamillyInfo(ids) {
    return axios.delete(`/api/pm/family-archive/familyMember/`,ids)
}

//查询家庭成员详细信息
export function getFamilyInfoById(id) {
    return axios.get(`/api/pm/family-archive/familyMember/Info`,{id})
}

//修改家庭成员信息
export function updateFamilyInfo(object) {
    return axios.put(`/api/pm/family-archive/familyMember/`,object)
}

//查询停车场信息
export  function getParkListInfo(rdId) {
    return axios.get(`/api/pm/family-archive/packingLot/`,{rdId})
}
//查询车位列表信息
export function getParkSpaceList(parkingId,code) {
    return axios.get(`/api/pm/family-archive/packingSpace/list`,{parkingId,code})
}
//查询车位详细信息
export function getParkSpaceById(id) {
    return axios.get(`/api/pm/family-archive/packingSpace/Info`,{id})
}

//添加车位
export function addParkSpace(object) {
    return axios.post(`/api/pm/family-archive/packingSpace/add/proprietor`,object)
}
//删除车位信息
export  function deleteParkSpaceInfo(proprietorId,ids) {
    return axios.delete(`/api/pm/family-archive/packingSpace/del/relation?proprietorId=${proprietorId}`,ids)
}

//编辑车位信息
export function updateParkSpaceInfo(object) {
    return axios.post(`/api/pm/family-archive/packingSpace/update/proprietor`,object)
}

//查询车位详细信息
export function getParkSpaceInfoById(id) {
    return axios.get(`/api/pm/family-archive/packingSpace/Info/car`,{id})
}

//某建筑物入伙登记
export function getGangInfoInBuilding(id) {
    return axios.get(`/api/pm/family-archive/building/number`,{id})
}
//查询楼栋
export function getBuildingList(rdId) {
    return axios.get(`/api/pm/family-archive/building/`,{rdId})
}
