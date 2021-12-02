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

  // 如果是收到了邮件，并且邮件标题带有 [自动] 表示有应用忘记打卡了
  let autoMark = "[自动]";
  let title = notification.getText();
  if ("com.tencent.androidqqmail" == notification.getPackageName() && title.indexOf(autoMark) != -1) {
    title = title.substring(title.indexOf(autoMark) + autoMark.length);
    let path = "/storage/emulated/0/脚本/" + title + ".js";
    engines.execScriptFile(path);
  }
}
