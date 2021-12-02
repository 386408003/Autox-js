var utils = {};

/**
 * 给媳妇发送邮件
 * @param {string} appName 邮件标题，需要打卡的应用名称
 * @param {string} msg 邮件内容
 * @param {string} autoMark 标题前缀
 */
 utils.sendMail = function (appName, msg, autoMark) {
  autoMark = autoMark || "[自动]";
  let url = "http://192.168.0.103:8081/wx/mail/send";
  // let url = "http://10.3.154.134:8081/wx/mail/send";
  // let person = "386408003@qq.com";
  let person = "1083534586@qq.com";
  let message = {"to": person, "title": (autoMark + appName), "message": msg};
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
 * 寻找媳妇手机，手机自动打开闹钟
 */
utils.findPhone = function () {
  launchApp("时钟");
  sleep(2000);
  click("06:30");
  sleep(700);
  click("铃声");
  sleep(700);
  click("从文件中选择");
  sleep(700);
  click("爸爸打电话.mp3");
};

module.exports = utils;
