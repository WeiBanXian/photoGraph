var UserServer = require("../../../server/user.js").User;

var {DateManager} = require('../../../utils/dateManage.js');

Page({
  data:{
    couponList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this;
    UserServer.getCouponList(function (result) {
      if (result.data.status == 200) {
        var _couponList = result.data.data.list;
        for (var index in _couponList) {
          _couponList[index].startTime = DateManager.getTimeToLocaleDate(_couponList[index].startTime);
          _couponList[index].endTime = DateManager.getTimeToLocaleDate(_couponList[index].endTime);
        }
        _self.setData({
          couponList: _couponList
        })
      }
    });
    
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
  }
})