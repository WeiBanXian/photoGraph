var {root, loginRoot} = require("../../../server/common.js");
var UserServer = require("../../../server/user.js").User;


Page({
  data:{
    // text:"这是一个页面"
    sceneData: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this;
    var _data = UserServer.getDataWithPublicParams({type: options.type});
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
            _self.setData({
              sceneData: sceneData
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
    console.log(this.data.sceneData.list)
    wx.navigateTo({url: "./../book/book?list=" + JSON.stringify(this.data.sceneData.list)})
  },
  handleBack: function () {
    wx.navigateBack();
  }
})