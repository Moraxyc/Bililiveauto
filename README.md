# Bililiveauto

兼容[B站录播姬](https://github.com/BililiveRecorder/BililiveRecorder)的自动转封装、自动上传、弹幕转码脚本

## 下载

```bash
git clone https://github.com/Morax-xyc/Bililiveauto
```

## 配置

此脚本使用.env文件作为配置文件，模板如下：
```yaml
# .env

#run
port=8081
rclonedir=od:/Bililive # rclone中配置的上传地址
danmufc=/home/danmu/DM # danmakufactory编译后的二进制文件
workdir=/home/bililiveauto # 脚本所在文件夹
bilifile=/home/brec/file # 录播姬的工作目录

#Telegram
TG_CHAT_ID=12345678 # Telegram ID
TG_TOKEN=9876543:abcdeffhijklmnopqrstuvwxyz # Telegram Bot Token

#功能开关

#是否上传原始文件？true/false
uploadorigin=false

#是否删除本地文件？true/false
deletelocal=true
```

### 通知

本脚本使用Telegram来通知，只需要向[@userinfobot](https://t.me/userinfobot)发送任意消息即可得到Telegram ID; 向[@BotFather](https://t.me/BotFather)申请Bot获得Bot Token

最后将两者填入配置文件即可

当然要记得私聊一下你的bot

### 弹幕处理

弹幕处理使用了一个叫[DanmakuFactory](https://github.com/hihkm/DanmakuFactory)的项目

配置文件中的danmufc就需要自行编译[DanmakuFactory](https://github.com/hihkm/DanmakuFactory)后填入编译好的二进制文件地址

请在编译完成后自行配置并加上`--save`参数保存json文件以便使用。也可以使用下面我的配置：
```json
{
    "resolution": [1920, 1080],
    "scrolltime": 12.000000,
    "fixtime": 5.000000,
    "density": -1,
    "fontname": "Microsoft YaHei",
    "fontsize": 38,
    "opacity": 180,
    "outline": 0,
    "shadow": 1,
    "displayArea": 0.300000,
    "scrollArea": 0.300000,
    "bold": false,
    "showUsernames": false,
    "showMsgbox": false,
    "msgboxSize": [500, 1080],
    "msgboxPos": [10, 0],
    "msgboxFontsize": 35,
    "giftMinPrice": 0.00,
    "blockmode": ["Btm","Special","Repeat"],
    "statmode": []
}
```
保存在编译好的二进制文件所在目录下的`DanmakuFactoryConfig.json`即可

本配置去除所有特殊弹幕、只在30%的屏幕上显示弹幕、共显示12秒、去除重复弹幕

### 自动转封装

本脚本使用FFmpeg来处理视频文件

录播姬录制下来的文件为flv格式，但编码就是h264，所以可以很方便地转封装为mkv格式

### 自动上传

自动上传使用rclone

安装脚本:
```bash
curl https://rclone.org/install.sh | sudo bash
```

配置及使用建议Google一下，教程太多就不反复造轮子了

## 运行及使用

运行本脚本需要先安装nodejs 

建议使用nvm脚本快速安装

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install --lts
```
然后在此脚本目录运行`node server.js`即可

### Systemd运行

直接使用node运行可能因为其他原因中断，建议用systemd保持常态化运行

请修改下方路径为脚本所在路径

`nano /etc/systemd/system/bililiveauto.service`

```
[Unit]
Description=兼容Bililive录播姬的自动提醒以及自动转码、上传脚本

[Service]
ExecStart=/usr/bin/node <path>/Bililiveauto/server.js
Restart=always
User=brec
Group=brec
WorkingDirectory=<path>/Bililiveauto

[Install]
WantedBy=multi-user.target
```

`chown -R brec:brec <path>/Bililiveauto`

`<path>`占位符表示脚本所在目录的父目录

编辑完Systemd服务文件后运行`systemctl daemon-reload`重载Systemd，然后`systemctl start bililiveauto`开始运行，通过`systemctl status bililiveauto`确认运行没有问题后就可以安心享受自动化带来的便利了！

如果需要开机启动就
`systemctl enable bililiveauto`

# 鸣谢

[Bilibili直播](https://live.bilibili.com)

[B站录播姬](https://github.com/BililiveRecorder/BililiveRecorder)

[DanmakuFactory](https://github.com/hihkm/DanmakuFactory)

[Rclone](https://github.com/rclone/rclone)

[FFmpeg](https://git.ffmpeg.org/ffmpeg.git)