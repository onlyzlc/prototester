var mongoose = require('mongoose');
var ActionSchema = require('./model_action');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    owner: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    name: {
        type: String,
        trim: true,
        default:"未命名任务"
    },
    description:{
    	type: String,
    	maxlength: 500,
    	required: true
    },
    taskId:{
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: true,
    },
    status:{
        type: String,
        default: "unpublished"
    },
    steps:[ActionSchema],
    
    ptt:{
        type: String,
        trim: true,
        default: ""
    },
    testing: [{
        ip: String,
        isCompleted: {
            type:Boolean,
            default: false
        },
        actions: [ActionSchema]
    }],
})

TaskSchema.virtual('url').get(function () {  
    if(this.steps.length > 0){
        return this.steps[0].url;
    }else{
        return "null"
    }
})

// 测试情况统计数据
// 测试次数
TaskSchema.virtual("testCount").get(function () {  
    return this.testing.length;
})
// 实际完成的测试结果集合
TaskSchema.virtual("completedTestings").get(function () {  
    return this.testing.filter(item => item.isCompleted);
})
// 测试完成率
TaskSchema.virtual("completedRatio").get(function () {  
    if(this.testCount){
        return Math.round((this.completedTestings.length/this.testCount)*100);
    }else{
        return 0;
    }
})
// 平均完成时间：每次完成测试的总时长/完成
TaskSchema.virtual("avgOfDuration").get(function () {
    // 获取各次测试的完成时间求平均值
    let ct = this.completedTestings;
    if(ct.length){
        let sumOfDuration = 0;
        for (const testing of ct ) {
            sumOfDuration += (testing.actions[testing.actions.length-1].time - testing.actions[0].time);
        }
        return (sumOfDuration / ct.length / 1000).toFixed(2) ;
    }else{
        return 0;
    }
})
TaskSchema.virtual("maxDuration").get(function () {
    // 求各次测试中时间最长的

})


TaskSchema.query.byName = function(name){
    // 不区分大小写的查询
    return this.where({ name: new RegExp(name, 'i') });
}
TaskSchema.query.byUrl = function(url){
    // 不区分大小写的查询
    return this.where({ url: new RegExp(url, 'i') });
}
TaskSchema.query.byTaskId = function(id){
    // 不区分大小写的查询
    return this.where({ taskId: id });
}
TaskSchema.query.byPtt = function(ptt){
    // 不区分大小写的查询
    return this.where({ prototype: ptt }); 
}
TaskSchema.query.byOwner = function(user){
    // 不区分大小写的查询
    return this.where({ owner: user });
}
module.exports = mongoose.model('Task',TaskSchema);