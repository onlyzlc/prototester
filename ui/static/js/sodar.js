console.log('sodar.js 加载成功')

// Sodar 服务器地址 
// 8080: vue serve 前端开发服务器
var SODAR_HOST = 'http://127.0.0.1:8080';

let htmlHead = document.querySelector('head')
const page = window.location.href

if(window.parent.location.origin === SODAR_HOST){
  // 原型被内嵌在 Sodar 网页内
}else{
  // 插入框架加载 Sodar
  let sodarFrame = document.createElement('iframe')
  sodarFrame.src = SODAR_HOST
  sodarFrame.style.border = 'none'
  sodarFrame.style.width = '100%'
  sodarFrame.style.minHeight = '300px'
  
  // 任务管理和引导
  // 任务测试报告
  // 任务测试场景
  if(window.location.search.includes('testid')){
    var testid = window.location.search.match(/testid=(\w+)/i)[1]
    // 检查id长度是否正确
    console.info('todo: 获取任务前检查id长度是否正确')
    console.log('获取测试任务:'+ testid);  
    sodarFrame.src += 'testing'
  }
  
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
  
  // 与主机通信
  window.addEventListener("message", receiveMsg, false);
  function receiveMsg(e){
    if(e.origin === SODAR_HOST){
      console.log(e.data);
      if(e.data === 'ready'){
        clearInterval(timer)
        e.source.postMessage(page, e.origin)
      }
    }
  }
  // 由于此时插件窗口可能还没加载完,或者还没登录,需重复 sayhi
  let timer = setInterval(function () {
    try {
      sodarFrame.contentWindow.postMessage('are u ready?', SODAR_HOST)
    } catch (error) {
      return false    
    }
  },100)
}

// 加入跟踪脚本
if( false ){
  let script_m= document.createElement("script");
  script_m.type =  "text/javascript";
  script_m.src = SODAR_HOST + '/js/monitor_f.js'
  
  // 检查 jQuery, 若 jQuery 加载成功则继续加载 插件.
  if (typeof jQuery == 'undefined') {
    let script_jq= document.createElement("script");
    script_jq.type =  "text/javascript";
    script_jq.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js";
    // script_jq.src = SODAR_HOST + "/js/jquery.js";
    htmlHead.append(script_jq)
    let timer = setInterval( ()=> {
        if( typeof jQuery == 'undefined' ) {
            console.log( 'jquery尚未加载完' );
        } else {
            clearInterval(timer)
            console.log( 'jquery已加载' );
            htmlHead.append(script_m)
        }
    },2000)
  } else {
    htmlHead.append(script_m)
  }
}