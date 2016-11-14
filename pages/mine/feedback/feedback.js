Page({
  data:{
    toView: "last",
    messageList: [],
    avator: '',
    inputText: ''
  },
  onLoad:function(options){
    var _self = this;
    var avator = getApp().globalData.userInfo.avatarUrl;
    wx.getStorage({
      key: 'messageList',
      success: function(res) {
        _self.setData({
          messageList: JSON.parse(res.data),
          avator: avator
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
      headPic: this.data.avator,
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
    console.log(this.data.inputText)
  }
})