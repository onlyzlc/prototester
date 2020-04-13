var urlTestOk = false;
let tip = $("<p></p>").addClass('tip');
window.addEventListener('message',receiveMessage);
function receiveMessage(e) {  
    var origin = e.origin;
    console.log("消息来源:"+origin);
    // todo 判断来源
    console.log("消息:"+event.data);
    if(event.data === "thisPttUrlIsOk"){
        urlTestOk = true;
        tip.text("链接可用");
        $("#newPtt").append(tip);
    }
} 
// 添加原型
$(function () {
    var frameLoadOver = false;
    let iframe = $("#testPttUrl").get(0);
    if (iframe.attachEvent){
        iframe.attachEvent("onload", function(){
            frameLoadOver = true;
        });
    } else {
        iframe.onload = function(){
            frameLoadOver = true;
        };
    }
    
    $('#newPtt').submit(function (e) { 
        $(".tip").remove(); 
        e.preventDefault();
        if(!frameLoadOver){
            tip.text("正在测试链接,请稍后重新提交");
            $("#newPtt").append(tip);    
        }else if(!urlTestOk){
            tip.text("此链接无效,请检查插件地址是否正确");
            $("#newPtt").append(tip);   
        }else{
            $.ajax({
                type: "post",
                url: ".",
                data: {
                    pttUrl: $.trim($("#pttUrl").val())
                },
                success: function (response) {
                    location = "./"+response;
                },
                error: function (response) {  
                    if(response.status == 409){
                        tip.text(response.responseText);
                        $("#newPtt").append(tip);
                    }
                }
            });
        }
    })

    $("input#pttUrl").change(function (e) {  
        // frameLoad($('iframe#testPttUrl').get(0), "test");
        urlTestOk = false;
        frameLoadOver = false
        $(".tip").remove();
        $('iframe#testPttUrl').attr("src",$.trim($(this).val()));
    })
});