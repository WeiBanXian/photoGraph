var UserServer = require("../../../server/user.js").User;

Page({
  data:{
    couponList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this;
    UserServer.getCouponList(function (result) {
      if (result.data.status == 200) {
        _self.setData({
          couponList: result.data.data.list
        })
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    console.log(this.data.couponList.length)
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})