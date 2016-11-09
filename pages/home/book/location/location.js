var OrderServer = require("../../../../server/order.js").Order;

Page({
  data:{
    locationPois: [],
    currentCity: ''
    // text:"这是一个页面"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    OrderServer.setCurrentCity('成都');
    this.setData({
      locationPois: OrderServer.getLocationPois(),
      currentCity: OrderServer.getCurrentCity()
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
  handleGoToCity: function () {
    wx.navigateTo({url: "city/city"});
  },
  handleCancelSearch: function () {
    wx.navigateBack();
  },
  handleChoseLocation: function (event) {
    var locationtext = event.target.dataset.locationtext;
    var location = event.target.dataset.location.split(",");
    OrderServer.setLocationText(locationtext);
    OrderServer.setLongitude(location[0]);
    OrderServer.setLatitude(location[1]);
    wx.navigateBack();
  },
  handleSearchLocation: function (event) {
    var searchText = event.detail.value;
    OrderServer.setSearchText(searchText);
    OrderServer.searchLocation(function (result) {
      this.setData({
        locationPois: result
      })
    }.bind(this));
  }
})