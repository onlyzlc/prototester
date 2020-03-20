$(function () {
    $("#deleteTask").click(function (e) {
        if(window.confirm("是否删除此任务")){
            $.ajax({
                type: "delete",
                url: "",
                success: function (response) {
                    location.pathname = '/tasks'
                }
            });
        }
    })
    $("input#zoom").change(function(e){
    })
});

// v.completedTest = userTests.filter(usertest => usertest.isCompleted);
// 获取各次测试的完成时间求平均值
// if (v.testCount > 0) {
//     // 筛选完成任务的测试
//     v.completedTest = userTests.filter(usertest => usertest.isCompleted);
//     v.completedRatio = Math.round((v.completedTest.length/v.testCount)*100);
//     // 获取各次测试的完成时间求平均值
//     let avgOfDuration = 0;
//     for (const userTest of v.completedTest) {
//         avgOfDuration += userTest.totalDuration;
//     }
//     v.avgOfDuration = (avgOfDuration / v.testCount / 1000).toFixed(2);
// }