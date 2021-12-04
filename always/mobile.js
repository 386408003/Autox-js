// 使用本地存储
var storage = storages.create("386408003@qq.com:config");
// 引入工具组件
var utils = require(storage.get("rootPath") + "utils/utils.js");

importClass(android.content.ClipboardManager);
/** 
 * 请将ip改成你电脑的ip 
 */
var IPAddressOfYourComputer = storage.get("devUrl");

const PORT = 7101;
var clipboard = context.getSystemService(context.CLIPBOARD_SERVICE);
var Listener = new ClipboardManager.OnPrimaryClipChangedListener({
  onPrimaryClipChanged: function () {
    let value = getClip();
    if (value) {
      value = value.toString();
      value = encryptString(value);
      let url = "http://" + IPAddressOfYourComputer + ":" + PORT + "?clipboard=" + value;
      utils.toast_console(url);
      http.get(url, {}, function (res, err) {
        if (err) {
          console.error(err);
          return;
        }
        utils.toast_console(res.body.string());
      });
    }
  },
});
clipboard.addPrimaryClipChangedListener(Listener);
events.on("exit", function () {
  clipboard.removePrimaryClipChangedListener(Listener);
});
setInterval(() => { }, 1000);

function encryptString(data) {
  data = java.lang.String(data).getBytes();
  return base64Encode(data);
}

function base64Encode(r) {
  var r = android.util.Base64.encodeToString(r, android.util.Base64.NO_WRAP);
  return r;
}