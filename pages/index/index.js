var UserServer = require("../../server/user.js").User;
var Alert = require("../template/alert/alert.js").Alert;

//获取应用实例
var app = getApp()
Page({
  data: {
    toastText: "",
    animationData: {},
    hidden: true,
    userName: '11000000907',
    password: '123456',
    pic: ''
  },
  onLoad: function () {
    UserServer.init();
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
    wx.chooseImage({
      success:function(res){
        console.log(res)
        this.setData({
          pic: res.tempFilePaths[0]
        })  
      }.bind(this)
    });
    // var _self = this;
    // this.loadingTap();
    // UserServer.setMobile(this.data.userName);
    // UserServer.setPassword(this.data.password);
    // UserServer.login(function (res) {
    //   switch(res.status) {
    //     case 10538:
    //       this.handleAlert("请输入合法的手机号码");
    //     break;
    //     case 10510:
    //       this.handleAlert("账号密码输入有误");
    //     break;
    //     case 200:
    //       wx.redirectTo({
    //           url: '../total/total'
    //       })
    //     break;
    //   }
    //   _self.loadingChange();
    // }.bind(this));
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
