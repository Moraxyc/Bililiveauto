# Bililiveauto

兼容[B站录播姬](https://github.com/BililiveRecorder/BililiveRecorder)的自动转封装、自动上传、弹幕转码脚本

## 下载

```bash
git clone https://github.com/Moraxyc/Bililiveauto
```

## 配置

此脚本使用`.env`文件作为配置文件，模板如下：
```yaml
# .env

#是否开启debug模式，true/false
DEBUG=false

#是否上传原始文件？
UPLOAD_ORIGIN=false

#是否删除本地文件？
DELETE_LOCAL=true

#文件上传完成后是否提醒
NOTICE_FILE_UPLOADED=true

#哪些格式的文件上传完成后需要提醒
NOTICE_FILE_FORMAT=flv mkv

#时区
TZ=Asia/Shanghai

#监听端口
port=8081

#DanmakuFactory二进制文件路径
DANMU_FC_PATH=

#录播姬录制文件路径
BILI_FILE_PATH=

#rclone
RCLONE_CONFIG=/root/.config/rclone/rclone.conf
RCLONE_PATH=

#Apprise配置url，如若配置多个，可通过空格分割
APPRISE_URLS=
```

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

录播姬录制下来的文件为flv格式，但编码就是h264，所以可以很方便地转封装为mkv格式以提高播放器兼容性

### 自动上传

自动上传使用rclone

rclone在后续`npm install`中，将由"rclone.js"自动下载

`RCLONE_CONFIG`填写配置文件路径，如果从未安装过rclone，可以通过`npx rclone config`添加配置，并通过`npx rclone config file`获取配置文件路径

`RCLONE_PATH`填写想要上传的远程路径即可，如`od:Bililive`

配置及使用建议Google一下，教程太多就不反复造轮子了

### 通知

脚本使用[Apprise](https://github.com/caronc/apprise)发送通知，配置方法见[其项目wiki](https://github.com/caronc/apprise/wiki)

由于Apprise是Python，因此需要安装python并用pip安装apprise

```sh
apt install python3 pip -y

pip install apprise
```

基本结构为URL，例如Telegram的Apprise URL便是`tgram://123456:654545shbjkjadkshj653146/114514`

该配置支持多个通知，只需用空格隔开即可

## 运行

运行本脚本需要先安装nodejs 

建议使用nvm脚本快速安装

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install --lts
```

### 安装依赖

```bash
npm install
```

然后在此脚本目录运行`node server.js`即可

### pm2持久化运行

安装pm2

```bash
npm install pm2 -g
```

运行bililiveauto

```bash
pm2 start server.js --name bililiveauto
```

配置pm2开机自启
root用户全自动，非root用户请执行命令后根据提示复制命令执行
```bash
pm2 startup
```

储存当前服务列表并加入自启
```bash
pm2 save
```

此致，你的bililiveauto将自动在后台运行并在重启时自启。可使用`pm2 status`查看服务状态，`pm2 logs bililiveauto`查看日志，`pm2 monit`打开状态监视器。

## 最后一步

在录播姬的设置里, 将监听地址填入"webhook v2"即可, 如"http://127.0.0.1:8081"

# 鸣谢

[Apprise](https://github.com/caronc/apprise)

[Bilibili直播](https://live.bilibili.com)

[B站录播姬](https://github.com/BililiveRecorder/BililiveRecorder)

[DanmakuFactory](https://github.com/hihkm/DanmakuFactory)

[Rclone](https://github.com/rclone/rclone)

[FFmpeg](https://git.ffmpeg.org/ffmpeg.git)
