let actions = [];
let start, stop;

// 获取任务的步骤和链接
$.getJSON("./startstop",
    function (data, textStatus, jqXHR) {
        start = data[0];
        stop = data[1];
        console.log("已获取到任务数据");
        $("iframe#pttPrv").attr("src", start.url);
    }
);

let postToWin = {};

window.addEventListener('message', receiveMsgFromWin, false)

function receiveMsgFromWin(e) {
    let eData = e.data;
    let pttWindow = e.source;
    let pttOrigin = e.origin;

    // 消息判断和处理
    switch (eData.status) {
        // 原型可能嵌套在第二层框架中，需将原型发来的链接在框架中重新打开
        case "init": {
            console.log("需要重定向");
            $("iframe#pttPrv").attr("src", eData.url);
            break;
        }
        // 已准备好，开始跟踪
        case "isReady": {
            startRec();
            console.log("已就绪,开始录制");
            break;
        }
        // 跟踪中，原型将事件数据传过来
        case "rec": {
            let action = eData.log;
            actions.push(action);

            // 判断是否完成最后一步
            if (action.eventType == stop.eventType &&
                action.target.domId == stop.target.domId &&
                action.target.nodeName == stop.target.nodeName &&
                action.target.innerText == stop.target.innerText) {
                // 停止跟踪
                postToWin.status = 'stepRec_over';
                pttWindow.postMessage(postToWin, pttOrigin);
                submit(true);
            }

            console.log("已捕获事件：" + action.eventType);
            break;
        }
        default: {

        }
    }

    function startRec() {
        postToWin.status = 'stepRec_start';
        pttWindow.postMessage(postToWin, pttOrigin);
    }

    // todo 原型未设置插件的提示。
}

$(window).on("beforeunload", function (e) {
    // var confirmationMessage = "\o/";
    // (e || window.event).returnValue = confirmationMessage; // Gecko and Trident
    actions.push({
        eventType: "close",
        time: Date.now()
    })
    submit(false);
    return false;
})

function submit(isCompleted = false) {
    $(window).off("beforeunload");
    // 已完成的异步发送
    // 未完成的同步发送
    $.ajax({
        type: "patch",
        url: "",
        asysn: isCompleted,
        data: {
            isCompleted: isCompleted,
            actions: actions
        },
        success: function (response) {
            if (window.confirm("您已完成该任务")) {
                location = "../"
            }
        }
    });
}