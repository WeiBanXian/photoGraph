var OrderServer = require("../../../../server/order.js").Order;

Page({
  data:{
    locationPois: [],
    currentCity: ''
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
    var locationtext = event.target.dataset.locationtext;
    var lat = event.target.dataset.lat;
    var lng = event.target.dataset.lng;
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