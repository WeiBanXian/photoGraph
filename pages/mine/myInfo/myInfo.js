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
    mobile: '',
    isChanged: false
  },
  onShareAppMessage: function () {
    return {
      title: '想拍就拍Lite',
      desc: '线下专题拍摄服务',
      path: 'pages/home/home'
    }
  },
  onLoad:function(options){
    this.setData({
      avatar: UserServer.getAvatar(),
      nickname: UserServer.getUserName()?UserServer.getUserName():"",
      gender: UserServer.getGender(),
      mobile: UserServer.getMobile()
    })
  },
  handleSubmit: function () {
    if (this.data.mobile.length != 11 || isNaN(this.data.mobile)) {
      wx.showModal({
          title: '提示',
          content: '手机号必须是11位的数字',
          success: function(res) {
              if (res.confirm) {
                  // console.log('用户点击确定')
              }
          }
      });
      return;
    }
    if (this.data.nickname == '') {
      wx.showModal({
          title: '提示',
          content: '昵称不能为空',
          success: function(res) {
              if (res.confirm) {
                  // console.log('用户点击确定')
              }
          }
      });
      return;
    }
    UserServer.updateInfo({
      mobile: this.data.mobile,
      sex: this.data.gender,
      nickname: this.data.nickname
    });
  },
  handleShowBtn: function () {
    this.setData({
      isChanged: true
    });
  },
  // 修改性别
  handleChoseGender: function (event) {
    this.setData({
      isChanged: true,
      gender: event.currentTarget.dataset.gender
    });
  },
  // 修改昵称
  handleChangeNickname: function (event) {
    this.setData({
      isChanged: true,
      nickname: event.detail.value
    });
  },
  // 修改手机
  handleChangeMobile: function (event) {
    this.setData({
      isChanged: true,
      mobile: event.detail.value
    });
  }
})