var GlobalServer = require("../../server/global.js").Global;

var {DateManager} = require('../../utils/dateManage.js');

Page({
  data:{
    bannerList: {},
    price: ''
  },
  onLoad:function(options){
    var _self = this;
    // 获取轮播图片信息
    GlobalServer.getSlideList(function (result) {
        _self.setData({
            bannerList: result.data
        })
    });
    // 获取单价信息
    GlobalServer.getConfList(function (result) {
        _self.setData({
            price: result.data.price
        })
    });
  },
  // 跳转到场景
  handleGoToScene: function (event) {
    wx.navigateTo({url: "../home/enjoy/enjoy?type=" + event.currentTarget.dataset.type})
  },
})