var {root, loginRoot} = require("../../server/common.js");
var UserServer = require("../../server/user.js").User;
var OrderServer = require("../../server/order.js").Order;
var GlobalServer = require("../../server/global.js").Global;

var {DateManager} = require('../../utils/dateManage.js');

Page({
  data:{
    page: 1,
    homeScrollTop: 0,
    orderScrollTop: 0,
    galleryScrollTop: 0,
    homeData: {
      bannerData: {},
      priceData: {},
      sceneData: {}
    },
    orderData: {},
    galleryData: {},
    mineData: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    OrderServer.setIsCancelOrder(true);
    if (options.page && options.page > 0) {
      this.setData({
        page: options.page
      })
    }
  },
  onReady:function(){
    // 页面渲染完成
    var _self = this;
    // 首页
    wx.request({
      url: root + '/photoBazaar/index/slide',
      data: {},
      medthod: 'post',
      header:{
          "Content-Type":"application/json"
      },
      success: function(res) {
          var data = _self.data.homeData;
          data.bannerData = res.data;
          if (res.data.status == "200") {
            _self.setData({
              homeData: data
            })
          }
      }
    })
    wx.request({
      url: root + '/photoBazaar/index/conf',
      data: {},
      medthod: 'post',
      header:{
          "Content-Type":"application/json"
      },
      success: function(res) {
          var data = _self.data.homeData;
          data.priceData = res.data;
          if (res.data.status == "200") {
            _self.setData({
              homeData: data
            })
          }
      }
    })
  },
  onShow:function(){
    // 页面显示
    // 订单列表
    var mineData = UserServer.getUserParams();
    this.setData({
      mineData: mineData
    })
    var _self = this;
    if (OrderServer.getIsCancelOrder()) {
      OrderServer.getOrderList(function (result) {
        if (result.data.status == 200) {
          var _orderData = OrderServer.getOrderListData();
          for (var index in _orderData.list) {
            _orderData.list[index].bookDate = DateManager.getTimeToLocaleDate(_orderData.list[index].bookDate);
          }
          // _orderData.list = [];
          _self.setData({
            // orderData: result.data.data
            orderData: _orderData
          })
        } else {
          _orderData.list = [];
          _self.setData({
            orderData: _orderData
          })
        }
      });
    }
    var _galleryData = {};
    _galleryData.list = [];
    this.setData({
      galleryData: _galleryData
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // 滚动到顶部
  handleScrollUpper: function () {
    
  },
  // 滚动到底部
  handleScrollLower: function () {
    
  },
  // 首页界面滚动事件
  handleHomeScroll: function (e) {
    var _homeScrollTop = e.detail.scrollTop;
    GlobalServer.setHomeScrollTop(_homeScrollTop)
  },
  // 订单界面滚动事件
  handleOrderScroll: function (e) {
    var _orderScrollTop = e.detail.scrollTop;
    GlobalServer.setOrderScrollTop(_orderScrollTop)
  },
  // 照片库界面滚动事件
  handleGalleryScroll: function (e) {
    var _galleryScrollTop = e.detail.scrollTop;
    GlobalServer.setGalleryScrollTop(_galleryScrollTop)
  },
  // 切换界面
  handleChangeTab: function (event) {
      this.setData({
        page: event.target.dataset.page,
        orderScrollTop: GlobalServer.getOrderScrollTop(),
        homeScrollTop: GlobalServer.getHomeScrollTop(),
        galleryScrollTop: GlobalServer.getGalleryScrollTop()
      })
  },
  // 跳转到我的资料
  handleGoToMyInfo: function () {
      wx.navigateTo({url: "../mine/myInfo/myInfo"});
  },
  // 跳转到我的优惠券
  handleGoToMyCoupon: function () {
      wx.navigateTo({url: "../mine/myCoupon/myCoupon"});
  },
  // 跳转到意见反馈
  handleGoToFeedback: function () {
      wx.navigateTo({url: "../mine/feedback/feedback"});
  },
  // 跳转到关于我们
  handleGoToAboutUs: function () {
      wx.navigateTo({url: "../mine/aboutUs/aboutUs"});
  },
  // 跳转到场景
  handleGoToScene: function (event) {
    wx.navigateTo({url: "../home/enjoy/enjoy?type=" + event.currentTarget.dataset.type})
  },
  // 订单列表
  handleGoToOrderDetail: function (event) {
    var currentOrderId = event.currentTarget.dataset.orderid;
    var orderList = this.data.orderData.list;
    for (var index in orderList) {
      if (currentOrderId == orderList[index].orderId) {
        wx.navigateTo({url: "../order/orderDetail/orderDetail?orderData=" + JSON.stringify(orderList[index])});
      }
    }
  }
})