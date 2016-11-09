var {root, loginRoot} = require("../../../server/common.js");
var UserServer = require("../../../server/user.js").User;

Page({
  data:{
    // text:"这是一个页面"
    sceneData: {},
    imageList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this;
    var _data = UserServer.getDataWithPublicParams({type: options.type});
    var imageList = [];
    wx.request({
      url: root + '/photoBazaar/photo/photoSamples',
      data: _data,
      medthod: 'post',
      header:{
          "Content-Type":"application/json"
      },
      success: function(res) {
          var sceneData = res.data.data;
          if (res.data.status == "200") {
            var _list = sceneData.list;
            for (var i in _list) {
              imageList.push(_list[i].photo);
            }
            _self.setData({
              sceneData: sceneData,
              imageList: imageList
            })
          }
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  handleGoToBook:function (event) {
    wx.navigateTo({url: "./../book/book?list=" + JSON.stringify(this.data.sceneData.list) + "&imageList=" + JSON.stringify(this.data.imageList)})
  },
  handlePreviewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }
})