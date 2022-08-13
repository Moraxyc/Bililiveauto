# /bin/sh

source .env

# 传递js参数
dir=$1
title=$2
timeid=$3

cd ${bilifile}
text="${timeid: 0: 4}年${timeid: 4: 2}月${timeid: 6: 2}日 ${title}"

# 弹幕处理 xml转ass
danmucl(){
${danmufc} -o ass "${bilifile}/${dir}/${text}.ass" -i xml "${bilifile}/${dir}/${timeid}-${title}.xml" 1>/dev/null
mv "${bilifile}/${dir}/${timeid}-${title}.xml" "${bilifile}/${dir}/${text}.xml"
}

# ffmpeg转封装 h264编码flv转mkv
ffmpegzm(){
ffmpeg -v 16 -i "${bilifile}/${dir}/${timeid}-${title}.flv" -c copy "${bilifile}/${dir}/${text}.mkv"
mv "${bilifile}/${dir}/${timeid}-${title}.flv" "${bilifile}/${dir}/${text}.flv"
}

rclonesc(){
rclone copy "${bilifile}/${dir}/${text}.$1" "${rclonedir}/${dir}/${timeid}/" --ignore-errors -q"
}

rmlocal(){
    rm "${bilifile}/${dir}/${text}.$1"
}

echo "开始处理弹幕"
danmulog=$(danmucl)
[ ! ${danmulog} ] && echo "弹幕处理完成" || echo "弹幕处理失败"

echo "开始处理视频"
ffmpeglog=$(ffmpegzm)
[ ! ${ffmpeglog} ] && echo "视频处理完成" || echo "视频处理出现问题！"

echo "开始上传Onedrive"
if ${uploadorigin}; then rclonelog=$(rclonesc mkv ; rclonesc flv ; rclonesc xml ; rclonesc ass); else rclonelog=$(rclonesc mkv ; rclonesc ass); fi
[ ! ${rclonelog} ] && echo "文件上传成功" || echo "文件上传出现问题！"
if ${deletelocal} && [ ! ${rclonelog} ]; then rmlog=$(rmlocal mkv ; rmlocal flv ; rmlocal xml ; rmlocal ass) ; else echo "本地文件未删除";fi
