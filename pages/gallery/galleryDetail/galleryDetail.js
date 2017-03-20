var OrderServer = require("../../../server/order.js").Order;
var UserServer = require("../../../server/user.js").User;
var {message} = require("../../../server/common.js");

Page({
  data:{
    imageList: [],
    orderId: '',
    isHolding: false,   // 图片处于长按状态，为了解决长按图片后会触发点击图片进入图片详情
    readyDelete: false, // 选照片删除状态
    isCanDelete: false
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
      if (_list.length > 0 && UserServer.getUserId()) {
        _self.setData({
          isCanDelete: true
        })
      }
      _self.setData({
        imageList: imageList,
        galleryList: _list
      })
    });
  },
  // 浏览图片
  handlePreviewImage: function (e) {
    if (!this.data.isHolding) {
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
    }
    this.setData({
      isHolding: false
    })
  },
  handleChooseImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var galleryList = this.data.galleryList;
    galleryList[index].hasChosed = !galleryList[index].hasChosed;
    this.setData({
      galleryList: galleryList
    })
  },
  // 长按选中图片
  handleCatchlongChooseImage: function (e) {
    // 图片摇摆动画
    // setInterval(function () {
    //   var animation = wx.createAnimation({
    //     duration: 100,
    //     timingFunction: 'ease',
    //   })
    //   this.animation = animation
    //   animation.rotate(1).step()
    //   this.setData({
    //     animationData:animation.export()
    //   })
    //   setTimeout(function () {
    //     animation.rotate(-1).step()
    //     this.setData({
    //       animationData:animation.export()
    //     })
    //   }.bind(this), 100)
    // }.bind(this), 200);
    if (this.data.isCanDelete) {
      var index = e.currentTarget.dataset.index;
      this.setData({
        isHolding: true,
        readyDelete: true
      })
    }
  },
  // 删除图片
  handleDeleteImage: function () {
    var _self = this;
    var galleryList = this.data.galleryList;
    var deleteList = [], newGalleryList = [];
    // 将要删除的照片和剩余的照片分别放到两个数组中
    for (var i in galleryList) {
      if (galleryList[i].hasChosed) {
        deleteList.push(galleryList[i].pid)
      } else {
        newGalleryList.push(galleryList[i]);
      }
    }
    // 数组整合为字符串
    var deleteStr = deleteList.join(",");
    if (deleteList.length === 0) {
      message.alert("请选择要删除的照片");
      return;
    }
    wx.showModal({
      title: '是否删除',
      content: '删除照片后，云端也将会删除照片并不能恢复',
      success: function(res) {
        if (res.confirm) {
          // 删除照片
          OrderServer.getDelPhotos(deleteStr, function (delRes) {
            if (delRes.data.data) {
              _self.setData({
                galleryList: newGalleryList,
                readyDelete: false
              })
              wx.hideToast();
            } else {
              message.alert("照片删除失败，请稍候重试");
              wx.hideToast();
            }
          });
        }
      }
    })
  },
  handleCancelDelete: function () {
    this.setData({
      isHolding: false,
      readyDelete: false
    })
  },
})