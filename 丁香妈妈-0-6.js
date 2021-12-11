var utils = {};
var height = device.height;
var width = device.width;

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
    swipe(width / 2, height / 4 * 3, width / 2, height / 4, 201);
    sleep(1500);
    for (let i = 0; i < password.length; i++) {
      desc(password[i]).findOne().click();
    }
  }
};

/**
 * 记录日志，统计根据参数判断前台是否提示
 * @param {string} msg 要记录或者提示的消息
 * @param {boolean} tshow 前台是否显式
 */
utils.toast_console = function (msg, tshow) {
  console.log(msg);
  if (tshow) toast(msg);
}

/* --------版本 v0.06 根据个人情况修改以下内容---------- */

// 解锁屏幕
let password = "123456";
utils.unlock(password);

// 所有打卡的课程
const allCourseName = [
  ["0~6 岁绘本早教馆"]
];

// 设置屏幕常亮时间，默认 45 分钟
const SCREEN_DIM_TIME = 45 * 60 * 1000;
// 播放课程时间，默认 5.5 分钟
const PLAY_COURSE_TIME = 5 * 60 * 1000 + 30 * 1000;
// 长等待时间常量，用于应用启动等较长时间等待，如果网络不好或手机卡请增加此数值，默认 5 秒
const LONG_TIME = 5000;
// 短等待时间常量，用于按钮点击、返回等每步操作后的等待，如果网络不好或手机卡请增加此数值，默认 3 秒
const SHORT_TIME = 3000;
// 更短的等待时间，没有请求时的短暂等待，默认 500 毫秒
const NANO_TIME = 500;
// 组件找不到重试次数，默认 5 次
const maxRetryTimes = 5;
// 程序所有页面枚举
const AppPage = {
  MAIN_PAGE: 1,
  COURSE_PAGE: 2,
  MY_CLOCKIN_PAGE: 3,
  ALL_COURSE_PAGE: 4,
  HUIBEN_TYPE_DETAIL_PAGE: 5,
  HUIBEN_DETAIL_PAGE: 6,
  COURSE_TYPE_DETAIL_PAGE: 7,
  COURSE_DETAIL_PAGE: 8,
  NOTIN_APP_PAGE: 9
}

// 根据此标志判断打卡是否完成
var FINISH_MARK = allCourseName.length;

/* --------版本 v0.06 根据个人情况修改以上内容---------- */

// 没有无障碍时候会提示无障碍模式的开启，并且开启之后,会接着继续运行。
auto.waitFor();
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
  launchApp("丁香妈妈");
  sleep(LONG_TIME);

  // 关闭广告弹窗（有时有两个弹窗）
  while (id("close_dialog").exists()) {
    id("close_dialog").findOnce().click();
  }

  // 自动判断所属页面并进行打卡
  let maxClockRetryTimes = maxRetryTimes;
  while (maxClockRetryTimes--) {
    if (switchPageAuto()) {
      break;
    }
  }

  // 打卡成功
  if (FINISH_MARK == 0) {
    utils.toast_console("所有课程已打卡完毕！", true);
    sleep(SHORT_TIME);
  } else {
    utils.toast_console("未打卡完毕！");
  }
  closeApp();
}

/**
 * 自动判断当前所在页面并纠正程序异常
 * @returns 返回 true 打卡成功，其他情况重试
 */
function switchPageAuto() {
  // 根据所处页面做相应处理
  let currentPage = getCurrentPage();
  utils.toast_console("当前所处页面代码为：" + currentPage);
  switch (currentPage) {
    case AppPage.MAIN_PAGE:
      break;
    case AppPage.COURSE_PAGE:
      break;
    case AppPage.MY_CLOCKIN_PAGE:
      back();
      sleep(NANO_TIME);
      break;
    case AppPage.ALL_COURSE_PAGE:
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      break;
    case AppPage.HUIBEN_TYPE_DETAIL_PAGE:
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      break;
    case AppPage.HUIBEN_DETAIL_PAGE:
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      break;
    case AppPage.COURSE_TYPE_DETAIL_PAGE:
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      break;
    case AppPage.COURSE_DETAIL_PAGE:
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      back();
      sleep(NANO_TIME);
      break;
    case AppPage.NOTIN_APP_PAGE:
    default:
      launchApp("丁香妈妈");
      sleep(LONG_TIME);
      return switchPageAuto();
  }

  // 点击导航栏 课程 一栏
  if (findUntilClick(id("com.dxy.gaia:id/main_course"))) {
    // 计算我的打卡的位置进行点击
    let myClockBounds = id("com.dxy.gaia:id/home_hot_zone_image_container").findOnce().bounds();
    let myClockX = myClockBounds.left + (myClockBounds.right - myClockBounds.left) / 10;
    let myClockY = myClockBounds.top + (myClockBounds.bottom - myClockBounds.top) / 4;
    utils.toast_console("我的打卡计算位置为：" + myClockX + ", " + myClockY);
    click(myClockX, myClockY);
    sleep(SHORT_TIME);
  } else {
    utils.toast_console("未找到课程，请检查网络！", true);
    return false;
  }

  // 点击 全部课程 按钮
  if (findUntilClick(text("全部课程"))) {
    // 循环所有课程开始打卡
    for (let i = 0; i < allCourseName.length; i++) {
      try {
        if (playCourse(allCourseName[i])) {
          utils.toast_console(allCourseName[i][0] + "课程打卡完毕！");
        } else {
          utils.toast_console(allCourseName[i][0] + "课程打卡失败，请检查课程名称！");
          return false;
        }
      } catch (e) {
        utils.toast_console(allCourseName[i][0] + "课程打卡异常！");
        return false;
      }
    }
  } else {
    utils.toast_console("未找到全部课程，请确认是否登陆！", true);
    return false;
  }
  return true;
}

/**
 * 根据页面元素判断当前所属页面
 * @returns 当前所属页面
 */
function getCurrentPage() {
  if (id("com.dxy.gaia:id/home_btn_search").exists()) {
    return AppPage.MAIN_PAGE;
  } else if (id("com.dxy.gaia:id/course_search").exists()) {
    return AppPage.COURSE_PAGE;
  } else if (text("全部课程").exists()) {
    return AppPage.MY_CLOCKIN_PAGE;
  } else if (text("补卡道具：").exists()) {
    return AppPage.ALL_COURSE_PAGE;
  } else if (id("com.dxy.gaia:id/story_book_image_item").exists()) {
    return AppPage.HUIBEN_TYPE_DETAIL_PAGE;
  } else if (text("绘本详情").exists()) {
    return AppPage.HUIBEN_DETAIL_PAGE;
  } else if (id("com.dxy.gaia:id/iv_column_logo").exists()) {
    return AppPage.COURSE_TYPE_DETAIL_PAGE;
  } else if (text("请朋友学").exists()) {
    return AppPage.COURSE_DETAIL_PAGE;
  } else {
    return AppPage.NOTIN_APP_PAGE;
  }
}

/**
 * 播放课程
 * @param {Array} courseNameArray [课程类型, 课程名字, 课程上级菜单名字]
 * @returns 当前课程打卡是否成功
 */
function playCourse(courseNameArray) {
  let [courseType, courseName, parentName] = courseNameArray;
  utils.toast_console(courseType + "：开始打卡！");
  let component = text(courseType).findOnce();
  // 课程名字错误导致打卡失败
  if (component == null) {
    return false;
  }
  // 判断本次是否已打卡
  if (component.parent().parent().parent().child(5).text() == "今日已打卡") {
    FINISH_MARK--
    utils.toast_console(courseType + "：今日已打卡！");
    return true;
  }
  // 判断课程是否已全部打卡完成
  if (component.parent().parent().parent().child(5).text() == "已完成") {
    FINISH_MARK--
    utils.toast_console(courseType + "：打卡已完成，无需打卡！");
    return true;
  }
  component.click();
  sleep(SHORT_TIME);
  // courseName 没有值，即传了一个参数
  if (!courseName) {
    // 绘本课程左边图片组件
    let px = id("com.dxy.gaia:id/story_book_image_item").findOnce().bounds().centerX();
    let py = id("com.dxy.gaia:id/story_book_image_item").findOnce().bounds().centerY();
    click(px, py);
    sleep(SHORT_TIME);
    // 关闭首次操作提示框
    while (id("com.dxy.gaia:id/tv_skip").exists()) {
      id("com.dxy.gaia:id/tv_skip").findOnce().click();
    }
    sleep(PLAY_COURSE_TIME * 3);
    FINISH_MARK--;
    utils.toast_console(courseType + "：打卡结束！");
    // 返回选择课程页面
    switchCourse();
    return true;
  }
  // parentName 没有值，说明没有上下级课程关系
  let maxSwipeRetryTimes = maxRetryTimes;
  if (!parentName) {
    // 尝试查找课程名字是否存在，不存在就下拉
    while (!text(courseName).exists() && maxSwipeRetryTimes--) {
      swipe(width / 2, height / 2, width / 2, height, NANO_TIME);
      sleep(NANO_TIME);
      utils.toast_console("下拉 " + (maxRetryTimes - maxSwipeRetryTimes) + " 次，再次查找课程！");
    }
  } else {
    maxSwipeRetryTimes = maxSwipeRetryTimes + 1;
    // 尝试查找课程名字是否存在
    while (!text(courseName).exists() && maxSwipeRetryTimes--) {
      // 判断父级是否存在
      while (!text(parentName).exists() && maxSwipeRetryTimes--) {
        swipe(width / 2, height / 2, width / 2, height, NANO_TIME);
        sleep(NANO_TIME);
        utils.toast_console("下拉 " + (maxRetryTimes - maxSwipeRetryTimes) + " 次，再次查找课程！");
      }
      if (!text(courseName).exists()) {
        let px = text(parentName).findOnce().bounds().centerX();
        let py = text(parentName).findOnce().bounds().centerY();
        click(px, py);
        sleep(SHORT_TIME);
      }
    }
  }
  // 点击找到的课程
  let ax = text(courseName).findOnce().bounds().centerX();
  let ay = text(courseName).findOnce().bounds().centerY();
  click(ax, ay);
  sleep(SHORT_TIME);
  // 点击播放按钮
  let playButtonBounds = packageName("com.dxy.gaia").className("android.view.View").clickable(false).depth(10).indexInParent(1).findOnce().bounds();
  let playButtonX = playButtonBounds.left + (playButtonBounds.right - playButtonBounds.left) / 8;
  let playButtonY = playButtonBounds.bottom - (playButtonBounds.bottom - playButtonBounds.top) / 8;
  utils.toast_console("播放按钮计算位置为：" + playButtonX + ", " + playButtonY);
  click(playButtonX, playButtonY);
  sleep(PLAY_COURSE_TIME);
  FINISH_MARK--;
  utils.toast_console(courseType + "：打卡结束！");
  // 返回选择课程页面
  switchCourse();
  return true;
}

/**
 * 点击两下返回，切换课程
 */
function switchCourse() {
  back();
  sleep(SHORT_TIME);
  back();
  sleep(SHORT_TIME);
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
  setInterval(() => { }, NANO_TIME * 2);
  win.setPosition(width / 3 * 2, height / 4);
  win.setSize(400, 280);
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
