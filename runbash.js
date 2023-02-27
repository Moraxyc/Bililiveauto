const dotenv = require("dotenv")
dotenv.config()
const child_process = require('child_process');
const tgnotice = require('./tgnotice')
const moment = require('moment-timezone');

function runbash(filepath, roomid, name, title, fileopentime) {
  let timeid =moment(fileopentime).tz('Asia/Shanghai').format('YYYY年MM月DD日HH时mm分ss秒SSS')
  let command = `rclone ls "${process.env.rclonedir}/${roomid}-${name}/${timeid}/" 2> /dev/null | wc -l`
  let runbashcommand = `cd ${process.env.workdir} && bash ./runbash.sh "${roomid}-${name}" "${title}" "${timeid}" "${filepath.slice(0, -4)}"`
  child_process.exec(runbashcommand, function (error, stdout) {
    if (error) {
      console.error('error: ' + error);
      return;
    }
    console.log(stdout);
    child_process.exec(command, function (error, stdout) {
      if (error) {
        console.error('error: ' + error);
        return;
      }
      var text = `文件路径: ${roomid}-${name}/${timeid}`;
      if (4 == stdout || 2== stdout) {
        var banner = `BiliLive提醒: [${name}](https://live.bilibili.com/${roomid})的直播文件已全部上传成功 ！🎉`
        tgnotice(banner, text)
       } else {
        var banner = `BiliLive提醒: [${name}](https://live.bilibili.com/${roomid})的直播文件部分上传失败！⚠请及时查阅！`
        tgnotice(banner, text)
      };
    });
  });
}

module.exports = runbash;
