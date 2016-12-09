var OrderServer = require("../../server/order.js").Order;

Page({
  data:{
    galleryList: [],
    sp: 1
  },
  onLoad: function(options) {
    var _self = this;
    // var _galleryList = [];
    // OrderServer.getOrderPhoto(function (res) {
    //   _self.setData({
    //     galleryList: res.data.data.list
    //   })
    // });
  },
  onShow:function(){
    var _self = this;
    OrderServer.getOrderPhoto(1, function (result) {
      _self.setData({
        galleryList: result.data.data.list,
        sp: result.data.data.sp
      })
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
      var _self = this;
      OrderServer.getOrderPhoto(1, function (result) {
        _self.setData({
          galleryList: result.data.data.list,
          sp: result.data.data.sp
        })
        wx.stopPullDownRefresh();
      });
  },
  // 上拉加载
  handeScrollToLower: function () {
      var _self = this;
      OrderServer.getOrderPhoto(this.data.sp, function (result) {
        var galleryList = _self.data.galleryList.concat(result.data.data.list);
        _self.setData({
          galleryList: galleryList,
          sp: result.data.data.sp
        })
        wx.stopPullDownRefresh();
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
    console.log(e.target.dataset.src)
    var current = e.target.dataset.src
    wx.previewImage({
      current: e.target.dataset.src,
      urls: imageList
    })
  }
})