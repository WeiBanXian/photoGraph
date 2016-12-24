var OrderServer = require("../../../server/order.js").Order;

var {DateManager} = require('../../../utils/dateManage.js');

Page({
  data:{
    couponList: []
  },
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '线下专题拍摄服务',
      path: 'pages/home/home'
    }
  },
  onLoad:function(options){
    var _self = this;
    OrderServer.getCouponList(function (result) {
      var _couponList = result.data.data.list;
      if (_couponList && _couponList.length > 0) {
        for (var index in _couponList) {
          _couponList[index].startTime = DateManager.getTimeToLocaleDate(_couponList[index].startTime);
          _couponList[index].endTime = DateManager.getTimeToLocaleDate(_couponList[index].endTime);
        }
        _self.setData({
          couponList: _couponList
        })
      }
    });
  }
})