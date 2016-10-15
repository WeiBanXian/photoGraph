Page({
  data:{
    // text:"这是一个页面"
    page: 1,
    scrollTop: 100
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
    // setInterval(function () {
    //   var _page = this.data.page + 1;
    //   this.setData({
    //     page: _page
    //   })
    // }.bind(this),3000)
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
  upper: function () {
    console.log("upperupperupperupperupper")
  },
  lower: function () {
    console.log("lowerlowerlowerlowerlower")
  },
  handleChangeTab: function (event) {
      this.setData({
        page: event.target.dataset.page
      })
  },
  handlerGoToStreet:function (e) {
      wx.navigateTo({url: "../home/enjoy/streetEnjoy"})
    // console.log(e.target.dataset)
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
  }
})