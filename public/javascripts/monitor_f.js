$(document).ready(function () {
    const HOST = location.host;
    const PATHNAME = location.pathname;
    const PAGETITLE = document.title;
    const PTTURL = location.href.substring(0,location.href.lastIndexOf('/'));
    const PAGEURL = HOST+PATHNAME;

    // 主机地址
    const RECEIVER = 'http://localhost:8081';

    var task,testId;
    var m_status = false;
    let cycleOfSave = 3000;
    
    // url参数
    // let query = window.parent.location.search.substring(1);
    // let ps = query.split('&');
    // let settingMode;
    // for (const i of ps) {
    //     if (i.split('=')[0] === 'setting') {
    //         settingMode = i.split('=')[1];
    //     }
    // }

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

    let urlParams = queryString(true,window.parent.location.search);
    let settingMode = urlParams.setting;
    let pttId = urlParams.pttId;
    let taskIndex = urlParams.taskIndex;
    
    if (settingMode) {
        console.log('进入设置模式');

        // 开始/结束任务录制按钮，由管理者控制
        $('body').append(
            $('<button></button>')
            .text('开始录制')
            .css({
                'position': 'fixed',
                'top': '40px',
                'right': '20px'
            })
            .click(function(e){
                if(m_status){
                    monitorOff();
                    // 提交数据
                    // saveLog(false,true);
                    console.log("已保存任务");
                }else{
                    
                    console.log("开始记录任务");
                    setTimeout(monitor, 0);
                }
            })
        );

    }else if ($.cookie('task')) {
        // 检查任务是否存在
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
                $.post(`/userTests?ptturl=${PTTURL}`, function (data, textStatus, jqXHR) {
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
            "focus": record,
            "blur": record,
        })
        m_status = true;
    }
    // 关闭跟踪
    function monitorOff() {
        $(window).off({
            'click': record,
            'unload': record,
        })
        $("input,textarea").off({
            "focus": record,
            "blur": record,
        })
        m_status = false;
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
    }]

    // 事件记录和发送
    function record(e) {
        // e.preventDefault();
        clearTimeout(timer);

        var log = {
            eventType: e.type,
            target: {
                innerText: "",
                domId: "",
                nodeName: "",
            },
            url: PAGEURL,
            pageTitle: PAGETITLE,
            time : Date.now(),
        }
        
        switch (e.type) {
            case "click": {
                // 点击事件需记录目标对象
                log.target.nodeName = e.target.nodeName.toLowerCase();
                if (!['body', 'html', 'iframe'].includes(log.target.nodeName)) {
                    log.target.domId = e.target.id;
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
        // 根据模式选择处理接口
        let location = settingMode?  `/ptts/${pttId}/${taskIndex}` : `/userTests?ptturl=${PTTURL}`;
        // 同步模式用于页面关闭事件，以放置页面关闭数据丢失
        $.ajax({
            type: "patch",
            url: location,
            data: {
                log: Logs,
                isCompleted: isCompleted
            },
            async: async,
            // dataType: "json",
            success: function (response) {
                console.log("结果: " + response);
                Logs = [];
            }
        });
        console.log('已发送日志,是否异步:' + async);
    }

    function getNextTask() {
        // url参数表示用户是否完成当前测试任务全部步骤;
        $.get(`/userTests?ptturl=${PTTURL}`,
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
                                window.parent.location = `${RECEIVER}/ptts/${data}`;
                          })
                        // todo 将设置链接指向生产环境
                        // window.location = `http://proto.zhoulongchun.com/ptts?ptturl=${PTTURL}`
                    }
                } else {
                    // 否则跳转到下一个任务页;
                    // 服务器将设置一个任务对象到Cookie中
                    task = JSON.parse($.cookie('task'));
                    window.location = task.url;
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