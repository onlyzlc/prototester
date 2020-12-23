// 加载截图插件
// var ele= document.createElement("script");
// ele.setAttribute("type", "text/javascript");
// ele.setAttribute("src", "http://html2canvas.hertzen.com/dist/html2canvas.min.js");
// document.querySelector('head').appendChild(ele)
//(pttType == 'Axure')? 'ax_default':
import {SODAR_HOST} from './index.js'
const pttType = 'Axure'
const elmTypes = "input,select,textarea,label,[type=submit]"
let elmSelector = elmTypes
if (pttType === 'Axure') elmSelector += ',.ax_default'
const eventTypes = ['click','change']

// 记录event对象的某些属性,采用解构赋值传入
const Recorder = function ({type, timeStamp, target:{nodeName, id, innerText, value} }) {
    this.action = {
        type: type,
        timeStamp: timeStamp,
        url: location.href,
        pageTitle: document.title,
        target: {
            nodeName: nodeName,
            id: id,
            innerText: innerText,
            value: value
        }
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
    console.log(`${this.action.type} the element: <${this.action.nodeName}>  ${this.action.innerText || this.action.value } at ${this.action.timeStamp}`);
}
// 事件记录和发送
function record(e) {
    // 阻止事件冒泡，对于Axure中的动态面板的多层ax_default有效————只截取最底层的那个元素事件
    if(e.target){
        if(e.target.matches(elmSelector)){
            let rec = new Recorder(e);
            rec.post();
        }
    }
};
 
// 启用跟踪, 绑定事件
export function monitor() {
    console.log('开始记录');
    for (const type of eventTypes) {
        window.addEventListener(type, record, false);
    }
}

// 关闭跟踪
export function monitorOff() {
    for (const type of eventTypes) {
        window.removeEventListener(type, record, false);
    }
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