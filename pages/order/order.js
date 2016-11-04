var OrderServer = require("../../server/order.js").Order;
var {DateManager} = require('../../utils/dateManage.js');

Page({
  data:{
    // text:"这是一个页面"
    orderData: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this;
      OrderServer.getOrderList(function (result) {
        if (result.data.status == 200) {
          var _orderData = OrderServer.getOrderListData();
          for (var index in _orderData.list) {
            _orderData.list[index].bookDate = DateManager.getTimeToLocaleDate(_orderData.list[index].bookDate);
          }
          _self.setData({
            // orderData: result.data.data
            orderData: _orderData
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
  },
  // 订单详情
  handleGoToOrderDetail: function (event) {
    var currentOrderId = event.currentTarget.dataset.orderid;
    var orderList = this.data.orderData.list;
    for (var index in orderList) {
      if (currentOrderId == orderList[index].orderId) {
        wx.navigateTo({url: "../order/orderDetail/orderDetail?orderData=" + JSON.stringify(orderList[index])});
      }
    }
  },
  handleCall: function (e) {
    var phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  }
})