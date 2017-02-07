var OrderServer = require("../../../server/order.js").Order;
var UserServer = require("../../../server/user.js").User;
var GlobalServer = require("../../../server/global.js").Global;

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
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '线下专题拍摄服务',
      path: 'pages/home/home'
    }
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
    var appInstance = getApp();
    var isLogin = appInstance.globalData.isLogin;
    console.log(isLogin)
    // 进入搜索定位信息，点击选项返回后，重置定位地点
    this.setData({
      isLogin: isLogin,
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
  formSubmit: function(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.formId);
    var formId = e.detail.formId;
    UserServer.setFormId(formId);
    var _self = this;
    // 预约时间的时间戳
    var bookTimestamp = DateManager.getTimestamp(this.data.date + " " + this.data.time);
    // 设置地点、类型、时长、日期、姓名、性别、手机号
    OrderServer.setLocationText(this.data.locationText+this.data.detailAddress);
    OrderServer.setDetailAddress(this.data.detailAddress);
    OrderServer.setType(this.data.type);
    OrderServer.setTimeLength(this.data.timeLength);
    OrderServer.setDate(bookTimestamp);
    OrderServer.setDateStr(this.data.date + " " + this.data.time);
    OrderServer.setUserName(this.data.userName);
    OrderServer.setGender(this.data.gender);
    OrderServer.setMobile(this.data.mobile);
    // 预约订单
    OrderServer.createOrder(function (res) {
      OrderServer.templateRequest();
      wx.switchTab({
        url: '../../../pages/order/order'
      })
    });
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  loginAgain: function () {
    var _self = this;
    GlobalServer.loginAgain(function () {
      var date = DateManager.getDetailDate();
      var time = DateManager.getDetailTime();
      // 获取定位信息
      OrderServer.getLocationInfo(function () {
        var userName = UserServer.getUserName();
        var gender = UserServer.getGender();
        var mobile = UserServer.getMobile();
        _self.setData({
          date: date,
          time: time,
          startDate: date,
          userName: userName,
          locationText: OrderServer.getLocationText(),
          gender: gender,
          mobile: mobile,
          isLogin: true
        });
      });
    });
  }
})