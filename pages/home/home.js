var GlobalServer = require("../../server/global.js").Global;
var OrderServer = require("../../server/order.js").Order;

var {DateManager} = require('../../utils/dateManage.js');

Page({
  data:{
    couponHidden: true,
    bannerList: [],
    sceneList: [],
    price: ''
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
    var appInstance = getApp();
    OrderServer.controlCouponHidden(function () {
        _self.setData({
            couponHidden: appInstance.globalData.couponHidden
        })
    });
    var _self = this;
    // var bannerList = [
    //   "../../resource/images/tabBar/fb_tab_home@3x.png",
    //   "../../resource/images/tabBar/fb_tab_orders@3x.png",
    //   "../../resource/images/tabBar/fb_tab_photos@3x.png"
    // ]
    // 获取轮播图片信息
    GlobalServer.getSlideList(function (result) {
        _self.setData({
            bannerList: result.data
            // bannerList: bannerList
        })
    });
    // 获取单价信息
    GlobalServer.getConfList(function (result) {
        _self.setData({
            price: result.data.price
        })
    });
    GlobalServer.getSceneList(function (result) {
      var sceneList = [],
          _sceneList = [];
      sceneList = result.data.data;
      OrderServer.setSceneData(sceneList);
      for (var i in sceneList) {
        if (sceneList[i].status > 0) {
          _sceneList.push(sceneList[i]);
        }
      }
      _self.setData({
        sceneList: _sceneList
      })
    });
  },
  // 跳转到场景
  handleGoToScene: function (event) {
    wx.navigateTo({url: "../home/enjoy/enjoy?type=" + event.currentTarget.dataset.type})
  },
  handleCloseCoupon: function () {
    this.setData({
      couponHidden: true
    })
  }
})