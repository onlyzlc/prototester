<template>
  <div
    class="popConfirm"
    :style="style_popConfirm"
  >
    <div
      class="pupup_trigger"
      @click="onClickTrigger"
    >
      <!-- <slot /> -->
      删除
    </div>
    <div
      v-show="showPopup"
      ref="popup"
      class="popup"
      :style="{visibility:vis_popup}"
      @mouseup.stop
    >
      <p>{{ txt_tip }}</p>
      <p>
        <button @click="onClickOk">
          {{ txt_ok }}
        </button><button @click="onClickCancel">
          {{ txt_cancel }}
        </button>
      </p>
    </div>
  </div>
</template>

<script>
// 显示的象限方位(传入值) <-> flex-direction属性 映射
// 如果设为 auto, 则会在显示弹框时动态监测弹框是否飘出窗口, 若有则自动切换到合适的方向
const direction_option = [
  { flexDirection: 'column-reverse', alignItems: ' flex-start ' },
  { flexDirection: 'column-reverse', alignItems: ' flex-end ' },
  { flexDirection: 'column', alignItems: ' flex-end ' },
  { flexDirection: 'column', alignItems: ' flex-start ' }
]

export default {
  props: {
    txt_tip: {
      type: String,
      default: '提示'
    },
    txt_ok: {
      type: String,
      default: '确定'
    },
    txt_cancel: {
      type: String,
      default: '取消'
    },
    direction: {
      default: 'auto'
    }
  },
  data () {
    return {
      showPopup: false,
      style_popConfirm: direction_option[this.direction - 1],
      vis_popup: 'visible',
      popElm: false
    }
  },
  methods: {
    onBlur () {
      this.showPopup = false
    },
    onClickTrigger () {
      this.showPopup = true
      // this.vis_popup = 'hidden'
      // 方位自动模式下求最合适的显示方位
      if (this.direction === 'auto') {
        // 逐个方位尝试在当前窗口下是否会溢出,若不会则停止 (边距大于0)
        // 获取方位样式列表
        // const opt = direction_option.values()
        let ms
        // 按顺序设置方位样式
        for (const option of direction_option) {
          this.style_popConfirm = option
          // 检查当前方位下四周是否溢出，若有则换下一个方位
          ms = this.getAbsoluteMargin(this.$refs.popup)
          if (ms.every(item => item >= 0)) break
        }
      }
      this.vis_popup = 'visible'
      // 实现弹框失焦效果, 点击窗口任意区域时触发此事件, 但在弹框区域上, 会事件停止冒泡, 故点击弹框区域事件不会传播到这个监听器
      // 需采用 mouseup , 不能采用 click, 否则在点击时此监听器时会立即响应，虽然才刚刚监听（不知原因为何）
      window.addEventListener('mouseup', this.onBlur, {
        once: true,
        capture: false
      })
    },
    onClickOk () {
      this.showPopup = false
      this.$emit('onClickOk')
    },
    onClickCancel () {
      this.showPopup = false
      this.$emit('onClickCancel')
    },
    // 计算元素四边距离窗口边缘的距离
    getAbsoluteMargin (element) {
      const elm = element
      // 元素宽高
      const w = elm.offsetWidth
      const h = elm.offsetHeight
      // ({offsetTop: m_top, offsetLeft: m_left} = elm)
      // 递归计算元素上边缘距离页面顶部的距离
      let m_top = elm.offsetTop
      let m_left = elm.offsetLeft
      let parent = elm.offsetParent
      while (parent !== null) {
        m_top += parent.offsetTop
        m_left += parent.offsetLeft
        parent = parent.offsetParent
      }
      // 去除页面滚动的距离,算出上侧距离窗口上边缘距离
      m_top -= document.scrollTop || document.querySelector('body').scrollTop
      m_left -= document.offsetLeft || document.querySelector('body').offsetLeft
      const m_bottom = window.innerHeight - m_top - h
      const m_right = window.innerWidth - m_left - w
      // 返回各边距离窗口的距离 [上,右,下, 左]
      return [m_top, m_right, m_bottom, m_left]
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
.popConfirm .pupup_trigger {
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
