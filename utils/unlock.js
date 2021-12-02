var unlock = {};
unlock.unlock = function (password) {
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
module.exports = unlock;
