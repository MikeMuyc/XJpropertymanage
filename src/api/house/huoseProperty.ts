import axios from '../app';

//组织树
export function getTree() {
    return axios.get(`api/pm/family-archive/building/organization`,{level:'0'});
}

//根据名字查询
export function getInfoByName(name:string) {
    return axios.get(`/api/pm/family-archive/common/dict/name_item`,{name:name});
}

//查询房间信息
export function getRoomInfo(
    pageNum:string|number,
    pageSize:string|number,
    rdId:string,
    buildingId:string,
    deleted:string,
    buildAreaStart:string,
    buildAreaEnd:string,
    keyWords:string,
    roomStatus:string,
    towardsCode:string,
    unitId:string
) {
    return axios.get(`/api/pm/family-archive/room/`,{
        pageNum:pageNum,
        pageSize:pageSize,
        rdId:rdId,
        buildingId:buildingId,
        deleted:deleted,
        buildAreaStart:buildAreaStart,
        buildAreaEnd:buildAreaEnd,
        keyWords:keyWords,
        roomStatus:roomStatus,
        towardsCode:towardsCode,
        unitId:unitId
    })
}

//新增房间信息
export function addRoomInfo(object) {
    return axios.post(`/api/pm/family-archive/room/`,object)
}

//查询房间详细信息
export function getRoomInfoById(id) {
    return axios.get('/api/pm/family-archive/room/Info',{id:id})
}

//修改房间信息
export function updateRoomInfo(object) {
    return axios.put(`/api/pm/family-archive/room/`,object)
}

//删除房间信息
export function deleteRoomInfo(ids) {
    return axios.delete(`/api/pm/family-archive/room/`,ids)
}
//导出房间信息
export function exportRoomInfo(rdId:string) {
    return axios.get(`/api/pm/family-archive/room/exportRoom`,{rdId})
}

//查询小区详细信息
export function getRdInfoById(rdId) {
    return axios.get('/api/pm/family-archive/rd/Info',{id:rdId})
}

//查询小区列表
export function getRd(pageNum,pageSize) {
    return axios.get(`/api/pm/family-archive/rd/page`,{pageNum,pageSize})
}

//添加小区
export function addrd(object) {
    return axios.post(`/api/pm/family-archive/rd/`,object)
}

//删除小区
export function deleteRd(ids) {
    return axios.delete(`/api/pm/family-archive/rd/`,ids)
}

//修改小区信息
export function updateRdInfo(object) {
    return axios.put(`/api/pm/family-archive/rd/`,object)
}

//查询单元
export function getUnitInfo(id) {
    return axios.get(`/api/pm/family-archive/unit/`,{buildingId:id})
}

//查询楼栋
export function getBuildingInfo(rdId:string,pageNum:string|number,pageSize:string|number,keyWords?:string) {
    return axios.get(`/api/pm/family-archive/building/page`,{rdId,pageNum,pageSize,keyWords})
}

//添加单个楼栋
export function addOneBuilding(object) {
    return axios.post(`/api/pm/family-archive/building/`,object)
}

//批量添加楼栋
export function addSomeBuilding(object) {
    return axios.post(`/api/pm/family-archive/building/batch`,object)
}
//删除楼栋
export function deleteBuildingInfo(ids) {
    return axios.delete(`/api/pm/family-archive/building/`,ids)
}
//修改楼栋信息
export function updateBuildingInfo(object) {
    return axios.put(`/api/pm/family-archive/building/`,object)
}

//查询楼栋详细信息
export function getBuildingInfoById(id) {
    return axios.get(`/api/pm/family-archive/building/Info`,{id})
}
//房间代码唯一性
export function getRoomName(name,rdId) {
    return axios.get(`/api/pm/family-archive/room/names`,{name,rdId})
}
//小区名称或代码唯一性
export function getRdBycolumn(column,value) {
    return axios.get(`/api/pm/family-archive/rd/bycolumn`,{column,value})
}
//查询所有的楼层
export function getFloor(buildingId,unitId) {
    return axios.get(`/api/pm/family-archive/floor/`,{buildingId,unitId})
}
//楼号、楼栋代码唯一性
export function getBuildingNames(code,name,rdId) {
    return axios.get(`/api/pm/family-archive/building/names`,{code,name,rdId})
}

//批量新增临时房间信息
export function  addSomeHouseTemp(object) {
    return axios.post(`/api/pm/family-archive/room/temporary/add/batch`,object)
}
//查询临时房间列表
export function getTempHouseList(
    buildingId:string,
    rdId:string,
    unitIds:string
) {
    return axios.get(`/api/pm/family-archive/room/temporary/list`,{
        buildingId,
        rdId,
        unitIds
    })
}
//删除预览信息
export function deletePreInfo(ids) {
    return axios.delete(`/api/pm/family-archive/room/temporary`,ids)
}
//查询楼
export function getBuildingList(rdId) {
    return axios.get(`/api/pm/family-archive/building/`,{rdId})
}

//确认生成临时房间
export function addSomeHouse(ids) {
    return axios.post(`/api/pm/family-archive/room/temporary/add/room`,ids)
}
//修改临时房间信息
export function updatehouseInfo(object) {
    return axios.put(`/api/pm/family-archive/room/temporary`,object)
}
//查询房间详细信息
export function getHouseInfoById(id) {
    return axios.get(`/api/pm/family-archive/room/temporary/Info`,{id})
}
