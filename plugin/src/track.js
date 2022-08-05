import {SODAR_HOST} from './index.js'
// 加载截图插件
// var ele= document.createElement("script");
// ele.setAttribute("type", "text/javascript");
// ele.setAttribute("src", "http://html2canvas.hertzen.com/dist/html2canvas.min.js");
// document.querySelector('head').appendChild(ele)
//(pttType == 'Axure')? 'ax_default':
// const pttType = 'Axure'
// const elmTypes = "input,select,textarea,label,[type=submit]"
// let elmSelector = elmTypes
// if (pttType === 'Axure') elmSelector += ',.ax_default'
const eventTypes = ['click','change', 'load']

// 记录event对象的某些属性,采用解构赋值传入
const Recorder = function ({type, target:{nodeName, id, innerText, value} }) {
    this.action = {
        type: type,
        timeStamp: Date.now(),
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
    let rec = new Recorder(e);
    rec.post();
    // 阻止事件冒泡，对于Axure中的动态面板的多层ax_default有效————只截取最底层的那个元素事件
    // if( typeof(e.target) === 'Element' && e.target.matches(elmSelector)){
    // } else if ( typeof(e.target) === 'Document' )
};
 
// 启用跟踪, 绑定事件
export function monitor() {
    console.log('开始记录');
    let rec = new Recorder({
        type: 'load',
        target: {
            nodeName: '',
            id: '',
            innerText: '',
            value: ''
        }
    })
    rec.post()
    for (const type of eventTypes) {
        window.addEventListener(type, record, true);
    }
}

// 关闭跟踪
export function monitorOff() {
    for (const type of eventTypes) {
        window.removeEventListener(type, record, true);
    }
}
