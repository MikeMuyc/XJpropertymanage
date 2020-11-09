<template>
    <div class="singleBOX" v-clickoutside="handleClose" :class="{active:showflag}">
        <div class="valuebox" @click="showTs" :title="labelText">
            <em v-if="checkedList.length===0" :class="{active:labelText!== placeholder}">{{labelText}}</em>
            <div class="curBox" v-for="item in checkedList" :key="item[valueName]">
                {{item[labelName]}}
            </div>
        </div>
        <div class="selIcon" @click="showTs" :class="{active:showflag}">
            <slot name="selIcon">
                <i class="iconfont svgse" :class="selIconName"></i>
            </slot>
        </div>
        <transition name="slfade">
            <div class="tSelect" ref="tSelect" v-if="showflag">
                <vue-perfect-scrollbar ref="tScroll" :style="{height:theight}" :settings="{wheelPropagation:false,minScrollbarLength:18}">
                    <div class="tLine" v-for="(item,index) in selectList" :key="item[valueName]" @mouseenter="Titem = item" @mouseleave="mouseEnter(item)">
                        <div v-if="item[labelName]" class="tLabel" :class="{checked:isChecked(item)}" @click="sentVal(item)">
                            {{item[labelName] || item}}
                        </div>

                        <div class="rowIcon" v-if="item[childrenName] && item[childrenName].length>0">
                            <slot name="rowIcon">
                                <i class="iconfont" :class="rowIconName"></i>
                            </slot>
                        </div>
                        <div class="rowIcon" v-if="isChecked(item)">
                            <i class="iconfont iconcheck" ></i>
                        </div>
                    </div>
                </vue-perfect-scrollbar>
                <transition name="tfade">
                    <div class="tSelect" ref="tSelect" v-if="Titem[childrenName]">
                        <vue-perfect-scrollbar ref="tScroll" style="height:216px;}" :settings="{wheelPropagation:false,minScrollbarLength:18}">
                            <div class="tLine" v-for="item1 in Titem[childrenName]" :key="item1[valueName]" >
                                <div v-if="item1[labelName]" class="tLabel" :class="{checked:isChecked(item1)}" @click="sentVal2(Titem[valueName],item1)">
                                    {{item1[labelName] || item1}}
                                </div>

                                <div class="rowIcon" v-if="item1[childrenName] && item1[childrenName].length>0">
                                    <slot name="rowIcon">
                                        <i class="iconfont" :class="rowIconName"></i>
                                    </slot>
                                </div>
                                <div class="rowIcon" v-if="isChecked(item1)">
                                    <i class="iconfont iconcheck" ></i>
                                </div>
                            </div>
                        </vue-perfect-scrollbar>
                    </div>
                </transition>
            </div>
        </transition>

    </div>
</template>

<script>
    export default {
        name: "mixSelect",

        model: {
            prop: 'value',
            event:`sentTo`,
        },
        props:{
            //双向绑定的值
            value:{},

            //选项名称的key
            labelName:{
                type:String,
                default:`name`,
            },
            //选项值的key
            valueName:{
                type:String,
                default:`value`,
            },
            //选项子集的key
            childrenName:{
                type:String,
                default:`children`,
            },
            //菜单列表
            selectList:{
                required: true,
                type:Array,
                default:function () {
                    return [
                        /*{
                            name:'',
                            value:'',
                            children:[]
                        }*/
                    ]
                },
            },


            //视图内允许出现的最大项数
            maxViewItem:{
                type:Number,
                default:6,
            },

            //类似于原生placeholder
            placeholder:{
                type:String,
                default:'请选择',
            },

            //iconfont箭头图标的名称
            selIconName:{
                type:String,
                default:'iconzhankai1',
            },
            rowIconName:{
                type:String,
                default:'iconjiantou1',
            },
            checkedItems:{
                type:Array,
                default:function () {
                    return []
                },
            }
        },
        data() {
            return {
                //控制菜单栏的显示
                showflag:false,
                //控制placeholder的显示
                placeFlag:true,

                labelText:``,

                list:[],

                checkedList:[],
                theight:'',
                Titem:{},
                childrenCode:'000000000000',
            }
        },
        computed:{

        },
        watch:{

            selectList:function () {
                this.setSelectList();
                this.setValue();
            },

            value:function () {
                this.setValue();
            },
            checkedItems:function () {
                this.checkedList = this.checkedItems;
            },
        },
        mounted(){
            this.init();
            if(this.selectList.length>this.maxViewItem){
                this.theight = 36*this.maxViewItem + `px`;
            }
        },
        methods: {
            init(){
                this.setSelectList();
                this.setValue();
                if( this.checkedItems ){
                    this.checkedList = this.checkedItems;
                }
            },
            setValue(){
                let val = this.value;
                if( val === null || val === undefined){
                    this.labelText = this.placeholder;
                }
                else{
                    this.findLabel(this.list,val);
                    this.setplace();
                }

            },
            setSelectList(){
                this.list = JSON.parse(JSON.stringify(this.selectList));
            },
            setplace(){
                if(this.placeFlag){
                    this.labelText = this.placeholder;
                    this.checkedList = [];
                }
            },
            findLabel(arr, val) {
                let vm = this;
                let bool = true;
                arr.forEach(item =>{
                    if(item[vm.valueName] !== null && item[vm.valueName] !== undefined){
                        if(item[vm.valueName] === val){
                            vm.labelText = item[vm.labelName];
                            bool = false;
                        }
                        else if(item[vm.childrenName]){
                            vm.findLabel(item[vm.childrenName],val)
                        }
                    }
                    else if(item[vm.childrenName]){
                        vm.findLabel(item[vm.childrenName],val)
                    }
                })

                this.placeFlag = bool&&val==='' ? bool : false;
            },
            handleClose(){
                this.showflag = false;
            },
            showTs(){
                if(this.selectList.length>0 ){
                    this.showflag = !this.showflag
                }
            },

            isChecked(item){
                let isIndex = this.checkedList.findIndex(item1 => item1 === item);
                return isIndex > -1
            },

            mouseEnter(item){
                this.Titem = item;
            },
            sentVal(item){
                this.checkedList = [];
                if(item[this.valueName] !== undefined){
                    if(item[this.childrenName]){
                        if(item[this.childrenName].length===0){
                            this.$emit(`sentTo`,item[this.valueName]);
                            this.$emit(`sentCode`,'');
                        }
                    }
                    else{
                        this.$emit(`sentTo`,item[this.valueName]);
                        this.$emit(`sentCode`,'');
                    }
                }
                if(!item.children && !item.xcode){
                    this.handleClose();
                }
            },
            sentVal2(id,data){
                this.labelText = this.placeholder;
                let isIndex = this.checkedList.findIndex(item => item === data);
                if(isIndex > -1){
                    this.checkedList.splice(isIndex,1)
                }
                else{
                    this.checkedList.push(data);
                }
                this.childrenCode = '000000000000';
                let newArr = this.childrenCode.split('');
                this.checkedList.forEach(item =>{
                    newArr[item.xcode] = '1';
                })
                this.$emit(`sentTo`,id);
                this.$emit(`sentCode`,newArr.join().replace(/,/g,''));
            },
        },

    }
</script>

<style lang="scss" scoped>
    @import "../../../styles/standard-global";
    $border-color:#3a7ef3;
    $white-color:#fff;
    $theme-color:#e5f0ff;
    $theme-color-active:#C3D8FB;
    .singleBOX{
        background-color: #fff;
        width: 100%;
        min-height: 36px;
        border: 1px solid #dde4eb;
        position: relative;
        display: inline-flex;
        align-items: center;
        border-radius: 4px;
    }
    .valuebox{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        padding: 5px 30px 0 10px;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        >em{
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:$third-font-color;
            font-style: normal;
            margin-bottom: 5px;
            line-height: 24px;
            height: 24px;
            &.active{
                color: #333;
            }
        }
        .curBox{
            padding: 0 4px;
            height: 24px;
            display: inline-flex;
            background-color: #f4f6f9;
            border-radius: 2px;
            border: solid 1px #dde4eb;
            margin: 0 5px 5px 0;
        }
    }
    .singleBOX.active{
        border-color: $border-color;
        box-shadow: 0px 0px 3px 0px
        rgba(58, 126, 243, 0.6);
    }


    .selIcon{
        position: absolute;
        top: 0;
        right: 0;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 36px;
        width: 30px;
        overflow: hidden;
        transition: all 0.3s;
        cursor: pointer;
    }
    .selIcon.active{
        transform-origin: center center 0;
        transform: rotate(180deg);
    }
    .svgse{
        width: 12px;
        height: 12px;
        font-size: 12px;
        line-height: 1;
        color: #999;
    }
    .selIcon.active .svgse{
        color: $border-color;
    }
    .singleBOX>.tSelect{
        transform-origin: center top 0;
        top: calc(100% + 10px);
        left: 0;
        min-width: 100%;
    }
    /*过渡动画*/
    .slfade-enter-active,.slfade-leave-active {
        transition: all .3s;
        transform-origin: center top 0;
        transform: rotateX(0deg);
    }

    .slfade-enter,.slfade-leave-to{
        opacity: 0;
        transform: rotateX(90deg);
        transform-origin: center top 0;
    }

    .tSelect {
        z-index: 99;
        position: absolute;
        top: 0;
        left:calc(100% + 10px);
        margin-bottom: 20px;
        background: #fff;
        box-shadow: 0px 1px 4px 0px rgba(183, 183, 183, 0.6);
        border-radius: 4px;
        transform-origin: center top 0;
        .tLine{
            position: relative;
            &:hover{
                >.tLabel{
                    background-color: $theme-color;
                }

            }
            .tLabel{
                padding: 10px 30px 10px 10px;
                height: 36px;
                display:flex;
                align-items: center;
                user-select: none;
                cursor: pointer;
                white-space: nowrap;
                &:active{
                    background-color:$theme-color-active;
                }
                &.checked{
                    color: #3a7ef3;
                }
            }
        }
        .rowIcon{
            position: absolute;
            right: 6px;
            top: 0;
            width: 16px;
            height: 100%;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            >.iconfont{
                font-size: 10px;
            }
        }
    }
    .iconcheck{
        color: #3a7ef3;
    }
</style>
