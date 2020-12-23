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

// 启动定时器:等待 SODAR_HOST 发送消息, 若超时没收到, 则代表当前原型不在 SODAR_HOST 页面框架内
const timer1 = setTimeout(timer1Handle,2000)
if(window.top !== window){
  // window.top.postMessage('Knock! Knock! Knock!', SODAR_HOST)
  // window.top.postMessage('Penny?', SODAR_HOST)
  window.top.postMessage(sayHi, SODAR_HOST)
}

window.addEventListener("message", msgFromOutside);
// 若收到消息,则表示原型位于 SODAR_HOST 页面框架内,处于
function msgFromOutside (e){
  if(e.origin === SODAR_HOST){
    // 消息路由
    console.log(e.data);
    switch (e.data.cmd) {
      case 'rec':
        track.monitor(); 
        break   
      case 'stop':
        track.monitorOff(); 
        break   
      case 'ready': 
        // 原型位于Sodar框架内, 需反馈已准备好
        clearTimeout(timer1)
        break
    }
  }
}

function timer1Handle(){
  window.removeEventListener('message', msgFromOutside);
  // 插入框架加载 Sodar
  let sodarFrame = document.createElement('iframe')
  sodarFrame.src = SODAR_HOST
  sodarFrame.style.border = 'none'
  sodarFrame.style.width = '100%'
  sodarFrame.style.minHeight = '300px'

  // 任务管理和引导
  // 任务测试场景
  // if(window.location.search.includes('testing=true')){
  //   var taskId = window.location.search.match(/taskId=(\w+)/i)[1]
  //   // 检查id长度是否正确
  //   console.info('todo: 获取任务前检查id长度是否正确')
  //   console.log('获取测试任务:'+ taskId);  
  //   sodarFrame.src += ('tasks/' + taskId + '/testing')
  // }

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
      console.log(e.data);
      switch (e.data.cmd) {
        case 'href': 
          e.source.postMessage({
            cmd: 'href',
            content: page
          }, e.origin)
          break
        case 'taskId': 
          e.source.postMessage({
            cmd: 'taskId',
            content: taskId
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