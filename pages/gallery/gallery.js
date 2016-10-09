Page({
  data:{
    animationData: {}
  },
  onLoad: function(options) {
    
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow:function(){

    this._translateX = -0;

    var animation = wx.createAnimation({
      duration:1000,
      timingFunction:"ease",
    })

    this.setData({
      animationData: animation.translate(this._translateX).step({duration: 0}).export()
    })

    this.timer = setInterval(function(){
      
      if (this._translateX == -200) {
          this._translateX = 0;
          // this.setData({
          //   animationData: animation.translate(this._translateX).step({duration: 0}).export()
          // })
      } 
      else {
        this._translateX += -100;
      }
      
      this.setData({
        animationData:wx.createAnimation({
                        duration: 500,
                      }).translate(this._translateX).step().export()
      })

    }.bind(this), 3000)

  },
  onHide: function() {
    clearInterval(this.timer);
  },
  onUnload: function() {
    // Do something when page close.
  },
})