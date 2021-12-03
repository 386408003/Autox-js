// 使用本地存储
var storage = storages.create("386408003@qq.com:config");

var utils = {};
/**
 * 给媳妇发送邮件
 * @param {string} appName 邮件标题，需要打卡的应用名称
 * @param {string} msg 邮件内容
 * @param {string} autoMark 标题前缀
 */
 utils.sendMail = function (appName, msg, autoMark) {
  let url = storage.get("serverUrl");
  let mailTo = storage.get("mailTo");
  autoMark = autoMark || "[自动]";
  let title = autoMark + appName;
  let message = {"to": mailTo, "title": title, "message": msg};
  http.post(url, message);
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
  if (packageName("com.android.systemui").findOnce()) {
    // 滑动时间只能是 201 - 239 之间的数
    swipe(500, 2000, 500, 1000, 201);
    sleep(1500);
    for (let i = 0; i < password.length; i++) {
      desc(password[i]).findOne().click();
    }
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
  } else {
    click("本地音乐");
  }
  sleep(700);
  if (text("爸爸打电话.mp3").findOnce()) {
    click("爸爸打电话.mp3")
  } else {
    click("接电话");
  }
};
module.exports = utils;
