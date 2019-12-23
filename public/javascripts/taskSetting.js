$(function () {

    $(".icon.point").click(function (e) {  
        let url = $(e.target).attr('data-url');
        let id = $(e.target).attr("data-target-domId");
        if($("iframe").attr("src") !== url){
            $("iframe").attr("src",url);
        }
        document.querySelector('iframe').contentWindow.postMessage(id,url);
    })

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
