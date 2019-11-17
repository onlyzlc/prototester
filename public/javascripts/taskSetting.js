$(function () {
    localStorage.removeItem('Logs');
    $(window).resize(function(){
        $('.pageSelector,iframe').height(
            $(window).height()-$('header').outerHeight(true)-4
        )
    });

    $('.pageSelector li').click(function(e){
        $('.pageSelector li.selected').removeClass("selected");
        $(this).addClass("selected");
        if($('#taskName>input').attr('autoInit')){
            $('#taskName>input').val($(this).text() + '页面测试任务-1');
        }
        $('iframe').attr('src', $(this).attr('data-link')).removeAttr('hidden');
        $('#page-ok').removeAttr('disabled');
    })

    $('#taskName>input').one('keypress',function(){
        $(this).removeAttr('autoInit');
    })
    
    $('#page-ok').click(function(){
        $('#tip').text('请将任务步骤演示一番');
        $('.pageSelector').hide();
        $('iframe').css('filter','blur(0px)');
        localStorage.removeItem('Logs');
        $('#page-save').removeAttr('hidden');
    })

    $('#page-cancel').click(function(){
        localStorage.removeItem('Logs');
        history.back();
    })

    $('iframe#stepRecorder').one('click',function(){
        $('#page-save').removeAttr('hidden');
    })

    $('#page-save').click(submit);

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
