// 使用本地存储
var storage = storages.create("386408003@qq.com:config");
// 引入工具组件
var utils = require(storage.get("rootPath") + 'utils/utils.js');

// 开启通知栏监听
events.observeNotification();
events.onNotification(function (notification) {
  printNotification(notification);
});
utils.toast_console("监听通知栏中。。。", true);

// 监听回调方法
function printNotification(notification) {
  // utils.toast_console("应用包名: " + notification.getPackageName());
  // utils.toast_console("通知文本: " + notification.getText());
  // utils.toast_console("通知优先级: " + notification.priority);
  // utils.toast_console("通知目录: " + notification.category);
  // utils.toast_console("通知时间: " + new Date(notification.when));
  // utils.toast_console("通知数: " + notification.number);
  // utils.toast_console("通知摘要: " + notification.tickerText);

  let autoMark = "[自动]";
  let autoAlarm = "[闹钟]";

  let title = notification.getText();
  // 如果收到了邮件，并且 title 有值
  if ("com.tencent.androidqqmail" == notification.getPackageName() && title) {
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
