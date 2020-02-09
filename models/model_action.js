var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const eventTypeEnum = ['load', 'click', 'unload', 'focus'];

var ActionSchema = new Schema({ 
    url: String,
    pageTitle: String,
    eventType : String,
    target : {
        domId: String,
        nodeName: {
            type:String,
            lowercase: true,
        },
        innerText: {
            type: String,
            trim: true,
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