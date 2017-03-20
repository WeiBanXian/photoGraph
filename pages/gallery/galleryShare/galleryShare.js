var OrderServer = require("../../../server/order.js").Order;
var UserServer = require("../../../server/user.js").User;
var {message} = require("../../../server/common.js");

Page({
  data:{
    imageList: [],
    orderId: ''
  },
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '看看我分享的图片吧',
      path: 'pages/gallery/galleryShare/galleryShare?orderId=' + this.data.orderId
    }
  },
  onLoad: function(options) {
    this.setData({
      orderId: options.orderId
    })
    var _self = this;
    var imageList = [];
    OrderServer.getPhotosByOrderId(options.orderId, function (res) {
      var _list = res.data.data.list;
      for (var i in _list) {
        imageList.push(_list[i].photourl);
      }
      _self.setData({
        imageList: imageList,
        galleryList: _list
      })
    });
  },
  // 浏览图片
  handlePreviewImage: function (e) {
    var imageList = [];
    var _list = this.data.galleryList;
    // 抽取图片信息，方便传递到下一个界面
    for (var i in _list) {
      imageList.push(_list[i].photourl);
    }
    var current = e.target.dataset.src
    wx.previewImage({
      current: e.target.dataset.src,
      urls: imageList
    })
  },
  // 返回首页
  handleGoToHome: function () {
    wx.switchTab({
      url: "../../home/home"
    })
  }
})