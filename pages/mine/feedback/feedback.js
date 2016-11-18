var UserServer = require("../../../server/user.js").User;

Page({
  data:{
    toView: "last",
    messageList: [],
    avatar: '',
    inputText: ''
  },
  onLoad:function(options){
    var _self = this;
    var avatar = UserServer.getUserParams().avatar;
    console.log(avatar)
    wx.getStorage({
      key: 'messageList',
      success: function(res) {
        _self.setData({
          messageList: JSON.parse(res.data),
          avatar: avatar
        });
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  handleInput: function (e) {
    this.setData({
      inputText: e.detail.value
    });
  },
  handleSubmit: function () {
    if (this.data.inputText == '') {
      return;
    }
    var messageList = this.data.messageList;
    messageList.push({
      type: 1,
      headPic: this.data.avatar,
      contentText: this.data.inputText
    });
    this.setData({
      messageList: messageList,
      toView: 'last',
      inputText: ''
    })
    wx.setStorage({
      key: "messageList",
      data: JSON.stringify(this.data.messageList)
    });
  }
})