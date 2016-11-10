var {root, loginRoot} = require("../../../server/common.js");
var GlobalServer = require("../../../server/global.js").Global;

Page({
  data:{
    sceneData: {},
    imageList: [],
    price: 199,
    type: 1
  },
  onLoad:function(options){
    var _self = this;
    var imageList = [];
    // 获取客片欣赏信息
    GlobalServer.getSceneData(options.type, function(res) {
        var sceneData = res.data.data;
        if (res.data.status == "200") {
          var _list = sceneData.list;
          // 抽取图片信息，方便传递到下一个界面
          for (var i in _list) {
            imageList.push(_list[i].photo);
          }
          _self.setData({
            sceneData: sceneData,
            imageList: imageList,
            price: GlobalServer.getPrice(),
            type: options.type
          })
        }
    })
  },
  // 跳转到预约界面
  handleGoToBook:function (event) {
    wx.navigateTo({url: "./../book/book?type=" + this.data.type + "&imageList=" + JSON.stringify(this.data.imageList)})
  },
  // 浏览图片
  handlePreviewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }
})