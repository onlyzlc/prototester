$(document).ready(function () {
    const HOST = location.host;
    const PATHNAME = location.pathname;
    const PAGETITLE = document.title;
    const PTTURL = HOST+PATHNAME.substring(0,PATHNAME.lastIndexOf('/'));
    const PAGEURL = HOST+PATHNAME;
    var task,testId;
    let cycleOfSave = 3000;
    
    // url参数
    let query = window.location.search.substring(1);
    let ps = query.split('&');
    let settingMode;
    for (const i of ps) {
        if (i.split('=')[0] == 'setting') 
            settingMode = i.split('=')[1];
    }
    
    if (settingMode) {
        // 设置模式即时保存记录
        cycleOfSave = 0;
        // 设置模式下直接开启监听，数据保存到本地，然后由父页面-newTask页提交。
        monitor();
    }else if ($.cookie('task')) {
        // 检查任务是否存在
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
                $.post(`/userTests?ptt=${PTTURL}`, function (data, textStatus, jqXHR) {
                    // 返回后, 隐藏对话框,启用监控程序
                    monitor();
                    console.log('开始测试:'+$.cookie('testId'));
                })
            }
        }
    }else {
        // 任务不存在, 询问用户是否接受测试, 若接受则向服务器发送测试请求.
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
    }

    function monitorCancel() {
        $(window).off({
            'click': record,
            'unload': record,
        })
        $("input,textarea").off({
            "focus": record,
            "blur": record,
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
    }]

    // 事件记录发送
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
            // 停止监听,立即发送日志
            monitorCancel();
            saveLog(false,true);
            console.log("当前任务已完成");
            // 请求下一个任务
            getNextTask();
        } else {
            timer = setTimeout(saveLog, cycleOfSave);
        }
    };

    function saveLog(async = true,isCompleted = false) {
        if (settingMode) {
            // 设置模式下点击保存时暂存数据, 由父页面-任务设置页提交存储器中的数据。
            localStorage.setItem('Logs', JSON.stringify(Logs));
        } else {
            // 测试模式下，触发事件后直接提交数据
            // 同步模式用于页面关闭事件，以放置页面关闭数据丢失
            $.ajax({
                type: "patch",
                url: `/userTests?ptt=${PTTURL}`,
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
    }

    function getNextTask() {
        // url参数表示用户是否完成当前测试任务全部步骤;
        $.get(`/userTests?ptt=${PTTURL}`,
            function (data, textStatus, jqXHR) {
                if (data == 'finished') {
                    // 如果服务器返回任务全部完成的信号,则跳转到感谢页
                    window.location = `/thanks`;
                }else if(data == 'init'){
                    if(window.confirm('该原型尚未设置测试任务，是否现在前往设置')){
                        window.location = `../../ptts?ptt=${PTTURL}`
                        // window.location = `http://proto.zhoulongchun.com/ptts?ptt=${PTTURL}`
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


    var btn_stop = $('<button></button>')
        .text('跳到这个任务')
        .css({
            'position': 'fixed',
            'top': '40px',
            'right': '20px'
        })
        .click(function(){
            monitorCancel();
            saveLog(false);
            getNextTask();
        });

    $('body').append(btn_stop);

    function clearCookies(e) {
        console.log('清除Cookies');
        $.ajax({
            type: 'delete',
            url: '/userTests',
        })
    }
});