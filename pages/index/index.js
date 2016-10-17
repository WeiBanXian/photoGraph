var UserServer = require("../../server/user.js").User;

//获取应用实例
var app = getApp()
Page({
  data: {
    hidden: true,
    userName: '18583269107',
    password: '584520'
  },
  onLoad: function () {
    UserServer.init();
    console.log("init")
  },
  onReady:function(){
    // 页面渲染完成
  },
  // 用户名
  handleChangePhoneNum: function (event) {
    this.setData({
      userName: event.detail.value
    })
  },
  // 用户密码
  handleChangePassword: function (event) {
    this.setData({
      password: event.detail.value
    })
  },
  // 登录
  handleLogin: function() {
  // onLoad: function() {
    var _self = this;
    this.loadingTap();
    UserServer.setUserName(this.data.userName);
    UserServer.setPassword(this.data.password);
    UserServer.login(function () {
      wx.redirectTo({
          url: '../total/total'
      })
      _self.loadingChange();
    });
  },
  // 关闭loading
  loadingChange: function () {
    this.setData({
      hidden: true
    })
  },
  // 开启loading
  loadingTap: function () {
    this.setData({
      hidden: false
    })

    // var that = this
    // setTimeout(function () {
    //   that.setData({
    //     hidden: true
    //   })
    // }, 1500)
  }
})
