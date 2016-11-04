var {root, userCenterRoot} = require("./common.js");
var md5 = require('../utils/md5.js')

// 注册号码
// 11000000907
// 密码
// 123456

var User = {
    // 初始化
    init:function (callback) {
        var _self = this;
        this.setUserParams();
        this.setPublicParams();
        wx.getStorage({
            key: 'loginData',
            success: function(res) {
                if (res.data.mobile) {
                    _self.setMobile(res.data.mobile);
                }
                if (res.data.password) {
                    _self.setPassword(res.data.password);
                }
                callback && callback(res.data);
            }
        })
    },

    // 校验手机号码格式
    checkPhoneNum: function () {
        var _phoneNum = this.getMobile();
        if (/^1\d{10}$/.test(_phoneNum)) {
            return true;
        } else {
            console.log("用户名错误");
            return false;
        }
    },

    // 校验邮箱格式
    checkEmail: function () {
        var _email = this.getUserName();
        if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(_email)) {
            return true;
        } else {
            console.log("邮箱格式错误");
            return false;
        }
    },

    // 校验密码格式
    checkPassword: function () {
        var _password = this.getPassword();
        var _length = _password.length;
        if (_length >= 6 && _length <= 20) {
            return true;
        } else {
            console.log("密码错误");
            return false;
        }
    },

    // 获取验证码
    getRequestRegisterCode: function (successCallback, failCallback) {
        if (!this.checkPhoneNum()) {
            failCallback && failCallback("用户名错误");
            return false;
        }
        if (!this.checkPassword()) {
            failCallback && failCallback("密码错误");
            return false;
        }
        // var url = root + '/manage/index/sendCode';
        var url = root + '/photoBazaar/sPro/sendCode';
        var data = {
            mobile: this.getMobile(),
            password: this.getPassword()
        };
        wx.request({
            url: url,
            data: data?data:{},
            medthod: 'post',
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
                var data = res.data;
                successCallback && successCallback(res);
            }
        });
    },

    // 注册
    register: function (successCallback, failCallback) {
        if (!this.checkPhoneNum()) {
            failCallback && failCallback("用户名错误");
            return false;
        }
        if (this.getRegisterCode() == '' || this.getRegisterCode() == 'undefined') {
            failCallback && failCallback("验证码错误");
            return false;
        }
        // var url = userCenterRoot + '/api/v2/mobLoginForTest',
        var url = root + '/photoBazaar/sPro/register';
        var data = {
            mobile: this.getMobile(),
            vcode: this.getRegisterCode()
        };
        wx.request({
            url: url,
            data: data?data:{},
            medthod: 'post',
            header:{
                "Content-Type":"application/json"
            },
            success: function(res) {
                var data = res.data;
                if (res.data.status == "200") {
                    this.UserParams = data.data;
                    this.setToken(data.data.token);
                    this.setUserId(data.data.userId);
                    this.setPublicParams();
                }
                var loginData = {
                    mobile: this.getMobile(),
                    password: this.getPassword()
                };
                wx.setStorage({"loginData": loginData});
                successCallback && successCallback(res);
            }.bind(this)
        });
    },

    // 登录
    login: function (successCallback, failCallback) {
        if (!this.checkPhoneNum()) {
            failCallback && failCallback("用户名错误");
            return false;
        }
        if (!this.checkPassword()) {
            failCallback && failCallback("密码错误");
            return false;
        }

        var data = {};
        var isMobile = true;

        if (isMobile) {
            data = {
                mobile: this.getMobile(),
                password: this.getPassword(),
                // password: md5.MD5(md5.MD5(this.getPassword())),
                appkey: "f6cb3d93e7ac1146"
            };
        }
        wx.request({
            url: root + '/photoBazaar/sPro/login',
            // url: userCenterRoot + '/api/v2/mobLoginForTest',
            // url: root + '/manage/index/photoGrapherLogin',
            data: data,
            medthod: 'post',
            header:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            success: function(res) {
                var data = res.data;
                if (res.data.status == "200") {
                    this.UserParams = data.data;
                    // this.setToken(data.data.utoken);
                    // this.setUserId(data.data.pgid);
                    this.setToken(data.data.token);
                    this.setUserId(data.data.userId);
                    this.setPublicParams();
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
                }
                var loginData = {
                    mobile: this.getMobile(),
                    password: this.getPassword()
                };
                wx.setStorage({key: "loginData", data: loginData});
                successCallback && successCallback(data);
            }.bind(this)
        });
    },
    json2Form: function (json) {  
        var str = [];  
        for(var p in json){  
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));  
        }  
        return str.join("&");  
    },
    // 用户名
    setUserName: function (_userName) {
    	this._userName = _userName;
    },
    getUserName: function () {
    	return this._userName;
    },
    // 手机号
    setMobile: function (_mobile) {
    	this._mobile = _mobile;
    },
    getMobile: function () {
    	return this._mobile;
    },
    // 密码
    setPassword: function (_password) {
    	this._password = _password;
    },
    getPassword: function () {
    	return this._password;
    },
    // 性别
    setGender: function (_gender) {
    	this._gender = _gender;
    },
    getGender: function () {
    	return this._gender;
    },
    // 头像
    setAvatar: function (_avatar) {
    	this._avatar = _avatar;
    },
    getAvatar: function () {
    	return this._avatar;
    },
    // 注册验证码
    setRegisterCode: function (_registerCode) {
    	this._registerCode = _registerCode;
    },
    getRegisterCode: function () {
    	return this._registerCode;
    },
    // 用户信息
    setUserParams: function () {
        this.UserParams = {
            avatar: ''
        };
    },
    getUserParams: function () {
        return this.UserParams;
    },
    // token
    setToken: function (_token) {
        this._token = _token;
    },
    getToken: function () {
        return this._token;
    },
    // userId
    setUserId: function (_userId) {
        this._userId = _userId;
    },
    getUserId: function () {
        return this._userId;
    },
    // 设置公共参数
    setPublicParams: function() {

        // var data = {
            // mnc: "01",
            // device: "Unknown",
            // deviceId: "4A27FABF-D501-4AA8-BF4F-BA844D742BF2",
            // icc: "cn",
            // channel: "appstore",
            // appversion: "1.1.8",
            // appVersion: "1.1.8",
            // locale: "zh-Hans-CN",
            // sp: "0",
            // appKey: "f6cb3d93e7ac1146",
            // cid: "",
            // appname: "想拍就拍",
            // token: "eElOUUVuSGdzMC9UTSswaTk5R2NlWUJIVUlyUnRZL1pIOTl5VWY0REJyQTB6UklaNEhaajd3NDgvb3JnOVlYbg==",
            // platform: "iphone",
            // timestamp: "1476761678.339511",
            // certType: "production",
            // appName: "想拍就拍",
            // cnet: "wifi",
            // systemVersion: "10.0",
            // appkey: "f6cb3d93e7ac1146",
            // userId: "03be0558071a791624e21e83",
        // }
        this.publicParams = {
            mnc: "01",
            device: "Unknown",
            deviceId: "4A27FABF-D501-4AA8-BF4F-BA844D742BF2",
            icc: "cn",
            channel: "appstore",
            appversion: "1.1.8",
            appVersion: "1.1.8",
            locale: "zh-Hans-CN",
            sp: "0",
            appKey: "f6cb3d93e7ac1146",
            cid: "",
            appname: "想拍就拍",
            platform: "iphone",
            timestamp: "1476863455.339511",
            certType: "production",
            appName: "想拍就拍",
            cnet: "wifi",
            systemVersion: "10.0",
            appkey: "f6cb3d93e7ac1146",
            token: this.getToken(),
            userId: this.getUserId()
        };
    },
    
    getDataWithPublicParams: function(data) {
        var _publicParams = this.publicParams;
        for (var key in this.publicParams) {
            data[key] = _publicParams[key];
        }
        return data;
    },

    // 获取优惠券列表
    getCouponList: function (callback) {
        // /photoBazaar/order/couponList
        var url = root + "/photoBazaar/order/couponList";
        var data = {
            
        };
        this.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                // if (result.statusCode == 200) {}
                callback && callback(result)
            }.bind(this)
        });
    },

    // 更新用户信息
    updateInfo: function (data, callback) { 
        // /photoBazaar/user/updateInfo
        var url = root + "/photoBazaar/user/updateInfo";
        var data = data;
        this.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                // if (result.statusCode == 200) {}
                callback && callback(result)
            }.bind(this)
        });
    },

    // 退出登录
    loginOut: function (callback) {
        // /photoBazaar/user/loginOut
        var url = root + "/photoBazaar/user/loginOut";
        var data = {};
        this.getDataWithPublicParams(data);
        wx.request({
            url: url,
            data: data?data:{},
            header:{
                "Content-Type":"application/json"
            },
            success: function(result) {
                // if (result.statusCode == 200) {}
                wx.clearStorage();
                callback && callback(result)
            }.bind(this)
        });
    }
   
}

module.exports = {
    User: User
}