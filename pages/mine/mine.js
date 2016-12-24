var UserServer = require("../../server/user.js").User;

Page({
  data:{
    avatar: '',
    nickname: ''
  },
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '线下专题拍摄服务',
      path: 'pages/home/home'
    }
  },
  onShow:function(){
    this.setData({
      avatar: UserServer.getAvatar(),
      nickname: UserServer.getUserName()
    })
  },
  handleGoToMyInfo: function () {
      wx.navigateTo({url: "myInfo/myInfo"});
  },
  handleGoToMyCoupon: function () {
      wx.navigateTo({url: "myCoupon/myCoupon"});
  },
  handleGoToFeedback: function () {
      wx.navigateTo({url: "feedback/feedback"});
  },
  handleGoToAboutUs: function () {
      wx.navigateTo({url: "aboutUs/aboutUs"});
  },
  handleSave: function () {
    // var url = "https://fe.c360dn.com/wxapps/photograph/images/user/user_coupon%403x.png";
    wx.navigateTo({url: "myInfo/myInfo"});
  }
})