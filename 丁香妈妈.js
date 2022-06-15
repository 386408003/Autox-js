/* --------版本 v0.06 根据个人情况修改以下内容---------- */

// 使用本地存储
var storage = storages.create("386408003@qq.com:config");
// 引入工具组件
var utils = require(storage.get("rootPath") + "utils/utils.js");
// 解锁屏幕
utils.unlock(storage.get("password"));

// 设置屏幕常亮时间，默认 15 分钟
const SCREEN_DIM_TIME = 15 * 60 * 1000;
// 播放课程时间，默认 11 分钟
const PLAY_COURSE_TIME = (11 * 60) * 1000;
// 长等待时间常量，用于应用启动等较长时间等待，如果网络不好或手机卡请增加此数值，默认 5 秒
const LONG_TIME = 5000;
// 短等待时间常量，用于按钮点击、返回等每步操作后的等待，如果网络不好或手机卡请增加此数值，默认 3 秒
const SHORT_TIME = 3000;
// 更短的等待时间，没有请求时的短暂等待，默认 500 毫秒
const NANO_TIME = 500;
// 启用悬浮窗，用于提示，为没有音量下键的手机提供了关闭悬浮窗可以直接停止脚本的方式
const win = floaty.window(
  <frame gravity="left">
    <text id="text" textColor="black" bg='#ffffff'>★★★Tips:按下[音量-]键或者长按[悬浮窗内文字]可随时结束脚本。</text>
  </frame>
);
// 组件找不到重试次数，默认 5 次
const maxRetryTimes = 5;
// 组件类型枚举
const COMPONENT_TYPE = {
  COMP_ID: 1,
  COMP_TEXT: 2,
  COMP_DESC: 3
}

/* --------版本 v0.06 根据个人情况修改以上内容---------- */

// 没有无障碍时候会提示无障碍模式的开启，并且开启之后,会接着继续运行。
auto.waitFor();
var height = device.height;
var width = device.width;
// 设置脚本坐标点击所适合的屏幕宽高。如果脚本运行时，屏幕宽度不一致会自动放缩坐标。
setScreenMetrics(width, height);
//停掉除了本脚本以外的正在运行的脚本
killOthersAlive();
// 设置悬浮窗变量
setFloatWindow();
// 启用按键监听，按下音量下键脚本结束
keyDetector();
// 保持屏幕常亮，默认 35 分钟
device.keepScreenDim(SCREEN_DIM_TIME);

// 开始打卡
beginClockIn();

/**
 * 打卡主方法
 */
function beginClockIn() {
  // 打开APP
  let appName = "丁香妈妈";
  launchApp(appName);
  sleep(SHORT_TIME * 2);

  // 关闭广告弹窗（有时有两个弹窗）
  while (id("close_dialog").exists()) {
    id("close_dialog").findOnce().click();
  }

  // 点击导航栏 课程 一栏
  if (findUntilClick(id("com.dxy.gaia:id/main_course"))) {
    // 计算我的我的课程位置进行点击
    clickNotClickable(COMPONENT_TYPE.COMP_TEXT, "我的课程");
    sleep(SHORT_TIME);
  } else {
    utils.toast_console("未找到课程，请检查网络！", true);
    return false;
  }
  // 播放课程
  playCourse("0～6 岁线上绘本馆");
  back();

  if (isFinish()) {
    // 打卡成功
    utils.toast_console("所有课程已打卡完毕！", true);
    utils.sendMail("丁香妈妈", "所有课程都已打卡完成！", "[打卡完成]");
    sleep(SHORT_TIME);
    // 关闭 APP
    closeApp();
  } else {
    utils.toast_console("打卡未完毕！");
  }
}

/**
 * 播放课程
 * @param {*} courseName 课程名字
 * @returns 当前课程打卡是否成功
 */
function playCourse(courseName) {
  // 点击相关课程
  clickNotClickable(COMPONENT_TYPE.COMP_TEXT, courseName);
  sleep(SHORT_TIME);
  // 关闭广告弹窗
  while (id("close_dialog").exists()) {
    id("close_dialog").findOnce().click();
  }
  // 绘本课程左边图片组件
  clickNotClickable(COMPONENT_TYPE.COMP_ID, "com.dxy.gaia:id/story_book_image_item");
  sleep(SHORT_TIME);
  // 关闭首次操作提示框
  while (id("com.dxy.gaia:id/tv_skip").exists()) {
    id("com.dxy.gaia:id/tv_skip").findOnce().click();
  }
  updateWindowTime(PLAY_COURSE_TIME / 1000);
  sleep(PLAY_COURSE_TIME);
  utils.toast_console(courseName + "：打卡结束！");
}

/**
 * 查找组件直到找到或者超过重试次数，然后进行点击
 * @param {Component} component 需要点击的组件
 * @returns 查找结果
 */
function findUntilClick(component) {
  let maxFindRetryTimes = maxRetryTimes;
  while (!component.exists() && maxFindRetryTimes--) {
    sleep(SHORT_TIME);
    utils.toast_console("第 " + (maxRetryTimes - maxFindRetryTimes) + " 次查找 " + component + " 组件！");
  }
  if (component.exists()) {
    component.findOnce().click();
    sleep(SHORT_TIME);
    return true;
  } else {
    return false;
  }
}

/**
 * 检测是否已完成打卡
 * @param {*} times 检测次数，默认 maxRetryTimes 次
 * @returns true/false
 */
function isFinish(times) {
  let maxCheckTimes = times || maxRetryTimes;
  let isFinish = text("今日已打卡").exists();
  while (!isFinish && maxCheckTimes--) {
    sleep(NANO_TIME * 2);
    isFinish = text("今日已打卡").exists();
  }
  // 已完成打卡
  return isFinish;
}

/**
 * 通过选择组件的类型和组件名字点击不可点击的组件
 * @param {*} type 组件选择类型
 * @param {*} componentName 组件名字
 */
function clickNotClickable(type, componentName) {
  let component = null;
  switch(type) {
    case COMPONENT_TYPE.COMP_ID:
      component = id(componentName).findOnce().bounds();
      break;
    case COMPONENT_TYPE.COMP_TEXT:
      component = text(componentName).findOnce().bounds();
      break;
    case COMPONENT_TYPE.COMP_DESC:
      component = desc(componentName).findOnce().bounds();
      break;
    default:
      utils.toast_console("组件类型错误！", true);
  }
  let pointX = component.centerX();
  let pointY = component.centerY();
  click(pointX, pointY);
}

/**
 * 停掉除了本脚本以及 always 目录以外的正在运行的脚本
 */
function killOthersAlive() {
  // 获取全部正在运行的脚本引擎
  var allEngines = engines.all();
  for (var i = 0; i < allEngines.length; i++) {
    let curEngine = allEngines[i];
    // 停掉除了本脚本以及always目录以外的正在运行的脚本
    if (curEngine != engines.myEngine() && curEngine.cwd().indexOf("always") == -1) {
      curEngine.forceStop();
    }
  }
}

/**
 * 设置并开启悬浮窗，退出悬浮窗时结束脚本
 */
function setFloatWindow() {
  // 悬浮窗不会自动关闭
  setInterval(() => { }, NANO_TIME * 2);
  win.setPosition(width / 3 * 2, height / 4);
  win.setSize(430, 280);
  // 悬浮窗可调整大小
  win.setAdjustEnabled(true);
  // 长按悬浮窗内文字结束脚本
  win.text.longClick(() => {
    // try...catch把exit()函数的异常捕捉，则脚本不会立即停止，仍会运行几行后再停止
    try {
      utils.toast_console("检测到长按悬浮窗文字，脚本终止！", true);
      closeScript();
    } catch (err) { }
    // 直接exit()的话坚持不到return的时候
    return true;
  });
}

/**
 * 更新悬浮窗时间
 */
function updateWindowTime(windowTime) {
  ui.run(function () {
    let tips = "★★★Tips:按下[音量-]键或者长按[悬浮窗内文字]可随时结束脚本。";
    win.setSize(430, 320);
    win.text.setText(tips + "\n剩余：" + windowTime-- + " 秒");
    // 每秒更新一下倒计时
    var inter = setInterval(function () {
      win.text.setText(tips + "\n剩余：" + windowTime-- + " 秒");
      if (!windowTime) {
        clearInterval(inter);
        setTimeout(function () {
          win.setSize(430, 280);
          win.text.setText(tips);
        }, 1000)
      }
    }, 1000);
  });
}

/**
 * 启用按键监听，按下音量下键脚本结束
 */
function keyDetector() {
  // 在子进程中运行监听事件
  threads.start(function () {
    events.observeKey();
    events.on("key", function (code, event) {
      var keyCodeStr = event.keyCodeToString(code);
      if (keyCodeStr == "KEYCODE_VOLUME_DOWN") {
        utils.toast_console("检测到音量下键，脚本终止！", true);
        closeScript();
      }
    });
  });
}

/**
 * 关闭应用
 */
function closeApp() {
  // let packageName = currentPackage();
  // 丁香妈妈
  let packageName = "com.dxy.gaia";
  app.openAppSetting(packageName);
  sleep(LONG_TIME);
  let appName = app.getAppName(packageName);
  text(appName).waitFor();
  let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*)/).findOnce();
  // 强行停止是否可以点击
  if (is_sure.clickable()) {
    is_sure.click();
    sleep(NANO_TIME);
    textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*|.*确.*|.*定.*)/).clickable(true).findOnce().click();
    sleep(NANO_TIME);
    // 返回主页
    home();
    sleep(NANO_TIME);
  // 强行停止父节点是否可以点击
  } else if (is_sure.parent().clickable()) {
    is_sure.parent().click();
    sleep(NANO_TIME);
    textMatches(/(.*确.*|.*定.*)/).clickable(true).findOnce().click();
    sleep(NANO_TIME);
    // 返回主页
    home();
    sleep(NANO_TIME);
  } else {
    utils.toast_console(appName + "应用不能被正常关闭或不在后台运行！");
    home();
  }
  utils.toast_console("打卡结束，" + appName + "应用已被关闭！", true);
  closeScript();
}

/**
 * 关闭脚本，取消屏幕常亮
 */
function closeScript() {
  // 取消屏幕常亮
  device.cancelKeepingAwake();
  exit();
}

