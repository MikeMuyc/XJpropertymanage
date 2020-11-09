import ECharts from '@/components/ECharts.vue';
import topBar from '@/components/topBar.vue';

import {Message} from "element-ui";


//通用方法集合
const utils: any = {
    //时间戳转换成自定义字符串
    dateFormat: (timeStamp: number, type: string): any => {
        if (timeStamp) {
            let date = new Date();
            date.setTime(timeStamp);
            let y = date.getFullYear();
            let m: any = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            let d: any = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            if (type === `date`) {
                return y + '-' + m + '-' + d;
            } else if (type === `time`) {
                let h: any = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let minute: any = date.getMinutes();
                let second: any = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
            } else {
                return '-'
            }
        } else {
            return '-'
        }
    },

    dateToTimestamp: (date: string): any => {
        if (date) {
            if (date.length > 0) {
                let str: string = date.substring(0, 19);
                str.replace(/-/g, '/');
                str.replace(/./g, '/');
                return new Date(str).getTime();
            }
        } else {
            return null
        }
    },
    //文件大小转换   B=> GB/MB
    changeSize: (fileSize: any): any => {
        let size: number = parseInt(fileSize);
        if (size) {
            return size > 1024
                ? size / 1024 > 1024
                    ? size / (1024 * 1024) > 1024
                        ? (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
                        : (size / (1024 * 1024)).toFixed(2) + 'MB'
                    : (size / 1024).toFixed(2) + 'KB'
                : (size).toFixed(2) + 'B'
        }
    },
    //获取上传图片的缓存路径
    getBlobUrl: (file: any): any => {
        let url = null;
        if (window.URL) {
            url = window.URL.createObjectURL(file);
        }
        return url
    },
    //深拷贝
    deepCopy: (obj: any): any => {
        return JSON.parse(JSON.stringify(obj));
    },

    //必填项不为空的验证
    isntNull: (data: any, name: any) => {
        /*
        * data 为数据源
        * name 为数据源对应每一项的名称，例如：
        * {
        *       "presonBasicInfo.name": `姓名`,
        *       "address": `地址`,
        * }
        * */
        if (Array.isArray(data)) {
            let flag = false;
            for (let i = 0; i < data.length; i++) {
                if (!content(data[i], name[i])) {
                    break;
                }
            }
            return flag
        } else if (typeof data === 'object') {
            let flag = true;
            for (let key in name) {

                if (eval(`data.${key}`) !== undefined) {
                    if (!content(eval(`data.${key}`), name[key])) {
                        flag = false;
                        break;
                    }
                }
            }
            /* for (let key in data) {
                 if (name[key]) {
                     if (!content(data[key], name[key])) {
                         flag = false;
                         break;
                     }
                 }
             }*/
            return flag
        } else if (typeof data === 'string') {
            return content(data, name);
        }

        function content(obj, objName) {
            if (obj === '' || obj === null || obj === undefined) {
                Message({
                    showClose: true,
                    message: `${objName}不能为空！`,
                    type: 'warning'
                })
                return false
            } else {
                return true
            }
        }
    },


    //手机号码验证（2019）
    phoneLimit(phone) {
        let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
        return reg.test(phone);
    },

    //身份证校验（15/18位）
    idCardLimit(id: string) {
        let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ || /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
        return reg.test(id);
    },
    //正整数限制（含0）
    intLimit(value: any) {
        if (value === '') {
            return ''
        } else if (Math.floor(value) >= 0) {
            return Math.floor(value)
        } else {
            return false
        }
    },
    //正数限制（含0）
    floatLimit(value: any) {
        if (value === '') {
            return ''
        } else if (Number(value) >= 0) {
            return Number(value)
        } else {
            return false
        }
    }
}


//地图类
class Map {
    map: any;

    constructor(common?: any) { //constructor是一个构造方法，用来接收参数
        if (common) {
            Object.assign(this, common);
        } else {
            Object.assign(this, utils.deepCopy((<any>window).mapConfig));
        }
    }

    setCenter(coords: any, projection: any) {
        if (coords instanceof Array) {
            this.map.view.center.coord = [parseFloat(coords[0]), parseFloat(coords[1])];
        }
        if (projection) {
            this.map.view.center.projection = projection;
        }
    }

    setZoom(zoom: any) {
        if (zoom) {
            this.map.view.zoom = zoom;
        }
    }

    setCenterZoom(coords: any, zoom: any, projection: any) {
        this.setCenter(coords, projection);
        this.setZoom(zoom);
    }
}

export default {
    install: (Vue: any, options: any) => {


        //echarts的vue组件
        Vue.component('v-chart', ECharts);
        Vue.component('topBar', topBar);

        //将方法集添加到Vue实例上面去
        Vue.prototype.$utils = utils;
        //返回地图对象
        Vue.prototype.$getMapConfig = function (common?: any) {
            return new Map(common);
        }

        Vue.prototype.$upBaseUrl = function () {
            return (<any>window).upBaseUrl;
        }
        Vue.prototype.$imgDownUrl = function () {
            return (<any>window).imgDownUrl;
        }
        //点击该元素以外的部分触发的事件
        Vue.directive('clickoutside', {
            bind: function (
                el: {
                    contains: (arg0: any) => void;
                    _vueClickOutside_: (e: any) => false | undefined;
                },
                binding: {
                    expression: any;
                    value: (arg0: any) => void;
                }) {
                function documentHandler(e: { target: any; }) {
                    // @ts-ignore
                    if (el.contains(e.target)) {
                        return false;
                    }
                    if (binding.expression) {
                        binding.value(e)
                    }
                }

                // @ts-ignore
                el._vueClickOutside_ = documentHandler;
                document.addEventListener('click', documentHandler);
            },
            unbind: function (el: { _vueClickOutside_: (this: Document, ev: MouseEvent) => any; }) {
                document.removeEventListener('click', el._vueClickOutside_);
                delete el._vueClickOutside_;
            }
        });

        //判断权限
        /*Vue.directive('authox', {
            bind: (el: { getAttribute: (arg0: string) => string; setAttribute: { (arg0: string, arg1: string): void; (arg0: string, arg1: string): void; (arg0: string, arg1: any): void; }; }, binding: { value: any; }, vnode: any, oldVnode: any) => {
                let className = el.getAttribute("class") || '';
                if (className) {
                    el.setAttribute("class", className + ` authoxHidden`);
                } else {
                    el.setAttribute("class", `authoxHidden`);
                }
                /!* authoxCheck(binding.value).then(() => {
                     className = className.replace("authoxHidden", "");

                     el.setAttribute("class", className);
                 }).catch(() => {});*!/
            }
        })*/
    }
}
