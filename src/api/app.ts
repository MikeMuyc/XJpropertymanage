import myaxios from "@manage/axios";
let axios = new myaxios('./apnn');

import {AxiosBasicCredentials} from "axios";
export default axios;
import realaxios from 'axios'
import Vue from 'vue'

//登录
export function login(data:AxiosBasicCredentials) {
    return axios.post('/api/waterloo/login',{withToken: false},data);
}
//登出
export function logout() {
    return axios.get('/api/waterloo/logout');
}
//获取当前用户的信息
export function getUserInfo() {
    return axios.get('/api/pm/user/info/current');
}

//上传图片至服务器，会返回一个图片在服务器上的访问地址
export function upImg(fd:any,baseUrl:string){
    return realaxios({
        method: 'post',
        url: baseUrl + `/easy/ud/upload/file`,
        data: fd,
        headers: {

        }
    })
}
