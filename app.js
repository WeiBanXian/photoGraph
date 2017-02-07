var UserServer = require("server/user.js").User;
var OrderServer = require("server/order.js").Order;
var GlobalServer = require("server/global.js").Global;

var {DateManager} = require('utils/dateManage.js');
var {message} = require('server/common.js');

App({
    onLaunch: function () {
        var _self = this;
        wx.getNetworkType({
            success: function(res) {
                var networkType = res.networkType;
                if (networkType == "fail") {
                    wx.showModal({
                        title: '提示',
                        content: '当前网络不可用',
                        success: function(res) {
                            if (res.confirm) {
                                // console.log('用户点击确定')
                            }
                        }
                    })
                }
            }
        })
        GlobalServer.startApp(function (callback) {
            DateManager.init();
            var code = '';
            var accessToken = '';
            wx.login({
                success: function(r) {
                    UserServer.setCode(r.code);
                    wx.getUserInfo({
                        success: function (res) {
                            _self.globalData.userInfo = res.userInfo;
                            UserServer.setIv(res.iv);
                            UserServer.setEncryptedData(res.encryptedData);
                            UserServer.openIdRequest(function () {
                                UserServer.accessTokenRequest(function () {
                                    UserServer.exchangeUid(function () {
                                        OrderServer.checkCoupon(function (result) {
                                            _self.globalData.isLogin = true;
                                            if (result.data.data.list.length > 0) {
                                                _self.globalData.couponHidden = false;
                                            }
                                            OrderServer.couponHiddenListener();
                                            callback && callback();
                                        });
                                    });
                                });
                            });
                        }
                    })
                }
            });
        });
    },
    getUserInfo:function(cb){
    },
    globalData:{
        couponHidden: true,
        isLogin: false
    }
})