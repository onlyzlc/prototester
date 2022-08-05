import {SODAR_HOST} from './index.js'


// 渲染标记
export function renderSteps(actions) {
    let actions = 
    // 删除已有标记
    // $("._mark,._markDes").remove();
    console.log("渲染步骤标记");
    console.log(actions);
    
    let i = 0;
    actions.forEach(action => {
        if (action.type == 'load') return
        // 在有目标元素上增加两个兄弟元素，显示边框和事件描述
        if(action.target.id !== undefined){
            let target = $("#"+action.target.id);
            if(!target.hasClass("ax_default")){
                target = target.parent(".ax_default");
            }
            
            let des = $("<li></li>").text(++i +"."+ action.eventType);
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