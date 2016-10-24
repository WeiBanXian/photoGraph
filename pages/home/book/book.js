var OrderServer = require("../../../server/order.js").Order;
var UserServer = require("../../../server/user.js").User;

var {DateManager} = require("../../../utils/dateManage.js");

Page({
  data:{
    list: {},
    locationText: "",
    detailAddress: "",
    type: 1,
    currentDate: '',
    currentTimestamp: '',
    date: ['Android', 'IOS', 'ReactNativ', 'WeChat', 'Web'],
    dateIndex: 0,
    timeLength: ["1.0 小时", "1.5 小时", "2.0 小时", "2.5 小时", "3.0 小时", "3.5 小时", "4.0 小时"],
    timeLengthIndex: 0,
    userName: "",
    gender: 0,
    mobile: ""
  },
  onLoad:function(options){
    var startTimestamp = DateManager.getCurrentTimestamp()+3600;
    var start = DateManager.getTimeToLocale(startTimestamp);
    
    OrderServer.getLocationInfo(function () {
      var type = options.type;
      var userName = UserServer.getUserParams().nickname;
      var mobile = UserServer.getUserParams().mobile;
      this.setData({
        type: type,
        currentDate: start,
        currentTimestamp: startTimestamp,
        date: start,
        mobile: mobile,
        userName: userName,
        locationText: OrderServer.getLocationText(),
        list: JSON.parse(options.list)
      });
    }.bind(this));
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.setData({
      locationText: OrderServer.getLocationText()
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
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
  // 日期
  handleSelectDate: function(e) {
    this.setData({
      dateIndex: e.detail.value
    });
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
    // OrderServer.setLocationText(this.data.locationText+this.data.detailAddress);
    // OrderServer.setDetailAddress(this.data.detailAddress);
    // OrderServer.setType(this.data.type);
    // OrderServer.setTimeLength(this.data.timeLength);
    // OrderServer.setDate(this.data.currentTimestamp);
    // OrderServer.setUserName(this.data.userName);
    // OrderServer.setGender(this.data.gender);
    // OrderServer.setMobile(this.data.mobile);
    // OrderServer.createOrder(function (res) {
    //   if (res.data.status == 200) {
        // wx.navigateTo({url: "../../order/orderDetail/orderDetail"});
        wx.navigateTo({url: "../../order/order"});
        // wx.redirectTo({url: "../../total/total?page=2"});
    //   } else if (res.data.status == 10880) {
    //     console.log(res.data.message)
    //   }
    // });
  }
})