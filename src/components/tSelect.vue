<template>
    <div class="tSelect" ref="tSelect" >
        <vue-perfect-scrollbar ref="tScroll" :style="{height:theight}" :settings="{wheelPropagation:false,minScrollbarLength:18}">
            <div class="tLine" :class="{hover:hoverIndex === index}" v-for="(item,index) in arr" :key="item[valueName]">
                <div v-if="item[labelName]" class="tLabel" :class="{checked:isChecked(item)}" @mouseenter="mouseEnter(index,item)" @click="sentVal(item)">
                    {{item[labelName] || item}}
                </div>
                <div v-else class="tLabel" :class="{checked:isChecked(item)}" @mouseenter="mouseEnter(index,item)" @click="sentVal2(item)">
                    {{item}}
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
            <tSelect v-if="Titem[childrenName] && Titem[childrenName].length>0 && hoverIndex === Tindex" v-show="hoverIndex === Tindex" :arr="Titem[childrenName]" :style="{left:leftVal,top:topVal}" :labelName="labelName" :valueName="valueName" :childrenName="childrenName" :busName="busName" :rowIconName="rowIconName" :multiple="multiple" :checkedList="checkedList">
                <slot name="rowIcon" slot="rowIcon"></slot>
            </tSelect>
        </transition>
    </div>

</template>

<script>
    import bus from './eventBus'
    export default {
        name: "tSelect",
        props:{
            arr:{
                required: true,
                type:Array,
                default:function () {
                    return []
                },
            },
            labelName:{
                type:String,
                default:`name`,
            },
            valueName:{
                type:String,
                default:`value`,
            },
            childrenName:{
                type:String,
                default:`children`,
            },
            maxViewItem:{
                type:Number,
                default:6,
            },
            busName:{
                type:String,
            },
            rowIconName:{
                type:String,
                default:'iconjiantou1',
            },
            multiple:{
                type:Boolean,
                default:false,
            },
            checkedList:{
                type:Array,
                default:[],
            },
        },

        data() {
            return {
                hoverIndex:-1,
                leftVal:``,
                topVal:``,
                theight:'',
                Titem:{},
                Tindex:-1,
            }
        },
        watch:{
            arr:function () {
                if(this.arr.length>this.maxViewItem){
                    this.theight = 36*this.maxViewItem + `px`;
                }
                else{
                    this.theight = 36*this.arr.length + `px`;
                }
                setTimeout(()=>{
                    this.leftVal = this.$refs.tSelect.clientWidth + 5 + `px`;
                },100)
                this.hoverIndex = -1;
            },
            hoverIndex:function (val) {
                this.topVal = val*36 - this.$refs.tScroll.$el.scrollTop + `px`;
            }
        },
        mounted(){
            if(this.arr.length>this.maxViewItem){
                this.theight = 36*this.maxViewItem + `px`;
            }
            this.$nextTick(() => {
                this.leftVal = this.$refs.tSelect.clientWidth + 5 + `px`
            });
        },
        methods: {
            mouseEnter(index,item){
                this.hoverIndex = index;
                this.Titem = item;
                this.Tindex = index;
            },
            sentVal(item){
                if(item[this.valueName] !== undefined){
                    if(item[this.childrenName]){
                        if(item[this.childrenName].length===0){
                            bus.$emit(`${this.busName}`,item)
                        }
                    }
                    else{
                        bus.$emit(`${this.busName}`,item)
                    }
                }
            },
            sentVal2(item){
                bus.$emit(`${this.busName}2`,item)
            },

            isChecked(item){
                let isIndex = this.checkedList.findIndex(item1 => item1 === item);
                return isIndex > -1
            }
        },
    }
</script>

<style lang="scss" scoped>
    $white-color:#fff;
    $theme-color:#e5f0ff;
    $theme-color-active:#C3D8FB;
    .tSelect {
        z-index: 99;
        position: absolute;
        top: 0;
        margin-bottom: 20px;
        background: #fff;
        box-shadow: 0px 1px 4px 0px rgba(183, 183, 183, 0.6);
        border-radius: 4px;
        transform-origin: center top 0;
        .tLine{
            position: relative;
            &:hover,&.hover{
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

    /*进入离开过渡动画*/
    .tfade-enter-active {
        transition: all .3s;
        transform-origin: left center 0;
        transform: rotateY(0deg);
    }

    .tfade-leave-active {
        transition: all .3s;
        transform-origin: left center 0;
        transform: rotateY(0deg);
    }

    .tfade-enter{
        opacity: 0;
        transform: rotateY(90deg);
    }

    .tfade-leave-to {
        opacity: 0;
        transform: rotateY(90deg);
    }
    .iconcheck{
        color: #3a7ef3;
    }
</style>
