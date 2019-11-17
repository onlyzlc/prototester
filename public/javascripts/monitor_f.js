$(document).ready(function () {
    const Url = location.pathname;
    const PageTitle = document.title;
    const Ptt = Url.split('/')[2];
    var task;
    var testId;
    let timeout = 3000;

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
        timeout = 0;
        // 设置模式下直接开启监听
        monitor();
    } else if ($.cookie('task')) {
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
                $.post(`/userTests?ptt=${Ptt}`, function (data, textStatus, jqXHR) {
                    // 返回后, 隐藏对话框,启用监控程序
                    monitor();
                    console.log('开始测试:'+$.cookie('testId'));
                })
            }
        }
    }
    // 任务不存在, 询问用户是否接受测试, 若接受则向服务器发送测试请求.
    else if (window.confirm('您是否愿意为我们的原型进行一项简短的测试?')) {
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
        url: Url,
        pageTitle: PageTitle,
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
            url: Url,
            pageTitle: PageTitle,
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
                Logs.push(log)
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
            timer = setTimeout(saveLog, timeout);
        }
    };

    function saveLog(async = true,isCompleted = false) {
        if (settingMode) {
            // 设置模式下点击保存时再保存数据,保存在任务设置页面中(父页面)
            localStorage.setItem('Logs', JSON.stringify(Logs));
        } else {
            $.ajax({
                type: "patch",
                url: `/userTests?ptt=${Ptt}`,
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
        $.get(`/userTests?ptt=${Ptt}`,
            function (data, textStatus, jqXHR) {
                if (data == 'finished') {
                    // 如果服务器返回任务全部完成的信号,则跳转到感谢页
                    window.location.pathname = `/thanks`;
                } else {
                    // 否则跳转到下一个任务页;
                    task = JSON.parse($.cookie('task'));
                    window.location.pathname = task.url;
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