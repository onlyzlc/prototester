var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;

var QuestionnaireSchema = new Schema({
    questions: [
        {
            topic: '题目',
            options: ['非常同意','比较同意','一般','反对','强烈反对']
        }
    ]
})

module.exports = mongoose.model.call('Questionnaire', QuestionnaireSchema)