var OrderServer = require("../../server/order.js").Order;
var {DateManager} = require('../../utils/dateManage.js');

Page({
  data:{
    orderList: [],
    sp: 1
  },
  onLoad:function(options){
    // 设置为true时，当从“订单详情”页取消订单后，返回到“订单列表”页时重新请求订单列表数据并刷新
    OrderServer.setIsCancelOrder(true);
  },
  onShow:function(){
    var _self = this;
    if (OrderServer.getIsCancelOrder()) {
      // 获取订单列表
      OrderServer.getOrderList(1, function (result) {
        var _orderData = OrderServer.getOrderListData();
        // 将订单时间的时间戳改为常规形式
        for (var index in _orderData.list) {
          _orderData.list[index].bookDate = DateManager.getTimeToLocale(_orderData.list[index].bookDate);
          _orderData.list[index].pTime = DateManager.getTimeLength(_orderData.list[index].pTime);
        }
        _self.setData({
          orderList: _orderData.list,
          sp: result.data.data.sp
        })
      });
    }
  },
  // 跳转到订单详情
  handleGoToOrderDetail: function (event) {
    var currentOrderId = event.currentTarget.dataset.orderid;
    var orderList = this.data.orderList;
    for (var index in orderList) {
      if (currentOrderId == orderList[index].orderId) {
        wx.navigateTo({url: "../order/orderDetail/orderDetail?orderData=" + JSON.stringify(orderList[index])});
      }
    }
  },
  // 拨打电话
  handleCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
      // 获取订单列表
      var _self = this;
      OrderServer.getOrderList(1, function (result) {
        var _orderData = OrderServer.getOrderListData();
        // 将订单时间的时间戳改为常规形式
        for (var index in _orderData.list) {
          _orderData.list[index].bookDate = DateManager.getTimeToLocale(_orderData.list[index].bookDate);
        }
        _self.setData({
          orderList: _orderData.list,
          sp: result.data.data.sp
        })
        wx.stopPullDownRefresh();
      });
  },
  // 上拉加载
  handeScrollToLower: function () {
      // 获取订单列表
      var _self = this;
      OrderServer.getOrderList(this.data.sp, function (result) {
        var _orderData = OrderServer.getOrderListData();
        // 将订单时间的时间戳改为常规形式
        for (var index in _orderData.list) {
          _orderData.list[index].bookDate = DateManager.getTimeToLocale(_orderData.list[index].bookDate);
        }
        var orderList = _self.data.orderList.concat(_orderData.list);
        _self.setData({
          orderList: orderList,
          sp: result.data.data.sp
        })
        wx.stopPullDownRefresh();
      });
  }
})