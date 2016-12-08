var OrderServer = require("../../../server/order.js").Order;
var UserServer = require("../../../server/user.js").User;

var {DateManager} = require("../../../utils/dateManage.js");
var {root, userCenterRoot, wxapi, message} = require("../../../server/common.js");

Page({
  data:{
    imageList: [],
    locationText: "",
    detailAddress: "",
    type: 1,
    date: "2016-09-01",
    startDate: "2016-09-01",
    time: "12:00",
    startTime: "00:00",
    timeLength: ["1.0 小时", "1.5 小时", "2.0 小时", "2.5 小时", "3.0 小时", "3.5 小时", "4.0 小时"],
    timeLengthIndex: 0,
    userName: "",
    gender: 0,
    mobile: ""
  },
  onLoad:function(options){
    var date = DateManager.getDetailDate();
    var time = DateManager.getDetailTime();
    var imageList = JSON.parse(options.imageList);
    // 获取定位信息
    OrderServer.getLocationInfo(function () {
      var type = options.type;
      var userName = UserServer.getUserName();
      var gender = UserServer.getGender();
      var mobile = UserServer.getMobile();
      this.setData({
        type: type,
        date: date,
        time: time,
        startDate: date,
        userName: userName,
        locationText: OrderServer.getLocationText(),
        gender: gender,
        mobile: mobile,
        imageList: imageList
      });
    }.bind(this));
  },
  onShow:function(){
    // 进入搜索定位信息，点击选项返回后，重置定位地点
    this.setData({
      locationText: OrderServer.getLocationText()
    });
  },
  // 预览图片
  handlePreviewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    });
  },
  // 详细地址
  handleChangeDetailAddress: function (event) {
    this.setData({
      detailAddress: event.detail.value
    });
  },
  // 时长
  handleSelectTimeLength: function(e) {
    this.setData({
      timeLengthIndex: e.detail.value
    });
  },
  // 日期,
  bindDateChange:function(e){
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange:function(e){
    this.setData({
      time: e.detail.value
    })
  },
  // 跳转到地址
  handleGoToLocation:  function () {
      wx.navigateTo({url: "location/location"})
  },
  // 预约人姓名
  handleChangeName: function (event) {
    this.setData({
      userName: event.detail.value
    });
  },
  // 选择性别
  handleChoseGender: function (event) {
    this.setData({
      gender: event.currentTarget.dataset.gender
    });
  },
  // 预约手机号
  handleChangeMobile: function (event) {
    this.setData({
      mobile: event.detail.value
    });
  },
  // 立即预约，创建订单
  handleCreateOrder: function () {
    var _self = this;
    // 预约时间的时间戳
    var bookTimestamp = DateManager.getTimestamp(this.data.date + " " + this.data.time);
    // 设置地点、类型、时长、日期、姓名、性别、手机号
    OrderServer.setLocationText(this.data.locationText+this.data.detailAddress);
    OrderServer.setDetailAddress(this.data.detailAddress);
    OrderServer.setType(this.data.type);
    OrderServer.setTimeLength(this.data.timeLength);
    OrderServer.setDate(bookTimestamp);
    OrderServer.setUserName(this.data.userName);
    OrderServer.setGender(this.data.gender);
    OrderServer.setMobile(this.data.mobile);
    // 预约订单
    OrderServer.createOrder(function (res) {
      // wx.navigateTo({url: "../../order/orderDetail/orderDetail"});
      // wx.navigateTo({url: "../../order/order"});
      // wx.redirectTo({url: "../../total/total?page=2"});
      wx.navigateBack({delta: 3, page: 2});
    });
  }
})