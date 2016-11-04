var OrderServer = require("../../server/order.js").Order;

Page({
  data:{
    animationData: {}
  },
  onLoad: function(options) {
    
  },
  onReady: function() {
    
  },
  onShow:function(){
    wx.previewImage({
        current: './.https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg', // 当前显示图片的http链接
        urls: ['./.https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg', './.https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg', './.https://fe.c360dn.com/wxapps/photograph/images/home/banner0%403x.jpg'], // 需要预览的图片http链接列表
        success: function(res) {
        	console.log(res);
	      },
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
    
  },
})