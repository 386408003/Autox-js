/**支付宝*/
auto.waitFor();
// 若无法点击领取请在这里可修改坐标
// 查找屏幕坐标方法
// 设置 => 开发者（人员）选项 => 指针位置 => 打开
// 每次更新请自行复制保存坐标，以免被覆盖
// 支付宝的树旁的点击领取
var p1 = {
  x: 870,
  y: 1490
};
// 若无法点击领取请在这里可修改坐标
// 淘宝的树旁的点击领取
var p2 = {
  x: 870,
  y: 1560
};
/**自行修改施肥点击坐标 */
// 施肥自动点击
var p3 = {
  x: 550, //请修改x轴
  y: 2000 //请修改y轴，即可
};
// 若好友林无法点击，请修改这个depth为20或其他
var depth = 11;
// choicList
var height = device.height;
var width = device.width;
var whichOne = 0;
setScreenMetrics(width, height);
wChooseList = ["帮好友助力", "芭芭农场任务", "自动施肥(必须在施肥页面使用)"];
chooseList = [1, 2, 3];
whichOne = listChoose();
if (whichOne == 1) {
  completeSharing();
}
if (whichOne == 2) {
  farm();
}
if (whichOne == 3) {
  autoApplyingFertilizer();
}
/**
 * listChoose
 */
function listChoose() {
  let option = dialogs.singleChoice("请选择", wChooseList);
  if (option == -1) {
    toastLog("脚本已退出");
    exit();
  }
  let whichOne = chooseList[option];
  return whichOne;
}
/**
 * 芭芭农场本体
 */
function farm() {
  requestScreenCapture(false);
  app.launchApp('支付宝');
  //更新按钮
  sleep(3000);
  if (text("稍后再说").exists()) {
    text("稍后再说").findOnce().click();
    sleep(2000);
  }
  openChildMenu("芭芭农场");
  sleep(3500);
  babaFarm();
  sleep(3000);
  taobaoFarm();
  sleep(1000);
  toastLog("结束");
  // 退出支付宝
  home();
}
/**
 * 完成助力分享dlc
 */
function completeSharing() {
  app.launchApp('支付宝');
  toastLog("打开支付宝");
  openChildMenu("我的");
  desc("头像").waitFor();
  sleep(500);
  toastLog("点击我");
  desc("头像").findOnce().click();
  text("聊天收藏").waitFor();
  sleep(500);
  toastLog("点击聊天收藏");
  text("聊天收藏").findOnce().parent().click();
  sleep(1000);
  let shareToMe = textContains("帮我助力").find();
  if (shareToMe.length == 0) {
    toastLog("无助力内容，脚本即将退出");
    exit();
  }
  for (let i = 0; i < shareToMe.length; i++) {
    toastLog("点击分享");
    shareToMe[i].parent().click();
    sleep(1000);
    text("为Ta助力").waitFor();
    sleep(500);
    toastLog("点击为Ta助力");
    text("为Ta助力").findOnce().click();
    sleep(1000);
    if (textContains("今日助力好友次数已满").exists()) {
      sleep(500);
      back();
      break;
    }
    back();
    sleep(1000);
  }
  sleep(500);
  back();
  sleep(500);
  back();
  sleep(500);
  openChildMenu("首页");
  home();
}
/**
 * 自动施肥dlc
 */
function autoApplyingFertilizer() {
  console.show();
  if (p3.x == 0) {
    console.log("首次使用请打开脚本并修改坐标");
    app.launchApp('Auto.js');
    toastLog("打开Auto.js");
    exit();
  } else if (p3.x != 0) {
    console.hide();
  }
  /**可修改默认次数 */
  let times = rawInput('请输入施肥次数(默认30次)', 30);

  while (times--) {
    click(p3.x, p3.y);
    sleep(600);
    if (text("去集肥料").exists()) {
      toastLog("施肥完毕");
      text("去集肥料").findOnce().click();
      break;
    }
    if (text("好的").exists()) {
      text("好的").findOnce().click();
      break;
    }
  }
  toastLog("退出脚本");
  console.hide();
}
/**
 * 点击打开
 * @param {*} name 控件text
 */
function openChildMenu(name) {
  sleep(1000);
  let findChild = className("android.widget.TextView").text(name);
  findChild.waitFor();
  findChild = findChild.findOnce();
  if (findChild != null) {
    sleep(1000);
    findChild.parent().click();
    toastLog("点击" + name);
    sleep(1000);
  } else {
    toastLog("这个“" + name + "”小程序可能找不到");
  }
}
/**
 * 芭芭农场
 */
function babaFarm() {
  sleep(5000);
  // 图片无法识别已签到还是未签到
  let p_qiandao = findPicture("/sdcard/ui_芭芭农场/签到领肥料.jpg", 0.6);
  if (p_qiandao) {
    click(Number(p_qiandao.x) + 50, (Number(p_qiandao.y) + 10));
    toastLog("点击签到");
    sleep(1000);

  } else {
    toastLog("找不到领取，请自行设定坐标");
    sleep(1000);
    click(p1.x, p1.y);
    sleep(1000);
    toastLog("签到不成功请手动签到");
  }
  if (text("去施肥").exists()) {
    text("去施肥").findOnce().click();
    sleep(1000);
  }
  sleep(1000);
  // 找图领肥料list
  let p_lingfeiliao = findPicture("/sdcard/ui_芭芭农场/领肥料1.jpg", 0.6);
  if (p_lingfeiliao) {
    click(Number(p_lingfeiliao.x) + 50, (Number(p_lingfeiliao.y) + 100));
    toastLog("点击领肥料");
  } else {
    let lingfeiliao = className("android.view.View").clickable(true).depth(7).boundsInside(0, device.height / 2, device.width, device.height / 1).findOne(2500);
    if (lingfeiliao != null) {
      lingfeiliao.click();
      toastLog("点击领肥料");
    }
  }
  sleep(2000);
  // 马上领，领肥料
  let mashangling = className("android.view.View").textContains("领肥料");
  if (mashangling.exists()) {
    mashangling = mashangling.findOnce()
    if (mashangling != null) {
      mashangling.click();
      toastLog("点击马上领");
      sleep(2000);
    }
  }
  //领取按钮,循环
  let drawDown = className("android.view.View").text("领取");
  if (drawDown.exists()) {
    drawDown = drawDown.find();
    if (drawDown != null) {
      drawDown.forEach(eachOne => {
        if (eachOne.text() != "") {
          eachOne.click();
          sleep(1500);
        }
      });
      toastLog("点击领取完毕");
    }
  }
  //去完成不能使用text坐标点击
  slideScreenDown(540, 1890, 540, 1400, 1000, 1000);
  let a = className("android.view.View").textContains("逛精选").findOne(2500);
  let boundsOfa = a.bounds();
  if (a != null) {
    a = a.text();
    b = a.split("(")[1].split("/")[0];
    a = a.split("/")[1].split(")")[0];
    for (let i = Number(b); i < Number(a); i++) {
      let toComplete = className("android.view.View").textContains("去完成").boundsInside(boundsOfa.left, boundsOfa.top, width, height).findOne();
      if (toComplete != null) {
        toastLog("点击去完成");
        toComplete.click();
        sleep(3000);
      }
      if (className("android.view.View").textContains("浏览满15秒得").exists()) {
        className("android.view.View").textContains("浏览完成").waitFor();
        toastLog("浏览完成");
        back();
        sleep(2000);
      }
    }
  }
  // 
  slideScreenDown(540, 1890, 540, 1300, 1000, 1000);
  let toVist = className("android.view.View").textContains("去逛逛").findOne();
  if (toVist != null) {
    toastLog("点击去逛逛");
    toVist.click();
    toastLog("去往淘宝中...");
    sleep(3000);
  }
  className("android.view.View").text("继续赚肥料").waitFor();
  sleep(1000);
  let shutDown = className("android.widget.Image").text("O1CN01mOSkKe1bMbTVbjDzb_!!6000000003451-2-tps-78-78.png_110x10000.jpg_").findOnce();
  if (shutDown != null) {
    shutDown.click();
  } else {
    toastLog("");
  }
}
/**
 * 入口为支付宝去领取
 */
function taobaoFarm() {
  // 合种项目
  sleep(3000);
  jointFarm();
  sleep(1000);
  friendTrees();
  if (text("立即领取").exists()) {
    text("立即领取").findOnce().click();
    sleep(1500);
    toastLog("无法识别，请稍后自行领取");
    if (text("立即领取").exists()) {
      text("立即领取").findOnce().click();
      sleep(1500);
    }
    sleep(1200);
    if (text("我的小队").exists()) {
      let shutDown = className("android.widget.Image").text("TB12m9K2Rr0gK0jSZFnXXbRRXXa-74-74.png_1200x1200Q50s50.jpg_").findOnce();
      if (shutDown != null) {
        shutDown.click();
        sleep(1000);
      }
    }
  }
  // 
  sleep(3000);
  let p_taobaoqiandao = findPicture("/sdcard/ui_芭芭农场/淘宝点击领取.jpg", 0.6);
  if (p_taobaoqiandao) {
    click(Number(p_taobaoqiandao.x) + 50, (Number(p_taobaoqiandao.y) + 20));
    toastLog("点击去领取");
    sleep(2000);
  } else {
    toastLog("找不到领取，请自行设定坐标，脚本开头");
    sleep(1000);
    click(p2.x, p2.y);
    sleep(1000);
  }
  if (text("去施肥，赚更多肥料").exists()) {
    text("去施肥，赚更多肥料").findOnce().parent().click();
    sleep(1000);
  }
  // open_list
  sleep(1000);
  if (className("android.widget.Button").text("去签到").exists()) { } else {
    let p_taobaolist = findPicture("/sdcard/ui_芭芭农场/淘宝肥料list.jpg", 0.6);
    if (p_taobaolist) {
      click(Number(p_taobaolist.x) + 80, (Number(p_taobaolist.y) + 80));
      toastLog("点击list");
      sleep(1000);
    } else {
      let taobaolist = className("android.widget.Image").clickable(true).depth(depth).boundsInside(device.width / 2, device.height / 2, device.width, device.height / 1).findOne(2500);
      if (taobaolist != null) {
        taobaolist.click();
        toastLog("点击领肥料list");
        sleep(1000);
      }
    }
  }
  closeUpdates(3000);
  // list_drawdown
  let signForFertilizer = className("android.widget.Button").text("去签到");
  let check = className("android.widget.Button").text("已完成").find();
  if (check != null) {
    check = check.length;
    if (check == undefined || check == 0) {
      toastLog("有东西卡住，请打开集肥料list");
      toastLog("有东西卡住，请打开集肥料list");
      toastLog("有东西卡住，请打开集肥料list");
      toastLog("有东西卡住，请打开集肥料list");
      toastLog("有东西卡住，请打开集肥料list");
      toastLog("有东西卡住，请打开集肥料list");
      signForFertilizer.waitFor();
    } else if (check == 1) {

    } else if (check >= 2) {
      toastLog("可能已全部完成");
    }
  } else {
    let check1 = signForFertilizer.findOne(1000);
    if (check1 != null) {

    } else {
      signForFertilizer.waitFor();
    }
  }
  signForFertilizer = signForFertilizer.findOne(2500);
  if (signForFertilizer != null) {
    sleep(1000);
    signForFertilizer.click();
    toastLog("点击签到");
    sleep(2000);
  }
  slideScreenDown(device.width / 2, device.height / 2 + 300, device.width / 2, device.height / 2, 200, 500);
  // list tasks
  let drawDown1 = className("android.widget.Button").text("去领取").findOne(2500);
  if (drawDown1 != null) {
    drawDown1.click();
    toastLog("点击去领取");
    sleep(2000);
  }
  // 
  repetitBrowseTasks("逛精选", 2000);
  repetitBrowseTasks("逛精选", 2000);
  // 添加其他逛一逛15s
  tasks_15s("浏览15秒得300肥料", 3);
  // 
  className("android.view.View").textContains("逛逛支付宝").findOne().parent().parent().children().forEach(child => {
    let target0 = child.findOne(className("android.widget.Button").text("去逛逛"));
    if (target0 != null) {
      target0.click();
      toastLog("去往支付宝中...");
      className("android.view.View").text("继续赚肥料").waitFor();
      toastLog("点击继续赚肥料");
      sleep(1000);
      if (className("android.view.View").text("继续赚肥料").exists()) {
        className("android.view.View").text("继续赚肥料").findOnce().click();
        sleep(1000);
      }
    }
  });
}
/**
 * 模拟滑动
 */
function slideScreenDown(startX, startY, endX, endY, pressTime, timeSleep) {
  swipe(startX, startY, endX, endY, pressTime); //模拟从坐标x1,y1,x2,y2滑动
  sleep(timeSleep);
}
/**
 * 取消升级()芭芭农场的,淘宝
 * @param {*} times 
 */
function closeUpdates(times) {
  sleep(times);
  let noUpdate = className("android.widget.TextView").text("取消");
  if (noUpdate.exists()) {
    noUpdate = noUpdate.findOnce().bounds()
    click(noUpdate.centerX(), noUpdate.centerY());
    sleep(1000);
  }
}
/**
 * 找图返回p坐标
 * @param {*} path  路径
 * @param {*} threshold 阈值
 */
function findPicture(path, threshold) {
  let ui = images.read(path);
  let p = null;
  if (ui !== null) {
    p = findImage(captureScreen(), ui, {
      region: [0, 50],
      threshold: threshold
    });
  }
  return p;
}
/**
 * 合种项目
 */
function jointFarm() {
  sleep(1000);
  let keepFighting = className("android.widget.Button").text("继续努力");
  if (keepFighting.exists()) {
    keepFighting = keepFighting.findOnce();
    keepFighting.click();
    sleep(1000);
  }
  sleep(1500);
  if (text("立即领取").exists()) {
    text("立即领取").findOnce().click();
    sleep(1500);
    toastLog("无法识别，请稍后自行领取");
    if (text("立即领取").exists()) {
      text("立即领取").findOnce().click();
      sleep(1500);
    }
    sleep(1200);
    if (text("我的小队").exists()) {
      let shutDown = className("android.widget.Image").text("TB12m9K2Rr0gK0jSZFnXXbRRXXa-74-74.png_1200x1200Q50s50.jpg_").findOnce();
      if (shutDown != null) {
        shutDown.click();
        sleep(1000);
      }
    }
  }
}
/**
 * 好友林
 */
function friendTrees() {
  let friendList = className("android.widget.Image").clickable(true).depth(depth).boundsInside(0, device.height / 2, device.width / 2, device.height / 1).findOne(2500);
  if (friendList != null) {
    toastLog("点击好友林");
    friendList.click();
    closeUpdates(3000);
    if (text("继续加油").exists()) {
      toastLog("点击继续加油");
      text("继续加油").findOnce().click();
      sleep(1500);
    }
    if (text("我知道啦").exists()) {
      toastLog("点击我知道啦");
      text("我知道啦").findOnce().click();
      sleep(1500);
    }
    sleep(1000);
    click(540, 700); //新人第一次遇到的，无法识别，随便click一下
    sleep(1000);
    if (text("我知道啦").exists()) {
      toastLog("等待");
      text("我知道啦").findOnce().click();
      sleep(1500);
    }
    if (text("开心收下").exists()) {
      toastLog("点击开心收下");
      text("开心收下").findOnce().click();
      sleep(1500);
    }
    //textContains("0肥料").waitFor();
    let dr = textContains("00肥料").findOne(2000);
    if (dr != null) {
      let _dr = dr.text();
      toastLog("点击" + _dr);
      dr.click();
    }
    sleep(1000);
    if (text("继续加油").exists()) {
      toastLog("点击继续加油");
      text("继续加油").findOnce().click();
      sleep(1500);
    }
    if (text("开心收下").exists()) {
      toastLog("点击开心收下");
      text("开心收下").findOnce().click();
      sleep(1500);
    }
    sleep(1000);
    if (text("肥料").exists()) {
      let fl = text("肥料").find()
      if (fl != null) {
        fl.forEach(one => {
          one.click();
          toastLog("收肥料");
          sleep(1000);
        });
      }
    }
    sleep(1000);
    if (text("帮TA浇灌").exists()) {
      toastLog("帮他浇水");
      text("帮TA浇灌").findOnce().click();
      sleep(1000);
    }
    sleep(1000);
    if (text("立即领取").exists()) {
      toastLog("点击立即领取");
      text("立即领取").findOnce().click();
      sleep(1000);
      if (text("开心收下").exists()) {
        toastLog("点击开心收下");
        text("开心收下").findOnce().click();
        sleep(1500);
      }
    }
    sleep(1000);
    if (text("点我领肥料").exists()) {
      text("点我领肥料").waitFor();
      toastLog("点击点我领肥料");
      text("点我领肥料").findOnce().click();
      sleep(1000);
      text("立即去浇灌").waitFor();
      toastLog("点击立即去浇灌");
      text("立即去浇灌").findOnce().click();
      sleep(1000);
      toastLog("。。。。。。。。浇灌后请自行点击领取。。。。。。。。。若不领取明天自动领取");
      sleep(2222);
    }
  }
}
/**
 * 将15秒任务打包一下
 * @param {*} name 浏览15秒得300肥料
 * @param {*} time findOne time
 */
function tasks_15s(name, time) {
  for (let a = 0; a < time; a++) {
    let _name = className("android.view.View").textContains(name).find();
    if (_name != null) {
      toastLog("识别存在的浏览15s任务数：" + _name.length);
      for (let i = 0; i < _name.length; i++) {
        name1 = _name[i].bounds();
        click((name1.left + name1.right) / 2, (name1.top + name1.bottom) / 2);
        closeUpdates(2000);
        className("android.view.View").textContains("任务已经").waitFor();
        toastLog("浏览搞定");
        sleep(1000);
        back();
        closeUpdates(2000);
        sleep(1000);
        if (className("android.view.View").textContains("逛逛支付宝芭芭农场").exists()) {
          sleep(1000);
        } else {
          back();
          sleep(500);
        }
        if (className("android.view.View").textContains("逛逛支付宝芭芭农场").exists()) { } else {
          back();
          sleep(500);
        }
      }
    }
    sleep(1000);
    let check = className("android.widget.Button").text("已完成").find();
    if (check.length >= 3) {
      toastLog(check.length);
      break;
    } else {
      toastLog("还存在新刷新的浏览15s任务")
    }
  }
}
/**
 * 逛精选
 * @param {*} name 名字part或all
 * @param {*} times findOne time
 */
function repetitBrowseTasks(name, times) {
  let a = className("android.view.View").textContains(name).findOne(times);
  if (a != null) {
    a = a.text();
    b = a.split("(")[1].split("/")[0];
    a = a.split("/")[1].split(")")[0];
    for (let i = Number(b); i < Number(a); i++) {
      className("android.view.View").textContains("逛精选").findOne().parent().parent().children().forEach(child => {
        let target0 = child.findOne(className("android.widget.Button").text("去逛逛"));
        if (target0 != null) {
          target0.click();
          className("android.view.View").textContains("浏览完成").waitFor();
          toastLog("浏览搞定");
          back();
          closeUpdates(3000);
        }
      });
    }
  }
}