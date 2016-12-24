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
  // 修改性别
  handleChoseGender: function (event) {
    this.setData({
      gender: event.currentTarget.dataset.gender
    });
    UserServer.updateInfo({sex: this.data.gender});
  },
  // 修改昵称
  handleChangeNickname: function (event) {
    this.setData({
      nickname: event.detail.value
    });
    UserServer.updateInfo({nickname: this.data.nickname});
  },
  // 修改手机
  handleChangeMobile: function (event) {
    this.setData({
      mobile: event.detail.value
    });
    UserServer.updateInfo({mobile: this.data.mobile});
  }
})