window.addEventListener('message',receiveMessage);
function receiveMessage(e) {  
    var origin = e.origin;
    console.log("消息来源:"+origin);
    
    // todo 判断来源
    console.log("消息:"+event.data);
} 

$(function () {
    var urlTestResult = false;

    // 添加原型
    $('#newPtt').submit(function (e) {  
        e.preventDefault();
        $('.tip').remove();
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
                    let tip = $("<p></p>").addClass('tip').text(response.responseText);
                    $("#newPtt").append(tip);
                }
            }
        });
    })

    $("input#pttUrl").change(function (e) {  
        // frameLoad($('iframe#testPttUrl').get(0), "test");
        $('iframe#testPttUrl').attr("src",$.trim($(this).val()));

    })
});