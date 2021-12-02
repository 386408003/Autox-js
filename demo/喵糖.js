/*---原载于https://www.cnblogs.com/smileglaze/p/15440620.html 仅供学习交流，下载后请于24小时内删除*/

/*--------版本v1.11根据个人情况修改以下内容----------*/

//长等待时间常量，用于应用启动、广告等较长时间等待，如果网络不好或手机卡请增加此数值，默认6秒
var LONG_TIME = 6000;

//短等待时间常量，用于例如返回等每步操作后的等待，如果手机卡请增加此数值，默认3秒
var SHORT_TIME = 3000;

//浏览15秒任务默认等待时间，默认20s，如果觉得等的时间太长可以减小此常量，单位为毫秒
var WAITING_TIME = 20000;
//var WAITING_TIME = 18000;

//是否在领取结束后自动投骰子，默认否，但在需要自动投骰子的情况，可以开启此功能
var AUTO_CAST = false;

//是否领取支付宝喵糖，默认是。支付宝任务较少，可以手动完成
var ALIPAY_FLAG = true;


/*--------根据个人情况修改以上内容----------*/

auto.waitFor();
var height = device.height;
var width = device.width;
setScreenMetrics(width, height);

//停掉除了本脚本以外的正在运行的脚本
killOthersAlive();

//启用悬浮窗，用于提示，为没有音量下键的手机提供了关闭悬浮窗可以直接停止脚本的方式
var w = floaty.window(
  <frame gravity="left">
    <text id="text" textColor="black" bg='#ffffff'>★★★Tips:按下[音量-]键或者长按[悬浮窗内文字]可随时结束脚本</text>
  </frame>
);
//设置悬浮窗变量
floatW();

//启用按键监听，按下音量下键脚本结束
keyDetector();

//保持屏幕常亮，最多三十分钟
device.keepScreenDim(30 * 60 * 1000);
//开始刷喵糖
lingQuTaobao();
//lingQuZhifubao();

//启用按键监听，按下音量下键脚本结束
function keyDetector() {
  threads.start(function () { //在子进程中运行监听事件
    events.observeKey();
    events.on("key", function (code, event) {
      var keyCodeStr = event.keyCodeToString(code);
      console.log(code);
      console.log(keyCodeStr);
      if (keyCodeStr == "KEYCODE_VOLUME_DOWN") {
        toast("检测到音量下键，程序已结束。");
        //取消屏幕常亮
        device.cancelKeepingAwake();
        exit();
      }
    });
  });
}

function lingQuTaobao() {
  launchApp("淘宝");
  ui.run(function () {
    w.text.setText("★★★Tips:请手动打开淘宝喵糖活动[做任务赚喵糖]界面");
  });
  t = text("赚糖领红包").findOne(SHORT_TIME);
  if (t != null) {
    t.click();
    sleep(SHORT_TIME);
  }
  text("做任务赢奖励").waitFor();
  sleep(1000);
  ui.run(function () {
    w.text.setText("★★★Tips:按下[音量-]键或者长按[悬浮窗内文字]可随时结束脚本");
  });
  toast("赚喵糖");
  sleep(SHORT_TIME);
  if (text("每日签到领喵糖(0/1)").exists()) {
    t = text("每日签到领喵糖(0/1)").findOne().parent().parent().child(1);
    if (t.text() == "去完成") {
      toast("每日签到领喵糖");
      t.click();
      sleep(SHORT_TIME);
    }
  }
  if (text("逛逛天猫主会场(0/1)").exists()) {
    t = text("逛逛天猫主会场(0/1)").findOne().parent().parent().child(1);
    if (t.text() == "去完成") {
      toast("逛逛天猫主会场");
      t.click();
      sleep(SHORT_TIME);
      sleep(WAITING_TIME);
      back();
      sleep(SHORT_TIME + 1000);
      if (text("残忍离开").exists()) {
        text("残忍离开").findOne().click();
        sleep(SHORT_TIME);
      }
      if (!text("做任务赢奖励").exists()) {
        back();
        sleep(SHORT_TIME);
      }
    }
  }
  while (text("去浏览").exists()) {
    toast("存在去浏览");
    text("去浏览").findOne().click();
    sleep(SHORT_TIME);
    sleep(WAITING_TIME);
    back();
    sleep(SHORT_TIME + 1000);
    if (text("残忍离开").exists()) {
      text("残忍离开").findOne().click();
      sleep(SHORT_TIME);
    }
    if (!text("做任务赢奖励").exists()) {
      back();
      sleep(SHORT_TIME);
    }
  }
  while (text("浏览15s立得").exists()) {
    t = text("浏览15s立得").findOne().parent().parent().parent().child(1);
    if (t.text() == "去完成") {
      toast("存在浏览任务");
      t.click();
      sleep(SHORT_TIME);
      sleep(WAITING_TIME);
      back();
      sleep(SHORT_TIME + 1000);
      if (text("残忍离开").exists()) {
        text("残忍离开").findOne().click();
        sleep(SHORT_TIME);
      }
      if (!text("做任务赢奖励").exists()) {
        back();
        sleep(SHORT_TIME);
      }
    } else {
      break;
    }
  }
  while (text("浏览15秒立得").exists()) {
    t = text("浏览15秒立得").findOne().parent().parent().parent().child(1);
    if (t.text() == "去完成") {
      toast("存在浏览任务");
      if (t.parent().child(0).child(0).text() == "浏览天天领现金(0/1)") {
        t.click();
        sleep(SHORT_TIME);
        if (text("打开链接").exists()) {
          text("打开链接").findOne().click();
          sleep(SHORT_TIME);
        }
      } else {
        t.click();
        sleep(SHORT_TIME);
      }
      sleep(WAITING_TIME);
      back();
      sleep(SHORT_TIME + 1000);
      if (text("残忍离开").exists()) {
        text("残忍离开").findOne().click();
        sleep(SHORT_TIME);
      }
      if (!text("做任务赢奖励").exists()) {
        back();
        sleep(SHORT_TIME);
      }
    } else {
      break;
    }
  }
  if (ALIPAY_FLAG) {
    //领取支付宝喵糖
    sleep(SHORT_TIME);
    lingQuZhifubao();
  }
  toast("领取完成...");
  if (AUTO_CAST) {
    //自动投骰子
    text("关闭").findOne().click();
    sleep(SHORT_TIME);
    while (textContains("点击赢红包").exists()) {
      toast("自动投骰子");
      textContains("点击赢红包").findOne().click();
      sleep(5000);
    }
    text("关闭").findOne().click();
  }
  home();
  //刷支付宝喵糖
  toast("脚本结束^_^");
  //取消屏幕常亮
  device.cancelKeepingAwake();
  sleep(SHORT_TIME);
  exit();
}

function lingQuZhifubao() {
  toast("正在打开支付宝...");
  click(width / 2, height - 100);
  sleep(LONG_TIME);
  text("赚糖领红包").waitFor();
  text("赚糖领红包").findOne().click();
  //b=text("赚糖领红包").findOne().bounds();
  //click(b.centerX(), b.centerY());
  sleep(SHORT_TIME);
  if (text("签到得喵糖完成可获得1个喵糖，点击可以去完成").exists()) {
    text("签到得喵糖完成可获得1个喵糖，点击可以去完成").findOne().click();
    sleep(SHORT_TIME);
  }
  toast("已签到");
  while (className("android.widget.Button").textContains("逛一逛").textContains("可以去完成").exists()) {
    toast("存在逛一逛");
    className("android.widget.Button").textContains("逛一逛").textContains("可以去完成").findOne().click();
    sleep(SHORT_TIME);
    sleep(WAITING_TIME);
    back();
    sleep(SHORT_TIME + 1000);
    if (text("开心收下").exists()) {
      text("开心收下").findOne().click();
      sleep(SHORT_TIME);
    }
    if (!textContains("今日已签到").exists()) {
      back();
      sleep(SHORT_TIME);
      if (text("开心收下").exists()) {
        text("开心收下").findOne().click();
        sleep(SHORT_TIME);
      }
    }
  }
  text("关闭赚喵糖任务面板").findOne().click();
  sleep(SHORT_TIME);
  if (text("去逛逛").exists()) {
    text("去逛逛").findOne().click();
  } else {
    swipe(width / 2, height - 300, width / 2, 0, 800);
  }
  sleep(SHORT_TIME * 2);
  if (!textContains("今日喵糖已得，可继续浏览").exists()) {
    for (var i = 0; i < 3; i++) {
      j = 2 * i + 1;
      toast("逛逛会场（" + (i + 1).toString() + "/3）");
      textContains("点击可以去逛逛").findOnce(j).click();
      sleep(SHORT_TIME);
      sleep(WAITING_TIME);
      back();
      sleep(SHORT_TIME);
      if (!textContains("浏览3个会场可得1个喵糖").exists()) {
        back();
        sleep(SHORT_TIME);
      }
      if (text("开心收下").exists()) {
        text("开心收下").findOne().click();
        sleep(SHORT_TIME);
        break;
      }
    }
  }
  swipe(width / 2, 100, width / 2, height - 200, 800);
  sleep(SHORT_TIME);
}


function floatW() {
  //悬浮窗不会自动关闭
  setInterval(() => { }, 1000);
  w.setPosition(0, height / 4);
  w.setSize(400, 300);
  //悬浮窗可调整大小
  w.setAdjustEnabled(true);
  //退出悬浮窗即结束脚本
  //w.exitOnClose();
  //长按悬浮窗内文字结束脚本
  w.text.longClick(() => {
    //取消屏幕常亮
    device.cancelKeepingAwake();
    toast("检测到长按悬浮窗文字，脚本终止");
    //try...catch把exit()函数的异常捕捉，则脚本不会立即停止，仍会运行几行后再停止
    try {
      exit();
    } catch (err) { }
    //直接exit()的话坚持不到return的时候
    return true;
  });
}

function killOthersAlive() {
  //获取全部正在运行的脚本引擎
  var allEngines = engines.all();
  //log(allEngines);
  for (var i = 0; i < allEngines.length; i++) {
    //停掉除了本脚本以外的正在运行的脚本
    if (allEngines[i] != engines.myEngine()) {
      allEngines[i].forceStop();
    }
  }
}