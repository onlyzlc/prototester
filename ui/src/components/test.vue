<template>
    <div class="test">
        <div class="one">
            <ln-popconfirm direction='auto'></ln-popconfirm>
        </div>
        <div class="two">
            <ln-popconfirm direction='auto'></ln-popconfirm>
        </div>
        <div class="three">
            <ln-popconfirm direction='auto'></ln-popconfirm>
        </div>
    </div>
</template>

<script>
import LnPopconfirm from "./Ln-Popconfirm"
export default {
    components: {
        LnPopconfirm
    }
}
</script>

<style>
.test>div{
    position:absolute
}
.one{
    top: 20px;
    right: 20px;
}
.two{
    top: 20px;
    left: 20px;
}
.three{
    bottom: 20px;
    left: 20px;
}
</style>