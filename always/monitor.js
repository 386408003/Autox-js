// 使用本地存储
var storage = storages.create("386408003@qq.com:config");
// 引入工具组件
var utils = require(storage.get("rootPath") + 'utils/utils.js');

// 开启通知栏监听
events.observeNotification();
events.onNotification(function (notification) {
  printNotification(notification);
});
toast("监听通知栏中。。。");

// 监听回调方法
function printNotification(notification) {
  // log("应用包名: " + notification.getPackageName());
  // log("通知文本: " + notification.getText());
  // log("通知优先级: " + notification.priority);
  // log("通知目录: " + notification.category);
  // log("通知时间: " + new Date(notification.when));
  // log("通知数: " + notification.number);
  // log("通知摘要: " + notification.tickerText);

  let autoMark = "[自动]";
  let autoAlarm = "[闹钟]";
  // 如果是收到了邮件
  if ("com.tencent.androidqqmail" == notification.getPackageName()) {
    let title = notification.getText();
    // 邮件标题带有 [自动] 表示有应用忘记打卡了
    if(title.indexOf(autoMark) != -1) {
      let scriptName = title.substring(title.indexOf(autoMark) + autoMark.length);
      let path = storage.get("rootPath") + scriptName + ".js";
      engines.execScriptFile(path);
    }
    // 邮件标题带有 [闹钟] 表示需要找手机了
    if(title.indexOf(autoAlarm) != -1) {
      // 查找手机
      utils.findPhone();
    }
  }
}
