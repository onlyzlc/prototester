$(document).ready(function () {

    // 显示原型链接对话框
    let favDialog = document.getElementById('favDialog');
    if (typeof favDialog.showModal === "function") {
        favDialog.showModal();
    } else {
        alert("The dialog API is not supported by this browser");
    }

    let actions = [];
    let task  = {
        name : "",
        actions : actions,
    }
    let postToWin = {};

    window.addEventListener('message', receiveMsgFromWin,false)

    function receiveMsgFromWin(e) {
        let eData = e.data;
        let pttWindow = e.source;
        let pttOrigin = e.origin;

        // 按钮：结束录制，创建任务
        let btn_over = $("<button></button>")
            .text("结束录制")
            .attr("id","over")
            .click(function(e){
                if(actions.length < 2){
                    window.alert('请至少添加两个步骤');
                    return;
                }
                postToWin.status = 'stepRec_over';
                pttWindow.postMessage(postToWin,pttOrigin);
                // 提交到服务器
                $.ajax({
                    type: "post",
                    url: ".",
                    data: task,
                    success: function (response) {
                        // todo 成功后跳转
                        console.log("任务创建成功，正在跳转回任务列表");
                        location.pathname = "/tasks/" + response + "/setting";
                    }
                });
            });
        
        // 按钮：取消录制
        let btn_cancel = $("<button></button>")
            .text("取消")
            .attr("id","cancel")
            .click(function (e) {  
                location.pathname = "/tasks"
            });

        
        // 消息判断和处理
        switch (eData.status) {
            // 原型可能嵌套在第二层框架中，需将原型发来的链接在框架中重新打开
            case "init":{
                console.log("需要重定向");
                $("iframe#pttPrv").attr("src", eData.url);
                break;
            }
            // 已准备好，点击开始按钮就通知原型页面启用跟踪
            case "isReady":{
                // 原型页面跳转时，会再次收到isReady信号
                if(postToWin.status === 'stepRec_start'){
                    startRec();
                    break;
                }
                console.log("已就绪");

                // 自动填充任务名，默认为页面名称
                if($.trim($("textarea#taskName").val()) === ""){
                    $("textarea#taskName").val(eData.pageTitle).change();
                } ;
                // 按钮：开始录制
                $('button#start')  
                    .off("click")
                    .on("click",startRec)
                break;
            }
            // 跟踪中，原型将事件数据传过来
            case "rec" :{
                console.log("已捕获事件："+ eData.log.eventType);
                actions.push(eData.log)
                break;
            }
            default: {
                
            }
        }

        function startRec(){
            postToWin.status = 'stepRec_start';
            pttWindow.postMessage(postToWin,pttOrigin);
            
            // 界面处理：移除对话框，增加停止和取消按钮
            $(favDialog).remove();
            // 插入停止和取消按钮
            $("<div id='bar'></div>").append(btn_over,btn_cancel).appendTo("body");
            $("#pttPrv").css({
                "height":"calc(100% - 54px)"
            })
        }

        // todo 原型未设置插件的提示。
    }

    $('#pttUrl').change(function (e) {
        $("iframe#pttPrv").attr("src", $.trim(this.value))
    })

    $("#taskName").change(function (e) {
        if($.trim(this.value)){
            task.name = this.value;
        }
    })

    $('button#start').click(function (e)  {  
        window.alert('请输入有效的原型链接');
    })


});