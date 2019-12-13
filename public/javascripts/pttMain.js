$(function () {
    function goBack() {
        location.pathname = location.pathname.substring(0,location.pathname.lastIndexOf('/'));        
    }

    $('#addTask').click(function (e) { 
        e.preventDefault();
        // location.pathname += (location.pathname.endsWith('/'))? "newtask":'/newtask';
        // 创建任务，获取任务序号
        let pttId = e.target.getAttribute('data-pttId'),
        pttUrl =  e.target.getAttribute('data-pttUrl');
        
        $.post(`/ptts/${pttId}/task`,function (data) {  
            window.location = `${pttUrl}?setting=true&pttId=${pttId}&taskIndex=${data}`;
        })
    });

    $('#deleteTask').click(function(e){
        if(window.confirm('确认删除任务吗?')){
            $.ajax({
                type: "delete",
                url: "location.pathname",
                success: function (response) {
                    goBack();
                }
            });
        }
    })

    $('#goBack').click(function (e) { 
        e.preventDefault();
        goBack();
    });
});