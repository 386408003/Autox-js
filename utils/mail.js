var mail = {};
mail.send = function (appName, msg, autoMark) {
  autoMark = autoMark || "[自动]";
  let url = "http://192.168.0.103:8081/wx/mail/send";
  let person = "386408003@qq.com";
  let message = {"to": person, "title": (autoMark + appName), "message": msg};
  http.post(url, message);
};
module.exports = mail;