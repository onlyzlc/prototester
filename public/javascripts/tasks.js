$(document).ready(function () {
    $(".publish").click(function () {
        let $this = $(this);
        let $thisItem = $this.parent("li");
        let taskId = $thisItem.attr("data-taskId");
       	let cur_status = $thisItem.attr("data-status");
        $.ajax({
            type: "patch",
            url: "/tasks/"+taskId+"/status",
            data: {
            	status: (cur_status === "published")?"unpublished":"published"
            },
            success: function (response) {
                console.info(response);
                $this.text(response==="published"?"撤下":"发布");
                $thisItem.attr("data-status",response)
                    .children(".status").text(response==="published"?"已发布":"已撤下")
                
            },
            error: function (response) {
            	console.error(response);  
            }
        });
    })
  
});