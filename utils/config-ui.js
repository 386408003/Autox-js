/*
按钮控件的字体大小 textSize 为 "20sp"
  <button text="第一个按钮" textSize="20sp"/>
背景色 bg 为 "#ff0000"
  bg="#ff0000"
有一个按钮控件"确定"，id属性为"ok"，那么我们可以在代码中使用 ui.ok 来获取，getText() 函数获取到这个按钮控件的文本内容
  <button id="ok" text="确定"/>
对于一个按钮控件，使其中的文本内容靠右显示
  gravity="right"

w 是属性 width 的缩写形式
  可以设置的值为*, auto和具体数值。其中*表示宽度尽量填满父布局，而auto表示宽度将根据View的内容自动调整(自适应宽度)
h 是属性 height 的缩写形式
  可以设置的值为*, auto和具体数值。其中*表示宽度尽量填满父布局，而auto表示宽度将根据View的内容自动调整(自适应宽度)

layout_gravity 用于决定 View 本身在他的父布局的位置
  通过给按钮设置属性 layout_gravity="center" 来使得按钮在帧布局中居中
  通过给按钮设置属性 layout_gravity="right|bottom" 使得他在帧布局中位于右下角

边距为30dp
  margin="30"
边距为上下10，左右40
  margin="10 40"
左外边距为10dp
  marginLeft="10"
内边距
  padding

设置文本的内容
  <text text="一段文本"/>
红色字体
  <text text="红色字体" textColor="red"/>
超大字体
  <text text="超大字体" textSize="40sp"/>
设置字体的样式，bold 加粗字体，italic 斜体，normal 正常字体
  <text text="粗斜体" textStyle="bold|italic"/>
多行文本
  <vertical>
    <text id="myText" line="3">
  </vertical>

*/

// 指定 ui 模式
"ui";

// 本地存储
var storage = storages.create("386408003@qq.com:config");
// 引入工具组件
var utils = require(storage.get("rootPath") + 'utils/utils.js');

/**
 * 初始化页面布局
 */
ui.layout(
  <vertical>
    <text text="系统设置 By Zhufeng" textSize="30sp" textColor="#fbfbfe" bg="#00afff" w="*" gravity="center"></text>
    <horizontal marginTop="10">
      <text w="90" marginLeft="7" text="开发服务器："></text>
      <input w="*" id="devUrl" />
    </horizontal>
    <horizontal>
      <text w="90" marginLeft="7" text="邮件服务器："></text>
      <input w="*" id="serverUrl" />
    </horizontal>
    <horizontal>
      <text w="90" marginLeft="7" text="收件人邮箱："></text>
      <input w="*" id="mailTo" />
    </horizontal>
    <horizontal>
      <text w="90" marginLeft="7" text="脚本根目录："></text>
      <input w="*" id="rootPath" />
    </horizontal>
    <horizontal>
      <text w="90" marginLeft="7" text="锁屏密码："></text>
      <input w="*" id="password" password="true" />
    </horizontal>
    <horizontal>
      <button id="exit" textSize="40sp" margin="0 30">退出</button>
      <button w="*" id="saveConfig" textSize="40sp" margin="0 30">保存</button>
    </horizontal>
  </vertical>
);

// 设置左侧按钮宽度，保证两个按钮居中
var width = device.width / 2;
ui.exit.setWidth(width);

/**
 * 退出按钮的点击事件
 */
ui.exit.click(function () {
  exit();
});

/**
 * 保存按钮点击事件
 */
ui.saveConfig.click(function () {
  utils.toast_console("devUrl = " + ui.devUrl.text());
  utils.toast_console("serverUrl = " + ui.serverUrl.text());
  utils.toast_console("mailTo = " + ui.mailTo.text());
  utils.toast_console("rootPath = " + ui.rootPath.text());
  utils.toast_console("password = " + ui.password.text());

  storage.put("devUrl", ui.devUrl.text());
  storage.put("serverUrl", ui.serverUrl.text());
  storage.put("mailTo", ui.mailTo.text());
  storage.put("rootPath", ui.rootPath.text());
  storage.put("password", ui.password.text());
  utils.toast_console("保存成功！", true);
});

/**
 * 初始化表单
 */
function initForm() {
  ui.devUrl.setText(storage.get("devUrl"));
  ui.serverUrl.setText(storage.get("serverUrl"));
  ui.mailTo.setText(storage.get("mailTo"));
  ui.rootPath.setText(storage.get("rootPath"));
  ui.password.setText(storage.get("password"));
}

initForm();
