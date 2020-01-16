var mongoose = require('mongoose');
var ActionSchema = require('./model_action');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    taskId:{
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: true,
    },
    steps:[ActionSchema],
    url: {
        type: String,
        trim: true,
        required: true,
    },
    owner: String,
    prototype:{
        type: String,
        trim: true
    }
})

TaskSchema.virtual('stepsCount').get(function(){
    return this.steps.length;
});
// 完成率
TaskSchema.virtual('completionRate').get(function(){  
    
})
// 测试次数
TaskSchema.virtual('testFeq').get(function(){  
    
})

Taskchema.query.byName = function(name){
    // 不区分大小写的查询
    return this.where({ name: new RegExp(name, 'i') });
}
Taskchema.query.byUrl = function(url){
    // 不区分大小写的查询
    return this.where({ url: new RegExp(url, 'i') });
}
Taskchema.query.byTaskId = function(id){
    // 不区分大小写的查询
    return this.where({ taskId: id });
}
Taskchema.query.byPtt = function(ptt){
    // 不区分大小写的查询
    return this.where({ prototype: ptt });
}
module.exports = mongoose.model('Task',TaskSchema);