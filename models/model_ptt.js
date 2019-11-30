var mongoose = require('mongoose');
var TaskSchema = require('./model_task');
var UserTest = require('../models/model_userTest');

var Schema = mongoose.Schema;

// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;

// 定义原型模式
var PttSchema = new Schema({
    name: {
        type: String,
        trim: true,
        index: true,
        unique: true,
    },
    pttId: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: true,
    },
    url: String,
    folder: String,
    owner: [String],
    tasks: [TaskSchema],
    userTestCount:{
        type: Number,
        default: 0
    }
})

PttSchema.query.byName = function(name){
    // 不区分大小写的查询
    return this.where({ name: new RegExp(name, 'i') });
}

PttSchema.query.nextTask = function (currentTaskId) {  
    
}

// 未经验证
// PttSchema.virtual('people').get(function(){
//     var t = this.tasks;
//     var count = 0;
//     var i = 0;
//     for (const item of t) {
//         UserTest.countDocuments({"task":item.id},(err,c)=>{
//             if(err) return err;
//             count += c;
//             i++;
//             if(i == t.length) return count;
//         })
//     }
// })


module.exports = mongoose.model('Ptt',PttSchema);