var OrderServer = require("../../../server/order.js").Order;

Page({
  data:{
    hidden: true,
    price: 199,
    timeLength: '234:23:00',
    statusArray: ["订单提交", "等待拍摄", "正在拍摄", "付款", "完成"],
    status: 1,
    orderId: '',
    userName: 'Mary',
    photographer: '',
    mobile: '',
    time: '',
    address: '',
    amount: '1244'
  },
  onLoad:function(options){
    var orderData = JSON.parse(options.orderData)
    var time = orderData.bookDate;
    this.setData({
      status: parseInt(orderData.orderStat) + 1,
      orderId: orderData.orderId,
      photographer: orderData.nickname,
      mobile: orderData.mobile,
      time: time,
      address: orderData.place
    })
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
  handleCancelOrder: function () {
    this.loadingTap();
    var _self = this;
    OrderServer.setOrderId(this.data.orderId);
    OrderServer.cancelOrder(function () {
      _self.loadingChange();
      wx.navigateBack();
    });
  },
  handleGoToGallery: function () {
	  wx.navigateTo({url: "../../gallery/gallery"});
  },
  // 开启loading
  loadingTap: function () {
    this.setData({
      hidden: false
    })
  },
  // 关闭loading
  loadingChange: function () {
    this.setData({
      hidden: true
    })
  },
})