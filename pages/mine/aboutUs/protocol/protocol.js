var UserServer = require("../../../../server/user.js").User;

Page({
  data:{},
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '线下专题拍摄服务',
      path: 'pages/home/home'
    }
  }
})