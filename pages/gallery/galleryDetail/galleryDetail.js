var OrderServer = require("../../../server/order.js").Order;

Page({
  data:{
    imageList: []
  },
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '线下专题拍摄服务',
      path: 'pages/home/home'
    }
  },
  onLoad: function(options) {
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