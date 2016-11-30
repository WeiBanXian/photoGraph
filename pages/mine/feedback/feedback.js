var UserServer = require("../../../server/user.js").User;

Page({
  data:{
    toView: "last",
    messageList: [],
    avatar: '',
    scrollTop: 0,
    scrollHeight: 0,
    inputText: ''
  },
  onLoad:function(options){
    var _self = this;
    // var avatar = UserServer.getUserParams().avatar;
    wx.getStorage({
      key: 'messageList',
      success: function(res) {
        _self.setData({
          messageList: JSON.parse(res.data),
          // avatar: avatar
        });
      }
    });
  },
  handleScroll: function (e) {
    this.setData({
      scrollTop: e.detail.scrollHeight
      // scrollHeight: e.detail.scrollHeight
    });
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
      data: JSON.stringify(this.data.messageList),
      success: function(res) {

      }
    });
    this.scrollAnimation();
  },
  scrollAnimation: function () {
    // var _scrollTop = 0;
    // var _top = _scrollTop;
    // var timer = setInterval(function () {
    //   this.setData({
    //     scrollTop: _top
    //   });
    //   _top += 1;
    //   if (_top > this.data.scrollHeight) {
    //     clearInterval(timer);
    //   }
    //   console.log(_top)
    // }.bind(this), 5);

    var _scrollTop = this.data.scrollTop + 100;
    setTimeout(function () {
      this.setData({
        scrollTop: _scrollTop
      });
    }.bind(this),0)
  }
})