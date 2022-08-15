const dotenv = require("dotenv")
dotenv.config()
const child_process = require('child_process');
const tgnotice=require('./tgnotice')

function runbash(filepath){
  var command = "rclone ls " + process.env.rclonedir + "/" + filepath.split('/')[0] + "/" + filepath.split('/')[1].slice(0, -4).substring(0,21)  + "/ 2> /dev/null | wc -l"
  var runbashcommand = "cd " + process.env.workdir + " && bash ./runbash.sh " + '\"' + filepath.split('/')[0] + '\" ' + '\"' + filepath.split('/')[1].slice(0, -4).substring(22) + '\" ' + '\"' + filepath.split('/')[1].slice(0, -4).substring(0,21) + '\"'
  child_process.exec(runbashcommand, function(error, stdout){
    if(error) {
        console.error('error: ' + error);
        return;
    }
    console.log(stdout);
    child_process.exec(command, function(error, stdout){
      if(error) {
          console.error('error: ' + error);
          return;
      }
      var text = "文件路径: " + filepath.slice(0, -4);
      if( 4 == stdout && process.env.uploadorigin ){
        var banner = "BiliLive提醒: [" + filepath.split('/')[0].split('-')[1] + "](https://live.bilibili.com/" + filepath.split('/')[0].split('-')[0] + ")的直播文件已全部上传成功 ！🎉"
        tgnotice(banner, text)
      } else if ( 2 == stdout && process.env.uploadorigin ){
	var banner = "BiliLive提醒: [" + filepath.split('/')[0].split('-')[1] + "](https://live.bilibili.com/" + filepath.split('/')[0].split('-')[0] + ")的直播文件已全部上传成功 ！🎉"
        tgnotice(banner, text)
      } else {
        var banner = "BiliLive提醒: [" + filepath.split('/')[0].split('-')[1] + "](https://live.bilibili.com/" + filepath.split('/')[0].split('-')[0] + ")的直播文件部分上传失败！⚠请及时查阅！"
        tgnotice(banner, text)
      };
    });
  });
}

module.exports = runbash;
