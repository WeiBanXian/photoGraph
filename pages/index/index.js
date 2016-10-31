var UserServer = require("../../server/user.js").User;
var Alert = require("../template/alert/alert.js").Alert;
var Loading = require("../template/loading/loading.js").Loading;

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

    // wx.redirectTo({
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
          _self.handleAlert("请输入合法的手机号码");
        break;
        case 10510:
          _self.handleAlert("账号密码输入有误");
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
      _self.handleAlert(error);
      wx.hideToast()
    });
  },
  // 跳转到忘记密码
  handleGoToForget: function () {
      wx.navigateTo({
          url: './forget/forget'
      })
  },
  // 跳转到注册
  handleGoToRegister: function () {
    wx.navigateTo({
        url: './register/register'
    })
  },
  handleAlert: function (toastText) {
    Alert.show(function (animation) {
      this.setData({
        toastText: toastText,  
        animationData: animation.export()
      })
    }.bind(this));
    setTimeout(function () {
      Alert.hide(function (animation) {
        this.setData({
          toastText: "",  
          animationData: animation.export()
        })
      }.bind(this));
    }.bind(this), 2000);
  }
})
