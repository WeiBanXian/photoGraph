var UserServer = require("server/user.js").User;
var GlobalServer = require("server/global.js").Global;

var {DateManager} = require('utils/dateManage.js');

App({
  onLaunch: function () {
    var _self = this;
    wx.login({
      success: function(res) {
        wx.getUserInfo({
          success: function (res) {
            _self.globalData.userInfo = res.userInfo
            UserServer.setAvatar(res.userInfo.avatarUrl);
            UserServer.setUserName(res.userInfo.nickName);
            UserServer.setGender(res.userInfo.gender);
          }
        })
      }
    });

    DateManager.init();
    UserServer.setMobile('11000000907');
    UserServer.setPassword('123456');
    wx.showToast({
        title: '登录中...',
        icon: 'loading',
        duration: 10000
    })
    // 登录
    UserServer.login(function () {
        console.log("登录成功")
    }, function () {
        GlobalServer.alert("登录失败");
    });
  },
  getUserInfo:function(cb){
    
  },
  globalData:{
    userInfo:null
  }
})