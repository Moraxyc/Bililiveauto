const dotenv = require("dotenv")
dotenv.config()
const express = require('express');
const app = express();
const processFile = require('./processFile')
const appriseNotice = require("./apprise")

const PORT = process.env.port || 8081;

app.use(express.json({ extended: false }));

//  POST 请求
app.post('/', function (req, res) {
  const { EventType, EventData } = req.body;
  //读取body中的数据
  res.sendStatus(200);
  console.log(`Webhook: 录播姬 POST 到达 事件：${EventType}`);
  const { AreaNameParent, AreaNameChild, Title, RoomId, Name, FileOpenTime, RelativePath } = EventData;
  const text = `分区: ${AreaNameParent} ${AreaNameChild}\n标题: [${Title}](https://live.bilibili.com/${RoomId})`;

  //判断直播事件：开播、下播、录制、文件关闭等
  switch (EventType) {
    case "FileClosed":
      processFile(RelativePath, RoomId, Name, FileOpenTime);
      break;
    case "StreamStarted":
      const startedBanner = `BiliLive提醒: "${Name}"的直播开始了，快来看看吧！`;
      appriseNotice(startedBanner, text);
      break;
    case "SessionStarted":
      const recordingBanner = `BiliLive提醒: "${Name}"的直播已经开始录制了！\n如果赶不上直播, 也可以看回放哦!`;
      appriseNotice(recordingBanner, text);
      break;
    case "StreamEnded":
      const endedBanner = `BiliLive提醒: "${Name}"的直播结束了，欢迎下次再观看！`;
      appriseNotice(endedBanner, text);
      break;
    default:
      console.log(`Webhook: 判断类型: ${EventType} => 提醒未发送`);
  };
})

//监听端口
const server = app.listen(PORT, function () {

  const { address, port } = server.address();
  console.log(`BiliLiveAuto脚本正在运行, 地址为 http://${address}:${port}`);
})

