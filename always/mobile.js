importClass(android.content.ClipboardManager);
/** 
 * 请将ip改成你电脑的ip 
 */
// const IPAddressOfYourComputer = "10.3.154.134";
const IPAddressOfYourComputer = "192.168.0.103";

const PORT = 7101;
var clipboard = context.getSystemService(context.CLIPBOARD_SERVICE);
var Listener = new ClipboardManager.OnPrimaryClipChangedListener({
  onPrimaryClipChanged: function () {
    let value = getClip();
    if (value) {
      value = value.toString();
      value = encryptString(value);
      let url = "http://" + IPAddressOfYourComputer + ":" + PORT + "?clipboard=" + value;
      log(url);
      http.get(url, {}, function (res, err) {
        if (err) {
          console.error(err);
          return;
        }
        log(res.body.string());
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