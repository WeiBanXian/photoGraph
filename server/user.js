var {root, userCenterRoot} = require("./common.js");
var md5 = require('../utils/md5.js')

var User = {
    // 初始化
    init:function () {
        this.setUserParams();
        this.setPublicParams();
        this.getWithPublicParams({hha: "hha"});
    },

    // 校验手机号码格式
    checkPhoneNum: function (loadingChange, callback) {
        var _phoneNum = this.getUserName();
        if (/^1\d{10}$/.test(_phoneNum)) {
            callback && callback();
        } else {
            console.log("用户名错误");
            loadingChange && loadingChange();
        }
    },

    // 校验邮箱格式
    checkEmail: function (callback) {
        var _email = this.getUserName();
        if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(_email)) {
            callback && callback();
        } else {
            console.log("错误");
        }
    },

    // 校验密码格式
    checkPassword: function (loadingChange, callback) {
        var _password = this.getPassword();
        var _length = _password.length;
        if (_length >= 6 && _length <= 20) {
            callback && callback();
        } else {
            console.log("密码错误");
            loadingChange && loadingChange();
        }
    },

    // 获取验证码
    getRegisterCode: function (callback) {
        // wx.request({
        //     url: userCenterRoot + '/api/v2/mobLoginForTest',
        //     data: data?data:{},
        //     medthod: 'post',
        //     header:{
        //         "Content-Type":"application/json"
        //     },
        //     success: function(res) {
        //         var data = res.data;
        //         if (res.data.status == "200") {
                    callback && callback();
        //         }
        //     }
        // });
    },

    // 注册
    register: function (callback) {
        // wx.request({
        //     url: userCenterRoot + '/api/v2/mobLoginForTest',
        //     data: data?data:{},
        //     medthod: 'post',
        //     header:{
        //         "Content-Type":"application/json"
        //     },
        //     success: function(res) {
        //         var data = res.data;
        //         if (res.data.status == "200") {
                    callback && callback();
        //         }
        //     }
        // });
    },

    // 登录
    login: function (callback) {
        var data = {};
        var isMobile = true;

        if (isMobile) {
            data = {
                mobile: this.getUserName(),
                password: md5.MD5(md5.MD5(this.getPassword())),
                appkey: "f6cb3d93e7ac1146"
            };
        }
        wx.request({
            url: userCenterRoot + '/api/v2/mobLoginForTest',
            data: data?data:{},
            medthod: 'post',
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
                var data = res.data;
                if (res.data.status == "200") {
                    this.UserParams = data.data;
                    // avatar: "https://phototask.c360dn.com/FgLLcrZnb5GdQ9ND8SEC6JqJFYZI"
                    // backgroundPic: ""
                    // birthday: ""
                    // cc: 86
                    // certificated: 2
                    // city: "1"
                    // country: "1"
                    // desc: ""
                    // description: ""
                    // email: ""
                    // firstLogin: false
                    // forgetPass: 0
                    // gender: ""
                    // language: "zh-Hans"
                    // lastLoginTime: 1476497959
                    // mobile: "18583269107"
                    // nickname: "丰哦吼吼吼"
                    // province: "51"
                    // regDateTime: 1462864073
                    // setPass: 1
                    // third: ""
                    // token: "VGkxQjhXNTZiTXprckt6NkVXOEsxcmwvYlFRenE3cDZGbkgyYndTSzNhMGU3Yll1Q2tCeW92WG5NMzFNQXNaZ2JkYlpOdUdOT1ZZRzhNOG96akN0UUhLNUkwQ1BFc0xsYUZHSDN3Y0tTUzBGYVBMUzNDaCtpQWF3T2JhT2pkVHM="
                    // tokenEnd: 1479090029
                    // tokenExpire: 2592000
                    // userId: "06943d573188c9317ee6e176"
                    callback && callback(data);
                }
            }.bind(this)
        });
    },
    setUserName: function (_userName) {
    	this._userName = _userName;
    },
    getUserName: function () {
    	return this._userName;
    },
    setPassword: function (_password) {
    	this._password = _password;
    },
    getPassword: function () {
    	return this._password;
    },
    setRegisterCode: function (_registerCode) {
    	this._registerCode = _registerCode;
    },
    getRegisterCode: function () {
    	return this._registerCode;
    },
    setUserParams: function () {
        this.UserParams = {
            avatar: ''
        };
    },
    getUserParams: function () {
        return this.UserParams;
    },

    // 设置公共参数
    setPublicParams: function() {
        this.publicParams = {
            appKey: "f6cb3d93e7ac1146",
            appname: "想拍就拍",
            appVersion: "1.1.8",
            systemVersion: "10.0",
            platform: "iphone",
            device: "Unknown",
            deviceId: "4A27FABF-D501-4AA8-BF4F-BA844D742BF2",
            certType: "production",
            locale: "zh-Hans-CN",
            channel: "appstore"
        };
    },
    
    getWithPublicParams: function(data) {
        // console.log("getWithPublicParams")
        // for (var key in this.publicParams) {
        //     console.log(key)
        // }
    },


}

module.exports = {
    User: User
}