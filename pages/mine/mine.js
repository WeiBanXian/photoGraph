var UserServer = require("../../server/user.js").User;
var {File} = require('../../utils/file.js');
Page({
  data:{
    avatar: '',
    nickname: ''
  },
  onShow:function(){
    var _userData = UserServer.getUserParams();
    this.setData({
      avatar: _userData.avatar,
      nickname: _userData.nickname
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
    var url = "https://www.sslshopper.com/assets/images/disable-ssl2-in-iis.png";
    File.saveNetworkPicture(url, function () {
        File.getSavedFileList();
    });
  }
})