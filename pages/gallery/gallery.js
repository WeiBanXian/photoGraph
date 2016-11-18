var OrderServer = require("../../server/order.js").Order;

Page({
  data:{
    galleryList: []
  },
  onLoad: function(options) {
    var imageList = [
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg",
      "https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg"
    ];
    var _self = this;
    var _galleryList = [];
    _galleryList.push(imageList);
    _galleryList.push(imageList);
    _galleryList.push(imageList);
    OrderServer.getOrderPhoto(function (res) {
      // console.log(res);
      _self.setData({
        galleryList: res.data.data.list
      })
    });
  },
  // 浏览图片
  handlePreviewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.galleryList[e.target.dataset.index]
    })
  }
})