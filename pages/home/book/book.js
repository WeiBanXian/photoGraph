Page({
  data:{
    array: ['Android', 'IOS', 'ReactNativ', 'WeChat', 'Web', ''],
    index: 0,
    time: '2016-09-26'
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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
  listenerPickerSelected: function(e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
  },
  handleGoToLocation:  function () {
      wx.navigateTo({url: "location/location"})
  },
  handleBack: function () {
    wx.navigateBack();
  }
})