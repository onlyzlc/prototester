$(function () {
    // 获取数据包
    $.getJSON(location.pathname+"/data", 
        function (data, textStatus, jqXHR) {
            console.log(data);
            
        }
    );
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