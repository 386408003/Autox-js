/* --------版本 v0.03 根据个人情况修改以下内容---------- */

// 使用本地存储
var storage = storages.create("386408003@qq.com:config");
// 引入工具组件
var utils = require(storage.get("rootPath") + 'utils/utils.js');

// 设置屏幕常亮时间，默认 45 分钟
const SCREEN_DIM_TIME = 45 * 60 * 1000;
// 播放课程时间，默认 5.5 分钟
const PLAY_COURSE_TIME = 5 * 60 * 1000 + 30 * 1000;
// 长等待时间常量，用于应用启动、广告等较长时间等待，如果网络不好或手机卡请增加此数值，默认 6 秒
const LONG_TIME = 5000;
// 短等待时间常量，用于例如返回等每步操作后的等待，如果手机卡请增加此数值，默认 3 秒
const SHORT_TIME = 3000;
// 更短的等待时间，没有请求时的短暂等待，默认 500 毫秒
const NANO_TIME = 500;
// 打卡是否完成标志，多少课程就写多少
var FINISH_MARK = 6;

// 我的打卡按钮位置
const point1 = { x: 150, y: 830 };
// 播放按钮位置
const point2 = { x: 150, y: 1080 };

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
// 解锁屏幕
utils.unlock(storage.get("password"));

/* --------版本 v0.03 根据个人情况修改以上内容---------- */


// 开始打卡
watchVideo();

/**
 * 打卡主方法
 */
function watchVideo() {
  launchApp("丁香妈妈");
  sleep(LONG_TIME);

  // 关闭广告弹窗（有时有两个弹窗）
  while (id("close_dialog").exists()) {
    id("close_dialog").findOnce().click();
  }

  // 点击导航栏 课程 一栏
  let main_course = id("main_course").findOne(SHORT_TIME);
  if (main_course != null) {
    main_course.click();
    sleep(SHORT_TIME);
    // 按照位置点击我的打卡
    click(point1.x, point1.y);
    sleep(SHORT_TIME);
  } else {
    utils.toast_console("未找到课程，请检查网络！", true);
  }

  // 点击 全部课程 按钮
  let allCourse = text("全部课程").findOnce();
  if (allCourse != null) {
    allCourse.click();
    sleep(SHORT_TIME);
    // 开始打卡
    playCourse("0~6 岁绘本早教馆");
    playCourse("百科认知童谣", "海浪");
    playCourse("动物认知童谣", "猎豹");
    playCourse("生活认知童谣", "厨房  ");
    playCourse("身体认知童谣", "头发 ");
    playCourse("食物认知童谣", "强壮猪肝", "红肉");
  } else {
    utils.toast_console("未找到全部课程，请确认是否登陆！", true);
  }
  // 打卡成功
  if (FINISH_MARK == 0) {
    utils.toast_console("所有课程已打卡完毕！", true);
    utils.sendMail("丁香妈妈", "绘本课程打卡完成！\n其他5门课程都已打卡完成！", "[打卡完成]");
    sleep(SHORT_TIME);
  }
  closeApp();
}

/**
 * 播放课程
 * @param {string} courseType 课程类型
 * @param {string} courseName 课程名字
 * @param {string} parentName 课程上级菜单名字
 * @returns 
 */
function playCourse(courseType, courseName, parentName) {
  utils.toast_console(courseType + "：开始打卡");
  bean = text(courseType).findOnce();
  if (bean.parent().parent().parent().child(5).text() == "今日已打卡") {
    utils.toast_console(courseType + "：今日已打卡");
    return FINISH_MARK--;
  }
  bean.click();
  sleep(SHORT_TIME);
  // courseName 没有值，即传了一个参数
  if (!courseName) {
    // 绘本课程左边图片组件
    let px = id("com.dxy.gaia:id/story_book_image_item").findOnce().bounds().centerX();
    let py = id("com.dxy.gaia:id/story_book_image_item").findOnce().bounds().centerY();
    click(px, py);
    sleep(PLAY_COURSE_TIME * 3);
    utils.toast_console(courseType + "：打卡结束");
    // 返回选择课程页面
    switchCourse();
    return FINISH_MARK--;
  }
  swipe(500, 1000, 500, 3000, NANO_TIME);
  sleep(NANO_TIME);
  if (!text(courseName).exists()) {
    let px = text(parentName).findOnce().bounds().centerX();
    let py = text(parentName).findOnce().bounds().centerY();
    click(px, py);
    sleep(SHORT_TIME);
  }
  let ax = text(courseName).findOnce().bounds().centerX();
  let ay = text(courseName).findOnce().bounds().centerY();
  click(ax, ay);
  sleep(SHORT_TIME);
  click(point2.x, point2.y);
  sleep(PLAY_COURSE_TIME);
  FINISH_MARK--;
  utils.toast_console(courseType + "：打卡结束");
  // 返回选择课程页面
  switchCourse();
}

/**
 * 点击两下返回，切换课程
 */
function switchCourse() {
  back();
  sleep(SHORT_TIME / 2);
  back();
  sleep(SHORT_TIME / 2);
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
  //启用悬浮窗，用于提示，为没有音量下键的手机提供了关闭悬浮窗可以直接停止脚本的方式
  var win = floaty.window(
    <frame gravity="left">
      <text id="text" textColor="black" bg='#ffffff'>★★★Tips:按下[音量-]键或者长按[悬浮窗内文字]可随时结束脚本</text>
    </frame>
  );
  // 悬浮窗不会自动关闭
  setInterval(() => { }, 1000);
  win.setPosition(700, height / 4);
  win.setSize(400, 300);
  // 悬浮窗可调整大小
  win.setAdjustEnabled(true);
  // 长按悬浮窗内文字结束脚本
  win.text.longClick(() => {
    // try...catch把exit()函数的异常捕捉，则脚本不会立即停止，仍会运行几行后再停止
    try {
      utils.toast_console("检测到长按悬浮窗文字，脚本终止。", true);
      closeScript();
    } catch (err) { }
    // 直接exit()的话坚持不到return的时候
    return true;
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
        utils.toast_console("检测到音量下键，脚本终止。", true);
        closeScript();
      }
    });
  });
}

/**
 * 关闭应用
 */
function closeApp() {
  let packageName = currentPackage();
  app.openAppSetting(packageName);
  let appName = app.getAppName(packageName);
  text(appName).waitFor();
  let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOnce();
  // 强行停止是否可以点击
  if (is_sure.enabled()) {
    textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOnce().click();
    sleep(NANO_TIME);
    textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*|.*确.*|.*定.*)/).clickable(true).findOnce().click();
    sleep(NANO_TIME);
    // 返回主页
    home();
    sleep(NANO_TIME);
  } else {
    utils.toast_console(appName + "应用不能被正常关闭或不在后台运行。");
    home();
  }
  utils.toast_console("打卡结束，" + appName + "应用已被关闭。", true);
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

