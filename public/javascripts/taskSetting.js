$(document).ready(function () {
    // 暂存并用于发送给服务器的数据
    let steps;
    // 用于按顺序记录删除项的序号
    let deleted = [];
    // 获取步骤数据
    $.getJSON("steps",
        function (data, textStatus, jqXHR) {
            steps = data;
            // 如果步骤数量为2，则不允许删除任何步骤
            if(steps.length == 2){
                $("#steps li .remove").attr("disabled","disabled")
            }
        }
    )

    // 等待iframe载入完成，发送数据进去
    let $iframe = $("iframe")
    let iframe = $iframe.get(0);
    if (iframe.attachEvent) {
        iframe.attachEvent("onload", sendSteps);
    } else {
        iframe.onload = sendSteps;
    }

    // 按钮:点击查看事件元素
    $("#steps li").click(function (e) {
        let i = $(this).attr('data-num');
        let step = steps[i];
        // 使用锚点对框架中的元素定位
        $iframe.attr("src", step.url+"#"+step.target.domId);
    })
    // 按钮：删除步骤，刷新标记
    $("#steps li .remove").click(removeStep);

    // 按钮：撤销
    $("#undo").click(undo);

    // 表单提交程序
    $("form#setting").submit(function (e) {  
        e.preventDefault();
        $.ajax({
            type: "patch",
            url: "./steps",
            data: {
                actions: steps.filter(item=>!item.isDel)
            },
            success: function (response) {
                console.log("任务步骤更新成功");
                location.pathname = "/tasks";
            }
        });
        // 阻止表单默认提交
        return false;
    })

    // 按钮：取消，返回上一页
    $("#cancel").click(function (e) {  
        e.preventDefault();
        location = "/tasks";
    })
    // 按钮：删除，返回上一页
    $("#delete").click(function (e) {  
        e.preventDefault();
        if(window.confirm("是否删除该任务？")){
            $.ajax({
                type: "delete",
                url: ".",
                success: function (response) {
                    console.log("任务已删除");
                    location.pathname = "/tasks";
                }
            });
        }
    })

    function sendSteps() {
        // 需去除#之后的内容
        let currentPage = $iframe.attr("src").split("#")[0];
        // 发送给框架的数据,
        let postToWin = {status:"render"}; 
        // 筛选出当前页面的人工步骤，过滤掉移除的步骤；
        postToWin.steps = steps.filter((item) => 
            (!item.isDel) &&
            (item.url === currentPage) && 
            (item.eventType !== "load") && 
            (item.eventType !== "unload")
        )
        
        iframe.contentWindow.postMessage(postToWin, currentPage);
    }

    // 移除的逻辑：在用户点击移除的项中标记[isDel]属性，并将移除项序号在[deleted]数组中入栈
    function removeStep(e) {   
        e.preventDefault();
        event.stopPropagation();
        
        // 获取移除步骤的序号
        let i = $(this).parent("li").attr('data-num');

        // 标记移除项
        steps[i].isDel = true;
        // 在堆栈中记录移除项的序号
        deleted.push(i);
        console.log("移除:"+i);
        
        $(this).parent().hide();

        // 移除节点后，若步骤数量少于2，则禁用所有X按钮
        if(steps.length-deleted.length <= 2){
            $("#steps li .remove").attr("disabled","disabled")
        }
        // 有移除项就启用【恢复】按钮
        if(deleted.length > 0){
            $("#undo").removeAttr("disabled")
        }

        sendSteps();
    }

    // 恢复的逻辑：点击恢复时，将[deleted]数组出栈一个序号，然后在[steps]数组中去除此序号项的[isDel]属性
    function undo(e) {
        e.preventDefault();
        if(deleted.length > 0 ){
            let i = deleted.pop(); 
            
            console.log("恢复:");
            console.log(i);
            $(`[data-num=${i}]`).show();

            // 删除移除的标记
            delete steps[i].isDel ;

            // 恢复节点后，若步骤数量少于2，则重新启用所有X按钮
            if(steps.length-deleted.length > 2){
                $("#steps li .remove").removeAttr("disabled")
            }
            sendSteps();
        }        

        // 如果没有可恢复的步骤了，则禁用恢复按钮
        if(deleted.length == 0){
            $("#undo").attr("disabled","disabled")
        }
    }

    function verify() {
        if($.trim($('#taskName>input')) === ""){
            $('#taskName').addClass('inputError null');
            $('#taskName>input').focus();
        }
        return true;
    }

    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        if (jqxhr.status = 400) {
            $('#taskName>input').focus();
            $('#taskName').addClass('inputError repeat');
        }
    })
});


