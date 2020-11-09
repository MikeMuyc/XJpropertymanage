import qs from 'qs';

import axios from '../app';

//组织树
export function getTree() {
    return axios.get(`/api/pm/family-archive/rd/packingLot`)
}
//根据名字查询
export function getInfoByName(name:string) {
    return axios.get(`/api/pm/payment/common/dict/name_item`,{name:name});
}
//查询车位列表信息-分页
export function getParkingSpaceList(
    pageNum:string,
    pageSize:string,
    parkingId:string,
    areaStart:string,
    areaEnd:string,
    typeCode:string,
    statusCode:string,
    keyWords:string
) {
    return axios.get(`/api/pm/family-archive/packingSpace/`,{
        pageNum,
        pageSize,
        parkingId,
        areaStart,
        areaEnd,
        typeCode,
        statusCode,
        keyWords
    })
}
//查询车位列表信息
export function getPackSpaceListNoPage(parkingId,code) {
    return axios.get('/api/pm/family-archive/packingSpace/list',{parkingId,code})
}

//添加车位
export function addIdleParkSpaceInfo(object) {
    return axios.post(`/api/pm/family-archive/packingSpace/add`,object)
}

//编辑车位信息
export  function updateParkSpaceInfo(object) {
    return axios.put(`/api/pm/family-archive/packingSpace/`,object)
}

//删除车位信息
export  function deleteParkSpaceInfo(ids) {
    return axios.delete(`/api/pm/family-archive/packingSpace/`,ids)
}
//查询车位详细信息
export function getParkSpaceById(id) {
    return axios.get(`/api/pm/family-archive/packingSpace/Info`,{id})
}
//查询车位详细信息-车
export function getParkSpaceCar(id) {
    return axios.get(`/api/pm/family-archive/packingSpace/Info/car`,{id})
}
//查询业主姓名列表
export function getPersonNameList(rdId) {
    return axios.get(`/api/pm/family-archive/proprietor/prName`,{rdId})
}

//查询停车场信息，分页
export  function getParkListInfo(pageNo,pageSize,rdId,keyword) {
    return axios.get(`/api/pm/family-archive/packingLot/page`,{
        pageNo,pageSize,rdId,keyword
    })
}

//查询停车场详细信息
export function getParkingDetialInfo(id) {
    return axios.get(`/api/pm/family-archive/packingLot/Info`,{id})
}

//添加停车场
export function addParking(object) {
    return axios.post(`/api/pm/family-archive/packingLot/`,object)
}
//编辑停车场信息
export  function updateParkingInfo(object) {
    return axios.put(`/api/pm/family-archive/packingLot/`,object)
}

//删除停车场信息
export  function deleteParkingInfo(ids) {
    return axios.delete(`/api/pm/family-archive/packingLot/`,ids)
}

//车位编号唯一性
export function getPackingSpaceByCode(code,parkingId,rdId) {
    return axios.get(`/api/pm/family-archive/packingSpace/byCode`,{code,parkingId,rdId})
}

//批量新增临时车位信息
export function addSomeParkSpaceTemp(object) {
    return axios.post(`/api/pm/family-archive/packingSpace/temporary/add/batch`,object)
}
//查询临时车位列表信息
export  function getSomeParkSpaceListTemp(parkingId) {
    return axios.get(`/api/pm/family-archive/packingSpace/temporary/list`,{parkingId})
}
//删除临时车位信息
export  function deleteParkSpaceTemp(ids) {
    return axios.delete(`/api/pm/family-archive/packingSpace/temporary`,ids)
}
//修改临时车位信息
export function updateParkSpaceTemp(object) {
    return axios.put(`/api/pm/family-archive/packingSpace/temporary`,object)
}
//查询临时车位详细信息
export function getParkSpaceTempById(id) {
    return axios.get(`/api/pm/family-archive/packingSpace/temporary/Info`,{id})
}

export function addSomeParkSapce(ids) {
    return axios.post(`/api/pm/family-archive/packingSpace/temporary/add/packingSpace`,ids)
}

//停车场名称,代码唯一
export  function getUnique(code,name,rdId) {
    return axios.get(`/api/pm/family-archive/packingLot/unique`,{code,name,rdId})
}
//查询停车场信息
export  function getParkInfo(rdId) {
    return axios.get(`/api/pm/family-archive/packingLot/`,{
       rdId
    })
}

//查询业主姓名列表
export function getPrName(rdId,name) {
    return axios.get(`/api/pm/family-archive/proprietor/prName`,{rdId,name})
}
//使用登记
export function registration(object) {
    return axios.post(`/api/pm/family-archive/packingSpace/registration`,object)
}
