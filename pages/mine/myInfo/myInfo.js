var UserServer = require("../../../server/user.js").User;

Page({
  data:{
    toastText: "",
    animationData: {},
    hidden: true,
    userData: {},
    avatar: '',
    nickname: '',
    gender: 0,
    mobile: ''
  },
  onLoad:function(options){
    this.setData({
      avatar: UserServer.getAvatar(),
      nickname: UserServer.getUserName()?UserServer.getUserName():"",
      gender: UserServer.getGender(),
      mobile: UserServer.getMobile()
    })
  },
  // 修改头像
  // handleChoseImage: function () {
  //   var _self = this;
  //   wx.chooseImage({
  //     count: 9,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {
  //       var tempFilePaths = res.tempFilePaths;
  //       _self.setData({
  //         avatar: tempFilePaths
  //       })
  //     }
  //   });
  // },
  // 修改性别
  handleChoseGender: function (event) {
    this.setData({
      gender: event.currentTarget.dataset.gender
    });
    UserServer.setGender(this.data.gender);
    UserServer.setUserName(this.data.nickname);
    UserServer.updateInfo({sex: this.data.gender});
  },
  // 修改昵称
  handleChangeNickname: function (event) {
    this.setData({
      nickname: event.detail.value
    });
    UserServer.setGender(this.data.gender);
    UserServer.setUserName(this.data.nickname);
    UserServer.updateInfo({nickname: this.data.nickname});
  },
  // 修改手机
  handleChangeMobile: function (event) {
    this.setData({
      mobile: event.detail.value
    });
    UserServer.setGender(this.data.gender);
    UserServer.setUserName(this.data.nickname);
    UserServer.updateInfo({mobile: this.data.mobile});
  }
})