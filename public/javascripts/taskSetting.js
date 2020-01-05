$(function () {
    // 获取步骤数据并存储到本地
    $.getJSON(location+"/steps", 
        function (data, textStatus, jqXHR) {
            console.log(data);
            let i = 0;
            data.forEach(step => {
                sessionStorage.setItem(i, JSON.stringify(step))
                i++;
            });

            let $iframe = $("iframe")
            let iframe = $iframe .get(0);
            let currentPage = $iframe.attr("src");
            // 过滤当前页面中的人工步骤
            let currentSteps = data.filter( (item) => item.url === currentPage && item.eventType !== "load" && item.eventType !== "unload")
            frameLoad(iframe, currentSteps, currentPage)

            // 绑定步骤按钮查看事件
            $("#steps li").mouseenter(function (e) {  
                let i = $(this).attr('data-num');
                let step = JSON.parse(sessionStorage.getItem(i));
                if($iframe.attr("src") == step.url){
                    iframe.contentWindow.postMessage(step.target.domId ,step.url);
                }else{
                    $(this).click(function (e) {  
                        $iframe.attr("src",step.url);
                        frameLoad(iframe, i, step.url)
                    })
                }   
            })    
        }
    )

    function verify(){
        if($('#taskName>input').val() ===''){
            $('#taskName').addClass('inputError null');
            $('#taskName>input').focus();
            return false;
        }
        
        try {
            if(JSON.parse(localStorage.getItem('Logs')).length == 0){
                alert('请在原型中将任务步骤演示一遍.');
                return false;
            }
        } catch (error) {
            localStorage.removeItem('Logs') ;           
            alert('请在原型中将任务步骤演示一遍.');
            return false;            
        }
        
        return true;
    }

    // 提交前还需检查是否已设步骤
    function submit(){
        if(verify()){
            let postBody ={
                name: $('#taskName>input').val(),
                steps: JSON.parse(localStorage.getItem('Logs')),
            }
            $.post(location.pathname, postBody,
                function (data, textStatus) {
                    console.log(data);
                    localStorage.removeItem('Logs');
                    location.pathname = location.pathname.replace('/newtask','');
                },
            );
        }
    }

    $(window).resize();

    $(document).ajaxError(function(event, jqxhr, settings, thrownError){
        if(jqxhr.status = 400){
            $('#taskName>input').focus();
            $('#taskName').addClass('inputError repeat');
        }
    })

});


function frameLoad(iframe, postData,url) {  
    // 等待iframe载入完成，发送数据进去
    if (iframe.attachEvent){
        iframe.attachEvent("onload", function(){
            iframe.contentWindow.postMessage(postData,url);
        });
    } else {
        iframe.onload = function(){
            iframe.contentWindow.postMessage(postData,url);
        };
    }    
}