var mongoose = require('mongoose');
var ActionSchema = require('./model_action');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    steps:[ActionSchema]
})

TaskSchema.virtual('stepsCount').get(function(){
    return this.steps.length;
});

TaskSchema.virtual('CompletionRate').get(function(){  
    
})

module.exports = TaskSchema;