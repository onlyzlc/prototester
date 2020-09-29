console.log('sodar.js 加载成功')

// Sodar 服务器地址 
// 8080: vue serve 开发环境端口号
var RECEIVER = 'http://127.0.0.1:8080';ubuntu

let htmlHead = document.getElementsByTagName('head').item(0)
let script_m= document.createElement("script");
script_m.type =  "text/javascript";
script_m.src = RECEIVER + '/js/monitor_f.js'

// 检查jQuery
if (typeof jQuery == 'undefined') {
  let script_jq= document.createElement("script");
  script_jq.type =  "text/javascript";
  script_jq.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js";
  // script_jq.src = RECEIVER + "/js/jquery.js";
  htmlHead.append(script_jq)
  let timer = setInterval( ()=> {
      if( typeof jQuery == 'undefined' ) {
          console.log( 'jquery尚未加载完' );
      } else {
          clearInterval(timer)
          htmlHead.append(script_m)
          console.log( 'jquery已加载' );
      }
  },500)
} else {
  htmlHead.append(script_m)
}


// 任务管理和引导
// 任务测试报告
// 任务测试场景
if(window.location.search.includes('testid')){
  var testid = window.location.search.match(/testid=(\w+)/i)[1]
  // 检查id长度是否正确
  console.info('todo: 获取任务前检查id长度是否正确')
  console.log('获取测试任务:'+ testid); 
  
  // 加载测试插件
  // var script_sodar = document.createElement('script')
  // script_sodar.setAttribute("type", "text/javascript");
  // script_sodar.setAttribute('defer','defer')
  // script_sodar.src = 'http://localhost:8081/javascripts/monitor_f.js'
  // htmlHead.append(script_sodar)
}

