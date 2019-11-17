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
    time: Date,
})

module.exports = ActionSchema ;