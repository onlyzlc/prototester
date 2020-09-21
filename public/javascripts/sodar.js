console.log('sodar.js 加载成功')
var htmlHead = document.getElementsByTagName('head').item(0)

// 任务管理和引导
// 任务测试报告
// 任务测试场景
if(window.location.search.includes('testid')){
    
}

// 加载测试插件
var script_sodar = document.createElement('script')
script_sodar.setAttribute("type", "text/javascript");
script_sodar.setAttribute('defer','defer')
script_sodar.src = 'http://localhost:8081/javascripts/monitor_f.js'
htmlHead.append(script_sodar)
