$(document).ready(function () {
    $('#usersEmail').change(function (e) {  
        
    })
    $("form").submit(function(e){
        let userData = {};
        userData.email = $.trim($('#usersEmail').val());
        userData.password = $.trim($("#userPassword").val());
        $.ajax({
            type: "post",
            url: "/user/register",
            data: userData,
            success: function (response) {
                console.log(response);
            },
            error: function(response){
                if(response.responseText === "EmailRepeat"){
                    alert("该账号已存在。")
                }
            }
        });
        return false;
    })
});