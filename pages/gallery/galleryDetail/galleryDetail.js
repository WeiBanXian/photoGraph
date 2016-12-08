var OrderServer = require("../../../server/order.js").Order;

Page({
  data:{
    imageList: []
  },
  onLoad: function(options) {
    var _self = this;
    var imageList = [];
    // wx.getSavedFileList({
    //   success: function(res) {
    //     console.log(res.fileList)
    //     if (res.fileList.length == 0) {
          OrderServer.getPhotosByOrderId(options.orderId, function (res) {
            var _list = res.data.data.list;
            for (var i in _list) {
              imageList.push(_list[i].photourl);
            }
            _self.setData({
              imageList: imageList
            })
            // wx.downloadFile({
            //   url: _self.data.imageList[0],
            //   success: function(data) {
            //     console.log(data)
            //     var tempFilePath = data.tempFilePath;
            //     wx.saveFile({
            //       tempFilePath: tempFilePath,
            //       success: function(result) {
            //         console.log(result);
            //         var savedFilePath = result.savedFilePath
            //       }
            //     })
            //   }
            // })
          });
        // } else {
        //     var _list = res.fileList;
        //     for (var i in _list) {
        //       imageList.push(_list[i].filePath);
        //     }
        //     _self.setData({
        //       imageList: imageList
        //     })
        // }
    //   }
    // })
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