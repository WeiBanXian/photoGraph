var UserServer = require("server/user.js").User;

var {DateManager} = require('utils/dateManage.js');

App({
  onLaunch: function () {
    UserServer.init(function (res) {
      
    });
    DateManager.init();
    console.log("cd")
    var _self = this;
    wx.showToast({
      title: '登录中...',
      icon: 'loading',
      duration: 10000
    })
    UserServer.setMobile('11000000907');
    UserServer.setPassword('123456');
    UserServer.login(function (res) {
      // switch(res.status) {
      //   case 10538:
      //     _self.handleAlert("请输入合法的手机号码");
      //   break;
      //   case 10510:
      //     _self.handleAlert("账号密码输入有误");
      //   break;
      //   case 200:
      //     wx.navigateTo({
      //     // wx.redirectTo({
      //         url: './../total/total'
      //     })
      //   break;
      // }
      wx.hideToast()
    }, function (error) {
      _self.handleAlert(error);
      wx.hideToast()
    });
  },
  getUserInfo:function(cb){
    
  },
  globalData:{
    userInfo:null
  }
})