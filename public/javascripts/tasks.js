$(document).ready(function () {
    $(".publish").click(function () {
        let taskId = $(this).parent("li").attr("data-taskId");
        let currentStatus = $(this).parent("li").attr("data-status");
        let s = (currentStatus==="unpublished")?"published":"unpublished";
        $.ajax({
            type: "patch",
            url: "/tasks/"+taskId+"/status",
            data: {status:s},
            success: function (response) {
                $(`li[data-taskId=${taskId}]>.status`).text((response=="unpublished")?("未发布"):("已发布"));
                $(`li[data-taskId=${taskId}]>.publish`).text((response=="unpublished")?("发布"):("撤下"));
                $(`li[data-taskId=${taskId}]`).attr("data-status",response);
            }
        });
    })
});