Page({
  data:{
    // text:"这是一个页面"
    animationData: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var animation = wx.createAnimation({
        duration: 5000,
        timingFunction: 'ease',
    });

    animation.rotate(180).step();

    // setInterval(function() {
      this.setData({
        animationData:animation.export()
      })
    // }.bind(this), 1000);

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})