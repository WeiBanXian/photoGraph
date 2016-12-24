var OrderServer = require("../../../../server/order.js").Order;

Page({
  data:{
    locationPois: [],
    currentCity: ''
  },
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '线下专题拍摄服务',
      path: 'pages/home/home'
    }
  },
  onLoad:function(options){
    OrderServer.setCurrentCity('成都');
    this.setData({
      locationPois: OrderServer.getLocationPois(),
      currentCity: OrderServer.getCurrentCity()
    })
  },
  handleGoToCity: function () {
    wx.navigateTo({url: "city/city"});
  },
  handleCancelSearch: function () {
    wx.navigateBack();
  },
  handleChoseLocation: function (event) {
    var locationtext = event.currentTarget.dataset.locationtext;
    var lat = event.currentTarget.dataset.lat;
    var lng = event.currentTarget.dataset.lng;
    OrderServer.setLocationText(locationtext);
    OrderServer.setLatitude(lat);
    OrderServer.setLongitude(lng);
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