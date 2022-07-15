var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;

const options = ['非常同意','比较同意','一般','反对','强烈反对']

var TopicSchema = new Schema({
    type: {
        type: String
    },
    question: String,
})

var QuestionnaireSchema = new Schema({
    topics: [TopicSchema]
})

module.exports = mongoose.model.call('Questionnaire', QuestionnaireSchema)