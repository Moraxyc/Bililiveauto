const dotenv = require("dotenv")
dotenv.config()

const debug = process.env.DEBUG === "true";
const childProcess = require("child_process");
const appriseURLs = process.env.APPRISE_URLS;

/**
 * appriseNotice()函数用于向指定的URL发送通知消息。
 * @param {string} title - 标题
 * @param {string} msg - 通知内容
 * @returns {Promise<string>} - 返回成功或失败的消息
 */
async function appriseNotice(title, msg) {
    const args = ["-vv", "-b", msg, appriseURLs];
    if (title) {
        args.push("-t");
        args.push(title);
    }
    const s = childProcess.spawn("apprise", args);
    let output = "";
    s.stdout.on("data", (data) => {
        output += data.toString();
        debug && console.log(data.toString());
    });
    s.stderr.on("data", (data) => {
        output += data.toString();
        debug && console.error(data.toString());
    });
    const code = await new Promise((resolve, reject) => {
        s.on("close", (code) => {
            if (!code && !output.includes("ERROR")) {
                console.log("Send msg Successfully")
                debug && console.log(output)
            } else {
                reject(new Error(output));
            }
        });
    });
}

module.exports = appriseNotice;

