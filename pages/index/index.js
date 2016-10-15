var root = require("../../server/common.js").root;
var loginRoot = require("../../server/common.js").loginRoot;
var md5 = require('../../utils/md5.js')

//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    userName: '18583269107',
    password: '584520'
  },
  //事件处理函数
  handleLogin: function() {
    
    var data = {};
    var isMobile = true;

    if (isMobile) {
      data = {
        mobile: this.data.userName,
        password: md5.MD5(md5.MD5(this.data.password)),
        appkey: "f6cb3d93e7ac1146"
      };
    }
    wx.request({
      url: loginRoot + '/api/v2/mobLoginForTest',
      data: data?data:{},
      medthod: 'post',
      header:{
          "Content-Type":"application/json"
      },
      success: function(res) {
        console.log(res);
        var data = res.data;
        if (res.data.status == "200") {
          wx.redirectTo({
            url: '../total/total'
          })
        }
      }
    });
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  handleChangePhoneNum: function (event) {
    this.setData({
      userName: event.detail.value
    })
  },
  handleChangePassword: function (event) {
    this.setData({
      password: event.detail.value
    })
  }
})
