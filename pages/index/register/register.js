var UserServer = require("../../../server/user.js").User;
var Alert = require("../../template/alert/alert.js").Alert;

Page({
  data:{
    toastText: "haha",
    animationData: {},
    hidden: true,
    userName: '18583269107',
    password: '584520',
    regiserCode: '',
    registerBtnActive: false,
    registerText: "获取验证码"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    Alert.show(function (animation) {
      this.setData({
            animationData:animation.export()
      })
    }.bind(this));
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
    clearInterval(this.timer);
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
  // 验证码
  handleChangeRegisterCode: function (event) {
    this.setData({
      regiserCode: event.detail.value
    })
  },
  // 注册
  handleRegister: function() {
    var _self = this;
    this.loadingTap();
    UserServer.setUserName(this.data.userName);
    UserServer.setPassword(this.data.password);
    UserServer.setRegisterCode(this.data.registerCode);

    UserServer.checkPhoneNum(this.loadingChange, function() {
      UserServer.checkPassword(_self.loadingChange, function() {
        UserServer.register(function () {
          wx.redirectTo({
              url: '../../total/total'
          })
          _self.loadingChange();
        });
      });
    });
  },
  // 获取验证码
  handleRequestRegisterCode: function () {
    var _self = this;
    this.loadingTap();
    UserServer.setUserName(this.data.userName);
    UserServer.setPassword(this.data.password);

    UserServer.checkPhoneNum(this.loadingChange, function() {
      UserServer.checkPassword(_self.loadingChange, function() {
        UserServer.getRegisterCode(function () {
          wx.redirectTo({
              url: '../../total/total'
          })
          _self.loadingChange();
        });
      });
    });

    var registerTextNum = 60;
    this.setData({
      registerBtnActive: true,
      registerText: registerTextNum + "s"
    });
    this.timer = setInterval(function () {
      if (registerTextNum == 0) {
        registerTextNum = 60;
        this.setData({
          registerText: "获取验证码"
        });
        clearInterval(this.timer);
      } else {
        registerTextNum --;
        this.setData({
          registerText: registerTextNum + "s"
        });
      }
    }.bind(this), 1000);
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
  }
})