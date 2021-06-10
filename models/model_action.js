var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ActionSchema = new Schema({ 
    url: String,
    pageTitle: String,
    type : String,
    timeStamp: Number,
    target : {
        id: String,
        nodeName: {
            type:String,
            lowercase: true,
        },
        innerText: {
            type: String,
            trim: true,
        },
        value: {
            type: String
        }
    },
    time: Number,
    // 到上一个行为的时长
    dur: {
        type: Number,
        default: 0
    },
    // 匹配的步骤
    matchingStep:{
        default: -1,
        type: Number
    }
})

module.exports = ActionSchema ;