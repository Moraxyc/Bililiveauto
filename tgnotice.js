const dotenv = require("dotenv")
dotenv.config()
const axios = require('axios').default;

function tgnotice(banner, text){
    var url = 'https://api.telegram.org/bot' + process.env.TG_TOKEN + '/sendMessage'
    axios({
        url: url,
        method: 'post',
        /*如若使用代理访问Telegram Bot Api，请取消注释
        proxy: {
          protocol: 'http',
          host: '127.0.0.1',
          port: 7890,
          auth: {
            username: 'me',
            password: 'handsome'
            }
        },
        代理服务器配置*/
        data: {
            chat_id: process.env.TG_CHAT_ID,
            text: banner + "\n" + text,
            parse_mode: "Markdown"
        }
    }).then(function (response) {
    if (response.status == 200) {
        console.log(" Telegram notice 发送成功.")
    } else {
        console.log(" Telegram notice 发送失败." + response.status)
    }
  }).catch(function (error) {
    console.log(" Failed connect: \n " + error);
  });
}

module.exports = tgnotice;
