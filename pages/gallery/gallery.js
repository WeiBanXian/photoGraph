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
    wx.previewImage({
        current: './../../../resource/images/home/banner0@3x.jpg', // 当前显示图片的http链接
        urls: ['./../../../resource/images/home/banner0@3x.jpg', './../../../resource/images/home/banner0@3x.jpg', './../../../resource/images/home/banner0@3x.jpg'], // 需要预览的图片http链接列表
        success: function(res) {
        	console.log(res);
	      },
　　　　  //也根本不走
　　　　 fail: function() {
　　　　    console.log('fail')
　　　　 },
	      complete:function(){
	        console.log('complete')
	      }
    });
  },
  onHide: function() {
    clearInterval(this.timer);
  },
  onUnload: function() {
    // Do something when page close.
  },
})