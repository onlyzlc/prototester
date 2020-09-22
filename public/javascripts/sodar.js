console.log('sodar.js 加载成功')
var htmlHead = document.getElementsByTagName('head').item(0)

function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://www.example.org/example.txt");
oReq.send();

// 任务管理和引导
// 任务测试报告
// 任务测试场景
if(window.location.search.includes('testid')){
  var testid = window.location.search.match(/testid=(\w+)/i)[1]
  // 检查id长度是否正确
  console.info('todo: 获取任务前检查id长度是否正确')
  console.log('获取测试任务:'+ testid); 
  
  // 加载测试插件
  var script_sodar = document.createElement('script')
  script_sodar.setAttribute("type", "text/javascript");
  script_sodar.setAttribute('defer','defer')
  script_sodar.src = 'http://localhost:8081/javascripts/monitor_f.js'
  htmlHead.append(script_sodar)
}

