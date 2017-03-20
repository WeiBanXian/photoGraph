var OrderServer = require("../../server/order.js").Order;
var GlobalServer = require("../../server/global.js").Global;
var {message} = require("../../server/common.js");

Page({
  data:{
    galleryList: [],
    scrollHeight: 0,
    sp: 1,
    loadHidden: true,
    loadText: '正在加载...',
    // isLogin: true,
    isLogin: false,
    isHolding: false,  // 图片处于长按状态，为了解决长按图片后会触发点击图片进入图片详情
    readyDelete: false // 选照片删除状态
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
    OrderServer.getOrderPhoto(1, function (result) {
      if (result.data.data.list.length < 18) {
        _self.setData({
          loadHidden: false
        })
      }
      // http://c360-o2o.c360dn.com/FuOjg-l8hcno6teKJhK3kMCE7ZGT
      // http://c360-o2o.c360dn.com/FuOjg-l8hcno6teKJhK3kMCE7ZGT?imageMogr2/thumbnail/!20p
      _self.setData({
        galleryList: result.data.data.list,
        sp: result.data.data.sp
      })
    });
  },
  onShow:function(){
    var appInstance = getApp();
    var isLogin = appInstance.globalData.isLogin;
    this.setData({
        isLogin: isLogin
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
      var _self = this;
      OrderServer.getOrderPhoto(1, function (result) {
        if (result.data.data.list.length < 18) {
          _self.setData({
            loadHidden: false
          })
        }
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
      if (result.data.data.list.length == 0) {
        _self.setData({
          loadText: '加载完成'
        })
        return;
      }
      if (result.data.data.list.length < 18) {
        _self.setData({
          loadHidden: false
        })
      }
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
    if (!this.data.isHolding) {
      var imageList = [];
      var _list = this.data.galleryList;
      console.log(_list)
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
    var index = e.currentTarget.dataset.index;
    this.setData({
      isHolding: true,
      readyDelete: true
    })
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
    // console.log(newGalleryList)
    //             _self.setData({
    //               galleryList: newGalleryList,
    //               readyDelete: false
    //             })
    // return
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
              // 如果照片库删除了后剩余图片少于18张，刷新照片列表（因为图片太少，页面上拉加载不会被触发）
              // 图片多于18张，则用剩余的（newGalleryList）更新照片列表
              if (newGalleryList.length < 18) {
                OrderServer.getOrderPhoto(1, function (result) {
                  if (result.data.data.list.length < 18) {
                    _self.setData({
                      loadHidden: false
                    })
                  }
                  _self.setData({
                    galleryList: result.data.data.list,
                    sp: result.data.sp,
                    readyDelete: false
                  })
                });
              } else {
                _self.setData({
                  galleryList: newGalleryList,
                  readyDelete: false
                })
                wx.hideToast();
              }
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
  loginAgain: function () {
    var _self = this;
    GlobalServer.loginAgain(function () {
      OrderServer.getOrderPhoto(1, function (result) {
        _self.setData({
          galleryList: result.data.data.list,
          sp: result.data.data.sp,
          isLogin: true
        })
      });
    });
  }
})