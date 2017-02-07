var OrderServer = require("../../../server/order.js").Order;

Page({
  data:{
    imageList: [],
    orderId: ''
  },
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '看看我分享的图片吧',
      path: 'pages/gallery/galleryDetail/galleryDetail?orderId=' + this.data.orderId
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
        imageList: imageList
      })
    });
  },
  // 浏览图片
  handlePreviewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.imageList
    })
  }
})