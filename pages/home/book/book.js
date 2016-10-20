var OrderServer = require("../../../server/order.js").Order;
var UserServer = require("../../../server/user.js").User;

Page({
  data:{
    list: {},
    locationText: "",
    detailAddress: "",
    type: 1,
    timeLength: ["1.0 小时", "1.5 小时", "2.0 小时", "2.5 小时", "3.0 小时", "3.5 小时", "4.0 小时"],
    date: ['Android', 'IOS', 'ReactNativ', 'WeChat', 'Web'],
    timeLengthIndex: 0,
    dateIndex: 0,
    time: '2016-09-26',
    userName: "",
    gender: 0,
    mobile: ""
  },
  onLoad:function(options){
    this.setData({
      list: JSON.parse(options.list)
    })
    console.log(options)
    var now = new Date();
    var date = (now.getTime()+3600*1000 + '').substr(0, 10);      //10位时间戳
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日    
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    
    var clock = year + "-";
    
    if(month < 10)
        clock += "0";
    
    clock += month + "-";
    
    if(day < 10)
        clock += "0";
        
    clock += day + " ";
    
    if(hh < 10)
        clock += "0";
        
    clock += hh + ":";
    if (mm < 10) clock += '0'; 
    clock += mm; 

    OrderServer.getLocationInfo(function () {
      var type = options.type;
      var userName = UserServer.getUserParams().nickname;
      var mobile = UserServer.getUserParams().mobile;
      this.setData({
        type: type,
        time: clock,
        date: date,
        mobile: mobile,
        userName: userName,
        locationText: OrderServer.getLocationText()
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
    OrderServer.setLocationText(this.data.locationText);
    OrderServer.setDetailAddress(this.data.detailAddress);
    OrderServer.setType(this.data.type);
    OrderServer.setTimeLength(this.data.timeLength);
    OrderServer.setDate(this.data.date);
    OrderServer.setUserName(this.data.userName);
    OrderServer.setGender(this.data.gender);
    OrderServer.setMobile(this.data.mobile);
    OrderServer.createOrder(function (res) {
      if (res.data.status == 200) {
        // wx.navigateTo({url: "../../order/orderDetail/orderDetail"});
        wx.navigateTo({url: "../../order/order"});
      } else if (res.data.status == 10880) {
        console.log(res.data.message)
      }
    });
  }
})