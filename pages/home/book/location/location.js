Page({
  data:{
    // text:"这是一个页面"
     items: [{
            message: 'foo',
        },{
            message: 'bar'
        }]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // wx.getLocation({
    // type: 'wgs84',
    // success: function (res) {
    //     console.log(res)
    //     var url = 'http://restapi.amap.com/v3/geocode/regeo';
    //     wx.request({
    //     url: url,
    //     data: {
    //         key: "6bbcf8a9041e51985d60fb352723e62c",
    //         location: res.longitude + ',' + res.latitude,
    //         radius: 100,
    //         extensions: "all"
    //     },
    //     header:{
    //         "Content-Type":"application/json"
    //     },
    //     success: function(result) {
    //         console.log(result.data.regeocode.pois)
    //     }
    //     });
    // }
    // })
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
  handleGoToCity: function () {
    wx.navigateTo({url: "city/city"});
  },
  handleCancelSearch: function () {
    wx.navigateBack();
  },
  handleChoseLocation: function () {
    wx.navigateBack();
  }
})