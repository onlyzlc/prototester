$(document).ready(function () {
    const HOST = location.host;
    const PATHNAME = location.pathname;
    const PAGETITLE = document.title;
    const PTTURL = location.href.substring(0,location.href.lastIndexOf('/'));
    const PAGEURL = location.href;

    // 表单元素
    const formElms = 'input,select,textarea,label';

    // 加入控制栏
    $('body').append($('<aside></aside>').css({
        'position': 'fixed',
        'top': '40px',
        'right': '20px'
    }))
    
    // 主机地址
    // const RECEIVER = 'https://bwh.zhoulongchun.com';
    const RECEIVER = 'http://localhost:8081';

    // 测试模式使用的全局变量
    var task,testId;

    // 定时发送周期
    let cycleOfSave = 1000;

    // axure特征
    // 插入一些样式类
    $("head").append(`
        <style>
            ._mark{
                border: 1px #F44336 dashed !important;
                width: calc(100% + 8px);
                height: calc(100% + 8px);
                top: -4px;
                left: -4px;
                background-color: hsla(0, 0%, 0%, 0.3);
                transition: background 100ms;
                position: absolute;
                z-index:1000;
            }
            ._markDes{
                width: 30px;
                position: absolute;
                z-index: 1000;
                top: -30px;
                left: 0;
                background: #F44336;
                padding: 5px;
            }
        </style>
    `)

    // 设置模式使用的全局变量
    // 需随时存入Cookie
    let settingMode = sessionStorage.getItem("settingMode");

    // URL上带有设置信息时，表示开始一个新的任务设置
    // 将URL参数中的原型、任务号等存入Cookie，然后清除URL参数
    if(window.parent !== window){
        let url;
        try {
            let urlParams = queryString(true,window.parent.location.search);
            if(urlParams.setting){
                // 将模式信息设置到 Cookie
                sessionStorage.setItem('settingMode',true);
                sessionStorage.setItem('pttId',urlParams.pttId);
                sessionStorage.setItem('taskIndex',urlParams.taskIndex);
                // 清除URL中的模式信息，以避免重复判断
                window.parent.location.search = '';
                // 标记当前任务设置状态为初始
                sessionStorage.setItem('m_status', 'init');
                settingMode = true;
            }
        } catch (error) {
            url = document.referrer;
            console.log(url);
        }
    }

    let pttId,taskIndex,m_status;
    if(settingMode){
        // 【进入设置模式】
        pttId = sessionStorage.getItem('pttId');
        taskIndex = sessionStorage.getItem('taskIndex');
        m_status = sessionStorage.getItem('m_status');
        console.log('进入设置模式');

        // 页面中插入设置控制按钮，由管理者控制
        // 载入时根据状态显示控制按钮名称
        let btnText;
        switch (m_status) {
            case 'init':{
                btnText = '开始录制';
                break;
            }
            case 'recoding':{
                btnText = '暂停录制';
                console.log("开始记录任务");
                monitor();
                break;
            }
            case 'pause':{
                btnText = '继续录制';
                monitorOff();
                break;
            }
            case 'finish':{
                monitorOff();
                break;
            }
        }
        // 插入控制按钮
        if(m_status !== 'finish'){
            // 开始/暂停录制按钮
            let btn_toggle = $('<button></button>')
                .click(function (e) {
                    taskRecToggle(e)
                })
                .attr('id','btn_toggle')
                .text(btnText)
            let btn_finish = $('<button></button>')
                                .attr('id','btn_finish')
                                .text('完成录制')
                                .click(taskRecOver);
            $('aside').append(btn_toggle,btn_finish );
        }
        // 方法：录制/暂停
        function taskRecToggle(e) {
            switch (m_status) {
                case 'init':
                case 'pause':
                    {
                    // 未开始时点击
                    m_status = 'recoding';
                    $.cookie('m_status',m_status);
                    console.log("开始记录任务");
                    setTimeout(monitor, 100);
                    $(e.target).text('暂停录制');
                    break;
                }                        
                case 'recoding':{
                    // 录制中时点击
                    m_status = 'pause';
                    $.cookie('m_status',m_status);
                    console.log("暂停记录任务");
                    monitorOff();
                    $(e.target).text('继续录制');
                    break;
                }
                default:
                    break;
            }
        }
        // 方法：结束录制
        function taskRecOver(e){
            monitorOff();

            m_status = 'finish';
            $.cookie('m_status',m_status);

            if(window.confirm('是否保存该任务')){
                // 不删除任务,异步发送任务，isComplate不置位，因为任务还未设置完成。
                saveLog(function (res) {  
                    // 设置模式下，已完成设置则跳转到接收端的设置页面
                    window.parent.location.href = `${RECEIVER}/ptts/${pttId}/${taskIndex}/setting`;
                });
            }else{
                // 删除刚刚保存的任务
                $.ajax({
                    type: "delete",
                    url: `/ptts/${pttId}/${taskIndex}`,
                    async: false,
                    success: function (response) {
                        console.log("结果: " + response);
                        Logs = [];
                    }
                });
            }
        }

        // 在设置模式的第二阶段——选择步骤，需监听父窗口的消息
        // 消息发送自taskSetting.js
        window.addEventListener("message", receiveMessage, false);
        function receiveMessage(event){
            var origin = event.origin
            // 缺少来源判断
            if(typeof(event.data) === 'object'){
                let steps = event.data;
                let i = 0;
                console.log(steps);
                steps.forEach(step => {
                    let id = "#"+step.target.domId;
                    if($(id).hasClass("ax_default")){
                        // axure特征
                        // 显示标记
                        $(id)
                            .append($("<div></div>").addClass("_mark"))
                            .append($("<div></div>").addClass("_markDes").text(i++ +"."+ step.eventType));
                    }else{
                        $(id).parent("ax_default")
                            .append($("<div></div>").addClass("_mark"))
                            .append($("<div></div>").addClass("_markDes").text(i++ +"."+ step.eventType));
                    }  
                })    
            }else{
                let id = "#"+event.data;
                if(id){
                    window.scroll({
                        top: $(id).scrollTop(),
                        left : $(id).scrollLeft(),
                    });
                }
            }
            
            
        }

    }else if ($.cookie('task')) {
        // 【非设置模式】 
        // 检查是否有测试任务
        // 任务存在
        task = JSON.parse($.cookie('task'))
        testId = $.cookie('testId')
        console.log('当前任务是:' + task.name);

        // 检查测试ID是否为空
        if (testId) {
            // 测试ID非空,用户任务进行中,启用监控程序
            console.log('测试进行中,id:' + testId);
            monitor();
        } else {
            // 测试ID空,发送测试请求
            // 显示当前任务是什么
            // 询问是否开始任务
            if (window.confirm(`您已完成第${task.index}个任务.\n 下一个任务:${task.name}`)) {
                // 发送请求, 创建测试实例
                $.post(`${RECEIVER}/userTests?ptturl=${PTTURL}`, function (data, textStatus, jqXHR) {
                    // 返回后, 隐藏对话框,启用监控程序
                    monitor();
                    console.log('开始测试:'+$.cookie('testId'));
                })
            }
        }

        // 测试控制按钮，由参与者控制
        $('body').append(
            $('<button></button>')
            .text('跳到这个任务')
            .css({
                'position': 'fixed',
                'top': '40px',
                'right': '20px'
            })
            .click(function(){
                monitorOff();
                saveLog(false);
                getNextTask();
            })
        );
    }else {
        // 【非设置模式】 
        // 任务不存在, 获取下一个任务.服务器在Cookie中设置测试任务，客户端接收到返回消息后, 跳转到第一个测试任务页
        getNextTask();
    }

    

    // 启用跟踪, 绑定事件
    function monitor() {
        $(formElms).on("change", record);
        $("[type=submit]").click(record);
        $("div.ax_default").click(record);
        $(window).on('unload', record);

        // 排除一些元素,只在ax_default叶子节点上绑定，移除掉其父节点山的
        $("div.ax_default").has(".ax_default").off("click",record);
        $("div.ax_default").has("input").off("click",record);
    }
    // 关闭跟踪
    function monitorOff() {
        $(window).off('unload', record);
        $(formElms).off("change", record);
        $("div.ax_default ").off("click", record);
    }

    var timer;

    var Logs = [{
        url: PAGEURL,
        pageTitle: PAGETITLE,
        // screen: {
        //     width: $(window).width(),
        //     height: $(window).height()
        // },
        eventType: 'load',
        time: Date.now(),
    }];

    // 事件记录和发送
    function record(e) {
        // 阻止事件冒泡，对于Axure中的动态面板的多层ax_default有效————只截取最底层的那个元素事件
        event.stopPropagation();

        clearTimeout(timer);

        console.log(this);
        console.log(e.target);
        
        let time = Date.now();

        // 重置log
        var log = {
            eventType: e.type,
            target: {
                innerText: "",
                domId: "",
                nodeName: "",
            },
            url: PAGEURL,
            pageTitle: PAGETITLE,
            time : time,
        }
        console.log(log);
        

        switch (e.type) {
            case "change": {
                log.target.domId= e.target.id;
                log.target.nodeName= e.target.nodeName.toLowerCase();
                log.target.innerText= $(e.target).val().trim();
                Logs.push(log);
                break;
            }
            case "click": {
                // 表单输入类型元素只监听change事件，避免重复记录多个等效操作；
                // if((formElms+'body, html, iframe').search(e.target.nodeName.toLowerCase()) > 0){
                //     break;
                // }
                // 点击事件需记录目标对象
                log.target.nodeName = this.nodeName.toLowerCase();
                log.target.domId = this.id;
                log.target.innerText = e.target.innerText.trim();
                Logs.push(log);
                break;
            }
            case "unload": {
                Logs.push(log);
                saveLog(false);
                return;
            }
        }
        
        // 判断是否为任务最后一步
        if (!settingMode &&
            log.eventType == task.end.eventType &&
            log.target.domId == task.end.target.domId &&
            log.target.nodeName == task.end.target.nodeName &&
            log.target.innerText == task.end.target.innerText
        ) {
            // 如果是最后一步，则停止监听,立即发送日志
            monitorOff();
            saveLog(false,true);
            console.log("当前任务已完成");
            // 请求下一个任务
            getNextTask();
        } else {
            // 如果不是最后一步，则继续监听并等待提交数据
            timer = setTimeout(saveLog, cycleOfSave);
        }
    };

    function saveLog(callback) {
        let args = Array.from(arguments);
        
        // 如果是同步发送，则立即停止定时器，避免最后再次发送一个数据
        if(args.includes("sync")) clearTimeout(timer);

        // 立即清空Log，避免重复记录
        let logs = Logs;
        Logs = [];

        // 测试模式 将log定时发送到服务器
        // 同步模式用于页面关闭事件，以放置页面关闭数据丢失
        
        $.ajax({
            type: "patch",
            url: settingMode?(`${RECEIVER}/ptts/${pttId}/${taskIndex}`):(`${RECEIVER}/userTests?ptturl=${PTTURL}`),
            data: {
                logs: logs,
                isCompleted: args.includes("completed")
            },
            async: !args.includes("sync"),
            success: function (response) {
                console.log("结果: " + response);
                if(typeof(callback) === "function"){
                    callback(response)
                    // 设置模式下，已完成设置则跳转到接收端的设置页面
                }
            }
        });
    }

    function getNextTask() {
        // url参数表示用户是否完成当前测试任务全部步骤;
        $.get(`${RECEIVER}/userTests?ptturl=${PTTURL}`,
            function (data, textStatus, jqXHR) {
                if (data == 'finished') {
                    // 服务器返回任务全部完成的信号,跳转到感谢页
                    window.location = `/thanks`; 
                    // todo
                }else if(data == 'init'){
                    // 服务器返回该原型尚未注册或没有设置测试任务
                    if(window.confirm('该原型尚未设置测试任务，是否现在前往设置')){

                        // 通过参数先查询原型是否存在，如果不存在，则服务器先创建原型
                        // 然后待服务器返回一个原型设置的页面链接
                        $.post(`${RECEIVER}/ptts`, 
                            {
                                ptturl:`${PTTURL}`
                            },
                            function (data,status) {
                                console.log('已创建一条原型记录'+data);
                                window.parent.location.href = `${RECEIVER}/ptts/${data}`;
                          })
                        // todo 将设置链接指向生产环境
                        // window.location = `http://proto.zhoulongchun.com/ptts?ptturl=${PTTURL}`
                    }
                } else {
                    // 否则跳转到下一个任务页;
                    // 服务器将设置一个任务对象到Cookie中
                    task = JSON.parse($.cookie('task'));
                    window.location.href = task.url;
                }
            },
        );
    }
  


});


// 工具函数
function getParentUrl() { 
    var url = null;
    if (parent !== window) { 
        try {
            url = parent.location.href; 
        }catch (e) { 
            url = document.referrer; 
        } 
    }
    return url;
}    

function queryString(getObj,str){
    var string = (str!== undefined) ? str : window.location.search;
    var result = string.match(new RegExp("[^\?\&]+=[^\?\&]+","g"));
    if(result == null){
        result = '';
    }else if(getObj){
        var params = {};
        for(var i = 0; i < result.length; i++){
            var res = result[i].split('=');
            var key = res[0],
                value = res[1];
            params[key] = value;
        }
        result = params;
    }
    return result;
}
function clearCookies(e) {
    console.log('清除Cookies');
    $.ajax({
        type: 'delete',
        url: '/userTests',
    })
}
