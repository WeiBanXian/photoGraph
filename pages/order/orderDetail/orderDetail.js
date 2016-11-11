var OrderServer = require("../../../server/order.js").Order;
var GlobalServer = require("../../../server/global.js").Global;

Page({
  data:{
    bgPic: '',
    price: '',
    timeLength: '00:00:00',
    statusArray: ["订单提交", "等待拍摄", "正在拍摄", "付款", "完成"],
    status: 4,
    orderId: '',
    userName: 'Mary',
    photographer: '',
    mobile: '',
    time: '',
    address: '',
    amount: '1244'
  },
  onLoad:function(options){
    var orderData = JSON.parse(options.orderData);
    this.setData({
      status: parseInt(orderData.orderStat) + 1,
      orderId: orderData.orderId,
      photographer: orderData.nickname,
      mobile: orderData.mobile,
      time: orderData.bookDate,
      address: orderData.place,
      bgPic: orderData.scenePic,
      price: GlobalServer.getPrice()
    })
  },
  // 取消订单
  handleCancelOrder: function () {
    var _self = this;
    OrderServer.setOrderId(this.data.orderId);
    OrderServer.cancelOrder(function () {
      wx.navigateBack();
    });
  },
  // 跳转到照片库
  handleGoToGallery: function () {
	  wx.navigateTo({url: "../../gallery/gallery"});
  },
  // 拨打电话
  handleCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.mobile //仅为示例，并非真实的电话号码
    })
  }
})