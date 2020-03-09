$(document).ready(function () {
    $(".publish").click(function () {
        let taskId = $(this).parent("li").attr("data-taskId");
       	let cur_status = $(this).parent("li").attr("data-status");
        $.ajax({
            type: "patch",
            url: "/tasks/"+taskId+"/status",
            data: {
            	status: (cur_status === "published")?"unpublished":"published"
            },
            secuess: function (response) {
            	console.info(response);
            },
            error: function (response) {
            	console.error(response);  
            }
        });
    })
  
});