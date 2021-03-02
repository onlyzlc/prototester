<template>
  <div
    class="popConfirm"
    :style="popConfirmStyle"
  >
    <div
      class="trigger"
      @click="onClickTrigger"
    >
      <slot />
    </div>
    <div
      v-show="showPopup"
      ref="popup"
      class="popup"
      :style="{visibility:visPopup}"
      @mouseup.stop
    >
      <p>{{ txtTip }}</p>
      <p>
        <button @click="onClickBtnL">
          {{ txtBtnL }}
        </button><button @click="onClickBtnR">
          {{ txtBtnR }}
        </button>
      </p>
    </div>
  </div>
</template>

<script>
// 显示的象限方位(传入值) <-> flex-direction属性 映射
// 如果设为 auto, 则会在显示弹框时动态监测弹框是否飘出窗口, 若有则自动切换到合适的方向
const directionOption = [
  { flexDirection: 'column-reverse', alignItems: ' flex-start ' },
  { flexDirection: 'column-reverse', alignItems: ' flex-end ' },
  { flexDirection: 'column', alignItems: ' flex-end ' },
  { flexDirection: 'column', alignItems: ' flex-start ' }
]

export default {
  props: {
    txtTip: {
      type: String,
      default: '提示'
    },
    txtBtnL: {
      type: String,
      default: '确定'
    },
    txtBtnR: {
      type: String,
      default: '取消'
    },
    direction: {
      default: 'auto'
    },
    display: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPopup: this.display,
      popConfirmStyle: directionOption[this.direction - 1],
      visPopup: 'visible',
      popElm: false
    }
  },
  methods: {
    onBlur () {
      this.showPopup = false
    },
    onClickTrigger () {
      this.showPopup = true
      // this.visPopup = 'hidden'
      // 方位自动模式下求最合适的显示方位
      if (this.direction === 'auto') {
        // 逐个方位尝试在当前窗口下是否会溢出,若不会则停止 (边距大于0)
        // 获取方位样式列表
        // const opt = directionOption.values()
        let ms
        // 按顺序设置方位样式
        for (const option of directionOption) {
          this.popConfirmStyle = option
          // 检查当前方位下四周是否溢出，若有则换下一个方位
          ms = this.getAbsoluteMargin(this.$refs.popup)
          if (ms.every(item => item >= 0)) break
        }
      }
      this.visPopup = 'visible'
      // 实现弹框失焦效果, 点击窗口任意区域时触发此事件, 但在弹框区域上, 会事件停止冒泡, 故点击弹框区域事件不会传播到这个监听器
      // 需采用 mouseup , 不能采用 click, 否则在点击时此监听器时会立即响应，虽然才刚刚监听（不知原因为何）
      window.addEventListener('mouseup', this.onBlur, {
        once: true,
        capture: false
      })
    },
    onClickBtnL () {
      this.showPopup = false
      this.$emit('clickBtnL')
    },
    onClickBtnR () {
      this.showPopup = false
      this.$emit('clickBtnR')
    },
    // 计算元素四边距离窗口边缘的距离
    getAbsoluteMargin (element) {
      const elm = element
      // 元素宽高
      const w = elm.offsetWidth
      const h = elm.offsetHeight
      // ({offsetTop: m_top, offsetLeft: m_left} = elm)
      // 递归计算元素上边缘距离页面顶部的距离
      let mtop = elm.offsetTop
      let mleft = elm.offsetLeft
      let parent = elm.offsetParent
      while (parent !== null) {
        mtop += parent.offsetTop
        mleft += parent.offsetLeft
        parent = parent.offsetParent
      }
      // 去除页面滚动的距离,算出上侧距离窗口上边缘距离
      mtop -= document.scrollTop || document.querySelector('body').scrollTop
      mleft -= document.offsetLeft || document.querySelector('body').offsetLeft
      const mbottom = window.innerHeight - mtop - h
      const mright = window.innerWidth - mleft - w
      // 返回各边距离窗口的距离 [上,右,下, 左]
      return [mtop, mright, mbottom, mleft]
    }

  }
}
</script>
<style>
.popConfirm {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  flex-direction: column-reverse;
  font-size: 1rem;
}
.popConfirm .trigger {
  display: inline-block;
}
.popConfirm .popup {
  position: absolute;
  z-index: 100;
  height: 100px;
  width: 200px;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  margin: 2em 0em;
}
</style>
