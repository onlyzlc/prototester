// 监听文件变化，处理文件的初始化
const fs = require('fs');
const path = require('path');
const Ptt = require('./models/model_ptt');

const rootDir = path.join(__dirname, '/public/protos');
var timer;
var watcher;

// 监听到文件夹变化时，清除计时器，将变化的文件堆栈到数组中；
// 然后启动计时器；

// 先拼接字符串s，将s替代html文件中的head尾巴
var insertHead = "\n\t\t<!-- 以下是原型自动测试器插入的引用-->\n"
insertHead += "\t\t<meta http-equiv='Cache-Control' content='no-cache'/>\n";
insertHead += "\t\t<meta http-equiv='Pragma' content='no-cache'/>\n";
insertHead += "\t\t<meta http-equiv='Expires' content='-1'/>\n";
insertHead += "\t\t<script src='http://localhost:8081/javascripts/jquery.cookie.js' ></script>\n";
insertHead += "\t\t<script src='http://localhost:8081/javascripts/monitor_f.js' defer></script>\n";
insertHead += "\t</head>\n";

// html处理程序
function htmlInit() {

    let filesLog = Array.from(files);
    console.log(filesLog);

    files.clear();

    var folders = [];
    var htmls = [];

    const reg = /index\.html|start_c_1\.html|start_g_0\.html|start\.html/;

    for (const log of filesLog) {
        var eventType = log.split(':')[0];
        var fileName = log.split(':')[1];

        // 排除顶层文件夹的change记录
        if (eventType == 'change' && !fileName.includes('\\')) continue;
        if (fileName == null) continue;

        var p = path.join(rootDir, '\\', fileName);

        try {
            // 检查是否存在
            fs.accessSync(p);
            var stat = fs.statSync(p);

            // 是否根节点,是否文件夹 
            if (fileName.split('\\').length == 1 &&
                stat.isDirectory()) {
                folders.push(fileName);
                continue;
            }

            // 是否原型的 html 页面
            else if (fileName.endsWith('.html') &&
                !reg.test(fileName) &&
                fileName.split('\\').length == 2) {

                htmls.push(fileName);
                continue;
            }
        } catch {
            // 当前目录或文件不存在
            console.log('已删除:' + fileName);
            continue;
        }

    }

    console.log('要处理的文件夹:' + folders.toString());

    for (const folder of folders) {
        // fs.readdirSync()
        Ptt.create({
            name: folder,
        }, function (err) {
            // 如果是重复的文件夹
            if (err && err.code!=  undefined  &&  err.code== 11000) console.error(err);
            else if(err) throw err;
        })
    }

    let i = htmls.length;
    if (i == 0) {
    console.log("没有要处理的HTML");
        return;
    }

    console.log("要处理的的html：" + htmls.length);

    watcher.close();
    console.log('关闭监听');

    for (const file of htmls) {
        // 遍历fs，依每个文件类型在s中插入对应的链接
        const p = path.join(rootDir, '\\', file)
        fs.readFile(p, (err, data) => {
            if (err) {
                console.log(err);
                i--;
                if (i == 0) {
                    console.log('启动监听');
                    startWatch();
                }
            } else {
                let oldHtml = data.toString();
                var htmlStr;
                if (oldHtml.includes('</head>')) {
                    htmlStr = oldHtml.replace("</head>", insertHead);
                } else {
                    // 如果html中没有head标签,则先写入一个head标签
                    htmlStr = oldHtml.concat("\t<head>" + insertHead);
                }
                fs.writeFile(p, htmlStr, (err) => {
                    if (err) console.log(err);
                    i--;
                    console.log('已修改：' + file + "--还有" + i + '个');
                    if (i == 0) {
                        console.log('修改完成, 启动监听');
                        startWatch();
                    }
                })
            }


        })
    }
}

var files = new Set();
// 监听处理程序
function progress(eventType, filename) {
    // 关闭定时器，延时处理
    clearTimeout(timer);
    
    files.add(eventType + ":" + filename);

    // 延时处理
    timer = setTimeout(htmlInit, 5000);
}

// 启动监听
function startWatch() {
    // 原型数据存储
    watcher = fs.watch(rootDir, {
        recursive: true
    }, progress);
    console.log('开始监听文件夹');

}

// function prototypesInit() {
//     startWatch();
// }

module.exports = {
    startWatch: startWatch,
};