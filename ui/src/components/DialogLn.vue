<template>
    <div class="dialog_container" v-show="visibility">
        <div class="dialog_panel">
            <h3>{{title}}</h3>
            <div class="dialog_content">
                <slot></slot>
            </div>
            <div class="dialog_foot">
                <div class="left">
                    <slot name="foot_left"></slot>
                </div>
                <div class="right"> 
                    <slot name="foot_right">
                        <button @click="visibility=false">确定</button>
                        <button @click="visibility=false">取消</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        title:{
            type: String,
            default: "对话框"
        },
        visibility: {
            type: Boolean,
            default: true
        },
    }
}
</script>

<style scoped>
    .dialog_container{
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dialog_panel{
        padding: 20px ;
        min-width:300px;
        min-height: 200px;
        background-color: white;
        border-radius: 5px;
        display: flex;
        flex-flow: column;
    }
    .dialog_content {
        flex-grow: 1;
    }
    .dialog_panel h3{
        margin: 0;
    }
    .dialog_foot{
        display: flex;
        flex-flow: row;
    }

    .dialog_foot .left{
    flex-grow: 1;
    }
</style>