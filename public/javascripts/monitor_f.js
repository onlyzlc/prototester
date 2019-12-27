$(document).ready(function () {
    const HOST = location.host;
    const PATHNAME = location.pathname;
    const PAGETITLE = document.title;
    const PTTURL = location.href.substring(0,location.href.lastIndexOf('/'));
    const PAGEURL = location.href;

    // 加入控制按钮栏
    $('body').append($('<aside></aside>').css({
        'position': 'fixed',
        'top': '40px',
        'right': '20px'
    }))
    
    // 主机地址
    const RECEIVER = 'http://localhost:8081';

    // 测试模式使用的全局变量
    var task,testId;

    // 定时发送周期
    let cycleOfSave = 1000;


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


    // 设置模式使用的全局变量
    // 需随时存入Cookie
    let settingMode = $.cookie("settingMode");

    // URL上带有设置信息时，表示开始一个新的任务设置
    // 将URL参数中的原型、任务号等存入Cookie，然后清除URL参数
    if(window.parent !== window){
        let url;
        try {
            let urlParams = queryString(true,window.parent.location.search);
            if(urlParams.setting){
                // 将模式信息设置到 Cookie
                $.cookie('settingMode',urlParams.setting);
                $.cookie('pttId',urlParams.pttId);
                $.cookie('taskIndex',urlParams.taskIndex);
                // 清除URL中的模式信息，以避免重复判断
                window.parent.location.search = '';
                // 标记当前任务设置状态为初始
                $.cookie('m_status', 'init');
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
        pttId = $.cookie('pttId');
        taskIndex = $.cookie('taskIndex');
        m_status = $.cookie('m_status');
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
                saveLog();
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
        window.addEventListener("message", receiveMessage, false);
        function receiveMessage(event){
            // For Chrome, the origin property is in the event.originalEvent
            var origin = event.origin
            // if (origin !== "http://example.org:8080")
                // return;
            console.log(event.data);
            let id = event.data;
            if(id){
                window.scroll({
                    top: $(id).scrollTop(),
                    left : $(id).scrollLeft(),
                });
                // 显示标记
                
                $("#"+id+".ax_default").css({
                    "border": "2px #039BE5 solid",
                    "box-shadow": "0 0 3px 0px #039be5"
                }).append($("<div></div>").css({
                    'width':'30px',
                    'height': '30px',
                    'position': 'absolute',
                    'z-index':'1000',
                    'top': '-30px',
                    "left": "-30px",
                    "background": "rgb(3, 155, 229)",
                    "border-radius":" 15px 15px 0px",
                    "box-shadow": "hsla(0, 0%, 40%, 1) -1px -1px 5px 0px",
                }).text());
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
        // 任务不存在, 获取下一个任务.
        // 服务器在Cookie中设置测试任务
        // 客户端接收到返回消息后, 跳转到第一个测试任务页
        getNextTask();
    }

    // 启用跟踪, 绑定事件
    function monitor() {
        $(window).on({
            'click': record,
            'unload': record,
        })
        // 所有输入事件
        $("input,textarea").on({
            "change": record,
        })
    }
    // 关闭跟踪
    function monitorOff() {
        $(window).off({
            'click': record,
            'unload': record,
        })
        $("input,textarea").off({
            "change": record,
        })
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

    let logLastTime;

    // 事件记录和发送
    function record(e) {
        // e.preventDefault();
        clearTimeout(timer);
        let time = Date.now();

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

        // if( )
        
        switch (e.type) {
            case "click": {
                // 点击事件需记录目标对象
                log.target.nodeName = e.target.nodeName.toLowerCase();
                if (!['body', 'html', 'iframe'].includes(log.target.nodeName)) {
                    log.target.domId = (e.target.id === '') ? $(e.target).parents('.ax_default ').attr('id') : e.target.id;
                    log.target.innerText = e.target.innerHTML.trim();
                }
                Logs.push(log);
                break;
            }
            case "focus":   
            case "blur": {
                log.target.domId= e.target.id;
                log.target.nodeName= e.target.nodeName.toLowerCase();
                log.target.innerText= $(this).val().trim();
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

    function saveLog(async = true,isCompleted = false) {
        // 如果是同步发送，则立即停止定时器，避免最后再次发送一个数据
        if(!async) clearTimeout(timer);
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
                isCompleted: isCompleted
            },
            async: async,
            success: function (response) {
                console.log("结果: " + response);
                if(settingMode && m_status === 'finish'){
                    // 设置模式下，已完成设置则跳转到接收端的设置页面
                    window.parent.location.href = `${RECEIVER}/ptts/${pttId}/${taskIndex}/setting`;
                }
            }
        });
        console.log('已发送日志,是否异步:' + async);
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
  
    function clearCookies(e) {
        console.log('清除Cookies');
        $.ajax({
            type: 'delete',
            url: '/userTests',
        })
    }

});

