import * as track from './track.js'
console.log('sodar.js 加载成功')

// Sodar 服务器地址 
// 8080: vue serve 前端开发服务器
const SODAR_HOST = 'http://127.0.0.1:8080';

let htmlHead = document.querySelector('head')
const page = window.location.href

const sayHi = {
  cmd: 'init',
  content: 'DoDoDo!!! Penny? ~DoDoDo!!! Penny? ~DoDoDo!!! Penny?'
}

let timer1 
// 判断原型页面是否在SODAR_HOST页面框架内
// 是则直接载入插件
// 否则尝试与顶层窗口握手, 并设定时器防止超时:
// --若在超时时间内收到回复指令 "ready"则表示身份正确, 停止定时器;
// --若超时未收到 "ready", 则表示原型没有在SODAR_HOST页面框架内, 载入插件.

if (window.top == window) {
  loadPlugin()
} else {
  timer1 = setTimeout(loadPlugin,5000)
  window.top.postMessage(sayHi, SODAR_HOST)
  window.addEventListener("message", msgFromOutside);
}


// 若在超时之前收到顶层窗口的正确指令,则表示原型位于 SODAR_HOST 页面框架内,处于
function msgFromOutside (e){
  // 非主机来源信息不处理
  if(e.origin !== SODAR_HOST) return

  console.log('收到 %s 的消息: %o',e.origin , e.data);
  switch (e.data.cmd) {
    case 'rec':
      track.monitor(); 
      break   
    case 'stop':
      track.monitorOff(); 
      break   
    case 'disabled':
      // 使原型无法交互
      window.addEventListener("click",function(e){
        // 禁止默认行为
        e.preventDefault()
        // 停止向下传播
        e.stopPropagation()
      },true)
      break
    case 'ready': 
      break
    default :
      console.log('无效指令：%s', e.data.cmd);
      return
  }
  clearTimeout(timer1)
}

// 超时未收到消息，则加载插件窗口。
function loadPlugin(){
  window.removeEventListener('message', msgFromOutside);
  // 插入框架加载 Sodar
  let sodarFrame = document.createElement('iframe')
  sodarFrame.src = SODAR_HOST
  sodarFrame.style.border = 'none'
  sodarFrame.style.width = '100%'
  sodarFrame.style.minHeight = '300px'

  // 渲染插件窗口
  let box = document.createElement('div')
  let boxStyle = `
  position: fixed;
  z-index: 10000;
  box-shadow: 0px 1px 30px 0px #00000024, 2px 2px 6px 1px #00000054;
  right: 20px;
  top: 20px;
  border-radius: 10px;
  overflow: hidden;
  background: white;
  width: 400px
  `
  box.setAttribute('style',boxStyle)
  box.append(sodarFrame)
  document.querySelector('body').append(box)

  // 启动监听
  window.addEventListener("message", msgFromInside);
  function msgFromInside(e){
    if(e.origin === SODAR_HOST){
      // 消息路由
      clearInterval(timer2)
      console.log("收到%s的消息: %o",e.origin,e.data);
      switch (e.data.cmd) {
        case 'href': 
          e.source.postMessage({
            cmd: 'href',
            content: page
          }, e.origin)
          break
        case 'ready':
      }
    }
  }

  // 由于此时插件窗口可能还没加载完,或者还没登录,需重复 sayhi
  let timer2 = setInterval(function () {
    try {
      // sodarFrame.contentWindow.postMessage('Knock! Knock! Knock!', SODAR_HOST)
      // sodarFrame.contentWindow.postMessage('Penny?', SODAR_HOST)
      sodarFrame.contentWindow.postMessage(sayHi, SODAR_HOST)
    } catch (error) {
      return false    
    }
  },1000)
}

export {SODAR_HOST}