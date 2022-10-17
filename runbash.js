const dotenv = require("dotenv")
dotenv.config()
const child_process = require('child_process');
const tgnotice = require('./tgnotice')

function runbash(filepath, roomid, name, title, fileopentime) {
  let timeid = `${fileopentime.substring(0, 4)}年${fileopentime.substring(5, 7)}月${fileopentime.substring(8, 10)}日${fileopentime.substring(11, 13)}时${fileopentime.substring(14, 16)}分${fileopentime.substring(17, 19)}秒${fileopentime.substring(20, 27)}`
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
