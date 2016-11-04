var OrderServer = require("../../../server/order.js").Order;
var UserServer = require("../../../server/user.js").User;

var {DateManager} = require("../../../utils/dateManage.js");

Page({
  data:{
    list: {},
    imageList: [],
    locationText: "天府软件园",
    detailAddress: "",
    type: 1,
    currentDate: '',
    currentTimestamp: '',
    date: "2016-09-01",
    time: "12:00",
    dateIndex: 0,
    timeLength: ["1.0 小时", "1.5 小时", "2.0 小时", "2.5 小时", "3.0 小时", "3.5 小时", "4.0 小时"],
    timeLengthIndex: 0,
    userName: "",
    gender: 0,
    mobile: ""
  },
  onLoad:function(options){
    var startTimestamp = DateManager.getCurrentTimestamp()+3600;
    var startDate = DateManager.getDetailDate();
    var startTime = DateManager.getDetailTime();
    
    var list = JSON.parse(options.list);
    var imageList = JSON.parse(options.imageList);

    OrderServer.getLocationInfo(function () {
      var type = options.type;
      var userName = UserServer.getUserParams().nickname;
      var mobile = UserServer.getUserParams().mobile;
      this.setData({
        type: type,
        date: startDate,
        time: startTime,
        mobile: mobile,
        userName: userName,
        // locationText: OrderServer.getLocationText(),
        list: list,
        imageList: imageList
      });
    }.bind(this));
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // this.setData({
    //   locationText: OrderServer.getLocationText()
    // });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // 预览图片
  handlePreviewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  // 详细地址
  handleChangeDetailAddress: function (event) {
    this.setData({
      detailAddress: event.detail.value
    })
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
      date:e.detail.value
    })
  },
  bindTimeChange:function(e){
    this.setData({
      time:e.detail.value
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
    })
  },
  // 选择性别
  handleChoseGender: function (event) {
    var _gender = event.currentTarget.dataset.gender;
    this.setData({
      gender: _gender
    })
  },
  // 预约手机号
  handleChangeMobile: function (event) {
    this.setData({
      mobile: event.detail.value
    })
  },
  // 返回上一级界面
  handleBack: function () {
    wx.navigateBack();
  },
  // 立即预约，创建订单
  handleCreateOrder: function () {
    wx.showToast({
      title: '预约中...',
      icon: 'loading',
      duration: 10000
    })
    var _self = this;
    var bookTimestamp = DateManager.getTimestamp(this.data.date + " " + this.data.time);

    OrderServer.setLocationText(this.data.locationText+this.data.detailAddress);
    OrderServer.setDetailAddress(this.data.detailAddress);
    OrderServer.setType(2);
    OrderServer.setTimeLength(this.data.timeLength);
    OrderServer.setDate(1478335560);
    OrderServer.setUserName(this.data.userName);
    OrderServer.setGender(this.data.gender);
    OrderServer.setMobile(this.data.mobile);
    OrderServer.createOrder(function (res) {
      wx.hideToast()
      if (res.data.status == 200) {
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000
        });
        // wx.navigateTo({url: "../../order/orderDetail/orderDetail"});
        // wx.navigateTo({url: "../../order/order"});
        wx.redirectTo({url: "../../total/total?page=2"});
      } else if (res.data.status == 10880) {
        console.log(res.data.message)
      }
    });
  }
})