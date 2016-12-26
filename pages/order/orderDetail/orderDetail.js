var OrderServer = require("../../../server/order.js").Order;
var GlobalServer = require("../../../server/global.js").Global;

Page({
  data:{
    payWrapperHidden: true,   // 支付弹框是否显示
    useCoupon: true,          // 是否适用优惠券
    bgPic: '',                // 背景图片
    price: '',                // 单价
    timeLength: '00:00:00',   // 时间
    statusArray: ["订单提交", "等待拍摄", "正在拍摄", "付款", "完成"],    // 状态
    status: 1,                // 状态
    orderId: '',              // 订单号
    userName: '',             // 用户名字
    photographer: '',         // 摄影师名字
    mobile: '',               // 摄影师电话
    time: '',                 // 拍摄时间
    address: '',              // 拍摄地址
    pTime: '',                // 拍摄时长
    paytotal: '',             // 支付金额
    total: '',                // 总金额
    amount: '',             // 优惠金额
    coupon: ''                // 优惠券号
  },
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '线下专题拍摄服务',
      path: 'pages/home/home'
    }
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
      pTime: orderData.pTime,
      total: orderData.total,
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
	  wx.navigateTo({url: "../../gallery/galleryDetail/galleryDetail?orderId=" + this.data.orderId});
  },
  // 拨打电话
  handleCall: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否拨打：' + this.data.mobile,
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: this.data.mobile
          })
        }
      }.bind(this)
    })
  },
  openPayWrapper: function () {
    var _self = this;
    OrderServer.setOrderId(this.data.orderId);
    OrderServer.getPayCoupon(function () {
      OrderServer.useCoupon(function (result) {
        var payData = result.data.data;
        _self.setData({
          payWrapperHidden: false,
          useCoupon: true,
          paytotal: payData.paytotal,
          total: payData.total,
          amount: OrderServer.getAmount()
        })
      })
    });
  },
  closePayWrapper: function () {
    this.setData({
      payWrapperHidden: true
    })
  },
  choseCoupon: function (e) {
    OrderServer.setIsUseCoupon(!OrderServer.getIsUseCoupon());
    console.log(!OrderServer.getIsUseCoupon())
    OrderServer.useCoupon(function (result) {
      var payData = result.data.data;
      this.setData({
        useCoupon: e.detail.value,
        paytotal: payData.paytotal,
        total: payData.total,
        amount: payData.amount
      })
    }.bind(this));
  },
  handlePay: function () {
    OrderServer.prepayOrder(function (result) {
      OrderServer.payOrder(function () {
        OrderServer.setIsCancelOrder(false);
        wx.navigateBack();
      });
    });
  }
})