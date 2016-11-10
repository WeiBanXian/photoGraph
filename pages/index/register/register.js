var UserServer = require("../../../server/user.js").User;

Page({
  data:{
    toastText: "",
    animationData: {},
    hidden: true,
    // userName: '18583269107',
    userName: '',
    password: '',
    registerCode: '',
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
      registerCode: event.detail.value
    })
  },
  // 获取验证码
  handleRequestRegisterCode: function () {
    var _self = this;
    var registerTextNum = 60;
    this.loadingTap();
    UserServer.setMobile(this.data.userName);
    UserServer.setPassword(this.data.password);
    
    UserServer.getRequestRegisterCode(function (res) {
      var data = res.data;
      if (data.status == 200) {
        _self.setData({
          registerBtnActive: true,
          registerText: registerTextNum + "s"
        });
        _self.timer = setInterval(function () {
          if (registerTextNum == 0) {
            registerTextNum = 60;
            _self.setData({
              registerText: "获取验证码"
            });
            clearInterval(_self.timer);
          } else {
            registerTextNum --;
            _self.setData({
              registerText: registerTextNum + "s"
            });
          }
        }.bind(this), 1000);
      } else {
        clearInterval(_self.timer);
        registerTextNum = 60;
        _self.setData({
          registerText: "获取验证码"
        });
        
        switch (data.status) {
          case 20881:
          
          break;
        }
      }
      _self.loadingChange();
    }, function (mes) {
      _self.loadingChange();
    });
  },
  // 注册
  handleRegister: function() {
    var _self = this;
    this.loadingTap();
    UserServer.setMobile(this.data.userName);
    UserServer.setPassword(this.data.password);
    UserServer.setRegisterCode(this.data.registerCode);

    UserServer.register(function (res) {
      var data = res.data;
      if (data.status == "200") {
        wx.redirectTo({
            url: '../../total/total'
        })
      } else if (data.status == "10537") {
        
      } else if (data.status == "20881") {
        
      }
      _self.loadingChange();
    }, function (error) {
      
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
  }
})