<template>
  <div class="popConfirm" :style="style_popConfirm">
    <div ref='popup' :style="style_popup" class="popup" v-show="showPopup" @mouseup.stop>
      <p class="popConfirm_tip">{{ txt_tip }}</p>
      <div class="popConfirm_foot">
        <button @click="onClickOk">{{ txt_ok }}</button
        ><button @click="onClickCancel">{{ txt_cancel }}</button>
      </div>
    </div>
    <div ref='popup_trigger' class="pupup_trigger" @click="popup">
      <slot>
        Button
      </slot>
    </div>
  </div>
</template>

<script>
// 显示的方位(传入值) <-> flex-direction属性 映射
// 如果设为 auto, 则会在显示弹框时动态监测弹框是否飘出窗口, 若有则自动切换到合适的方向
const  direction_option = new Map([
        ['one', {
          flexDirection:'column-reverse',
          alignItems: 'flex-start'
        }],
        ['two',{
          flexDirection:'column-reverse',
          alignItems: 'flex-end'
        }],
        ['three', {
          flexDirection:'column',
          alignItems: 'flex-end'
        }],
        ['four', {
          flexDirection:'column',
          alignItems: 'flex-start'
        }],
        ['auto',{}]
      ])

export default {
  props: {
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 100
    },
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
      // 传入方位属性校验
      validator: function (value) {
        return direction_option.has(value)
      },
      default: 'auto'
    }
  },
  data () {
    return {
      showPopup: false,
      popElm: false,
      style_popConfirm: direction_option.get(this.direction),
      style_popup: {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    };
  },
  computed: {
  },
  methods: {
    onBlur () {
      this.showPopup = false
    },
    popup() {
      this.showPopup = true;
      // this.$nextTick()
      // 方位自动模式下求最合适的显示方位
      if(this.direction === 'auto'){
        // 获取方位样式列表
        // const opt = direction_option.values()
        let ms = this.getAbsoluteMargin(this.$refs.popup_trigger)
        // 如果按钮右下角有足够空间，则优先显示在右下角
        if(ms[2] > this.height && ms[1] > this.width) this.style_popConfirm = direction_option.get("four")
        else if(ms[0]> this.height && ms[1] > this.width) this.style_popConfirm = direction_option.get("one")
        else if(ms[2]> this.height && ms[3] > this.width) this.style_popConfirm = direction_option.get("three")
        else if(ms[0]> this.height && ms[3] > this.width) this.style_popConfirm = direction_option.get("two")
      }
      // 实现弹框失焦效果, 点击窗口任意区域时触发此事件, 但在弹框区域上, 会阻止事件冒泡, 故点击弹框区域事件不会传播到这个监听器
      // 需采用 mouseup , 不能采用 click, 否则在点击时此监听器时会立即响应，虽然才刚刚监听（不知原因为何）
      window.addEventListener('mouseup', this.onBlur, {
        once: true,
        capture: false
      })
    },
    onClickOk() {
      this.showPopup = false;
      this.$emit("clickOk");
    },
    onClickCancel() {
      this.showPopup = false;
      this.$emit("clickCancel");
    },
    // 计算元素四边距离窗口边缘的距离
    getAbsoluteMargin (element) {
      const elm = element
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
      // 元素宽高
      const w = elm.offsetWidth
      const h = elm.offsetHeight
      let m_bottom = window.innerHeight - m_top - h
      let m_right = window.innerWidth - m_left
      m_left += w;
      // 返回参数对照图
      //┏━━━━━━━━┯━━━━━━━━━━━━┓
      //┃      m[0]           ┃
      //┃        │            ┃
      //┃        ├─m[1]──────>┃
      //┃        ┏━━┓         ┃
      //┃        ┗━━┛         ┃
      //┃<───m[3]───┤         ┃
      //┃           │         ┃
      //┃         m[2]        ┃
      //┗━━━━━━━━━━━┷━━━━━━━━━┛
      return [m_top,m_right,m_bottom,m_left]
    }

  }
}
</script>
<style>
.popConfirm {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  flex-direction: column;
  font-size: 1rem;
}
.popConfirm .pupup_trigger {
  display: inline-block;
}
.popConfirm .popup {
  position: absolute;
  z-index: 100;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  margin: 2em 0;
}
.popConfirm_tip{
  
}
.popConfirm_foot button{
  margin-right: 1em;
}
</style>
