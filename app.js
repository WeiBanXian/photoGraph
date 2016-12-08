var UserServer = require("server/user.js").User;
var OrderServer = require("server/order.js").Order;
var GlobalServer = require("server/global.js").Global;

var {DateManager} = require('utils/dateManage.js');
var {message} = require('server/common.js');

App({
    onLaunch: function () {
        DateManager.init();
        var _self = this;
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
                                        if (result.data.data.list.length > 0) {
                                            _self.globalData.couponHidden = false;
                                        }
                                        OrderServer.couponHiddenListener();
                                    });
                                });
                            });
                        });
                    }
                })
            }
        });
    },
    getUserInfo:function(cb){
    },
    globalData:{
        couponHidden: true
    }
})