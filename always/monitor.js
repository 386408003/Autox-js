// 使用本地存储
var storage = storages.create("386408003@qq.com:config");
// 引入工具组件
var utils = require(storage.get("rootPath") + "utils/utils.js");
// 判断脚本是否存活，是的话直接退出
if(isAlive()) {
  utils.toast_console("脚本已启动，无需再次启动！", true);
  exit();
}
// 开启通知栏监听
events.observeNotification();
events.onNotification(function (notification) {
  // printNotification(notification);
  analyzeMail(notification);
  analyzeMessage(notification);
});
utils.toast_console("监听通知栏中。。。", true);

/**
 * 监听回调方法，打印日志
 */
function printNotification(notification) {
  utils.toast_console("应用包名: " + notification.getPackageName());
  utils.toast_console("通知文本: " + notification.getText());
  utils.toast_console("通知优先级: " + notification.priority);
  utils.toast_console("通知目录: " + notification.category);
  utils.toast_console("通知时间: " + new Date(notification.when));
  utils.toast_console("通知数: " + notification.number);
  utils.toast_console("通知摘要: " + notification.tickerText);
}

/**
 * 解析通知栏邮件信息
 * 自动打卡和闹钟功能使用
 */
function analyzeMail(notification) {
  let autoMark = "[自动]";
  let autoAlarm = "[闹钟]";

  let title = notification.getText();
  utils.toast_console("通知文本: " + title);
  // 如果收到了邮件，并且 title 有值
  if ("com.tencent.androidqqmail" == notification.getPackageName() && title) {
    // 邮件标题带有 [自动] 表示有应用忘记打卡了
    if (title.indexOf(autoMark) != -1) {
      let scriptName = title.substring(title.indexOf(autoMark) + autoMark.length);
      let path = storage.get("rootPath") + scriptName + ".js";
      engines.execScriptFile(path);
    }
    // 邮件标题带有 [闹钟] 表示需要找手机了
    if (title.indexOf(autoAlarm) != -1) {
      // 查找手机
      utils.findPhone();
    }
  }
}

/**
 * 解析通知栏短信信息
 * 上汽云计算短信验证码自动获取
 */
function analyzeMessage(notification) {
  // 短信发送者的号码
  let phoneNumber = ["10655960068100456740", "10655025713034448954"];
  // 10655960068100456740: 【上汽云计算】您的手机验证码为657361,有效时间2分钟。
  let tickerText = notification.tickerText;
  utils.toast_console("通知摘要: " + tickerText);
  // 如果收到了短信，并且 tickerText 有值，并且是设置的手机号发送的短信
  if ("com.android.mms" == notification.getPackageName() && tickerText
      && (tickerText.indexOf(phoneNumber[0]) != -1) || tickerText.indexOf(phoneNumber[1])) {
    let number = tickerText.match(/您的手机验证码为(\d+),有效时间2分钟。/);
    let value = number[1].toString();
    utils.toast_console("获取的验证码为：" + value);

    let ipAddr = storage.get("devUrl");
    const PORT = 7101;
    value = utils.encryptString(value);
    let url = "http://" + ipAddr + ":" + PORT + "?clipboard=" + value;
    utils.toast_console(url);
    http.get(url, {}, function (res, err) {
      if (err) {
        console.error(err);
        return;
      }
      utils.toast_console(res.body.string());
    });
  }
}

/**
 * 停掉除了本脚本以及 always 目录以外的正在运行的脚本
 */
function isAlive() {
  // 获取全部正在运行的脚本引擎
  var allEngines = engines.all();
  for (var i = 0; i < allEngines.length; i++) {
    let curEngine = allEngines[i];
    // 判断是否正在运行
    if (curEngine != engines.myEngine() && curEngine.source.toString().indexOf("monitor") != -1) {
      return true;
    }
  }
  return false;
}
