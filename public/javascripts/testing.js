
let actions = [];
let start,stop;

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

window.addEventListener('message', receiveMsgFromWin,false)

function receiveMsgFromWin(e) {
    let eData = e.data;
    let pttWindow = e.source;
    let pttOrigin = e.origin;
    
    // 消息判断和处理
    switch (eData.status) {
        // 原型可能嵌套在第二层框架中，需将原型发来的链接在框架中重新打开
        case "init":{
            console.log("需要重定向");
            $("iframe#pttPrv").attr("src", eData.url);
            break;
        }
        // 已准备好，开始跟踪
        case "isReady":{
            startRec();
            console.log("已就绪,开始录制");
            break;
        }
        // 跟踪中，原型将事件数据传过来
        case "rec" :{
            let action = eData.log;
            actions.push(action);
            
            // 判断是否完成最后一步
            if(action.eventType == stop.eventType &&
                action.target.domId == stop.target.domId &&
                action.target.nodeName == stop.target.nodeName &&
                action.target.innerText == stop.target.innerText){
                    // 停止跟踪
                    postToWin.status = 'stepRec_over';
                    pttWindow.postMessage(postToWin,pttOrigin);
                    $.ajax({
                        type: "patch",
                        url: "",
                        data: {
                            isCompleted: true,
                            actions : actions                   
                        },
                        success: function (response) {
                            if(window.confirm("您已完成该任务")){
                                location = "../"
                            }
                        }
                    });
                }
            
            console.log("已捕获事件："+ action.eventType);
            break;
        }
        default: {
            
        }
    }

    function startRec(){
        postToWin.status = 'stepRec_start';
        pttWindow.postMessage(postToWin,pttOrigin);
    }

    // todo 原型未设置插件的提示。
}

// function getNextTask() {
//     // url参数表示用户是否完成当前测试任务全部步骤;
//     $.get(`${RECEIVER}/userTests?ptturl=${PTTURL}`,
//         function (data, textStatus, jqXHR) {
//             if (data == 'finished') {
//                 // 服务器返回任务全部完成的信号,跳转到感谢页
//                 window.location = `/thanks`; 
//                 // todo
//             }else if(data == 'init'){
//                 // 服务器返回该原型尚未注册或没有设置测试任务
//                 if(window.confirm('该原型尚未设置测试任务，是否现在前往设置')){

//                     // 通过参数先查询原型是否存在，如果不存在，则服务器先创建原型
//                     // 然后待服务器返回一个原型设置的页面链接
//                     $.post(`${RECEIVER}/ptts`, 
//                         {
//                             ptturl:`${PTTURL}`
//                         },
//                         function (data,status) {
//                             console.log('已创建一条原型记录'+data);
//                             window.parent.location.href = `${RECEIVER}/ptts/${data}`;
//                         })
//                     // todo 将设置链接指向生产环境
//                     // window.location = `http://proto.zhoulongchun.com/ptts?ptturl=${PTTURL}`
//                 }
//             } else {
//                 // 否则跳转到下一个任务页;
//                 // 服务器将设置一个任务对象到Cookie中
//                 task = JSON.parse($.cookie('task'));
//                 window.location.href = task.url;
//             }
//         },
//     );
// }


// function queryString(getObj,str){
//     var string = (str!== undefined) ? str : window.location.search;
//     var result = string.match(new RegExp("[^\?\&]+=[^\?\&]+","g"));
//     if(result == null){
//         result = '';
//     }else if(getObj){
//         var params = {};
//         for(var i = 0; i < result.length; i++){
//             var res = result[i].split('=');
//             var key = res[0],
//                 value = res[1];
//             params[key] = value;
//         }
//         result = params;
//     }
//     return result;
// }