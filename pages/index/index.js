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
    loadingAnimationData: {},
    hidden: true,
    // userName: '11000000907',
    // password: '123456',
    userName: '',
    password: '',
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
    Loading.init(function (animation) {
        this.setData({
          loadingAnimationData:animation.export()
        })
    }.bind(this));
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
    // this.setData({
    //   hidden: true
    // })
      
    // wx.chooseImage({
    //   success:function(res){
    //     console.log(res)
    //     // console.log(getEtag(res.tempFilePaths[0]))
    //     this.setData({
    //       pic: res.tempFilePaths[0]
    //     })  
    //     // var reader = new FileReader();
    //     // reader.readAsDataURL(res.tempFilePaths[0]);
    //     // reader.onload=function(e){
    //     //   console.log("aa")
    //     // }
    //   }.bind(this)
    // });


    var _self = this;
    this.loadingTap();
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
          wx.redirectTo({
              url: '../total/total'
          })
        break;
      }
      _self.loadingChange();
    }, function (error) {
      _self.handleAlert(error);
      _self.loadingChange();
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
    // Loading.hide(function (animation) {
    //     this.setData({
    //       loadingAnimationData:animation.export()
    //     })
    //   }.bind(this));
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
