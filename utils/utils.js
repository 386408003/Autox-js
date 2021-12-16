// 使用本地存储
var storage = storages.create("386408003@qq.com:config");
var height = device.height;
var width = device.width;

var utils = {};
/**
 * 发送邮件
 * @param {string} appName 邮件标题，需要打卡的应用名称
 * @param {string} msg 邮件内容
 * @param {string} autoMark 标题前缀
 */
utils.sendMail = function (appName, msg, autoMark) {
  let url = storage.get("serverUrl");
  let mailTo = storage.get("mailTo");
  autoMark = autoMark || "[自动]";
  let title = autoMark + appName;
  let message = { "to": mailTo, "subject": title, "text": msg };
  http.postJson(url, message);
};

/**
 * 唤醒屏幕并使用密码解锁手机
 * @param {string} password 解锁密码
 */
utils.unlock = function (password) {
  let maxRetryTimes = 10; //尝试解锁10次
  while (!device.isScreenOn() && maxRetryTimes--) {
    device.wakeUp();
    sleep(500);
  }
  // 输入密码界面
  while (packageName("com.android.systemui").findOnce() && maxRetryTimes--) {
    // 滑动时间只能是 201 - 239 之间的数
    swipe(width / 2, height / 4 * 3, width / 2, height / 4, 201);
    sleep(1500);
    for (let i = 0; i < password.length; i++) {
      desc(password[i]).findOnce().click();
    }
    sleep(500);
  }
};

/**
 * 寻找手机，手机自动打开闹钟
 */
utils.findPhone = function () {
  // 解锁屏幕
  utils.unlock(storage.get("password"));
  // 打开闹钟软件
  launchApp("时钟");
  sleep(2000);
  if (text("06:30").findOnce()) {
    click("06:30");
  } else {
    click("7:00");
  }
  sleep(700);
  click("铃声");
  sleep(700);
  if (text("从文件中选择").findOnce()) {
    click("从文件中选择");
  }
  sleep(700);
  if (text("爸爸打电话.mp3").findOnce()) {
    click("爸爸打电话.mp3")
  } else {
    click("Alarm Beep");
  }
};

/**
 * 记录日志，统计根据参数判断前台是否提示
 * @param {string} msg 要记录或者提示的消息
 * @param {boolean} tshow 前台是否显式
 */
utils.toast_console = function (msg, tshow) {
  console.log(msg);
  if (tshow) toast(msg);
}

module.exports = utils;
