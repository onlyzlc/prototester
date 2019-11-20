var mongoose = require('mongoose');
var Ptt = require('./models/model_ptt');
var Task = require('./models/model_task');
var UserTest = require('./models/model_userTest');

module.exports = function () {
    Ptt.findOne().byName('p1').exec(function(err,doc){
        doc.tasks.push({
            "name": "task002",
            "steps": [
                {
                    "url": "p1/ptts.html",
                    "pageTitle": "页面",
                    "eventType": "load",
                    "target": {
                        "domId": "",
                        "nodeName": "",
                        "innerText": ""
                    }
                },
                {
                    "url": "/protos/p1/ptts.html",
                    "pageTitle": "ptts",
                    "eventType": "click",
                    "target": {
                        "domId": "",
                        "nodeName": "span",
                        "innerText": "复制链接"
                    }
                }
            ]
        });
        doc.save();
    })
    
    
    // task.save(function(err,doc){
    //     if(err) throw err;
    //     console.log('已创建任务:'+ doc.id);
        
    // });

    // var ptt = new Ptt();
    
}