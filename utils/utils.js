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
    // 返回主页
    home();
    if (packageName("com.miui.home").findOnce()) {
      break;
    }
  }
};

/**
 * 寻找手机，手机自动打开闹钟
 */
utils.findPhone = function () {
  let findTimes = 10;
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
  if (text("铃声").findOnce()) {
    click("铃声");
  } else if (text("更多设置").findOnce()) {
    click("更多设置");
  } else {
    desc("更多设置").findOnce().click();
    sleep(700);
    click("元素动态铃声");
  }
  sleep(700);
  if (text("从文件中选择").findOnce()) {
    click("从文件中选择");
  }
  sleep(700);
  // 媳妇手机
  if (text("爸爸打电话.mp3").exists()) {
    while (text("爸爸打电话.mp3").exists() && findTimes--) {
      click("爸爸打电话.mp3");
      sleep(3000);
    }
  // 华为手机
  } else if (text("Alarm Beep").exists()) {
    while (text("Alarm Beep").exists() && findTimes--) {
      click("Alarm Beep");
      sleep(3000);
    }
  // 小米手机
  } else {
    while (text("元素动态铃声").exists() && findTimes--) {
      click("元素动态铃声");
      sleep(10000);
    }
  }
};

/**
 * 播放音乐
 * 管理来电铃声（TYPE_RINGTONE）
 * 提示音（TYPE_NOTIFICATION）
 * 闹钟铃声（TYPE_ALARM）
 * @param {Integer} playTimes 播放时长，默认 2 秒
 * @param {Integer} volume 声音大小，默认 6
 */
utils.playMusic = function (playTimes, volume) {
  var volume = volume || 10
  var playTimes = playTimes || 2000
  var music = android.media.RingtoneManager.TYPE_ALARM
  var mp = new android.media.MediaPlayer();
  device.setMusicVolume(volume)
  mp.setDataSource(context, android.media.RingtoneManager.getDefaultUri(music));
  mp.prepare();
  mp.start();
}

/**
 * 手机震动
 * @param {Integer} vibrate_time 震动时间，默认 1 秒
 */
utils.phoneVibrate = function (vibrate_time) {
  var vibrate_time = vibrate_time || 1000
  device.vibrate(vibrate_time);
}

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
