var mongoose = require('mongoose');
var UserActionSchema = require('./model_action');
var Schema = mongoose.Schema;

// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;

// 定义用户测试模式
// 为用户的一次任务执行过程, 当用户从第一个步骤开始时, 新建此对象
// 将objectId传给cookie
var UserTestSchema = new Schema({
    task: {
        ref: 'Task',
        type: Schema.Types.ObjectId,
    },
    ip: String,
    log:[UserActionSchema],
    mouseTrack: [],
    isCompleted:{
        type:Boolean,
        default: false
    },
    thinkDone: {
        type: Boolean,
        default: false
    },
    difficulty: [{
        type: String
    }]
})

UserTestSchema.virtual('testSign').get(function(){
    // return {
    //     id: this.id,
        
    // }
})

UserTestSchema.virtual('starttime').get(function(){

})

UserTestSchema.virtual('durationOfEachStep').get(function(){
    var n = [];
    return n;
})

// UserTestSchema.virtual('')

UserTestSchema.virtual('totalDuration').get(function(){
    let n ;
    n = this.log[this.log.length-1].time - this.log[0].time
    return n;
})

// 虚拟属性
// • 开始时间(步骤1页面刷新后更新)
// • 各步骤时长[]
// • 总时长
// • 各步骤赞数[]
// • 各步骤踩数[]
// • 修改次数>2的控件[{控件,次数}]
// • 漏填次数>1的控件[{控件,次数}]
// • 偏离任务的步骤[{步骤序号,次数}](点击了任务外的元素)

module.exports = mongoose.model('UserTest',UserTestSchema);