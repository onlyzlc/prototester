// 加载截图插件
// var ele= document.createElement("script");
// ele.setAttribute("type", "text/javascript");
// ele.setAttribute("src", "http://html2canvas.hertzen.com/dist/html2canvas.min.js");
// document.querySelector('head').appendChild(ele)

// 主机地址 RECEIVER 定义于 sodar.js



// 表单元素
const formElmsArr = ['input','select','textarea','label'];
const formElms = formElmsArr.toString;

// log对象
const Action = function () {
    this.eventType = "";
    this.target =  {
        innerText: "",
        domId: "",
        nodeName: "",
    };
    this.url = location.href;
    this.pageTitle= document.title;
    this.time = Date.now();
}

// 与Sodar窗口对接
if(window !== window.top){
    // 监听父窗口发送的消息
    window.addEventListener("message", receiveMsgFromWin, false);
    let postToWin={};
    // 是否为第二层
    if(window.parent === window.top){
        postToWin.status = "isReady";
        postToWin.pageTitle = document.title;
        // 生成截图
        // let timer = setInterval( ()=> {
        //     if( html2canvas === undefined ) {
        //         console.log( '截图插件尚未加载完...' );
        //     } else{
        //         clearInterval(timer)
        //         html2canvas(document.querySelector('body'))
        //             .then((canvas) => {
        //                 postToWin.imageData = canvas.toDataURL("image/png")
        //                 window.top.postMessage(postToWin, RECEIVER);
        //                 console.log("向窗口 %s 发送消息: %o",RECEIVER,postToWin);
        //         })
        //     }
        // },1000)
        
    }else{
        postToWin.status = "init";
        postToWin.url = location.href;
        window.top.postMessage(postToWin, RECEIVER);
        console.log("向窗口 %s 发送消息: %o",RECEIVER,postToWin);
    }
}

function receiveMsgFromWin(e){
    let status = e.data.status;
    // console.log(status);
    switch (status) {
        case "stepRec_start":{
            console.log("开始跟踪");
            let action = new Action;
            action.target.innerText = document.title;
            action.eventType = 'load';
            action.time = Date.now();
            let postToWin={
                status : "rec",
                log: action
            };
            window.parent.postMessage(postToWin,RECEIVER);

            monitor();
            break;
        }
        case "stepRec_over":{
            console.log("结束跟踪");
            // 录制结束时，将数据发送给newTask.js
            monitorOff();
            break;
        }
        case "render":{
            // 接收自taskSetting.js，将步骤标记渲染到页面上
            renderSteps(e.data.steps);
        }
    }
}



// axure特征
// 标记步骤的元素
$("head").append(`
    <style>
        ._mark{
            border: 1px #F44336 dashed !important;
            width: 100%;
            height: 100%;
            background-color: rgba(244, 67, 54, 0.2);
            transition: background 100ms;
            position: absolute;
            z-index:1000;
        }
        ._markDes{
            color: white;
            position: absolute;
            z-index: 1000;
            display: flex;
            margin: 0;
            list-style: none;
            padding-left: 0;
            right: 0;
        }
        ._markDes li{
            background: #F44336;
            padding: 1px 2px;
            margin-right: 1px;
        }
    </style>
`)  

// 启用跟踪, 绑定事件
function monitor() {
    $(formElms).on("change", record);
    $("[type=submit]").click(record);
    $("div.ax_default").click(record);
    // $(window).on('unload', record);

    // 只在ax_default叶子节点上绑定，移除掉其父节点绑定
    $("div.ax_default").has(".ax_default").off("click",record);

    // 排除所有与表单元素及其父元素的点击事件
    $(formElms).off("click",record);
    formElmsArr.forEach(elm => {
        $("div.ax_default").has(elm).off("click",record);
    });    
}

// 关闭跟踪
function monitorOff() {
    // $(window).off('unload', record);
    $(formElms).off("change", record);
    $("div.ax_default ").off("click", record);
}


// 事件记录和发送
function record(e) {
    
    // 阻止事件冒泡，对于Axure中的动态面板的多层ax_default有效————只截取最底层的那个元素事件
    // event.stopPropagation();

    let action = new Action;
    action.time = Date.now();
    action.eventType = e.type;
    switch (action.eventType) {
        // 表单元素和普通元素点击事件，需记录不同的对象信息：e.target和this
        case "change": {
            action.target.domId= e.target.id;
            action.target.nodeName= e.target.nodeName.toLowerCase();
            action.target.innerText= $(e.target).val().trim();
            break;
            // todo 需将改变后的值记录下来
        }
        case "click": {
            action.target.nodeName = this.nodeName.toLowerCase();
            action.target.domId = this.id;
            action.target.innerText = this.innerText.trim() || this.value || e.target.id;
            break;
        }
    }
    console.log(action);

    let postToWin={
        status : "rec",
        log: action
    };
    parent.postMessage(postToWin,RECEIVER);
};

function renderSteps(steps) {
    // 删除已有标记
    $("._mark,._markDes").remove();
    console.log("渲染步骤标记");
    console.log(steps);
    
    let i = 0;
    steps.forEach(step => {
        
        // 在有目标元素上增加两个兄弟元素，显示边框和事件描述
        if(step.target.domId !== undefined){
            let target = $("#"+step.target.domId);
            if(!target.hasClass("ax_default")){
                target = target.parent(".ax_default");
            }
            
            let des = $("<li></li>").text(++i +"."+ step.eventType);
            if(target.children("._markDes").length){
                target.children("._markDes").append(des);
            }else{
                let markDesDiv = $("<ul></ul>").addClass("_markDes").append(des);
                target.append(markDesDiv);
            }

            if(target.children("._mark").length === 0){
                let markDiv = $("<div></div>").addClass("_mark");
                target.append(markDiv);
            }
        }
    })    
}

function clearCookies(e) {
    console.log('清除Cookies');
    $.ajax({
        type: 'delete',
        url: '/userTests',
    })
}
