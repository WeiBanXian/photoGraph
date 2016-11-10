var UserServer = require("../../server/user.js").User;

var {getEtag} = require('../../utils/qetag.js');
var {DateManager} = require('../../utils/dateManage.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    toastText: "",
    animationData: {},
    hidden: true,
    userName: '11000000907',
    password: '123456',
    // userName: '',
    // password: '',
    pic: ''
  },
  onLoad: function () {
    var _self = this;
    UserServer.init(function (res) {
      _self.setData({
        userName: res.mobile,
        password: res.password
      })
    });
    DateManager.init();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow: function(){
    
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
          // wx.navigateTo({
          // // wx.redirectTo({
          //     url: './../total/total'
          // })
    
    var _self = this;
    wx.showToast({
      title: '登录中...',
      icon: 'loading',
      duration: 10000
    })
    UserServer.setMobile(this.data.userName);
    UserServer.setPassword(this.data.password);
    UserServer.login(function (res) {
      switch(res.status) {
        case 10538:
        
        break;
        case 10510:
        
        break;
        case 200:
          wx.navigateTo({
          // wx.redirectTo({
              url: './../total/total'
          })
        break;
      }
      wx.hideToast()
    }, function (error) {
      
      wx.hideToast()
    });
  },
  // 跳转到忘记密码
  handleGoToForget: function () {
      wx.navigateTo({
          url: './forget/forget'
      })
  },
  // 
  handleCall: function () {
    wx.makePhoneCall({
      phoneNumber: '11000000907'
    })
  },
  // 跳转到注册
  handleGoToRegister: function () {
    wx.navigateTo({
        url: './register/register'
    })
  }
})
