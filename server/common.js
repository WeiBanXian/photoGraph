// var root = "https://photobazaar.camera360.com";
var root = "https://photobazaar-testing-dev.camera360.com";
var userCenterRoot = "https://i.camera360.com";
var userCenterRoot = "https://itest.camera360.com";
var wxapi = "https://api.weixin.qq.com";

var message = {
	alert:function (content) {
	  wx.showModal({
	    title: '提示',
	    content: content + '',
	    showCancel: false,
	    success: function(res) {
	      if (res.confirm) {
	        console.log('用户点击确定')
	      }
	    }
	  })
	}
}

module.exports = {
  root: root,
  userCenterRoot: userCenterRoot,
  wxapi: wxapi,
  message: message
}