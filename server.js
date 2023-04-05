const dotenv = require("dotenv")
dotenv.config()
const express = require('express');
const app = express();
const processFile = require('./processFile')
const tgnotice = require('./tgnotice')
 
app.use(express.json({ extended: false }));
//  POST 请求
app.post('/', function (req, res) {
    //读取body中的数据
    res.sendStatus(200);
    console.log("Webhook: 录播姬 POST 到达 事件：" + req.body.EventType);
    let text = `分区: ${req.body.EventData.AreaNameParent} ${req.body.EventData.AreaNameChild}\n标题: [${req.body.EventData.Title}](https://live.bilibili.com/${req.body.EventData.RoomId})`;
    //判断直播事件：开播、下播、录制、文件关闭等
    switch(req.body.EventType) {
        case "FileClosed":
            processFile(req.body.EventData.RelativePath, req.body.EventData.RoomId, req.body.EventData.Name, req.body.EventData.FileOpenTime);
            break;
        case "StreamStarted":
            var banner = `BiliLive提醒: "*${req.body.EventData.Name}*"的直播开始了，快来看看吧！`;
            tgnotice(banner, text);
            break;
        case "SessionStarted":
            var banner = `BiliLive提醒: "*${req.body.EventData.Name}*"的直播已经开始录制了！\n如果赶不上直播, 也可以看回放哦!`;
            tgnotice(banner, text);
            break;
        case "StreamEnded":
            var banner = `BiliLive提醒: "*${req.body.EventData.Name}*"的直播结束了，欢迎下次再观看！`;
            tgnotice(banner, text);
            break;
        default:
            console.log("Webhook: 判断类型: " + req.body.EventType + " => 提醒未发送");
    };
})

//监听端口
var server = app.listen(process.env.port, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("BiliLiveAuto脚本正在运行, 地址为 http://%s:%s", host, port);
})
