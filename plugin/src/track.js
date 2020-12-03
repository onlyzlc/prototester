// 加载截图插件
// var ele= document.createElement("script");
// ele.setAttribute("type", "text/javascript");
// ele.setAttribute("src", "http://html2canvas.hertzen.com/dist/html2canvas.min.js");
// document.querySelector('head').appendChild(ele)
//(pttType == 'Axure')? 'ax_default':
import {SODAR_HOST} from './index.js'
const pttType = 'Axure'
const targetClass = (pttType === 'Axure')?'.ax_default':'*'
const elmTypes = "input,select,textarea,label"
const elmSelector = targetClass + ',' + elmTypes
const eventTypes = ['click','change']

// 记录event对象的某些属性,采用解构赋值传入
const Recorder = function ({type, timeStamp, target:{nodeName, id, innerText} }) {
    this.action = {
        type: type,
        timeStamp: timeStamp,
        nodeName: nodeName,
        id: id,
        innerText: innerText,
        pageUrl: location.href,
        pageTitle: document.title
    }
}
// 发送日志
Recorder.prototype.post = function () {
    sessionStorage.setItem(this.action.time,JSON.stringify(this.action))
    console.log('准备发送给:'+ SODAR_HOST)
    parent.postMessage({
        cmd : "post",
        content: this.action
    },SODAR_HOST);
    console.log(`${this.action.type} the element: <${this.action.nodeName}>  ${this.action.innerText} at ${this.action.timeStamp}`);
}
// 事件记录和发送
function record(e) {
    // 阻止事件冒泡，对于Axure中的动态面板的多层ax_default有效————只截取最底层的那个元素事件
    // 事件过滤
    if(e.target){
        if(e.target.matches(elmSelector)){
            let rec = new Recorder(e);
            rec.post();
        }
    }

    // switch (action.eventType) {
    //     // 表单元素和普通元素点击事件，需记录不同的对象信息：e.target和this
    //     case "change": {
    //         action.target.domId= e.target.id;
    //         action.target.nodeName= e.target.nodeName.toLowerCase();
    //         // action.target.innerText= $(e.target).val().trim();
    //         break;
    //         // todo 需将改变后的值记录下来
    //     }
    //     case "click": {
    //         action.target.nodeName = this.nodeName.toLowerCase();
    //         action.target.domId = this.id;
    //         action.target.innerText = this.innerText.trim() || this.value || e.target.id;
    //         break;
    //     }
    // }
    
};
 
// 启用跟踪, 绑定事件
export function monitor() {
    console.log('开始记录');
    for (const type of eventTypes) {
        window.addEventListener(type, record, false);
    }
    // $(formElms).on("change", record);
    // $("[type=submit]").click(record);
    // $("div.ax_default").click(record);
    // // $(window).on('unload', record);

    // // 只在ax_default叶子节点上绑定，移除掉其父节点绑定
    // $("div.ax_default").has(".ax_default").off("click",record);

    // // 排除所有与表单元素及其父元素的点击事件
    // $(formElms).off("click",record);
    // formElmsArr.forEach(elm => {
    //     $("div.ax_default").has(elm).off("click",record);
    // });    
}

// 关闭跟踪
export function monitorOff() {
    // $(window).off('unload', record);
    // $(formElms).off("change", record);
    // $("div.ax_default ").off("click", record);
}

// 渲染标记
export function renderSteps(steps) {
    // 删除已有标记
    // $("._mark,._markDes").remove();
    console.log("渲染步骤标记");
    console.log(steps);
    
    let i = 0;
    steps.forEach(step => {
        
        // 在有目标元素上增加两个兄弟元素，显示边框和事件描述
        // if(step.target.domId !== undefined){
        //     let target = $("#"+step.target.domId);
        //     if(!target.hasClass("ax_default")){
        //         target = target.parent(".ax_default");
        //     }
            
        //     let des = $("<li></li>").text(++i +"."+ step.eventType);
        //     if(target.children("._markDes").length){
        //         target.children("._markDes").append(des);
        //     }else{
        //         let markDesDiv = $("<ul></ul>").addClass("_markDes").append(des);
        //         target.append(markDesDiv);
        //     }

        //     if(target.children("._mark").length === 0){
        //         let markDiv = $("<div></div>").addClass("_mark");
        //         target.append(markDiv);
        //     }
        // }
    })    
}

// axure特征
// 标记步骤的元素
// $("head").append(`
//     <style>
//         ._mark{
//             border: 1px #F44336 dashed !important;
//             width: 100%;
//             height: 100%;
//             background-color: rgba(244, 67, 54, 0.2);
//             transition: background 100ms;
//             position: absolute;
//             z-index:1000;
//         }
//         ._markDes{
//             color: white;
//             position: absolute;
//             z-index: 1000;
//             display: flex;
//             margin: 0;
//             list-style: none;
//             padding-left: 0;
//             right: 0;
//         }
//         ._markDes li{
//             background: #F44336;
//             padding: 1px 2px;
//             margin-right: 1px;
//         }
//     </style>
// `) 